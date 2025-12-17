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
