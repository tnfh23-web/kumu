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
