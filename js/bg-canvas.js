/* ========================================
   ANVESHANE — Canvas Motion Graphics Background
   Smooth animated grid + particles + beams
   ======================================== */

(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  canvas.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'width:100%', 'height:100%',
    'z-index:-1',         // sits above dark aura (-2) but below all positioned content
    'pointer-events:none',
    'display:block',
  ].join(';');

  // Insert immediately after ambient-aura div so layering is correct
  const aura = document.querySelector('.ambient-aura');
  if (aura) {
    aura.insertAdjacentElement('afterend', canvas);
  } else {
    document.body.insertAdjacentElement('afterbegin', canvas);
  }

  const ctx = canvas.getContext('2d');

  // ---- Config ----
  const CFG = {
    nodeCount: 55,
    connectDist: 180,
    nodeSpeed: 0.35,
    nodeRadius: 1.8,
    lineOpacity: 0.12,
    nodeOpacity: 0.55,
    gridSize: 80,
    gridOpacity: 0.035,
    beamCount: 3,
    beamSpeed: 1.4,
    palette: [
      { r: 255, g: 215, b: 0 },   // gold
      { r: 6,   g: 182, b: 212 }, // cyan
      { r: 139, g: 92,  b: 246 }, // purple
      { r: 236, g: 72,  b: 153 }, // pink (rare)
    ],
  };

  let W, H, nodes, beams, dpr;

  // ---- Resize ----
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---- Nodes ----
  function createNode(i) {
    const col = CFG.palette[Math.floor(Math.random() * (CFG.palette.length - 1))]; // skip pink mostly
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * (0.15 + Math.random() * CFG.nodeSpeed),
      vy: Math.sin(angle) * (0.15 + Math.random() * CFG.nodeSpeed),
      r: CFG.nodeRadius * (0.6 + Math.random() * 0.8),
      col,
      pulse: Math.random() * Math.PI * 2, // phase offset
    };
  }

  function initNodes() {
    nodes = Array.from({ length: CFG.nodeCount }, (_, i) => createNode(i));
  }

  // ---- Beams (horizontal glowing scan lines) ----
  function createBeam() {
    const col = CFG.palette[Math.floor(Math.random() * CFG.palette.length)];
    return {
      y: Math.random() * H,
      speed: (0.5 + Math.random() * CFG.beamSpeed) * (Math.random() > 0.5 ? 1 : -1),
      col,
      width: 1 + Math.random() * 1.5,
      opacity: 0.06 + Math.random() * 0.08,
      length: 0.3 + Math.random() * 0.5, // fraction of W
    };
  }

  function initBeams() {
    beams = Array.from({ length: CFG.beamCount }, createBeam);
  }

  // ---- Draw grid ----
  function drawGrid(t) {
    const offset = (t * 8) % CFG.gridSize;  // slow drift
    ctx.save();
    ctx.strokeStyle = `rgba(0, 212, 255, ${CFG.gridOpacity})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = -CFG.gridSize + (offset % CFG.gridSize); x < W + CFG.gridSize; x += CFG.gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = -CFG.gridSize + (offset % CFG.gridSize); y < H + CFG.gridSize; y += CFG.gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    // Larger accent grid (counter-scroll for parallax)
    const offset2 = (t * 3) % (CFG.gridSize * 4);
    ctx.strokeStyle = `rgba(255, 215, 0, ${CFG.gridOpacity * 0.6})`;
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    for (let x = -CFG.gridSize * 4 + (offset2 % (CFG.gridSize * 4)); x < W + CFG.gridSize * 4; x += CFG.gridSize * 4) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = -CFG.gridSize * 4 + (offset2 % (CFG.gridSize * 4)); y < H + CFG.gridSize * 4; y += CFG.gridSize * 4) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ---- Draw beams ----
  function drawBeams(t) {
    beams.forEach(b => {
      b.y += b.speed * 0.4;
      if (b.y < -20) b.y = H + 20;
      if (b.y > H + 20) b.y = -20;

      const grad = ctx.createLinearGradient(0, b.y, W, b.y);
      const { r, g, bl: blue = b.col.b, col = b.col } = { bl: b.col.b, col: b.col };
      grad.addColorStop(0,           `rgba(${col.r},${col.g},${col.b},0)`);
      grad.addColorStop(0.2,         `rgba(${col.r},${col.g},${col.b},${b.opacity})`);
      grad.addColorStop(0.5,         `rgba(${col.r},${col.g},${col.b},${b.opacity * 1.5})`);
      grad.addColorStop(0.8,         `rgba(${col.r},${col.g},${col.b},${b.opacity})`);
      grad.addColorStop(1,           `rgba(${col.r},${col.g},${col.b},0)`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = b.width;
      ctx.beginPath();
      ctx.moveTo(0, b.y);
      ctx.lineTo(W, b.y);
      ctx.stroke();
      ctx.restore();
    });
  }

  // ---- Draw nodes + connections ----
  function drawNodes(t) {
    // connections first (drawn under nodes)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.connectDist) {
          const fade = 1 - dist / CFG.connectDist;
          const { r, g, bl: blue = a.col.b, col = a.col } = { bl: a.col.b, col: a.col };
          ctx.save();
          ctx.globalAlpha = fade * fade * CFG.lineOpacity;
          ctx.strokeStyle = `rgb(${col.r},${col.g},${col.b})`;
          ctx.lineWidth = fade * 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      n.pulse += 0.02;
      const pulseFactor = 0.7 + 0.3 * Math.sin(n.pulse);
      const col = n.col;

      // glow halo
      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 12 * pulseFactor);
      halo.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${CFG.nodeOpacity * 0.4})`);
      halo.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 12 * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${CFG.nodeOpacity})`;
      ctx.fill();

      // update position
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    });
  }

  // ---- Main loop ----
  let startTime = null;
  function loop(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;

    ctx.clearRect(0, 0, W, H);

    drawGrid(t);
    drawBeams(t);
    drawNodes(t);

    requestAnimationFrame(loop);
  }

  // ---- Boot ----
  function init() {
    resize();
    initNodes();
    initBeams();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    // Re-scatter nodes so they fill the new size
    nodes.forEach(n => {
      if (n.x > W) n.x = Math.random() * W;
      if (n.y > H) n.y = Math.random() * H;
    });
  }, { passive: true });

  // Wait for DOM before inserting canvas
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
