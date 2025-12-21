$(".submenu").hide();
$("#menu_bg").hide();

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

// 섹션 1 스와이퍼 시작

var swiper = new Swiper(".section-1-swiper", {
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 800,
});

// 섹션 1 스와이퍼 끝
// 섹션 2 시작

function Box1__init() {
  $(".tab_menu > ul > li").click(function (e) {
    e.preventDefault();

    let $this = $(this);
    let thisIndex = $this.index();

    $this.siblings(".active").removeClass("active");
    $this.addClass("active");

    let newTitle = $this.data("title");
    let newDesc = $this.data("desc");
    $("#sub_page_title").text(newTitle);
    $("#sub_page_desc").text(newDesc);

    let $sub_prod = $this.closest(".sub_prod");
    let $productContainer = $sub_prod.find(".product_container");
    console.log("active ", $sub_prod);

    $productContainer.find(".prod_wrap.active").removeClass("active");
    $productContainer.find(".prod_wrap").eq(thisIndex).addClass("active");
  });
}

Box1__init();

$(".tab_btn li").on("click", function (e) {
  e.preventDefault();

  const idx = $(this).index();

  // 탭 active
  $(".tab_btn li").removeClass("active");
  $(this).addClass("active");

  // 스와이퍼 전환
  $(".section-2-swiper-wrap").removeClass("active").eq(idx).addClass("active");
});

new Swiper(".drink-swiper", {
  loop: true,
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".drink-swiper .swiper-button-next",
    prevEl: ".drink-swiper .swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    376: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    769: {
      slidesPerView: 4,
      spaceBetween: 24,
      navigation: {
        nextEl: ".drink-swiper .swiper-button-next",
        prevEl: ".drink-swiper .swiper-button-prev",
      },
    },
  },
});

new Swiper(".bakery-swiper", {
  loop: true,
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".bakery-swiper .swiper-button-next",
    prevEl: ".bakery-swiper .swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    376: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    769: {
      slidesPerView: 4,
      spaceBetween: 24,
      navigation: {
        nextEl: ".drink-swiper .swiper-button-next",
        prevEl: ".drink-swiper .swiper-button-prev",
      },
    },
  },
});

new Swiper(".goods-swiper", {
  loop: true,
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".goods-swiper .swiper-button-next",
    prevEl: ".goods-swiper .swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    376: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    769: {
      slidesPerView: 4,
      spaceBetween: 24,
      navigation: {
        nextEl: ".drink-swiper .swiper-button-next",
        prevEl: ".drink-swiper .swiper-button-prev",
      },
    },
  },
});

// 섹션 2 끝
// 섹션 3 시작
function section3_toggle_init() {
  $(".section-3 .arrow-box a").on("click", function (e) {
    e.preventDefault();

    const $section = $(this).closest(".section-3-box");
    const $current = $section.find(".right-content.is-active");
    const $next = $current.hasClass("right-content-1") ? $section.find(".right-content-2") : $section.find(".right-content-1");

    $current.removeClass("is-active");
    $next.addClass("is-active");
  });
}

section3_toggle_init();

// 섹션 3 끝
// 섹션 3 375반응형 시작
let rightSwiper;

function updateRightCounter(swiper) {
  const root = document.querySelector(".section-3 .mobile-box");
  if (!root) return;

  const currentEl = root.querySelector(".right-swiper-fraction .current");
  const totalEl = root.querySelector(".right-swiper-fraction .total");
  if (!currentEl || !totalEl) return;

  // loop 쓰면 swiper.realIndex가 "진짜 슬라이드" 기준이라 이거 쓰는게 정답
  const current = swiper.realIndex + 1;

  // 총 개수는 DOM에서 duplicate 제외하고 계산
  const total = root.querySelectorAll(".right-swiper .swiper-slide:not(.swiper-slide-duplicate)").length;

  currentEl.textContent = String(current).padStart(2, "0");
  totalEl.textContent = String(total).padStart(2, "0");
}

function initRightSwiper() {
  // 375 초과면 스와이퍼 제거
  if (window.matchMedia("(min-width: 376px)").matches) {
    if (rightSwiper) {
      rightSwiper.destroy(true, true);
      rightSwiper = null;
    }
    return;
  }

  // 375 이하에서만 생성
  if (!rightSwiper) {
    rightSwiper = new Swiper(".section-3 .right-swiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      initialSlide: 0,
      speed: 600,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      navigation: {
        nextEl: ".section-3 .right-swiper-next",
        prevEl: ".section-3 .right-swiper-prev",
      },

      on: {
        init(swiper) {
          updateRightCounter(swiper);
        },
        slideChange(swiper) {
          updateRightCounter(swiper);
        },
      },
    });
  } else {
    rightSwiper.update();
    updateRightCounter(rightSwiper);
  }
}

// DOM 다 만든 다음 실행 (중요)
document.addEventListener("DOMContentLoaded", () => {
  initRightSwiper();
  window.addEventListener("resize", initRightSwiper);
});
// 섹션 3 375 반응형 끝

// 섹션 4 768반응형 시작

function eventAutoSwitch() {
  if (window.innerWidth > 768) return;

  const pages = document.querySelectorAll(".event-page");
  let index = 0;

  setInterval(() => {
    pages[index].classList.remove("active");
    index = (index + 1) % pages.length;
    pages[index].classList.add("active");
  }, 3000);
}

eventAutoSwitch();

// 섹션 4 768반응형 끝
let eventSwiper;

function initEventSwiper() {
  if (window.innerWidth > 375 && eventSwiper) {
    eventSwiper.destroy(true, true);
    eventSwiper = null;
    return;
  }

  if (window.innerWidth <= 375 && !eventSwiper) {
    eventSwiper = new Swiper(".event-swiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  }
}

initEventSwiper();
window.addEventListener("resize", initEventSwiper);

// 디바이더 1 마퀴 시작

document.querySelectorAll(".text-marquee-track").forEach((track) => {
  track.innerHTML += track.innerHTML;
});

// 디바이더 1 마퀴 끝
// 섹션 5 마퀴 시작

const track = document.querySelector(".marquee-track");
track.innerHTML += track.innerHTML;

// /섹션 5 마퀴 끝
mobiletopbar_init();
