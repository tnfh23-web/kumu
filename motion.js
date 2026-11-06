(() => {
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Each list follows the reading order; carousel tracks stay under their own controls.
  const sections = [
    [".section-1", [".section-1-swiper"], 0],
    [".section-2", [".section-2-title-box", ".tab_menu", ".section-2-swiper-wrap.active", ".section-2-tablet-button-box"]],
    [".section-3 .left-content", [".left-content img"], 0],
    [".new-product-panels", [".is-active .right-card-title", ".is-active .right-card"]],
    [".section-3 .mobile-box", [".right-swiper-title-box", ".right-swiper", ".right-swiper-control"]],
    [".section-4", [".sec-4-title", ".event-switch, .event-swiper"]],
    [".divider-2", ["a"], 0],
    [".section-5", [".sec-5-title", ".marquee-box"]],
    [".divider-3", ["h2", "p"]],
    [".sub-title", ["h2", "p"]],
    [".sub-left-box", [":scope > div"]],
    [".sub-right-box", [":scope > div"]],
    [".sub-last-box", [".last-box-title", ".last-text-box"]],
    [".sub-button-box", [".sub-button"]],
    [".sub_page_bakery", [".sub_page_title", ".sub_page_desc", ".tab_menu"]],
    [".product_container", [".prod_wrap.active"]],
    ["footer", [".footer-logo-box", ".footer-text-box"]],
  ];

  let dispose;

  function mount() {
    if (dispose) return;
    const lenis = Lenis ? new Lenis({ smoothWheel: true, lerp: 0.08 }) : null;
    const tick = (time) => lenis.raf(time * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const motion = gsap.matchMedia();
    motion.add({ compact: "(max-width: 375px)", wide: "(min-width: 376px)" }, ({ conditions }) => {
      const focusHandlers = [];
      for (const [selector, parts, distance = 22] of sections) {
        const section = document.querySelector(selector);
        if (!section?.getClientRects().length) continue;

        const targets = parts.flatMap((part) => [...section.querySelectorAll(part)])
          .filter((element) => element.getClientRects().length);
        if (!targets.length || section.getBoundingClientRect().bottom <= 0) continue;

        const offset = conditions.compact ? Math.min(distance, 12) : distance;
        targets.forEach((element) => { element.dataset.kumuEntry = ""; });
        gsap.set(targets, { opacity: 0 });
        const timeline = gsap.timeline({ paused: true }).fromTo(targets, {
          "--kumu-entry-translate": `0 ${offset}px`,
        }, {
          opacity: 1,
          "--kumu-entry-translate": "0 0px",
          immediateRender: false,
          duration: offset ? 0.58 : 0.65,
          stagger: 0.095,
          ease: "power2.out",
          clearProps: "opacity,--kumu-entry-translate",
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 94%",
          once: true,
          onEnter: () => timeline.play(),
          onEnterBack: () => timeline.play(),
        });

        const revealOnFocus = () => timeline.progress(1);
        section.addEventListener("focusin", revealOnFocus);
        focusHandlers.push(() => {
          section.removeEventListener("focusin", revealOnFocus);
          trigger.kill();
          targets.forEach((element) => { delete element.dataset.kumuEntry; });
        });
      }
      return () => focusHandlers.forEach((remove) => remove());
    });

    // A mobile sidebar can scroll independently while the page stays in place.
    const sidebar = document.querySelector(".sidebar-menu");
    sidebar?.setAttribute("data-lenis-prevent", "");
    const syncSidebar = () => {
      if (!lenis || !sidebar) return;
      const open = sidebar.classList.contains("active") && getComputedStyle(sidebar).display !== "none";
      if (open) lenis.stop();
      else lenis.start();
    };
    const sidebarObserver = lenis && sidebar ? new MutationObserver(syncSidebar) : null;
    sidebarObserver?.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
    if (sidebarObserver) window.addEventListener("resize", syncSidebar);
    syncSidebar();

    let mounted = true;
    document.fonts?.ready.then(() => {
      if (!mounted) return;
      lenis?.resize();
      ScrollTrigger.refresh();
    });

    dispose = () => {
      mounted = false;
      sidebarObserver?.disconnect();
      window.removeEventListener("resize", syncSidebar);
      motion.revert();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      }
      dispose = undefined;
    };
  }

  window.addEventListener("pagehide", () => dispose?.());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) mount();
  });
  mount();
})();
