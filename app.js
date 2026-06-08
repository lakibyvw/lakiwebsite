/* ==========================================================================
   Laki by VW - Core JavaScript Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  // --- Mobile Menu Toggle ---
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
      }
    });
  });

  // --- Sticky Navbar Scroll Styles ---
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  // --- Smooth Scrolling for Anchors ---
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const navHeight = navbar.offsetHeight || 80;
          const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
          
          window.scrollTo({
            top: elementTop - navHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- Viewport Active Navigation Highlights ---
  const updateActiveLink = () => {
    const scrollPos = window.scrollY + (navbar.offsetHeight || 80) + 120;

    sections.forEach(section => {
      const id = section.getAttribute('id');
      if (!id) return;

      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!navLink) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink, { passive: true });
  updateActiveLink(); // Initial check

  // --- Scroll Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed so it doesn't animate out and in repeatedly
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // --- Hide Floating WhatsApp in Visit Section ---
  const floatingWa = document.querySelector('.floating-wa');
  const visitSection = document.getElementById('visit');
  
  if (floatingWa && visitSection) {
    let isVisitVisible = false;
    let isReviewVisible = false;
    let isFooterVisible = false;

    const waObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.id === 'visit') {
          isVisitVisible = entry.isIntersecting;
        } else if (entry.target.classList.contains('review-reminder-sec')) {
          isReviewVisible = entry.isIntersecting;
        } else if (entry.target.classList.contains('footer')) {
          isFooterVisible = entry.isIntersecting;
        }
      });

      if (isVisitVisible || isReviewVisible || isFooterVisible) {
        floatingWa.style.opacity = '0';
        floatingWa.style.pointerEvents = 'none';
      } else {
        floatingWa.style.opacity = '1';
        floatingWa.style.pointerEvents = 'auto';
      }
    }, { threshold: 0.1 });
    
    waObserver.observe(visitSection);
    
    // Also hide when review section or footer is visible
    const reviewSec = document.querySelector('.review-reminder-sec');
    if (reviewSec) {
      waObserver.observe(reviewSec);
    }
    const footer = document.querySelector('.footer');
    if (footer) {
      waObserver.observe(footer);
    }
  }

  // --- Easter Egg: Click to Spawn Paws ---
  document.addEventListener('click', (e) => {
    // Prevent spawning if clicking links, buttons, map, or toggle controls
    if (e.target.closest('a, button, input, iframe, .gallery-item, #mobile-toggle')) {
      return;
    }

    const paw = document.createElement('div');
    paw.className = 'paw-click';
    paw.innerHTML = '🐾';
    
    // Center the paw on cursor (adjust for scroll)
    paw.style.left = `${e.pageX - 12}px`;
    paw.style.top = `${e.pageY - 12}px`;
    
    // Set random rotation
    const randomRotate = Math.floor(Math.random() * 360);
    paw.style.setProperty('--rotate', `${randomRotate}deg`);

    document.body.appendChild(paw);

    // Clean up
    setTimeout(() => {
      paw.remove();
    }, 1200);
  });
});
