<?php
$pageTitle = 'Activities — The Jollity Events';
$pageDesc  = 'Enriching Lives Through Meaningful Engagements! Explore Art & Craft, Hobbies & Recreation, Cognitive Games, Music & Movement, Mindfulness, Social Jollies, Digital Literacy and One-on-One programs.';
$active    = 'activities';
include 'includes/header.php';

/* ------------------------------------------------------------------
   Activity catalogue — categories, sub-activities and dummy counts.
   Images live in assets/img/ as act-<slug>.svg placeholders.
   ------------------------------------------------------------------ */
function slugify(string $name): string
{
    return trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($name)), '-');
}

/* Stable dummy counts until real session data is available */
function dummy_count(string $name): int { return (crc32($name) % 90) + 8; }
function dummy_new(string $name): int   { return crc32($name) % 5; }

$CATALOG = [
    'art-craft' => ['name' => 'Art & Craft', 'img' => 'cat-art-craft.svg', 'items' => [
        'Fun Painting', 'Creative crafts', 'Clay modelling', 'Collage-making',
        'Scrapbooking', 'Gratitude tree', 'Small DIY projects', 'Reminiscence and Memory Boxes',
    ]],
    'hobbies-recreation' => ['name' => 'Hobbies & Recreation', 'img' => 'cat-hobbies.svg', 'items' => [
        'Therapeutic Colouring', 'Drawing Activities', 'Reading', 'Writing & Journaling',
        'Story Telling', 'Indoor Herb Gardens', 'Dancing', 'Engaging Art', 'Knitting and Crafting',
    ]],
    'cognitive-games' => ['name' => 'Cognitive Games', 'img' => 'cat-cognitive.svg', 'items' => [
        'Memory boosters', 'Decision making games', 'Strategy thinking games',
        'Brain Stimulating activities', 'Visual games', 'Comforting activities',
        'Treat Trolley', 'Physical Recreation',
    ]],
    'music-movement' => ['name' => 'Music & Movement', 'img' => 'cat-music.svg', 'items' => [
        'Karaoke', 'Charades', 'Interactive sing-alongs', 'Listening Sessions', 'Jamming',
        'Musical Bingo', 'Props dancing', 'Musical games', 'Learn musical instrument',
    ]],
    'mindfulness' => ['name' => 'Mindfulness', 'img' => 'cat-mindfulness.svg', 'items' => [
        'Meditation & Mindfulness', 'Yoga', 'Gentle Stretching', 'Easy Sit-down Exercises',
    ]],
    'social-jollies' => ['name' => 'Social Jollies', 'img' => 'cat-social.svg', 'items' => [
        'Book Club', 'Photo Sharing Circle', 'Reading club', 'Reminiscence Group',
        'Culinary Adventures', 'Garden Club',
    ]],
    'digital-literacy' => ['name' => 'Digital Literacy', 'img' => 'cat-digital.svg', 'items' => [
        'Security & Safety', 'Essential Skills', 'Entertainment & Hobbies', 'AI-powered tools',
    ]],
    'one-on-one' => ['name' => 'One-on-One', 'img' => 'cat-one-on-one.svg', 'items' => [
        'One-on-one visits',
    ]],
];

$totalItems = 0;
foreach ($CATALOG as $cat) {
    $totalItems += count($cat['items']);
}
?>

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
          <span class="ft-count"><img src="assets/img/<?php echo $cat['img']; ?>" alt=""><?php echo count($cat['items']); ?></span>
          <span class="ft-name"><?php echo htmlspecialchars($cat['name']); ?></span>
        </button>
        <button class="ft-caret" type="button" aria-expanded="false" aria-label="Show <?php echo htmlspecialchars($cat['name']); ?> sessions">▾</button>
        <div class="ftab-drop">
          <button class="fd-row" data-cat="<?php echo $slug; ?>">
            <img src="assets/img/<?php echo $cat['img']; ?>" alt="">
            <span class="fd-name">All <?php echo htmlspecialchars($cat['name']); ?></span>
            <span class="fd-count"><?php echo dummy_count($cat['name']) * 3; ?></span>
            <span class="fd-new">+<?php echo dummy_new($cat['name']) + 1; ?></span>
          </button>
<?php foreach ($cat['items'] as $item) : ?>
          <button class="fd-row" data-cat="<?php echo $slug; ?>" data-item="<?php echo htmlspecialchars($item); ?>">
            <img src="assets/img/act-<?php echo slugify($item); ?>.svg" alt="">
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
        <h2>Explore Each Category <span class="hl">in Detail</span></h2>
      </div>

      <!-- ================= Sort toolbar ================= -->
      <div class="grid-toolbar" style="justify-content: flex-end;">
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
    foreach ($cat['items'] as $item) :
        $i++;
?>
        <a class="pcard" href="register.php?activity=<?php echo urlencode($cat['name']); ?>"
           data-cat="<?php echo $slug; ?>" data-title="<?php echo htmlspecialchars(strtolower($item)); ?>">
          <div class="pimg"><img src="assets/img/act-<?php echo slugify($item); ?>.svg" alt="<?php echo htmlspecialchars($item); ?>" loading="lazy"></div>
          <div class="badge-row">
            <span class="pcount"><img src="assets/img/<?php echo $cat['img']; ?>" alt=""><?php echo dummy_count($item); ?></span>
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

<?php include 'includes/footer.php'; ?>
