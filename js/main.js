/* ══════════════════════════════════════
   PORTFOLIO — BRUNO LOPES
   main.js
══════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();
})();


/* ── PARTICLE BACKGROUND ── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H;
  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(110,231,247,',
    'rgba(181,124,247,',
    'rgba(103,232,160,'
  ];

  const pts = Array.from({ length: 80 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r:  Math.random() * 1.4 + 0.3,
    c:  COLORS[Math.floor(Math.random() * 3)],
    a:  Math.random() * 0.35 + 0.05
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* move & draw dots */
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
    });

    /* connection lines */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(110,231,247,' + (1 - d / 130) * 0.07 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── ANIMATED THUMBNAIL CANVASES ── */
(function initThumbs() {
  document.querySelectorAll('.t-canvas').forEach(canvas => {
    const ctx  = canvas.getContext('2d');
    const type = canvas.dataset.type;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    new ResizeObserver(resize).observe(canvas);

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* ── DELIVERY: hex grid ── */
      if (type === 'delivery') {
        ctx.fillStyle = '#001a2e';
        ctx.fillRect(0, 0, W, H);

        const sz = 28;
        for (let row = 0; row < H / sz + 2; row++) {
          for (let col = 0; col < W / sz + 2; col++) {
            const ox    = (row % 2) * sz * 0.75;
            const px    = col * sz * 1.5 - sz + ox;
            const py    = row * sz * 0.87 - sz;
            const pulse = Math.sin(t * 0.7 + (px + py) * 0.018) * 0.5 + 0.5;

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const a = (Math.PI / 3) * i - Math.PI / 6;
              const r = sz * 0.45 * (0.55 + pulse * 0.18);
              i === 0
                ? ctx.moveTo(px + Math.cos(a) * r, py + Math.sin(a) * r)
                : ctx.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(0,212,255,${0.04 + pulse * 0.14})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

      /* ── DARKIN: blood particles + sigil ── */
      } else if (type === 'darkin') {
        ctx.fillStyle = '#0d0018';
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < 18; i++) {
          const x = ((i * 137.5 + t * 7) % W);
          const y = ((i * 93   + t * 4) % H);
          const r = 2 + Math.sin(t + i) * 1.4;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
          g.addColorStop(0, 'rgba(180,0,50,.55)');
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(x, y, r * 5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate(t * 0.08);
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * 55, Math.sin(a) * 55);
          ctx.strokeStyle = `rgba(180,40,80,${0.12 + Math.sin(t + i) * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

      /* ── FINDASH: finance dashboard ── */
      } else if (type === 'findash') {
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#001f1a');
        grad.addColorStop(0.55, '#041226');
        grad.addColorStop(1, '#11051f');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const gap = 28;
        ctx.strokeStyle = 'rgba(103,232,160,.07)';
        ctx.lineWidth = 1;
        for (let x = -gap; x < W + gap; x += gap) {
          ctx.beginPath();
          ctx.moveTo(x + (t * 9) % gap, 0);
          ctx.lineTo(x + (t * 9) % gap, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += gap) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }

        const chart = [
          [0.08, 0.70],
          [0.22, 0.58],
          [0.35, 0.63],
          [0.50, 0.42],
          [0.65, 0.48],
          [0.82, 0.28],
          [0.94, 0.34]
        ];

        ctx.beginPath();
        chart.forEach(([x, y], i) => {
          const px = x * W;
          const py = y * H + Math.sin(t * 2 + i) * 5;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.strokeStyle = 'rgba(103,232,160,.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(103,232,160,.55)';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        for (let i = 0; i < 5; i++) {
          const bh = 26 + Math.sin(t * 1.8 + i) * 10 + i * 9;
          const x = W * 0.14 + i * 32;
          const y = H - 28 - bh;
          ctx.fillStyle = `rgba(110,231,247,${0.16 + i * 0.035})`;
          ctx.fillRect(x, y, 12, bh);
        }

        ctx.fillStyle = 'rgba(5,5,8,.45)';
        ctx.fillRect(W - 120, 28, 82, 38);
        ctx.strokeStyle = 'rgba(110,231,247,.22)';
        ctx.strokeRect(W - 120, 28, 82, 38);
        ctx.fillStyle = 'rgba(103,232,160,.9)';
        ctx.font = '600 14px JetBrains Mono, monospace';
        ctx.fillText('+18.4%', W - 106, 52);

      /* ── BACKLOG: scanlines + gamepad ── */
      } else {
        ctx.fillStyle = '#120008';
        ctx.fillRect(0, 0, W, H);

        for (let y = 0; y < H; y += 16) {
          const p = Math.sin(t + y * 0.05) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(255,40,90,${0.025 + p * 0.025})`;
          ctx.fillRect(0, y, W, 1);
        }

        for (let i = 0; i < 6; i++) {
          const x = ((i / 6) * W + t * 15) % W;
          ctx.beginPath();
          ctx.moveTo(x, 0); ctx.lineTo(x, H);
          ctx.strokeStyle = 'rgba(0,210,255,.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        const cx = W / 2, cy = H / 2;
        [[-22, 0], [22, 0], [0, -22], [0, 22]].forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(cx + dx, cy + dy, 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,40,90,${0.16 + Math.sin(t * 2 + dx + dy) * 0.08})`;
          ctx.fill();
        });
      }

      t += 0.016;
      requestAnimationFrame(draw);
    }
    draw();
  });
})();


/* ── TYPEWRITER EFFECT ── */
(function initTyped() {
  const el = document.getElementById('typed');
  const phrases = [
    'npx create-portfolio --dev',
    'git commit -m "learning React"',
    'npm run build -- --open_to_work',
    'const skills = [...growing]'
  ];

  let pi  = 0;   // phrase index
  let ci  = 0;   // char index
  let del = false;

  function tick() {
    const phrase = phrases[pi];

    if (!del) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        del = true;
        setTimeout(tick, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
    }

    setTimeout(tick, del ? 38 : 62);
  }
  tick();
})();


/* ── SCROLL REVEAL ── */
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ── COUNT-UP NUMBERS ── */
(function initCountUp() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      const el     = e.target;
      const target = +el.dataset.target;
      if (!target) return;

      let v = 0;
      const step = Math.ceil(target / 30);
      const iv   = setInterval(() => {
        v = Math.min(v + step, target);
        el.textContent = v;
        if (v >= target) clearInterval(iv);
      }, 40);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
})();

/* ── SKILL BARS ANIMATION ── */
(function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.3 });
  document.querySelectorAll('.cv-skill-fill').forEach(el => observer.observe(el));
})();

/* ── NAV SHRINK ON SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60);
});


/* ── MOBILE MENU ── */
(function initMobileMenu() {
  const ham  = document.getElementById('ham');
  const mob  = document.getElementById('mob');
  const ov   = document.getElementById('mobOv');
  const dc   = document.getElementById('dc');
  const dls  = document.querySelectorAll('.dl');

  const openMenu = () => {
    mob.classList.add('active');
    ham.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mob.classList.remove('active');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  };

  ham.addEventListener('click', openMenu);
  dc.addEventListener('click',  closeMenu);
  ov.addEventListener('click',  closeMenu);
  dls.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();
