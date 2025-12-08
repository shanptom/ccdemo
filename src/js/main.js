/**
 * Coffee Shop Website - Main JavaScript
 * Mobile-first responsive functionality with WOW effects
 */

document.addEventListener('DOMContentLoaded', function () {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================
    // PAGE LOADER
    // ============================================
    const pageLoader = document.getElementById('pageLoader');

    function hideLoader() {
        if (pageLoader) {
            // Small delay to ensure smooth transition
            setTimeout(() => {
                pageLoader.classList.add('loaded');
                // Trigger hero animations after loader hides
                setTimeout(triggerHeroAnimations, 300);
            }, prefersReducedMotion ? 0 : 800);
        } else {
            triggerHeroAnimations();
        }
    }

    // Hide loader when page is ready
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // ============================================
    // HERO TEXT REVEAL ANIMATIONS
    // ============================================
    function triggerHeroAnimations() {
        const revealElements = document.querySelectorAll('.reveal-text');

        if (prefersReducedMotion) {
            // Immediately show all elements without animation
            revealElements.forEach(el => el.classList.add('visible'));
        } else {
            // Staggered reveal with built-in CSS delays
            revealElements.forEach(el => {
                el.classList.add('visible');
            });
        }
    }

    // ============================================
    // SCROLLED HEADER EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let ticking = false;

    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // FLOATING SIDEBAR NAVIGATION
    // ============================================
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');

            // Animate hamburger icon to X
            const lines = document.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                if (hamburgerMenu.classList.contains('active')) {
                    if (index === 0) line.style.transform = 'rotate(45deg) translate(7px, 7px)';
                    if (index === 1) line.style.opacity = '0';
                    if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -7px)';
                } else {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                }
            });
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function (event) {
            if (!hamburgerMenu.contains(event.target) &&
                !mainNav.contains(event.target) &&
                mainNav.classList.contains('active')) {
                closeNav();
            }
        });

        // Close sidebar when clicking nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeNav);
        });

        function closeNav() {
            mainNav.classList.remove('active');
            hamburgerMenu.classList.remove('active');

            const lines = document.querySelectorAll('.hamburger-line');
            lines.forEach(line => {
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        }
    }

    // ============================================
    // STEAM WISPS - PAUSE WHEN NOT VISIBLE
    // ============================================
    const steamContainer = document.querySelector('.steam-container');
    const steamWisps = document.querySelectorAll('.steam-wisp');

    if (steamContainer && steamWisps.length > 0 && !prefersReducedMotion) {
        // Pause animations when hero is not in view
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                steamWisps.forEach(wisp => {
                    wisp.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroObserver.observe(heroSection);
        }

        // Pause when tab is not visible (battery saving)
        document.addEventListener('visibilitychange', () => {
            const isPaused = document.hidden ? 'paused' : 'running';
            steamWisps.forEach(wisp => {
                wisp.style.animationPlayState = isPaused;
            });
        });
    }

    // ============================================
    // SCROLL-TRIGGERED ANIMATIONS FOR SECTIONS
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-view');
                fadeInObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe featured items for scroll animations
    const featuredItems = document.querySelectorAll('.featured-item');
    featuredItems.forEach((item, index) => {
        item.classList.add('fade-in-element');
        if (!prefersReducedMotion) {
            item.style.transitionDelay = `${index * 0.15}s`;
        }
        fadeInObserver.observe(item);
    });

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // MOBILE TAP TARGET VALIDATION (Dev Only)
    // ============================================
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isDev) {
        function validateTapTargets() {
            const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
            interactiveElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    console.warn(`Tap target may be too small (${rect.width.toFixed(0)}x${rect.height.toFixed(0)}):`, element);
                }
            });
        }

        // Run after layout is complete
        requestAnimationFrame(() => {
            requestAnimationFrame(validateTapTargets);
        });
    }
});
