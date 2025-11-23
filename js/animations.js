// Scroll Animation Controller
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupSkillsAnimation();
    this.setupStatsAnimation();
    this.setupGalleryAnimation();
    this.setupSmoothScroll();
  }
  
  // Intersection Observer for scroll-triggered animations
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, this.observerOptions);
    
    // Observe fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }
  
  // Animated Skills Progress Bars
  setupSkillsAnimation() {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skills = entry.target.querySelectorAll('.skill');
          
          skills.forEach((skill, index) => {
            setTimeout(() => {
              skill.classList.add('animate');
              
              const fill = skill.querySelector('.skill__fill');
              const width = fill.getAttribute('data-width');
              fill.style.setProperty('--skill-width', `${width}%`);
              fill.classList.add('animate');
            }, index * 100);
          });
          
          skillsObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }
  }
  
  // Animated Counter for Stats
  setupStatsAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statCards = entry.target.querySelectorAll('.stat-card');
          
          statCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate');
              
              const valueElement = card.querySelector('.stat-card__value');
              const targetValue = parseInt(valueElement.getAttribute('data-target'));
              
              this.animateCounter(valueElement, 0, targetValue, 2000);
            }, index * 150);
          });
          
          statsObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }
  
  // Counter Animation
  animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= end) {
        element.textContent = end + (end > 1 ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (end > 1 ? '+' : '');
      }
    }, 16);
  }
  
  // Gallery Animation
  setupGalleryAnimation() {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.gallery__item');
          
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate');
            }, index * 80);
          });
          
          galleryObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    const gallery = document.querySelector('.gallery');
    if (gallery) {
      galleryObserver.observe(gallery);
    }
  }
  
  // Smooth Scroll for Navigation
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update active nav link
          this.updateActiveNav(anchor);
        }
      });
    });
  }
  
  // Update Active Navigation Link
  updateActiveNav(clickedLink) {
    document.querySelectorAll('.sidebar__link, .mobile-nav__link').forEach(link => {
      link.classList.remove('sidebar__link--active', 'mobile-nav__link--active');
    });
    
    clickedLink.classList.add(
      clickedLink.classList.contains('sidebar__link') 
        ? 'sidebar__link--active' 
        : 'mobile-nav__link--active'
    );
  }
}

// Image Modal Controller
class ImageModal {
  constructor() {
    this.modal = document.getElementById('imageModal');
    this.modalImage = document.getElementById('modalImage');
    this.closeBtn = document.querySelector('.modal__close');
    this.prevBtn = document.querySelector('.modal__nav--prev');
    this.nextBtn = document.querySelector('.modal__nav--next');
    this.currentIndex = 0;
    this.images = [];
    
    this.init();
  }
  
  init() {
    if (!this.modal) return;
    
    // Get all gallery images
    this.images = Array.from(document.querySelectorAll('.gallery__item'));
    
    // Add click handlers to gallery items
    this.images.forEach((item, index) => {
      item.addEventListener('click', () => this.openModal(index));
    });
    
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate(1));
    }
    
    // Close on background click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      
      if (e.key === 'Escape') this.closeModal();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });
  }
  
  openModal(index) {
    this.currentIndex = index;
    const img = this.images[index].querySelector('.gallery__image');
    
    if (img && this.modalImage) {
      this.modalImage.src = img.src;
      this.modalImage.alt = img.alt;
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  navigate(direction) {
    this.currentIndex += direction;
    
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    } else if (this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    }
    
    this.openModal(this.currentIndex);
  }
}

// Form Validation
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
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
    this.form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
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
    const errorSpan = input.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';
    
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    } else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        errorMessage = 'Email inválido';
      }
    }
    
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
    }
    
    input.style.borderColor = isValid ? '' : '#ff6b6b';
    
    return isValid;
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
  new ImageModal();
  new FormValidator('contactForm');
  
  // Add fade-in class to sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
  });
});
