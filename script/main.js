console.log("js加载成功")
window.onload = function () {
  var gongzhonghao = document.getElementById("gongzhonghao")
  gongzhonghao.onclick = function () {
    showPopup("微信公众号请搜索：Boat小星球")
  }
  var bowuguan = document.getElementById("bowuguan")
  bowuguan.onclick = function () {
    showPopup("正在搭建...")
  }


  // 一言
  fetch('https://v1.hitokoto.cn')
  .then(response => response.json())
  .then(data => {
    const hitokoto = document.querySelector('#hitokoto_text')
    const hitokotoFrom = document.querySelector('#hitokoto_from')
    hitokoto.href = `https://hitokoto.cn/?uuid=${data.uuid}`
    console.log(data)
    hitokoto.innerText = data.hitokoto
    hitokotoFrom.innerText=data.from
  })
  .catch(console.error)
}
// 弹窗
function showPopup(p){
  var overlay = document.getElementById("overlay");
  const popup_content = document.querySelector('#popup_content')
  popup_content.innerText = p
  overlay.style.display = "block";
}
function hidePopup(){
  var overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}
