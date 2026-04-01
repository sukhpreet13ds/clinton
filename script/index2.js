(function () {
    'use strict';

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let stars = [];
    let shootingStars = [];
    const starCount = 800; // Perfect point density for night sky

    // --- Star Object ---
    class Star {
        constructor() {
            this.x = Math.random() * (window.innerWidth || 1000); // Initial random x
            this.y = Math.random() * (window.innerHeight || 1000);
            this.size = 0.2 + Math.random() * 0.8;
            // Move horizontally 
            this.speed = 0.1 + (Math.random() * 0.4); 
            this.brightness = 0.3 + Math.random() * 0.7;
        }

        reset() {
            // Respawn on the right edge
            this.x = W + Math.random() * 50; 
            this.y = Math.random() * H;
            this.size = 0.2 + Math.random() * 0.8;
            this.speed = 0.1 + (Math.random() * 0.4); 
            this.brightness = 0.3 + Math.random() * 0.7;
        }

        update() {
            // Horizontal proper movement as requested
            this.x -= this.speed;
            
            // Loop back when offscreen
            if (this.x < -10) {
                this.reset();
            }
        }

        draw(isLight, mx = 0, my = 0) {
            const parallaxX = mx * this.size;
            const parallaxY = my * this.size;
            const alpha = this.brightness * (isLight ? 0.6 : 0.8);
            ctx.fillStyle = isLight ? `rgba(157, 9, 23, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.x + parallaxX, this.y + parallaxY, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- Shooting Star Object ---
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = W + Math.random() * 500;
            this.y = Math.random() * H * 0.5;
            this.len = 100 + Math.random() * 150;
            this.speed = 10 + Math.random() * 15;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
            this.alpha = 0;
            this.active = false;
        }

        launch() {
            this.active = true;
            this.alpha = 1;
        }

        update() {
            if (!this.active) return;
            this.x -= Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.alpha -= 0.015;
            if (this.alpha <= 0 || this.x < -200 || this.y > H + 200) {
                this.active = false;
                this.reset();
            }
        }

        draw(isLight) {
            if (!this.active) return;
            const grad = ctx.createLinearGradient(
                this.x, this.y,
                this.x + Math.cos(this.angle) * this.len,
                this.y - Math.sin(this.angle) * this.len
            );
            // Purple for light theme, otherwise white
            const rgb = isLight ? '122, 0, 255' : '255, 255, 255';
            grad.addColorStop(0, `rgba(${rgb}, ${this.alpha})`);
            grad.addColorStop(1, `rgba(${rgb}, 0)`);

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
            ctx.stroke();
            ctx.restore();
        }
    }

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) * 0.04;
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.04;
    });

    function init() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        
        // Only recreate stars if array is empty to preserve their positions on resize
        if (stars.length === 0) {
            for (let i = 0; i < starCount; i++) {
                const s = new Star();
                // Randomize initial x position across the whole screen width
                s.x = Math.random() * W; 
                stars.push(s);
            }
            for (let i = 0; i < 3; i++) {
                shootingStars.push(new ShootingStar());
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        currentMouseX += (targetMouseX - currentMouseX) * 0.1;
        currentMouseY += (targetMouseY - currentMouseY) * 0.1;

        stars.forEach(star => {
            star.update();
            star.draw(isLight, currentMouseX, currentMouseY);
        });

        if (Math.random() < 0.005) {
            const inactive = shootingStars.find(s => !s.active);
            if (inactive) inactive.launch();
        }

        shootingStars.forEach(s => {
            s.update();
            s.draw(isLight);
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    
    // Theme Switcher support for sparkles color if needed
    window.buildSparkles = () => {
        // Handled by isLight check in draw loop natively
    };

    init();
    animate();

})(); // End of canvas animation IIFE


// --- Preloader & Initialization Logic (Title Restore) ---
(function () {
    const pl = document.getElementById('preloader');
    const logo = document.getElementById('preloader-logo');
    
    // Reveal logo quickly
    if (logo) {
        setTimeout(() => logo.classList.add('show'), 400);
    }

    // Trigger site entrance
    if (pl) {
        setTimeout(() => {
            pl.classList.add('exit');
            document.body.classList.remove('preloader-active');
            document.body.classList.add('reveal-site');
            setTimeout(startPageReveal, 600);
        }, 2000);
    } else {
        // Fallback if no preloader
        document.body.classList.add('reveal-site');
        setTimeout(startPageReveal, 600);
    }

    function startPageReveal() {
        const heading = document.querySelector('.hero-heading');
        if (heading) {
            setTimeout(() => heading.classList.add('revealed'), 300);
        }
        
        const starSpans = document.querySelectorAll('#starsContainer span');
        starSpans.forEach((s, i) => {
            setTimeout(() => s.classList.add('fly-in'), 1200 + (i * 120));
        });
        
        const counterEl = document.getElementById('reviewCounter');
        if (counterEl) {
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
    }

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (nav && window.scrollY > 300) {
            nav.classList.add('is-sticky');
        } else if (nav) {
            nav.classList.remove('is-sticky');
        }
    });
})();


// --- Text Scroller Logic ---
(function () {
    const words = ['AD AGENCY', 'PRINT MARKETING', 'SOCIAL MEDIA', 'VIDEO PRODUCTION', 'WEBSITE DESIGN'];
    const track = document.getElementById('wordTrack1');
    if (!track) return;
    
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
            void track.offsetWidth; // trigger reflow
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


// --- Theme Switcher ---
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
        });
    }
})();
