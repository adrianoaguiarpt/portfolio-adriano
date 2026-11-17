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

  iniciarProjetos();
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
   Projetos: carrossel + filtros + janela de detalhes
   Os dados vêm de projetos.js (window.PROJETOS).
   ========================================================= */
function iniciarProjetos() {
  const projetos = window.PROJETOS || [];
  const track = document.querySelector('.slider__track');
  if (!track || !projetos.length) return;

  const CATEGORIAS = { site: 'Site', loja: 'Loja & catálogo', app: 'Aplicação' };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.slider__progress span');
  const countNow = document.querySelector('.slider__count strong');
  const countAll = document.querySelector('.slider__count span');
  const [prevBtn, nextBtn] = document.querySelectorAll('.slider__arrow');
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const host = (url) => { try { return new URL(url).host + new URL(url).pathname.replace(/\/$/, ''); } catch { return url; } };

  // --- Cartões ---
  track.innerHTML = projetos.map((p, i) => {
    const extra = p.stack.length > 4 ? `<span>+${p.stack.length - 4}</span>` : '';
    return `
      <article class="work-card" data-cat="${esc(p.categoria)}" data-i="${i}">
        <button type="button" class="work-card__media" data-open="${i}" aria-label="Ver detalhes de ${esc(p.nome)}">
          <img src="${esc(p.imagens[0].src)}" alt="${esc(p.nome)} — ${esc(p.imagens[0].legenda)}" width="1280" height="800" loading="lazy" decoding="async" draggable="false">
          ${p.imagens.length > 1 ? `<span class="work-card__shots">${p.imagens.length} capturas</span>` : ''}
          <span class="work-card__hint">Ver projeto <span aria-hidden="true">→</span></span>
        </button>
        <div class="work-card__body">
          <div class="work-card__top">
            <span class="work-card__cat">${pad(i + 1)} · ${esc(CATEGORIAS[p.categoria] || p.categoria)}</span>
            <span class="tag ${p.estado === 'Em produção' ? 'tag--live' : p.estado === 'Novo' ? 'tag--new' : ''}">${esc(p.estado)}</span>
          </div>
          <h3>${esc(p.nome)}</h3>
          <p class="work-card__client">${esc(p.cliente)}</p>
          <p class="work-card__text">${esc(p.resumo)}</p>
          <div class="badges">${p.stack.slice(0, 4).map((s) => `<span>${esc(s)}</span>`).join('')}${extra}</div>
          <div class="work-card__foot">
            <button type="button" class="work-card__more" data-open="${i}">Ver detalhes →</button>
            ${p.site ? `<a class="work-card__site" href="${esc(p.site)}" target="_blank" rel="noopener noreferrer">Abrir site ↗</a>` : ''}
          </div>
        </div>
      </article>`;
  }).join('');

  const cards = [...track.querySelectorAll('.work-card')];
  const visiveis = () => cards.filter((c) => !c.hidden);

  // --- Filtros (escondem os botões de categorias sem projetos) ---
  const filtros = document.querySelectorAll('.filter');
  filtros.forEach((f) => {
    const cat = f.dataset.filter;
    const n = cat === 'todos' ? projetos.length : projetos.filter((p) => p.categoria === cat).length;
    f.querySelector('span').textContent = n;
    if (!n) f.hidden = true;
    f.addEventListener('click', () => {
      filtros.forEach((b) => { b.classList.toggle('is-active', b === f); b.setAttribute('aria-pressed', String(b === f)); });
      cards.forEach((c) => { c.hidden = !(cat === 'todos' || c.dataset.cat === cat); });
      track.scrollTo({ left: 0, behavior: 'auto' });
      atualizar();
      reiniciar();
    });
  });

  // --- Navegação ---
  const passo = () => {
    const v = visiveis();
    if (v.length < 2) return track.clientWidth;
    return v[1].offsetLeft - v[0].offsetLeft;
  };
  const noFim = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  const ir = (dir) => {
    if (dir > 0 && noFim()) track.scrollTo({ left: 0 });
    else track.scrollBy({ left: dir * passo() });
  };

  function atualizar() {
    const v = visiveis();
    const max = track.scrollWidth - track.clientWidth;
    const atual = max > 0 ? Math.round(track.scrollLeft / passo()) : 0;
    const total = v.length;
    const idx = noFim() ? total : Math.min(atual + 1, total);
    countNow.textContent = pad(idx);
    countAll.textContent = pad(total);
    progress.style.width = (max > 0 ? Math.max(track.scrollLeft / max, 0) * (1 - 1 / total) + 1 / total : 1) * 100 + '%';
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = max <= 4;
  }
  prevBtn.addEventListener('click', () => { ir(-1); reiniciar(); });
  nextBtn.addEventListener('click', () => { ir(1); reiniciar(); });
  track.addEventListener('scroll', () => requestAnimationFrame(atualizar), { passive: true });
  window.addEventListener('resize', atualizar);
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); reiniciar(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); reiniciar(); }
  });

  // Arrastar com o rato (no telemóvel o deslizar é nativo)
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; track.classList.add('is-dragging'); parar(); }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      track.classList.remove('is-dragging');
      // encaixa no cartão mais próximo
      const p = passo();
      track.scrollTo({ left: Math.round(track.scrollLeft / p) * p });
      // impede que o fim do arrasto conte como clique
      const bloquear = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
      track.addEventListener('click', bloquear, { capture: true, once: true });
      setTimeout(() => track.removeEventListener('click', bloquear, { capture: true }), 50);
      reiniciar();
    }
  });

  // --- Passagem automática (pára com o rato por cima, fora do ecrã ou com detalhes abertos) ---
  const INTERVALO = 5000;
  let timer = null;
  let naTela = false;
  let pausa = false;
  function parar() { clearInterval(timer); timer = null; }
  function iniciar() {
    if (reduce || timer || !naTela || pausa || document.hidden || modal.open) return;
    if (track.scrollWidth - track.clientWidth <= 4) return;
    timer = setInterval(() => ir(1), INTERVALO);
  }
  function reiniciar() { parar(); iniciar(); }
  const slider = document.querySelector('.slider');
  slider.addEventListener('mouseenter', () => { pausa = true; parar(); });
  slider.addEventListener('mouseleave', () => { pausa = false; iniciar(); });
  slider.addEventListener('focusin', () => { pausa = true; parar(); });
  slider.addEventListener('focusout', () => { pausa = false; iniciar(); });
  track.addEventListener('touchstart', () => reiniciar(), { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : iniciar()));
  new IntersectionObserver(([e]) => { naTela = e.isIntersecting; naTela ? iniciar() : parar(); }, { threshold: 0.35 }).observe(slider);

  // --- Janela de detalhes ---
  const modal = document.querySelector('.project-modal');
  const $ = (s) => modal.querySelector(s);
  const shot = $('.pm-shot');
  function trocarImagem(p, n) {
    shot.classList.add('is-swapping');
    setTimeout(() => {
      shot.src = p.imagens[n].src;
      shot.alt = `${p.nome} — ${p.imagens[n].legenda}`;
      shot.classList.remove('is-swapping');
    }, 150);
    $('.pm-thumbs').querySelectorAll('button').forEach((b, k) => {
      b.classList.toggle('is-active', k === n);
      b.setAttribute('aria-pressed', String(k === n));
    });
  }
  function abrir(i) {
    const p = projetos[i];
    $('.pm-title').textContent = p.nome;
    $('.pm-client').textContent = p.cliente;
    $('.pm-desc').textContent = p.descricao;
    const tag = $('.pm-tag');
    tag.textContent = p.estado;
    tag.className = 'tag pm-tag ' + (p.estado === 'Em produção' ? 'tag--live' : p.estado === 'Novo' ? 'tag--new' : '');
    $('.pm-feats').innerHTML = p.destaques.map((d) => `<li>${esc(d)}</li>`).join('');
    $('.pm-stack').innerHTML = p.stack.map((s) => `<span>${esc(s)}</span>`).join('');
    $('.pm-url').textContent = host(p.site || p.codigo);
    const site = $('.pm-site');
    const codigo = $('.pm-code');
    site.hidden = !p.site; if (p.site) site.href = p.site;
    codigo.hidden = !p.codigo; if (p.codigo) codigo.href = p.codigo;
    const thumbs = $('.pm-thumbs');
    thumbs.hidden = p.imagens.length < 2;
    thumbs.innerHTML = p.imagens.map((im, n) =>
      `<button type="button" aria-pressed="${n === 0}" class="${n === 0 ? 'is-active' : ''}"><img src="${esc(im.src)}" alt="" width="1280" height="800"><span class="sr-only">${esc(im.legenda)}</span></button>`).join('');
    thumbs.querySelectorAll('button').forEach((b, n) => b.addEventListener('click', () => trocarImagem(p, n)));
    shot.src = p.imagens[0].src;
    shot.alt = `${p.nome} — ${p.imagens[0].legenda}`;
    parar();
    document.body.classList.add('modal-open');
    modal.showModal();
    modal.scrollTop = 0;
  }
  track.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) abrir(Number(b.dataset.open));
  });
  $('.project-modal__close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => { document.body.classList.remove('modal-open'); iniciar(); });

  atualizar();
}

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
