<?php
$pageTitle = 'Activities — The Jollity Events';
$pageDesc  = 'Enriching Lives Through Meaningful Engagements! Explore Art & Craft, Hobbies & Recreation, Cognitive Games, Music & Movement, Mindfulness, Social Jollies, Digital Literacy and One-on-One programs.';
$active    = 'activities';
include 'includes/header.php';

/* ==================================================================
   SELF-CONTAINED ACTIVITIES PAGE
   All CSS, JS and images this page needs are inline below — replacing
   only this file is enough. Images are SVG data-URIs generated here;
   swap them for real photos later by replacing the img src values.
   ================================================================== */

/* Build an emoji-on-gradient placeholder image as a data URI */
function svg_data(string $emoji, string $c1, string $c2): string
{
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">'
         . '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">'
         . '<stop offset="0%" stop-color="' . $c1 . '"/><stop offset="100%" stop-color="' . $c2 . '"/>'
         . '</linearGradient></defs>'
         . '<rect width="400" height="400" fill="url(#g)"/>'
         . '<circle cx="72" cy="80" r="28" fill="#ffffff" opacity="0.25"/>'
         . '<circle cx="340" cy="120" r="20" fill="#ffffff" opacity="0.2"/>'
         . '<circle cx="300" cy="328" r="36" fill="#ffffff" opacity="0.18"/>'
         . '<text x="50%" y="54%" font-size="150" text-anchor="middle" dominant-baseline="middle">' . $emoji . '</text>'
         . '</svg>';
    return 'data:image/svg+xml;base64,' . base64_encode($svg);
}

/* Stable dummy counts until real session data is available */
function dummy_count(string $name): int { return (crc32($name) % 90) + 8; }
function dummy_new(string $name): int   { return crc32($name) % 5; }

/* Categories: emoji icon, gradient colours, sub-activities (name => emoji) */
$CATALOG = [
    'art-craft' => ['name' => 'Art & Craft', 'emoji' => '🎨', 'c1' => '#FFD6E8', 'c2' => '#FF9EC4', 'items' => [
        'Fun Painting' => '🖌️', 'Creative crafts' => '✂️', 'Clay modelling' => '🏺', 'Collage-making' => '🖼️',
        'Scrapbooking' => '📒', 'Gratitude tree' => '🌳', 'Small DIY projects' => '🔨', 'Reminiscence and Memory Boxes' => '📦',
    ]],
    'hobbies-recreation' => ['name' => 'Hobbies & Recreation', 'emoji' => '🧶', 'c1' => '#FFE9C7', 'c2' => '#FFC46B', 'items' => [
        'Therapeutic Colouring' => '🖍️', 'Drawing Activities' => '✏️', 'Reading' => '📖', 'Writing & Journaling' => '📝',
        'Story Telling' => '📚', 'Indoor Herb Gardens' => '🌿', 'Dancing' => '💃', 'Engaging Art' => '🎨', 'Knitting and Crafting' => '🧶',
    ]],
    'cognitive-games' => ['name' => 'Cognitive Games', 'emoji' => '🧩', 'c1' => '#D8F5DE', 'c2' => '#8FDCA0', 'items' => [
        'Memory boosters' => '🧠', 'Decision making games' => '🎯', 'Strategy thinking games' => '♟️',
        'Brain Stimulating activities' => '💡', 'Visual games' => '👁️', 'Comforting activities' => '🫖',
        'Treat Trolley' => '🍪', 'Physical Recreation' => '🏓',
    ]],
    'music-movement' => ['name' => 'Music & Movement', 'emoji' => '🎵', 'c1' => '#DCE4FF', 'c2' => '#93A9FF', 'items' => [
        'Karaoke' => '🎤', 'Charades' => '🎭', 'Interactive sing-alongs' => '🎶', 'Listening Sessions' => '🎧',
        'Jamming' => '🥁', 'Musical Bingo' => '🎲', 'Props dancing' => '🩰', 'Musical games' => '🎼', 'Learn musical instrument' => '🎹',
    ]],
    'mindfulness' => ['name' => 'Mindfulness', 'emoji' => '🧘', 'c1' => '#E3F7F3', 'c2' => '#8FD9CB', 'items' => [
        'Meditation & Mindfulness' => '🧘', 'Yoga' => '🌸', 'Gentle Stretching' => '🤸', 'Easy Sit-down Exercises' => '🪑',
    ]],
    'social-jollies' => ['name' => 'Social Jollies', 'emoji' => '🎉', 'c1' => '#FFE3D6', 'c2' => '#FFA98A', 'items' => [
        'Book Club' => '📕', 'Photo Sharing Circle' => '📷', 'Reading club' => '👓', 'Reminiscence Group' => '🗣️',
        'Culinary Adventures' => '🍲', 'Garden Club' => '🌻',
    ]],
    'digital-literacy' => ['name' => 'Digital Literacy', 'emoji' => '💻', 'c1' => '#E4E0FF', 'c2' => '#B0A4FF', 'items' => [
        'Security & Safety' => '🔒', 'Essential Skills' => '📱', 'Entertainment & Hobbies' => '🎬', 'AI-powered tools' => '🤖',
    ]],
    'one-on-one' => ['name' => 'One-on-One', 'emoji' => '🤝', 'c1' => '#FFF3C4', 'c2' => '#FFD95E', 'items' => [
        'One-on-one visits' => '🤝',
    ]],
];

$totalItems = 0;
$catIcon = [];
foreach ($CATALOG as $slug => $cat) {
    $totalItems += count($cat['items']);
    $catIcon[$slug] = svg_data($cat['emoji'], $cat['c1'], $cat['c2']);
}
?>

<style>
/* ================= Activities page styles (self-contained) ================= */
.crumb-bar { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: var(--text-light); padding: 16px 4px 4px; }
.crumb-bar a { color: var(--text-light); transition: color 0.2s ease; }
.crumb-bar a:hover { color: var(--primary); }
.crumb-bar .sep { opacity: 0.6; }
.crumb-bar .here { color: var(--primary); }

.ftab-bar { display: flex; gap: 12px; flex-wrap: wrap; padding: 12px 0 6px; }
.ftab-wrap { position: relative; flex: 0 0 auto; }
.ftab {
  display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
  background: #fff; border: 2px solid var(--border); border-radius: 16px;
  padding: 10px 42px 10px 18px; min-width: 104px; width: 100%; cursor: pointer;
  font-family: var(--font-display); text-align: left;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.ftab:hover { border-color: var(--primary-soft); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.ftab.active { background: var(--primary-tint); border-color: var(--primary); }
.ftab .ft-count { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--primary); }
.ftab .ft-count img { width: 17px; height: 17px; border-radius: 50%; }
.ftab .ft-name { font-weight: 700; font-size: 14.5px; color: var(--navy); white-space: nowrap; }

.ft-caret {
  position: absolute; top: 50%; right: 10px; transform: translateY(-50%);
  width: 26px; height: 26px; border: none; border-radius: 50%;
  background: var(--primary-tint); color: var(--primary-dark);
  font-size: 12px; line-height: 1; cursor: pointer; display: grid; place-items: center;
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease; z-index: 2;
}
.ft-caret:hover { background: #dfe7ff; }
.ftab-wrap.open .ft-caret { transform: translateY(-50%) rotate(180deg); background: var(--primary); color: #fff; }

.ftab-drop {
  position: absolute; top: calc(100% + 8px); left: 0; min-width: 280px;
  max-height: 62vh; overflow-y: auto; background: #fff; border-radius: 18px;
  box-shadow: var(--shadow-lg); padding: 10px; display: none; z-index: 400;
}
.ftab-drop.flip { left: auto; right: 0; }
.ftab-wrap.open .ftab-drop { display: block; animation: pop-up 0.25s ease; }

.fd-row {
  display: flex; align-items: center; gap: 11px; width: 100%; padding: 8px 10px;
  border: none; border-radius: 12px; background: none; cursor: pointer;
  font-family: var(--font-body); transition: background 0.2s ease;
}
.fd-row:hover { background: var(--primary-tint); }
.fd-row img { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; }
.fd-row .fd-name { flex: 1; text-align: left; font-weight: 700; font-size: 13.5px; color: var(--navy); }
.fd-row .fd-count { font-size: 12.5px; font-weight: 700; color: var(--primary); }
.fd-row .fd-new { font-size: 11px; font-weight: 800; background: var(--mint, #e2f6ef); color: #1d6a58; border-radius: 999px; padding: 2px 7px; }

.grid-toolbar { display: flex; align-items: center; justify-content: flex-end; gap: 14px; flex-wrap: wrap; margin: 14px 0 30px; }
.grid-sort {
  font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--navy);
  background: #fff; border: 2px solid var(--border); border-radius: 999px;
  padding: 10px 38px 10px 20px; cursor: pointer; outline: none; appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235b7cfa' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 16px center;
  transition: border-color 0.2s ease;
}
.grid-sort:hover, .grid-sort:focus { border-color: var(--primary-soft); }

.pgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 44px 24px; }
.pcard { display: block; text-align: center; color: var(--navy); }
.pcard.hide { display: none; }
.pcard .pimg {
  width: min(186px, 100%); aspect-ratio: 1; margin: 0 auto 14px; border-radius: 50%;
  overflow: hidden; border: 5px solid #fff; box-shadow: var(--shadow-md);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.pcard:hover .pimg { transform: scale(1.06); box-shadow: var(--shadow-lg); }
.pcard .pimg img { width: 100%; height: 100%; object-fit: cover; }
.badge-row { display: flex; justify-content: center; align-items: center; gap: 7px; margin-bottom: 8px; }
.pcount {
  display: inline-flex; align-items: center; gap: 7px; background: #fff;
  border: 1.5px solid var(--border); color: var(--navy); border-radius: 999px;
  padding: 4px 13px; font-size: 13px; font-weight: 800;
}
.pcount img { width: 17px; height: 17px; border-radius: 50%; }
.pnew { background: var(--mint, #e2f6ef); color: #1d6a58; border-radius: 999px; padding: 4px 10px; font-size: 12.5px; font-weight: 800; }
.pcard h3 { font-size: 17.5px; line-height: 1.25; transition: color 0.25s ease; }
.pcard:hover h3 { color: var(--primary); }
.pcard .psub { font-size: 13px; color: var(--text-light); font-weight: 700; margin-top: 2px; }

.cta-inline { grid-column: 1 / -1; }
.cta-band.slim { padding: 46px 8%; }

.grid-loading { text-align: center; font-size: 14.5px; font-weight: 700; color: var(--text-light); padding: 26px 0 6px; display: none; }
.grid-loading.on { display: block; animation: fade-in 0.3s ease; }
.grid-empty { text-align: center; color: var(--text-light); padding: 40px 0; display: none; font-weight: 600; }
.grid-empty.on { display: block; }

@media (max-width: 1020px) {
  .pgrid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 860px) {
  .ftab-bar { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 12px; }
  .ftab-drop { position: fixed; left: 4%; right: 4%; min-width: 0; max-height: 55vh; }
  .pgrid { grid-template-columns: repeat(2, 1fr); gap: 34px 16px; }
}
@media (max-width: 640px) {
  .grid-toolbar { flex-direction: column; align-items: stretch; }
  .grid-sort { width: 100%; }
}
</style>

  <!-- ================= Category filter tabs ================= -->
  <div class="container">
    <div class="ftab-bar" id="ftab-bar">
      <div class="ftab-wrap">
        <button class="ftab active" data-cat="all">
          <span class="ft-count"><?php echo $totalItems; ?></span>
          <span class="ft-name">All</span>
        </button>
      </div>
<?php foreach ($CATALOG as $slug => $cat) : ?>
      <div class="ftab-wrap">
        <button class="ftab" data-cat="<?php echo $slug; ?>">
          <span class="ft-count"><img src="<?php echo $catIcon[$slug]; ?>" alt=""><?php echo count($cat['items']); ?></span>
          <span class="ft-name"><?php echo htmlspecialchars($cat['name']); ?></span>
        </button>
        <button class="ft-caret" type="button" aria-expanded="false" aria-label="Show <?php echo htmlspecialchars($cat['name']); ?> sessions">▾</button>
        <div class="ftab-drop">
          <button class="fd-row" data-cat="<?php echo $slug; ?>">
            <img src="<?php echo $catIcon[$slug]; ?>" alt="">
            <span class="fd-name">All <?php echo htmlspecialchars($cat['name']); ?></span>
            <span class="fd-count"><?php echo dummy_count($cat['name']) * 3; ?></span>
            <span class="fd-new">+<?php echo dummy_new($cat['name']) + 1; ?></span>
          </button>
<?php foreach ($cat['items'] as $item => $itemEmoji) : ?>
          <button class="fd-row" data-cat="<?php echo $slug; ?>" data-item="<?php echo htmlspecialchars($item); ?>">
            <img src="<?php echo svg_data($itemEmoji, $cat['c1'], $cat['c2']); ?>" alt="">
            <span class="fd-name"><?php echo htmlspecialchars($item); ?></span>
            <span class="fd-count"><?php echo dummy_count($item); ?></span>
<?php if (dummy_new($item) > 0) : ?>
            <span class="fd-new">+<?php echo dummy_new($item); ?></span>
<?php endif; ?>
          </button>
<?php endforeach; ?>
        </div>
      </div>
<?php endforeach; ?>
    </div>

    <!-- ================= Breadcrumb ================= -->
    <div class="crumb-bar">
      <a href="index.php">Home</a>
      <span class="sep">›</span>
      <span class="here">Activities</span>
    </div>
  </div>

  <!-- ================= Page heading + intro ================= -->
  <section class="section-tight" style="padding-top: 12px;">
    <div class="container">
      <h1 style="font-size: clamp(30px, 4vw, 46px); font-weight: 800; margin-bottom: 16px;">Enriching Lives Through <span style="color: var(--primary);">Meaningful Engagements!</span></h1>
      <div style="max-width: 880px;">
        <p>Growing older is not about slowing down—it's about embracing new opportunities, nurturing relationships, and finding joy in everyday moments. Our elder engagement activities are thoughtfully designed to promote physical wellness, mental stimulation, emotional well-being, and meaningful social connections.</p>
        <p style="margin-top: 12px;">Whether it's discovering a new hobby, reconnecting with old passions, or simply sharing laughter with friends, each activity encourages seniors to remain active, confident, and connected to the community.</p>
        <p style="margin-top: 12px; font-family: var(--font-display); font-weight: 700; color: var(--navy);">With The Jollity Events, it is more than just a pastime—it's an opportunity to laugh, learn, connect, and create lasting memories!</p>
      </div>

      <!-- ================= Section heading ================= -->
      <div class="section-head" style="margin: 34px auto 6px;">
        <h2>Explore Each Category <span class="hl" style="color: var(--primary);">in Detail</span></h2>
      </div>

      <!-- ================= Sort toolbar ================= -->
      <div class="grid-toolbar">
        <select class="grid-sort" id="grid-sort" aria-label="Sort activities">
          <option value="new">What's New</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>

      <!-- ================= Activity grid ================= -->
      <div class="pgrid" id="pgrid">
<?php
$i = 0;
foreach ($CATALOG as $slug => $cat) :
    foreach ($cat['items'] as $item => $itemEmoji) :
        $i++;
?>
        <a class="pcard" href="register.php?activity=<?php echo urlencode($cat['name']); ?>"
           data-cat="<?php echo $slug; ?>" data-title="<?php echo htmlspecialchars(strtolower($item)); ?>">
          <div class="pimg"><img src="<?php echo svg_data($itemEmoji, $cat['c1'], $cat['c2']); ?>" alt="<?php echo htmlspecialchars($item); ?>" loading="lazy"></div>
          <div class="badge-row">
            <span class="pcount"><img src="<?php echo $catIcon[$slug]; ?>" alt=""><?php echo dummy_count($item); ?></span>
<?php if (dummy_new($item) > 0) : ?>
            <span class="pnew">+<?php echo dummy_new($item); ?></span>
<?php endif; ?>
          </div>
          <h3><?php echo htmlspecialchars($item); ?></h3>
          <div class="psub"><?php echo htmlspecialchars($cat['name']); ?></div>
        </a>
<?php
        /* CTA band woven into the grid after the first 8 cards, like the reference */
        if ($i === 8) :
?>
        <div class="cta-inline" id="cta-inline">
          <div class="cta-band slim">
            <h2>Ready to join or want to explore first?</h2>
            <p>Enrol your Parents and Grand-parents for Home or Group sessions with our trained and thoughtful artists.</p>
            <div class="hero-cta">
              <a href="register.php" class="btn btn-accent">Register Now</a>
              <a href="contact.php" class="btn btn-outline">Enquire Us</a>
            </div>
          </div>
        </div>
<?php endif; ?>
<?php endforeach; endforeach; ?>
      </div>

      <div class="grid-empty" id="grid-empty">No activities found in this category.</div>
      <div class="grid-loading" id="grid-loading">Loading more posts…</div>
    </div>
  </section>

  <!-- ================= CTA band ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="cta-band reveal">
        <h2>With The Jollity Events, it's an opportunity to laugh, learn, connect, and create lasting memories!</h2>
        <div class="hero-cta">
          <a href="register.php" class="btn btn-accent">Register Now</a>
          <a href="contact.php" class="btn btn-outline">Enquire Us</a>
        </div>
      </div>
    </div>
  </section>

<script>
/* ================= Activities page behaviour (self-contained) ================= */
(function () {
  var pgrid = document.getElementById("pgrid");
  if (!pgrid) return;

  var cards = Array.prototype.slice.call(pgrid.querySelectorAll(".pcard"));
  var band = document.getElementById("cta-inline");
  var sortSel = document.getElementById("grid-sort");
  var loading = document.getElementById("grid-loading");
  var empty = document.getElementById("grid-empty");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".ftab"));
  var BATCH = 12;
  var state = { cat: "all", sort: "new", shown: BATCH };
  var pending = false;

  cards.forEach(function (c, i) { c.dataset.index = i; });

  function applyGrid() {
    var list = cards.filter(function (c) { return state.cat === "all" || c.dataset.cat === state.cat; });
    if (state.sort === "az") list.sort(function (a, b) { return a.dataset.title.localeCompare(b.dataset.title); });
    else if (state.sort === "za") list.sort(function (a, b) { return b.dataset.title.localeCompare(a.dataset.title); });
    else list.sort(function (a, b) { return a.dataset.index - b.dataset.index; });

    cards.forEach(function (c) { c.classList.add("hide"); });
    var visible = list.slice(0, state.shown);
    visible.forEach(function (c, i) {
      c.classList.remove("hide");
      c.style.order = i * 2;
    });
    /* keep the inline CTA band after the 8th visible card, like the reference */
    if (band) band.style.order = visible.length >= 8 ? 15 : visible.length * 2 + 1;
    if (empty) empty.classList.toggle("on", list.length === 0);
    pending = list.length > state.shown;
    if (loading) loading.classList.toggle("on", pending);
  }

  var moreObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && pending) {
        pending = false;
        setTimeout(function () {
          state.shown += BATCH;
          applyGrid();
        }, 450);
      }
    });
  }, { rootMargin: "220px" });
  if (loading) moreObserver.observe(loading);

  function selectCat(cat) {
    state.cat = cat;
    state.shown = BATCH;
    tabs.forEach(function (t) { t.classList.toggle("active", t.dataset.cat === cat); });
    applyGrid();
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectCat(t.dataset.cat); });
  });

  /* Dropdowns open on caret icon click (one at a time) */
  function closeDrops() {
    document.querySelectorAll(".ftab-wrap.open").forEach(function (w) {
      w.classList.remove("open");
      var caret = w.querySelector(".ft-caret");
      if (caret) caret.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".ft-caret").forEach(function (caret) {
    caret.addEventListener("click", function (e) {
      e.stopPropagation();
      var wrap = caret.closest(".ftab-wrap");
      var wasOpen = wrap.classList.contains("open");
      closeDrops();
      if (wasOpen) return;
      wrap.classList.add("open");
      caret.setAttribute("aria-expanded", "true");

      var drop = wrap.querySelector(".ftab-drop");
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

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".ftab-wrap")) closeDrops();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrops();
  });

  document.querySelectorAll(".fd-row").forEach(function (row) {
    row.addEventListener("click", function () {
      closeDrops();
      selectCat(row.dataset.cat);
      var item = row.dataset.item;
      if (item) {
        state.shown = cards.length;
        applyGrid();
        var target = null;
        cards.forEach(function (c) {
          if (!target && !c.classList.contains("hide") && c.querySelector("h3").textContent === item) target = c;
        });
        if (target) setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "center" }); }, 120);
      }
    });
  });

  if (sortSel) {
    sortSel.addEventListener("change", function () {
      state.sort = sortSel.value;
      state.shown = BATCH;
      applyGrid();
    });
  }

  /* Deep links (#music-movement etc.) select the matching category tab */
  function applyCatalogHash() {
    var id = window.location.hash.replace("#", "");
    if (id && tabs.some(function (t) { return t.dataset.cat === id; })) selectCat(id);
  }
  window.addEventListener("hashchange", applyCatalogHash);
  applyGrid();
  applyCatalogHash();
})();
</script>

<?php include 'includes/footer.php'; ?>
