(function () {
  var root = document.documentElement;
  var darkQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function isDark() {
    if (root.dataset.theme === "dark") return true;
    if (root.dataset.theme === "light") return false;
    return !!(darkQuery && darkQuery.matches);
  }

  /* Theme toggle */
  var themeButton = document.querySelector(".theme-toggle");
  function syncThemeButton() {
    if (!themeButton) return;
    var dark = isDark();
    themeButton.setAttribute("aria-pressed", dark ? "true" : "false");
    themeButton.setAttribute("aria-label", dark ? "Use light appearance" : "Use dark appearance");
  }
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
      syncThemeButton();
    });
    if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener("change", syncThemeButton);
    syncThemeButton();
  }

  /* Mobile navigation */
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-navigation");
  function setMenu(open) {
    if (!menuButton || !nav) return;
    nav.dataset.open = open ? "true" : "false";
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      setMenu(nav.dataset.open !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  /* Close popovers on outside click / Escape */
  var emailMenu = document.querySelector(".email-menu");
  document.addEventListener("click", function (event) {
    if (emailMenu && emailMenu.open && !emailMenu.contains(event.target)) emailMenu.open = false;
    if (nav && menuButton && nav.dataset.open === "true" && !nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (emailMenu) emailMenu.open = false;
    setMenu(false);
  });

  /* Footer year */
  var year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
