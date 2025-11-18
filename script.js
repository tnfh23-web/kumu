// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5; // 동작의 구현이 시작되는 위치
var navbarHeight = $("header").outerHeight(); // 영향을 받을 요소를 선택

// 스크롤시에 사용자가 스크롤했다는 것을 알림
$(window).scroll(function (event) {
  didScroll = true;
});

// hasScrolled()를 실행하고 didScroll 상태를 재설정
setInterval(function () {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

// 동작을 구현
function hasScrolled() {
  var st = $(this).scrollTop();

  // 🔥 화면 위쪽에서는 헤더 숨김 꺼버림
  if (st < 150) {
    $("header").removeClass("nav-up").addClass("nav-down");
    lastScrollTop = st;
    return;
  }

  if (Math.abs(lastScrollTop - st) <= delta) return;

  if (st > lastScrollTop && st > navbarHeight) {
    $("header").removeClass("nav-down").addClass("nav-up");
  } else {
    if (st + $(window).height() < $(document).height()) {
      $("header").removeClass("nav-up").addClass("nav-down");
    }
  }

  lastScrollTop = st;
}

/* 추가로 웹페이지의 스크롤을 내렸을때를 감지해 코드를 실행시키는 함수입니다.
$(window).scroll(function(){ 
   if($(window).scrollTop() == $(document).height() - $(window).height()){ 
      // 실행할 함수
   } 
});
*/

$(".submenu").stop().hide();
$("#menu_bg").stop().hide();
$(".navi>li")
  .mouseenter(function () {
    $(".submenu").stop().slideDown(500);
    $("#menu_bg").stop().slideDown(500);
  })
  .mouseleave(function () {
    $(".submenu").stop().slideUp(500);
    $("#menu_bg").stop().slideUp(500);
  });

// ============================
