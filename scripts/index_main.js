let myname = document.getElementById("myname")
let mybutton = document.getElementById("mybutton")

function setUserName(){
    let myName=prompt("请输入您的姓名")

    if(!myName){
        alert("难道你还没想好名字吗 🤔")
    }else{
        localStorage.setItem('name', myName);
        myname.textContent=myName+".";
    }
}

//页面打开时判断是否设置过名字
if(!localStorage.getItem("name")){
    myname.textContent="bro.";
}else{
    let storedName = localStorage.getItem('name');
    myname.textContent=storedName+".";
}
// 当 mybutton被点击时调用设置名字的函数
mybutton.onclick=function(){
    setUserName();
}
