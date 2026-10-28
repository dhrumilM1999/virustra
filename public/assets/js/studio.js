/* Virustra 3D type studio.
   Extrudes real font outlines (opentype.js) and the Devanagari logo (SVG) into 3D, lit by a studio
   environment. Three.js is loaded lazily, only when the section is near the viewport. */
const root = document.getElementById('studio');
if (root) {
  const $ = (s, c = root) => c.querySelector(s), $$ = (s, c = root) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = $('.studio-stage'), canvas = $('#studio-canvas'), loadEl = $('.studio-load'), fallback = $('.studio-fallback');
  const url = p => new URL(p, import.meta.url).href;

  const FONTS = {
    'cormorant-i': { file: '../vendor/fonts/cormorant-600i.ttf', name: 'Cormorant Garamond Italic' },
    cormorant: { file: '../vendor/fonts/cormorant-600.ttf', name: 'Cormorant Garamond' },
    bodoni: { file: '../vendor/fonts/bodoni-700.ttf', name: 'Bodoni Moda' },
    montserrat: { file: '../vendor/fonts/montserrat-700.ttf', name: 'Montserrat' },
    logo: { svg: '../img/logo.svg', name: 'Devanagari logo' }
  };
  const MATS = {
    gold: { name: 'antique gold', color: 0xf0c36b, metalness: 1, roughness: .16 },
    rose: { name: 'Virustra rose-gold', color: 0xeab596, metalness: 1, roughness: .2 },
    silver: { name: 'silver', color: 0xe6e7ec, metalness: 1, roughness: .16 },
    wine: { name: 'wine velvet', color: 0x4a0710, metalness: 0, roughness: .92, sheen: .7, sheenColor: 0xb0303f, sheenRoughness: .5, env: .35 },
    ivory: { name: 'ivory porcelain', color: 0xf7f0e6, metalness: 0, roughness: .3, clearcoat: 1, clearcoatRoughness: .15, env: .8 }
  };
  const state = { font: 'cormorant-i', mat: 'gold', text: 'Virustra', depth: .35, auto: !reduce };

  let THREE, renderer, scene, camera, pivot, mesh, material, opentype, SVGLoader, ready = false, running = false, visible = false;
  const rot = { x: 0, y: 0, vx: 0, vy: 0, spin: 0, hx: 0, hy: 0, scroll: 0 };
  const fontCache = {}; let logoText = null, building = 0;

  const setLoad = msg => { if (!loadEl) return; if (msg) { loadEl.textContent = msg; loadEl.classList.remove('done'); } else loadEl.classList.add('done'); };

  async function boot() {
    try {
      setLoad('Loading 3D…');
      THREE = await import('three');
      const { RoomEnvironment } = await import(url('../vendor/three/RoomEnvironment.js'));
      ({ SVGLoader } = await import(url('../vendor/three/SVGLoader.js')));
      await new Promise((res, rej) => { const s = document.createElement('script'); s.src = url('../vendor/opentype.min.js'); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
      opentype = window.opentype;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      scene = new THREE.Scene();
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
      camera = new THREE.PerspectiveCamera(30, 16 / 10, .1, 100); camera.position.set(0, 0, 9);
      const key = new THREE.DirectionalLight(0xfff0d6, 3.2); key.position.set(3, 4, 7); scene.add(key);
      const fill = new THREE.PointLight(0xffd7a0, 40, 30, 1.6); fill.position.set(-4, -1.5, 6); scene.add(fill);
      const top = new THREE.PointLight(0xffffff, 28, 30, 1.6); top.position.set(0, 5, 3); scene.add(top);
      const rim = new THREE.DirectionalLight(0xff9a7a, 1.6); rim.position.set(-5, 1, -3); scene.add(rim);
      scene.add(new THREE.AmbientLight(0xffffff, .15));
      pivot = new THREE.Group(); scene.add(pivot);
      material = makeMaterial();
      resize(); new ResizeObserver(resize).observe(stage);
      ready = true; await rebuild(true); setLoad(null); wire();
    } catch (err) {
      console.warn('[studio]', err);
      if (fallback) fallback.hidden = false; setLoad(null);
    }
  }

  function makeMaterial() {
    const m = MATS[state.mat]; const p = { color: m.color, metalness: m.metalness, roughness: m.roughness, envMapIntensity: m.env ?? 1.7, side: THREE.DoubleSide };
    if (m.sheen) Object.assign(p, { sheen: m.sheen, sheenColor: new THREE.Color(m.sheenColor), sheenRoughness: m.sheenRoughness });
    if (m.clearcoat) Object.assign(p, { clearcoat: m.clearcoat, clearcoatRoughness: m.clearcoatRoughness });
    return new THREE.MeshPhysicalMaterial(p);
  }

  const loadFont = key => fontCache[key] || (fontCache[key] = new Promise((res, rej) => opentype.load(url(FONTS[key].file), (e, f) => e ? rej(e) : res(f))));

  function shapesFromFont(font, text) {
    const path = font.getPath(text, 0, 0, 100), sp = new THREE.ShapePath();
    path.commands.forEach(c => {
      if (c.type === 'M') sp.moveTo(c.x, -c.y);
      else if (c.type === 'L') sp.lineTo(c.x, -c.y);
      else if (c.type === 'Q') sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
      else if (c.type === 'C') sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
    });
    return sp.toShapes(false);
  }

  async function makeGeometry() {
    const depth = 100 * state.depth;
    const opts = { depth, bevelEnabled: true, bevelThickness: 2.6, bevelSize: 2.2, bevelSegments: 5, curveSegments: 12 };
    if (state.font === 'logo') {
      logoText = logoText || await fetch(url(FONTS.logo.svg)).then(r => r.text());
      const data = new SVGLoader().parse(logoText), shapes = [];
      data.paths.forEach(p => shapes.push(...SVGLoader.createShapes(p)));
      const g = new THREE.ExtrudeGeometry(shapes, { ...opts, depth: depth * .5, bevelThickness: 1.6, bevelSize: 1.4 });
      g.rotateX(Math.PI);   // SVG is y-down; a half-turn about X stands it upright without mirroring
      return g;
    }
    const font = await loadFont(state.font);
    const shapes = shapesFromFont(font, state.text || ' ');
    return new THREE.ExtrudeGeometry(shapes, opts);
  }

  async function rebuild(first) {
    const id = ++building;
    const geo = await makeGeometry(); if (id !== building) { geo.dispose(); return; }
    geo.computeBoundingBox(); geo.center(); geo.computeVertexNormals();
    if (mesh) { pivot.remove(mesh); mesh.geometry.dispose(); }
    mesh = new THREE.Mesh(geo, material); pivot.add(mesh);
    fit(); describe();
    if (!first && window.gsap && !reduce) {
      gsap.fromTo(pivot.scale, { x: .72, y: .72, z: .72 }, { x: 1, y: 1, z: 1, duration: 1, ease: 'expo.out' });
      gsap.fromTo(rot, { spin: Math.PI * 1.4 }, { spin: 0, duration: 1.3, ease: 'expo.out' });
    }
    render();
  }

  function fit() {
    if (!mesh) return;
    const b = mesh.geometry.boundingBox, w = b.max.x - b.min.x, h = b.max.y - b.min.y;
    const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), vw = vh * camera.aspect;
    const s = Math.min(vw * .74 / w, vh * .58 / h); mesh.scale.setScalar(s);
  }

  function resize() {
    if (!renderer) return;
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); fit(); render();
  }

  function describe() {
    const label = state.font === 'logo' ? `3D preview of the Virustra Devanagari logo in ${MATS[state.mat].name}` : `3D preview of “${state.text}” in ${FONTS[state.font].name}, ${MATS[state.mat].name}`;
    canvas.setAttribute('aria-label', label);
  }

  function render() { if (renderer && ready) { applyRotation(performance.now()); renderer.render(scene, camera); } }

  function applyRotation(t) {
    const sway = state.auto ? Math.sin(t * .00055) * .42 : 0;
    pivot.rotation.y = rot.y + sway + rot.spin + rot.hx * .22 + rot.scroll;
    pivot.rotation.x = rot.x + rot.hy * .14 + (state.auto ? Math.sin(t * .0004) * .06 : 0);
    pivot.position.y = Math.sin(t * .0009) * .05 * (state.auto ? 1 : 0);
  }

  function loop() {
    if (!running) return;
    rot.y += rot.vy; rot.x += rot.vx; rot.vy *= .93; rot.vx *= .93; rot.x = Math.max(-.6, Math.min(.6, rot.x));
    render(); requestAnimationFrame(loop);
  }
  function start() { if (running || !ready || !visible || document.hidden) return; running = true; requestAnimationFrame(loop); }
  function stop() { running = false; }

  function wire() {
    // drag to rotate (with a little inertia), pointer hover tilts gently
    let drag = false, lx = 0, ly = 0;
    stage.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect(); rot.hx = ((e.clientX - r.left) / r.width - .5) * 2; rot.hy = ((e.clientY - r.top) / r.height - .5) * 2;
      if (!drag) return; rot.vy = (e.clientX - lx) * .0035; rot.vx = (e.clientY - ly) * .0022; lx = e.clientX; ly = e.clientY;
    });
    const up = () => { drag = false; stage.classList.remove('drag'); };
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    stage.addEventListener('pointerleave', () => { rot.hx = rot.hy = 0; });
    addEventListener('scroll', () => { const r = stage.getBoundingClientRect(); rot.scroll = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight)) * -.35; if (!running) render(); }, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    new IntersectionObserver(e => { visible = e[0].isIntersecting; visible ? start() : stop(); }, { threshold: .05 }).observe(stage);

    // controls
    const press = (sel, key, val) => $$(sel).forEach(b => b.setAttribute('aria-pressed', String(b.dataset[key] === val)));
    $$('[data-font]').forEach(b => b.addEventListener('click', () => { state.font = b.dataset.font; press('[data-font]', 'font', state.font); $('#st-text').disabled = state.font === 'logo'; rebuild(); }));
    $$('[data-mat]').forEach(b => b.addEventListener('click', () => { state.mat = b.dataset.mat; press('[data-mat]', 'mat', state.mat); material.dispose(); material = makeMaterial(); if (mesh) mesh.material = material; describe(); render(); }));
    let t; $('#st-text').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { state.text = e.target.value.replace(/[^\p{L}\p{N} ]/gu, '').slice(0, 14) || 'Virustra'; rebuild(); }, 160); });
    $('#st-depth').addEventListener('input', e => { state.depth = +e.target.value; clearTimeout(t); t = setTimeout(() => rebuild(), 120); });
    const auto = $('#st-auto'); auto.setAttribute('aria-pressed', String(state.auto)); auto.addEventListener('click', () => { state.auto = !state.auto; auto.setAttribute('aria-pressed', String(state.auto)); auto.textContent = state.auto ? 'Auto-sway: on' : 'Auto-sway: off'; render(); });
    auto.textContent = state.auto ? 'Auto-sway: on' : 'Auto-sway: off';
    $('#st-save').addEventListener('click', () => { render(); const a = document.createElement('a'); a.download = 'virustra-3d-type.png'; a.href = canvas.toDataURL('image/png'); a.click(); });
    start();
  }

  // lazy: only pull in three.js when the section is close to the viewport
  const ioBoot = new IntersectionObserver(e => { if (e[0].isIntersecting) { ioBoot.disconnect(); boot(); } }, { rootMargin: '900px 0px' });
  ioBoot.observe(root);
  window.__studio = { state, render, rebuild: () => rebuild(), get ready() { return ready; } };
}
