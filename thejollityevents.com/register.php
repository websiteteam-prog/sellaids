<?php
$pageTitle = 'Register Now — The Jollity Events';
$pageDesc  = 'Register your senior for The Jollity Events engagement programs — home or group sessions across Mumbai.';
$active    = '';
include 'includes/header.php';
?>

  <!-- ================= Page hero ================= -->
  <div class="container">
    <section class="page-hero">
      <span class="crumb">Register Now</span>
      <h1>Join Our Jolly Community!</h1>
      <p>Bringing joy, purpose, and companionship to their Golden Years!</p>
    </section>
  </div>

  <!-- ================= Form ================= -->
  <section class="section-tight">
    <div class="container">
      <div class="form-layout">

        <div class="form-card reveal">
          <h2>Register Now</h2>
          <p>Tell us a little about your senior and we'll match them with the perfect sessions.</p>

          <div class="form-success" id="form-success">
            🎉 Thank you! Your registration has been received. Our team will reach out to you shortly.
          </div>

          <form id="register-form" novalidate>
            <div class="form-grid">

              <div class="field">
                <label for="enrolling-for">Enrolling for <span class="req">*</span></label>
                <select id="enrolling-for" name="enrolling-for" required>
                  <option value="">Select</option>
                  <option>Self</option>
                  <option>Parent</option>
                  <option>Grandparent</option>
                </select>
              </div>

              <div class="field">
                <label for="senior-name">Senior's name <span class="req">*</span></label>
                <input type="text" id="senior-name" name="senior-name" placeholder="Full name" required>
              </div>

              <div class="field">
                <label for="age">Age <span class="req">*</span></label>
                <input type="text" id="age" name="age" inputmode="numeric" placeholder="e.g. 68" required>
              </div>

              <div class="field">
                <label for="mobile">Mobile <span class="req">*</span></label>
                <input type="tel" id="mobile" name="mobile" inputmode="tel" placeholder="10-digit mobile number" required>
              </div>

              <div class="field">
                <label for="area">Area <span class="req">*</span></label>
                <select id="area" name="area" required>
                  <option value="">Select area (Mumbai)</option>
                  <option>Andheri</option>
                  <option>Bandra</option>
                  <option>Borivali</option>
                  <option>Byculla</option>
                  <option>Chembur</option>
                  <option>Colaba</option>
                  <option>Dadar</option>
                  <option>Ghatkopar</option>
                  <option>Goregaon</option>
                  <option>Juhu</option>
                  <option>Kandivali</option>
                  <option>Khar</option>
                  <option>Kurla</option>
                  <option>Lower Parel</option>
                  <option>Malad</option>
                  <option>Matunga</option>
                  <option>Mulund</option>
                  <option>Navi Mumbai</option>
                  <option>Powai</option>
                  <option>Santacruz</option>
                  <option>Sion</option>
                  <option>Thane</option>
                  <option>Vile Parle</option>
                  <option>Wadala</option>
                  <option>Worli</option>
                  <option>Other</option>
                </select>
              </div>

              <div class="field">
                <label for="activity">Choose Activity <span class="req">*</span></label>
                <select id="activity" name="activity" required>
                  <option value="">Select activity</option>
                </select>
              </div>

              <div class="field full">
                <label for="session">Choose Session <span class="req">*</span></label>
                <select id="session" name="session" required disabled>
                  <option value="">Choose an activity first</option>
                </select>
              </div>

              <div class="field full">
                <label for="interests">Senior's interests</label>
                <input type="text" id="interests" name="interests" placeholder="e.g. music, gardening, old films…">
              </div>

              <div class="field full">
                <label for="reason">Reason for enrolling</label>
                <input type="text" id="reason" name="reason" placeholder="What are you hoping the sessions bring?">
              </div>

              <div class="field full">
                <label for="hobbies">Any old/new hobbies or interests</label>
                <input type="text" id="hobbies" name="hobbies" placeholder="Hobbies they love or would like to try">
              </div>

              <div class="field">
                <label for="mode">Preferable mode of the sessions <span class="req">*</span></label>
                <select id="mode" name="mode" required>
                  <option value="">Select mode</option>
                  <option>Group</option>
                  <option>One-on-One</option>
                </select>
              </div>

              <div class="field">
                <label for="food">Food Preference (Please specify) <span class="req">*</span></label>
                <select id="food" name="food" required>
                  <option value="">Select preference</option>
                  <option>Jain</option>
                  <option>Veg</option>
                </select>
              </div>

              <div class="field full">
                <label for="medical">Any Medical Condition or Allergies (please specify)</label>
                <textarea id="medical" name="medical" placeholder="Please share anything we should know to care better"></textarea>
              </div>

              <div class="field full">
                <label for="helper">Any Helper needed/accompanying?</label>
                <input type="text" id="helper" name="helper" placeholder="e.g. Yes — caretaker will accompany">
              </div>

            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">OK</button>
              <button type="button" class="btn btn-ghost" id="form-cancel">Cancel</button>
              <button type="submit" class="btn btn-accent">Join Our Community</button>
            </div>

            <p class="form-note">Fields marked <span class="req">*</span> are required. Your details stay private and are used only to plan the best sessions for your senior.</p>
          </form>
        </div>

        <aside class="side-card reveal reveal-d1">
          <h3>Every smile is celebrated 💛</h3>
          <p>Be part of this welcoming community where every smile is celebrated, every story is valued, and every senior is empowered to live with confidence, purpose, and belonging.</p>
          <ul class="mini-list">
            <li><span class="dot">🏡</span> Home or Group sessions</li>
            <li><span class="dot">🎨</span> 8 activity categories to choose from</li>
            <li><span class="dot">🤝</span> Trained and thoughtful artists</li>
            <li><span class="dot">📍</span> Sessions across Mumbai</li>
            <li><span class="dot">🎉</span> A community that feels like family</li>
          </ul>
        </aside>

      </div>
    </div>
  </section>

<?php include 'includes/footer.php'; ?>
