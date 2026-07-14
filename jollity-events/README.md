# The Jollity Events — Senior Engagement Website

A modern, responsive, informational website for **The Jollity Events** — senior
engagement activities and community programs.

> Connecting, Engaging, Empowering… Our Seniors!

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, Golden Years panel, Activities focus areas, Activities & Programs grid |
| Activities | `activities.html` | Horizontal category strip + expandable dropdowns for all 8 categories |
| Calendar | `calendar.html` | Interactive monthly calendar with sample sessions |
| Our Jollies | `our-jollies.html` | The artists & facilitators behind the sessions |
| Happy Moments | `happy-moments.html` | Photo gallery |
| About Us | `about.html` | Mission + guiding captions |
| Contact | `contact.html` | Enquiry form + contact details |
| Testimonials | `testimonials.html` | Community stories (sample) |
| Register | `register.html` | Full registration form with dependent Activity → Session dropdown |

## Features

- Fully responsive (desktop / tablet / mobile) with a mobile slide-down menu
- Sticky pill navigation bar with scroll shrink
- Site-wide **search overlay** (🔍) indexing every page, category and session
- Smooth scroll-reveal animations, hover lifts, floating hero elements
- Activities page **accordions** that auto-open from search / deep links (`#music-movement`)
- Register form with **dependent dropdown** — Sessions list updates based on the chosen Activity
  (also pre-selectable via `register.html?activity=Art+%26+Craft`)
- Mumbai area dropdown, Jain/Veg food preference, Group/One-on-One mode — all fields per spec
- Interactive calendar with month navigation and sample events
- Zero build step — pure HTML/CSS/JS, no frameworks

## Images

All images are **local SVG placeholders** in `assets/img/` (gradient + emoji).
To use real photos later, simply replace the files keeping the same names
(e.g. `cat-art-craft.svg` → your photo, or update the `src` in the HTML).

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
cd jollity-events
python3 -m http.server 8080
# → http://localhost:8080
```

## Customising

- **Colors / fonts** — edit the CSS variables at the top of `css/style.css` (`:root { … }`)
- **Activities & sessions** — edit the `ACTIVITIES` object at the top of `js/main.js`
  (drives the register form dropdown and the search index)
- **Calendar events** — edit `SAMPLE_EVENTS` in `js/main.js`
