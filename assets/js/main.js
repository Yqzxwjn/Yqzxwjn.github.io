/* Small, dependency free behaviours for the site. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav scroll state ---------- */
  var nav = document.querySelector(".nav");
  var lastScrolled = false;
  function onScroll() {
    if (!nav) return;
    var scrolled = window.scrollY > 24;
    if (scrolled !== lastScrolled) {
      nav.classList.toggle("is-scrolled", scrolled);
      lastScrolled = scrolled;
    }
  }
  var scrollTick = false;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollTick) return;
      scrollTick = true;
      window.requestAnimationFrame(function () {
        onScroll();
        scrollTick = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".menu-panel");

  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
    var label = toggle.querySelector(".visually-hidden");
    if (label) label.textContent = open ? "关闭菜单" : "打开菜单";
    if (open) {
      var first = panel.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- scroll reveals ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = Number(el.getAttribute("data-reveal-delay") || 0);
          window.setTimeout(function () {
            el.classList.add("is-visible");
          }, delay);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- tagline word reveal ---------- */
  var tagline = document.querySelector(".tagline");
  var words = Array.prototype.slice.call(document.querySelectorAll(".tagline__word"));
  if (tagline && words.length) {
    var started = false;
    var playTagline = function () {
      if (started) return;
      started = true;
      words.forEach(function (word, index) {
        if (!reduceMotion) {
          word.style.transitionDelay = Math.round(index * 55) + "ms";
        }
        word.classList.add("is-lit");
      });
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      playTagline();
    } else {
      var taglineObserver = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              playTagline();
              taglineObserver.disconnect();
              return;
            }
          }
        },
        { threshold: 0.25 }
      );
      taglineObserver.observe(tagline);
    }
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy");
      var label = button.querySelector("[data-copy-label]");
      var original = label ? label.textContent : "";
      var done = function () {
        if (!label) return;
        label.textContent = "已复制";
        window.setTimeout(function () {
          label.textContent = original;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, done);
      } else {
        done();
      }
    });
  });

  /* ---------- travel map <-> list ---------- */
  var cityGroups = Array.prototype.slice.call(document.querySelectorAll(".map-cities .city"));
  var trips = Array.prototype.slice.call(document.querySelectorAll(".trip[data-city]"));
  var routePaths = Array.prototype.slice.call(document.querySelectorAll(".map-routes .route"));

  if (cityGroups.length) {
    var clearActive = function () {
      cityGroups.forEach(function (g) {
        g.classList.remove("is-active");
      });
      trips.forEach(function (t) {
        t.classList.remove("is-active");
      });
      routePaths.forEach(function (p) {
        p.classList.remove("is-active");
      });
    };

    var setActive = function (id) {
      clearActive();
      cityGroups.forEach(function (g) {
        if (g.getAttribute("data-city") === id) g.classList.add("is-active");
      });
      trips.forEach(function (t) {
        if (t.getAttribute("data-city") === id) t.classList.add("is-active");
      });
      routePaths.forEach(function (p) {
        if (p.getAttribute("data-from") === id || p.getAttribute("data-to") === id) {
          p.classList.add("is-active");
        }
      });
    };

    cityGroups.forEach(function (group) {
      var id = group.getAttribute("data-city");
      group.addEventListener("mouseenter", function () {
        setActive(id);
      });
      group.addEventListener("focus", function () {
        setActive(id);
      });
      group.addEventListener("mouseleave", function () {
        clearActive();
      });
      group.addEventListener("blur", function () {
        clearActive();
      });
      var jump = function () {
        var target = document.querySelector('.trip[data-city="' + id + '"]');
        if (!target) return;
        setActive(id);
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        var link = target.querySelector("a, button");
        if (link) link.focus({ preventScroll: true });
      };
      group.addEventListener("click", jump);
      group.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          jump();
        }
      });
    });

    trips.forEach(function (trip) {
      var id = trip.getAttribute("data-city");
      trip.addEventListener("mouseenter", function () {
        setActive(id);
      });
      trip.addEventListener("mouseleave", function () {
        clearActive();
      });
      trip.addEventListener("focusin", function () {
        setActive(id);
      });
      trip.addEventListener("focusout", function () {
        clearActive();
      });
    });
  }

  /* ---------- current year in any .js-year ---------- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
