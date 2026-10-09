/* Virustra — advanced motion layer. Loads after main.js.
   Needs GSAP 3.13 + ScrollTrigger + Flip + SplitText (all self-hosted in /assets/vendor/gsap-3.13/).
   Starts when main.js finishes the intro and fires `vr:ready`. Everything here is optional: if this
   file fails, the page still works exactly like the base build. */
(() => {
  'use strict';
  if (!window.gsap) return;
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const plugins = [window.ScrollTrigger, window.Flip, window.SplitText].filter(Boolean);
  gsap.registerPlugin(...plugins);
  const archIn = 'inset(100% 0% 0% 0%)', archOut = 'inset(0% 0% 0% 0%)';
  const safe = fn => { try { fn(); } catch (e) { console.warn('[fx]', fn.name, e); } };

  function init() {
    safe(roll); safe(glare); safe(quickView); safe(burst);
    if (!reduce) { safe(curtain); safe(reveal); safe(lines); safe(pleats); safe(skew); }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  if (window.__vrReady) init(); else addEventListener('vr:ready', init, { once: true });

  /* ---- text roll on hover (nav links + buttons) ---- */
  function roll() {
    $$('.nav ul a, .btn').forEach(el => {
      if (el.querySelector('.roll')) return;
      const nodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
      if (nodes.length !== 1) return;
      const txt = nodes[0].textContent.trim();
      const w = document.createElement('span'); w.className = 'roll';
      [false, true].forEach(dup => { const s = document.createElement('span'); s.textContent = txt; if (dup) s.setAttribute('aria-hidden', 'true'); w.appendChild(s); });
      nodes[0].replaceWith(w);
    });
  }

  /* ---- specular glare following the pointer on product images ---- */
  function glare() {
    if (!fine) return;
    $$('.card-fig').forEach(f => f.addEventListener('pointermove', e => {
      const r = f.getBoundingClientRect();
      f.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      f.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    }));
  }

  /* ---- silk-pleat curtain for long in-page jumps ---- */
  function curtain() {
    const c = $('.curtain'); if (!c) return;
    const strips = $$('i', c); let busy = false;
    window.vrNavigate = target => {
      const y = target.getBoundingClientRect().top;
      if (Math.abs(y) < innerHeight * 1.4) return false;   // short hop: normal smooth scroll
      if (busy) return true; busy = true;
      const L = window.__lenis;
      c.style.visibility = 'visible'; c.style.pointerEvents = 'all'; L && L.stop();
      gsap.timeline({ onComplete() { c.style.visibility = 'hidden'; c.style.pointerEvents = 'none'; L && L.start(); busy = false; } })
        .set(strips, { transformOrigin: '50% 100%', scaleY: 0 })
        .to(strips, { scaleY: 1, duration: .55, ease: 'expo.inOut', stagger: { each: .05, from: 'center' } })
        .add(() => { L ? L.scrollTo(target, { immediate: true, force: true, offset: -40 }) : window.scrollTo(0, scrollY + y - 40); ScrollTrigger.update(); })
        .set(strips, { transformOrigin: '50% 0%' })
        .to(strips, { scaleY: 0, duration: .75, ease: 'expo.inOut', stagger: { each: .05, from: 'edges' } }, '+=.1');
      return true;
    };
  }

  /* ---- pinned scene: an arch grows to full-bleed while the words part ---- */
  function reveal() {
    const rv = $('.reveal'); if (!rv) return;
    rv.classList.add('pin');
    const media = $('.rv-media', rv), mimg = $('img', media), mob = innerWidth < 900;
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
  }

  /* ---- line-by-line masked text reveals (SplitText) ---- */
  function lines() {
    if (!window.SplitText) return;
    $$('.sec-head p:not(.eyebrow), .story-side p, .enq-form > p, .how .note').forEach(el => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
        onSplit: self => gsap.from(self.lines, { yPercent: 110, opacity: 0, duration: 1.1, stagger: .09, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      });
    });
  }

  /* ---- images revealed by six silk pleats lifting away ---- */
  function pleats() {
    $$('[data-pleat]').forEach(box => {
      const ov = document.createElement('span'); ov.className = 'pleats-ov'; ov.setAttribute('aria-hidden', 'true'); ov.innerHTML = '<i></i>'.repeat(6);
      box.appendChild(ov);
      gsap.to($$('i', ov), { scaleY: 0, duration: 1.2, ease: 'expo.inOut', stagger: { each: .08, from: 'edges' }, scrollTrigger: { trigger: box, start: 'top 88%', once: true } });
    });
  }

  /* ---- lookbook cards lean with scroll velocity ---- */
  function skew() {
    const items = $$('.look'); if (!items.length) return;
    const set = gsap.quickSetter(items, 'skewX', 'deg'); let cur = 0, tgt = 0;
    ScrollTrigger.create({ trigger: '.looks', start: 'top bottom', end: 'bottom top', onUpdate: s => { tgt = gsap.utils.clamp(-9, 9, -s.getVelocity() / 350); } });
    gsap.ticker.add(() => { cur += (tgt - cur) * .12; tgt *= .9; if (Math.abs(cur) > .01 || Math.abs(tgt) > .01) set(cur); });
  }

  /* ---- gold-sequin burst when an enquiry is sent ---- */
  function burst() {
    const wa = $('#wa'); if (!wa || reduce) return;
    wa.addEventListener('click', () => {
      const r = wa.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const cv = document.createElement('canvas'); cv.className = 'burst'; cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
      const ctx = cv.getContext('2d'), cols = ['#DAAF87', '#F0D5B4', '#C9965F', '#FFF3D6', '#8A5A2E'];
      const P = Array.from({ length: 90 }, () => { const a = Math.random() * 6.283, v = 4 + Math.random() * 10; return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, s: 2 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[(Math.random() * cols.length) | 0], sq: Math.random() < .5 }; });
      const t0 = performance.now();
      const tick = () => {
        const k = (performance.now() - t0) / 1900;
        ctx.clearRect(0, 0, cv.width, cv.height);
        P.forEach(p => { p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; p.sq ? ctx.fillRect(-p.s, -p.s / 2, p.s * 2, p.s) : (ctx.beginPath(), ctx.arc(0, 0, p.s / 1.5, 0, 6.283), ctx.fill()); ctx.restore(); });
        if (k >= 1) { gsap.ticker.remove(tick); cv.remove(); }
      };
      gsap.ticker.add(tick);
    });
  }

  /* ---- product quick view: the photo morphs from the card into a detail panel (Flip) ---- */
  function quickView() {
    const qv = $('.qv'); if (!qv || !window.Flip) return;
    const bg = $('.qv-bg', qv), paper = $('.qv-paper', qv), box = $('.qv-img', qv), x = $('.qv-x', qv), cta = $('.qv-cta .btn', qv);
    const info = $$('.qv-info > *', qv), lbl = { title: $('#qv-title'), occ: $('.qv-occ'), rent: $('[data-qv=rent]'), buy: $('[data-qv=buy]') };
    let card = null, img = null, home = null, opener = null, busy = false;
    const money = v => v ? '₹' + v : '—';

    function open(c, trigger) {
      if (busy || card) return; busy = true; card = c; opener = trigger;
      home = $('.card-fig', c); img = $('img', home);
      lbl.title.textContent = c.dataset.name; lbl.occ.textContent = $('.eyebrow', c).textContent;
      lbl.rent.textContent = money(c.dataset.rent); lbl.buy.textContent = money(c.dataset.buy);
      lbl.rent.parentElement.classList.toggle('na', !c.dataset.rent); lbl.buy.parentElement.classList.toggle('na', !c.dataset.buy);
      document.documentElement.classList.add('lock'); window.__lenis && window.__lenis.stop();
      qv.removeAttribute('hidden'); qv.classList.add('open');
      gsap.set(home, { clipPath: 'none', overflow: 'visible' });
      const state = Flip.getState(img);
      box.appendChild(img);
      const done = () => { busy = false; x.focus(); };
      if (reduce) { gsap.set([bg, paper], { opacity: 1 }); done(); return; }
      gsap.to(bg, { opacity: 1, duration: .5 });
      gsap.to(paper, { opacity: 1, duration: .6, delay: .15 });
      gsap.fromTo(info, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .07, ease: 'expo.out', delay: .45 });
      Flip.from(state, { duration: .95, ease: 'expo.inOut', scale: false, onComplete: done });
    }
    function close() {
      if (busy || !card) return; busy = true;
      const finish = () => {
        gsap.set(img, { clearProps: 'all' }); home.insertBefore(img, home.firstChild);
        gsap.set(home, { clearProps: 'overflow' }); gsap.set(home, { clipPath: archOut });
        qv.classList.remove('open'); qv.setAttribute('hidden', ''); gsap.set([bg, paper], { opacity: 0 });
        document.documentElement.classList.remove('lock'); window.__lenis && window.__lenis.start();
        const o = opener; card = null; busy = false; o && o.focus && o.focus();
      };
      if (reduce) { finish(); return; }
      gsap.to(info, { y: 20, opacity: 0, duration: .3, stagger: .03 });
      gsap.to(paper, { opacity: 0, duration: .45, delay: .1 });
      gsap.to(bg, { opacity: 0, duration: .7, delay: .2 });
      Flip.fit(img, home, { duration: .9, ease: 'expo.inOut', scale: false, onComplete: finish });
    }
    // capture phase so the generic "#enquire" anchor handler never sees the click
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('.card-fig'); if (!a) return;
      e.preventDefault(); e.stopPropagation(); open(a.closest('.card'), a);
    }, true);
    x.addEventListener('click', close);
    bg.addEventListener('click', close);
    qv.addEventListener('click', e => { if (e.target === qv) close(); });
    cta.addEventListener('click', () => { const c = card, pick = c && $('[data-pick]', c); close(); setTimeout(() => pick && pick.click(), reduce ? 0 : 950); });
    addEventListener('keydown', e => {
      if (!card) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = $$('button, a[href]', qv).filter(n => n.offsetParent !== null); if (!f.length) return; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    });
  }
})();
