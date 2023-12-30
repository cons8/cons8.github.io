console.log("js加载成功")
window.onload = function () {
  var gongzhonghao = document.getElementById("gongzhonghao")
  gongzhonghao.onclick = function () {
    alert("微信公众号：Boat小星球")
  }
  var bowuguan = document.getElementById("bowuguan")
  bowuguan.onclick = function () {
    alert("正在搭建...")
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
