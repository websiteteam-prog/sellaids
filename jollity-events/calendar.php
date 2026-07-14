<?php
$pageTitle = 'Calendar — The Jollity Events';
$pageDesc  = 'Monthly calendar of senior engagement sessions and celebration ideas by The Jollity Events.';
$active    = 'calendar';
include 'includes/header.php';

$year = (int) date('Y');
$currentMonth = (int) date('n');
$monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
?>

  <!-- ================= Month tab bar ================= -->
  <div class="container">
    <div class="month-bar" id="month-bar">
<?php foreach ($monthNames as $idx => $m) : $n = $idx + 1; ?>
      <button class="month-item<?php echo $n === $currentMonth ? ' active' : ''; ?>" data-month="<?php echo $idx; ?>">
        <span class="m-num"><?php echo $n; ?></span>
        <span class="m-name"><?php echo $m; ?></span>
      </button>
<?php endforeach; ?>
    </div>

    <!-- ================= Breadcrumb ================= -->
    <div class="crumb-bar">
      <a href="index.php">Home</a>
      <span class="sep">›</span>
      <a href="calendar.php">Calendar</a>
      <span class="sep">›</span>
      <span class="here" id="crumb-month"><?php echo date('F'); ?></span>
    </div>
  </div>

  <!-- ================= Month hero ================= -->
  <div class="container">
    <section class="cal-hero">
      <h1 id="cal-month-title"><?php echo date('F'); ?></h1>
      <p class="cal-sub"><span id="cal-year"><?php echo $year; ?></span> Calendar of Jollity sessions and celebration ideas</p>
      <div class="stat-pills">
        <span class="stat-pill"><img src="assets/img/icon-cal.svg" alt=""><span id="cal-ev-count">0</span>&nbsp;Events</span>
        <span class="stat-pill"><img src="assets/img/cat-social.svg" alt="">49 Sessions</span>
        <span class="stat-plus">+ 8</span>
      </div>
    </section>
  </div>

  <!-- ================= Event cards grid ================= -->
  <section class="section-tight" style="padding-top: 0;">
    <div class="container">
      <div class="ev-grid" id="ev-grid"></div>

      <div class="cal-note">
        <img src="assets/img/icon-cal.svg" alt="">
        Sample schedule shown — session timings are confirmed on registration.
        <a href="register.php" style="font-weight:700;">Register Now</a>
      </div>
    </div>
  </section>

  <!-- ================= CTA band ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="cta-band reveal">
        <h2>Creating moments of joy through music, laughter, and togetherness!</h2>
        <p>Enrol your Parents and Grand-parents for Home or Group sessions with our trained and thoughtful artists.</p>
        <div class="hero-cta">
          <a href="register.php" class="btn btn-accent">Register Now</a>
          <a href="contact.php" class="btn btn-outline">Enquire Us</a>
        </div>
      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
