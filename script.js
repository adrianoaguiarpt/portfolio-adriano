document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');

  // Menu móvel
  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Cabeçalho com borda ao fazer scroll
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Link ativo no menu conforme a secção visível
  const navMap = new Map(
    [...links.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a])
  );
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove('is-active'));
      const a = navMap.get(entry.target.id);
      if (a && !a.classList.contains('nav-links__cta')) a.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

  // Aparecer ao fazer scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  iniciarContacto();
  iniciarGradeRato();

  // Vídeo do hero: toca uma vez e fica parado no último quadro (o retrato).
  // Com "reduzir movimento" ativo, mostra só a imagem estática.
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      heroVideo.play().catch(() => { /* autoplay bloqueado: fica o poster */ });
    }
  }

  // Ano no rodapé
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
});

/* =========================================================
   Contacto: relógio, grelha que segue o rato, foco do
   projeto (preenche o e-mail e o WhatsApp) e copiar e-mail.
   ========================================================= */
function iniciarContacto() {
  const secao = document.getElementById('contato');
  if (!secao) return;

  const EMAIL = 'adrianoaguiarpt@gmail.com';
  const WHATSAPP = '351910283508';

  // Hora atual em Portugal
  const hora = document.getElementById('hora-portugal');
  if (hora) {
    const fmt = new Intl.DateTimeFormat('pt-PT', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit' });
    const tick = () => { hora.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  // Foco do projeto → mensagem pronta no e-mail e no WhatsApp
  const pills = document.getElementById('foco-projeto');
  const btnEmail = document.getElementById('btn-email');
  const linkEmail = document.getElementById('link-email');
  const btnWhats = document.getElementById('btn-whatsapp');

  const atualizarLinks = (tipo) => {
    const assunto = encodeURIComponent(`Pedido de orçamento: ${tipo}`);
    const corpo = encodeURIComponent(`Olá Adriano,\n\nGostaria de pedir uma proposta para: ${tipo}.\n\nDetalhes do projeto:\n`);
    const mailto = `mailto:${EMAIL}?subject=${assunto}&body=${corpo}`;
    const texto = encodeURIComponent(`Olá Adriano! Vi o seu portfólio e gostava de falar sobre um projeto: ${tipo}.`);
    if (btnEmail) btnEmail.href = mailto;
    if (linkEmail) linkEmail.href = mailto;
    if (btnWhats) btnWhats.href = `https://wa.me/${WHATSAPP}?text=${texto}`;
  };

  if (pills) {
    const ativa = pills.querySelector('[aria-pressed="true"]');
    if (ativa) atualizarLinks(ativa.dataset.projeto);
    pills.addEventListener('click', (e) => {
      const btn = e.target.closest('.pill');
      if (!btn) return;
      pills.querySelectorAll('.pill').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      atualizarLinks(btn.dataset.projeto);
    });
  }

  // Copiar e-mail
  const copiar = document.getElementById('copiar-email');
  if (copiar) {
    const rotulo = copiar.querySelector('span');
    let t;
    copiar.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        rotulo.textContent = 'Copiado';
      } catch {
        rotulo.textContent = EMAIL;
      }
      copiar.classList.add('is-copied');
      clearTimeout(t);
      t = setTimeout(() => { copiar.classList.remove('is-copied'); rotulo.textContent = 'Copiar'; }, 2500);
    });
  }
}

/* Grelha dourada que segue o rato (topo e contacto).
   Só em ecrãs com rato; no telemóvel fica desligada. */
function iniciarGradeRato() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.grade-rato').forEach((grade) => {
    const secao = grade.parentElement;
    let frame = 0;
    secao.addEventListener('mousemove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const r = secao.getBoundingClientRect();
        grade.style.setProperty('--mx', `${e.clientX - r.left}px`);
        grade.style.setProperty('--my', `${e.clientY - r.top}px`);
        frame = 0;
      });
    });
    secao.addEventListener('mouseleave', () => {
      grade.style.setProperty('--mx', '-1000px');
      grade.style.setProperty('--my', '-1000px');
    });
  });
}
