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
mobiletopbar_init();
