/* ========================================
   About Anweshane - 2K26 canvas motion graphics background
   Smooth animated neural grid, particles, and scan beams
   ======================================== */

(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  canvas.className = 'bg-canvas';
  canvas.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'width:100%', 'height:100%',
    'z-index:-1',
    'pointer-events:none',
    'display:block',
  ].join(';');

  const ctx = canvas.getContext('2d');
  const isEventsPage = Boolean(document.querySelector('.events-page'));
  const canvasHost = document.querySelector('.events-page') || document.body;
  canvasHost.insertAdjacentElement('afterbegin', canvas);
  if (isEventsPage) {
    canvas.style.zIndex = '0';
  }
  document.body.classList.toggle('events-canvas-active', isEventsPage);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Config ----
  const CFG = {
    nodeCount: isEventsPage ? 96 : 52,
    connectDist: isEventsPage ? 235 : 165,
    nodeSpeed: isEventsPage ? 0.38 : 0.24,
    nodeRadius: isEventsPage ? 2.1 : 1.55,
    lineOpacity: isEventsPage ? 0.22 : 0.09,
    nodeOpacity: isEventsPage ? 0.76 : 0.46,
    signalOpacity: isEventsPage ? 0.25 : 0.09,
    beamCount: isEventsPage ? 7 : 2,
    beamSpeed: prefersReducedMotion ? 0.45 : (isEventsPage ? 1.45 : 1.1),
    interactionRadius: isEventsPage ? 270 : 190,
    pointerLineOpacity: isEventsPage ? 0.48 : 0.24,
    labelCount: isEventsPage ? 18 : 7,
    starCount: isEventsPage ? 145 : 58,
    droneCount: isEventsPage ? 11 : 4,
    streakCount: isEventsPage ? 13 : 4,
    cityTowers: isEventsPage ? 52 : 24,
    palette: [
      { r: 56,  g: 189, b: 248 }, // blue
      { r: 34,  g: 211, b: 238 }, // cyan
      { r: 20,  g: 184, b: 166 }, // teal
      { r: 139, g: 92,  b: 246 }, // purple
      { r: 192, g: 132, b: 252 }, // violet
    ],
  };

  let W, H, nodes, beams, signalLabels, stars, drones, streaks, cityTowers, dpr;
  const pointer = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    strength: 0,
    lastMove: 0,
    initialized: false,
  };

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
    const col = CFG.palette[Math.floor(Math.random() * CFG.palette.length)];
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

  // ---- AI / ML signal labels ----
  function createSignalLabel(i) {
    const words = ['AI', 'ML', 'DATA', 'MODEL', 'NLP', 'VISION', 'BOT', 'CODE'];
    return {
      text: words[i % words.length],
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * (isEventsPage ? 0.28 : 0.18),
      vy: (Math.random() - 0.5) * (isEventsPage ? 0.22 : 0.14),
      phase: Math.random() * Math.PI * 2,
      col: CFG.palette[Math.floor(Math.random() * CFG.palette.length)],
    };
  }

  function initSignalLabels() {
    signalLabels = Array.from({ length: CFG.labelCount }, (_, i) => createSignalLabel(i));
  }

  function cubic(a, b, c, d, t) {
    const mt = 1 - t;
    return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
  }

  // ---- Cinematic sci-fi world layer ----
  function createStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.4 + Math.random() * 1.4,
      speed: 0.04 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2,
      col: CFG.palette[Math.floor(Math.random() * CFG.palette.length)],
    };
  }

  function initStars() {
    stars = Array.from({ length: CFG.starCount }, createStar);
  }

  function createCityTower(i) {
    const width = 18 + Math.random() * (isEventsPage ? 54 : 38);
    return {
      x: Math.random() * W,
      width,
      height: H * (0.08 + Math.random() * (isEventsPage ? 0.24 : 0.18)),
      tier: Math.random() > 0.45 ? 1 : 0,
      antenna: Math.random() > 0.58,
      windowPhase: Math.random() * Math.PI * 2,
      col: CFG.palette[i % CFG.palette.length],
    };
  }

  function initCityTowers() {
    cityTowers = Array.from({ length: CFG.cityTowers }, (_, i) => createCityTower(i))
      .sort((a, b) => a.x - b.x);
  }

  function createDrone(i) {
    const col = CFG.palette[i % CFG.palette.length];
    return {
      x: Math.random() * W,
      y: H * (0.18 + Math.random() * 0.52),
      vx: (0.18 + Math.random() * 0.34) * (Math.random() > 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2,
      scale: 0.72 + Math.random() * 0.55,
      col,
      scanOffset: Math.random() * Math.PI * 2,
    };
  }

  function initDrones() {
    drones = Array.from({ length: CFG.droneCount }, (_, i) => createDrone(i));
  }

  function createCosmicStreak(i) {
    const col = CFG.palette[i % CFG.palette.length];
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.75,
      len: 90 + Math.random() * 190,
      speed: 0.45 + Math.random() * 0.85,
      angle: -0.42 + Math.random() * 0.28,
      col,
      opacity: 0.1 + Math.random() * 0.15,
    };
  }

  function initCosmicStreaks() {
    streaks = Array.from({ length: CFG.streakCount }, (_, i) => createCosmicStreak(i));
  }

  function drawCosmicDepth(t) {
    ctx.save();

    const nebulaOne = ctx.createRadialGradient(W * 0.16, H * 0.2, 0, W * 0.16, H * 0.2, Math.max(W, H) * 0.56);
    nebulaOne.addColorStop(0, 'rgba(34, 211, 238, 0.11)');
    nebulaOne.addColorStop(0.42, 'rgba(139, 92, 246, 0.04)');
    nebulaOne.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = nebulaOne;
    ctx.fillRect(0, 0, W, H);

    const nebulaTwo = ctx.createRadialGradient(W * 0.82, H * 0.34, 0, W * 0.82, H * 0.34, Math.max(W, H) * 0.48);
    nebulaTwo.addColorStop(0, 'rgba(192, 132, 252, 0.12)');
    nebulaTwo.addColorStop(0.45, 'rgba(14, 165, 233, 0.035)');
    nebulaTwo.addColorStop(1, 'rgba(192, 132, 252, 0)');
    ctx.fillStyle = nebulaTwo;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(star => {
      star.phase += 0.018;
      if (!prefersReducedMotion) {
        star.x += star.speed;
        if (star.x > W + 10) star.x = -10;
      }

      const twinkle = 0.24 + Math.sin(star.phase + t * 1.8) * 0.16;
      ctx.fillStyle = `rgba(${star.col.r}, ${star.col.g}, ${star.col.b}, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawCosmicStreaks() {
    ctx.save();
    ctx.lineCap = 'round';

    streaks.forEach(streak => {
      if (!prefersReducedMotion) {
        streak.x += Math.cos(streak.angle) * streak.speed;
        streak.y += Math.sin(streak.angle) * streak.speed;
      }

      if (streak.x > W + streak.len || streak.y < -80) {
        streak.x = -streak.len;
        streak.y = H * (0.18 + Math.random() * 0.65);
      }

      const endX = streak.x + Math.cos(streak.angle) * streak.len;
      const endY = streak.y + Math.sin(streak.angle) * streak.len;
      const grad = ctx.createLinearGradient(streak.x, streak.y, endX, endY);
      const col = streak.col;
      grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      grad.addColorStop(0.38, `rgba(${col.r}, ${col.g}, ${col.b}, ${streak.opacity})`);
      grad.addColorStop(1, 'rgba(248, 250, 252, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawOrbitals(t) {
    ctx.save();
    ctx.translate(W * 0.74, H * 0.24);
    ctx.rotate(Math.sin(t * 0.08) * 0.08);

    for (let i = 0; i < 3; i++) {
      const radiusX = W * (0.16 + i * 0.045);
      const radiusY = H * (0.045 + i * 0.018);
      const col = CFG.palette[(i + 2) % CFG.palette.length];
      ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.08 - i * 0.012})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX, radiusY, -0.34 + i * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      const dotT = t * (0.22 + i * 0.08) + i * 2.1;
      const dotX = Math.cos(dotT) * radiusX;
      const dotY = Math.sin(dotT) * radiusY;
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.38)`;
      ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.38)`;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2.4 + i * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  function drawCityscape(t) {
    const baseY = H * 0.89;
    ctx.save();

    const horizon = ctx.createLinearGradient(0, baseY - H * 0.22, 0, H);
    horizon.addColorStop(0, 'rgba(2, 6, 23, 0)');
    horizon.addColorStop(0.48, 'rgba(2, 6, 23, 0.28)');
    horizon.addColorStop(1, 'rgba(2, 6, 23, 0.78)');
    ctx.fillStyle = horizon;
    ctx.fillRect(0, baseY - H * 0.24, W, H * 0.28);

    cityTowers.forEach((tower, i) => {
      const x = tower.x;
      const y = baseY - tower.height;
      const bodyAlpha = tower.tier ? 0.52 : 0.42;
      ctx.fillStyle = `rgba(4, 12, 30, ${bodyAlpha})`;
      ctx.fillRect(x, y, tower.width, tower.height);

      if (tower.tier) {
        ctx.fillStyle = 'rgba(7, 18, 43, 0.46)';
        ctx.fillRect(x + tower.width * 0.18, y - tower.height * 0.16, tower.width * 0.64, tower.height * 0.16);
      }

      const col = tower.col;
      const light = 0.32 + Math.sin(t * 1.4 + tower.windowPhase) * 0.13;
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${light})`;
      for (let wy = y + 10; wy < baseY - 8; wy += 18) {
        for (let wx = x + 7; wx < x + tower.width - 6; wx += 14) {
          if ((wx + wy + i) % 3 !== 0) ctx.fillRect(wx, wy, 3, 5);
        }
      }

      if (tower.antenna) {
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.48)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + tower.width * 0.5, y);
        ctx.lineTo(x + tower.width * 0.5, y - 26);
        ctx.stroke();
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.68)`;
        ctx.beginPath();
        ctx.arc(x + tower.width * 0.5, y - 28, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  function drawRoboDrones(t) {
    ctx.save();

    drones.forEach((drone, index) => {
      const bob = Math.sin(t * 1.6 + drone.phase) * 8;
      const x = drone.x;
      const y = drone.y + bob;
      const s = drone.scale;
      const col = drone.col;

      if (!prefersReducedMotion) {
        drone.x += drone.vx;
        if (drone.x < -90) drone.x = W + 90;
        if (drone.x > W + 90) drone.x = -90;
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);

      const bodyGlow = (isEventsPage ? 0.48 : 0.28) + Math.sin(t * 2 + index) * 0.1;
      ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${bodyGlow})`;
      ctx.fillStyle = 'rgba(8, 14, 31, 0.64)';
      ctx.lineWidth = 1.6;

      // Robot-drone silhouette: cockpit, side modules, and hovering sensor lights.
      roundedRect(-24, -12, 48, 24, 12);
      ctx.fill();
      ctx.stroke();

      roundedRect(-12, -27, 24, 16, 8);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(-43, -10);
      ctx.moveTo(24, 0);
      ctx.lineTo(43, -10);
      ctx.stroke();

      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.78)`;
      ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.62)`;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(-48, -11, 4, 0, Math.PI * 2);
      ctx.arc(48, -11, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(248, 250, 252, 0.86)`;
      ctx.fillRect(-8, -3, 16, 3);
      ctx.shadowBlur = 0;

      if (pointer.strength > 0.08) {
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.interactionRadius * 1.6) {
          ctx.restore();
          ctx.save();
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.12 * pointer.strength})`;
          ctx.setLineDash([6, 10]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          return;
        }
      }

      ctx.restore();
    });

    ctx.restore();
  }

  function drawBattleBeams(t) {
    const volleys = isEventsPage ? 8 : 3;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < volleys; i++) {
      const phase = (t * (0.18 + i * 0.018) + i * 0.17) % 1;
      const pulse = Math.sin(phase * Math.PI);
      const startX = W * (0.08 + (i / Math.max(1, volleys - 1)) * 0.84);
      const startY = H * (0.79 + Math.sin(i) * 0.06);
      const endX = W * (0.14 + ((i * 0.37) % 0.74));
      const endY = H * (0.12 + ((i * 0.19) % 0.32));
      const col = CFG.palette[(i + 1) % CFG.palette.length];
      const grad = ctx.createLinearGradient(startX, startY, endX, endY);
      grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      grad.addColorStop(0.18, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.18 * pulse})`);
      grad.addColorStop(0.52, `rgba(248, 250, 252, ${0.12 * pulse})`);
      grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2 + pulse * 1.6;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const blastX = startX + (endX - startX) * phase;
      const blastY = startY + (endY - startY) * phase;
      const blast = ctx.createRadialGradient(blastX, blastY, 0, blastX, blastY, 26 + pulse * 18);
      blast.addColorStop(0, `rgba(248, 250, 252, ${0.28 * pulse})`);
      blast.addColorStop(0.26, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.24 * pulse})`);
      blast.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      ctx.fillStyle = blast;
      ctx.beginPath();
      ctx.arc(blastX, blastY, 26 + pulse * 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  function drawRoboMechs(t) {
    const mechs = isEventsPage ? 3 : 1;
    ctx.save();

    for (let i = 0; i < mechs; i++) {
      const lane = i / Math.max(1, mechs - 1);
      const baseX = W * (0.12 + lane * 0.74);
      const drift = Math.sin(t * 0.22 + i * 2.4) * W * 0.035;
      const baseY = H * (0.81 + (i % 2) * 0.04);
      const scale = (isEventsPage ? 1.25 : 0.95) + i * 0.12;
      const col = CFG.palette[(i + 3) % CFG.palette.length];
      const step = Math.sin(t * 1.8 + i);

      ctx.save();
      ctx.translate(baseX + drift, baseY);
      ctx.scale(scale, scale);
      ctx.globalAlpha = isEventsPage ? 0.82 : 0.52;

      // Large walking robot silhouette for an unmistakable sci-fi presence.
      ctx.fillStyle = 'rgba(3, 8, 22, 0.58)';
      ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.42)`;
      ctx.lineWidth = 1.2;

      roundedRect(-24, -82, 48, 42, 9);
      ctx.fill();
      ctx.stroke();

      roundedRect(-17, -118, 34, 28, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.72)`;
      ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.62)`;
      ctx.shadowBlur = 18;
      ctx.fillRect(-9, -107, 18, 4);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.38)`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-24, -67);
      ctx.lineTo(-45, -42 + step * 5);
      ctx.lineTo(-39, -22);
      ctx.moveTo(24, -67);
      ctx.lineTo(45, -44 - step * 5);
      ctx.lineTo(40, -23);
      ctx.moveTo(-12, -40);
      ctx.lineTo(-19, -7 + step * 7);
      ctx.lineTo(-31, 22);
      ctx.moveTo(12, -40);
      ctx.lineTo(20, -8 - step * 7);
      ctx.lineTo(31, 22);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(248, 250, 252, 0.18)`;
      ctx.beginPath();
      ctx.arc(0, -62, 12, 0, Math.PI * 2);
      ctx.stroke();

      const shield = ctx.createRadialGradient(0, -60, 0, 0, -60, 88);
      shield.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0.08)`);
      shield.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      ctx.fillStyle = shield;
      ctx.beginPath();
      ctx.arc(0, -60, 88, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // ---- Draw organic AI signal paths ----
  function drawNeuralBackdrop(t) {
    ctx.save();
    ctx.lineCap = 'round';

    const streams = isEventsPage ? 8 : 5;
    for (let i = 0; i < streams; i++) {
      const phase = t * (0.18 + i * 0.025) + i * 1.7;
      const yBase = H * (0.12 + (i / streams) * 0.8);
      const wave = Math.sin(phase) * H * 0.075;
      const startY = yBase + wave;
      const endY = yBase + Math.cos(phase * 0.9) * H * 0.08;
      const c1x = W * (0.22 + Math.sin(phase * 0.7) * 0.08);
      const c2x = W * (0.72 + Math.cos(phase * 0.6) * 0.08);
      const c1y = startY + Math.cos(phase) * H * 0.18;
      const c2y = endY + Math.sin(phase * 1.1) * H * 0.18;
      const col = CFG.palette[i % CFG.palette.length];

      const grad = ctx.createLinearGradient(0, startY, W, endY);
      grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      grad.addColorStop(0.32, `rgba(${col.r}, ${col.g}, ${col.b}, ${CFG.signalOpacity})`);
      grad.addColorStop(0.5, `rgba(226, 246, 255, ${CFG.signalOpacity * 0.55})`);
      grad.addColorStop(0.72, `rgba(${col.r}, ${col.g}, ${col.b}, ${CFG.signalOpacity})`);
      grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.65 + (i % 3) * 0.28;
      ctx.beginPath();
      ctx.moveTo(-80, startY);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, W + 80, endY);
      ctx.stroke();

      const packetT = (t * (0.08 + i * 0.012) + i * 0.17) % 1;
      const packetX = cubic(-80, c1x, c2x, W + 80, packetT);
      const packetY = cubic(startY, c1y, c2y, endY, packetT);
      const pulse = 0.6 + Math.sin(t * 2.4 + i) * 0.25;
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.42 * pulse})`;
      ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.45)`;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(packetX, packetY, 2.2 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  // ---- Draw beams ----
  function drawBeams(t) {
    beams.forEach(b => {
      b.y += b.speed * 0.4;
      if (b.y < -20) b.y = H + 20;
      if (b.y > H + 20) b.y = -20;

      const grad = ctx.createLinearGradient(0, b.y, W, b.y);
      const col = b.col;
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

  function drawPointerField(t) {
    if (pointer.strength < 0.03) return;

    const radius = CFG.interactionRadius * (0.75 + pointer.strength * 0.25);
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    glow.addColorStop(0, `rgba(103, 232, 249, ${0.16 * pointer.strength})`);
    glow.addColorStop(0.42, `rgba(139, 92, 246, ${0.08 * pointer.strength})`);
    glow.addColorStop(1, 'rgba(103, 232, 249, 0)');

    ctx.save();
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 2; i++) {
      const ringRadius = 34 + i * 26 + Math.sin(t * 2.2 + i) * 5;
      ctx.strokeStyle = `rgba(${i ? '192, 132, 252' : '103, 232, 249'}, ${0.16 * pointer.strength})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.font = '700 11px "Times New Roman", Times, serif';
    ctx.letterSpacing = '0.16em';
    ctx.fillStyle = `rgba(226, 246, 255, ${0.42 * pointer.strength})`;
    ctx.fillText('AI / ML SIGNAL', pointer.x + 18, pointer.y - 18);
    ctx.restore();
  }

  function drawSignalLabels(t) {
    ctx.save();
    ctx.font = '700 12px "Times New Roman", Times, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    signalLabels.forEach(label => {
      label.phase += 0.012;
      const pulse = 0.4 + Math.sin(label.phase + t * 0.9) * 0.18;
      const col = label.col;
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${pulse * (isEventsPage ? 0.42 : 0.28)})`;
      ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.18)`;
      ctx.shadowBlur = 10;
      ctx.fillText(label.text, label.x, label.y);

      label.x += label.vx;
      label.y += label.vy;
      if (label.x < -40) label.x = W + 40;
      if (label.x > W + 40) label.x = -40;
      if (label.y < -40) label.y = H + 40;
      if (label.y > H + 40) label.y = -40;
    });

    ctx.restore();
  }

  function updatePointer() {
    const pointerIsFresh = performance.now() - pointer.lastMove < 1600;
    const targetStrength = pointerIsFresh ? 1 : 0;
    pointer.strength += (targetStrength - pointer.strength) * 0.08;

    if (!pointer.initialized) return;

    pointer.x += (pointer.targetX - pointer.x) * 0.18;
    pointer.y += (pointer.targetY - pointer.y) * 0.18;
  }

  function handlePointerMove(event) {
    const point = event.touches ? event.touches[0] : event;
    if (!point) return;

    pointer.targetX = point.clientX;
    pointer.targetY = point.clientY;
    pointer.lastMove = performance.now();

    if (!pointer.initialized) {
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      pointer.initialized = true;
    }
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
          const col = a.col;
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
      let pointerBoost = 0;

      if (pointer.strength > 0.03) {
        const dxp = pointer.x - n.x;
        const dyp = pointer.y - n.y;
        const pointerDist = Math.sqrt(dxp * dxp + dyp * dyp);

        if (pointerDist < CFG.interactionRadius) {
          pointerBoost = (1 - pointerDist / CFG.interactionRadius) * pointer.strength;

          ctx.save();
          ctx.globalAlpha = pointerBoost * CFG.pointerLineOpacity;
          ctx.strokeStyle = `rgb(${col.r},${col.g},${col.b})`;
          ctx.lineWidth = 0.7 + pointerBoost;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
          ctx.restore();

          // Nearby nodes subtly orbit toward the user's pointer for an interactive AI field.
          if (!prefersReducedMotion) {
            n.x -= dxp * pointerBoost * 0.0018;
            n.y -= dyp * pointerBoost * 0.0018;
          }
        }
      }

      // glow halo
      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 12 * pulseFactor);
      halo.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${CFG.nodeOpacity * (0.4 + pointerBoost * 0.7)})`);
      halo.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (12 + pointerBoost * 10) * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (1 + pointerBoost * 0.85) * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${Math.min(0.96, CFG.nodeOpacity + pointerBoost * 0.28)})`;
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
    updatePointer();

    drawCosmicDepth(t);
    drawOrbitals(t);
    drawCosmicStreaks();
    drawNeuralBackdrop(t);
    drawBeams(t);
    drawSignalLabels(t);
    drawPointerField(t);
    drawNodes(t);
    drawCityscape(t);
    drawBattleBeams(t);
    drawRoboMechs(t);
    drawRoboDrones(t);

    requestAnimationFrame(loop);
  }

  // ---- Boot ----
  function init() {
    resize();
    initNodes();
    initBeams();
    initSignalLabels();
    initStars();
    initCityTowers();
    initDrones();
    initCosmicStreaks();
    requestAnimationFrame(loop);
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });

  window.addEventListener('resize', () => {
    resize();
    // Re-scatter nodes so they fill the new size
    nodes.forEach(n => {
      if (n.x > W) n.x = Math.random() * W;
      if (n.y > H) n.y = Math.random() * H;
    });
    initCityTowers();
  }, { passive: true });

  // Wait for DOM before inserting canvas
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
