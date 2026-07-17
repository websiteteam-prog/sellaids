# The Jollity Events — Senior Engagement Website (PHP)

A modern, responsive, informational website for **The Jollity Events** — senior
engagement activities and community programs. Built in PHP with a shared
header/footer via `include`.

> Connecting, Engaging, Empowering… Our Seniors!

## Structure

Every page sets its title/description/active-nav variables, then includes the
shared header and footer:

```php
<?php
$pageTitle = 'Activities — The Jollity Events';
$pageDesc  = '…';
$active    = 'activities';
include 'includes/header.php';
?>
… page content …
<?php include 'includes/footer.php'; ?>
```

| Page | File | Description |
|---|---|---|
| Home | `index.php` | Hero, Golden Years panel, Activities focus areas, Activities & Programs grid |
| Activities | `activities.php` | Horizontal category strip + expandable dropdowns for all 8 categories |
| Calendar | `calendar.php` | Interactive monthly calendar with sample sessions |
| Our Jollies | `our-jollies.php` | The artists & facilitators behind the sessions |
| Happy Moments | `happy-moments.php` | Photo gallery |
| About Us | `about.php` | Mission + guiding captions |
| Contact | `contact.php` | Enquiry form + contact details |
| Testimonials | `testimonials.php` | Community stories (sample) |
| Register | `register.php` | Full registration form with dependent Activity → Session dropdown |
| Shared header | `includes/header.php` | `<head>`, navigation bar, search overlay |
| Shared footer | `includes/footer.php` | Footer links + scripts (`© <?php echo date('Y'); ?>`) |

## Features

- Fully responsive (desktop / tablet / mobile) with a mobile slide-down menu
- Sticky pill navigation bar with scroll shrink
- Site-wide **search overlay** (🔍) indexing every page, category and session
- Smooth scroll-reveal animations, hover lifts, floating hero elements
- Activities page **accordions** that auto-open from search / deep links (`#music-movement`)
- Register form with **dependent dropdown** — Sessions list updates based on the chosen Activity
  (also pre-selectable via `register.php?activity=Art+%26+Craft`)
- Mumbai area dropdown, Jain/Veg food preference, Group/One-on-One mode — all fields per spec
- Interactive calendar with month navigation and sample events
- Shared header/footer via PHP `include` — edit the nav or footer once in `includes/`
- No frameworks, no build step — PHP + CSS + vanilla JS

## Images

All images are **local SVG placeholders** in `assets/img/` (gradient + emoji).
To use real photos later, simply replace the files keeping the same names
(e.g. `cat-art-craft.svg` → your photo, or update the `src` in the page).

## Run locally

Requires PHP (any recent version). Serve the folder:

```bash
cd jollity-events
php -S localhost:8080
# → http://localhost:8080
```

Or drop the folder into any PHP hosting (Apache/Nginx + PHP, XAMPP, cPanel —
`index.php` is picked up automatically).

## Customising

- **Colors / fonts** — edit the CSS variables at the top of `css/style.css` (`:root { … }`)
- **Activities & sessions** — edit the `ACTIVITIES` object at the top of `js/main.js`
  (drives the register form dropdown and the search index)
- **Calendar events** — edit `SAMPLE_EVENTS` in `js/main.js`
