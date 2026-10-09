(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const loader = $('.loader');
  const CFG = window.VIRUSTRA_CONFIG || {};
  const WHATSAPP_NUMBER = (CFG.whatsappNumber || '').replace(/\D/g, ''); // set in assets/js/config.js

  /* ---------- WhatsApp enquiry builder (works even without GSAP) ---------- */
  const piece = $('#f-piece'), dateEl = $('#f-date'), sizeEl = $('#f-size'), msg = $('#msg'), wa = $('#wa');
  $$('.card').forEach(c => piece.add(new Option(c.dataset.name, c.dataset.name)));
  piece.add(new Option('Not sure — help me choose', ''), 0); piece.selectedIndex = 0;
  const fmtDate = v => v ? new Date(v + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '[date]';
  function buildMsg() {
    const mode = ($('input[name=mode]:checked') || {}).value;
    const verb = { rent: 'rent', buy: 'buy', either: 'rent or buy' }[mode];
    const item = piece.value ? piece.value : 'one of your pieces';
    const text = `Hi Virustra! I'm interested in ${item} (${verb}).\n\nEvent date: ${fmtDate(dateEl.value)}\nSize / measurements: ${sizeEl.value.trim() || '[details]'}\n\nCould you please confirm availability, price and terms?`;
    msg.textContent = text;
    wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
  ['input', 'change'].forEach(ev => $('#enq').addEventListener(ev, () => { buildMsg(); if (window.gsap && !reduce) gsap.fromTo(msg, { opacity: .45 }, { opacity: 1, duration: .5 }); }));
  wa.addEventListener('click', () => { $('#st1').classList.add('on'); $('#hint').textContent = 'WhatsApp opened — your enquiry is with Virustra. Nothing is reserved until they confirm availability and terms.'; });
  buildMsg();

  if (!window.gsap || !window.ScrollTrigger) { loader && loader.remove(); $$('.card').forEach(c => c.querySelector('[data-pick]').addEventListener('click', () => { piece.value = c.dataset.name; buildMsg(); location.hash = 'enquire'; })); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- helpers ---------- */
  function split(el, mode = 'chars') {
    const out = []; el.setAttribute('aria-label', el.textContent.trim());
    (function walk(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            if (mode === 'chars') [...tok].forEach(ch => { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; w.appendChild(c); out.push(c); });
            else { w.textContent = tok; out.push(w); }
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    return out;
  }
  const archIn = 'inset(100% 0% 0% 0%)', archOut = 'inset(0% 0% 0% 0%)';

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    lenis.stop(); window.__lenis = lenis;
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return; e.preventDefault(); closeMenu();
    if (window.vrNavigate && window.vrNavigate(t)) return;
    lenis ? lenis.scrollTo(t, { offset: -40, duration: 1.6 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
  $$('[data-pick]').forEach(b => b.addEventListener('click', () => {
    piece.value = b.dataset.pick; buildMsg();
    const t = $('#enquire'); lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- mobile menu ---------- */
  const burger = $('.burger'), menu = $('.menu');
  function openMenu() { burger.setAttribute('aria-expanded', 'true'); gsap.set(menu, { visibility: 'visible' }); gsap.to(menu, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.inOut' }); gsap.from('.menu a', { y: 40, opacity: 0, stagger: .07, delay: .3, duration: .8, ease: 'expo.out' }); lenis && lenis.stop(); }
  function closeMenu() { if (burger.getAttribute('aria-expanded') !== 'true') return; burger.setAttribute('aria-expanded', 'false'); gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) }); lenis && lenis.start(); }
  burger.addEventListener('click', () => burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());

  /* ---------- hero intro ---------- */
  const heroChars = split($('#hero-title'));
  gsap.set(heroChars, { willChange: 'transform' });
  const stitch = $('.stitch path'); gsap.set(stitch, { strokeDasharray: 1, strokeDashoffset: 1 });
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero .eyebrow', { y: 24, opacity: 0, duration: 1 }, 0)
      .fromTo('.hero-main', { clipPath: archIn }, { clipPath: archOut, duration: 1.8, ease: 'power4.inOut' }, 0)
      .from('.hero-main img', { scale: 1.6, duration: 2.4, ease: 'power3.out' }, 0)
      .from('.hero-frame', { scale: .86, opacity: 0, duration: 1.6 }, .3)
      .from(heroChars, { yPercent: 120, rotationX: -80, opacity: 0, transformOrigin: '0% 100%', duration: 1.3, stagger: .035 }, .25)
      .to(stitch, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 1)
      .from('.hero .lede, .hero-cta .btn', { y: 30, opacity: 0, duration: 1.1, stagger: .12 }, 1.1)
      .fromTo('.hero-mini', { clipPath: archIn, y: 60 }, { clipPath: archOut, y: 0, duration: 1.5, ease: 'power4.inOut' }, .9)
      .from('.badge', { scale: 0, rotation: -180, opacity: 0, duration: 1.6, ease: 'back.out(1.4)' }, 1.3)
      .from('.hero-points span', { y: 16, opacity: 0, stagger: .1, duration: .9 }, 1.7)
      .from('.nav .wrap > *', { y: -24, opacity: 0, stagger: .08, duration: 1 }, 1.2);
    return tl;
  }

  /* ---------- loader ---------- */
  let seen = false; try { seen = sessionStorage.getItem('vl') === '1'; sessionStorage.setItem('vl', '1'); } catch (e) {}
  function finish() { loader.remove(); document.documentElement.classList.remove('lock'); lenis && lenis.start(); initScroll(); }
  if (reduce) { loader.remove(); initScroll(); }
  else {
    document.documentElement.classList.add('lock');
    const ring = $('.ring'); gsap.set(ring, { strokeDasharray: 565.5, strokeDashoffset: 565.5 });
    const cnt = { v: 0 }, cntEl = $('.loader-count');
    const tl = gsap.timeline({ onComplete: finish });
    tl.from('.loader-logo', { opacity: 0, scale: .8, duration: 1.1, ease: 'power3.out' })
      .to(ring, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, .15)
      .to(cnt, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { cntEl.textContent = String(Math.round(cnt.v)).padStart(2, '0'); } }, .15)
      .to('.needle-g', { rotation: 360, svgOrigin: '100 100', duration: 1.6, ease: 'power2.inOut' }, .15)
      .from('.loader-note', { opacity: 0, y: 12, duration: .8 }, .3)
      .to('.loader-core, .loader-note', { opacity: 0, scale: 1.1, duration: .55, ease: 'power2.in' }, '+=.2')
      .to('.pleats i', { yPercent: -101, duration: 1.3, ease: 'expo.inOut', stagger: { each: .07, from: 'center' } }, '<.15')
      .add(heroIntro(), '<.5');
    if (seen) tl.timeScale(2.2);
  }

  /* ---------- everything scroll / pointer ---------- */
  function initScroll() {
    // nav
    const nav = $('.nav'); let hidden = false;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
      nav.classList.toggle('solid', s.scroll() > 60);
      const hide = s.direction === 1 && s.scroll() > 500;
      if (hide !== hidden) { hidden = hide; gsap.to(nav, { yPercent: hide ? -100 : 0, duration: .5, ease: 'power3.out' }); }
    } });
    window.__vrReady = true; window.dispatchEvent(new Event('vr:ready'));
    addEventListener('load', () => ScrollTrigger.refresh());
    if (reduce) return;

    // spine needle
    gsap.to('.spine i', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.to('.spine b', { top: '100%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    // hero parallax out
    gsap.to('.hero-copy', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-main img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // generic arch reveal + image parallax
    $$('[data-reveal]').forEach(el => gsap.fromTo(el, { clipPath: archIn }, { clipPath: archOut, duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    $$('[data-parallax]').forEach(img => { gsap.set(img, { scale: 1.2 }); gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }); });

    // marquee with scroll-velocity
    const row = $('.marquee .row'); let x = 0, dir = -1, boost = 0;
    const half = () => row.scrollWidth / 2;
    ScrollTrigger.create({ onUpdate: s => { dir = s.direction === 1 ? -1 : 1; boost = Math.min(Math.abs(s.getVelocity()) / 220, 14); } });
    gsap.ticker.add(() => { boost *= .93; x += dir * (1.1 + boost); const h = half(); if (x <= -h) x += h; if (x > 0) x -= h; gsap.set(row, { x }); });
    gsap.from('.marquee', { yPercent: 100, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.marquee', start: 'top 98%' } });

    // story words
    const sw = split($('#story-text'), 'words');
    gsap.fromTo(sw, { opacity: .14, yPercent: 30 }, { opacity: 1, yPercent: 0, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#story-text', start: 'top 82%', end: 'bottom 50%', scrub: true } });

    // section heads
    $$('.sec-head h2, .enq-form h2').forEach(h => { const ch = split(h, 'chars'); gsap.from(ch, { yPercent: 110, rotationX: -60, transformOrigin: '0% 100%', duration: 1.1, stagger: .018, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } }); });

    // cards: arch opening, stagger, tilt
    $$('.card').forEach((c, i) => {
      gsap.fromTo($('.card-fig', c), { clipPath: archIn }, { clipPath: archOut, duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: c, start: 'top 90%' } });
      gsap.from($('.card-meta', c), { y: 40, opacity: 0, duration: 1, delay: .3, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%' } });
      if (fine) {
        gsap.set(c, { transformPerspective: 1000 });
        const rx = gsap.quickTo(c, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: .6, ease: 'power3' });
        c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 9); rx(-((e.clientY - r.top) / r.height - .5) * 9); });
        c.addEventListener('pointerleave', () => { rx(0); ry(0); });
      }
    });

    // rent / buy toggle with price roll
    const seg = $('.seg'), thumb = $('.thumb', seg), btns = $$('button', seg);
    const moveThumb = (b, instant) => { const t = { x: b.offsetLeft, width: b.offsetWidth }; instant ? gsap.set(thumb, t) : gsap.to(thumb, { ...t, duration: .7, ease: 'expo.out' }); };
    moveThumb(btns[0], true); addEventListener('resize', () => moveThumb(btns.find(b => b.getAttribute('aria-pressed') === 'true'), true));
    btns.forEach(b => b.addEventListener('click', () => {
      const mode = b.dataset.mode; btns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); moveThumb(b);
      $$('.card').forEach((c, i) => {
        const v = c.dataset[mode], lab = $('.plabel', c), val = $('.pval', c);
        const set = () => { if (v) { lab.textContent = mode === 'rent' ? 'Rent from' : 'Buy from'; val.textContent = '₹' + v; } else { lab.textContent = mode === 'rent' ? 'Sale only' : 'Rental only'; val.textContent = '—'; } };
        gsap.timeline({ delay: i * .05 }).to($('.price', c), { yPercent: -110, opacity: 0, duration: .35, ease: 'power3.in', onComplete: set }).fromTo($('.price', c), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
      });
    }));

    // occasions: floating arch preview with velocity tilt
    const pv = $('.preview'), pvImg = $('img', pv);
    $$('.occ-list a').forEach(a => { const im = new Image(); im.src = a.dataset.img; });
    if (fine) {
      const px = gsap.quickTo(pv, 'x', { duration: .6, ease: 'power3' }), py = gsap.quickTo(pv, 'y', { duration: .6, ease: 'power3' }), pr = gsap.quickTo(pv, 'rotation', { duration: .5, ease: 'power3' });
      let lx = 0;
      $('.occ-list').addEventListener('pointermove', e => { px(e.clientX + 40); py(e.clientY); pr(Math.max(-14, Math.min(14, (e.clientX - lx) * .5))); lx = e.clientX; });
      $$('.occ-list a').forEach(a => {
        a.addEventListener('pointerenter', () => { pvImg.src = a.dataset.img; gsap.set(pv, { visibility: 'visible' }); gsap.fromTo(pv, { clipPath: archIn, opacity: 1 }, { clipPath: archOut, duration: .7, ease: 'expo.out' }); gsap.fromTo(pvImg, { scale: 1.35 }, { scale: 1, duration: 1, ease: 'expo.out' }); });
        a.addEventListener('pointerleave', () => gsap.to(pv, { clipPath: archIn, duration: .5, ease: 'power3.in', onComplete: () => gsap.set(pv, { visibility: 'hidden' }) }));
      });
    }
    $$('.occ-list li').forEach(li => gsap.from(li, { opacity: 0, y: 60, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 92%' } }));

    // lookbook drift + inner parallax
    gsap.fromTo('.look-track', { x: () => innerWidth * .06 }, { x: () => -($('.look-track').scrollWidth - innerWidth * .92), ease: 'none', scrollTrigger: { trigger: '.looks', start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true } });
    $$('.look img').forEach(img => gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // how: thread draws through the steps
    gsap.to('.steps .line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 70%', scrub: true } });
    $$('.step').forEach((s, i) => gsap.from(s, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } }));

    // enquire + faq
    gsap.from('.enq-form .fields > *, .preview-msg, .enq-actions, .states', { y: 30, opacity: 0, stagger: .07, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '.enq-form', start: 'top 70%' } });
    $$('details').forEach((d, i) => gsap.from(d, { opacity: 0, y: 30, duration: .9, delay: i * .06, ease: 'expo.out', scrollTrigger: { trigger: d, start: 'top 95%' } }));

    // footer wordmark: rise + fisheye hover
    const fc = split($('#foot-word'));
    gsap.from(fc, { yPercent: 105, duration: 1.4, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '#foot-word', start: 'top 95%' } });
    if (fine) {
      const fw = $('#foot-word');
      fw.addEventListener('pointermove', e => fc.forEach(c => { const r = c.getBoundingClientRect(); const d = Math.abs(e.clientX - (r.left + r.width / 2)); const k = Math.max(0, 1 - d / 260); gsap.to(c, { yPercent: -18 * k, scale: 1 + .08 * k, duration: .5, overwrite: 'auto' }); }));
      fw.addEventListener('pointerleave', () => gsap.to(fc, { yPercent: 0, scale: 1, duration: .8, ease: 'elastic.out(1,.5)', stagger: .02 }));
    }

    if (fine) pointerFx();
  }

  /* ---------- pointer: cursor label, magnetic buttons, hero depth ---------- */
  function pointerFx() {
    // cursor label
    const lab = $('.clabel'), lx = gsap.quickTo(lab, 'x', { duration: .5, ease: 'power3' }), ly = gsap.quickTo(lab, 'y', { duration: .5, ease: 'power3' });
    addEventListener('pointermove', e => { lx(e.clientX); ly(e.clientY); });
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('pointerenter', () => { lab.textContent = el.dataset.cursor; gsap.to(lab, { scale: 1, duration: .6, ease: 'expo.out' }); });
      el.addEventListener('pointerleave', () => gsap.to(lab, { scale: 0, duration: .4, ease: 'power3.in' }));
    });

    // magnetic buttons
    $$('[data-magnetic]').forEach(b => {
      const bx = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1,.6)' }), by = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1,.6)' });
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * .3); by((e.clientY - r.top - r.height / 2) * .4); });
      b.addEventListener('pointerleave', () => { bx(0); by(0); });
    });

    // hero depth
    const layers = $$('.hero [data-depth]').map(el => ({ x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }), d: +el.dataset.depth }));
    $('.hero').addEventListener('pointermove', e => { const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5; layers.forEach(l => { l.x(nx * l.d); l.y(ny * l.d); }); });
  }
})();
