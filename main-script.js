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
});

new Swiper(".bakery-swiper", {
  loop: true,
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".bakery-swiper .swiper-button-next",
    prevEl: ".bakery-swiper .swiper-button-prev",
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
