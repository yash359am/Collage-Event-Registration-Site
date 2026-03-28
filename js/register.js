/* ========================================
   ANVESHANE — Registration Page JavaScript
   Form Validation & Submit Animation
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initRegisterForm();
});

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  // Form input focus animations
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, {
        scale: 1.01,
        duration: 0.2,
        ease: 'power2.out',
      });
    });

    input.addEventListener('blur', () => {
      gsap.to(input, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm(form)) return;

    // Button loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Submitting...';

    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
    });

    // Simulate submission delay
    setTimeout(() => {
      // Hide form, show success
      gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          form.style.display = 'none';
          formSuccess.classList.add('show');

          // Confetti-like particle animation
          createSuccessParticles();
        }
      });
    }, 1500);
  });
}

// ========= Form Validation =========
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      showFieldError(field);
    } else {
      clearFieldError(field);
    }
  });

  // Email validation
  const emailField = form.querySelector('#email');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      showFieldError(emailField);
    }
  }

  // Phone validation
  const phoneField = form.querySelector('#phone');
  if (phoneField && phoneField.value) {
    const phoneRegex = /^[\+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(phoneField.value)) {
      isValid = false;
      showFieldError(phoneField);
    }
  }

  if (!isValid) {
    // Shake the form card
    gsap.to('.register-form-card', {
      x: [-8, 8, -6, 6, -4, 4, 0],
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  return isValid;
}

function showFieldError(field) {
  field.style.borderColor = '#ff4444';
  gsap.to(field, {
    x: [-4, 4, -3, 3, -2, 2, 0],
    duration: 0.4,
    ease: 'power2.out',
  });
}

function clearFieldError(field) {
  field.style.borderColor = '';
}

// Clear error on input
document.querySelectorAll('.form-group input, .form-group select').forEach(field => {
  field.addEventListener('input', () => {
    clearFieldError(field);
  });
});

// ========= Success Particle Animation =========
function createSuccessParticles() {
  const formCard = document.getElementById('formCard');
  if (!formCard) return;

  const colors = ['#FFD700', '#00D4FF', '#8B5CF6', '#4A90D9', '#FFE44D'];

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
    `;
    formCard.appendChild(particle);

    gsap.fromTo(particle,
      {
        x: formCard.offsetWidth / 2,
        y: formCard.offsetHeight / 2,
        opacity: 1,
      },
      {
        x: Math.random() * formCard.offsetWidth,
        y: Math.random() * formCard.offsetHeight - 100,
        opacity: 0,
        duration: 1 + Math.random(),
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      }
    );
  }
}

// ========= Filter Actions for Register Page =========
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('#regEventFilters .filter-btn');
  const eventCards = document.querySelectorAll('#regEventsGrid .event-card');

  if (filterBtns.length > 0 && eventCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        eventCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            gsap.fromTo(card, 
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
