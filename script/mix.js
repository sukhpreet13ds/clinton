        (function () {
            const items = document.querySelectorAll('.industry-item');
            items.forEach(item => {
                item.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all first to ensure only one is open
                    items.forEach(other => other.classList.remove('active'));

                    // If it wasn't active, open it now
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            });
        })();



        (function () {
            const btn = document.getElementById('showMoreBtn');
            const hiddenArticles = document.querySelectorAll('.article-item.hidden-art');
            let isExpanded = false;

            btn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    hiddenArticles.forEach(art => {
                        art.classList.remove('hidden-art');
                        art.classList.add('active-art');
                    });
                    btn.textContent = 'SHOW LESS';
                } else {
                    hiddenArticles.forEach(art => {
                        art.classList.add('hidden-art');
                        art.classList.remove('active-art');
                    });
                    btn.textContent = 'SHOW MORE';
                }
            });
        })();



        (function () {
            // Toggle for Services (Multiple allow)
            const sOpts = document.querySelectorAll('#serviceOpts .book-service-form-classname-opt');
            sOpts.forEach(opt => {
                opt.addEventListener('click', () => opt.classList.toggle('active'));
            });

            // Toggle for Budget (Single allow)
            const bOpts = document.querySelectorAll('#budgetOpts .book-service-form-classname-opt');
            bOpts.forEach(opt => {
                opt.addEventListener('click', () => {
                    bOpts.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                });
            });

            // Select color change
            const sel = document.getElementById('findSelect');
            sel.addEventListener('change', () => {
                if (sel.value !== "") sel.classList.add('has-val');
                else sel.classList.remove('has-val');
            });
        })();
  
        (function () {
            const steps = [
                { title: "DISCOVER", desc: "We dive deep into your brand, audience, and goals to uncover insights that shape a strong, results-driven marketing foundation." },
                { title: "DEFINE", desc: "We create a clear, focused strategy that positions your brand to stand out, connect emotionally, and dominate across all marketing channels." },
                { title: "DESIGN", desc: "We craft bold visuals and powerful messaging that grab attention, tell your story, and create lasting impressions with your target audience." },
                { title: "DEVELOP", desc: "We build high-performing websites, campaigns, and content systems that work seamlessly together to deliver a smooth, engaging user experience." },
                { title: "DEPLOY", desc: "We launch across digital, TV, radio, and outdoor platforms, ensuring your brand message reaches the right audience at the right time." },
                { title: "DRIVE GROWTH", desc: "We track performance, optimize campaigns, and scale what works—turning clicks into conversions, leads into customers, and growth into long-term success." }
            ];

            let currentIdx = 0;
            const card = document.getElementById('weDoCard');
            const titleEl = document.getElementById('stairTitle');
            const descEl = document.getElementById('stairDesc');
            const tabs = document.querySelectorAll('.we-do-tab');
            const nextBtn = document.getElementById('weDoNext');
            const prevBtn = document.getElementById('weDoPrev');

            function updateStep(idx) {
                currentIdx = idx;

                // Active Tab
                tabs.forEach((t, i) => {
                    t.classList.remove('active');
                    if (i === idx) t.classList.add('active');
                });

                // Content Transition
                card.classList.remove('card-fade-up');
                void card.offsetWidth; // Trigger reflow

                titleEl.textContent = steps[idx].title;
                descEl.textContent = steps[idx].desc;
                card.classList.add('card-fade-up');

                // Auto-scroll tabs on mobile
                const tabsContainer = document.querySelector('.we-do-tabs');
                if (tabsContainer && window.innerWidth <= 1024) {
                    const activeTab = tabs[idx];
                    const scrollOffset = activeTab.offsetLeft - (tabsContainer.offsetWidth / 2) + (activeTab.offsetWidth / 2);
                    tabsContainer.scrollTo({
                        left: scrollOffset,
                        behavior: 'smooth'
                    });
                }
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    updateStep(parseInt(tab.getAttribute('data-index')));
                });
            });

            nextBtn.addEventListener('click', () => {
                let next = (currentIdx + 1) % steps.length;
                updateStep(next);
            });

            prevBtn.addEventListener('click', () => {
                let prev = (currentIdx - 1 + steps.length) % steps.length;
                updateStep(prev);
            });
        })();
 


  
        (function () {
            const btn = document.getElementById('backToTop');
            btn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        })();
  


   

   
        /* Pure JS Scroll Reveal Logic */
        (function () {
            const observerOptions = {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            };

            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active-scroll');
                    }
                });
            }, observerOptions);

            const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-zoom, .reveal-down');
            revealElements.forEach(el => revealObserver.observe(el));

            // Continuous Looping Sauce Statistics Animation
            const animateSauce = (num) => {
                const target = parseInt(num.getAttribute('data-target'));
                let current = 0;
                const duration = 2000;
                const increment = target / (duration / 20);

                const updateValue = () => {
                    current += increment;
                    if (current < target) {
                        num.textContent = Math.round(current);
                        setTimeout(updateValue, 20);
                    } else {
                        num.textContent = target;
                        // Wait 1 second then reset and restart
                        setTimeout(() => {
                            num.textContent = "0";
                            animateSauce(num);
                        }, 1000);
                    }
                };
                updateValue();
            };

            const sauceCounterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const numbers = entry.target.querySelectorAll('.stat-number');
                        numbers.forEach(num => animateSauce(num));
                        sauceCounterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            const sauceGrid = document.querySelector('.sauce-grid');
            if (sauceGrid) sauceCounterObserver.observe(sauceGrid);
        })();
   
 
        /* Premium Consolidated Cursor Logic - Section Restricted */
        (function () {
            const dot = document.getElementById('cur-dot');
            const ring = document.getElementById('cur-ring');
            const text = document.getElementById('cur-text');
            const videoSection = document.querySelector('.success-stories-section');
            const heroSections = document.querySelectorAll('.hero-section, .hero-parallax-container, .second-hero-section');

            if (!dot || !ring) return;



            let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
            let isVisible = false;

            document.addEventListener('mousemove', e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            });

            function animateRing() {
                ringX += (mouseX - ringX) * 0.12;
                ringY += (mouseY - ringY) * 0.12;
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
                requestAnimationFrame(animateRing);
            }
            animateRing();

            const showCursor = () => {
                dot.style.opacity = '1';
                ring.style.opacity = '1';
                ringX = mouseX;
                ringY = mouseY;
            };

            const hideCursor = () => {
                dot.style.opacity = '0';
                ring.style.opacity = '0';
                ring.classList.remove('cur-expand');
                if (text) text.style.opacity = '0';
            };

            // Hero section visibility
            heroSections.forEach(section => {
                section.addEventListener('mouseenter', showCursor);
                section.addEventListener('mouseleave', hideCursor);
            });

            // Video section visibility
            if (videoSection) {
                videoSection.addEventListener('mouseenter', showCursor);
                videoSection.addEventListener('mouseleave', hideCursor);

                // Use Delegation for Slides (Handles clones in infinite carousels)
                videoSection.addEventListener('mouseover', (e) => {
                    const wrap = e.target.closest('.story-video-wrap');
                    if (wrap) {
                        ring.classList.add('cur-expand');
                        if (text) text.style.opacity = '1';
                    }
                });
                videoSection.addEventListener('mouseout', (e) => {
                    const wrap = e.target.closest('.story-video-wrap');
                    if (wrap) {
                        ring.classList.remove('cur-expand');
                        if (text) text.style.opacity = '0';
                    }
                });
            }

            // Global hover behaviors
            document.addEventListener('mouseover', (e) => {
                if (ring.style.opacity === '1' && !ring.classList.contains('cur-expand')) {
                    if (e.target.closest('a, button')) {
                        ring.style.transform = 'translate(-50%, -50%) scale(0.6)';
                    }
                }
            });
            document.addEventListener('mouseout', (e) => {
                if (e.target.closest('a, button')) {
                    ring.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });
        })();
   
        /* Infinite Carousel Logic */
        (function () {
            const track = document.getElementById('storiesTrack');
            const originalSlides = Array.from(track.children);
            const nextBtn = document.getElementById('nextStory');
            const prevBtn = document.getElementById('prevStory');

            // Clone first and last slides for infinite loop
            const firstClone = originalSlides[0].cloneNode(true);
            const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

            track.appendChild(firstClone);
            track.insertBefore(lastClone, originalSlides[0]);

            const allSlides = Array.from(track.children);
            let currentIdx = 1; // Start at first original slide
            let isTransitioning = false;

            function updateCarousel(transition = true) {
                if (!transition) track.style.transition = 'none';
                else track.style.transition = 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';

                // Get current slide width (desktop 75%, mobile 90% handled by CSS variable or just check window)
                const isMobile = window.innerWidth <= 1024;
                const sw = isMobile ? 90 : 75;
                const offset = (100 - sw) / 2 - (currentIdx * sw);

                track.style.transform = `translateX(${offset}%)`;

                allSlides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (i === currentIdx) slide.classList.add('active');
                });

                if (!transition) {
                    // Force reflow
                    track.offsetHeight;
                }
            }

            nextBtn.addEventListener('click', () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIdx++;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIdx--;
                updateCarousel();
            });

            track.addEventListener('transitionend', () => {
                isTransitioning = false;
                if (currentIdx === allSlides.length - 1) {
                    currentIdx = 1;
                    updateCarousel(false);
                }
                if (currentIdx === 0) {
                    currentIdx = allSlides.length - 2;
                    updateCarousel(false);
                }
            });

            // Set initial position
            updateCarousel(false);
        })();

        /* Game Changers Carousel Logic */
        (function () {
            const slides = document.querySelectorAll('.gc-slide');
            const nextBtn = document.getElementById('nextGC');
            const prevBtn = document.getElementById('prevGC');
            if (!nextBtn || !prevBtn || !slides.length) return;
            let currentIdx = 0;

            function updateGC() {
                slides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (i === currentIdx) slide.classList.add('active');
                });
            }

            nextBtn.addEventListener('click', () => {
                currentIdx = (currentIdx + 1) % slides.length;
                updateGC();
            });

            prevBtn.addEventListener('click', () => {
                currentIdx = (currentIdx - 1 + slides.length) % slides.length;
                updateGC();
            });
        })();
 
        (function () {
            'use strict';
            const words = ['AD AGENCY', 'SOCIAL MEDIA', 'PRINT MARKETING', 'VIDEO PRODUCTION', 'WEBSITE DESIGN'];
            const track = document.getElementById('wordTrack');
            let idx = 0;

            function cycle() {
                if (!document.body.classList.contains('reveal-site')) return;
                track.classList.add('flipping');
                setTimeout(() => {
                    idx = (idx + 1) % words.length;
                    track.textContent = words[idx];
                    track.classList.remove('flipping');
                    track.classList.add('enter-3d');
                    setTimeout(() => track.classList.remove('enter-3d'), 800);
                }, 500);
            }
            setInterval(cycle, 3200);
        })();
   
        (function () {
            'use strict';
            const words = ['SPEAK!', 'GROWTH!', 'INTELLIGENCE!', 'PROFESSIONAL!'];
            const track = document.getElementById('gcWordTrack');
            if (!track) return;
            let idx = 0;

            function cycleGC() {
                track.classList.add('flipping');
                setTimeout(() => {
                    idx = (idx + 1) % words.length;
                    track.textContent = words[idx];
                    track.classList.remove('flipping');
                    track.classList.add('enter-3d');
                    setTimeout(() => track.classList.remove('enter-3d'), 850);
                }, 500);
            }
            setInterval(cycleGC, 3800);
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
                const heading = document.querySelector('.second-hero-heading');
                if (heading) setTimeout(() => heading.classList.add('revealed'), 300);

                const starContainer = document.getElementById('starsContainer');
                if (starContainer) {
                    const starSpans = starContainer.querySelectorAll('span');
                    starSpans.forEach((s, i) => {
                        setTimeout(() => s.classList.add('fly-in'), 1200 + (i * 120));
                    });
                }

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
                if (window.scrollY > 300) {
                    nav.classList.add('is-sticky');
                } else {
                    nav.classList.remove('is-sticky');
                }
            });
        })();
    
   
//         (function () {
//             const toggle = document.getElementById('mobileToggle');
//             const menu = document.getElementById('mobileMenu');
//             const close = document.getElementById('mobileClose');
//              const triggers = document.querySelectorAll('#servicesTrigger, #aboutUsTrigger');
//             const mobileVids = document.querySelectorAll('.mobile-video-wrap video');

//             if (toggle && menu && close) {
//                 toggle.addEventListener('click', () => {
//                     menu.classList.add('active');
//                     document.body.classList.add('menu-open');
//                 });

//                 close.addEventListener('click', () => {
//                     menu.classList.remove('active');
//                     document.body.classList.remove('menu-open');
//                 });
//             }

//           if (triggers.length) {
//     triggers.forEach(trigger => {
//         trigger.addEventListener('click', () => {
//             trigger.parentElement.classList.toggle('active');
//         });
//     });
// }

//             // Mobile search expand/collapse
//             const searchToggleBtn = document.getElementById('searchToggle');
//             const searchInputEl = document.getElementById('searchInput');
//             const navContainerEl = document.querySelector('.nav-container');

//             if (searchToggleBtn && navContainerEl) {
//                 searchToggleBtn.addEventListener('click', (e) => {
//                     if (window.innerWidth <= 1366) {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         const isActive = navContainerEl.classList.toggle('search-active');
//                         if (isActive) {
//                             setTimeout(() => searchInputEl && searchInputEl.focus(), 60);
//                         } else {
//                             searchInputEl && searchInputEl.blur();
//                         }
//                     }
//                 });

//                 // Click anywhere outside search to close
//                 document.addEventListener('click', (e) => {
//                     const searchWrapper = document.querySelector('.search-wrapper');
//                     if (navContainerEl.classList.contains('search-active')) {
//                         if (searchWrapper && !searchWrapper.contains(e.target)) {
//                             navContainerEl.classList.remove('search-active');
//                             if (searchInputEl) {
//                                 searchInputEl.value = '';
//                                 searchInputEl.blur();
//                             }
//                         }
//                     }
//                 });
//             }

//             // Mobile video play toggle (local video only)
//             document.querySelectorAll('.mobile-video-wrap').forEach(wrap => {
//                 const vid = wrap.querySelector('video');
//                 const overlay = wrap.querySelector('.play-overlay');
//                 if (!vid) return;
//                 wrap.addEventListener('click', () => {
//                     if (vid.paused) {
//                         vid.play();
//                         if (overlay) overlay.style.opacity = '0';
//                     } else {
//                         vid.pause();
//                         if (overlay) overlay.style.opacity = '1';
//                     }
//                 });
//             });
//         })();
