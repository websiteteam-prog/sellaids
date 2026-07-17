<?php
/**
 * Shared Program detail page template.
 * Each program-<slug>.php sets $programSlug and includes this file.
 * Full page content is yet to be shared by the client — for now each
 * page shows a short intro + sub-category icons, as requested.
 */
include 'includes/programs-data.php';

if (!isset($programSlug) || !isset($PROGRAMS[$programSlug])) {
    header('Location: activities.php');
    exit;
}
$prog = $PROGRAMS[$programSlug];

$pageTitle = $prog['name'] . ' — Programs — The Jollity Events';
$pageDesc  = $prog['name'] . ' program by The Jollity Events: ' . $prog['tagline'];
$active    = 'activities';
include 'includes/header.php';
?>

  <!-- ================= Program hero ================= -->
  <div class="container">
    <section class="prog-hero has-deco" style="background: <?php echo $prog['grad']; ?>;">
      <span class="deco deco-ring" style="top: 16%; left: 6%; border-color: rgba(255,255,255,0.7);"></span>
      <span class="deco deco-dot" style="bottom: 18%; right: 7%; background: rgba(255,255,255,0.5);"></span>
      <img class="ph-img" src="<?php echo $prog['icon']; ?>" alt="<?php echo htmlspecialchars($prog['name']); ?>">
      <h1><?php echo htmlspecialchars($prog['name']); ?></h1>
      <p><?php echo htmlspecialchars($prog['tagline']); ?></p>
    </section>
  </div>

  <!-- ================= Breadcrumb ================= -->
  <div class="container">
    <div class="crumb-bar">
      <a href="index.php">Home</a>
      <span class="sep">›</span>
      <a href="activities.php">Programs</a>
      <span class="sep">›</span>
      <span class="here"><?php echo htmlspecialchars($prog['name']); ?></span>
    </div>
  </div>

  <!-- ================= Sub-categories ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="section-head reveal">
        <h2>Inside this <span class="hl">Program</span></h2>
      </div>
      <div class="subchip-grid">
<?php $d = 0; foreach ($prog['items'] as $item => $img) : $delay = $d % 3 === 0 ? '' : ' reveal-d' . ($d % 3); $d++; ?>
        <div class="subchip reveal<?php echo $delay; ?>">
          <img src="<?php echo $img; ?>" alt="<?php echo htmlspecialchars($item); ?>">
          <span><?php echo htmlspecialchars($item); ?></span>
        </div>
<?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ================= CTA ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="cta-band slim reveal">
        <h2>Ready to bring <?php echo htmlspecialchars($prog['name']); ?> home?</h2>
        <p>Enrol your Parents and Grand-parents for Home or Group sessions with our trained and thoughtful artists.</p>
        <div class="hero-cta">
          <a href="register.php?activity=<?php echo urlencode($prog['name']); ?>" class="btn btn-accent">Register Now</a>
        </div>
      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
