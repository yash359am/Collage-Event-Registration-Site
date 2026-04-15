/* ========================================
   ANVESHANE — Events Page JavaScript
   Category Filtering — Performance Optimized
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEventFilters();
  initCardScrollAnimations();
});

// ========= Reveal Event Cards on Scroll =========
function initCardScrollAnimations() {
  const eventCards = document.querySelectorAll('.event-full-card, .event-category-header');
  if (eventCards.length === 0) return;

  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    // Initial hidden state
    gsap.set(eventCards, { opacity: 0, y: 60, scale: 0.92 });

    // Staggered reveal using ScrollTrigger batching (perfect for grids)
    ScrollTrigger.batch(eventCards, {
      interval: 0.15, // time window (ms) for grouping cards in the same row
      batchMax: 3,    // match the CSS grid columns (usually 3 on desktop)
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1, // 100ms delay between each card in the row
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity' // Crucial: removes inline styles so CSS hover takes over smoothly
      }),
      start: 'top 85%', // start when card top is 85% down the viewport screen
      once: true // only play once so it doesn't get annoying scrolling up
    });
  } else {
    // Fallback if GSAP fails
    eventCards.forEach(card => card.style.opacity = '1');
  }
}

// ========= Event Category Filters =========
function initEventFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-full-card, .event-category-header');

  if (filterBtns.length === 0 || eventCards.length === 0) return;

  const hasGSAP = typeof gsap !== 'undefined';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Prevent double-click during animation
      if (btn.classList.contains('filtering')) return;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.classList.add('filtering');

      const filter = btn.getAttribute('data-filter');

      if (hasGSAP) {
        // Quick fade out
        gsap.to(eventCards, {
          opacity: 0,
          y: 15,
          scale: 0.97,
          duration: 0.25,
          stagger: 0.015,
          ease: 'power2.in',
          onComplete: () => {
            // Apply filter
            eventCards.forEach(card => {
              const category = card.getAttribute('data-category');
              if (filter === 'all' || category === filter) {
                card.style.display = '';
              } else {
                card.style.display = 'none';
              }
            });

            // Animate visible cards in
            const visibleCards = document.querySelectorAll('.event-full-card:not([style*="display: none"]), .event-category-header:not([style*="display: none"])');
            gsap.fromTo(visibleCards,
              { opacity: 0, y: 30, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                stagger: 0.04,
                ease: 'power3.out',
                clearProps: 'transform', // Clear inline transforms so hover effects work
                onComplete: () => {
                  btn.classList.remove('filtering');
                }
              }
            );
          }
        });
      } else {
        // Fallback without GSAP
        eventCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'none';
          } else {
            card.style.display = 'none';
          }
        });
        btn.classList.remove('filtering');
      }
    });
  });
}
