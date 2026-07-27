/**
 * NEWZEN GLOBAL - B2B Industrial Automation Application Script
 * Multi-page navigation active handler, hero carousel slider, dropdowns, modal dialogs
 * Includes: Premium full-screen slide-in mobile menu with accordion sub-menus & body scroll-lock
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Navigation Active State
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active link based on current page filename
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mmenu-link[href], .mmenu-sub a');
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

  // ------------------------------------------------------------------
  // 2. PREMIUM FULL-SCREEN SLIDE-IN MOBILE MENU
  // ------------------------------------------------------------------
  const mobileToggle    = document.getElementById('mobileToggle');
  const mobileOverlay   = document.getElementById('mobileMenuOverlay');
  const mobileCloseBtn  = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileOverlay) return;
    mobileOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);

  // Close when tapping outside (i.e. the overlay itself, not a child)
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) closeMobileMenu();
    });
  }

  // Accordion for sub-menus inside the mobile menu
  const mmenuAccordions = document.querySelectorAll('.mmenu-accordion-toggle');
  mmenuAccordions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.mmenu-item');
      if (!item) return;
      // Close sibling accordions
      document.querySelectorAll('.mmenu-item.is-expanded').forEach(open => {
        if (open !== item) open.classList.remove('is-expanded');
      });
      item.classList.toggle('is-expanded');
    });
  });

  // Close mobile menu when any internal link is clicked
  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

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

  // 3. Modal Dialog Handlers
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const consultationTriggers = document.querySelectorAll('[data-modal]');

  function openModal(type) {
    if (!modalOverlay) return;
    if (modalTitle) modalTitle.textContent = type === 'sales' ? 'Contact Sales & Applications' : 'Consult an Expert';
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Clean Close Handler
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
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

  // Auto-Load Pop-Up Lead Form: Fires when opening the homepage
  setTimeout(() => {
    const pathname = window.location.pathname.toLowerCase();
    const isHomepage = pathname === '/' || pathname.endsWith('/index.html') || pathname.endsWith('/') || !!document.getElementById('heroSlider');

    // Only run on homepage
    if (!isHomepage) return;

    if (modalOverlay && !modalOverlay.classList.contains('active')) {
      openModal('consultation');
    }
  }, 500);

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

    // Record submission timestamp for 24-hour cooldown
    localStorage.setItem('lastFormViewTime', Date.now().toString());

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

