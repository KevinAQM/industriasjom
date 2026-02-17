/**
 * INDUSTRIAS JOM - Main JavaScript
 * Modern interactive functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initHeroCarousel();
    initScrollReveal();
    initSmoothScroll();
    initProductTabs();
    initCounterAnimation();
});

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Hero carousel with autoplay and arrow navigation
 */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const prevArrow = document.querySelector('.hero-arrow-prev');
    const nextArrow = document.querySelector('.hero-arrow-next');

    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Auto advance slides
    let interval = setInterval(nextSlide, slideInterval);

    // Click handlers for arrows
    if (prevArrow) {
        prevArrow.addEventListener('click', function () {
            clearInterval(interval);
            prevSlide();
            interval = setInterval(nextSlide, slideInterval);
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', function () {
            clearInterval(interval);
            nextSlide();
            interval = setInterval(nextSlide, slideInterval);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            clearInterval(interval);
            prevSlide();
            interval = setInterval(nextSlide, slideInterval);
        } else if (e.key === 'ArrowRight') {
            clearInterval(interval);
            nextSlide();
            interval = setInterval(nextSlide, slideInterval);
        }
    });

    // Initialize first slide
    showSlide(0);
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        reveals.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check initial state
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Reveal elements after scroll completes
            setTimeout(() => {
                revealAllElements();
            }, 600);
        });
    });

    // Handle initial hash in URL on page load
    handleInitialHash();
}

/**
 * Handle navigation to hash on page load
 */
function handleInitialHash() {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            // Wait for page to fully render
            setTimeout(() => {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Reveal elements after scroll
                setTimeout(() => {
                    revealAllElements();
                }, 600);
            }, 100);
        }
    }
}

/**
 * Force reveal all elements on the page
 */
function revealAllElements() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        element.classList.add('active');
    });
}

/**
 * Product tabs functionality
 * Only filters products when tabs have data-category attribute
 * Ignores anchor navigation tabs (those with href starting with #)
 */
function initProductTabs() {
    // Only select tabs that have data-category attribute (filtering tabs)
    const filterTabs = document.querySelectorAll('.product-tab[data-category]');
    const productCards = document.querySelectorAll('.product-card');

    if (filterTabs.length === 0) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const category = this.dataset.category;

            // Update active tab only among filter tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Counter animation for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Form validation helper
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

/**
 * Lazy loading for images
 */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Add active class to current page in navigation
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Run on page load
setActiveNavLink();

/**
 * Parallax effect for hero background
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        const backgrounds = hero.querySelectorAll('.hero-slide-bg');

        backgrounds.forEach(bg => {
            bg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    });
}

// Initialize parallax effect
initParallax();

/**
 * Typing effect for hero title
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.dataset.text || typingElement.textContent;
    typingElement.textContent = '';

    let charIndex = 0;
    const typeSpeed = 100;

    function type() {
        if (charIndex < text.length) {
            typingElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, typeSpeed);
        }
    }

    // Start typing when element is visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            type();
            observer.disconnect();
        }
    });

    observer.observe(typingElement);
}

/**
 * Image lightbox functionality
 */
function initLightbox() {
    const galleryImages = document.querySelectorAll('[data-lightbox]');
    if (galleryImages.length === 0) return;

    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
    <button class="lightbox-close">&times;</button>
    <img class="lightbox-image" src="" alt="">
    <button class="lightbox-prev">&lt;</button>
    <button class="lightbox-next">&gt;</button>
  `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = galleryImages[index].src || galleryImages[index].querySelector('img').src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImage.src = galleryImages[currentIndex].src || galleryImages[currentIndex].querySelector('img').src;
        }
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImage.src = galleryImages[currentIndex].src || galleryImages[currentIndex].querySelector('img').src;
        }
    });
}
