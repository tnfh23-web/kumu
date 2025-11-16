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

// ============================
// Section-1 자동 슬라이더
// ============================

// 슬라이드 요소
var slides = $(".section-1 .slide");
var totalSlides = slides.length;

// 인디케이터 요소
var currentNum = $(".section-1 .current");
var totalNum = $(".section-1 .total");
var progressBar = $(".section-1 .progress");

// 기본값 세팅
var currentIndex = 0;
var slideDuration = 3000;

// 총 페이지 수 세팅
totalNum.text(("0" + totalSlides).slice(-2));

// 첫 슬라이드 표시
showSlide(0);

// 자동 슬라이드 시작
setInterval(function () {
  nextSlide();
}, slideDuration);

// --------------------------------
// 함수: 다음 슬라이드 이동
// --------------------------------
function nextSlide() {
  var nextIndex = (currentIndex + 1) % totalSlides;
  showSlide(nextIndex);
}

// --------------------------------
// 함수: 특정 슬라이드 표시
// --------------------------------
function showSlide(index) {
  // 모든 슬라이드 숨기고
  slides.removeClass("active");

  // 해당 슬라이드 활성화
  $(slides[index]).addClass("active");

  // 번호 업데이트 (01, 02...)
  currentNum.text(("0" + (index + 1)).slice(-2));

  // 진행바 애니메이션 초기화
  progressBar.removeClass("animate");
  void progressBar[0].offsetWidth; // 리플로우 강제 → 애니메이션 재시작

  // 다시 애니메이션 시작
  progressBar.addClass("animate");

  // 현재 인덱스 갱신
  currentIndex = index;
}
