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
function dismissLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader && loader.style.display !== 'none') {
    gsap.to(loader, {
      opacity: 0,
      duration: 1,
      ease: 'expo.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        initLenis();
        initAnimations();
        initCustomCursor();
      }
    });
  }
}

// Dismiss on window load
window.addEventListener('load', () => {
  dismissLoader();
});

// Safety Timeout (Dismiss after 3s anyway)
setTimeout(() => {
  dismissLoader();
}, 3000);

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
  initAmbientMotion();
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

  // --- Hero Background Entry ---
  gsap.from('.hero-bg', {
    scale: 1.2,
    opacity: 0,
    duration: 2.5,
    ease: 'power3.out'
  });

  // --- Hero Content Entry ---
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

  // --- Scroll-triggered Cinematic Zoom & Parallax ---
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

  // --- Fade Hero Content on Scroll ---
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
  if (!aboutSection) return;

  // Staggered entry for content
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

  // Animate Feature Boxes
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

  // Animate Blob
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

  // Animate Creative Cards Stack
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

  // Parallax Effect for the Visual Area
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

// ========= Event Cards Animations =========
function animateEventCards() {
  const cards = document.querySelectorAll('.event-card, .event-full-card');
  if (cards.length === 0) return;

  cards.forEach((card) => {
    // Initial reveal
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

    // Mouse follow glow effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

// ========= Floating Elements Animation =========
function animateFloatingElements() {
  // Simple infinite float for badges and icons
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

// ========= Custom Cursor =========
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.innerWidth < 1025) return;

  // Add label container to cursor
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

  // Hover states with dynamic labels
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
          gsap.to(cursor, { scale: 5, backgroundColor: 'rgba(255, 215, 0, 0.9)', duration: 0.3 });
          gsap.to(cursorLabel, { opacity: 1, scale: 0.25, duration: 0.3 });
        } else {
          gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(255, 215, 0, 0.3)', duration: 0.3 });
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
  document.querySelectorAll('.btn, .nav-links a, .footer-social a, .bottom-nav-item').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.4,
        ease: 'power2.out',
      });

      // If it's the custom cursor, pull it towards the element too (Magnetic Cursor)
      const cursor = document.getElementById('customCursor');
      if (cursor && window.innerWidth >= 1025) {
        gsap.to(cursor, {
          x: rect.left + rect.width / 2 + x * 0.2,
          y: rect.top + rect.height / 2 + y * 0.2,
          scale: 3.5,
          duration: 0.3
        });
      }
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
  const subtitle = document.querySelector('.page-header p');
  if (!header) return;

  // Cinematic fade-in for page headers without potentially breaking character splits
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
// ========= Ambient Aura Motion — Advanced System =========
function initAmbientMotion() {
  const orbs = document.querySelectorAll('.aura-orb');
  if (orbs.length === 0) return;

  // 1. Constant Organic Drifting (Base layer)
  orbs.forEach((orb, i) => {
    gsap.to(orb, {
      x: 'random(-100, 100)',
      y: 'random(-100, 100)',
      duration: gsap.utils.random(15, 25),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 1.5
    });
  });

  // 2. Scroll-Triggered Parallax & Transformation
  // Each orb moves at a different speed and direction to create depth
  const moveSpeeds = [150, -200, 100, -150, 250];
  const scaleSpeeds = [1.2, 0.8, 1.1, 0.9, 1.3];

  orbs.forEach((orb, i) => {
    gsap.to(orb, {
      y: moveSpeeds[i] || 100,
      scale: scaleSpeeds[i] || 1.1,
      opacity: gsap.utils.random(0.05, 0.25),
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });
  });

  // 3. Subtle Hue Shift on Scroll
  gsap.to(orbs, {
    filter: 'blur(150px) hue-rotate(30deg)',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
    }
  });

  // 4. Advanced Mouse Parallax (Interactive Layer)
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5);
    const yPos = (clientY / window.innerHeight - 0.5);

    orbs.forEach((orb, i) => {
      const factorX = (i + 1) * 20;
      const factorY = (i + 1) * 15;
      
      gsap.to(orb, {
        xPercent: xPos * factorX,
        yPercent: yPos * factorY,
        duration: 2,
        ease: 'power2.out'
      });
    });
  });

  // 5. Global Parallax for the entire Aura Container
  gsap.to('.ambient-aura', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
}
