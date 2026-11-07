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
function updateHeader() {
  const sec1 = document.querySelector(".section-1");
  const pcHeader = document.querySelector(".header");
  const moHeader = document.querySelector(".mobile-header");

  const isMobile = window.matchMedia("(width < 769px)").matches;
  const header = isMobile ? moHeader : pcHeader;

  // 헤더가 없으면 종료
  if (!header) return;

  const hide = window.scrollY > 10;
  header.classList.toggle("is-promo-hidden", hide);

  // 섹션1 패딩(원하는 값으로 조절)
  if (!sec1) return;

  if (isMobile) {
    // 모바일: promo(3rem) + top-bar(6.3rem) = 9.3rem
    sec1.style.paddingTop = hide ? "6.3rem" : "9.3rem";
  } else {
    // PC: promo(4rem) + top-bar(8rem) = 12rem
    sec1.style.paddingTop = hide ? "8rem" : "12rem";
  }
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("load", updateHeader);
window.addEventListener("resize", updateHeader);

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
function privacyAccordion() {
  const box = document.querySelector('.last-text-box');
  const button = box.querySelector('.plus-button');
  const panel = box.querySelector('.privacy-details');
  const compact = window.matchMedia('(width < 769px)');
  let mobileOpen = false, animation;
  function display(animate = false) {
    const open = !compact.matches || mobileOpen;
    const from = panel.getBoundingClientRect().height;
    animation?.cancel();
    button.hidden = !compact.matches;
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? '접기' : '더 보기';
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    panel.style.height = 'auto';
    const to = open ? panel.scrollHeight : 0;
    panel.style.height = open ? 'auto' : '0px';
    if (animate && panel.animate) {
      const current = panel.animate([{ height: from + 'px' }, { height: to + 'px' }], {
        duration: 320, easing: 'cubic-bezier(.2,.65,.25,1)'
      });
      animation = current;
      current.finished.catch(() => {}).then(() => { if (animation === current) animation = null; });
    }
  }
  button.addEventListener('click', () => { mobileOpen = !mobileOpen; display(true); });
  compact.addEventListener('change', () => display());
  display();
}
privacyAccordion();
mobiletopbar_init();
