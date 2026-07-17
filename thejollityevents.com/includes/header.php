<?php
/**
 * Shared site header — The Jollity Events
 *
 * Set these variables before including this file:
 *   $pageTitle — full <title> text for the page
 *   $pageDesc  — meta description
 *   $active    — nav highlight key: activities | calendar | jollies | moments | about
 */
$pageTitle = isset($pageTitle) ? $pageTitle : 'The Jollity Events';
$pageDesc  = isset($pageDesc)  ? $pageDesc  : 'Senior engagement activities and community programs — Connecting, Engaging, Empowering… Our Seniors!';
$active    = isset($active)    ? $active    : '';

function nav_active(string $key, string $active): string
{
    return $active === $key ? ' class="active"' : '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($pageTitle); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($pageDesc); ?>">
  <link rel="icon" type="image/svg+xml" href="assets/favicon1.svg.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- ================= Header ================= -->
  <header class="site-header">
    <div class="container">
      <nav class="nav-bar">
       <a href="index.php" class="brand">
                <img src="assets/img/logo-jollity.png" alt="The Jollity Events Logo" class="logo" style="height: 50px; width: auto;">
            </a>
        <ul class="nav-links">
          <li class="nav-item-drop">
            <a href="activities.php"<?php echo nav_active('activities', $active); ?>>Programs <span class="nd-caret">▾</span></a>
            <div class="nav-drop">
              <a href="activities.php">All Programs</a>
              <a href="program-art-craft.php">Art &amp; Craft</a>
              <a href="program-hobbies-recreation.php">Hobbies &amp; Recreation</a>
              <a href="program-cognitive-games.php">Cognitive Games</a>
              <a href="program-music-movement.php">Music &amp; Movement</a>
              <a href="program-mindfulness.php">Mindfulness</a>
              <a href="program-social-jollies.php">Social Jollies</a>
              <a href="program-digital-literacy.php">Digital Literacy</a>
              <a href="program-one-on-one.php">One-on-One</a>
            </div>
          </li>
          <li><a href="calendar.php"<?php echo nav_active('calendar', $active); ?>>Calendar</a></li>
          <li><a href="our-jollies.php"<?php echo nav_active('jollies', $active); ?>>Our Jollies</a></li>
          <li><a href="happy-moments.php"<?php echo nav_active('moments', $active); ?>>Happy Moments</a></li>
          <li><a href="about.php"<?php echo nav_active('about', $active); ?>>About Us</a></li>
          <li class="mobile-cta">
            <!--<a href="contact.php" class="btn btn-primary btn-sm">Enquire Us</a>-->
            <a href="register.php" class="btn btn-accent btn-sm">Register Now</a>
          </li>
        </ul>
        <div class="nav-actions">
          <!--<button class="search-btn" data-open-search aria-label="Search">🔍</button>-->
          <!--<a href="contact.php" class="btn btn-primary btn-sm">Enquire Us</a>-->
          <a href="register.php" class="btn btn-accent btn-sm">Register Now</a>
          <button class="nav-toggle" aria-label="Open menu"><span></span><span></span><span></span></button>
        </div>
      </nav>
    </div>
  </header>

  <!-- ================= Search overlay ================= -->
  <div class="search-overlay" id="search-overlay">
    <div class="search-panel">
      <input id="search-input" type="text" placeholder="Search activities, programs, pages…" aria-label="Search">
      <div class="search-results" id="search-results"></div>
    </div>
  </div>
