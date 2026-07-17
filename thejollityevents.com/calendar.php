<?php
$pageTitle = 'Calendar — The Jollity Events';
$pageDesc  = 'Monthly calendar of senior engagement activities by The Jollity Events.';
$active    = 'calendar';
include 'includes/header.php';

/* ---------------------------------------------------------
   MONTH DATA
   Add / edit events for each month here. Only months with
   events in the array will show cards; others show a
   "coming soon" placeholder automatically.
---------------------------------------------------------- */
$months = [
    1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
    5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
    9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
];

// category => colour (keep in sync with legend below)
$categories = [
    'Art & Craft'        => '#5b7cfa',
    'Music & Social'      => '#f0850f',
    'Mindfulness'         => '#2fa985',
    'Clubs & Learning'    => '#d757a2',
];

$events = [
    7 => [ // JULY
        ['day' => 1,  'weekday' => 'Wed', 'title' => 'July Kickoff Sing-Along',      'cat' => 'Music & Social',   'icon' => '🎤', 'activities' => 12],
        ['day' => 1,  'weekday' => 'Wed', 'title' => 'Watercolour Wednesday',        'cat' => 'Art & Craft',      'icon' => '🎨', 'activities' => 18],
        ['day' => 3,  'weekday' => 'Fri', 'title' => 'Laughter Yoga Morning',        'cat' => 'Mindfulness',      'icon' => '😄', 'activities' => 9],
        ['day' => 4,  'weekday' => 'Sat', 'title' => 'Book Club Meet-up',            'cat' => 'Clubs & Learning', 'icon' => '📚', 'activities' => 7],
        ['day' => 4,  'weekday' => 'Sat', 'title' => 'Independence Day Tea Party',   'cat' => 'Music & Social',   'icon' => '🎉', 'activities' => 21],
        ['day' => 7,  'weekday' => 'Tue', 'title' => 'Chocolate Tasting Social',     'cat' => 'Music & Social',   'icon' => '🍫', 'activities' => 15],
        ['day' => 10, 'weekday' => 'Fri', 'title' => 'Garden Mindfulness Walk',      'cat' => 'Mindfulness',      'icon' => '🌿', 'activities' => 11],
        ['day' => 14, 'weekday' => 'Tue', 'title' => 'Craft Corner: Paper Quilling', 'cat' => 'Art & Craft',      'icon' => '✂️', 'activities' => 14],
        ['day' => 19, 'weekday' => 'Sun', 'title' => 'Ice Cream Social',             'cat' => 'Music & Social',   'icon' => '🍦', 'activities' => 8],
        ['day' => 23, 'weekday' => 'Thu', 'title' => 'Memory Lane Music Hour',       'cat' => 'Music & Social',   'icon' => '🎶', 'activities' => 19],
        ['day' => 25, 'weekday' => 'Sat', 'title' => 'Mindful Breathing Circle',     'cat' => 'Mindfulness',      'icon' => '🧘', 'activities' => 10],
        ['day' => 30, 'weekday' => 'Thu', 'title' => 'Friendship Day Celebration',   'cat' => 'Clubs & Learning', 'icon' => '🤝', 'activities' => 22],
    ],
];

/* Selected month via ?m=7, defaults to current real-world month */
$currentMonth = isset($_GET['m']) ? (int)$_GET['m'] : (int)date('n');
if ($currentMonth < 1 || $currentMonth > 12) { $currentMonth = 7; }
$monthName   = $months[$currentMonth];
$monthEvents = $events[$currentMonth] ?? [];
$eventCount  = count($monthEvents);
$activityTotal = array_sum(array_column($monthEvents, 'activities'));
?>
<style>
  .cal-months{display:flex;gap:6px;overflow-x:auto;padding:14px;background:#fff;border-radius:16px;box-shadow:0 2px 10px rgba(20,30,60,.06);margin-bottom:34px;}
  .cal-months a{flex:1 0 64px;text-align:center;text-decoration:none;color:#22314f;padding:10px 6px;border-radius:12px;font-weight:600;font-size:14px;transition:.15s;}
  .cal-months a small{display:block;font-weight:500;color:#8b93a7;font-size:11px;margin-bottom:2px;}
  .cal-months a.active{background:#5b7cfa;color:#fff;}
  .cal-months a.active small{color:#e4e9ff;}
  .cal-months a:hover:not(.active){background:#f0f3ff;}

  .cal-hero{text-align:center;padding:6px 10px 30px;}
  .cal-hero h1{font-size:44px;font-weight:800;color:#1c2b4a;margin:0 0 6px;}
  .cal-hero p{color:#5b6c8f;font-size:15.5px;margin:0 0 18px;}
  .cal-stats{display:inline-flex;align-items:center;gap:14px;background:#eef2ff;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;color:#2b3a5e;}
  .cal-stats .pill{background:#fff;padding:6px 14px;border-radius:999px;box-shadow:0 1px 4px rgba(20,30,60,.08);}
  .cal-stats .badge-green{background:#d7f5e9;color:#1a7a56;border-radius:999px;padding:4px 10px;font-size:13px;}

  .cal-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;}
  @media (max-width:980px){.cal-cards{grid-template-columns:repeat(2,1fr);}}
  @media (max-width:560px){.cal-cards{grid-template-columns:1fr;}}

  .ev-card{text-align:center;}
  .ev-circle{width:150px;height:150px;border-radius:50%;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:56px;box-shadow:0 6px 18px rgba(20,30,60,.10);}
  .ev-meta{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;}
  .ev-date{background:#eef2ff;color:#2b3a5e;font-weight:700;font-size:13px;border-radius:10px;padding:6px 10px;line-height:1.1;}
  .ev-date span{display:block;font-size:16px;}
  .ev-cat{background:#eef2ff;color:#2b3a5e;font-size:12px;font-weight:600;border-radius:999px;padding:5px 10px;}
  .ev-title{font-weight:700;color:#1c2b4a;font-size:16.5px;margin:0;}

  .cal-empty{grid-column:1/-1;text-align:center;padding:50px 10px;color:#8b93a7;font-size:15px;}

  .cal-legend{display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin-top:40px;font-size:13.5px;color:#5b6c8f;}
  .cal-legend span{display:flex;align-items:center;gap:6px;}
  .cal-legend i{width:10px;height:10px;border-radius:50%;display:inline-block;}
</style>

<div class="container">
  <section class="page-hero" style="padding-bottom:0;">
    <span class="crumb">Calendar</span>
  </section>

  <!-- Month tab strip -->
  <nav class="cal-months">
    <?php foreach ($months as $num => $name): ?>
      <a href="?m=<?php echo $num; ?>"
         class="<?php echo $num === $currentMonth ? 'active' : ''; ?>">
        <small><?php echo $num; ?></small><?php echo substr($name, 0, 3); ?>
      </a>
    <?php endforeach; ?>
  </nav>

  <!-- Month hero -->
  <section class="cal-hero reveal">
    <h1><?php echo htmlspecialchars($monthName); ?></h1>
    <p>2026 activity calendar — music, laughter and togetherness every day.</p>
    <div class="cal-stats">
      <span class="pill">📅 <?php echo $eventCount; ?> Events</span>
      <span><?php echo $activityTotal; ?> Programs</span>
      <?php if ($eventCount): ?><span class="badge-green">+<?php echo min(31, $activityTotal); ?></span><?php endif; ?>
    </div>
  </section>

  <!-- Event cards -->
  <section class="cal-cards reveal">
    <?php if ($monthEvents): ?>
      <?php foreach ($monthEvents as $ev):
        $color = $categories[$ev['cat']] ?? '#5b7cfa';
      ?>
        <div class="ev-card">
          <div class="ev-circle" style="background:<?php echo $color; ?>22;">
            <?php echo $ev['icon']; ?>
          </div>
          <div class="ev-meta">
            <span class="ev-date"><?php echo $ev['weekday']; ?><span><?php echo str_pad($ev['day'], 2, '0', STR_PAD_LEFT); ?></span></span>
            <span class="ev-cat" style="background:<?php echo $color; ?>22;color:<?php echo $color; ?>;">
              <?php echo htmlspecialchars($ev['cat']); ?>
            </span>
          </div>
          <p class="ev-title"><?php echo htmlspecialchars($ev['title']); ?></p>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <div class="cal-empty">Events for <?php echo htmlspecialchars($monthName); ?> are coming soon — check back shortly!</div>
    <?php endif; ?>
  </section>

  <!-- Legend -->
  <div class="cal-legend">
    <?php foreach ($categories as $name => $color): ?>
      <span><i style="background:<?php echo $color; ?>"></i> <?php echo htmlspecialchars($name); ?></span>
    <?php endforeach; ?>
  </div>

  <p style="text-align:center; margin-top:22px; color:var(--text-light); font-size:14.5px;">
    Sample schedule shown — session timings are confirmed on registration.
  </p>
</div>

<!-- ================= CTA band ================= -->
<section class="section-tight">
  <div class="container">
    <div class="cta-band reveal">
      <h2>Make the Golden years the life's most rewarding years!</h2>
      <p>Enrol your Parents and Grand-parents for Home or Group sessions with our trained and thoughtful artists.</p>
      <div class="hero-cta">
        <a href="register.php" class="btn btn-accent">Register Now</a>
        <!--<a href="contact.php" class="btn btn-outline">Enquire Us</a>-->
      </div>
    </div>
  </div>
</section>
<?php include 'includes/footer.php'; ?>