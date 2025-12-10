$(".submenu").hide();
$("#menu_bg").hide();

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
function plus_button_init() {
  $(".plus-button").click(function () {
    const ol = $(".last-text-box > ol");

    ol.toggleClass("active");

    // 버튼 텍스트 바꾸기
    if (ol.hasClass("active")) {
      $(this).text("접기");
    } else {
      $(this).text("더 보기");
    }
  });
}

plus_button_init();
mobiletopbar_init();
