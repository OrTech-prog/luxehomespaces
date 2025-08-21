document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear().toString();

  const toggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-nav');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Simple carousel implementation with touch support
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((carousel) => {
    const slidesWrap = carousel.querySelector('.slides');
    const slideEls = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const total = slideEls.length;
    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoplayMs = Number(carousel.getAttribute('data-autoplay') || 0);
    let autoplayTimer = null;

    function update() {
      const offset = -index * 100;
      slidesWrap.style.transform = `translateX(${offset}%)`;
      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll('button');
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }
    function goTo(i) {
      index = (i + total) % total;
      update();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }
    update();

    // Buttons
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Touch / mouse drag
    function onDown(clientX) {
      isDragging = true; startX = clientX; currentX = clientX;
      slidesWrap.style.transition = 'none';
    }
    function onMove(clientX) {
      if (!isDragging) return;
      currentX = clientX;
      const dx = currentX - startX;
      const percent = (dx / carousel.clientWidth) * 100;
      const offset = -index * 100 + percent;
      slidesWrap.style.transform = `translateX(${offset}%)`;
    }
    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      slidesWrap.style.transition = '';
      const dx = currentX - startX;
      if (Math.abs(dx) > carousel.clientWidth * 0.18) {
        if (dx < 0) next(); else prev();
      } else {
        update();
      }
    }

    slidesWrap.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
    slidesWrap.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    slidesWrap.addEventListener('touchend', onUp);
    slidesWrap.addEventListener('mousedown', (e) => onDown(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onUp);

    // Autoplay
    function startAutoplay() {
      if (autoplayMs > 0) {
        stopAutoplay();
        autoplayTimer = setInterval(next, autoplayMs);
      }
    }
    function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  });
});

