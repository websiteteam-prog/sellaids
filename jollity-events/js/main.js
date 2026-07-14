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
   Accordions (Activities page)
   ------------------------------------------------------------------ */
function setAccordion(item, open) {
  const body = item.querySelector(".acc-body");
  item.classList.toggle("open", open);
  const head = item.querySelector(".acc-head");
  if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
  if (body) body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
}

document.querySelectorAll(".acc-item").forEach((item) => {
  const head = item.querySelector(".acc-head");
  if (!head) return;
  head.addEventListener("click", () => setAccordion(item, !item.classList.contains("open")));
});

/* Open the accordion targeted by the URL hash (from search / strip links) */
function openHashAccordion() {
  const id = window.location.hash.replace("#", "");
  if (!id) return;
  const target = document.getElementById(id);
  if (target && target.classList.contains("acc-item")) {
    setAccordion(target, true);
    setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
}
window.addEventListener("hashchange", openHashAccordion);
openHashAccordion();

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
   Calendar (calendar page) — sample events, month navigation
   ------------------------------------------------------------------ */
const calGrid = document.getElementById("cal-grid");
if (calGrid) {
  const calTitle = document.getElementById("cal-title");
  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* Sample events by day-of-month (repeat every month as placeholders) */
  const SAMPLE_EVENTS = {
    2: [{ t: "Fun Painting", c: 1 }],
    4: [{ t: "Musical Bingo", c: 2 }],
    6: [{ t: "Yoga", c: 3 }],
    9: [{ t: "Book Club", c: 4 }],
    11: [{ t: "Memory Boosters", c: 1 }],
    13: [{ t: "Karaoke", c: 2 }],
    16: [{ t: "Garden Club", c: 3 }],
    18: [{ t: "Clay Modelling", c: 1 }],
    20: [{ t: "Digital Skills", c: 4 }],
    23: [{ t: "Story Telling", c: 2 }],
    25: [{ t: "Gentle Stretching", c: 3 }],
    27: [{ t: "Culinary Adventures", c: 4 }],
    30: [{ t: "Social Jollies Meet", c: 2 }]
  };

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  function renderCalendar() {
    calTitle.textContent = MONTHS[viewMonth] + " " + viewYear;
    calGrid.innerHTML = DOWS.map((d) => `<div class="cal-dow">${d}</div>`).join("");

    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDow; i++) {
      calGrid.insertAdjacentHTML("beforeend", '<div class="cal-cell empty"></div>');
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const events = (SAMPLE_EVENTS[d] || [])
        .map((ev) => `<span class="cal-event ev-${ev.c}">${ev.t}</span>`)
        .join("");
      calGrid.insertAdjacentHTML(
        "beforeend",
        `<div class="cal-cell${isToday ? " today" : ""}"><span class="d">${d}</span>${events}</div>`
      );
    }
  }

  document.getElementById("cal-prev").addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();
}

/* ------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------ */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
