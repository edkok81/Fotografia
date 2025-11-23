// ============================================
// MODERN PORTFOLIO - ENHANCED JAVASCRIPT
// ============================================

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to element
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

// ============================================
// NAVIGATION
// ============================================

class Navigation {
    constructor() {
        this.sidebarLinks = document.querySelectorAll('.sidebar__link');
        this.mobileLinks = document.querySelectorAll('.mobile-nav__link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        // Handle navigation clicks
        [...this.sidebarLinks, ...this.mobileLinks].forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    smoothScrollTo(targetSection);
                }
            });
        });

        // Handle scroll-based active state
        window.addEventListener('scroll', debounce(() => this.updateActiveLink(), 100));
    }

    updateActiveLink() {
        const scrollPosition = window.pageYOffset + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update sidebar links
                this.sidebarLinks.forEach(link => {
                    link.classList.remove('sidebar__link--active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('sidebar__link--active');
                    }
                });

                // Update mobile links
                this.mobileLinks.forEach(link => {
                    link.classList.remove('mobile-nav__link--active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('mobile-nav__link--active');
                    }
                });
            }
        });
    }
}

// ============================================
// ANIMATED COUNTERS
// ============================================

class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-card__value');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });
    }
}

// ============================================
// SKILL BARS ANIMATION
// ============================================

class SkillBars {
    constructor() {
        this.skillFills = document.querySelectorAll('.skill__fill');
        this.hasAnimated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateSkills();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.3 });

        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateSkills() {
        this.skillFills.forEach((fill, index) => {
            setTimeout(() => {
                const width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
            }, index * 100);
        });
    }
}

// ============================================
// IMAGE GALLERY & MODAL
// ============================================

class ImageGallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery__item');
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.closeButton = document.querySelector('.modal__close');
        this.prevButton = document.querySelector('.modal__nav--prev');
        this.nextButton = document.querySelector('.modal__nav--next');
        this.currentIndex = 0;
        this.images = [];

        this.init();
    }

    init() {
        // Collect all images
        this.galleryItems.forEach((item, index) => {
            const img = item.querySelector('.gallery__image');
            this.images.push({
                src: img.src,
                alt: img.alt
            });

            // Click to open modal
            item.addEventListener('click', () => this.openModal(index));
        });

        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.closeModal());
        }

        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.showPrevious());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.showNext());
        }

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.showPrevious();
                    break;
                case 'ArrowRight':
                    this.showNext();
                    break;
            }
        });
    }

    openModal(index) {
        this.currentIndex = index;
        this.updateModalImage();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showPrevious() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateModalImage();
    }

    showNext() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateModalImage();
    }

    updateModalImage() {
        const image = this.images[this.currentIndex];
        this.modalImage.src = image.src;
        this.modalImage.alt = image.alt;
    }
}

// ============================================
// FORM VALIDATION
// ============================================

class FormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('.form-input[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;

        // Clear previous error
        this.clearError(input);

        // Check if empty
        if (!value) {
            this.showError(input, 'Este campo é obrigatório');
            return false;
        }

        // Email validation
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(input, 'Por favor, insira um email válido');
                return false;
            }
        }

        return true;
    }

    showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
        }

        input.style.borderColor = '#ef4444';
    }

    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');

        if (errorElement) {
            errorElement.classList.remove('active');
        }

        input.style.borderColor = '';
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements
        const elements = document.querySelectorAll('.section__header, .about__bio, .gallery__item');
        elements.forEach(el => observer.observe(el));

        // Stagger gallery items
        const galleryItems = document.querySelectorAll('.gallery__item');
        galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// ============================================
// RESUME DOWNLOAD
// ============================================

class ResumeDownload {
    constructor() {
        this.downloadButton = document.getElementById('downloadCurriculo');
        this.init();
    }

    init() {
        if (!this.downloadButton) return;

        this.downloadButton.addEventListener('click', () => {
            // Update this path to your actual resume file
            const cvPath = '/docs/curriculo.pdf';
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'Curriculo_Caê_Kokubo.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}

// ============================================
// SCROLL INDICATOR
// ============================================

class ScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.hero__scroll-indicator');
        this.init();
    }

    init() {
        if (!this.indicator) return;

        this.indicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                smoothScrollTo(aboutSection);
            }
        });

        // Hide indicator on scroll
        window.addEventListener('scroll', debounce(() => {
            if (window.pageYOffset > 100) {
                this.indicator.style.opacity = '0';
            } else {
                this.indicator.style.opacity = '1';
            }
        }, 100));
    }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new AnimatedCounter();
    new SkillBars();
    new ImageGallery();
    new FormValidator();
    new ScrollAnimations();
    new ResumeDownload();
    new ScrollIndicator();

    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');

    console.log('🚀 Portfolio initialized successfully!');
});

// ============================================
// PERFORMANCE MONITORING (Optional)
// ============================================

// Log performance metrics
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }
});