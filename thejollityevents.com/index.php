<?php
$pageTitle = 'The Jollity Events — Connecting, Engaging, Empowering Our Seniors!';
$pageDesc  = 'Senior engagement programs and community experiences. Enrol your parents and grandparents for home or group sessions with our trained and thoughtful artists.';
$active    = '';
include 'includes/header.php';
?>

  <!-- ================= Hero (split: content + tall image) ================= -->
  <section class="hero">
    <div class="container">
      <div class="hero-panel split">
        <div>
          <div class="hero-chips">
            <span class="hero-chip">✿ Connecting</span>
            <span class="hero-chip">☀ Engaging</span>
            <span class="hero-chip">♥ Empowering</span>
          </div>
          <h1>Connecting, Engaging, <span class="hl">Empowering</span> Our Seniors!</h1>
          <p class="hero-lead">At the Jollity Events, we believe that every stage of life deserves joy, purpose, and meaningful engagements. Our programs are designed to help Seniors stay active, social, creative, and Jolly through a variety of enriching activities and community experiences.</p>
          <p class="hero-sub">Say goodbye to boredom, loneliness, anxiety and help your Seniors explore new interests, make new friends, stay physically active, or simply enjoy their favourite hobbies in the form of our thoughtfully curated Engagement programs.</p>
          <div class="hero-cta">
            <a href="register.php" class="btn btn-accent">Register Today</a>
            <a href="activities.php" class="btn btn-outline">Explore Programs</a>
          </div>
        </div>
        <div class="hero-figure">
          <!-- Tall happy-elders image: replace src with the final AI-generated Indian grandparents photo -->
          <img class="hero-tall" src="assets/img/elder1.jpg" alt="Happy senior couple enjoying life">
          <div class="hero-float f1"><img src="assets/img/elder2.jpg" alt="">Home &amp; Group Sessions</div>
          <div class="hero-float f2"><img src="assets/img/elder3.jpg" alt="">Trained &amp; Thoughtful Artists</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= Golden Years (typographic, no box) ================= -->
  <section class="has-deco">
    <span class="deco deco-ring" style="top: 14%; left: 5%;"></span>
    <span class="deco deco-dot" style="top: 60%; left: 9%;"></span>
    <span class="deco deco-blob" style="top: 20%; right: 6%;"></span>
    <span class="deco deco-zig" style="bottom: 16%; right: 9%;"></span>
    <div class="container">
      <div class="golden-type reveal">
        <div class="gt-kicker">Home &amp; Group Sessions</div>
        <h2>Make the <span class="hl-accent">Golden years</span> the life's most <span class="hl-primary">rewarding years!</span></h2>
        <p class="gt-enrol">Enrol your <span class="hl-primary">Parents</span> and <span class="hl-primary">Grand-parents</span> for Home or Group sessions with our trained and thoughtful artists.</p>
        <p class="gt-sub">Every smile celebrated, every story valued.</p>
        <div class="pointer-row">
          <span class="pointer-pill p1"><img src="images/activities/fun-painting.jpg" alt="">Thoughtfully curated programs</span>
          <span class="pointer-pill p2"><img src="assets/img/jollies.jpg" alt="">Home or Group sessions</span>
          <span class="pointer-pill p3"><img src="assets/img/one-o-one.jpg" alt="">Trained artists</span>
          <span class="pointer-pill p4"><img src="assets/img/social_connection.jpg" alt="">A joyful community</span>
        </div>
        <a href="register.php" class="btn btn-accent">Register Today →</a>
      </div>
    </div>
  </section>

  <!-- ================= Programs (bigger, bright image cards) ================= -->
  <section class="section has-deco" style="padding-top: 20px;">
    <span class="deco deco-plus" style="top: 60px; right: 4%;">+</span>
    <span class="deco deco-dot" style="bottom: 10%; left: 3%;"></span>
    <div class="container">
      <div class="section-head reveal">
        <span class="section-eyebrow">Programs</span>
        <h2>Explore Our <span class="hl">Programs</span></h2>
        <p>Thoughtfully curated programs for every interest — pick a favourite or discover a brand-new passion.</p>
      </div>
      <div class="prog-grid">
        <a class="prog-card reveal" href="program-art-craft.php">
          <img src="images/activities/art-craft.jpg" alt="Art & Craft">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Art &amp; Craft</h3><span class="prog-meta">8 sessions</span></div>
        </a>
        <a class="prog-card reveal reveal-d1" href="program-hobbies-recreation.php">
          <img src="images/activities/hobbies-recreation.jpg" alt="Hobbies & Recreation">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Hobbies &amp; Recreation</h3><span class="prog-meta">9 sessions</span></div>
        </a>
        <a class="prog-card reveal reveal-d2" href="program-cognitive-games.php">
          <img src="images/activities/cognitive-games.jpg" alt="Cognitive Games">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Cognitive Games</h3><span class="prog-meta">8 sessions</span></div>
        </a>
        <a class="prog-card reveal reveal-d3" href="program-music-movement.php">
          <img src="images/activities/music-movement.jpg" alt="Music & Movement">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Music &amp; Movement</h3><span class="prog-meta">9 sessions</span></div>
        </a>
        <a class="prog-card reveal" href="program-mindfulness.php">
          <img src="images/activities/mindfulness.jpg" alt="Mindfulness">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Mindfulness</h3><span class="prog-meta">4 sessions</span></div>
        </a>
        <a class="prog-card reveal reveal-d1" href="program-social-jollies.php">
          <img src="images/activities/social-jollies.jpg" alt="Social Jollies">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Social Jollies</h3><span class="prog-meta">6 sessions</span></div>
        </a>
        <a class="prog-card reveal reveal-d2" href="program-digital-literacy.php">
          <img src="images/activities/digital-literacy.jpg" alt="Digital Literacy">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>Digital Literacy</h3><span class="prog-meta">4 sessions</span></div>
        </a>
        <a class="prog-card reveal reveal-d3" href="program-one-on-one.php">
          <img src="images/activities/one-on-one.jpg" alt="One-on-One">
          <span class="prog-go">→</span>
          <div class="prog-overlay"><h3>One-on-One</h3><span class="prog-meta">Personalised</span></div>
        </a>
      </div>
    </div>
  </section>

  <!-- ================= Complete Platform (big icon tiles) ================= -->
  <section class="section has-deco" style="padding-top: 30px;">
    <span class="deco deco-ring" style="top: 40px; left: 4%;"></span>
    <span class="deco deco-zig" style="top: 70px; right: 5%;"></span>
    <div class="container">
      <div class="section-head reveal">
        <span class="section-eyebrow">Why The Jollity Events</span>
        <h2>Your Complete Platform for <span class="hl">Elderly Engagement</span></h2>
        <p>The Jollity Events are dedicated to enhancing the well-being and quality of life of seniors through thoughtfully designed Engagement programs.</p>
      </div>
      <div class="plat-grid">
        <div class="plat-tile t1 reveal">
          <img src="assets/img/social_connection.jpg" alt="Social Connection">
          <h3>Social Connection</h3>
          <p>New friendships, shared laughter and warm community meets.</p>
        </div>
        <div class="plat-tile t2 reveal reveal-d1">
          <img src="assets/img/game.jpg" alt="Mental Stimulation">
          <h3>Mental Stimulation</h3>
          <p>Games and challenges that keep minds sharp and curious.</p>
        </div>
        <div class="plat-tile t3 reveal reveal-d2">
          <img src="assets/img/dance.jpg" alt="Physical Wellness">
          <h3>Physical Wellness</h3>
          <p>Gentle movement, dance and exercise for every ability.</p>
        </div>
        <div class="plat-tile t4 reveal">
          <img src="assets/img/creative-expression.jpg" alt="Creative Expression">
          <h3>Creative Expression</h3>
          <p>Art, craft and music that bring out the inner artist.</p>
        </div>
        <div class="plat-tile t5 reveal reveal-d1">
          <img src="assets/img/lifelong.jpg" alt="Lifelong Learning">
          <h3>Lifelong Learning</h3>
          <p>New skills — from digital tools to brand-new hobbies.</p>
        </div>
        <div class="plat-tile t6 reveal reveal-d2">
          <img src="assets/img/emtional.jpg" alt="Emotional Well-being">
          <h3>Emotional Well-being</h3>
          <p>Companionship and care that nurture happy hearts.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= CTA band ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="cta-band reveal">
        <h2>Bringing joy, purpose, and companionship to their Golden Years!</h2>
        <p>Be part of this welcoming community where every smile is celebrated, every story is valued, and every senior is empowered to live with confidence, purpose, and belonging.</p>
        <div class="hero-cta">
          <a href="register.php" class="btn btn-accent">Register Now</a>
        </div>
      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
