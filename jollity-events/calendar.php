<?php
$pageTitle = 'Calendar — The Jollity Events';
$pageDesc  = 'Monthly calendar of senior engagement activities by The Jollity Events.';
$active    = 'calendar';
include 'includes/header.php';
?>

  <!-- ================= Page hero ================= -->
  <div class="container">
    <section class="page-hero">
      <span class="crumb">Calendar</span>
      <h1>Our Activity Calendar</h1>
      <p>Creating moments of joy through music, laughter, and togetherness!</p>
    </section>
  </div>

  <section class="section-tight">
    <div class="container">
      <div class="cal-card reveal">
        <div class="cal-top">
          <h2 id="cal-title">Month</h2>
          <div class="cal-nav">
            <button id="cal-prev" aria-label="Previous month">‹</button>
            <button id="cal-next" aria-label="Next month">›</button>
          </div>
        </div>
        <div class="cal-grid" id="cal-grid"></div>
        <div class="cal-legend">
          <span><i style="background:#5b7cfa"></i> Art &amp; Craft</span>
          <span><i style="background:#f0850f"></i> Music &amp; Social</span>
          <span><i style="background:#2fa985"></i> Mindfulness</span>
          <span><i style="background:#d757a2"></i> Clubs &amp; Learning</span>
        </div>
      </div>
      <p style="text-align:center; margin-top:18px; color:var(--text-light); font-size:14.5px;">Sample schedule shown — session timings are confirmed on registration.</p>
    </div>
  </section>

  <!-- ================= CTA band ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="cta-band reveal">
        <h2>Make the Golden years the life's most rewarding years!</h2>
        <p>Enrol your Parents and Grand-parents for Home or Group sessions with our trained and thoughtful artists.</p>
        <div class="hero-cta">
          <a href="register.php" class="btn btn-accent">Register Now</a>
          <a href="contact.php" class="btn btn-outline">Enquire Us</a>
        </div>
      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
