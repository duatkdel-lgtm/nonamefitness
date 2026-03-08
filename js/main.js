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

    // ===================================
    // Quick Consult Modal
    // ===================================
    const WEBHOOK_URL = 'https://hook.eu2.make.com/lnb1y5o2v9a7pcd1uow4umptxax9jg70';

    const consultBtn = document.getElementById('quickConsultBtn');
    const consultModal = document.getElementById('consultModal');
    const modalClose = document.getElementById('modalClose');
    const consultForm = document.getElementById('consultForm');
    const consultPhone = document.getElementById('consultPhone');
    const consultSubmit = document.getElementById('consultSubmit');

    // Open modal
    consultBtn.addEventListener('click', () => {
        consultModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    function closeModal() {
        consultModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    consultModal.addEventListener('click', (e) => {
        if (e.target === consultModal) closeModal();
    });

    // Phone number auto-format
    consultPhone.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        if (val.length > 7) {
            val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);
        } else if (val.length > 3) {
            val = val.slice(0, 3) + '-' + val.slice(3);
        }
        e.target.value = val;
    });

    // Form submit
    consultForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('consultName').value.trim();
        const phone = consultPhone.value.trim();
        const programs = [...document.querySelectorAll('input[name="program"]:checked')].map(c => c.value);
        const goal = [...document.querySelectorAll('input[name="goal"]:checked')].map(c => c.value);

        // Validation
        if (!name) { alert('성함을 입력해주세요.'); return; }
        if (!phone || phone.replace(/\D/g, '').length < 10) { alert('연락처를 정확히 입력해주세요.'); return; }
        if (programs.length === 0) { alert('관심 프로그램을 선택해주세요.'); return; }

        const data = {
            name,
            programs,
            phone,
            goal: goal.length > 0 ? goal : ['미선택'],
            timestamp: new Date().toISOString()
        };

        consultSubmit.disabled = true;
        consultSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';

        try {
            if (WEBHOOK_URL) {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                console.log('상담 신청 데이터:', data);
            }

            consultSubmit.innerHTML = '<i class="fas fa-check"></i> 신청 완료!';
            consultSubmit.classList.add('success');

            setTimeout(() => {
                closeModal();
                consultForm.reset();
                consultSubmit.disabled = false;
                consultSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> 상담 신청하기';
                consultSubmit.classList.remove('success');
            }, 2000);

        } catch (err) {
            console.error('웹훅 전송 실패:', err);
            consultSubmit.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 전송 실패';
            setTimeout(() => {
                consultSubmit.disabled = false;
                consultSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> 상담 신청하기';
            }, 2000);
        }
    });

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && consultModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Initial call
    handleScroll();
    updateActiveLink();

    // ===================================
    // Premium PT Modal
    // ===================================
    const premiumPtModal = document.getElementById('premiumPtModal');
    const premiumPtClose = document.getElementById('premiumPtClose');
    const premiumPtCard  = document.getElementById('premiumPtCard');

    function openPremiumPt() {
        if (!premiumPtModal) return;
        premiumPtModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePremiumPt() {
        if (!premiumPtModal) return;
        premiumPtModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (premiumPtCard) {
        premiumPtCard.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openPremiumPt();
        });
    }

    if (premiumPtClose) {
        premiumPtClose.addEventListener('click', closePremiumPt);
    }

    if (premiumPtModal) {
        premiumPtModal.addEventListener('click', (e) => {
            if (e.target === premiumPtModal) closePremiumPt();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (premiumPtModal && premiumPtModal.classList.contains('active') && e.key === 'Escape') {
            closePremiumPt();
        }
    });

    // ===================================
    // Unlimited PT Modal
    // ===================================
    const unlimitedPtModal = document.getElementById('unlimitedPtModal');
    const unlimitedPtClose = document.getElementById('unlimitedPtClose');
    const unlimitedPtCard  = document.getElementById('unlimitedPtCard');

    function openUnlimitedPt() {
        if (!unlimitedPtModal) return;
        unlimitedPtModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeUnlimitedPt() {
        if (!unlimitedPtModal) return;
        unlimitedPtModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (unlimitedPtCard) {
        unlimitedPtCard.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openUnlimitedPt();
        });
    }

    if (unlimitedPtClose) {
        unlimitedPtClose.addEventListener('click', closeUnlimitedPt);
    }

    if (unlimitedPtModal) {
        unlimitedPtModal.addEventListener('click', (e) => {
            if (e.target === unlimitedPtModal) closeUnlimitedPt();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (unlimitedPtModal && unlimitedPtModal.classList.contains('active') && e.key === 'Escape') {
            closeUnlimitedPt();
        }
    });
});
