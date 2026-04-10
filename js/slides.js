const SLIDES_CONFIG = [
  { number: '01', image: './src/img1.jpg' },
  { number: '02', image: './src/04_flower.png' }
];

let currentSlide = 0;

function updateSlide(index) {
  if (currentSlide === index) return;
  currentSlide = index;

  // 更新数字
  const slideNumber = document.getElementById('slide-number');
  if (slideNumber) {
    slideNumber.textContent = SLIDES_CONFIG[index].number;
  }

  // 更新激活状态
  document.querySelectorAll('.slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  // 更新图片显隐
  document.querySelectorAll('.right img').forEach((img, i) => {
    img.classList.toggle('visible', i === index);
  });
}

function handleScroll() {
  const scrollTop = window.scrollY;
  const slide1Height = window.innerHeight;

  // 滚动超过一屏就切换到第二页
  if (scrollTop > slide1Height * 0.5) {
    updateSlide(1);
  } else {
    updateSlide(0);
  }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

document.addEventListener('DOMContentLoaded', () => {
  // 初始化第一张图片可见
  const firstImg = document.querySelector('.slide:first-child .right img');
  if (firstImg) firstImg.classList.add('visible');
  updateSlide(0);
});
