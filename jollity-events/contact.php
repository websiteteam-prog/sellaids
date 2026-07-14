<?php
$pageTitle = 'Contact — The Jollity Events';
$pageDesc  = 'Contact The Jollity Events — enquire about senior engagement sessions in Mumbai.';
$active    = '';
include 'includes/header.php';
?>

  <!-- ================= Page hero ================= -->
  <div class="container">
    <section class="page-hero">
      <span class="crumb">Contact</span>
      <h1>Enquire Us</h1>
      <p>Every question is welcome — just like every senior.</p>
    </section>
  </div>

  <section class="section-tight">
    <div class="container">
      <div class="contact-layout">
        <div class="contact-info-card reveal">
          <h3>We'd love to hear from you 💙</h3>
          <div class="contact-line">
            <span class="ico">📍</span>
            <div><strong>Visit us</strong><span>Mumbai, Maharashtra, India</span></div>
          </div>
          <div class="contact-line">
            <span class="ico">📞</span>
            <div><strong>Call us</strong><span>+91 XXXXX XXXXX</span></div>
          </div>
          <div class="contact-line">
            <span class="ico">✉️</span>
            <div><strong>Email us</strong><span>hello@thejollityevents.com</span></div>
          </div>
          <div class="contact-line">
            <span class="ico">🕘</span>
            <div><strong>Hours</strong><span>Mon – Sat, 9:00 AM – 7:00 PM</span></div>
          </div>
        </div>

        <div class="form-card reveal reveal-d1">
          <h2>Enquire Us</h2>
          <p>Have a question about our sessions, areas or artists? Send us a note.</p>
          <div class="form-success" id="enquiry-success">💌 Thank you! Your enquiry has been received — we'll get back to you soon.</div>
          <form id="enquiry-form" novalidate>
            <div class="form-grid">
              <div class="field">
                <label for="enq-name">Your name <span class="req">*</span></label>
                <input type="text" id="enq-name" name="enq-name" placeholder="Full name" required>
              </div>
              <div class="field">
                <label for="enq-mobile">Mobile <span class="req">*</span></label>
                <input type="tel" id="enq-mobile" name="enq-mobile" placeholder="10-digit mobile number" required>
              </div>
              <div class="field full">
                <label for="enq-email">Email</label>
                <input type="email" id="enq-email" name="enq-email" placeholder="you@example.com">
              </div>
              <div class="field full">
                <label for="enq-msg">Your message <span class="req">*</span></label>
                <textarea id="enq-msg" name="enq-msg" placeholder="Tell us how we can help…" required></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Send Enquiry</button>
            </div>
          </form>
        </div>
      </div>
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
