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
      <div class="card-img-placeholder">
        <span>↗</span>
      </div>
      <span class="card-arrow">↗</span>
    </a>
  `).join('');
}

function getCurrentSection() {
  const sections = document.querySelectorAll('.section');
  const scrollTop = window.scrollY;
  const windowH = window.innerHeight;

  for (let i = sections.length - 1; i >= 0; i--) {
    if (scrollTop >= sections[i].offsetTop - windowH * 0.4) {
      return i;
    }
  }
  return 0;
}

function updateBlur() {
  const sections = document.querySelectorAll('.section');
  const current = getCurrentSection();

  sections.forEach((section, i) => {
    if (i === current) {
      section.classList.remove('blurred');
    } else {
      section.classList.add('blurred');
    }
  });
}

function updatePageNumber() {
  const current = getCurrentSection();
  const sections = document.querySelectorAll('.section');
  const slideNumber = document.getElementById('slide-number');
  if (!slideNumber) return;

  slideNumber.textContent = `${String(current + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
}

function updateDots() {
  const current = getCurrentSection();
  const dots = document.querySelectorAll('.scroll-dot');

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

function goToSection(index) {
  const sections = document.querySelectorAll('.section');
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
  }
}

function handleScroll() {
  updateBlur();
  updatePageNumber();
  updateDots();
}

function handleKeydown(e) {
  const current = getCurrentSection();

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    goToSection(current + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    goToSection(current - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSection(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSection(document.querySelectorAll('.section').length - 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderWorks();

  updateBlur();
  updatePageNumber();
  updateDots();

  const dots = document.querySelectorAll('.scroll-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      goToSection(index);
    });
  });

  // 卡片鼠标跟随光效
  const worksList = document.getElementById('works-list');
  if (worksList) {
    worksList.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.work-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      }
    });

    worksList.addEventListener('mouseenter', (e) => {
      const card = e.target.closest('.work-card');
      if (card) {
        card.classList.add('hovering');
      }
    }, true);

    worksList.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.work-card');
      if (card) {
        card.classList.remove('hovering');
      }
    }, true);
  }

  // 导航链接事件
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const page = parseInt(link.dataset.page);
      goToSection(page);

      // 如果是 About（第四页），发送 about 命令
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

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', handleScroll, { passive: true });
window.addEventListener('keydown', handleKeydown);
