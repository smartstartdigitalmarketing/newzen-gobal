/**
 * NEWZEN GLOBAL - B2B Industrial Automation Application Script
 * Multi-page navigation active handler, hero carousel slider, dropdowns, modal dialogs
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Navigation Active State & Mobile Menu Toggle
  const mainNav = document.getElementById('mainNav');
  const mobileToggle = document.getElementById('mobileToggle');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active link based on current page filename
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const pageName = href.split('/').pop();
    if (pageName === currentPath || (currentPath === '' && pageName === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const toggleLink = parentDropdown.querySelector('.dropdown-toggle');
        if (toggleLink) toggleLink.classList.add('active');
      }
    }
  });

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  // Touch/Click Toggle for Nav Dropdowns (Mobile & Accessibility)
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // 2. Dynamic Hero Carousel Slider
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    if (slides.length === 0) return;
    let newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex);
  }

  function prevSlide() {
    if (slides.length === 0) return;
    let newIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, 2000);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startAutoPlay();
      });
    });

    const heroSliderEl = document.getElementById('heroSlider');
    if (heroSliderEl) {
      heroSliderEl.addEventListener('mouseenter', stopAutoPlay);
      heroSliderEl.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
  }

  // 3. Modal Dialog Handlers & Safe 24-Second Respawn Loop (Homepage Only)
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const consultationTriggers = document.querySelectorAll('[data-modal]');
  const RESPAWN_DELAY_MS = 24000; // 24 seconds
  let respawnTimer = null;

  // Safe, Robust Homepage Detection (Supports file:///, localhost, GitHub Pages, production domain)
  const currentPath = (window.location.pathname || '').toLowerCase();
  const currentHref = (window.location.href || '').toLowerCase();
  const isHomePage =
    currentPath === '/' ||
    currentPath === '' ||
    currentPath.endsWith('/') ||
    currentPath.endsWith('index.html') ||
    currentHref.endsWith('/') ||
    currentHref.endsWith('index.html') ||
    document.getElementById('heroSlider') !== null;

  function openModal(type) {
    if (!modalOverlay) return;
    if (modalTitle) modalTitle.textContent = type === 'sales' ? 'Contact Sales & Applications' : 'Consult an Expert';
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Clear any pending respawn timer when modal is open
    if (respawnTimer) {
      clearTimeout(respawnTimer);
      respawnTimer = null;
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Clear any existing timer to prevent multiple concurrent timers
    if (respawnTimer) {
      clearTimeout(respawnTimer);
      respawnTimer = null;
    }

    // Schedule 24-second respawn timer ONLY on the Homepage
    if (isHomePage) {
      respawnTimer = setTimeout(() => {
        if (modalOverlay && !modalOverlay.classList.contains('active')) {
          openModal('consultation');
        }
      }, RESPAWN_DELAY_MS);
    }
  }

  // Safe State Cleanup on Non-Homepage Routes
  if (!isHomePage) {
    if (respawnTimer) {
      clearTimeout(respawnTimer);
      respawnTimer = null;
    }
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  consultationTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = btn.getAttribute('data-modal');
      openModal(modalType);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Initial Auto-Open on Page Load ONLY on Homepage (1 second smooth entrance)
  if (isHomePage) {
    const initialTimer = setTimeout(() => {
      if (modalOverlay && !modalOverlay.classList.contains('active')) {
        openModal('consultation');
      }
    }, 1000);
  }

  // 4. Form Submissions
  const modalForm = document.getElementById('modalForm');
  const contactForm = document.getElementById('mainContactForm');

  function handleFormSubmit(event, formName) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    if (!btn) return;
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      alert(`Thank you for contacting Newzen Global. Your ${formName} has been routed to our application engineering team.`);
      btn.textContent = originalText;
      btn.disabled = false;
      event.target.reset();
      if (modalOverlay && modalOverlay.classList.contains('active')) closeModal();
    }, 600);
  }

  if (modalForm) modalForm.addEventListener('submit', (e) => handleFormSubmit(e, 'expert consultation request'));
  if (contactForm) contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'inquiry'));

  // 5. Core Solutions Split-Screen Tab Switcher
  const tabList = document.getElementById('solutionsTabList');
  const solutionsPanel = document.getElementById('solutionsPanel');

  if (tabList && solutionsPanel) {
    tabList.addEventListener('click', (e) => {
      const tab = e.target.closest('.solutions-tab-item');
      if (!tab) return;

      const targetId = tab.getAttribute('data-tab');
      if (!targetId) return;

      // Update active tab
      tabList.querySelectorAll('.solutions-tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel with fade
      solutionsPanel.querySelectorAll('.solutions-panel-item').forEach(panel => {
        panel.classList.remove('active');
      });
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  }

  // 6. Dynamic Counter Count-Up Animation
  const counterVals = document.querySelectorAll('.counter-val');
  let animated = false;

  function animateCounters() {
    counterVals.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      const duration = 1600; // ms
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  }

  const impactSection = document.getElementById('impactSection');
  if (impactSection) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            animateCounters();
          }
        });
      }, { threshold: 0.2 });
      observer.observe(impactSection);
    } else {
      animateCounters();
    }
  }

});

