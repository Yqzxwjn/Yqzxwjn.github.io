/* 目录高亮、滚动显现、证书灯箱。 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.getElementById("siteHeader");

  /* 进入视口时显现 */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* 顶栏状态与本页目录 */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll("[data-toc]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var current = "";

  function setActive(id) {
    if (!id || id === current) return;
    current = id;
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-nav") === id);
    });
    tocLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-toc") === id);
    });
  }

  var ticking = false;

  function update() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);

    if (sections.length) {
      var active = sections[0].id;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= 140) active = section.id;
      });
      setActive(active);
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();

  /* 证书灯箱 */
  var dialog = document.getElementById("lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var image = dialog.querySelector("img");
    var caption = dialog.querySelector("figcaption");
    var closeButton = dialog.querySelector(".lightbox-close");
    var lastTrigger = null;

    function openLightbox(trigger) {
      image.src = trigger.getAttribute("data-lightbox");
      image.alt = trigger.getAttribute("data-caption") || "";
      caption.textContent = trigger.getAttribute("data-caption") || "";
      lastTrigger = trigger;
      dialog.showModal();
      closeButton.focus({ preventScroll: true });
    }

    function closeLightbox() {
      dialog.close();
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    }

    document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openLightbox(trigger);
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeLightbox();
    });
  }
})();
