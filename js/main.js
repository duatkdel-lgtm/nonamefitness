/* ===================================
   NONAME FITNESS - Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===================================
    // Active Nav Link on Scroll
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollY = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ===================================
    // Number Counter Animation
    // ===================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;
    
    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function - easeOutExpo
                const easeProgress = 1 - Math.pow(2, -10 * progress);
                const current = Math.round(start + (target - start) * easeProgress);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }
    
    // Trigger counter when stats section is visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroStats);
    }

    // ===================================
    // Scroll Reveal Animation (AOS-like)
    // ===================================
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => revealObserver.observe(el));

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            
            if (targetEl) {
                const offset = 80;
                const targetPosition = targetEl.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Back to Top
    // ===================================
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===================================
    // Parallax Effect on Hero
    // ===================================
    const heroBg = document.querySelector('.hero-bg img');
    
    function parallaxHero() {
        if (window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.3;
            heroBg.style.transform = `scale(1.1) translateY(${offset}px)`;
        }
    }
    
    window.addEventListener('scroll', parallaxHero, { passive: true });

    // ===================================
    // Image Lazy Loading Enhancement
    // ===================================
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // Facility Gallery
    // ===================================
    const galleryMainImg = document.getElementById('galleryMainImg');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryDesc = document.getElementById('galleryDesc');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    let currentGalleryIndex = 0;

    function updateGallery(index, isManual) {
        if (!galleryThumbs.length) return;
        const thumb = galleryThumbs[index];
        if (!thumb) return;

        currentGalleryIndex = index;

        // Fade effect
        galleryMainImg.style.opacity = '0';
        setTimeout(() => {
            galleryMainImg.src = thumb.dataset.img;
            galleryMainImg.alt = thumb.dataset.title;
            galleryTitle.textContent = thumb.dataset.title;
            galleryDesc.textContent = thumb.dataset.desc;
            galleryMainImg.style.opacity = '1';
        }, 250);

        // Update active thumb
        galleryThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Only scroll thumbs on manual interaction (not auto-play)
        if (isManual) {
            const thumbContainer = thumb.parentElement;
            const scrollLeft = thumb.offsetLeft - thumbContainer.offsetLeft - (thumbContainer.clientWidth / 2) + (thumb.clientWidth / 2);
            thumbContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }

    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            updateGallery(index, true);
        });
    });

    if (galleryPrev) {
        galleryPrev.addEventListener('click', () => {
            const newIndex = (currentGalleryIndex - 1 + galleryThumbs.length) % galleryThumbs.length;
            updateGallery(newIndex, true);
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', () => {
            const newIndex = (currentGalleryIndex + 1) % galleryThumbs.length;
            updateGallery(newIndex, true);
        });
    }

    // Auto-play gallery
    let galleryAutoPlay = setInterval(() => {
        if (galleryThumbs.length) {
            const newIndex = (currentGalleryIndex + 1) % galleryThumbs.length;
            updateGallery(newIndex);
        }
    }, 5000);

    // Pause autoplay on hover
    const galleryMain = document.getElementById('galleryMain');
    if (galleryMain) {
        galleryMain.addEventListener('mouseenter', () => clearInterval(galleryAutoPlay));
        galleryMain.addEventListener('mouseleave', () => {
            galleryAutoPlay = setInterval(() => {
                const newIndex = (currentGalleryIndex + 1) % galleryThumbs.length;
                updateGallery(newIndex);
            }, 5000);
        });
    }

    // ===================================
    // Keyboard Navigation
    // ===================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        // Gallery keyboard nav
        if (e.key === 'ArrowLeft' && galleryThumbs.length) {
            const newIndex = (currentGalleryIndex - 1 + galleryThumbs.length) % galleryThumbs.length;
            updateGallery(newIndex);
        }
        if (e.key === 'ArrowRight' && galleryThumbs.length) {
            const newIndex = (currentGalleryIndex + 1) % galleryThumbs.length;
            updateGallery(newIndex);
        }
    });

    // Initial call
    handleScroll();
    updateActiveLink();
});
