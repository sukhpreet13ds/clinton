
    (function () {
      'use strict';

      const canvas = document.getElementById('hero-canvas');
      const ctx = canvas.getContext('2d');

      const ringC = document.createElement('canvas');
      const maskC = document.createElement('canvas');
      const rc = ringC.getContext('2d');
      const mc = maskC.getContext('2d');

      const grainC = document.createElement('canvas');
      const gc = grainC.getContext('2d');
      grainC.width = 256;
      grainC.height = 256;

      let W = 0, H = 0;
      let mouseX = 0, mouseY = 0;


      const orbs = [

        { cx: 0, cy: 0, angle: 0.0, angSpeed: 0.00020, ringIdx: 9, radius: 320, rY: 185, pulsePh: 0.0 },
        { cx: 0, cy: 0, angle: 2.2, angSpeed: 0.00028, ringIdx: 6, radius: 255, rY: 150, pulsePh: 1.8 },
        { cx: 0, cy: 0, angle: 4.8, angSpeed: 0.00038, ringIdx: 4, radius: 185, rY: 110, pulsePh: 3.6 },
        { cx: 0, cy: 0, angle: 3.4, angSpeed: 0.00016, ringIdx: 11, radius: 290, rY: 168, pulsePh: 5.0 }
      ];

      let STEP = 0;
      let RING_CX = 0, RING_CY = 0;
      let rings = [];
      let sparkles = [];

      function buildRings() {
        const out = [];
        RING_CX = W * 0.50;
        RING_CY = -H * 0.05;
        STEP = Math.min(W, H) * 0.12;
        for (let i = 0; i < 16; i++) out.push({ cx: RING_CX, cy: RING_CY, r: STEP * (i + 1) });
        return out;
      }

      function buildSparkles() {
        sparkles = [];
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const count = isLight ? 14 : 32; /* increased counts: 14 light, 32 dark */
        for (let i = 0; i < count; i++) {
          const isWhite = Math.random() > 0.65;
          sparkles.push({
            x: W * (0.12 + Math.random() * 0.76),
            y: H * (Math.random() * 0.65),
            size: 0.8 + Math.random() * 2.2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.0008 + Math.random() * 0.0014,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.05 - Math.random() * 0.15,
            r: isWhite ? 255 : 170 + (Math.random() * 50 | 0),
            g: isWhite ? 255 : 10 + (Math.random() * 20 | 0),
            b: isWhite ? 255 : 10 + (Math.random() * 20 | 0),
            glow: isWhite ? 1.0 : 0.6,
            isWhite: isWhite
          });
        }
      }

      // Expose buildSparkles globally so theme switcher can rebuild with correct count
      window.buildSparkles = buildSparkles;

      const hero = canvas.parentElement;

      function resize() {
        W = hero.clientWidth || window.innerWidth;
        H = hero.clientHeight || window.innerHeight;
        canvas.width = ringC.width = maskC.width = W;
        canvas.height = ringC.height = maskC.height = H;

        orbs.forEach((o, i) => {
          const r = STEP * (o.ringIdx + 1);
          o.cx = RING_CX + Math.cos(o.angle) * r;
          o.cy = RING_CY + Math.sin(o.angle) * r * (o.rY / o.radius);
        });
        mouseX = W * 0.50; mouseY = H * 0.26;

        rings = buildRings();
        buildSparkles();
      }
      window.addEventListener('resize', resize);

      hero.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
      });

      function generateGrain() {
        const img = gc.createImageData(256, 256);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 18;
        }
        gc.putImageData(img, 0, 0);
      }

      let shootingStars = [];

      function drawShootingStars(ts, isLight) {
        if (!isLight) return;
        
        if (Math.random() < 0.03) {
          shootingStars.push({
            x: Math.random() * W,
            y: Math.random() * -100,
            len: 40 + Math.random() * 60,
            speed: 15 + Math.random() * 15,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.1,
            alpha: 0
          });
        }

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          let s = shootingStars[i];
          s.x -= Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;

          if (s.alpha < 1) s.alpha += 0.05;

          const grad = ctx.createLinearGradient(
            s.x, s.y,
            s.x + Math.cos(s.angle) * s.len,
            s.y - Math.sin(s.angle) * s.len
          );
          grad.addColorStop(0, `rgba(152, 103, 197, ${s.alpha * 0.9})`);
          grad.addColorStop(1, 'rgba(152, 103, 197, 0)');

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
          ctx.stroke();

          if (s.x < -200 || s.y > H + 200) {
            shootingStars.splice(i, 1);
          }
        }
        ctx.restore();
      }

      function drawRings(isLight) {
        rc.clearRect(0, 0, W, H);
        rings.forEach(({ cx, cy, r }) => {
          rc.beginPath();
          rc.arc(cx, cy, r, 0, Math.PI * 2);
          rc.strokeStyle = isLight ? 'rgba(157, 9, 23, 0.25)' : 'rgba(255,255,255,1)';
          rc.lineWidth = 1.2;
          rc.stroke();
        });
      }

      function drawMask() {
        mc.clearRect(0, 0, W, H);
        orbs.forEach(o => {
          mc.save();
          mc.translate(o.cx, o.cy);
          mc.scale(1, o.rY / o.radius);
          const g = mc.createRadialGradient(0, 0, 0, 0, 0, o.radius);
          g.addColorStop(0.00, 'rgba(255,255,255,1)');
          g.addColorStop(0.35, 'rgba(255,255,255,0.65)');
          g.addColorStop(0.70, 'rgba(255,255,255,0.18)');
          g.addColorStop(1.00, 'rgba(255,255,255,0)');
          mc.fillStyle = g;
          mc.beginPath();
          mc.arc(0, 0, o.radius, 0, Math.PI * 2);
          mc.fill();
          mc.restore();
        });
      }


      function drawSparkles(ts) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        sparkles.forEach(s => {
          s.x += s.vx; s.y += s.vy;
          if (s.y < -10) { s.y = H * 0.66; s.x = W * (0.12 + Math.random() * 0.76); }
          if (s.x < -10) s.x = W + 5;
          if (s.x > W + 10) s.x = -5;

          const tw = 0.4 + 0.6 * Math.abs(Math.sin(ts * s.speed + s.phase));
          const sz = s.size * (0.6 + 0.4 * tw);
          const al = tw * 0.85 * (s.glow || 0.6);

          ctx.save();
          ctx.globalCompositeOperation = isLight ? 'source-over' : 'screen';

          const haloSize = sz * (s.isWhite ? 6 : 4);
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloSize);
          
          let r = s.r, g = s.g, b = s.b;
          if (isLight && s.isWhite) {
            // Purple for white sparkles in light mode
            r = 152; g = 103; b = 197;
          }

          halo.addColorStop(0, `rgba(${r},${g},${b},${+(al * 0.55).toFixed(3)})`);
          halo.addColorStop(0.4, `rgba(${r},${g},${b},${+(al * 0.18).toFixed(3)})`);
          halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(s.x, s.y, haloSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = al;
          if (isLight && s.isWhite) {
            ctx.fillStyle = '#9867C5';
          } else {
            ctx.fillStyle = s.isWhite ? '#fff' : `rgb(${r},${Math.min(255, g + 80)},${b + 20})`;
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, sz * 0.9, 0, Math.PI * 2);
          ctx.fill();

          if (sz > 1.6) {
            ctx.globalAlpha = al * 0.55;
            ctx.strokeStyle = isLight ? `rgba(152,103,197,${al * 0.45})` : `rgba(255,160,40,${al * 0.45})`;
            ctx.lineWidth = 0.6;
            const arm = sz * 4.5;
            ctx.beginPath();
            ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y);
            ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      let frame = 0;

      const ORB_COLORS = [
        ['rgba(220, 20, 35, 0.95)', 'rgba(157, 9, 23, 0.55)', 'rgba(60, 0, 5, 0.06)'],
        ['rgba(190, 10, 25, 0.88)', 'rgba(157, 9, 23, 0.48)', 'rgba(50, 0, 5, 0.05)'],
        ['rgba(245, 40, 50, 0.98)', 'rgba(157, 9, 23, 0.65)', 'rgba(70, 0, 8, 0.08)'],
        ['rgba(175, 5, 15, 0.82)', 'rgba(157, 9, 23, 0.40)', 'rgba(40, 0, 4, 0.04)']
      ];

      function draw(ts) {
        frame++;

        orbs.forEach(o => {
          o.angle += o.angSpeed * (ts - (o._lastTs || ts));
          o._lastTs = ts;

          const flow = 0.5 * Math.sin(ts * 0.0003 + o.pulsePh * 2.0);
          const currentRing = o.ringIdx + flow;

          const pulse = 1 + 0.12 * Math.sin(ts * 0.00045 + o.pulsePh);
          const r = STEP * (currentRing + 1);

          o.cx = RING_CX + Math.cos(o.angle) * r;
          o.cy = RING_CY + Math.sin(o.angle) * r * (o.rY / o.radius);
          o._pulse = pulse;
        });

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.fillStyle = isLight ? '#fcfcfc' : '#050505';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.globalAlpha = isLight ? 0.08 : 0.030;
        rings.forEach(({ cx, cy, r }) => {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = isLight ? 'rgba(157, 9, 23, 0.4)' : '#fff'; ctx.lineWidth = 1; ctx.stroke();
        });
        ctx.restore();

        drawRings(isLight);

        mc.clearRect(0, 0, W, H);
        mc.save();
        const cursorG = mc.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
        cursorG.addColorStop(0, 'rgba(255,255,255,0.22)');
        cursorG.addColorStop(1, 'rgba(255,255,255,0)');
        mc.fillStyle = cursorG;
        mc.fillRect(0, 0, W, H);
        mc.restore();

        orbs.forEach(o => {
          const dist = Math.hypot(o.cx - mouseX, o.cy - mouseY);
          const strength = Math.max(0, 1 - dist / 380);
          const reaction = 1.0 + Math.pow(strength, 2.5) * 2.2;

          mc.save();
          mc.translate(o.cx, o.cy);
          mc.scale(1, (o.rY / o.radius) * o._pulse);
          const g = mc.createRadialGradient(0, 0, 0, 0, 0, o.radius * o._pulse * reaction);
          g.addColorStop(0.00, 'rgba(255,255,255,1)');
          g.addColorStop(0.50, 'rgba(255,255,255,0.45)');
          g.addColorStop(1.00, 'rgba(255,255,255,0)');
          mc.fillStyle = g;
          mc.beginPath();
          mc.arc(0, 0, o.radius * o._pulse * reaction, 0, Math.PI * 2);
          mc.fill();
          mc.restore();
        });

        rc.save();
        rc.globalCompositeOperation = 'destination-in';
        rc.drawImage(maskC, 0, 0);
        rc.restore();

        ctx.save();
        ctx.globalCompositeOperation = isLight ? 'source-over' : 'screen';
        ctx.globalAlpha = isLight ? 0.95 : 0.88;
        ctx.drawImage(ringC, 0, 0);
        ctx.restore();

        if (!isLight) {
          orbs.forEach((o, i) => {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            const dist = Math.hypot(o.cx - mouseX, o.cy - mouseY);
            const strength = Math.max(0, 1 - dist / 380);
            const reaction = 1.0 + Math.pow(strength, 2.5) * 2.2;
            const pulseReaction = o._pulse * (0.8 + 0.2 * reaction);

            ctx.translate(o.cx, o.cy);
            ctx.scale(1, (o.rY / o.radius) * pulseReaction);
            const c = ORB_COLORS[i % ORB_COLORS.length];

            const dynamicRadius = o.radius * pulseReaction;
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, dynamicRadius);

            const alphaBoost = 0.40 + 0.60 * (Math.pow(strength, 2));
            g.addColorStop(0.00, c[0].replace(/[\d\.]+\)$/, `${Math.min(1, alphaBoost * 1.2)})`));
            g.addColorStop(0.35, c[1]);
            g.addColorStop(1.00, c[2]);

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, dynamicRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
        }

        drawShootingStars(ts, isLight);
        drawSparkles(ts);

        if (frame % 3 === 0) generateGrain();
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = 'overlay';
        for (let gx = 0; gx < W; gx += 256)
          for (let gy = 0; gy < H; gy += 256)
            ctx.drawImage(grainC, gx, gy);
        ctx.restore();

        requestAnimationFrame(draw);
      }

      requestAnimationFrame(() => {
        resize();
        generateGrain();
        requestAnimationFrame(draw);
      });

    })();

    (function () {
      'use strict';

      const words = [
        'AD AGENCY',
        'PRINT MARKETING',
        'SOCIAL MEDIA',
        'VIDEO PRODUCTION',
        'WEBSITE DESIGN'
      ];

      const track = document.getElementById('wordTrack1');
      let idx = 0;
      let busy = false;

      function cycle() {
        if (busy) return;
        busy = true;

        track.classList.remove('enter');
        track.classList.add('exit');

        track.addEventListener('animationend', function onExit(e) {
          if (e.animationName !== 'wordExit') return;
          track.removeEventListener('animationend', onExit);

          idx = (idx + 1) % words.length;
          track.textContent = words[idx];

          track.classList.remove('exit');
          void track.offsetWidth;
          track.classList.add('enter');

          track.addEventListener('animationend', function onEnter(e) {
            if (e.animationName !== 'wordEnter') return;
            track.removeEventListener('animationend', onEnter);
            track.classList.remove('enter');
            busy = false;
          });
        });
      }

      track.style.opacity = '0';
      track.style.filter = 'blur(8px)';
      track.style.transform = 'translateY(105%) skewY(4deg)';

      setTimeout(() => {
        track.style.opacity = '';
        track.style.filter = '';
        track.style.transform = '';
        track.classList.add('enter');
        track.addEventListener('animationend', function onFirst(e) {
          if (e.animationName !== 'wordEnter') return;
          track.removeEventListener('animationend', onFirst);
          track.classList.remove('enter');
          setInterval(cycle, 2800);
        });
      }, 600);
    })();

    (function () {
      const pl = document.getElementById('preloader');
      const logo = document.getElementById('preloader-logo');

      setTimeout(() => logo.classList.add('show'), 400);

      setTimeout(() => {
        pl.classList.add('exit');
        document.body.classList.remove('preloader-active');
        document.body.classList.add('reveal-site');
        setTimeout(startPageReveal, 600);
      }, 2000);

      function startPageReveal() {
        const heading = document.querySelector('.hero-heading');
        setTimeout(() => heading.classList.add('revealed'), 300);
        const starSpans = document.querySelectorAll('#starsContainer span');
        starSpans.forEach((s, i) => {
          setTimeout(() => s.classList.add('fly-in'), 1200 + (i * 120));
        });
        const counterEl = document.getElementById('reviewCounter');
        function runCounter() {
          const startTime = performance.now();
          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / 2200, 1);
            counterEl.textContent = Math.floor(progress * 107);
            if (progress < 1) requestAnimationFrame(update);
            else setTimeout(runCounter, 3500);
          }
          requestAnimationFrame(update);
        }
        setTimeout(runCounter, 1800);
      }
      window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 300) {
          nav.classList.add('is-sticky');
        } else {
          nav.classList.remove('is-sticky');
        }
      });
    })();

    (function () {
      const switcher = document.getElementById('themeSwitch');
      const html = document.documentElement;

      // Check for saved theme
      const currentTheme = localStorage.getItem('dmg-theme') || 'dark';
      html.setAttribute('data-theme', currentTheme);

      if (switcher) {
        switcher.addEventListener('click', () => {
          const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          html.setAttribute('data-theme', newTheme);
          localStorage.setItem('dmg-theme', newTheme);
          // Rebuild sparkles so dark gets full 20, light gets fewer 8
          if (typeof window.buildSparkles === 'function') window.buildSparkles();
        });
      }
    })();


