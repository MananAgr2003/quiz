function resetAllOptions() {
  const optionElements = document.querySelectorAll(".opt");
  optionElements.forEach((opt) => {
    const img = opt.querySelector("img");
    const option = opt.querySelector('input[type="hidden"]');
    
    if (img == "img/Group4069.png") {
      img.setAttribute("src", "img/Rectangle23.png");
      option.setAttribute("value", "grey");
    } 
    if (img.getAttribute('src') == "img/preintroboxgreen.png") {
      img.setAttribute("src", "img/preintrobox.png");
      option.setAttribute("value", "grey");
    }
  });
}

// refactoring all green1, green2, etc function
function green(id) {
  const myOption = document.getElementById("option" + id);
  const optionValue = myOption.getAttribute("value");
  const myimg = document.getElementById(`opt${id}-img`);
  const img = myimg.getAttribute("src");
  resetAllOptions();

  if (img == "img/Group4069.png") {
    myimg.setAttribute("src", "img/Rectangle23.png");
    myOption.setAttribute("value", "grey");
  } else {
    myimg.setAttribute("src", "img/Group4069.png");
    myOption.setAttribute("value", "green");
  }
}
function pregreen(id) {
  const myOption = document.getElementById("option" + id);
  const optionValue = myOption.getAttribute("value");
  const myimg = document.getElementById(`opt${id}-img`);
  const img = myimg.getAttribute("src");
  resetAllOptions();

  if (img == "img/preintroboxgreen.png") {
    myimg.setAttribute("src", "img/preintrobox.png");
    myOption.setAttribute("value", "grey");
  } else {
    myimg.setAttribute("src", "img/preintroboxgreen.png");
    myOption.setAttribute("value", "green");
  }
}

// function green1(){

//     let myOption = document.getElementById('option1');
//     let optionValue = myOption.getAttribute('value');
//     let myimg = document.getElementById('opt1-img');
//     let img = myimg.getAttribute('src');
//     resetAllOptions()

//     if(img  == "img/Group4069.png"){
//         myimg.setAttribute('src', 'img/Rectangle23.png');
//         myOption.setAttribute("value" , "grey");
//     }else{
//     myimg.setAttribute('src', 'img/Group4069.png');
//     myOption.setAttribute("value" , "green");

// }
// }
// function green2(){

//     let myOption = document.getElementById('option2');
//     let optionValue = myOption.getAttribute('value');
//     let myimg = document.getElementById('opt2-img');
//     let img = myimg.getAttribute('src');
//     resetAllOptions()

//     if(img  == "img/Group4069.png"){
//         myimg.setAttribute('src', 'img/Rectangle23.png');
//         myOption.setAttribute("value" , "grey");
//     }else{
//     myimg.setAttribute('src', 'img/Group4069.png');
//     myOption.setAttribute("value" , "green");

// }
// }
// function green3(){

//     let myOption = document.getElementById('option3');
//     let optionValue = myOption.getAttribute('value');
//     let myimg = document.getElementById('opt3-img');
//     let img = myimg.getAttribute('src');
//     resetAllOptions()

//     if(img  == "img/Group4069.png"){
//         myimg.setAttribute('src', 'img/Rectangle23.png');
//         myOption.setAttribute("value" , "grey");
//     }else{
//     myimg.setAttribute('src', 'img/Group4069.png');
//     myOption.setAttribute("value" , "green");

// }
// }
// function green4(){

//     let myOption = document.getElementById('option4');
//     let optionValue = myOption.getAttribute('value');
//     let myimg = document.getElementById('opt4-img');
//     let img = myimg.getAttribute('src');
//     resetAllOptions()

//     if(img  == "img/Group4069.png"){
//         myimg.setAttribute('src', 'img/Rectangle23.png');
//         myOption.setAttribute("value" , "grey");
//     }else{
//     myimg.setAttribute('src', 'img/Group4069.png');
//     myOption.setAttribute("value" , "green");

// }
// }
// function green5(){

//     let myOption = document.getElementById('option5');
//     let optionValue = myOption.getAttribute('value');
//     let myimg = document.getElementById('opt5-img');
//     let img = myimg.getAttribute('src');

//     resetAllOptions()

//     if(img  == "img/Group4069.png"){
//         myimg.setAttribute('src', 'img/Rectangle23.png');
//         myOption.setAttribute("value" , "grey");
//     }else{
//     myimg.setAttribute('src', 'img/Group4069.png');
//     myOption.setAttribute("value" , "green");

// }
// }
// function green6(){

//     let myOption = document.getElementById('option6');
//     let optionValue = myOption.getAttribute('value');
//     let myimg = document.getElementById('opt6-img');
//     let img = myimg.getAttribute('src');

//     resetAllOptions();

//     if(img  == "img/Group4069.png"){
//         myimg.setAttribute('src', 'img/Rectangle23.png');
//         myOption.setAttribute("value" , "grey");
//     }else{
//     myimg.setAttribute('src', 'img/Group4069.png');
//     myOption.setAttribute("value" , "green");

// }
// }
