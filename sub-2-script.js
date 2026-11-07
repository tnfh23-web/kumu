$(".submenu").hide();
$("#menu_bg").hide();

// 프로모션 시작

document.querySelectorAll(".promo-text").forEach((promoBox) => {
  const texts = promoBox.querySelectorAll("span");
  let current = 0;

  setInterval(() => {
    const next = (current + 1) % texts.length;

    texts[next].classList.add("active");
    texts[current].classList.remove("active");

    current = next;
  }, 3000);
});

// 프로모션 끝
// 프로모션 헤더 고정
const headerElements = {
  desktop: document.querySelector('.header'),
  mobile: document.querySelector('.mobile-header'),
  section: document.querySelector('.section-1')
};
const headerBreakpoint = window.matchMedia('(width < 769px)');
let lastHeaderState;
function updateHeader() {
  const mobile = headerBreakpoint.matches, hide = window.scrollY > 10;
  const state = `${mobile}:${hide}`;
  if (state === lastHeaderState) return;
  lastHeaderState = state;
  const header = mobile ? headerElements.mobile : headerElements.desktop;
  header?.classList.toggle('is-promo-hidden', hide);
  if (headerElements.section) headerElements.section.style.paddingTop = mobile
    ? (hide ? '6.3rem' : '9.3rem') : (hide ? '8rem' : '12rem');
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("load", updateHeader);
window.addEventListener("resize", updateHeader);

// 헤더 시작
$(".navi>li")
  .mouseenter(function () {
    $(".submenu").stop().fadeIn(300);
    $("#menu_bg").stop().fadeIn(300);
  })
  .mouseleave(function () {
    $(".submenu").stop().fadeOut(300);
    $("#menu_bg").stop().fadeOut(300);
  });

function mobiletopbar_init() {
  $(".sidebar-menu-button").click(function () {
    $(".sidebar-menu").addClass("active");
    $(".dim-overlay").addClass("active");
  });
}

$(".sidebar-close").click(function () {
  $(".sidebar-menu").removeClass("active");
  $(".dim-overlay").removeClass("active");
});

$(".dim-overlay").click(function () {
  $(".sidebar-menu").removeClass("active");
  $(".dim-overlay").removeClass("active");
});
$(".sidebar-menu-list > a").click(function (e) {
  e.preventDefault();

  const submenu = $(this).next(".sidebar-menu-list-1-sub");

  $(".sidebar-menu-list-1-sub").not(submenu).slideUp();

  submenu.slideToggle();
});

// 헤더 끝

// Catalog cards share one controller for entry and tab transitions.
function mountCatalog() {
  const container = document.querySelector('.product_container');
  const tabs = [...document.querySelectorAll('.tab_menu .tab_btn li')];
  const panels = [...container.querySelectorAll('.prod_wrap')];
  const animations = new Map();
  const transactions = new Set();
  let disposed = false, busy = false, requested = null;
  let active = Math.max(0, panels.findIndex(panel => panel.classList.contains('active')));
  const cardsOf = panel => [...panel.children];
  const observer = window.IntersectionObserver ? new IntersectionObserver(entries => {
    const cards = cardsOf(panels[active]);
    const visible = entries.filter(entry => entry.isIntersecting && entry.target.dataset.catalogEntry === 'pending' && entry.target.parentElement === panels[active])
      .map(entry => entry.target).sort((a, b) => cards.indexOf(a) - cards.indexOf(b));
    reveal(visible);
  }, { rootMargin: `0px 0px -${Math.min(180, Math.round(innerHeight * .18))}px`, threshold: 0.08 }) : null;

  function reveal(cards) {
    cards.forEach((card, index) => {
      observer?.unobserve(card);
      if (card.dataset.catalogEntry !== 'pending') return;
      delete card.dataset.catalogEntry;
      if (!card.animate) return;
      card.dataset.catalogEntry = 'playing';
      const animation = card.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 850, delay: Math.min(index, 5) * 120,
        easing: 'cubic-bezier(.2,.65,.25,1)', fill: 'backwards'
      });
      animations.set(card, animation);
      animation.finished.catch(() => {}).then(() => {
        if (animations.get(card) !== animation) return;
        animations.delete(card);
        delete card.dataset.catalogEntry;
      });
    });
  }
  function prepare(panel) {
    cardsOf(panel).forEach(card => {
      if (!observer) return;
      card.dataset.catalogEntry = 'pending';
      observer.observe(card);
    });
  }
  function revealVisible(panel) {
    reveal(cardsOf(panel).filter(card => {
      const box = card.getBoundingClientRect();
      return box.top < innerHeight - Math.min(180, Math.round(innerHeight * .18)) && box.bottom > 0;
    }));
  }
  function settle(panel) {
    cardsOf(panel).forEach(card => {
      observer?.unobserve(card);
      animations.get(card)?.cancel();
      animations.delete(card);
      delete card.dataset.catalogEntry;
    });
  }
  function select(index) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.classList.toggle('active', selected);
      const link = tab.querySelector('a');
      link.setAttribute('aria-selected', String(selected));
      link.tabIndex = selected ? 0 : -1;
    });
    document.querySelector('#sub_page_title').textContent = tabs[index].dataset.title;
    document.querySelector('#sub_page_desc').textContent = tabs[index].dataset.desc;
  }
  async function switchTo(index) {
    const outgoing = panels[active], incoming = panels[index];
    const columns = getComputedStyle(outgoing).gridTemplateColumns.split(' ').length;
    // Fetch only the first rows before fading; the current menu stays readable meanwhile.
    await Promise.allSettled(cardsOf(incoming).slice(0, columns * 2).map(async card => {
      const image = card.querySelector('img');
      if (!image) return;
      image.loading = 'eager';
      try { await image.decode(); } catch { /* Preserve the native image fallback. */ }
    }));
    if (disposed || (requested !== null && requested !== index)) return;
    const box = { left: outgoing.offsetLeft, top: outgoing.offsetTop, width: outgoing.offsetWidth };
    const oldVisible = cardsOf(outgoing).filter(card => {
      const r = card.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    }).map(card => ({ card, opacity: getComputedStyle(card).opacity }));
    settle(outgoing);
    Object.assign(outgoing.style, { position: 'absolute', left: box.left + 'px', top: box.top + 'px', width: box.width + 'px' });
    outgoing.classList.replace('active', 'is-leaving');
    outgoing.inert = true;
    outgoing.setAttribute('aria-hidden', 'true');
    prepare(incoming);
    incoming.classList.add('active');
    incoming.inert = false;
    incoming.setAttribute('aria-hidden', 'false');
    active = index;
    select(index);
    revealVisible(incoming);
    const leaving = oldVisible.map(({card, opacity}) => card.animate ? card.animate([
      { opacity }, { opacity: 0 }
    ], { duration: 240, easing: 'ease-out', fill: 'forwards' }) : null).filter(Boolean);
    // The new grid defines its final height once. Only visible cards crossfade;
    // animating the full catalog height would relayout the page on every frame.
    leaving.forEach(animation => transactions.add(animation));
    try {
      await Promise.allSettled(leaving.map(animation => animation.finished));
    } finally {
      leaving.forEach(animation => animation.cancel());
      leaving.forEach(animation => transactions.delete(animation));
      outgoing.classList.remove('is-leaving');
      ['position', 'left', 'top', 'width'].forEach(property => outgoing.style.removeProperty(property));
      container.style.removeProperty('height');
    }
  }
  async function request(index) {
    requested = index;
    if (busy) return;
    busy = true;
    try {
      while (!disposed && requested !== null) {
        const next = requested;
        requested = null;
        if (next !== active) await switchTo(next);
      }
    } catch (error) {
      panels.forEach(settle);
      container.style.removeProperty('height');
      console.error('Kumu catalog transition:', error);
    } finally { busy = false; }
  }
  const click = event => {
    const tab = event.target.closest('.tab_menu .tab_btn li');
    if (!tab || !tabs.includes(tab)) return;
    event.preventDefault();
    request(tabs.indexOf(tab));
  };
  const keydown = event => {
    const link = event.target.closest('[role="tab"]');
    const index = tabs.findIndex(tab => tab.contains(link));
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].querySelector('a').focus({ preventScroll: true });
    request(next);
  };
  document.querySelector('.tab_btn').setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    const link = tab.querySelector('a');
    link.id = 'catalog-tab-' + index;
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-controls', 'catalog-panel-' + index);
    panels[index].id = 'catalog-panel-' + index;
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', link.id);
    panels[index].setAttribute('aria-hidden', String(index !== active));
    panels[index].inert = index !== active;
  });
  select(active);
  prepare(panels[active]);
  document.addEventListener('click', click);
  document.addEventListener('keydown', keydown);
  return () => {
    disposed = true;
    observer?.disconnect();
    transactions.forEach(animation => animation.cancel());
    transactions.clear();
    panels.forEach(settle);
    panels.forEach(panel => {
      panel.classList.remove('is-leaving');
      ['position', 'left', 'top', 'width'].forEach(property => panel.style.removeProperty(property));
    });
    container.getAnimations().forEach(animation => animation.cancel());
    container.style.removeProperty('height');
    document.removeEventListener('click', click);
    document.removeEventListener('keydown', keydown);
  };
}
let cleanupCatalog = mountCatalog();
window.addEventListener('pagehide', () => cleanupCatalog?.());
window.addEventListener('pageshow', event => { if (event.persisted) cleanupCatalog = mountCatalog(); });
mobiletopbar_init();
