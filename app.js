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

    // Check if this is an RFQ WhatsApp submission
    const modalTitleEl = document.getElementById('modalTitle');
    if (modalTitleEl && modalTitleEl.innerText.includes("Quote")) {
      const name = document.getElementById('modalName').value.trim();
      const email = document.getElementById('modalEmail').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const company = document.getElementById('modalCompany').value.trim();
      const msg = document.getElementById('modalMessage').value.trim();

      const waText = `*New RFQ Enquiry*\n*Name:* ${name}\n*Company:* ${company}\n*Phone:* ${phone}\n*Email:* ${email}\n\n*Details:*\n${msg}`;
      const encodedText = encodeURIComponent(waText);
      
      // Clear the cart
      rfqCart = [];
      localStorage.removeItem("nz_rfq_cart");
      if (typeof renderRFQIcon === 'function') renderRFQIcon();

      // Open WhatsApp
      window.open(`https://wa.me/918825823119?text=${encodedText}`, '_blank');
      
      btn.textContent = originalText;
      btn.disabled = false;
      event.target.reset();
      if (modalOverlay && modalOverlay.classList.contains('active')) closeModal();
      return;
    }

    // Standard behavior for normal contact forms
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

