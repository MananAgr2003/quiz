const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var ques1Ans = ["option1"];
var loginUserName = "";
var slArr = [];
var slArr1 = [];
var sortedsl = [];
var userAns = [];
const app = express();
var score = 0;

var sl = "";

mongoose.connect("mongodb+srv://mananmyphotos2:12312312@quizapp.fi0ycwt.mongodb.net/quiz");

const questionOptionSchema = mongoose.Schema({
  ques_id: Number,
  op_id: String,
  text: String,
  fr: String,
  sl: String,
  sr: String,
  recommendation: {
    people: String,
    process: String,
    technology: String,
  },
});

const optionSchema = mongoose.Schema({
  question: Number,
  options: [questionOptionSchema],
 
  
});

const Option = mongoose.model("Option", optionSchema);

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  company: String,
  role: String,
  place: String,
  tsl: String,
  predicted_sl: String,
  loginId: String,
  loginPass: String,
  sr_score:[Number],
  options: [optionSchema],
  recommendations: {
    people: [String],
    process: [String],
    technology: [String],
  },
});

const questionSchema = mongoose.Schema({
  id: Number,
  ques_image: String,
  is_multiple: Boolean,
  sl_level: String,
  allowed_options: String,
  options: [questionOptionSchema],
});

const User = mongoose.model("User", userSchema);
const Question = mongoose.model("Question", questionSchema);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index0");
});

app.get("/intro", function (req, res) {
  res.render("index1");
});

app.get("/intro1", function (req, res) {
  res.render("index3");
});
app.get("/intro2", function (req, res) {
  res.render("index4");
});
app.get("/intro3", function (req, res) {
  res.render("index5");
});
app.get("/intro4", function (req, res) {
  res.render("index6");
});
app.get("/intro5", function (req, res) {
  res.render("index7");
});
app.get("/preintro1", function (req, res) {
  res.render("index11");
});
app.get("/preintrores", function (req, res) {
  // fetch predicted_sl of current user
  User.findOne({ loginId: loginUserName }, function (err, foundUser) {
    if (foundUser) {
      res.render("preintrores", { predicted_sl: foundUser.predicted_sl });
    }
  });
});
app.get("/register", function (req, res) {
  res.render("newAc");
});
app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/cngPw", function (req, res) {
  res.render("cngPw");
});

app.get("/ques", function (req, res) {
  const quesId = req.query.id;
  Question.findOne({ id: quesId }, function (err, foundQues) {
    if (foundQues) {
      if (foundQues.is_multiple == true) {
        // skip  to next question
        // res.redirect("/ques?id=" + (+quesId + 1));
        res.render("question", { ques: foundQues, is_multiple: true, allowed_options: foundQues.allowed_options });
      } else {
        res.render("question", { ques: foundQues, is_multiple: false, allowed_options: foundQues.allowed_options });
      }
    } else {
      res.send("ERROR:No question found in the database.");
    }
  });
});

app.get("/quesFinalResult", function (req, res) {
  // Create a map of FR with an array of SL
  const fr_sl_map = {
    FR1: [],
    FR2: [],
    FR3: [],
    FR4: [],
    FR5: [],
    FR6: [],
    FR7: [],
  };
  
  // Find the user by loginId
  User.findOne({ loginId: loginUserName }, function (err, foundUser) {
    if (foundUser) {
      // Iterate through options to populate the fr_sl_map
      foundUser.options.forEach(function (option) {
        option.options.forEach(function (op) {
          fr_sl_map[op.fr].push(op.sl);
        });
      });
      
      // Sort each array of SL mapped with a particular FR
      var sl_achieved = [];
      for (let key in fr_sl_map) {
        fr_sl_map[key].sort();
        sl_achieved.push(fr_sl_map[key][0]);
      }
      sl_achieved.sort();
      // Fetch recommendations from the user object
      const recommendations = foundUser.recommendations;
      // Pass the fr_sl_map and recommendations to the template
      res.render("finalResult", {
        fr_sl_map: fr_sl_map,
        tsl: foundUser.tsl,
        recommendation: recommendations,
        sr_score: foundUser.sr_score,
        sl_achieved: sl_achieved[0]
      });
    }
  });
});


// Register code
app.post("/register", function (req, res) {
  if (
    req.body.name == "" ||
    req.body.email == "" ||
    req.body.company == "" ||
    req.body.role == "" ||
    req.body.place == ""
  ) {
    res.redirect("/register");
  } else {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      role: req.body.role,
      place: req.body.place,
      loginId: req.body.name,
    });

    user.save();

    res.redirect("/cngPw");
  }
});

// Change password
app.post("/cngPw", (req, res) => {
  if (req.body.password == req.body.repass) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      User.findOneAndUpdate(
        { loginId: req.body.name },
        { loginPass: hash },
        function (err, fUser) {
          if (fUser == null) {
            res.redirect("/cngPw");
          }

          if (fUser != null) {
            res.redirect("/login");
          }
        }
      );
    });
  }

  if (req.body.password != req.body.repass) {
    res.redirect("/cngPw");
  }
});

// Login


app.post("/login", function (req, res) {
  loginUserName = req.body.userId;
  User.findOne({ loginId: req.body.userId }, function (err, foundUser) {
    if (foundUser) {
      bcrypt.compare(
        req.body.userPass,
        foundUser.loginPass,
        function (err, result) {
          if (result == true) {
            // User is found and password is correct
            // Check if recommendations.people is empty, and if so, push default values
            if (foundUser.recommendations.people.length === 0) {
              foundUser.recommendations.people = "Conduct perioding training for cybersecurity awareness";
              foundUser.recommendations.process = "Develop a Cyber Security Management Program (CSMS) to proactively identify, assess, and mitigate security risks";
              foundUser.recommendations.technology = "Implement strong access controls to prevent unauthorized access";
              foundUser.sr_score = [0,0,0,0,0,0,0];
              foundUser.save(function (err) {
                if (err) {
                  console.error("Error saving user:", err);
                }
                // Redirect to the desired page after login
                res.redirect("/intro1");
              });
            } else {
              // Redirect to the desired page after login
              res.redirect("/intro1");
            }
          } else {
            // Password is incorrect, redirect to login
            res.redirect("/login");
          }
        }
      );
    } else {
      // User not found, redirect to login
      res.redirect("/login");
    }
  });
});

app.post("/ques", function (req, res) {
  const quesId = req.query.id;
  const user_ans = [];
  Question.findOne({ id: quesId }, function (err, foundQues) {
    if (foundQues) {
      if (req.body.option1 == "green") {
        user_ans.push(foundQues.options[0]);
      }
      if (req.body.option2 == "green") {
        user_ans.push(foundQues.options[1]);
      }
      if (req.body.option3 == "green") {
        user_ans.push(foundQues.options[2]);
      }
      if (req.body.option4 == "green") {
        user_ans.push(foundQues.options[3]);
      }
      if (req.body.option5 == "green") {
        user_ans.push(foundQues.options[4]);
      }
      if (req.body.option6 == "green") {
        user_ans.push(foundQues.options[5]);
      }
      //find max sl value from user_ans array
      let max_sl = "SL0";
      for (let i = 0; i < user_ans.length; i++) {
        if (user_ans[i].sl > max_sl) {
          max_sl = user_ans[i].sl;
        }
      }
      //calculating score from sr values of user_ans array
      let sr_score = 0;
      for (let i = 0; i < user_ans.length; i++) {
        sr_score += +user_ans[i].sr;
      }
      // maping FR1 to 0, FR2 to 1, FR3 to 2, FR4 to 3, FR5 to 4, FR6 to 5, FR7 to 6
      const fr_map = {
        FR1: 0,
        FR2: 1,
        FR3: 2,
        FR4: 3,
        FR5: 4,
        FR6: 5,
        FR7: 6,
      };

      //fetch process, people, technology from options of ques
      var process = [];
      var people = [];
      var technology = [];
      user_ans.forEach(function (ans) {
        if(ans.recommendation.process.length > 0)process.push(ans.recommendation.process);
        if(ans.recommendation.people.length > 0)people.push(ans.recommendation.people);
        if(ans.recommendation.technology.length > 0)technology.push(ans.recommendation.technology);
      });
      //push these value into current user
      User.findOne({ loginId: loginUserName }, function (err, foundUser) {
        if (foundUser) {
          process.forEach(function (p) {
            foundUser.recommendations.process.push(p);
          });
          people.forEach(function (p) {
            foundUser.recommendations.people.push(p);
          });
          technology.forEach(function (p) {
            foundUser.recommendations.technology.push(p);
          });
          foundUser.sr_score[fr_map[foundQues.options[0].fr]] += sr_score;
          foundUser.options.push({
            question: quesId,
            options: user_ans,
          });
          foundUser.save();
        }
      });
      if(+quesId == 7 && req.body.option4 == "green"){
        // if option 4 of ques 7 is selected, skip ques 8 & 9
        res.redirect("/ques?id=10");
      }
      else if (+quesId == 39) {
        res.redirect("/quesFinalResult");
      } else if (+quesId == 33) {
        res.redirect("/ques?id=35");
      } else if (+quesId == 102) {
        // fetch options of ques with id 100,101,102
        User.findOne({ loginId: loginUserName }, function (err, foundUser) {
          const sl_values = [];
          foundUser.options.forEach(function (option) {
            if (
              option.question == 100 ||
              option.question == 101 ||
              option.question == 102
            ) {
              option.options.forEach(function (op) {
                sl_values.push(op.sl);
              });
            }
          });
          sl_values.push(user_ans[0].sl);
          sl_values.sort();
          console.log(sl_values);
          //save last element of sl_values to predicted_sl of current user
          User.findOneAndUpdate(
            { loginId: loginUserName },
            { predicted_sl: sl_values[sl_values.length - 1] },
            function (err, fUser) {
              res.redirect("/preintrores");
            }
          );
        });
      } else {
        // console.log("max_sl", max_sl, "quesId", +quesId+1);
        res.redirect(`/ques?id=${+quesId + 1}`);
        // res.render("questionSL.ejs", { max_sl: max_sl, ques: +quesId+1 });
      }
    }
  });

  app.post("/preintrores", function (req, res) {
    if (req.body.option1 == "green") {
      const usr_tsl = req.body.predicted_sl;
      User.findOneAndUpdate(
        { loginId: loginUserName },
        { tsl: usr_tsl },
        function (err, fUser) {
          res.redirect("/intro5");
        }
      );
    }
    if (req.body.option3 == "green") {
      var usr_tsl = "";
      if (req.body.SL1 == "green") {
        usr_tsl = "SL1";
      }
      if (req.body.SL2 == "green") {
        usr_tsl = "SL2";
      }
      if (req.body.SL3 == "green") {
        usr_tsl = "SL3";
      }
      if (req.body.SL4 == "green") {
        usr_tsl = "SL4";
      }
      User.findOneAndUpdate(
        { loginId: loginUserName },
        { tsl: usr_tsl },
        function (err, fUser) {
          res.redirect("/intro5");
        }
      );
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 80;
}

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
