/* sweetCone site interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const BRAND = ['#80B1FF', '#C5C5FF', '#A4A4F4', '#FFD2EA', '#FFC2DF', '#FFA4D4', '#FFCC99', '#FFE98A', '#79E8B3', '#B3FFC7', '#BBEFFF', '#99E2FF'];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };

  /* ---------- toast ---------- */
  let toastTimer;
  window.toast = msg => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  };

  /* ---------- night shift ---------- */
  const themeBtn = $('.theme-toggle');
  function setTheme(night, save) {
    document.documentElement.dataset.theme = night ? 'night' : 'day';
    themeBtn.setAttribute('aria-pressed', String(night));
    $('meta[name="theme-color"]').content = night ? '#1f1d3d' : '#FFF5EB';
    if (save) store.set('sc-theme', night ? 'night' : 'day');
  }
  setTheme(document.documentElement.dataset.theme === 'night', false);
  themeBtn.addEventListener('click', () => {
    const night = document.documentElement.dataset.theme !== 'night';
    setTheme(night, true);
    window.toast(night ? 'Night shift: the freezer glows ✦' : 'Good morning! Fresh scoops are out ☀️');
  });

  /* ---------- mobile nav ---------- */
  const header = $('.site-header');
  const navToggle = $('.nav-toggle');
  const setNav = open => {
    header.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setNav(!header.classList.contains('nav-open')));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });

  /* ---------- scroll spy pill (a nod to the original bubble) ---------- */
  const PILL = { home: 'var(--pink)', lab: 'var(--yellow)', flavours: 'var(--seafoam)', about: 'var(--peri)', team: 'var(--sky)', faq: 'var(--peach)' };
  const pill = $('.nav-pill');
  let active = 'home';
  function movePill() {
    const link = $(`.nav-links a[data-spy="${active}"]`);
    if (!link) return;
    $$('.nav-links a').forEach(a => a.classList.toggle('active', a === link));
    pill.style.left = `${link.offsetLeft}px`;
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.background = PILL[active];
  }
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { active = en.target.id; movePill(); } });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('[data-section]').forEach(s => spy.observe(s));
  addEventListener('resize', movePill);
  document.fonts && document.fonts.ready.then(movePill);
  movePill();

  /* ---------- scroll progress + header state ---------- */
  const progress = $('.progress');
  let scrollQueued = false;
  function onScroll() {
    scrollQueued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header.classList.toggle('scrolled', scrollY > 40);
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- wordmark letters ---------- */
  $$('#wordmark span, .logo span').forEach((l, i) => {
    l.style.setProperty('--i', i % 9);
    l.addEventListener('click', e => {
      if (l.closest('.logo')) return; // header + footer logos just navigate
      let c;
      do { c = BRAND[Math.floor(Math.random() * BRAND.length)]; } while (c === l.style.color);
      l.style.color = c;
      l.classList.remove('squish'); void l.offsetWidth; l.classList.add('squish');
      const r = l.getBoundingClientRect();
      window.sprinkleBurst(r.left + r.width / 2, r.top + r.height / 3, 18);
      e.preventDefault();
    });
  });

  /* ---------- hero deck ---------- */
  const deck = $('#deck');
  const cards = $$('.deck-card', deck);
  let order = cards.map((_, i) => i);
  let dealing = false;
  function layout() { order.forEach((ci, pos) => { cards[ci].dataset.pos = pos; }); }
  function deal() {
    if (dealing) return;
    dealing = true;
    const top = cards[order[0]];
    top.classList.add('leaving');
    setTimeout(() => {
      top.classList.remove('leaving');
      order.push(order.shift());
      layout();
      dealing = false;
    }, reduceMotion ? 0 : 420);
  }
  deck.addEventListener('click', deal);
  deck.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); deal(); } });
  let deckHover = false, deckVisible = true;
  deck.addEventListener('pointerenter', () => { deckHover = true; });
  deck.addEventListener('pointerleave', () => { deckHover = false; });
  new IntersectionObserver(([en]) => { deckVisible = en.isIntersecting; }).observe(deck);
  if (!reduceMotion) setInterval(() => { if (!deckHover && deckVisible && !document.hidden) deal(); }, 3200);

  /* ---------- tilt + holo shine ---------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * 16}deg`);
        const shine = el.classList.contains('holo-card') ? el : $('.deck-card[data-pos="0"]', el);
        if (shine) { shine.style.setProperty('--mx', `${x * 100}%`); shine.style.setProperty('--my', `${y * 100}%`); }
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });

    // hero doodles drift away from the pointer a little
    const hero = $('.hero');
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  }

  /* ---------- reveal on scroll ---------- */
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      reveal.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    const sib = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains('reveal')).indexOf(el) : 0;
    el.style.setProperty('--d', `${Math.min(sib, 6) * 70}ms`);
    reveal.observe(el);
  });

  /* ---------- count-up stats ---------- */
  const counter = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      counter.unobserve(en.target);
      const el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (reduceMotion) return;
      const t0 = performance.now(), dur = 1400;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * eased).toLocaleString('en-US') + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => counter.observe(el));

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  const shots = $$('.flavour').map(card => ({
    src: $('img', card).src, alt: $('img', card).alt, title: $('h3', card).textContent,
  }));
  let shot = 0;
  function showShot(i) {
    shot = (i + shots.length) % shots.length;
    lbImg.src = shots[shot].src;
    lbImg.alt = shots[shot].alt;
    lbCap.textContent = shots[shot].title;
  }
  $$('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => {
    showShot(+btn.dataset.lightbox);
    if (typeof lb.showModal === 'function') lb.showModal();
  }));
  $('.lb-close').addEventListener('click', () => lb.close());
  $('.lb-prev').addEventListener('click', () => showShot(shot - 1));
  $('.lb-next').addEventListener('click', () => showShot(shot + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showShot(shot - 1);
    if (e.key === 'ArrowRight') showShot(shot + 1);
  });

  /* ---------- remix a real cone in the lab ---------- */
  $$('[data-remix]').forEach(btn => btn.addEventListener('click', () => {
    if (!window.ConeLab) return;
    const title = $('h3', btn.closest('.flavour')).textContent;
    window.ConeLab.load(btn.dataset.remix.split(','));
    $('#lab').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    window.toast(`Remixing ${title} in the Lab 🧪`);
  }));

  /* ---------- sprinkles (cursor trail + bursts) ---------- */
  const cv = $('#sprinkles'), ctx = cv.getContext('2d');
  let parts = [], running = false, dpr = 1;
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
  }
  resize();
  addEventListener('resize', resize);
  function spawn(x, y, n, power) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * power;
      parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - power * 0.6,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        c: BRAND[Math.floor(Math.random() * BRAND.length)], life: 1, len: 6 + Math.random() * 5,
        decay: 0.012 + Math.random() * 0.012,
      });
    }
    if (parts.length > 260) parts.splice(0, parts.length - 260);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round';
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 20);
    for (const p of parts) {
      p.vy += 0.14; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.translate(p.x * dpr, p.y * dpr);
      ctx.rotate(p.r);
      ctx.strokeStyle = p.c;
      ctx.lineWidth = 4.2 * dpr;
      ctx.beginPath();
      ctx.moveTo(-p.len / 2 * dpr, 0);
      ctx.lineTo(p.len / 2 * dpr, 0);
      ctx.stroke();
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  window.sprinkleBurst = (x, y, n = 24) => { if (!reduceMotion) spawn(x, y, n, 4.2); };
  if (finePointer && !reduceMotion) {
    let last = 0;
    addEventListener('pointermove', e => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      spawn(e.clientX, e.clientY, 1, 1.1);
    }, { passive: true });
  }

  /* ---------- secret menu: type "yum" (or the Konami code) ---------- */
  const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  let keys = [];
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    keys = [...keys, e.key].slice(-10);
    const typed = keys.join('').toLowerCase();
    if (typed.endsWith('yum') || keys.join(',') === KONAMI) { keys = []; coneRain(); }
  });
  function coneRain() {
    window.toast('It’s raining cones! 🍦');
    if (reduceMotion) return;
    for (let i = 0; i < 34; i++) {
      const img = new Image();
      img.src = `images/web/cone-${(i % 6) + 1}.webp`;
      img.alt = '';
      img.className = 'rain-cone';
      const size = 56 + Math.random() * 70;
      img.style.cssText = `left:${Math.random() * 100}vw;width:${size}px;height:${size}px;--dur:${2.6 + Math.random() * 2.2}s;--delay:${Math.random() * 1.6}s;--rot:${(Math.random() - 0.5) * 720}deg`;
      img.addEventListener('animationend', () => img.remove());
      document.body.appendChild(img);
    }
  }

  /* ---------- hello, fellow dev ---------- */
  console.log(
    '%c   ( )\n  (   )\n ( o.o )\n  \\   /\n   \\ /\n    V\n%c sweetCone · psst, type "yum" anywhere ',
    'color:#FFA4D4;font-weight:bold;font-size:14px;line-height:1.1',
    'background:#A4A4F4;color:#1d1b2e;padding:4px 8px;border-radius:8px;font-weight:bold'
  );
})();
