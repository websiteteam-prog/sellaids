<?php
$pageTitle = 'Programs — The Jollity Events';
$pageDesc  = 'Enriching Lives Through Meaningful Engagements! Explore our Programs: Art & Craft, Hobbies & Recreation, Cognitive Games, Music & Movement, Mindfulness, Social Jollies, Digital Literacy and One-on-One.';
$active    = 'activities';
include 'includes/header.php';
include 'includes/programs-data.php';
?>

  <!-- ================= Page hero ================= -->
  <div class="container">
    <section class="page-hero has-deco">
      <span class="deco deco-ring" style="top: 18%; left: 6%;"></span>
      <span class="deco deco-zig" style="bottom: 20%; right: 7%;"></span>
      <span class="crumb">Programs</span>
      <h1>Enriching Lives Through Meaningful Engagements!</h1>
      <p>Growing older is not about slowing down—it's about embracing new opportunities, nurturing relationships, and finding joy in everyday moments.</p>
    </section>
  </div>

  <!-- ================= Intro ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="section-head reveal" style="max-width: 900px;">
        <p style="font-size: 19.5px;">Whether it's discovering a new hobby, reconnecting with old passions, or simply sharing laughter with friends, each program encourages seniors to remain active, confident, and connected to the community.</p>
        <p style="margin-top: 14px; font-family: var(--font-display); font-weight: 700; color: var(--navy); font-size: 22px;">With The Jollity Events, it is more than just a pastime—it's an opportunity to laugh, learn, connect, and create lasting memories!</p>
      </div>
    </div>
  </section>

  <!-- ================= Program category cards ================= -->
  <section class="section has-deco" style="padding-top: 10px;">
    <span class="deco deco-dot" style="top: 6%; left: 3%;"></span>
    <span class="deco deco-plus" style="top: 12%; right: 4%;">+</span>
    <span class="deco deco-blob" style="bottom: 8%; left: 5%;"></span>
    <div class="container">
      <div class="pcat-grid">
<?php
$d = 0;
foreach ($PROGRAMS as $slug => $prog) :
    $count = count($prog['items']);
    $countLabel = $slug === 'one-on-one' ? 'Personalised' : $count . ' sessions';
    $delay = $d % 4 === 0 ? '' : ' reveal-d' . ($d % 4);
    $d++;
?>
        <a class="pcat-card <?php echo $prog['tint']; ?> reveal<?php echo $delay; ?>" href="program-<?php echo $slug; ?>.php">
          <div class="pcat-img"><img src="<?php echo $prog['icon']; ?>" alt="<?php echo htmlspecialchars($prog['name']); ?>"></div>
          <h3><?php echo htmlspecialchars($prog['name']); ?></h3>
          <span class="pcat-count"><?php echo $countLabel; ?></span><br>
          <span class="pcat-link">View Program →</span>
        </a>
<?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ================= CTA band ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="cta-band reveal">
        <h2>With The Jollity Events, it's an opportunity to laugh, learn, connect, and create lasting memories!</h2>
        <div class="hero-cta">
          <a href="register.php" class="btn btn-accent">Register Now</a>
        </div>
      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
