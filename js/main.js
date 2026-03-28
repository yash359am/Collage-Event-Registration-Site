/* ========================================
   ANVESHANE — Main JavaScript
   GSAP + ScrollTrigger Animations
   ======================================== */



// ========= Page Loader =========
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        initAnimations();
      }
    });
  } else {
    initAnimations();
  }
});

// ========= Register GSAP Plugins =========
gsap.registerPlugin(ScrollTrigger);

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

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ========= Smooth Scrolling =========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ========= Main Animation Initializer =========
function initAnimations() {
  animateHero();
  animateAbout();
  animateEventCards();
  animateCounters();
  animateCTA();
  animateFooter();
  animatePageHeader();
}

// ========= Hero Animations =========
function animateHero() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  // Smooth Parallax for Hero Background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: '15%',
      ease: 'none',
    });
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge', {
    y: 30,
    opacity: 0,
    duration: 0.8,
  })
  .from('.hero-title .line-inner', {
    y: 120,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power4.out',
  }, '-=0.4')
  .from('.hero-description', {
    y: 30,
    opacity: 0,
    duration: 0.8,
  }, '-=0.5')
  .from('.hero-cta .btn', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
  }, '-=0.4')
  .from('.hero-stats', {
    y: 30,
    opacity: 0,
    duration: 0.8,
  }, '-=0.3')
  .from('.scroll-indicator', {
    y: 20,
    opacity: 0,
    duration: 0.6,
  }, '-=0.3');
}

// ========= Counter Animation =========
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length === 0) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power2.out',
        });
      }
    });
  });
}

// ========= About Section Animations =========
function animateAbout() {
  const aboutSection = document.querySelector('.about');
  if (!aboutSection) return;

  // Section title and subtitle
  gsap.from('.about .section-title', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
  });

  gsap.from('.about .section-subtitle', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
  });

  // About content
  gsap.from('.about-content h3', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
  });

  gsap.from('.about-content p', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.2,
  });

  // About features
  gsap.from('.about-feature', {
    scrollTrigger: {
      trigger: '.about-features',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
  });

  // About cards
  gsap.from('.about-card', {
    scrollTrigger: {
      trigger: '.about-visual',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    x: 80,
    opacity: 0,
    rotation: 10,
    duration: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.2)',
  });
}

// ========= Event Cards Animations =========
function animateEventCards() {
  // Preview event cards (home page)
  const previewCards = document.querySelectorAll('.events-preview .event-card');
  if (previewCards.length > 0) {
    gsap.from(previewCards, {
      scrollTrigger: {
        trigger: '.events-preview',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      y: 60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }

  // Full event cards (events page)
  const fullCards = document.querySelectorAll('.event-full-card');
  if (fullCards.length > 0) {
    fullCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: 'power3.out',
      });
    });
  }

  // Event section titles
  gsap.from('.events-preview .section-title', {
    scrollTrigger: {
      trigger: '.events-preview',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
  });

  gsap.from('.events-preview .section-subtitle', {
    scrollTrigger: {
      trigger: '.events-preview',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
  });
}

// ========= CTA Animation =========
function animateCTA() {
  const ctaBox = document.querySelector('.cta-box');
  if (!ctaBox) return;

  gsap.from(ctaBox, {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    ease: 'power3.out',
  });
}

// ========= Footer Animation =========
function animateFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  gsap.from('.footer-brand', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
  });

  gsap.from('.footer-col', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.2,
  });
}

// ========= Page Header Animation =========
function animatePageHeader() {
  const pageHeader = document.querySelector('.page-header');
  if (!pageHeader) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.page-header h1', {
    y: 50,
    opacity: 0,
    duration: 0.8,
  })
  .from('.page-header p', {
    y: 30,
    opacity: 0,
    duration: 0.6,
  }, '-=0.4')
  .from('.event-filters', {
    y: 20,
    opacity: 0,
    duration: 0.6,
  }, '-=0.3');
}

// ========= Magnetic Hover Effect for Buttons =========
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  });
});

// ========= Tilt Effect for Cards =========
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
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
});

// ========= Register Form Animation =========
function animateRegisterSection() {
  const registerSection = document.querySelector('.register-section');
  if (!registerSection) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.register-info h2', {
    x: -50,
    opacity: 0,
    duration: 0.8,
  })
  .from('.register-info p', {
    x: -30,
    opacity: 0,
    duration: 0.6,
  }, '-=0.4')
  .from('.perk-item', {
    x: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
  }, '-=0.3')
  .from('.register-form-card', {
    x: 50,
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
  }, '-=0.8');
}

// Call register animation after page load
window.addEventListener('load', () => {
  setTimeout(animateRegisterSection, 1200);
});
