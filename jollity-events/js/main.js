/* ==========================================================================
   The Jollity Events — shared behaviour
   ========================================================================== */

/* ------------------------------------------------------------------
   Activity data (single source of truth, also used by the register
   form's dependent "Choose Session" dropdown and the search overlay)
   ------------------------------------------------------------------ */
const ACTIVITIES = {
  "Art & Craft": [
    "Fun Painting",
    "Creative crafts",
    "Clay modelling",
    "Collage-making",
    "Scrapbooking",
    "Gratitude tree",
    "Small DIY projects",
    "Reminiscence and Memory Boxes"
  ],
  "Hobbies & Recreation": [
    "Therapeutic Colouring",
    "Drawing Activities",
    "Reading",
    "Writing & Journaling",
    "Story Telling",
    "Indoor Herb Gardens",
    "Dancing",
    "Engaging Art",
    "Knitting and Crafting"
  ],
  "Cognitive Games": [
    "Memory boosters",
    "Decision making games",
    "Strategy thinking games",
    "Brain Stimulating activities",
    "Visual games",
    "Comforting activities",
    "Treat Trolley",
    "Physical Recreation"
  ],
  "Music & Movement": [
    "Karaoke",
    "Charades",
    "Interactive sing-alongs",
    "Listening Sessions",
    "Jamming",
    "Musical Bingo",
    "Props dancing",
    "Musical games",
    "Learn musical instrument"
  ],
  "Mindfulness": [
    "Meditation & Mindfulness",
    "Yoga",
    "Gentle Stretching",
    "Easy Sit-down Exercises"
  ],
  "Social Jollies": [
    "Book Club",
    "Photo Sharing Circle",
    "Reading club",
    "Reminiscence Group",
    "Culinary Adventures",
    "Garden Club"
  ],
  "Digital Literacy": [
    "Security & Safety",
    "Essential Skills",
    "Entertainment & Hobbies",
    "AI-powered tools"
  ],
  "One-on-One": [
    "One-on-one visits for many fun & stimulating activities"
  ]
};

const PAGES = [
  { title: "Activities", url: "activities.php", tag: "Page" },
  { title: "Calendar", url: "calendar.php", tag: "Page" },
  { title: "Our Jollies", url: "our-jollies.php", tag: "Page" },
  { title: "Happy Moments", url: "happy-moments.php", tag: "Page" },
  { title: "About Us", url: "about.php", tag: "Page" },
  { title: "Contact", url: "contact.php", tag: "Page" },
  { title: "Testimonials", url: "testimonials.php", tag: "Page" },
  { title: "Register Now", url: "register.php", tag: "Page" }
];

const CATEGORY_ANCHOR = {
  "Art & Craft": "art-craft",
  "Hobbies & Recreation": "hobbies-recreation",
  "Cognitive Games": "cognitive-games",
  "Music & Movement": "music-movement",
  "Mindfulness": "mindfulness",
  "Social Jollies": "social-jollies",
  "Digital Literacy": "digital-literacy",
  "One-on-One": "one-on-one"
};

/* ------------------------------------------------------------------
   Header: sticky shrink + mobile nav toggle
   ------------------------------------------------------------------ */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("scrolled", window.scrollY > 30);
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );
}

/* ------------------------------------------------------------------
   Search overlay
   ------------------------------------------------------------------ */
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

function buildSearchIndex() {
  const index = [...PAGES];
  Object.keys(ACTIVITIES).forEach((cat) => {
    index.push({ title: cat, url: "activities.php#" + CATEGORY_ANCHOR[cat], tag: "Category" });
    ACTIVITIES[cat].forEach((sub) => {
      index.push({ title: sub, url: "activities.php#" + CATEGORY_ANCHOR[cat], tag: cat });
    });
  });
  return index;
}
const SEARCH_INDEX = buildSearchIndex();

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
  renderResults("");
  setTimeout(() => searchInput && searchInput.focus(), 60);
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove("open");
  document.body.style.overflow = "";
  if (searchInput) searchInput.value = "";
}

function renderResults(q) {
  if (!searchResults) return;
  const query = q.trim().toLowerCase();
  const matches = query
    ? SEARCH_INDEX.filter((item) => item.title.toLowerCase().includes(query)).slice(0, 12)
    : SEARCH_INDEX.slice(0, 8);
  if (!matches.length) {
    searchResults.innerHTML = '<div class="no-result">No results found. Try "music", "yoga", "games"…</div>';
    return;
  }
  searchResults.innerHTML = matches
    .map((m) => `<a href="${m.url}">🔎 ${m.title} <small>— ${m.tag}</small></a>`)
    .join("");
}

document.querySelectorAll("[data-open-search]").forEach((btn) => btn.addEventListener("click", openSearch));
document.querySelectorAll("[data-close-search]").forEach((btn) => btn.addEventListener("click", closeSearch));
if (searchOverlay) {
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}
if (searchInput) searchInput.addEventListener("input", (e) => renderResults(e.target.value));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearch();
});

/* ------------------------------------------------------------------
   Scroll reveal animations
   ------------------------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------------------------
   Activities catalogue grid: category tabs, sort, lazy "load more"
   ------------------------------------------------------------------ */
const pgrid = document.getElementById("pgrid");
if (pgrid) {
  const cards = Array.from(pgrid.querySelectorAll(".pcard"));
  const band = document.getElementById("cta-inline");
  const sortSel = document.getElementById("grid-sort");
  const loading = document.getElementById("grid-loading");
  const empty = document.getElementById("grid-empty");
  const tabs = Array.from(document.querySelectorAll(".ftab"));
  const BATCH = 12;
  const state = { cat: "all", sort: "new", shown: BATCH };
  let pending = false;

  cards.forEach((c, i) => (c.dataset.index = i));

  function applyGrid() {
    const list = cards.filter((c) => state.cat === "all" || c.dataset.cat === state.cat);
    if (state.sort === "az") list.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    else if (state.sort === "za") list.sort((a, b) => b.dataset.title.localeCompare(a.dataset.title));
    else list.sort((a, b) => a.dataset.index - b.dataset.index);

    cards.forEach((c) => c.classList.add("hide"));
    const visible = list.slice(0, state.shown);
    visible.forEach((c, i) => {
      c.classList.remove("hide");
      c.style.order = i * 2;
    });
    /* keep the inline CTA band after the 8th visible card, like the reference */
    if (band) band.style.order = visible.length >= 8 ? 15 : visible.length * 2 + 1;
    if (empty) empty.classList.toggle("on", list.length === 0);
    pending = list.length > state.shown;
    if (loading) loading.classList.toggle("on", pending);
  }

  const moreObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && pending) {
          pending = false;
          setTimeout(() => {
            state.shown += BATCH;
            applyGrid();
          }, 450);
        }
      });
    },
    { rootMargin: "220px" }
  );
  if (loading) moreObserver.observe(loading);

  function selectCat(cat) {
    state.cat = cat;
    state.shown = BATCH;
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
    applyGrid();
  }

  tabs.forEach((t) => t.addEventListener("click", () => selectCat(t.dataset.cat)));

  /* Dropdowns open on caret icon click (one at a time) */
  function closeDrops() {
    document.querySelectorAll(".ftab-wrap.open").forEach((w) => {
      w.classList.remove("open");
      const caret = w.querySelector(".ft-caret");
      if (caret) caret.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".ft-caret").forEach((caret) => {
    caret.addEventListener("click", (e) => {
      e.stopPropagation();
      const wrap = caret.closest(".ftab-wrap");
      const wasOpen = wrap.classList.contains("open");
      closeDrops();
      if (wasOpen) return;
      wrap.classList.add("open");
      caret.setAttribute("aria-expanded", "true");

      const drop = wrap.querySelector(".ftab-drop");
      if (!drop) return;
      if (window.innerWidth <= 860) {
        /* fixed-position panel on mobile: place it just under the tab */
        drop.style.top = wrap.getBoundingClientRect().bottom + 8 + "px";
      } else {
        drop.style.top = "";
        /* flip to the right edge if the panel would overflow the viewport */
        drop.classList.remove("flip");
        if (drop.getBoundingClientRect().right > window.innerWidth - 12) drop.classList.add("flip");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".ftab-wrap")) closeDrops();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrops();
  });

  document.querySelectorAll(".fd-row").forEach((row) => {
    row.addEventListener("click", () => {
      closeDrops();
      selectCat(row.dataset.cat);
      const item = row.dataset.item;
      if (item) {
        state.shown = cards.length;
        applyGrid();
        const target = cards.find(
          (c) => !c.classList.contains("hide") && c.querySelector("h3").textContent === item
        );
        if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
      }
    });
  });

  if (sortSel) {
    sortSel.addEventListener("change", () => {
      state.sort = sortSel.value;
      state.shown = BATCH;
      applyGrid();
    });
  }

  /* Deep links (#music-movement etc.) select the matching category tab */
  function applyCatalogHash() {
    const id = window.location.hash.replace("#", "");
    if (id && tabs.some((t) => t.dataset.cat === id)) selectCat(id);
  }
  window.addEventListener("hashchange", applyCatalogHash);
  applyGrid();
  applyCatalogHash();
}

/* ------------------------------------------------------------------
   Register form: dependent Activity -> Session dropdown + submit
   ------------------------------------------------------------------ */
const activitySelect = document.getElementById("activity");
const sessionSelect = document.getElementById("session");

if (activitySelect && sessionSelect) {
  Object.keys(ACTIVITIES).forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    activitySelect.appendChild(opt);
  });

  activitySelect.addEventListener("change", () => {
    const chosen = activitySelect.value;
    sessionSelect.innerHTML = "";
    if (!chosen) {
      sessionSelect.disabled = true;
      sessionSelect.innerHTML = '<option value="">Choose an activity first</option>';
      return;
    }
    sessionSelect.disabled = false;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a session";
    sessionSelect.appendChild(placeholder);
    ACTIVITIES[chosen].forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      sessionSelect.appendChild(opt);
    });
  });

  /* Pre-select activity passed via query string (?activity=Art+%26+Craft) */
  const params = new URLSearchParams(window.location.search);
  const preset = params.get("activity");
  if (preset && ACTIVITIES[preset]) {
    activitySelect.value = preset;
    activitySelect.dispatchEvent(new Event("change"));
  }
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!registerForm.checkValidity()) {
      registerForm.reportValidity();
      return;
    }
    const success = document.getElementById("form-success");
    if (success) {
      success.classList.add("show");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    registerForm.reset();
    if (sessionSelect) {
      sessionSelect.disabled = true;
      sessionSelect.innerHTML = '<option value="">Choose an activity first</option>';
    }
  });

  const cancelBtn = document.getElementById("form-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      registerForm.reset();
      const success = document.getElementById("form-success");
      if (success) success.classList.remove("show");
      if (sessionSelect) {
        sessionSelect.disabled = true;
        sessionSelect.innerHTML = '<option value="">Choose an activity first</option>';
      }
    });
  }
}

/* Enquiry form (contact page) */
const enquiryForm = document.getElementById("enquiry-form");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!enquiryForm.checkValidity()) {
      enquiryForm.reportValidity();
      return;
    }
    const success = document.getElementById("enquiry-success");
    if (success) success.classList.add("show");
    enquiryForm.reset();
  });
}

/* ------------------------------------------------------------------
   Calendar page — month tabs + circular event cards
   ------------------------------------------------------------------ */
const evGrid = document.getElementById("ev-grid");
if (evGrid) {
  const MONTHS_FULL = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const calYear = new Date().getFullYear();

  /* Sample sessions shown every month as placeholders */
  const CAL_EVENTS = [
    { d: 1,  title: "Fun Painting",            img: "act-fun-painting.svg",        note: "Art & Craft" },
    { d: 3,  title: "Musical Bingo",           img: "act-musical-bingo.svg",       note: "Music & Movement" },
    { d: 5,  title: "Yoga Morning",            img: "act-yoga.svg",                note: "Mindfulness" },
    { d: 8,  title: "Book Club",               img: "act-book-club.svg",           note: "Social Jollies" },
    { d: 10, title: "Memory Boosters",         img: "act-memory-boosters.svg",     note: "Cognitive Games" },
    { d: 12, title: "Karaoke Afternoon",       img: "act-karaoke.svg",             note: "Music & Movement" },
    { d: 15, title: "Garden Club",             img: "act-garden-club.svg",         note: "Social Jollies" },
    { d: 17, title: "Clay Modelling",          img: "act-clay-modelling.svg",      note: "Art & Craft" },
    { d: 19, title: "Essential Digital Skills", img: "act-essential-skills.svg",   note: "Digital Literacy" },
    { d: 22, title: "Story Telling Circle",    img: "act-story-telling.svg",       note: "Hobbies & Recreation" },
    { d: 24, title: "Gentle Stretching",       img: "act-gentle-stretching.svg",   note: "Mindfulness" },
    { d: 26, title: "Culinary Adventures",     img: "act-culinary-adventures.svg", note: "Social Jollies" },
    { d: 28, title: "Birthday Celebrations",   img: "moment-1.svg",                note: "Community" },
    { d: 30, title: "Social Jollies Meet",     img: "cat-social.svg",              note: "Community" }
  ];

  /* Stable dummy counts until real session data is available */
  function dummyCount(s) {
    let h = 0;
    for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return (h % 36) + 6;
  }

  function renderMonth(monthIdx) {
    const monthName = MONTHS_FULL[monthIdx];
    document.getElementById("cal-month-title").textContent = monthName;
    document.getElementById("crumb-month").textContent = monthName;

    const daysInMonth = new Date(calYear, monthIdx + 1, 0).getDate();
    const events = CAL_EVENTS.filter((e) => e.d <= daysInMonth);
    document.getElementById("cal-ev-count").textContent = events.length;

    const mon3 = monthName.slice(0, 3).toUpperCase();
    evGrid.innerHTML = events
      .map((e) => {
        const date = new Date(calYear, monthIdx, e.d);
        const dow = date.toLocaleDateString("en-US", { weekday: "long" });
        const n = dummyCount(e.title + monthIdx);
        const plus = (n % 4) + 1;
        return `<a class="ev-card" href="register.php">
          <div class="ev-img"><img src="assets/img/${e.img}" alt="${e.title}" loading="lazy"></div>
          <div class="ev-meta">
            <span class="ev-day">${String(e.d).padStart(2, "0")}</span>
            <span class="ev-date"><span class="ev-dow">${dow}</span><span class="ev-my">${mon3} ${calYear}</span></span>
            <span class="ev-count">${n}</span>
            <span class="ev-plus">+${plus}</span>
          </div>
          <h3>${e.title}</h3>
          <div class="ev-note">${e.note}</div>
        </a>`;
      })
      .join("");
  }

  const monthBtns = document.querySelectorAll(".month-item");
  monthBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      monthBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderMonth(parseInt(btn.dataset.month, 10));
    })
  );

  renderMonth(new Date().getMonth());
}

/* ------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------ */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
