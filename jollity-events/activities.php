<?php
$pageTitle = 'Activities — The Jollity Events';
$pageDesc  = 'Enriching Lives Through Meaningful Engagements! Explore Art & Craft, Hobbies & Recreation, Cognitive Games, Music & Movement, Mindfulness, Social Jollies, Digital Literacy and One-on-One programs.';
$active    = 'activities';
include 'includes/header.php';
?>

  <!-- ================= Page hero ================= -->
  <div class="container">
    <section class="page-hero">
      <span class="crumb">Activities</span>
      <h1>Enriching Lives Through Meaningful Engagements!</h1>
      <p>Inspiring active minds, joyful hearts, and purposeful living!</p>
    </section>
  </div>

  <!-- ================= Horizontal category strip ================= -->
  <div class="container">
    <div class="cat-strip" aria-label="Activity categories">
      <a class="strip-item" href="#art-craft"><img src="assets/img/cat-art-craft.svg" alt="">Art &amp; Craft</a>
      <a class="strip-item" href="#hobbies-recreation"><img src="assets/img/cat-hobbies.svg" alt="">Hobbies &amp; Recreation</a>
      <a class="strip-item" href="#cognitive-games"><img src="assets/img/cat-cognitive.svg" alt="">Cognitive Games</a>
      <a class="strip-item" href="#music-movement"><img src="assets/img/cat-music.svg" alt="">Music &amp; Movement</a>
      <a class="strip-item" href="#mindfulness"><img src="assets/img/cat-mindfulness.svg" alt="">Mindfulness</a>
      <a class="strip-item" href="#social-jollies"><img src="assets/img/cat-social.svg" alt="">Social Jollies</a>
      <a class="strip-item" href="#digital-literacy"><img src="assets/img/cat-digital.svg" alt="">Digital Literacy</a>
      <a class="strip-item" href="#one-on-one"><img src="assets/img/cat-one-on-one.svg" alt="">One-on-One</a>
    </div>
  </div>

  <!-- ================= Page content ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="section-head reveal" style="max-width: 860px;">
        <p>Growing older is not about slowing down—it's about embracing new opportunities, nurturing relationships, and finding joy in everyday moments. Our elder engagement activities are thoughtfully designed to promote physical wellness, mental stimulation, emotional well-being, and meaningful social connections.</p>
        <br>
        <p>Whether it's discovering a new hobby, reconnecting with old passions, or simply sharing laughter with friends, each activity encourages seniors to remain active, confident, and connected to the community.</p>
        <br>
        <p style="font-family: var(--font-display); font-weight: 700; color: var(--navy); font-size: 19px;">With The Jollity Events, it is more than just a pastime—it's an opportunity to laugh, learn, connect, and create lasting memories!</p>
      </div>
    </div>
  </section>

  <!-- ================= Category dropdowns ================= -->
  <section class="section" style="padding-top: 10px;">
    <div class="container">
      <div class="acc-list">

        <div class="acc-item reveal" id="art-craft">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-art-craft.svg" alt="">
            <span class="acc-title">
              <h3>Art &amp; Craft</h3>
              <span>8 creative sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Fun Painting</span>
                <span class="chip">Creative crafts</span>
                <span class="chip">Clay modelling</span>
                <span class="chip">Collage-making</span>
                <span class="chip">Scrapbooking</span>
                <span class="chip">Gratitude tree</span>
                <span class="chip">Small DIY projects</span>
                <span class="chip">Reminiscence and Memory Boxes</span>
              </div>
              <p class="acc-note">Ready to get creative? <a href="register.php?activity=Art+%26+Craft">Register for Art &amp; Craft →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="hobbies-recreation">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-hobbies.svg" alt="">
            <span class="acc-title">
              <h3>Hobbies &amp; Recreation</h3>
              <span>Hobbies / Recreation / Jollies — 9 sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Therapeutic Colouring</span>
                <span class="chip">Drawing Activities</span>
                <span class="chip">Reading</span>
                <span class="chip">Writing &amp; Journaling</span>
                <span class="chip">Story Telling</span>
                <span class="chip">Indoor Herb Gardens</span>
                <span class="chip">Dancing</span>
                <span class="chip">Engaging Art</span>
                <span class="chip">Knitting and Crafting</span>
              </div>
              <p class="acc-note">Rediscover an old passion. <a href="register.php?activity=Hobbies+%26+Recreation">Register for Hobbies &amp; Recreation →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="cognitive-games">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-cognitive.svg" alt="">
            <span class="acc-title">
              <h3>Cognitive Games</h3>
              <span>8 brain-boosting sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Memory boosters</span>
                <span class="chip">Decision making games</span>
                <span class="chip">Strategy thinking games</span>
                <span class="chip">Brain Stimulating activities</span>
                <span class="chip">Visual games</span>
                <span class="chip">Comforting activities</span>
                <span class="chip">Treat Trolley</span>
                <span class="chip">Physical Recreation</span>
              </div>
              <p class="acc-note">Keep the mind sharp and smiling. <a href="register.php?activity=Cognitive+Games">Register for Cognitive Games →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="music-movement">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-music.svg" alt="">
            <span class="acc-title">
              <h3>Music &amp; Movement</h3>
              <span>9 joyful sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Karaoke</span>
                <span class="chip">Charades</span>
                <span class="chip">Interactive sing-alongs</span>
                <span class="chip">Listening Sessions</span>
                <span class="chip">Jamming</span>
                <span class="chip">Musical Bingo</span>
                <span class="chip">Props dancing</span>
                <span class="chip">Musical games</span>
                <span class="chip">Learn musical instrument</span>
              </div>
              <p class="acc-note">Creating moments of joy through music, laughter, and togetherness! <a href="register.php?activity=Music+%26+Movement">Register for Music &amp; Movement →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="mindfulness">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-mindfulness.svg" alt="">
            <span class="acc-title">
              <h3>Mindfulness</h3>
              <span>4 calming sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Meditation &amp; Mindfulness</span>
                <span class="chip">Yoga</span>
                <span class="chip">Gentle Stretching</span>
                <span class="chip">Easy Sit-down Exercises</span>
              </div>
              <p class="acc-note">Gentle care for body and mind. <a href="register.php?activity=Mindfulness">Register for Mindfulness →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="social-jollies">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-social.svg" alt="">
            <span class="acc-title">
              <h3>Social Jollies</h3>
              <span>6 community sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Book Club</span>
                <span class="chip">Photo Sharing Circle</span>
                <span class="chip">Reading club</span>
                <span class="chip">Reminiscence Group</span>
                <span class="chip">Culinary Adventures</span>
                <span class="chip">Garden Club</span>
              </div>
              <p class="acc-note">Make new friends and share stories. <a href="register.php?activity=Social+Jollies">Register for Social Jollies →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="digital-literacy">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-digital.svg" alt="">
            <span class="acc-title">
              <h3>Digital Literacy</h3>
              <span>4 empowering sessions</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">Security &amp; Safety</span>
                <span class="chip">Essential Skills</span>
                <span class="chip">Entertainment &amp; Hobbies</span>
                <span class="chip">AI-powered tools</span>
              </div>
              <p class="acc-note">Confidence in the digital world. <a href="register.php?activity=Digital+Literacy">Register for Digital Literacy →</a></p>
            </div>
          </div>
        </div>

        <div class="acc-item reveal" id="one-on-one">
          <button class="acc-head" aria-expanded="false">
            <img src="assets/img/cat-one-on-one.svg" alt="">
            <span class="acc-title">
              <h3>One-on-One</h3>
              <span>Personalised companionship</span>
            </span>
            <span class="acc-chevron">▾</span>
          </button>
          <div class="acc-body">
            <div class="acc-body-inner">
              <div class="chip-row">
                <span class="chip">One-on-one visits for many fun &amp; stimulating activities</span>
              </div>
              <p class="acc-note">Personal attention, at their pace. <a href="register.php?activity=One-on-One">Register for One-on-One →</a></p>
            </div>
          </div>
        </div>

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
          <a href="contact.php" class="btn btn-outline">Enquire Us</a>
        </div>
      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
