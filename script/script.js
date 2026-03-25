document.addEventListener('DOMContentLoaded', () => {
    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.getElementById('searchInput');

    searchToggle.addEventListener('click', () => {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close search bar when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            searchInput.classList.remove('active');
        }
    });

    // Cursor-reactive lava glow in hero section
    const heroSection = document.querySelector('.hero-section');
    const cursorGlow = document.querySelector('.cursor-glow');

    if (heroSection && cursorGlow) {
        // Start glow at a default position
        cursorGlow.style.left = '50%';
        cursorGlow.style.top = '50%';

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cursorGlow.style.left = x + 'px';
            cursorGlow.style.top  = y + 'px';
        });

        // Fade out glow when cursor leaves hero
        heroSection.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
        heroSection.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
    }
});
