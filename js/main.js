// Hagonoy GroundWatch — shared layout and small page behaviours

const PAGES = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "causes.html", label: "Causes & Effects" },
  { href: "impact.html", label: "Impact" },
  { href: "map.html", label: "Map" },
  { href: "solutions.html", label: "Solutions" },
  { href: "learn.html", label: "Quiz & FAQ" },
  { href: "report.html", label: "Report" },
  { href: "references.html", label: "References" },
];

const LOGO_SVG = `
<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
  <circle cx="17" cy="17" r="16" fill="#c8792c"/>
  <path d="M4 20 Q10 16 17 20 T30 20 V30 H4 Z" fill="#0f5c63"/>
  <path d="M9 19 V12 L14 8 L19 12 V19" fill="#fff"/>
  <path d="M17 4 V9 M14.5 6.5 L17 9 L19.5 6.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

function buildHeader() {
  const current = location.pathname.split("/").pop() || "index.html";
  const links = PAGES.map(
    (p) =>
      `<li><a href="${p.href}"${p.href === current ? ' class="active" aria-current="page"' : ""}>${p.label}</a></li>`
  ).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container">
      <a class="brand" href="index.html">${LOGO_SVG}<span>Hagonoy GroundWatch</span></a>
      <nav class="site-nav" id="site-nav" aria-label="Main"><ul>${links}</ul></nav>
      <div class="header-actions">
        <button class="theme-toggle" type="button"></button>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span class="nav-toggle-label">Menu</span></button>
      </div>
    </div>`;
  document.body.prepend(header);

  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  setupThemeToggle(header.querySelector(".theme-toggle"));
  setupCompactHeader(header);
}

// Pick the header layout by measuring what fits rather than using fixed breakpoints,
// so browser zoom and font differences are handled: one row, then the links on their
// own row below the brand, and only on phones the Menu button.
function setupCompactHeader(header) {
  const row = header.querySelector(".container");
  const nav = header.querySelector(".site-nav");
  const list = nav.querySelector("ul");
  const toggle = header.querySelector(".nav-toggle");

  function update() {
    // Trying layouts changes the header height for a moment; keep the reader's place
    const scrollY = window.scrollY;
    header.classList.remove("stacked", "compact");
    if (row.scrollWidth > row.clientWidth + 1) {
      // Links on their own row may wrap onto a second line, but no more,
      // and phones always get the Menu button to keep the header short
      header.classList.add("stacked");
      const linkHeight = list.querySelector("a").offsetHeight;
      if (list.offsetHeight > linkHeight * 2.5 || row.clientWidth < 520) {
        header.classList.replace("stacked", "compact");
      }
    }
    if (!header.classList.contains("compact")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    // Keep in-page links (e.g. citations) from landing under the sticky header
    document.documentElement.style.scrollPaddingTop = header.offsetHeight + 16 + "px";
    if (window.scrollY !== scrollY) window.scrollTo({ top: scrollY, behavior: "instant" });
  }

  // Mobile browsers fire "resize" while scrolling (the address bar shows and hides).
  // Re-measuring then briefly changes the header height and makes the page jump,
  // so only re-measure when the width actually changes (e.g. rotating the phone).
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    update();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  update();
}

// Light/dark theme. With no saved choice the site follows the device setting;
// the inline script in each page's <head> applies a saved choice before first paint.
const THEME_KEY = "groundwatch-theme";
const SUN_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>`;
const MOON_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>`;

function isDark() {
  const chosen = document.documentElement.dataset.theme;
  if (chosen) return chosen === "dark";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// When the site is opened straight from a folder (file://), browsers such as Firefox
// keep localStorage separate for every page, so a saved theme would not carry over.
// In that case add ?theme=… to links to other pages at the moment they are followed;
// the inline script in each page's <head> reads it. Online, localStorage is enough.
function carryThemeInLinks() {
  if (location.protocol !== "file:") return;

  function addTheme(e) {
    const link = e.target.closest("a[href]");
    const theme = document.documentElement.dataset.theme;
    if (!link || !theme) return;
    const url = new URL(link.getAttribute("href"), location.href);
    if (url.protocol !== "file:" || !url.pathname.endsWith(".html")) return;
    url.searchParams.set("theme", theme);
    link.href = url.href;
  }

  // Capture phase, so the href is updated before the browser follows it
  document.addEventListener("click", addTheme, true);
  document.addEventListener("auxclick", addTheme, true);
}

function setupThemeToggle(button) {
  function render() {
    const dark = isDark();
    button.innerHTML = dark ? SUN_ICON : MOON_ICON;
    const label = dark ? "Switch to light mode" : "Switch to dark mode";
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  button.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // Storage blocked; carryThemeInLinks still passes the choice between pages
    }
    render();
  });

  carryThemeInLinks();

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
  }
  render();
}

function buildFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div>
        <strong>Hagonoy GroundWatch</strong><br>
        A Web-Based Environmental Awareness Platform on Land Subsidence<br>
        Hagonoy, Bulacan, Philippines
      </div>
      <div>
        Educational project for Environmental Science.<br>
        Information is for awareness only. See <a href="references.html">References</a>.<br>
        &copy; ${new Date().getFullYear()} Hagonoy GroundWatch Team
      </div>
    </div>`;
  document.body.append(footer);
}

// Subsidence vs. sea-level calculator (about.html)
function setupCalculator() {
  const calc = document.getElementById("subsidence-calc");
  if (!calc) return;

  const rate = calc.querySelector("#rate");
  const years = calc.querySelector("#years");
  const rateOut = calc.querySelector("#rate-out");
  const yearsOut = calc.querySelector("#years-out");
  const sinkOut = calc.querySelector("#sink-out");
  const seaOut = calc.querySelector("#sea-out");
  const totalOut = calc.querySelector("#total-out");
  const land = calc.querySelector(".land");
  const sea = calc.querySelector(".sea");
  const house = calc.querySelector(".house");

  const SEA_LEVEL_RISE_CM_PER_YEAR = 0.37; // global average 2006–2018, 3.7 mm/yr (IPCC AR6 WG1 SPM, 2021)

  function update() {
    const r = parseFloat(rate.value);
    const y = parseInt(years.value, 10);
    const sink = r * y;
    const seaRise = SEA_LEVEL_RISE_CM_PER_YEAR * y;
    const total = sink + seaRise;

    rateOut.textContent = r.toFixed(1);
    yearsOut.textContent = y;
    sinkOut.textContent = sink.toFixed(0) + " cm";
    seaOut.textContent = seaRise.toFixed(0) + " cm";
    totalOut.textContent = total.toFixed(0) + " cm";

    // Visual: land starts 40px above the sea and moves 1px per cm (capped)
    const landHeight = Math.max(20, 120 - Math.min(sink, 100));
    const seaHeight = Math.min(160, 80 + Math.min(seaRise, 40));
    land.style.height = landHeight + "px";
    sea.style.height = seaHeight + "px";
    house.style.bottom = landHeight + "px";
  }

  rate.addEventListener("input", update);
  years.addEventListener("input", update);

  // On phones a slider stays focused after it is touched, and when the address bar
  // reappears during scrolling, Chrome scrolls the focused control back into view,
  // making the page jump up to the calculator. Release focus when the finger lifts;
  // keyboard and mouse users keep normal focus.
  [rate, years].forEach((slider) => {
    slider.addEventListener("touchend", () => slider.blur());
    slider.addEventListener("pointerup", (e) => {
      if (e.pointerType !== "mouse") slider.blur();
    });
  });

  update();
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  setupCalculator();
});
