let light = document.querySelector("#light");
// 设置light高度
light.style.height = 90 + "vh";
// 设置light背景颜色
light.style.backgroundColor = "white";

// 监听input的color事件
light.addEventListener("input", function (e) {
  // 获取input输入的颜色值
  let color = e.target.value;
  // 设置light背景颜色
  light.style.backgroundColor = color;
});