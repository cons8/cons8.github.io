// ---- 渲染作品卡片 ----
function renderWorks() {
  const worksContainer = document.getElementById('works-list');
  if (!worksContainer) return;

  worksContainer.innerHTML = SITE_DATA.works.map(work => `
    <a href="${work.url}" class="work-card" target="_blank" rel="noopener">
      <div class="card-inner">
        <span class="card-num">${work.id}</span>
        <span class="card-title">${work.title}</span>
        <span class="card-tag">${work.tag}</span>
      </div>
      <div class="card-img-placeholder"></div>
      <span class="card-arrow">↗</span>
    </a>
  `).join('');
}

// 缓存 DOM 引用
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.scroll-dot');
const slideNumber = document.getElementById('slide-number');
const worksList = document.getElementById('works-list');
const aboutSection = document.querySelector('.about');

let currentSection = 0;

// ---- Section 可见性检测 ----
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(sections).indexOf(entry.target);
      if (idx !== currentSection) {
        currentSection = idx;
        updateUI();
      }
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(s => sectionObserver.observe(s));

function updateUI() {
  // 更新模糊效果
  sections.forEach((s, i) => {
    s.classList.toggle('blurred', i !== currentSection);
  });

  // 更新页码
  if (slideNumber) {
    slideNumber.textContent = `${String(currentSection + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
  }

  // 更新指示点
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSection);
  });
}

// ---- 跳转到指定区块 ----
function goToSection(index) {
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
  }
}

// ---- 键盘导航 ----
function handleKeydown(e) {
  const terminalInput = document.getElementById('terminal-input');
  if (terminalInput && terminalInput.contains(document.activeElement)) return;

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    goToSection(currentSection + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    goToSection(currentSection - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSection(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSection(sections.length - 1);
  }
}

// ---- Works 卡片鼠标跟随 ----
if (worksList) {
  worksList.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.work-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    }
  });

  worksList.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.work-card');
    if (card) card.classList.add('hovering');
  });

  worksList.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.work-card');
    if (card) card.classList.remove('hovering');
  });
}

// ---- About 聚光灯 ----
let spotlight = null;
let rafPendingSpotlight = false;

if (aboutSection) {
  spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  document.body.appendChild(spotlight);

  aboutSection.addEventListener('mousemove', (e) => {
    if (rafPendingSpotlight) return;
    rafPendingSpotlight = true;
    requestAnimationFrame(() => {
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
      rafPendingSpotlight = false;
    });
  });

  aboutSection.addEventListener('mouseenter', () => {
    spotlight.style.opacity = '1';
  });

  aboutSection.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
  });
}

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  renderWorks();
  updateUI();

  // 点击指示点跳转
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSection(parseInt(dot.dataset.index));
    });
  });

  // 导航链接
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const page = parseInt(link.dataset.page);
      goToSection(page);
      if (page === 3) {
        setTimeout(() => {
          const input = document.getElementById('terminal-input');
          if (input) {
            input.value = 'about';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          }
        }, 600);
      }
    });
  });
});

window.addEventListener('keydown', handleKeydown);
