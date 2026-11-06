(() => {
  const sections = [
    [".section-2", [".section-2-title-box", ".tab_btn", ".section-2-swiper-wrap.active .swiper-slide:nth-child(-n+3) > img"]],
    [".new-product-panels", [".is-active .right-card-title h2", ".is-active .right-card-title p", ".is-active .right-card img"]],
    [".section-3 .mobile-box", [".right-swiper-title-box", ".right-swiper .swiper-slide-active img", ".right-swiper-control"]],
    [".section-4", [".sec-4-title", ".img-card-box:nth-child(-n+2) img, .event-swiper .swiper-slide-active img"]],
    [".section-5", [".sec-5-title"]],
    [".divider-3", ["h2", "p"]],
    [".sub-title", ["h2", "p"]],
    [".sub-left-box", [":scope > div"]],
    [".sub-right-box", [":scope > div"]],
    [".sub-last-box", [".last-box-title", ".last-text-box"]],
    [".sub-button-box", [".sub-button"]],
    [".sub_page_bakery", [".sub_page_title", ".sub_page_desc", ".tab_menu"]],
    [".product_container", [".prod_wrap.active > div:nth-child(-n+4) .product_name"]],
    ["footer", [".footer-logo-box", ".footer-text-box"]],
  ];

  function prepareEntries() {
    if (!window.IntersectionObserver) return () => {};

    const groups = new Map();
    const prepared = new Set();

    function finish(element) {
      delete element.dataset.kumuEntry;
      element.style.removeProperty("--kumu-entry-delay");
      prepared.delete(element);
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.boundingClientRect.bottom > 0) continue;
        const targets = groups.get(entry.target);
        if (!targets) continue;
        observer.unobserve(entry.target);
        groups.delete(entry.target);
        for (const target of targets) {
          if (!prepared.has(target)) continue;
          if (entry.isIntersecting) target.dataset.kumuEntry = "playing";
          else finish(target);
        }
      }
    }, { rootMargin: "0px 0px -48px" });

    const batches = [];
    for (const [selector, parts] of sections) {
      const section = document.querySelector(selector);
      if (!section?.getClientRects().length) continue;

      const targets = parts.flatMap((part) => [...section.querySelectorAll(part)])
        .filter((element) => {
          const box = element.getBoundingClientRect();
          return box.width && box.height && box.bottom > 0 && box.right > 0 && box.left < innerWidth;
        });
      if (targets.length) batches.push(targets);
    }
    for (const targets of batches) {
      targets.forEach((element, index) => {
        element.style.setProperty("--kumu-entry-delay", `${Math.min(index, 5)}`);
        element.dataset.kumuEntry = "pending";
        prepared.add(element);
      });
      groups.set(targets[0], targets);
      observer.observe(targets[0]);
    }

    const onAnimationEnd = (event) => {
      if (event.animationName === "kumu-entry") finish(event.target);
    };
    const onFocus = (event) => {
      const target = event.target.closest("[data-kumu-entry]");
      if (target) finish(target);
    };
    document.addEventListener("animationend", onAnimationEnd);
    document.addEventListener("focusin", onFocus);

    return () => {
      observer.disconnect();
      document.removeEventListener("animationend", onAnimationEnd);
      document.removeEventListener("focusin", onFocus);
      prepared.forEach(finish);
    };
  }

  let dispose;

  function mount(playEntries) {
    if (dispose) return;
    const lenis = window.Lenis
      ? new window.Lenis({ smoothWheel: true, lerp: 0.08, autoRaf: true })
      : null;
    const cleanupEntries = playEntries ? prepareEntries() : () => {};
    const sidebar = document.querySelector(".sidebar-menu");

    const syncSidebar = () => {
      const open = sidebar.classList.contains("active") && getComputedStyle(sidebar).display !== "none";
      if (open) lenis.stop();
      else lenis.start();
    };
    const sidebarObserver = lenis && sidebar ? new MutationObserver(syncSidebar) : null;
    if (sidebarObserver) {
      sidebar.setAttribute("data-lenis-prevent", "");
      sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
      window.addEventListener("resize", syncSidebar);
      syncSidebar();
    }

    dispose = () => {
      cleanupEntries();
      sidebarObserver?.disconnect();
      window.removeEventListener("resize", syncSidebar);
      lenis?.destroy();
      dispose = undefined;
    };
  }

  window.addEventListener("pagehide", () => dispose?.());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) mount(false);
  });
  mount(true);
})();
