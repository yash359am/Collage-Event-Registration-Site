
// Global Error Boundary
window.addEventListener("error", function (e) {
    // Suppress console errors per performance specs
    e.preventDefault();
});
window.addEventListener("unhandledrejection", function (e) {
    e.preventDefault();
});
/* ========================================
   ANVESHANE — Modern Design & Animation System
   Powered by GSAP, ScrollTrigger & Lenis
   Performance-Optimized Build
   ======================================== */

// ========= Safe Init Guard =========
// Prevent entire page from breaking if any library fails to load
const hasGSAP = typeof gsap !== 'undefined';
const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
const hasLenis = typeof Lenis !== 'undefined';

if (hasGSAP && hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ========= Initialize Lenis Smooth Scroll =========
let lenis;
function initLenis() {
  if (!hasLenis) return;
  
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false, // Disable on touch — major source of mobile lag
      touchMultiplier: 2,
    });

    // Single unified RAF loop (was doubled before — caused jank)
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with ScrollTrigger (lightweight sync only)
    if (hasScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }
  } catch (e) {
    console.warn('Lenis init failed:', e);
  }
}

// ========= Page Loader — Bulletproof Dismissal =========
let loaderDismissed = false;

function dismissLoader() {
  if (loaderDismissed) return;
  loaderDismissed = true;

  const loader = document.getElementById('pageLoader');
  if (!loader) {
    initLenis();
    safeInit();
    return;
  }

  if (hasGSAP) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        loader.remove(); // Fully remove from DOM to free memory
        initLenis();
        safeInit();
      }
    });
  } else {
    // Fallback if GSAP didn't load
    loader.style.transition = 'opacity 0.5s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      loader.remove();
      initLenis();
      safeInit();
    }, 500);
  }
}

// Dismiss on window load
window.addEventListener('load', () => {
  dismissLoader();
});

// Safety net #1: DOM ready (in case load event already fired)
if (document.readyState === 'complete') {
  dismissLoader();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    // Give a brief moment for scripts to init
    setTimeout(dismissLoader, 800);
  });
}

// Safety net #2: Force dismiss after 4 seconds no matter what
setTimeout(() => {
  if (!loaderDismissed) {
    console.warn('Force-dismissing loader after timeout');
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.display = 'none';
      loader.remove();
    }
    loaderDismissed = true;
    initLenis();
    safeInit();
  }
}, 4000);

// ========= Safe Init Wrapper =========
function safeInit() {
  try { initAnimations(); } catch(e) { console.warn('Animation init error:', e); }
  try { initCustomCursor(); } catch(e) { console.warn('Cursor init error:', e); }
}

// ========= Navbar Scroll Effect =========
const navbar = document.getElementById('navbar');
let lastScrollY = 0;
let scrollTicking = false;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      if (navbar) {
        if (lastScrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ========= Hamburger Menu =========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
}

if (navOverlay) {
  navOverlay.addEventListener('click', closeMenu);
}

function toggleMenu() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ========= Main Animation Initializer =========
function initAnimations() {
  if (!hasGSAP) return;
  
  initScrollProgress();
  animateHero();
  animateAbout();
  animateEventCards();
  animateCounters();
  animateCTA();
  animateFooter();
  animatePageHeader();
  initMagneticButtons();
  initTiltEffect();
  animateFloatingElements();
  initAmbientMotion();
}

// ========= Scroll Progress Bar =========
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar || !hasScrollTrigger) return;

  gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    }
  });
}

// ========= Helper: Split Text into Characters =========
function splitTextCharacters(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const text = el.innerText;
  el.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    el.appendChild(span);
  });
}

// ========= Hero Animations =========
function animateHero() {
  const heroLines = document.querySelectorAll('.hero-title .line-inner');
  if (heroLines.length === 0) return;

  // Split the ANVESHANE title into characters
  const anvTitle = document.getElementById('anveshaneTitle');
  // Only split if it's the hero title (not events page)
  if (anvTitle && anvTitle.closest('.hero-title')) {
    splitTextCharacters('#anveshaneTitle');
  }

  // Hero Background Entry
  gsap.from('.hero-bg', {
    scale: 1.2,
    opacity: 0,
    duration: 2.5,
    ease: 'power3.out'
  });

  // Hero Content Entry
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.from('.hero-badge', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out'
  })
  .from('.hero-title .line:nth-child(1) .line-inner', {
    y: 100,
    skewY: 10,
    opacity: 0,
    duration: 1.2,
  }, '-=0.8')
  .from('#anveshaneTitle span', {
    y: 120,
    rotateX: -90,
    skewX: 20,
    opacity: 0,
    duration: 1.8,
    stagger: 0.08,
    ease: 'expo.out'
  }, '-=1')
  .from('.hero-title .line:nth-child(3) .line-inner', {
    y: 50,
    skewY: 5,
    opacity: 0,
    duration: 1
  }, '-=1.2')
  .from('.hero-description', {
    y: 30,
    opacity: 0,
    duration: 1
  }, '-=0.8')
  .from('.hero-cta .btn', {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.7)'
  }, '-=0.6')
  .from('.hero-stats', {
    y: 40,
    opacity: 0,
    duration: 1
  }, '-=0.6');

  if (!hasScrollTrigger) return;

  // Scroll-triggered Parallax
  gsap.to('.hero-bg', {
    scale: 1.15,
    yPercent: 30,
    filter: 'blur(8px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Fade Hero Content on Scroll
  gsap.to('.hero-inner', {
    y: -100,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Robot Floating Parallax
  gsap.to('.hero-robot', {
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
}

// ========= About Section Animations =========
function animateAbout() {
  const aboutSection = document.querySelector('.about');
  if (!aboutSection || !hasScrollTrigger) return;

  gsap.from('.about-content > *', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.about-feature-box', {
    scrollTrigger: {
      trigger: '.about-features-grid',
      start: 'top 85%',
    },
    scale: 0.8,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });

  gsap.from('.experience-blob', {
    scrollTrigger: {
      trigger: '.about-visual-creative',
      start: 'top 70%',
    },
    scale: 0,
    opacity: 0,
    rotation: -45,
    duration: 1.5,
    ease: 'elastic.out(1, 0.5)'
  });

  const cards = document.querySelectorAll('.about-card-creative');
  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '.about-visual-creative',
        start: 'top 75%',
      },
      x: i % 2 === 0 ? -100 : 100,
      y: 100,
      rotation: i % 2 === 0 ? -20 : 20,
      opacity: 0,
      duration: 1.5,
      delay: i * 0.2,
      ease: 'expo.out'
    });
  });

  gsap.to('.about-visual-creative', {
    y: -50,
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
}

// ========= Event Cards — Lightweight Reveal =========
function animateEventCards() {
  const cards = document.querySelectorAll('.event-card, .event-full-card');
  if (cards.length === 0) return;

  // Use IntersectionObserver for a smoother reveal (less overhead than ScrollTrigger per card)
  if ('IntersectionObserver' in window && hasGSAP) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          gsap.fromTo(card, 
            { y: 40, opacity: 0, scale: 0.95 },
            { 
              y: 0, opacity: 1, scale: 1, 
              duration: 0.6, 
              ease: 'power3.out',
              clearProps: 'transform' // IMPORTANT: Clear inline styles after animation so CSS hover works
            }
          );
          observer.unobserve(card);
        }
      });
    }, { 
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    cards.forEach(card => {
      // Pre-set invisible state
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px) scale(0.95)';
      observer.observe(card);
    });
  }

  // Mouse follow glow effect (only on desktop)
  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }
}

// ========= Floating Elements Animation =========
function animateFloatingElements() {
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    gsap.to(heroBadge, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  const robotTag = document.querySelector('.robot-welcome-tag');
  if (robotTag) {
    gsap.to(robotTag, {
      y: -8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
}

// ========= Custom Cursor (Desktop Only) =========
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.innerWidth < 1025 || !hasGSAP) return;

  const cursorLabel = document.createElement('span');
  cursorLabel.className = 'cursor-label';
  cursor.appendChild(cursorLabel);

  gsap.set(cursor, { opacity: 1 });

  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.4,
      ease: 'power3.out'
    });
  });

  const interactives = [
    { selector: 'a, button, .btn', label: '' },
    { selector: '.event-card, .event-full-card', label: 'VIEW' },
    { selector: '.hero-robot', label: 'HELLO!' },
    { selector: '.nav-logo, .footer-logo', label: 'BCE' }
  ];

  interactives.forEach(group => {
    document.querySelectorAll(group.selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        if (group.label) {
          cursorLabel.innerText = group.label;
          gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(255, 215, 0, 1)', duration: 0.3 });
          gsap.to(cursorLabel, { opacity: 1, scale: 1, duration: 0.3 });
        } else {
          gsap.to(cursor, { scale: 1.3, backgroundColor: 'rgba(255, 215, 0, 0.4)', duration: 0.3 });
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorLabel.innerText = '';
        gsap.to(cursor, { scale: 1, backgroundColor: 'var(--gold)', duration: 0.3 });
        gsap.to(cursorLabel, { opacity: 0, scale: 1, duration: 0.3 });
      });
    });
  });
}

// ========= Magnetic Buttons =========
function initMagneticButtons() {
  // Skip on mobile for performance
  if (window.innerWidth < 1025) return;

  document.querySelectorAll('.btn, .nav-links a, .footer-social a, .bottom-nav-item').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });
}

// ========= Tilt Effect (Desktop Only) =========
function initTiltEffect() {
  if (window.innerWidth < 1025) return;

  document.querySelectorAll('.event-card, .event-full-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });
}

// ========= Counter Animation =========
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!hasScrollTrigger) return;
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2.5,
          snap: { innerText: 1 },
          ease: 'expo.out',
        });
      }
    });
  });
}

// ========= CTA & Footer =========
function animateCTA() {
  const cta = document.querySelector('.cta-box');
  if (!cta || !hasScrollTrigger) return;
  gsap.from(cta, {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 85%'
    },
    y: 100,
    opacity: 0,
    scale: 0.9,
    duration: 1.2,
    ease: 'expo.out'
  });
}

function animateFooter() {
  if (!hasScrollTrigger) return;
  gsap.from('.footer-grid > *', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'expo.out'
  });
}

function animatePageHeader() {
  const header = document.querySelector('.page-header h1');
  const subtitle = document.querySelector('.page-header p');
  if (!header) return;

  gsap.fromTo(header, 
    { y: 30, opacity: 0, scale: 0.95 }, 
    { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' }
  );

  if (subtitle) {
    gsap.fromTo(subtitle, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, delay: 0.4, ease: 'expo.out' }
    );
  }
}

// ========= Ambient Aura Motion — Performance Optimized =========
function initAmbientMotion() {
  const orbs = document.querySelectorAll('.aura-orb');
  if (orbs.length === 0) return;

  // 1. Gentle organic drifting (base layer)
  orbs.forEach((orb, i) => {
    gsap.to(orb, {
      x: 'random(-60, 60)',
      y: 'random(-60, 60)',
      duration: gsap.utils.random(18, 28),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 1.5
    });
  });

  if (!hasScrollTrigger) return;

  // 2. Scroll-Triggered Parallax (reduced intensity)
  const moveSpeeds = [100, -120, 60, -80, 140];
  const scaleSpeeds = [1.1, 0.9, 1.05, 0.95, 1.15];

  orbs.forEach((orb, i) => {
    gsap.to(orb, {
      y: moveSpeeds[i] || 60,
      scale: scaleSpeeds[i] || 1.05,
      opacity: gsap.utils.random(0.05, 0.2),
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      }
    });
  });

  // 3. Subtle Hue Shift on Scroll
  gsap.to(orbs, {
    filter: 'blur(150px) hue-rotate(20deg)',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 3,
    }
  });

  // 4. Mouse Parallax — Debounced for performance (desktop only)
  if (window.innerWidth > 768) {
    let mouseX = 0.5, mouseY = 0.5;
    let mouseRAF;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;

      if (!mouseRAF) {
        mouseRAF = requestAnimationFrame(() => {
          orbs.forEach((orb, i) => {
            const factorX = (i + 1) * 12;
            const factorY = (i + 1) * 10;
            
            gsap.to(orb, {
              xPercent: mouseX * factorX,
              yPercent: mouseY * factorY,
              duration: 2.5,
              ease: 'power2.out'
            });
          });
          mouseRAF = null;
        });
      }
    }, { passive: true });
  }

  // 5. Global Parallax
  gsap.to('.ambient-aura', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
}
