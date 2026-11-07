(() => {
  const sections = [
    [".section-2", [".section-2-title-box", ".tab_menu"]],
    [".section-2-swiper-wrap.active .section-2-swiper", [".swiper-slide"]],
    [".section-2-tablet-button-box", [":scope > div"]],
    [".new-product-panels .is-active .right-card-top", [".right-card-title", ".right-card"]],
    [".new-product-panels .is-active .right-card-bottom", [".right-card"]],
    [".section-3 .mobile-box", [".right-swiper-title-box"]],
    [".section-3 .right-swiper", [".swiper-slide"]],
    [".section-3 .mobile-box", [".right-swiper-control"]],
    [".section-4", [".sec-4-title", ".img-card-box:nth-child(-n+2) img, .event-swiper .swiper-slide-active img"]],
    [".section-5", [".sec-5-title"]],
    [".divider-3", ["h2", "p"]],
    [".sub-title", ["h2", "p"]],
    [".sub-left-box", [":scope > div"]],
    [".sub-right-box", [":scope > div"]],
    [".sub-last-box", [".last-box-title", ".last-text-box"]],
    [".sub-button-box", [".sub-button"]],
    ["footer", [".footer-logo-box", ".footer-text-box"]],
  ];
  const menuControls = [
    ".section-2 .tab_menu", ".section-2 .section-2-swiper-wrap",
    ".section-3 .arrow-box", ".section-3 .right-swiper", ".section-3 .right-swiper-control",
  ].join(", ");

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

      const frame = section.matches(".swiper") ? section.getBoundingClientRect() : null;
      const targets = parts.flatMap((part) => [...section.querySelectorAll(part)])
        .filter((element) => {
          const box = element.getBoundingClientRect();
          const left = Math.max(0, frame?.left ?? 0);
          const right = Math.min(innerWidth, frame?.right ?? innerWidth);
          return box.width && box.height && box.bottom > 0 && box.right > left + 1 && box.left < right - 1;
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
    const settleMenuEntry = (event) => {
      const control = event.target.closest(menuControls);
      if (!control) return;

      // The tab, carousel or NEW crossfade takes over as soon as it is used.
      const section = control.closest(".section-2, .section-3");
      section.querySelectorAll("[data-kumu-entry]").forEach(finish);
      for (const leader of groups.keys()) {
        if (!section.contains(leader)) continue;
        observer.unobserve(leader);
        groups.delete(leader);
      }
    };
    const onFocus = (event) => {
      settleMenuEntry(event);
      const target = event.target.closest("[data-kumu-entry]");
      if (target) finish(target);
    };
    document.addEventListener("animationend", onAnimationEnd);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("pointerdown", settleMenuEntry, true);
    document.addEventListener("click", settleMenuEntry, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("animationend", onAnimationEnd);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointerdown", settleMenuEntry, true);
      document.removeEventListener("click", settleMenuEntry, true);
      prepared.forEach(finish);
    };
  }

  let dispose;

  function pauseOffscreenLoops() {
    if (!window.IntersectionObserver) return () => {};
    const loops = document.querySelectorAll(".divider-1, .section-5, .divider-3");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("kumu-loops-paused", !entry.isIntersecting);
      }
    }, { rootMargin: "160px 0px" });
    loops.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      loops.forEach((element) => element.classList.remove("kumu-loops-paused"));
    };
  }

  function mount(playEntries) {
    if (dispose) return;
    const lenis = window.Lenis
      ? new window.Lenis({ smoothWheel: true, lerp: 0.08, autoRaf: true })
      : null;
    const cleanupEntries = playEntries ? prepareEntries() : () => {};
    const cleanupLoops = pauseOffscreenLoops();
    const headerRoots = [...document.querySelectorAll(".header, .mobile-header, .sidebar-menu")];
    const allowHeaderNavigation = event => {
      const link = event.target.closest("a[href]");
      if (link && !link.getAttribute("href").startsWith("#")) {
        event.stopPropagation();
        if (link.closest(".sidebar-menu")) {
          link.closest(".sidebar-menu").classList.remove("active");
          document.querySelector(".dim-overlay")?.classList.remove("active");
        }
      }
    };
    headerRoots.forEach(element => element.addEventListener("click", allowHeaderNavigation));
    const reserve = document.querySelector(".fixed-reserve-btn");
    const footer = document.querySelector("footer");
    const footerObserver = reserve && footer && window.IntersectionObserver
      ? new IntersectionObserver(([entry]) => {
          reserve.classList.toggle("is-over-footer", entry.isIntersecting);
        }, { rootMargin: "0px 0px 90px 0px" })
      : null;
    footerObserver?.observe(footer);
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
      cleanupLoops();
      headerRoots.forEach(element => element.removeEventListener("click", allowHeaderNavigation));
      footerObserver?.disconnect();
      reserve?.classList.remove("is-over-footer");
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
