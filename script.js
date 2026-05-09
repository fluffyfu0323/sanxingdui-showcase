/**
 * 三星堆文化资产展示网站 - 交互脚本
 */

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initScrollReveal();
    initSmoothNav();
    initSearch();
});

/* === Carousel === */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cards = document.querySelectorAll('.artifact-card');

    if (!track || !cards.length) return;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function scrollToCard(index) {
        const card = cards[index];
        if (card) {
            track.scrollTo({
                left: card.offsetLeft - track.offsetLeft,
                behavior: 'smooth'
            });
        }
        updateDots(index);
    }

    function updateDots(activeIndex) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    // Track scroll to update dots
    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = track.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 24; // including gap
            const activeIndex = Math.round(scrollLeft / cardWidth);
            updateDots(activeIndex);
        }, 100);
    });

    // Button controls
    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -340, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 340, behavior: 'smooth' });
    });
}

/* === Scroll Reveal Animation === */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.artifact-card, .case-card, .insight-card, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* === Smooth Navigation === */
function initSmoothNav() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 46, 0.98)';
        } else {
            header.style.background = 'rgba(26, 26, 46, 0.92)';
        }
    });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#D4A843';
            }
        });
    });
}

/* === Search Functionality === */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;

        // Search through cards
        const allCards = document.querySelectorAll('.artifact-card, .case-card');
        let found = false;

        allCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.outline = '2px solid #D4A843';
                card.style.outlineOffset = '4px';
                if (!found) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    found = true;
                }
                setTimeout(() => {
                    card.style.outline = '';
                    card.style.outlineOffset = '';
                }, 3000);
            } else {
                card.style.outline = '';
                card.style.outlineOffset = '';
            }
        });

        if (!found) {
            searchInput.style.borderColor = 'rgba(220, 60, 60, 0.5)';
            setTimeout(() => {
                searchInput.style.borderColor = '';
            }, 2000);
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}
