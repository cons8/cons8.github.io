
// 这是一条注释。
/*
这里的所有内容
都是注释。
*/
let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === '../images/logo.png') {
      myImage.setAttribute('src', '../images/p1.png');
    } else {
      myImage.setAttribute('src', '../images/logo.png');
    }
}

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
    let myName = prompt('请输入你的名字。');
    // prompt() 函数，与 alert() 类似会弹出一个对话框。但是这里需要用户输入数据，并在确定后将数据存储在 myName 变量里。
    if(!myName) {
        setUserName();
      } else {
        localStorage.setItem('name', myName);
        myHeading.textContent = '酷毙了，' + myName;
      }
   
  }
  if(!localStorage.getItem('name')) {
    setUserName();
  } else {
    let storedName = localStorage.getItem('name');
    myHeading.textContent = '酷毙了，' + storedName;
  }
  myButton.onclick = function() {
    setUserName();
 }
 

  