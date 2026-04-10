function renderWorks() {
  const worksContainer = document.getElementById('works-list');
  if (!worksContainer) return;

  worksContainer.innerHTML = SITE_DATA.works.map(work => `
    <a href="${work.url}" class="work-item" target="_blank">
      <span class="work-num">${work.id}</span>
      <span class="work-info">
        <span class="work-title">${work.title}</span>
        <span class="work-tag">${work.tag}</span>
      </span>
    </a>
  `).join('');
}

function getCurrentSlide() {
  const slides = document.querySelectorAll('.slide');
  const scrollTop = window.scrollY;

  for (let i = slides.length - 1; i >= 0; i--) {
    const slideTop = slides[i].offsetTop;
    if (scrollTop >= slideTop - 100) {
      return i;
    }
  }
  return 0;
}

function updateSlideNumber() {
  const currentSlide = getCurrentSlide();
  const slideNumber = document.getElementById('slide-number');
  const pageNumber = String(currentSlide + 1).padStart(2, '0');

  if (slideNumber) {
    slideNumber.textContent = pageNumber;
  }
}

function updateBackgroundImage() {
  const currentSlide = getCurrentSlide();
  const slides = document.querySelectorAll('.slide');

  slides.forEach((slide, i) => {
    const right = slide.querySelector('.right');
    if (right) {
      if (i === currentSlide) {
        right.style.zIndex = '1';
      } else {
        right.style.zIndex = '0';
      }
    }
  });
}

function updateDots() {
  const currentSlide = getCurrentSlide();
  const dots = document.querySelectorAll('.dot');

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function handleScroll() {
  updateSlideNumber();
  updateBackgroundImage();
  updateDots();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  if (index >= 0 && index < slides.length) {
    slides[index].scrollIntoView({ behavior: 'smooth' });
  }
}

function handleKeydown(e) {
  const currentSlide = getCurrentSlide();

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(document.querySelectorAll('.slide').length - 1);
  }
}

// 鼠标视差效果
function handleMouseMove(e) {
  const currentSlide = getCurrentSlide();
  const slides = document.querySelectorAll('.slide');
  const slide = slides[currentSlide];
  if (!slide) return;

  const right = slide.querySelector('.right img');
  if (!right) return;

  const rect = slide.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  const maxMove = 20;
  const translateX = x * maxMove * 2;
  const translateY = y * maxMove * 2;

  right.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
}

function handleMouseLeave() {
  const currentSlide = getCurrentSlide();
  const slides = document.querySelectorAll('.slide');
  const slide = slides[currentSlide];
  if (!slide) return;

  const right = slide.querySelector('.right img');
  if (!right) return;

  right.style.transform = 'translate(0, 0) scale(1)';
}

// 点击指示器跳转
document.addEventListener('DOMContentLoaded', () => {
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide);
      goToSlide(slideIndex);
    });
  });
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);
window.addEventListener('keydown', handleKeydown);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseleave', handleMouseLeave);

document.addEventListener('DOMContentLoaded', () => {
  renderWorks();
  handleScroll();
});
