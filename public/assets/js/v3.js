/* Virustra v3 — extra motion layer (only used by /v3/). Loads after main.js + fx.js.
   Everything runs inside safe() so a failure never breaks the page. */
(() => {
  'use strict';
  if (!window.gsap) return;
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const safe = fn => { try { fn(); } catch (e) { console.warn('[v3]', fn.name, e); } };

  function init() {
    safe(toTop);
    if (reduce) return;
    safe(headingWeight); safe(kinetic); safe(sheets); safe(studioReveal);
    if (fine) { safe(spotlight); safe(weightWave); safe(heroTilt); }
    // v3 re-times the scroll triggers created after us, so measure once everything exists
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 60);
  }
  if (window.__vrReady) init(); else addEventListener('vr:ready', init, { once: true });

  /* ---- variable-weight headings: letters thicken as a heading arrives ---- */
  function headingWeight() {
    $$('.sec-head h2, .enq-form h2, .rv-copy h2').forEach(h => {
      gsap.fromTo(h, { '--wg': 300 }, { '--wg': 520, ease: 'none', scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 45%', scrub: true } });
    });
  }

  /* ---- hero headline: weight swells under the pointer (variable font axis) ---- */
  function weightWave() {
    const chars = $$('#hero-title .c'); const hero = $('.hero'); if (!chars.length || !hero) return;
    let px = -9999, py = -9999, on = true;
    const st = chars.map(() => ({ w: 500 }));
    new IntersectionObserver(e => { on = e[0].isIntersecting; }).observe(hero);
    hero.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; });
    hero.addEventListener('pointerleave', () => { px = py = -9999; });
    gsap.ticker.add(() => {
      if (!on) return;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect(); const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const target = 500 + 190 * Math.max(0, 1 - d / 240);
        const s = st[i]; s.w += (target - s.w) * .14;
        if (Math.abs(target - s.w) > .4 || s.dirty) { c.style.fontWeight = s.w.toFixed(0); s.dirty = Math.abs(s.w - 500) > .5; }
      });
    });
  }

  /* ---- soft gold spotlight that follows the pointer on dark sections ---- */
  function spotlight() {
    $$('.hero, .occ, .how, .studio, .kband').forEach(sec => {
      sec.classList.add('spot');
      sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(); sec.style.setProperty('--mx', (e.clientX - r.left) + 'px'); sec.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    });
  }

  /* ---- 3D tilt on the hero arch ---- */
  function heroTilt() {
    const el = $('.hero-main'), hero = $('.hero'); if (!el || !hero) return;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: .9, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: .9, ease: 'power3' });
    hero.addEventListener('pointermove', e => { ry((e.clientX / innerWidth - .5) * 9); rx(-(e.clientY / innerHeight - .5) * 7); });
    hero.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  /* ---- kinetic outline type: two bands, opposite directions, speed follows scroll ---- */
  function kinetic() {
    const rows = $$('.krow'); if (!rows.length) return;
    const st = rows.map((row, i) => ({ row, x: 0, dir: i % 2 ? 1 : -1, base: i % 2 ? .7 : 1.15 }));
    let boost = 0, scrollDir = 1;
    ScrollTrigger.create({ onUpdate: s => { boost = Math.min(Math.abs(s.getVelocity()) / 260, 12); scrollDir = s.direction; } });
    let on = true; new IntersectionObserver(e => { on = e[0].isIntersecting; }).observe($('.kband'));
    gsap.ticker.add(() => {
      if (!on) return; boost *= .93;
      st.forEach(s => {
        const half = s.row.scrollWidth / 2; s.x += s.dir * (scrollDir === 1 ? 1 : -1) * (s.base + boost);
        if (s.x <= -half) s.x += half; if (s.x > 0) s.x -= half; gsap.set(s.row, { x: s.x });
      });
    });
  }

  /* ---- sections slide over each other like sheets; the covered section recedes ---- */
  function sheets() {
    $$('.sheet').forEach(sec => {
      const prev = sec.previousElementSibling; if (!prev) return;
      gsap.to([...prev.children], { scale: .95, opacity: .35, y: -40, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 15%', scrub: true } });
    });
  }

  /* ---- studio entrance ---- */
  function studioReveal() {
    const st = $('.studio-stage'); if (!st) return;
    gsap.from(st, { y: 70, opacity: 0, scale: .96, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 88%', once: true } });
    gsap.from($$('.studio-ui > *'), { y: 36, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.studio-ui', start: 'top 88%', once: true } });
  }

  /* ---- back-to-top with a scroll-progress ring ---- */
  function toTop() {
    const b = $('.totop'); if (!b) return;
    const ring = $('.prog', b), C = 132;
    const upd = () => { const max = document.documentElement.scrollHeight - innerHeight; const p = max > 0 ? scrollY / max : 0; ring.style.strokeDashoffset = (C * (1 - p)).toFixed(1); b.classList.toggle('on', scrollY > 700); };
    addEventListener('scroll', upd, { passive: true }); upd();
    b.addEventListener('click', () => {
      const t = $('#top');
      if (window.vrNavigate && t && window.vrNavigate(t)) return;
      window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
