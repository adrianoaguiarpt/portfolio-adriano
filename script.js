document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) {
    return;
  }

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }));
});

// Carrossel de projetos: avança sozinho, pausa ao passar o rato/focar, aceita setas, pontos, teclado e swipe
document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const slides = [...carousel.querySelectorAll('.carousel__slide')];
  const dotsBox = carousel.querySelector('.carousel__dots');
  const interval = Number(carousel.dataset.interval) || 4500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
    dot.addEventListener('click', () => { go(i); restart(); });
    dotsBox.appendChild(dot);
    return dot;
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, n) => slide.setAttribute('aria-hidden', n !== index));
    dots.forEach((dot, n) => dot.setAttribute('aria-current', n === index));
  }
  function start() { if (!reduceMotion && !timer && slides.length > 1) timer = setInterval(() => go(index + 1), interval); }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  carousel.querySelector('.carousel__btn--prev').addEventListener('click', () => { go(index - 1); restart(); });
  carousel.querySelector('.carousel__btn--next').addEventListener('click', () => { go(index + 1); restart(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  let startX = null;
  const viewport = carousel.querySelector('.carousel__viewport');
  viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  viewport.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });

  go(0);
  start();
});
