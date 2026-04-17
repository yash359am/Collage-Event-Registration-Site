/* About Anweshane - 2K26 events page enhancements.
   The HTML keeps the original event data; this layer adds structure, states, and UX. */

const EVENTS_GRID_SELECTOR = '#eventsGrid';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector(EVENTS_GRID_SELECTOR);
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.event-full-card'));
  const countableCards = cards.filter((card) => card.dataset.staticCard !== 'true');
  const headers = Array.from(grid.querySelectorAll('.event-category-header'));
  const state = readInitialState();

  setHeroEventCount(countableCards);
  applyTextCleanups();
  hardenExternalLinks();
  enhanceCards(cards);
  initFiltering({ cards, countableCards, headers, state });
  initSmoothAnchors();
  initBackToTop();
  initCardScrollAnimations(cards, headers);
});

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  return {
    filter: params.get('category') || 'all',
    search: (params.get('q') || '').toLowerCase()
  };
}

function setHeroEventCount(cards) {
  const counter = document.querySelector('#heroEventCount');
  if (counter) counter.textContent = String(cards.length);
}

function applyTextCleanups() {
  const replacements = new Map([
    [`Awe${'shane'} ${'2K26'}`, 'About Anweshane - 2K26'],
    [`Anweshane${'-'}26 2026`, 'About Anweshane - 2K26'],
    [`Anweshane${'-'}26`, 'About Anweshane - 2K26'],
    ['Both players must belong to same branch', 'Both players must belong to the same branch.'],
    ['Standard rules apply ,11 members 3 Substitutes players', 'Standard rules apply. Team size: 11 players + 3 substitutes.'],
    ['Standard rules apply,11 members 3 Substitutes players', 'Standard rules apply. Team size: 11 players + 3 substitutes.'],
    ['Field events as per college rules', 'Field events will follow college rules.'],
    ['Track events as per rules', 'Track events will follow college rules.']
  ]);

  document.querySelectorAll('.events-page p, .events-page li, .events-page h3').forEach((node) => {
    let text = node.textContent;
    replacements.forEach((replacement, target) => {
      text = text.replaceAll(target, replacement);
    });

    if (text !== node.textContent) node.textContent = text;
  });
}

function hardenExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.setAttribute('rel', Array.from(rel).join(' '));
  });
}

function enhanceCards(cards) {
  cards.forEach((card, index) => {
    const title = getCardTitle(card);
    const category = card.dataset.category || getCategoryFromCard(card);
    const links = Array.from(card.querySelectorAll('.register-link'));

    card.setAttribute('role', 'article');
    card.setAttribute('tabindex', '0');
    card.dataset.category = category;
    card.dataset.eventIndex = String(index + 1);
    card.style.removeProperty('opacity');
    card.style.removeProperty('transform');

    improveImage(card, title);
    normalizeEventDetails(card);
    convertRulesToAccordion(card);
    normalizeRegisterLinks(card, links);
    addStatusBadges(card, links);

    card.dataset.search = [
      title,
      category,
      card.querySelector('.card-category')?.textContent,
      card.querySelector('.card-body')?.textContent,
      card.querySelector('.event-details')?.textContent
    ].join(' ').toLowerCase();
  });
}

function getCardTitle(card) {
  return card.querySelector('h3')?.textContent.trim() || 'About Anweshane - 2K26 Event';
}

function getCategoryFromCard(card) {
  const text = card.querySelector('.card-category')?.textContent.toLowerCase() || '';
  if (text.includes('technical')) return 'tech';
  if (text.includes('cultural')) return 'cultural';
  return 'sports';
}

function improveImage(card, title) {
  const image = card.querySelector('img');
  if (!image) return;

  image.loading = 'lazy';
  image.decoding = 'async';
  if (!image.getAttribute('alt')?.trim()) {
    image.alt = `${title} event image`;
  }
  if (!image.hasAttribute('width')) image.width = 1200;
  if (!image.hasAttribute('height')) image.height = 800;

  // Structural hardening: sports cards can fail over to local illustrations if remote photos fail.
  const fallbackSrc = image.dataset.fallbackSrc?.trim();
  if (fallbackSrc && !image.dataset.fallbackBound) {
    image.dataset.fallbackBound = 'true';
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      image.src = fallbackSrc;
    }, { once: true });
  }
}

function normalizeEventDetails(card) {
  card.querySelectorAll('.event-details span').forEach((detail) => {
    const normalized = detail.textContent
      .replace(/^[^\p{L}\p{N}]+/u, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^(\d+)\s+Members$/i, 'Team of $1')
      .replace(/^Team\s*\((\d+)\)$/i, 'Team of $1')
      .replace(/^(\d+)\s+Mins$/i, '$1 Minutes')
      .replace(/^TBA$/i, 'Schedule TBA');

    detail.textContent = normalized;
  });
}

function convertRulesToAccordion(card) {
  const rules = card.querySelector('.event-rules');
  if (!rules || rules.closest('details')) return;

  const details = document.createElement('details');
  details.className = 'event-rules-accordion';

  const summary = document.createElement('summary');
  summary.textContent = 'Rules & Guidelines';

  const content = document.createElement('div');
  content.className = 'event-rules-accordion__content';

  const title = rules.querySelector('.rules-title');
  if (title) title.remove();

  while (rules.firstChild) {
    content.appendChild(rules.firstChild);
  }

  details.append(summary, content);
  rules.replaceWith(details);
}

function addStatusBadges(card, links) {
  const existing = card.querySelector('.event-badges');
  if (existing) existing.remove();

  const badges = [];
  const metadata = card.querySelector('.event-details')?.textContent.toLowerCase() || '';
  const registrationState = card.dataset.registrationState || '';
  const hasOpenLink = links.some((link) => {
    const href = link.getAttribute('href')?.trim() || '';
    return href && href !== '#';
  });
  const hasOffline = registrationState === 'offline' || links.some((link) => link.textContent.toLowerCase().includes('offline'));
  const hasPending =
    links.some((link) => link.getAttribute('aria-disabled') === 'true') ||
    Boolean(card.querySelector('.sports-action-note--pending'));

  if (hasOpenLink) badges.push(['Open', 'open']);
  if (hasOffline) badges.push(['Offline Registration', 'offline']);
  if (hasPending) badges.push(['Link Pending', 'pending']);
  if (metadata.includes('schedule tba') || metadata.includes('tba')) badges.push(['Schedule TBA', 'tba']);
  if (card.querySelector('.event-rules-accordion, .sports-rules-details')) badges.push(['Rules Available', 'rules']);

  if (!badges.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'event-badges';
  wrap.setAttribute('aria-label', 'Event status');

  badges.forEach(([label, type]) => {
    const badge = document.createElement('span');
    badge.className = `status-badge status-badge--${type}`;
    badge.textContent = label;
    wrap.appendChild(badge);
  });

  card.querySelector('.card-header')?.after(wrap);
}

function normalizeRegisterLinks(card, links) {
  if (!links.length) return;

  links.forEach((link) => {
    const rawHref = link.getAttribute('href') || '';
    const href = rawHref.trim();
    const label = link.dataset.registerLabel;
    const isOffline = link.textContent.toLowerCase().includes('offline');
    const isMissing = !href || href === '#';

    link.setAttribute('href', href || '#');

    if (isMissing) {
      link.classList.add('register-link--disabled');
      if (isOffline) link.classList.add('register-link--offline');
      link.setAttribute('aria-disabled', 'true');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.textContent = label || (isOffline ? 'Register Offline' : 'Link Pending');
      link.addEventListener('click', (event) => event.preventDefault());
      card.dataset.registrationState = isOffline ? 'offline' : 'pending';
      return;
    }

    if (isOffline) {
      link.classList.add('register-link--offline');
      link.textContent = label || 'Register Offline';
      card.dataset.registrationState = 'offline';
    } else {
      link.textContent = label || 'Register Online';
      if (card.dataset.registrationState !== 'offline') card.dataset.registrationState = 'open';
    }

    if (/^https?:\/\//i.test(href)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

function initFiltering({ cards, countableCards = cards, headers, state }) {
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const searchInput = document.querySelector('#eventSearch');
  const clearButton = document.querySelector('#clearEventSearch');
  const resultText = document.querySelector('#eventResults');
  const emptyState = document.querySelector('#eventsEmpty');
  const groups = buildHeaderGroups(headers);
  const validFilters = new Set(['all', ...filterButtons.map((button) => button.dataset.filter).filter(Boolean)]);

  if (!validFilters.has(state.filter)) state.filter = 'all';

  if (searchInput) {
    searchInput.value = state.search;
    searchInput.addEventListener('input', () => {
      state.search = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === state.filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));

    button.addEventListener('click', () => {
      state.filter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    });
  });

  clearButton?.addEventListener('click', () => {
    state.filter = 'all';
    state.search = '';
    if (searchInput) searchInput.value = '';
    filterButtons.forEach((item) => {
      const active = item.dataset.filter === 'all';
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    applyFilters();
    searchInput?.focus();
  });

  applyFilters();

  function applyFilters() {
    const query = state.search;
    let visibleCount = 0;

    cards.forEach((card) => {
      const categoryMatches = state.filter === 'all' || card.dataset.category === state.filter;
      const searchMatches = !query || card.dataset.search.includes(query);
      const visible = categoryMatches && searchMatches;
      card.hidden = !visible;
      if (visible && card.dataset.staticCard !== 'true') visibleCount += 1;
    });

    groups.forEach(({ header, items }) => {
      const categoryCards = cards.filter((card) => card.dataset.category === header.dataset.category);
      const pool = header.classList.contains('event-category-header--primary') ? categoryCards : items;
      const visible = pool.some((card) => !card.hidden);
      header.hidden = !visible;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (resultText) {
      const categoryLabel = state.filter === 'all' ? 'all categories' : `${getFilterLabel(state.filter)} events`;
      const searchLabel = query ? ` matching "${query}"` : '';
      resultText.textContent = `Showing ${visibleCount} of ${countableCards.length} events in ${categoryLabel}${searchLabel}.`;
    }

    syncUrlState(state);
  }
}

function getFilterLabel(filter) {
  return {
    tech: 'technical',
    cultural: 'cultural',
    sports: 'sports'
  }[filter] || filter;
}

function buildHeaderGroups(headers) {
  return headers.map((header, index) => {
    const nextHeader = headers[index + 1];
    const items = [];
    let node = header.nextElementSibling;

    while (node && node !== nextHeader) {
      if (node.classList?.contains('event-full-card')) items.push(node);
      node = node.nextElementSibling;
    }

    return { header, items };
  });
}

function syncUrlState(state) {
  const params = new URLSearchParams(window.location.search);

  if (state.filter && state.filter !== 'all') params.set('category', state.filter);
  else params.delete('category');

  if (state.search) params.set('q', state.search);
  else params.delete('q');

  const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', nextUrl);
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState({}, '', hash);
    });
  });
}

function initBackToTop() {
  const button = document.querySelector('#backToTop');
  if (!button) return;

  const update = () => {
    button.classList.toggle('is-visible', window.scrollY > 520);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initCardScrollAnimations(cards, headers) {
  const targets = [...headers, ...cards];
  if (!targets.length || prefersReducedMotion()) return;

  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    ScrollTrigger.batch(targets, {
      interval: 0.12,
      batchMax: 4,
      start: 'top 88%',
      once: true,
      onEnter: (batch) => gsap.from(batch, {
        opacity: 0,
        y: 28,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.06,
        clearProps: 'opacity,transform'
      })
    });
    return;
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  targets.forEach((target) => observer.observe(target));
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
