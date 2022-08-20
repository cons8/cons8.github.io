let myname = document.getElementById("myname")
let mybutton = document.getElementById("mybutton")

function setUserName(){
    let myName=prompt("请输入您的姓名")
    if(!myName){
        setUserName();
    }else{
        localStorage.setItem('name', myName);
        myname.textContent=myName+".";
    }
}

if(!localStorage.getItem("name")){
    myname.textContent="bro.";
}else{
    let storedName = localStorage.getItem('name');
    myname.textContent=storedName+".";
}
mybutton.onclick=function(){
    setUserName();
}
