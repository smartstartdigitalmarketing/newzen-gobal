/**
 * NEWZEN GLOBAL - B2B Industrial Automation Application Script
 * Multi-page navigation active handler, hero carousel slider, dropdowns, modal dialogs
 */

// Immediate Global Content Modal System
window.openContentModal = function(id) {
  if (!id) return;
  const modal = document.getElementById(id);
  if (modal) {
    document.querySelectorAll('.content-modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
};

window.closeContentModal = function(id, targetSectionId) {
  if (!targetSectionId && id && id.startsWith('modal-segment-')) {
    targetSectionId = 'customer-segments';
  }

  if (id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  } else {
    const activeModal = document.querySelector('.content-modal-overlay.active');
    if (activeModal && activeModal.id && activeModal.id.startsWith('modal-segment-')) {
      targetSectionId = 'customer-segments';
    }
    document.querySelectorAll('.content-modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
  }
  document.body.style.overflow = '';

  if (window.history.replaceState) {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('modal')) {
        url.searchParams.delete('modal');
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + (url.hash || ''));
      }
    } catch(e) {}
  }

  // If targetSectionId is passed or inferred, smoothly scroll to that section
  if (targetSectionId) {
    const target = document.getElementById(targetSectionId);
    if (target) {
      setTimeout(() => {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
};

// Global Delegated Click Handler for Modal Triggers and Smooth Scroll Offset
document.addEventListener('click', (e) => {
  // 1. Delegated Modal Trigger Check (service cards or explicit onclick triggers)
  const journeyCard = e.target.closest('.service-page-card, [onclick*="openContentModal"], [data-open-modal]');
  if (journeyCard) {
    let modalId = journeyCard.getAttribute('data-open-modal');
    if (!modalId) {
      const onclickAttr = journeyCard.getAttribute('onclick') || '';
      const match = onclickAttr.match(/openContentModal\(['"]([^'"]+)['"]\)/);
      if (match) modalId = match[1];
    }
    if (modalId && document.getElementById(modalId)) {
      e.preventDefault();
      window.openContentModal(modalId);
      return;
    }
  }

  // 2. Smooth Auto-Scroll with Sticky Header Offset (120px)
  const anchor = e.target.closest('a[href*="#"]');
  if (anchor) {
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 120;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        if (window.history.pushState) {
          window.history.pushState(null, '', href);
        }
      }
    }
  }
});

// Auto-Scroll Offset on Page Load if URL contains a Hash (e.g. index.html#customer-segments)
window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const headerOffset = 120;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 150);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {

  // Persistent Sticky Header Scroll Handler
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        headerEl.classList.add('is-sticky');
      } else {
        headerEl.classList.remove('is-sticky');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

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

  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mainNav) mainNav.classList.toggle('open');
      if (mobileDrawer) mobileDrawer.classList.toggle('active');
    });
  }

  if (mobileDrawerClose && mobileDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  // Touch/Click Toggle for Nav Dropdowns (Mobile Accordion Toggle Open/Close)
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('open');
          // Close all other dropdowns
          navDropdowns.forEach(other => {
            if (other !== dropdown) other.classList.remove('open');
          });
          // Toggle current dropdown: if open -> close it, if closed -> open it
          if (isOpen) {
            dropdown.classList.remove('open');
          } else {
            dropdown.classList.add('open');
          }
        }
      });
    }
  });

  // Touch/Click Toggle for Mobile Sub-Flyouts
  const subFlyoutToggles = document.querySelectorAll('.has-sub-flyout > a');
  subFlyoutToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        const parent = this.parentElement;
        const flyoutCard = parent.querySelector('.sub-flyout-card');
        const arrow = this.querySelector('.flyout-arrow');
        
        if (flyoutCard) {
          const isOpen = flyoutCard.style.display === 'flex';
          
          // Close others
          document.querySelectorAll('.sub-flyout-card').forEach(card => {
            if (card !== flyoutCard) card.style.display = 'none';
          });
          document.querySelectorAll('.flyout-arrow').forEach(a => {
            if (a !== arrow) a.style.transform = 'rotate(0deg)';
          });
          
          // Toggle current
          if (isOpen) {
            flyoutCard.style.display = 'none';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
          } else {
            flyoutCard.style.display = 'flex';
            if (arrow) arrow.style.transform = 'rotate(90deg)';
          }
        }
      }
    });
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

  // 3. Modal Dialog Handlers
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const consultationTriggers = document.querySelectorAll('[data-modal]');

  // Brochure Modal Functions
  function openBrochureModal() {
    let brochureOverlay = document.getElementById('brochureModalOverlay');
    if (!brochureOverlay) {
      injectBrochureModal();
      brochureOverlay = document.getElementById('brochureModalOverlay');
    }
    if (brochureOverlay) {
      brochureOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBrochureModal() {
    const brochureOverlay = document.getElementById('brochureModalOverlay');
    if (brochureOverlay) {
      brochureOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function injectBrochureModal() {
    if (document.getElementById('brochureModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'brochureModalOverlay';
    overlay.className = 'modal-overlay brochure-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'brochureModalTitle');

    overlay.innerHTML = `
      <div class="modal-container brochure-modal-container">
        <button class="modal-close" id="brochureModalClose" aria-label="Close Modal">&times;</button>
        <div class="brochure-modal-grid">
          <!-- Left: Brochure Visual Showcase -->
          <div class="brochure-modal-preview">
            <div class="brochure-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              12-Page Comprehensive Guide
            </div>
            <div class="brochure-img-wrapper">
              <img src="images/brochure_cover_preview.jpg" alt="NewZen Global Corporate Brochure" class="brochure-cover-thumb">
              <div class="brochure-format-tag">PDF &bull; 4.4 MB</div>
            </div>
            <div class="brochure-preview-features">
              <div class="feat-item"><span class="feat-check">&#10003;</span> Industrial Electrification &amp; Automation</div>
              <div class="feat-item"><span class="feat-check">&#10003;</span> Intralogistics &amp; Industry 4.0 Solutions</div>
              <div class="feat-item"><span class="feat-check">&#10003;</span> Products, MRO Kits &amp; System Integration</div>
            </div>
          </div>

          <!-- Right: Lead Capture Form -->
          <div class="brochure-modal-form-wrap">
            <div class="brochure-form-header">
              <span class="accent-pill-badge" style="font-size: 0.72rem; margin-bottom: 6px;">Company Overview</span>
              <h3 id="brochureModalTitle">Download Corporate Brochure</h3>
              <p>Fill in your details below to receive instant access to our comprehensive 12-page capabilities brochure.</p>
            </div>

            <form id="brochureLeadForm" class="brochure-form">
              <div class="form-group">
                <label class="form-label" for="brochureName">Full Name *</label>
                <input type="text" id="brochureName" class="form-input" required placeholder="e.g. John Doe">
              </div>
              
              <div class="form-group">
                <label class="form-label" for="brochureEmail">Business Email *</label>
                <input type="email" id="brochureEmail" class="form-input" required placeholder="john@company.com">
              </div>

              <div class="form-group">
                <label class="form-label" for="brochurePhone">Phone / WhatsApp Number *</label>
                <input type="tel" id="brochurePhone" class="form-input" required placeholder="+91 98765 43210">
              </div>

              <div class="form-group">
                <label class="form-label" for="brochureCompany">Company Name *</label>
                <input type="text" id="brochureCompany" class="form-input" required placeholder="e.g. Acme Industries Ltd.">
              </div>

              <button type="submit" id="brochureSubmitBtn" class="brochure-submit-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>INSTANT DOWNLOAD BROCHURE (PDF)</span>
              </button>
              
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; font-size: 0.75rem; color: #64748B;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Direct PDF download begins immediately on submit.</span>
              </div>

              <div id="brochureSuccessMsg" style="display: none; background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 12px; border-radius: 6px; text-align: center; margin-top: 12px; font-size: 0.85rem; font-weight: 600;">
                &#10003; Download started! Thank you for your interest.
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Attach close listener
    const closeBtn = document.getElementById('brochureModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeBrochureModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBrochureModal();
    });

    // Form submit listener
    const form = document.getElementById('brochureLeadForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('brochureSubmitBtn');
        const successMsg = document.getElementById('brochureSuccessMsg');
        const name = document.getElementById('brochureName')?.value.trim() || 'Not provided';
        const email = document.getElementById('brochureEmail')?.value.trim() || 'Not provided';
        const phone = document.getElementById('brochurePhone')?.value.trim() || 'Not provided';
        const company = document.getElementById('brochureCompany')?.value.trim() || 'Not provided';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Preparing Download...</span>`;
        }

        // 1. Trigger Direct PDF Download
        const downloadLink = document.createElement('a');
        downloadLink.href = 'docs/NewZen_Global_Corporate_Brochure.pdf';
        downloadLink.download = 'NewZen_Global_Corporate_Brochure.pdf';
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          if (downloadLink.parentNode) document.body.removeChild(downloadLink);
        }, 100);

        // 2. Trigger WhatsApp Lead Notification to +91 7373 83 1313
        const waText = `*New Corporate Brochure Download*\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Company:* ${company}\n*Document:* NewZen Global Corporate Brochure (12-Page PDF)`;
        const encodedWa = encodeURIComponent(waText);
        window.open(`https://wa.me/917373831313?text=${encodedWa}`, '_blank');

        // 3. Show Success Message
        if (successMsg) successMsg.style.display = 'block';

        // 4. Close modal after 2.5 seconds
        setTimeout(() => {
          closeBrochureModal();
          form.reset();
          if (successMsg) successMsg.style.display = 'none';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>INSTANT DOWNLOAD BROCHURE (PDF)</span>
            `;
          }
        }, 2500);
      });
    }
  }

  // Inject brochure modal into DOM immediately
  injectBrochureModal();

  function openModal(type) {
    if (type === 'brochure') {
      openBrochureModal();
      return;
    }
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
    // Remember that the user closed the modal so it never auto-pops up again
    try {
      localStorage.setItem('hasClosedConsultationModal', 'true');
    } catch(e) {}
  }

  consultationTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = btn.getAttribute('data-modal');
      openModal(modalType);
    });
  });

  // Global click delegation for any data-modal="brochure"
  document.addEventListener('click', (e) => {
    const brochureBtn = e.target.closest('[data-modal="brochure"]');
    if (brochureBtn) {
      e.preventDefault();
      openBrochureModal();
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Auto-Load Pop-Up Lead Form: Opens automatically 10 seconds after opening the website
  setTimeout(() => {
    // If the user has already closed or submitted the modal once, NEVER show it automatically again
    try {
      if (localStorage.getItem('hasClosedConsultationModal') === 'true') return;
    } catch(e) {}

    const pathname = window.location.pathname.toLowerCase();
    const isHomepage = pathname === '/' || pathname.endsWith('/index.html') || pathname.endsWith('/') || !!document.getElementById('heroSlider');

    // Only run on homepage
    if (!isHomepage) return;

    if (modalOverlay && !modalOverlay.classList.contains('active')) {
      openModal('consultation');
    }
  }, 10000);

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

    const target = event.target;
    
    // Extract values flexibly depending on which form is submitted
    const name = (target.querySelector('[id$="Name"]') || target.querySelector('input[type="text"]'))?.value.trim() || 'Not provided';
    const email = (target.querySelector('[id$="Email"]') || target.querySelector('input[type="email"]'))?.value.trim() || 'Not provided';
    const phone = (target.querySelector('[id$="Phone"]') || target.querySelector('input[type="tel"]'))?.value.trim() || 'Not provided';
    const company = (target.querySelector('[id$="Company"]') || {value: ''}).value.trim();
    const msg = (target.querySelector('textarea'))?.value.trim() || '';

    // Determine type of inquiry
    const modalTitleEl = document.getElementById('modalTitle');
    const isRFQ = modalTitleEl && modalTitleEl.innerText.includes("Quote") && formName.includes("expert");
    
    let waTitle = isRFQ ? "*New RFQ Enquiry*" : `*New ${formName.toUpperCase()}*`;
    let waText = `${waTitle}\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}`;
    if (company) waText += `\n*Company:* ${company}`;
    if (msg) waText += `\n\n*Details:*\n${msg}`;

    const encodedText = encodeURIComponent(waText);

    // Clear the cart if it was an RFQ
    if (isRFQ) {
      rfqCart = [];
      localStorage.removeItem("nz_rfq_cart");
      if (typeof renderRFQIcon === 'function') renderRFQIcon();
    }

    // Open WhatsApp to official hotline number +91 7373 83 1313
    window.open(`https://wa.me/917373831313?text=${encodedText}`, '_blank');
    
    btn.textContent = originalText;
    btn.disabled = false;
    event.target.reset();
    if (modalOverlay && modalOverlay.classList.contains('active')) closeModal();
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


  // 1b. Smooth In-Page Modal Opening for Dropdown Items
  document.querySelectorAll('a[href*="modal="]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;
      
      try {
        const url = new URL(href, window.location.href);
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        const targetFile = url.pathname.split('/').pop();
        
        if (currentFile === targetFile) {
          const targetModal = url.searchParams.get('modal');
          if (targetModal && document.getElementById(targetModal)) {
            e.preventDefault();
            // Close any currently active modals
            document.querySelectorAll('.content-modal-overlay.active').forEach(m => m.classList.remove('active'));
            if (typeof openContentModal === 'function') {
              openContentModal(targetModal);
            } else {
              document.getElementById(targetModal).classList.add('active');
              document.body.style.overflow = 'hidden';
            }
            if (window.history.pushState) {
              window.history.pushState(null, '', href);
            }
            if (mobileDrawer) mobileDrawer.classList.remove('active');
            if (mainNav) mainNav.classList.remove('open');
          }
        }
      } catch (err) {
        // Fallback to normal navigation
      }
    });
  });

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

// Global function for E-commerce Product Grid Filtering
window.filterCategory = function(category) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;
  
  const products = productGrid.querySelectorAll('.ecom-product-card');
  products.forEach(product => {
    const productCategory = product.getAttribute('data-category');
    if (category === 'all' || productCategory === category) {
      product.style.display = 'flex';
    } else {
      product.style.display = 'none';
    }
  });
};


/* ==========================================================================
   RFQ CART SYSTEM
   ========================================================================== */
let rfqCart = JSON.parse(localStorage.getItem("nz_rfq_cart") || "[]");

function renderRFQIcon() {
    // The floating cart icon has been removed per user request.
    // The cart logic (localStorage) and modal still work, but the floating icon will not be rendered.
}

function addToRFQ(btn, categoryName) {
    const card = btn.closest(".ecom-product-card");
    const make = card.querySelector(".rfq-make").value.trim();
    const spec = card.querySelector(".rfq-spec").value.trim();
    const qty = card.querySelector(".rfq-qty").value.trim();

    const item = {
        category: categoryName,
        make: make || "Any",
        spec: spec || "Not specified",
        qty: qty || "1"
    };

    rfqCart.push(item);
    localStorage.setItem("nz_rfq_cart", JSON.stringify(rfqCart));
    renderRFQIcon();
    
    // Provide visual feedback
    const originalText = btn.textContent;
    btn.textContent = "Added to Cart!";
    btn.style.backgroundColor = "#16a34a"; // green success color
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = ""; // revert to original css
    }, 2000);

    // Open the RFQ Modal automatically
    openRFQModal();

    // Clear inputs
    card.querySelector(".rfq-make").value = "";
    card.querySelector(".rfq-spec").value = "";
    card.querySelector(".rfq-qty").value = "";
}

function openRFQModal() {
    const modal = document.getElementById("modalOverlay");
    if (!modal) return;
    
    // Switch title
    document.getElementById("modalTitle").innerText = "Submit Request For Quote";
    
    // Prepare message
    const msgField = document.getElementById("modalMessage");
    if (msgField) {
        let msg = "Hello, please provide a quote for the following items:\n\n";
        rfqCart.forEach((item, index) => {
            msg += `${index + 1}. [${item.category}] Make: ${item.make} | Spec: ${item.spec} | Qty: ${item.qty}\n`;
        });
        msgField.value = msg;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

// Initialize RFQ system on load
document.addEventListener("DOMContentLoaded", () => {
    renderRFQIcon();
});

// Close modal on overlay backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('content-modal-overlay')) {
    const targetSec = (e.target.id && e.target.id.startsWith('modal-segment-')) ? 'customer-segments' : null;
    window.closeContentModal(e.target.id, targetSec);
  }
});

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const active = document.querySelector('.content-modal-overlay.active');
    const targetSec = (active && active.id && active.id.startsWith('modal-segment-')) ? 'customer-segments' : null;
    window.closeContentModal(active ? active.id : null, targetSec);
  }
});

// Auto-open modal from URL parameter (e.g., ?modal=modal-segment-infrastructure)
document.addEventListener('DOMContentLoaded', () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let modalId = urlParams.get('modal');
    if (!modalId && window.location.hash && window.location.hash.includes('modal=')) {
      const m = window.location.hash.match(/modal=([^&]+)/);
      if (m) modalId = m[1];
    }
    if (modalId && document.getElementById(modalId)) {
      if (modalId.startsWith('modal-segment-')) {
        const seg = document.getElementById('customer-segments');
        if (seg) {
          const headerOffset = 100;
          const elementPosition = seg.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition });
        }
      }
      setTimeout(() => {
        window.openContentModal(modalId);
      }, 150);
    }
  } catch(err) {}
});

// Modal link interceptor: smoothly open modal without reload if already on current page or modal exists
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="modal="]');
  if (link) {
    try {
      const url = new URL(link.href, window.location.href);
      let modalId = url.searchParams.get('modal');
      if (!modalId && url.hash && url.hash.includes('modal=')) {
        const m = url.hash.match(/modal=([^&]+)/);
        if (m) modalId = m[1];
      }

      if (modalId && document.getElementById(modalId)) {
        e.preventDefault();
        window.openContentModal(modalId);
        if (window.history.pushState) {
          window.history.pushState(null, '', '?modal=' + modalId);
        }
        // Close mobile drawer / menu if open
        const mobileDrawer = document.getElementById('mobileDrawer');
        const mainNav = document.getElementById('mainNav');
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        if (mainNav) mainNav.classList.remove('open');
      }
    } catch(err) {}
  }
});


