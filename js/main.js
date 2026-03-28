/* ========================================
   ANVESHANE — Modern Design & Animation System
   Powered by GSAP, ScrollTrigger & Lenis
   ======================================== */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ========= Initialize Lenis Smooth Scroll =========
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothHover: true,
    smoothTouch: true, // Enabled for mobile smoothness
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Integrate Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ========= Page Loader =========
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        initLenis();
        initAnimations();
        initCustomCursor();
      }
    });
  } else {
    initLenis();
    initAnimations();
    initCustomCursor();
  }
});

// ========= Navbar Scroll Effect =========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

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
}

// ========= Scroll Progress Bar =========
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

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
    span.innerText = char === ' ' ? '\u00A0' : char; // Handle spaces
    span.style.display = 'inline-block';
    el.appendChild(span);
  });
}

// ========= Hero Animations =========
function animateHero() {
  const heroLines = document.querySelectorAll('.hero-title .line-inner');
  if (heroLines.length === 0) return;

  // Split the main ANVESHANE title into characters for a cool reveal
  splitTextCharacters('#anveshaneTitle');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.from('.hero-badge', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out'
  })
  .from('.hero-title .line:nth-child(1) .line-inner', {
    y: 100,
    duration: 1.2,
  }, '-=0.8')
  .from('#anveshaneTitle span', {
    y: 100,
    rotateX: -90,
    opacity: 0,
    duration: 1.5,
    stagger: 0.05,
    ease: 'expo.out'
  }, '-=1')
  .from('.hero-title .line:nth-child(3) .line-inner', {
    y: 50,
    opacity: 0,
    duration: 1
  }, '-=1')
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

  // Hero Parallax
  gsap.to('.hero-bg', {
    yPercent: 20,
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
  if (!aboutSection) return;

  // Image/Visual Parallax
  gsap.to('.about-visual', {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });

  // About Card Unstacking
  const cards = document.querySelectorAll('.about-card');
  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '.about-visual',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      x: 100 + (i * 50),
      y: 50,
      opacity: 0,
      rotation: 15,
      duration: 1.2,
      delay: i * 0.1,
      ease: 'expo.out'
    });
  });

  // Sections Header Reveal
  gsap.from('.about .section-title, .about .section-subtitle', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2
  });
}

// ========= Event Cards Animations =========
function animateEventCards() {
  const cards = document.querySelectorAll('.event-card, .event-full-card');
  if (cards.length === 0) return;

  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}

// ========= Floating Elements Animation =========
function animateFloatingElements() {
  // Simple infinite float for badges and icons
  gsap.to('.hero-badge', {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.robot-welcome-tag', {
    y: -8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ========= Custom Cursor =========
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.innerWidth < 1025) return;

  gsap.set(cursor, { opacity: 1 });

  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: 'expo.out'
    });
  });

  // Hover states
  const interactives = document.querySelectorAll('a, button, .event-card, .event-full-card, .btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, {
        scale: 4,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        duration: 0.3
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'var(--gold)',
        duration: 0.3
      });
    });
  });
}

// ========= Magnetic Buttons =========
function initMagneticButtons() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });
}

// ========= Tilt Effect =========
function initTiltEffect() {
  document.querySelectorAll('.event-card, .event-full-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;

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
  if (!cta) return;
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
  if (!header) return;

  // Character reveal for page headers
  splitTextCharacters('.page-header h1');

  gsap.from('.page-header h1 span', {
    y: 50,
    rotateX: -90,
    opacity: 0,
    duration: 1.2,
    stagger: 0.04,
    ease: 'expo.out'
  });

  gsap.from('.page-header p', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'expo.out'
  });
}
