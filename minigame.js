// ===== BEST FRIEND RUN =====
(function () {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('gameOverlay');
  const scoreEl = document.getElementById('gameScore');
  const highEl = document.getElementById('gameHigh');

  const W = 800, H = 250, GROUND = H - 40, GRAVITY = 0.65, JUMP = -11.5;
  let state = 'idle', score = 0, high = 0, speed = 5, frame = 0;
  let obstacles = [], nextSpawn = 60;
  let inverted = false, invertTransition = 0; // 0-1 for smooth transition
  const P = { x: 80, y: GROUND, vy: 0, onGnd: true, anim: 0, tick: 0 };

  // Audio context for milestone sounds
  let audioCtx;
  function getAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }

  function playMilestoneSound() {
    const a = getAudio(), t = a.currentTime;
    // Two-tone rising beep like dino game
    const o1 = a.createOscillator(), g1 = a.createGain();
    o1.connect(g1); g1.connect(a.destination);
    o1.type = 'square';
    o1.frequency.setValueAtTime(523, t); // C5
    g1.gain.setValueAtTime(0.12, t);
    g1.gain.setValueAtTime(0.12, t + 0.1);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o1.start(t); o1.stop(t + 0.15);

    const o2 = a.createOscillator(), g2 = a.createGain();
    o2.connect(g2); g2.connect(a.destination);
    o2.type = 'square';
    o2.frequency.setValueAtTime(659, t + 0.1); // E5
    g2.gain.setValueAtTime(0, t);
    g2.gain.setValueAtTime(0.12, t + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o2.start(t + 0.1); o2.stop(t + 0.25);
  }

  // Inverted-mode messages
  const invertMsgs = [
    'THEY SEE YOU NOW.', 'THE [REDACTED] WATCHES.', 'DON\'T LOOK BACK.',
    '[MONSTERS] BREACH DETECTED.', 'SIGNAL CORRUPTED.', 'RUN. FASTER.',
    'YOU SHOULDN\'T BE HERE.', 'ERROR: REALITY NOT FOUND.', 'HELP ME.',
    'THE [MONSTERS] ARE CLOSER.', 'DO YOU HEAR THEM?', 'BEHIND YOU.'
  ];
  let currentMsg = '', msgTimer = 0;

  // Sprites
  function buildSprite(f) {
    const oc = document.createElement('canvas'); oc.width = 48; oc.height = 48;
    const c = oc.getContext('2d'); c.imageSmoothingEnabled = false;
    c.fillStyle = '#003311';
    c.fillRect(8, 0, 32, 2); c.fillRect(8, 14, 32, 2); c.fillRect(6, 2, 2, 12); c.fillRect(40, 2, 2, 12);
    c.fillStyle = '#00ff41'; c.fillRect(8, 2, 32, 12);
    c.fillStyle = '#00aa2a'; c.fillRect(14, 4, 4, 4); c.fillRect(28, 4, 4, 4);
    c.fillStyle = '#003311'; c.fillRect(16, 6, 2, 2); c.fillRect(30, 6, 2, 2); c.fillRect(16, 10, 14, 2);
    c.fillStyle = '#006622'; c.fillRect(10, 16, 28, 14);
    c.fillStyle = '#008833'; c.fillRect(12, 18, 24, 4);
    c.fillStyle = '#003311'; c.fillRect(8, 16, 2, 14); c.fillRect(38, 16, 2, 14);
    c.fillStyle = '#00cc33';
    if (f === 0) { c.fillRect(4, 20, 4, 10); c.fillRect(40, 20, 4, 10) } else { c.fillRect(4, 18, 4, 10); c.fillRect(40, 22, 4, 10) }
    c.fillStyle = '#004415';
    if (f === 0) { c.fillRect(14, 30, 6, 12); c.fillRect(28, 30, 6, 12) } else { c.fillRect(12, 30, 6, 12); c.fillRect(30, 30, 6, 12) }
    c.fillStyle = '#002208';
    if (f === 0) { c.fillRect(12, 42, 8, 4); c.fillRect(26, 42, 8, 4) } else { c.fillRect(10, 42, 8, 4); c.fillRect(28, 42, 8, 4) }
    return oc;
  }
  const sprites = [buildSprite(0), buildSprite(1)];

  function buildOb(tall) {
    const w = 20, h = tall ? 44 : 30, oc = document.createElement('canvas'); oc.width = w; oc.height = h;
    const c = oc.getContext('2d');
    c.fillStyle = '#002208'; c.fillRect(0, 0, w, h); c.fillStyle = '#003311'; c.fillRect(2, 2, w - 4, h - 4);
    c.fillStyle = '#00ff41'; c.fillRect(4, 4, 4, 4); c.fillRect(12, 4, 4, 4);
    c.fillStyle = '#000'; c.fillRect(5, 5, 2, 2); c.fillRect(13, 5, 2, 2);
    c.fillStyle = '#00ff41'; c.fillRect(6, 12, 8, 2);
    c.fillStyle = '#00aa2a'; c.fillRect(0, h - 6, w, 1); c.fillRect(0, h - 3, w, 1);
    return { canvas: oc, w, h };
  }
  const obShort = buildOb(false), obTall = buildOb(true);

  function jump() { if (P.onGnd) { P.vy = JUMP; P.onGnd = false } }

  function start() {
    if (state === 'running') { jump(); return }
    state = 'running'; score = 0; speed = 5; obstacles = []; nextSpawn = 60; frame = 0;
    P.y = GROUND; P.vy = 0; P.onGnd = true; inverted = false; invertTransition = 0;
    currentMsg = ''; msgTimer = 0;
    document.documentElement.style.filter = '';
    document.documentElement.style.transition = 'filter 0.8s ease';
    overlay.classList.add('hidden');
    requestAnimationFrame(loop);
  }

  function die() {
    state = 'dead';
    if (score > high) high = score;
    highEl.textContent = 'HIGH: ' + high;
    overlay.classList.remove('hidden');
    overlay.querySelector('.game-overlay-text').textContent = 'GAME OVER \u2014 SCORE: ' + score + '\nPRESS SPACE TO RETRY';
  }

  function loop() {
    if (state !== 'running') return;
    frame++;
    P.vy += GRAVITY; P.y += P.vy;
    if (P.y >= GROUND) { P.y = GROUND; P.vy = 0; P.onGnd = true }
    P.tick++; if (P.tick > 8) { P.anim = (P.anim + 1) % 2; P.tick = 0 }

    nextSpawn--;
    if (nextSpawn <= 0) {
      const tall = Math.random() < 0.3; const ob = tall ? obTall : obShort;
      obstacles.push({ x: W + 10, y: GROUND - ob.h + 16, w: ob.w, h: ob.h, tall });
      nextSpawn = Math.max(35, 75 - Math.floor(score / 8)) + (Math.random() * 20 | 0);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= speed;
      if (obstacles[i].x < -30) { obstacles.splice(i, 1); continue }
      const o = obstacles[i];
      const px1 = P.x + 10, py1 = P.y + 2, pw = 28, ph = 44;
      const ox1 = o.x + 2, oy1 = o.y + 2, ow = o.w - 4, oh = o.h - 4;
      if (px1 < ox1 + ow && px1 + pw > ox1 && py1 < oy1 + oh && py1 + ph > oy1) { die(); return }
    }

    score++;
    if (score % 100 === 0) speed += 0.25;
    scoreEl.textContent = 'SCORE: ' + score;

    // 500 milestone sound
    if (score % 500 === 0) playMilestoneSound();

    // 1000 toggle invert with transition
    if (score % 1000 === 0) {
      inverted = !inverted;
      document.documentElement.style.filter = inverted ? 'invert(1) hue-rotate(180deg)' : '';
      if (inverted) {
        currentMsg = invertMsgs[Math.floor(Math.random() * invertMsgs.length)];
        msgTimer = 180; // ~3 seconds
      } else {
        currentMsg = ''; msgTimer = 0;
      }
    }

    // Tick message timer
    if (msgTimer > 0) {
      msgTimer--;
      if (msgTimer <= 0 && inverted) {
        currentMsg = invertMsgs[Math.floor(Math.random() * invertMsgs.length)];
        msgTimer = 180;
      }
    }

    // === RENDER ===
    ctx.fillStyle = '#010301'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,255,65,0.02)'; ctx.lineWidth = 1;
    for (let y = 0; y < GROUND; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Ground
    ctx.fillStyle = '#002208'; ctx.fillRect(0, GROUND + 16, W, H - GROUND);
    ctx.fillStyle = '#003311'; ctx.fillRect(0, GROUND + 14, W, 3);
    ctx.fillStyle = '#004415';
    const gOff = (frame * speed) % 20;
    for (let x = -gOff; x < W; x += 20) { ctx.fillRect(x, GROUND + 20, 2, 2); ctx.fillRect(x + 10, GROUND + 24, 3, 2) }

    for (const o of obstacles) ctx.drawImage(o.tall ? obTall.canvas : obShort.canvas, o.x, o.y);
    ctx.drawImage(P.onGnd ? sprites[P.anim] : sprites[0], P.x, P.y);

    if (!P.onGnd) {
      ctx.fillStyle = 'rgba(0,255,65,0.3)';
      ctx.fillRect(P.x + Math.random() * 40, P.y + 44 + Math.random() * 6, 3, 3);
    }

    // Inverted message inside game canvas
    if (inverted && currentMsg && msgTimer > 0) {
      const alpha = Math.min(1, msgTimer / 30);
      ctx.fillStyle = `rgba(0,255,65,${alpha * 0.6})`;
      ctx.font = '10px "Press Start 2P",monospace';
      ctx.textAlign = 'center';
      ctx.fillText(currentMsg, W / 2, 30);
      ctx.textAlign = 'start';
    }

    // Scanline
    ctx.fillStyle = 'rgba(0,255,65,0.02)'; ctx.fillRect(0, (frame * 2) % H, W, 3);

    requestAnimationFrame(loop);
  }

  // Idle
  function idle() {
    ctx.fillStyle = '#010301'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,255,65,0.02)';
    for (let y = 0; y < GROUND; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
    ctx.fillStyle = '#002208'; ctx.fillRect(0, GROUND + 16, W, H - GROUND);
    ctx.fillStyle = '#003311'; ctx.fillRect(0, GROUND + 14, W, 3);
    ctx.drawImage(sprites[0], P.x, GROUND);
    if (state === 'idle') requestAnimationFrame(idle);
  }
  idle();

  document.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); start() } });
  canvas.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); start() });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); start() }, { passive: false });
})();
