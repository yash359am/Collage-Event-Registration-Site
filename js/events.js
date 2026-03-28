/* ========================================
   ANVESHANE — Events Page JavaScript
   Category Filtering & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEventFilters();
});

// ========= Event Category Filters =========
function initEventFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-full-card');

  if (filterBtns.length === 0 || eventCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Animate out, then filter, then animate in
      gsap.to(eventCards, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power2.in',
        onComplete: () => {
          eventCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });

          // Get visible cards and animate them in
          const visibleCards = document.querySelectorAll('.event-full-card:not([style*="display: none"])');
          gsap.fromTo(visibleCards,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power3.out',
            }
          );
        }
      });
    });
  });
}
