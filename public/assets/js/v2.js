(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || (function () { try { return JSON.parse(localStorage.getItem('vp') || '{}').motion === 'reduce'; } catch (e) { return false; } })();
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const loader = $('.loader');
  const root = document.documentElement;
  let prefs = {}; try { prefs = JSON.parse(localStorage.getItem('vp') || '{}'); } catch (e) {}
  const savePrefs = () => { try { localStorage.setItem('vp', JSON.stringify(prefs)); } catch (e) {} };
  const reduceForced = prefs.motion === 'reduce';
  /* customise panel */
  const panel = $('#a11y'), pbtn = $('.a11y-btn');
  const syncPanel = () => {
    $$('[data-set]').forEach(b => { const [k, v] = b.dataset.set.split(':'); b.setAttribute('aria-pressed', String((root.dataset[k] || (k === 'size' ? 'md' : '')) === v)); });
    $('#opt-contrast').setAttribute('aria-pressed', String(root.dataset.contrast === 'high'));
    $('#opt-motion').setAttribute('aria-pressed', String(reduceForced));
  };
  const togglePanel = open => { panel.hidden = !open; pbtn.setAttribute('aria-expanded', String(open)); if (open) $('.opt[aria-pressed=true]', panel).focus(); else pbtn.focus(); };
  pbtn.addEventListener('click', () => togglePanel(panel.hidden));
  $('.x', panel).addEventListener('click', () => togglePanel(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) togglePanel(false); });
  $$('[data-set]').forEach(b => b.addEventListener('click', () => { const [k, v] = b.dataset.set.split(':'); root.dataset[k] = v; prefs[k] = v; savePrefs(); syncPanel(); if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 250); window.dispatchEvent(new Event('vp:change')); }));
  $('#opt-contrast').addEventListener('click', () => { const on = root.dataset.contrast !== 'high'; root.dataset.contrast = on ? 'high' : 'normal'; prefs.contrast = root.dataset.contrast; savePrefs(); syncPanel(); });
  $('#opt-motion').addEventListener('click', () => { prefs.motion = reduceForced ? 'full' : 'reduce'; savePrefs(); location.reload(); });
  $('#opt-reset').addEventListener('click', () => { prefs = {}; try { localStorage.removeItem('vp'); } catch (e) {} location.reload(); });
  syncPanel();
  /* offer bar: rotating messages + live countdown (sample end date: edit SALE_ENDS) */
  const SALE_ENDS = (window.VIRUSTRA_CONFIG && Date.parse(window.VIRUSTRA_CONFIG.saleEnds)) || Date.now() + (3 * 86400 + 12 * 3600 + 40 * 60) * 1000; // saleEnds in assets/js/config.js; empty = demo countdown
  const cd = $('[data-countdown]');
  const tickCd = () => { let t = Math.max(0, SALE_ENDS - Date.now()) / 1000; const d = Math.floor(t / 86400), h = Math.floor(t % 86400 / 3600), m = Math.floor(t % 3600 / 60), sec = Math.floor(t % 60); $$('[data-cd]').forEach(e => { e.textContent = String({ d, h, m, s: sec }[e.dataset.cd]).padStart(2, '0'); }); cd.textContent = `${String(d).padStart(2, '0')}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`; };
  tickCd(); setInterval(tickCd, 1000);
  const barMsgs = $$('.bar-msg span'); let bi = 0;
  if (barMsgs.length > 1 && !reduceForced && !matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => {
    const a = barMsgs[bi], b = barMsgs[(bi + 1) % barMsgs.length]; bi = (bi + 1) % barMsgs.length;
    if (window.gsap) { gsap.to(a, { yPercent: -120, opacity: 0, duration: .6, ease: 'power3.in' }); gsap.fromTo(b, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'power3.out', delay: .25 }); }
  }, 4200);
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
  shop();
  $$('#join-offers, #join-offers-2').forEach(jo => { jo.href = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent("Hi Virustra! Please add me to your offers list for new arrivals and sale alerts."); });

  /* ---------- shop: category filter, rent/buy toggle, sale prices ---------- */
  function shop() {
    const cards = $$('.card'), seg = $('.seg'), segBtns = $$('button', seg), thumb = $('.thumb', seg), tabs = $$('.cat-tabs button'), count = $('#count');
    const G = () => window.gsap && !reduce; let mode = 'rent', filt = 'all';
    const was = (v, p) => '₹' + (Math.round(Number(v.replace(/,/g, '')) / (1 - p / 100) / 100) * 100).toLocaleString('en-IN');
    function price(c) {
      const v = c.dataset[mode], lab = $('.plabel', c), val = $('.pval', c), w = $('.pwas', c), p = Number(c.dataset.sale) || 0;
      if (v) { lab.textContent = mode === 'rent' ? 'Rent from' : 'Buy from'; val.textContent = '₹' + v; w.textContent = p ? was(v, p) : ''; }
      else { lab.textContent = mode === 'rent' ? 'Sale only' : 'Rental only'; val.textContent = '—'; w.textContent = ''; }
    }
    const moveThumb = (b, instant) => { const t = { x: b.offsetLeft, width: b.offsetWidth }; G() && !instant ? gsap.to(thumb, { ...t, duration: .7, ease: 'expo.out' }) : (thumb.style.transform = `translateX(${t.x}px)`, thumb.style.width = t.width + 'px'); if (G() && instant) gsap.set(thumb, { x: t.x, width: t.width }); };
    const curBtn = () => segBtns.find(b => b.getAttribute('aria-pressed') === 'true');
    const place = () => moveThumb(curBtn(), true);
    place(); addEventListener('resize', place); addEventListener('vp:change', () => setTimeout(place, 300)); document.fonts && document.fonts.ready.then(place);
    segBtns.forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.mode; segBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b))); moveThumb(b);
      cards.forEach((c, i) => {
        if (!G()) return price(c);
        gsap.timeline({ delay: i * .04 }).to($('.price', c), { yPercent: -110, opacity: 0, duration: .3, ease: 'power3.in', onComplete: () => price(c) }).fromTo($('.price', c), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .55, ease: 'expo.out' });
      });
    }));
    const match = c => filt === 'all' || (filt === 'sale' ? !!c.dataset.sale : c.dataset.cat === filt);
    function applyFilter(f) {
      filt = f; tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.f === f)));
      const show = cards.filter(match), hide = cards.filter(c => !match(c));
      count.textContent = f === 'all' ? `Showing all ${show.length} pieces` : `Showing ${show.length} ${f === 'sale' ? 'sale' : f} pieces`;
      const done = () => { hide.forEach(c => { c.hidden = true; }); show.forEach(c => { c.hidden = false; }); if (G()) { gsap.fromTo(show, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: .7, stagger: .05, ease: 'expo.out' }); ScrollTrigger.refresh(); } };
      G() ? gsap.to(cards.filter(c => !c.hidden), { opacity: 0, y: 20, duration: .25, ease: 'power2.in', onComplete: done }) : done();
    }
    tabs.forEach(t => t.addEventListener('click', () => applyFilter(t.dataset.f)));
    $$('[data-filter]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.filter)));
    cards.forEach(price);
  }

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
    lenis.stop();
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return; e.preventDefault(); closeMenu();
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

  /* ---------- banner carousel ---------- */
  const bnRoot = $('.banners'), bnSlides = $$('.bn', bnRoot), bnTabs = $$('.bn-tab', bnRoot), bnN = bnSlides.length, bnPlay = $('.bn-play', bnRoot);
  let bnCur = 0, bnBusy = false, bnPlaying = !reduce, bnProg = null;
  const bnChars = bnSlides.map(sl => split($('.bn-title', sl)));
  const bnItems = sl => $$('.bn-copy > :not(.bn-title), .bn-float', sl);
  gsap.set(bnSlides[0], { visibility: 'visible' });
  const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', pauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3.5v14H7zM13.500 5H17v14h-3.500z"/></svg>';
  function bnSyncUi() {
    bnTabs.forEach((t, i) => t.setAttribute('aria-current', String(i === bnCur)));
    bnPlay.innerHTML = bnPlaying ? pauseIcon : playIcon; bnPlay.setAttribute('aria-label', bnPlaying ? 'Pause slideshow' : 'Play slideshow');
    $('.banners').setAttribute('aria-live', bnPlaying ? 'off' : 'polite');
  }
  function bnStart() {
    bnProg && bnProg.kill(); gsap.set($$('i', bnRoot), { scaleX: 0 });
    if (!bnPlaying) return;
    bnProg = gsap.fromTo($('i', bnTabs[bnCur]), { scaleX: 0 }, { scaleX: 1, duration: 6.5, ease: 'none', onComplete: () => bnGo((bnCur + 1) % bnN, 1) });
    if (bnRoot.matches(':hover, :focus-within')) bnProg.pause();
  }
  function bnGo(i, dir = 1) {
    i = (i + bnN) % bnN; if (i === bnCur) return;
    if (bnBusy) return; bnBusy = true;
    const from = bnSlides[bnCur], to = bnSlides[i], ch = bnChars[i];
    bnProg && bnProg.kill();
    gsap.set(to, { visibility: 'visible', zIndex: 3 }); gsap.set(from, { zIndex: 2 });
    bnCur = i; bnSyncUi();
    if (reduce) { gsap.set(from, { visibility: 'hidden', clearProps: 'zIndex' }); gsap.set(to, { clearProps: 'zIndex' }); bnBusy = false; bnStart(); return; }
    const tl = gsap.timeline({ onComplete() { gsap.set(from, { visibility: 'hidden', xPercent: 0, clearProps: 'zIndex' }); gsap.set(to, { clearProps: 'zIndex,clipPath' }); bnBusy = false; bnStart(); } });
    tl.fromTo(to, { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power4.inOut' }, 0)
      .to(from, { xPercent: dir > 0 ? -14 : 14, duration: 1.15, ease: 'power4.inOut' }, 0)
      .fromTo($('.bn-media img, .bn-art img, .bn-duo img, .bn-tri img', to) || to, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0)
      .fromTo($$('.bn-art .bn-arch, .bn-duo .bn-arch, .bn-tri .bn-arch', to), { clipPath: archIn }, { clipPath: archOut, duration: 1.2, ease: 'power4.inOut', stagger: .12, clearProps: 'clipPath' }, .35)
      .from(ch, { yPercent: 115, rotationX: -70, opacity: 0, transformOrigin: '0% 100%', duration: 1.1, stagger: .025, ease: 'expo.out' }, .55)
      .from(bnItems(to), { y: 34, opacity: 0, stagger: .09, duration: .9, ease: 'expo.out' }, .7);
  }
  const bnNext = () => bnGo(bnCur + 1, 1), bnPrev = () => bnGo(bnCur - 1, -1);
  $('.bn-next', bnRoot).addEventListener('click', bnNext); $('.bn-prev', bnRoot).addEventListener('click', bnPrev);
  bnTabs.forEach((t, i) => t.addEventListener('click', () => bnGo(i, i > bnCur ? 1 : -1)));
  bnPlay.addEventListener('click', () => { bnPlaying = !bnPlaying; bnSyncUi(); bnPlaying ? bnStart() : (bnProg && bnProg.kill(), gsap.set($$('i', bnRoot), { scaleX: 0 })); });
  bnRoot.addEventListener('mouseenter', () => bnProg && bnProg.pause()); bnRoot.addEventListener('mouseleave', () => bnProg && !bnBusy && bnProg.resume());
  bnRoot.addEventListener('focusin', () => bnProg && bnProg.pause()); bnRoot.addEventListener('focusout', () => bnProg && !bnBusy && bnProg.resume());
  bnRoot.addEventListener('keydown', e => { if (e.key === 'ArrowRight') bnNext(); if (e.key === 'ArrowLeft') bnPrev(); });
  let sx = null; bnRoot.addEventListener('pointerdown', e => { sx = e.clientX; }); bnRoot.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60) dx < 0 ? bnNext() : bnPrev(); });
  bnSyncUi();
  function heroIntro() {
    const sl = bnSlides[0], tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(bnChars[0], { yPercent: 120, rotationX: -80, opacity: 0, transformOrigin: '0% 100%', duration: 1.3, stagger: .03 }, 0)
      .from(bnItems(sl), { y: 34, opacity: 0, stagger: .1, duration: 1.1 }, .5)
      .from($('.bn-media img', sl), { scale: 1.45, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.nav-l, .nav .logo, .nav-r', { y: -24, opacity: 0, stagger: .1, duration: 1 }, .6)
      .from('.bn-ui', { opacity: 0, y: 20, duration: 1 }, 1.1)
      .call(bnStart, null, 1.4);
    return tl;
  }
  const filterLinks = () => {};

  /* ---------- loader ---------- */
  let seen = false; try { seen = sessionStorage.getItem('vl') === '1'; sessionStorage.setItem('vl', '1'); } catch (e) {}
  function finish() { loader.remove(); document.documentElement.classList.remove('lock'); lenis && lenis.start(); initScroll(); }
  if (reduce) { loader.remove(); initScroll(); bnSyncUi(); }
  else {
    document.documentElement.classList.add('lock');
    const ring = $('.ring'); gsap.set(ring, { strokeDasharray: 565.5, strokeDashoffset: 565.5 });
    const tl = gsap.timeline({ onComplete: finish });
    tl.from('.loader-logo', { opacity: 0, scale: .8, duration: 1.1, ease: 'power3.out' })
      .to(ring, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, .15)
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
    const nav = $('.nav'), bar = $('.bar'); let hidden = false;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
      nav.classList.toggle('solid', s.scroll() > 60); nav.style.top = Math.max(0, bar.offsetHeight - s.scroll()) + 'px';
      const hide = s.direction === 1 && s.scroll() > 500;
      if (hide !== hidden) { hidden = hide; gsap.to(nav, { yPercent: hide ? -100 : 0, duration: .5, ease: 'power3.out' }); }
    } });
    if (reduce) return;

    // spine needle
    gsap.to('.spine i', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.to('.spine b', { top: '100%', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

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

    scenes();

    // lookbook drift + inner parallax
    gsap.fromTo('.look-track', { x: () => innerWidth * .06 }, { x: () => -($('.look-track').scrollWidth - innerWidth * .92), ease: 'none', scrollTrigger: { trigger: '.looks', start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true } });
    $$('.look img').forEach(img => gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // how: thread draws through the steps
    gsap.to('.steps .line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 70%', scrub: true } });
    $$('.step').forEach((s, i) => gsap.from(s, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } }));

    // enquire + faq
    gsap.from('.enq-form .fields > *, .preview-msg, .enq-actions, .states', { y: 30, opacity: 0, stagger: .07, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '.enq-form', start: 'top 70%' } });
    $$('details').forEach((d, i) => gsap.from(d, { opacity: 0, y: 30, duration: .9, delay: i * .06, ease: 'expo.out', scrollTrigger: { trigger: d, start: 'top 95%' } }));

    // footer: atelier photo wipe + column rise
    gsap.fromTo('.atelier-img img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.atelier', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.atelier-copy > *', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.atelier', start: 'top 70%' } });
    gsap.from('.foot-join > *, .foot-cols > div', { y: 40, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.foot-join', start: 'top 90%' } });

    if (fine) pointerFx();
    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------- Apple-style pinned, scroll-scrubbed scenes ---------- */
  function scenes() {
    const mob = innerWidth < 900;
    // 1) reveal: arch grows to full-bleed while the words part
    const rv = $('.reveal'); rv.classList.add('pin');
    const media = $('.rv-media', rv), mimg = $('img', media);
    const closed = mob ? 'inset(22% 16% 22% 16% round 999px 999px 0px 0px)' : 'inset(16% 34% 16% 34% round 999px 999px 0px 0px)';
    const open = 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)';
    gsap.timeline({ scrollTrigger: { trigger: rv, start: 'top top', end: () => '+=' + innerHeight * 2.4, pin: true, scrub: .7, anticipatePin: 1, refreshPriority: 2, invalidateOnRefresh: true } })
      .fromTo(media, { clipPath: closed }, { clipPath: open, duration: 3, ease: 'power2.inOut' }, 0)
      .fromTo(mimg, { scale: 1.5 }, { scale: 1, duration: 3, ease: 'none' }, 0)
      .fromTo('.rv-a', { xPercent: 0 }, { xPercent: -45, duration: 2.4, ease: 'power1.in' }, .2)
      .fromTo('.rv-b', { xPercent: 0 }, { xPercent: 45, duration: 2.4, ease: 'power1.in' }, .2)
      .to('.rv-words span', { opacity: 0, duration: .8 }, 1.8)
      .fromTo('.rv-copy > *', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: .25, duration: 1 }, 2.4)
      .to({}, { duration: .8 });

    // 2) chapters: image wipes between occasions, giant type drifts
    const sec = $('.chapters'); sec.classList.add('pin');
    const chs = $$('.ch', sec), n = chs.length;
    chs.forEach((c, i) => gsap.set(c, { autoAlpha: i ? 0 : 1, zIndex: i + 1 }));
    const kids = c => $$('.ch-n, h3, p, a', c);
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + innerHeight * (n * 1.1), pin: true, scrub: .8, anticipatePin: 1, refreshPriority: 1, invalidateOnRefresh: true } });
    tl.fromTo('.ch-prog i', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: n }, 0)
      .fromTo('.ch-bg', { xPercent: 0 }, { xPercent: -72, ease: 'none', duration: n }, 0);
    for (let i = 1; i < n; i++) {
      const t = i, c = chs[i], prev = chs[i - 1], im = $('.ch-img', c), ii = $('img', c);
      tl.set(c, { autoAlpha: 1 }, t)
        .fromTo(im, { clipPath: archIn }, { clipPath: archOut, duration: .8 }, t)
        .fromTo(ii, { scale: 1.45 }, { scale: 1, duration: 1 }, t)
        .to(kids(prev), { y: -40, opacity: 0, duration: .4, stagger: .03 }, t)
        .to($('img', prev), { scale: 1.12, duration: 1 }, t)
        .fromTo(kids(c), { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .6, ease: 'power3.out' }, t + .35)
        .set(prev, { autoAlpha: 0 }, t + .85);
    }
    tl.to({}, { duration: .1 });
  }

  /* ---------- pointer: cursor label + magnetic buttons ---------- */
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

  }
})();
