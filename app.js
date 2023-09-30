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

mongoose.connect("mongodb://0.0.0.0:27017/quiz");

const questionOptionSchema = mongoose.Schema({
  ques_id: Number,
  op_id: String,
  text: String,
  fr: String,
  sl: String,
  sr: String,
  recommendations: {
    people: [String],
    process: [String],
    technology: [String],
  },
});

const optionSchema = mongoose.Schema({
  question: Number,
  // sl: String,
  // fr: String,
  // sr: String,
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
  options: [optionSchema],
  recommendations: {
    people: [String],
    process: [String],
    technology: [String],
  },
  // options: [questionOptionSchema]
});

const questionSchema = mongoose.Schema({
  id: Number,
  ques_image: String,
  is_multiple: Boolean,
  sl_level: String,
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
        res.redirect("/ques?id=" + (+quesId + 1));
      } else {
        res.render("question", { ques: foundQues });
      }
    } else {
      res.send("ERROR:No question found in the database.");
    }
  });
});

// app.get("/ques1", function (req, res) {
//   userAns = [];
//   res.render("index8");
// });
// app.get("/ques2", function (req, res) {
//   userAns = [];
//   res.render("ques2");
// });
// app.get("/ques3", function (req, res) {
//   userAns = [];
//   res.render("ques3");
// });
// app.get("/ques4", function (req, res) {
//   userAns = [];
//   res.render("ques4");
// });
// app.get("/ques5", function (req, res) {
//   userAns = [];
//   res.render("ques5");
// });
// app.get("/ques6", function (req, res) {
//   userAns = [];
//   res.render("ques6");
// });
// app.get("/ques7", function (req, res) {
//   userAns = [];
//   res.render("ques7");
// });
// app.get("/ques8", function (req, res) {
//   userAns = [];
//   res.render("ques8");
// });
// app.get("/ques9", function (req, res) {
//   userAns = [];
//   res.render("ques9");
// });
// app.get("/ques10", function (req, res) {
//   userAns = [];
//   res.render("ques10");
// });
// app.get("/ques11", function (req, res) {
//   userAns = [];
//   res.render("ques11");
// });
// app.get("/ques12", function (req, res) {
//   userAns = [];
//   res.render("ques12");
// });
// app.get("/ques13", function (req, res) {
//   userAns = [];
//   res.render("ques13");
// });

// app.get("/ques14", function (req, res) {
//   userAns = [];
//   res.render("ques14");
// });

// app.get("/ques15", function (req, res) {
//   userAns = [];
//   res.render("ques15");
// });

// app.get("/ques16", function (req, res) {
//   userAns = [];
//   res.render("ques16");
// });

// app.get("/ques17", function (req, res) {
//   userAns = [];
//   res.render("ques17");
// });

// app.get("/ques18", function (req, res) {
//   userAns = [];
//   res.render("ques18");
// });

// app.get("/ques19", function (req, res) {
//   userAns = [];
//   res.render("ques19");
// });

// app.get("/ques20", function (req, res) {
//   userAns = [];
//   res.render("ques20");
// });

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
      for (let key in fr_sl_map) {
        fr_sl_map[key].sort();
      }
      
      // Fetch recommendations from the user object
      const recommendations = foundUser.recommendations;
      
      // Pass the fr_sl_map and recommendations to the template
      res.render("finalResult", {
        fr_sl_map: fr_sl_map,
        tsl: foundUser.tsl,
        recommendations: recommendations,
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
              foundUser.save(function (err) {
                if (err) {
                  console.error("Error saving user:", err);
                }
                // Redirect to the desired page after login
                res.redirect("/preintro1");
              });
            } else {
              // Redirect to the desired page after login
              res.redirect("/preintro1");
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
      // push this data into current user
      User.findOne({ loginId: loginUserName }, function (err, foundUser) {
        if (foundUser) {
          foundUser.options.push({
            question: quesId,
            options: user_ans,
          });
          foundUser.save();
        }
      });
      if (+quesId == 39) {
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
          res.redirect("/intro1");
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
          res.redirect("/intro1");
        }
      );
    }
  });
  // if (req.body.optifoundQues1 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";  // if (req.body.option1 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }

  //   userAns.push("option1");
  // }
  // if (req.body.option2 == "green") {
  //   if ("SL2" > sl) {
  //     sl = "SL2";
  //   }
  //   userAns.push("option2");
  // }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }
  //   }

  //   userAns.push("option1");
  // }
  // if (req.body.option2 == "green") {
  //   if ("SL2" > sl) {
  //     sl = "SL2";
  //   }
  //   userAns.push("option2");
  // }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }
  // if (req.body.option4 == "green") {
  //   if ("SL4" > sl) {
  //     sl = "SL4";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option5");
  // }

  // slArr.push(sl);
  // slArr1.push(sl);

  // userAns.sort();

  // const userOpt = new Option({
  //   question: 1,
  //   sl: sl,
  //   opt: userAns,
  // });

  // res.render("questionSL.ejs", { sl: sl, ques: 2 });

  // sl = "";

  // User.findOne(
  //   { loginId: loginUserName },

  //   function (err, foundUser) {
  //     if (!err) {
  //       foundUser.options.push(userOpt);
  //       foundUser.save();
  //     }
  //   }
  // );
});

app.post("/ques2", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }
  // if (req.body.option4 == "green") {
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 2,
    sl: sl,
    opt: userAns,
  });
  res.render("questionSL.ejs", { sl: sl, ques: 3 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

// Question 3 post
app.post("/ques3", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }
  // if (req.body.option4 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 3,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 4 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//question 4 post
app.post("/ques4", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }
  if (req.body.option4 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option4");
  }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 4,
    sl: sl,
    opt: userAns,
  });
  res.render("questionSL.ejs", { sl: sl, ques: 5 });

  sl = "";
  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//question 5 post
app.post("/ques5", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option3");
  }
  // if (req.body.option4 == "green") {
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  sortedsl = slArr1.sort();

  userAns.sort();

  const userOpt = new Option({
    question: 5,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 6 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});
app.post("/ques6", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }
  if (req.body.option4 == "green") {
    if ("SL4" > sl) {
      sl = "SL4";
    }
    userAns.push("option4");
  }
  if (req.body.option5 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option5");
  }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 6,
    sl: sl,
    opt: userAns,
  });
  res.render("questionSL.ejs", { sl: sl, ques: 7 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

// Question 7 post
app.post("/ques7", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }
  // if (req.body.option4 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }

  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 7,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 8 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

// Ques 8 post
app.post("/ques8", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL2" > sl) {
      sl = "SL2";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }
  // if (req.body.option4 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 8,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 9 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

// ques 9 post
app.post("/ques9", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL1" > sl) {
  //     sl = "SL1";
  //   }
  //   userAns.push("option3");
  // }
  // if (req.body.option4 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 9,
    sl: sl,
    opt: userAns,
  });
  res.render("questionSL.ejs", { sl: sl, ques: 10 });

  sl = "";
  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

// ques 10 post
app.post("/ques10", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL2" > sl) {
      sl = "SL2";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL4" > sl) {
  //     sl = "SL4";
  //   }
  //   userAns.push("option3");
  // }
  // if (req.body.option4 == "green") {
  //   if ("SL1" > sl) {
  //     sl = "SL1";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 10,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 11 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 11 post
app.post("/ques11", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL4" > sl) {
      sl = "SL4";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option3");
  }
  // if (req.body.option4 == "green") {
  //   if ("SL1" > sl) {
  //     sl = "SL1";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 11,
    sl: sl,
    opt: userAns,
  });
  res.render("questionSL.ejs", { sl: sl, ques: 12 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 12 post
app.post("/ques12", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }
  // if (req.body.option4 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 12,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 13 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 13 post
app.post("/ques13", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL4" > sl) {
      sl = "SL4";
    }

    userAns.push("option3");
  }
  // if (req.body.option4 == "green") {
  //   userAns.push("option4");
  // }
  // if (req.body.option5 == "green") {
  //   userAns.push("option5");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  sortedsl = slArr1.sort();

  userAns.sort();

  const userOpt = new Option({
    question: 13,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 14 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 14 post
app.post("/ques14", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 14,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 15 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 15 post
app.post("/ques15", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option3");
  }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 15,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 16 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 16 post
app.post("/ques16", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL2" > sl) {
      sl = "SL2";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option3");
  }
  if (req.body.option4 == "green") {
    if ("SL4" > sl) {
      sl = "SL4";
    }
    userAns.push("option4");
  }
  if (req.body.option5 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option5");
  }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 16,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 17 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 17 post
app.post("/ques17", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL3" > sl) {
      sl = "SL3";
    }
    userAns.push("option2");
  }
  if (req.body.option3 == "green") {
    if ("SL4" > sl) {
      sl = "SL4";
    }
    userAns.push("option3");
  }
  if (req.body.option4 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option4");
  }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 17,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 18 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 18 post
app.post("/ques18", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 18,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 19 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 19 post
app.post("/ques19", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL1" > sl) {
      sl = "SL1";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 19,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: 20 });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

//ques 20 post
app.post("/ques20", function (req, res) {
  if (req.body.option1 == "green") {
    if ("SL0" > sl) {
      sl = "SL0";
    }
    userAns.push("option1");
  }
  if (req.body.option2 == "green") {
    if ("SL2" > sl) {
      sl = "SL2";
    }
    userAns.push("option2");
  }
  // if (req.body.option3 == "green") {
  //   if ("SL0" > sl) {
  //     sl = "SL0";
  //   }
  //   userAns.push("option3");
  // }

  slArr.push(sl);
  slArr1.push(sl);

  userAns.sort();

  const userOpt = new Option({
    question: 20,
    sl: sl,
    opt: userAns,
  });

  res.render("questionSL.ejs", { sl: sl, ques: "finalResult" });

  sl = "";

  User.findOne(
    { loginId: loginUserName },

    function (err, foundUser) {
      if (!err) {
        foundUser.options.push(userOpt);
        foundUser.save();
      }
    }
  );

  if (JSON.stringify(userAns) == JSON.stringify(ques1Ans)) {
    score++;
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
