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

// ============================

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

mobiletopbar_init();
