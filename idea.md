# 🎬 MANVIR SINGH — NETFLIX PORTFOLIO
## Complete Master Idea Document

> **Project:** Netflix-inspired Developer Portfolio  
> **Stack:** Express.js · Tailwind CSS · Vanilla JS · Node.js  
> **Theme:** Every pixel, interaction, and flow modeled after Netflix  
> **Goal:** A recruiter/developer/friend opens this and says "wait... is this Netflix?"

---

## TABLE OF CONTENTS

1. [Vision & Concept](#1-vision--concept)
2. [Current State Audit](#2-current-state-audit)
3. [Complete File Structure](#3-complete-file-structure)
4. [Data Architecture — content.json](#4-data-architecture--contentjson)
5. [Page-by-Page Redesign Plan](#5-page-by-page-redesign-plan)
6. [Upload & Edit Flow — Admin Dashboard](#6-upload--edit-flow--admin-dashboard)
7. [Display Process — How Data Reaches Screen](#7-display-process--how-data-reaches-screen)
8. [Netflix Design System](#8-netflix-design-system)
9. [Component Library](#9-component-library)
10. [Interactions & Animations](#10-interactions--animations)
11. [Server-Side Changes](#11-server-side-changes)
12. [Feature Checklist](#12-feature-checklist)
13. [Build Order](#13-build-order)

---

## 1. Vision & Concept

### The Core Idea
This portfolio is a Netflix streaming platform — but instead of movies and TV shows, the "content" is **projects, skills, and career milestones**. Every person who visits gets a personalized experience based on which "profile" (year/persona) they select.

### The Metaphor Map

| Netflix World | Portfolio World |
|---|---|
| Streaming platform | Portfolio showcase |
| Movie / TV Show | Individual project |
| Genre row | Project category / year |
| Maturity rating | Difficulty level (Beginner / Advanced) |
| "Top 10 in your country" | Top skills / featured work |
| "Continue Watching" | Pinned / featured projects |
| User profile (family member) | Year profile (2023 / 2024 / 2025) |
| "Because you watched X" | "More Like This" recommendations |
| Director credits | Contributor credits |
| Trailer on hover | Project GIF / video preview on hover |
| Synopsis | Project description |
| Cast | Technologies used |
| Runtime | Time to build |
| Release date | Year completed |
| Streaming quality (HD/4K) | Project status (Live / In Dev / Archived) |

### Who Uses It & How

```
RECRUITER visits → selects "Recruiter" profile → sees curated rows of best work
                → clicks project → reads description, tech stack, live demo
                → downloads resume → done

DEVELOPER visits → selects "Developer" profile → sees all technical projects
                 → clicks project → reads tech details, GitHub link
                 → checks skills page → sees proficiency bars

FRIEND visits → selects any year → sees timeline of projects
              → enjoys the Netflix-like experience → impressed
```

---

## 2. Current State Audit

### What Already Works ✅
- Profile gate (index.html) — "Who's watching?" screen with year avatars
- Browse page (browse.html) — horizontal rows with project cards
- Hero slideshow — auto-cycles project images every 5 seconds
- Project detail modal — opens on card click with tech, links
- Skills page (skills.html) — animated progress bars by category
- About page (about.html) — timeline, profile pic, social links, resume download
- Admin dashboard (admin.html) — tabbed interface to edit all content
- Data persistence — content.json read/written by Express server
- Resume upload — multer uploads PDF to public/uploads/
- Profile filtering — rows shown based on profileIds array
- Navbar scroll effect — transparent → black after 50px scroll
- GitHub badge on cards — icon links to repo

### What Is Missing or Broken ❌

**Visual:**
- Font is Inter (too generic) — needs Bebas Neue for headings
- Card hover does not scale like Netflix (no 1.3x scale with delay)
- No smart edge detection (left/right card should expand inward, not off-screen)
- Hero gradients are wrong — Netflix uses a specific left-fade + bottom-fade formula
- No loading spinner between page loads
- No noise texture for depth
- No Top-10 row with giant overlaid numbers
- Profile avatars on gate are too small, wrong border style
- No maturity/difficulty badges on cards or hero

**Functional:**
- Search button does nothing
- Bell icon is purely cosmetic
- No toast notifications (uses browser alert() — looks unprofessional)
- Admin forms missing new fields (shortDesc, bannerImage, difficulty, status, year, videoPreview)
- No image URL preview when typing in admin
- No drag-to-reorder for projects or rows
- No row manager (can't add/rename/delete rows from admin)
- No bulk import for projects
- No admin PIN gate (anyone can access /admin.html)
- Resume upload and about resume upload are duplicated in two tabs

**Data:**
- content.json missing: shortDesc, bannerImage, difficulty, status, year, videoPreview, pinnedProject fields
- No backup/export endpoint
- No image upload (must use external URLs)

---

## 3. Complete File Structure

```
portfolio/
│
├── data/
│   └── content.json                ← Single source of truth for ALL content
│
├── public/
│   ├── index.html                  ← Profile gate ("Who's watching?")
│   ├── browse.html                 ← Main browse page (rows + hero)
│   ├── skills.html                 ← Skills with progress bars
│   ├── about.html                  ← About me + timeline + resume
│   ├── admin.html                  ← Admin dashboard
│   │
│   ├── css/
│   │   └── style.css               ← Compiled Tailwind output
│   │
│   ├── js/
│   │   ├── app.js                  ← Browse / Skills / About logic
│   │   └── admin.js                ← Admin CRUD logic
│   │
│   ├── images/
│   │   ├── year_2023.png           ← Profile avatar for 2023
│   │   ├── year_2024.png           ← Profile avatar for 2024
│   │   └── year_2025.png           ← Profile avatar for 2025
│   │
│   └── uploads/
│       ├── resume.pdf              ← Uploaded resume
│       └── images/                 ← NEW: uploaded project images
│
├── src/
│   └── input.css                   ← Tailwind source
│
├── server.js                       ← Express server + API routes
├── package.json
├── tailwind.config.js
└── vercel.json
```

---

## 4. Data Architecture — content.json

### Complete Schema (Current + All New Fields)

```json
{
  "pinnedProject": 101,

  "profiles": [
    {
      "id": 1,
      "name": "2023",
      "avatar": "images/year_2023.png",
      "color": "#E50914"
    }
  ],

  "rows": [
    {
      "title": "2024 Projects",
      "profileIds": [2],
      "style": "standard",
      "items": [
        {
          "id": 101,
          "title": "Full-Stack Web App",

          "image": "https://...",
          "bannerImage": "https://...",
          "videoPreview": "https://...",

          "shortDesc": "One-line teaser shown in hero & card",
          "description": "Full paragraph shown in modal body.",

          "githubUrl": "https://github.com/...",
          "liveUrl": "https://...",

          "technologies": ["React", "Node.js", "MongoDB"],
          "useCases": ["Use case 1", "Use case 2"],
          "futureScope": "Plans for v2.",

          "year": 2024,
          "difficulty": "Advanced",
          "status": "Live",
          "buildTime": "3 weeks",

          "contributors": [
            {
              "name": "Manvir Singh",
              "githubUrl": "https://github.com/manvirsingh",
              "avatar": "https://..."
            }
          ],

          "recommendations": [102, 201]
        }
      ]
    }
  ],

  "skills": [
    {
      "id": 1,
      "name": "JavaScript",
      "level": 90,
      "category": "Frontend",
      "icon": "devicon-javascript-plain"
    }
  ],

  "about": {
    "intro": "Intro paragraph shown on about page.",
    "profilePicture": "https://...",
    "socials": [
      { "platform": "GitHub", "url": "https://..." },
      { "platform": "LinkedIn", "url": "https://..." },
      { "platform": "Twitter", "url": "https://..." }
    ],
    "timeline": [
      {
        "year": "2025",
        "title": "Senior Engineer",
        "desc": "Description of this milestone.",
        "icon": "💼"
      }
    ]
  },

  "experience": [
    {
      "id": 1,
      "role": "Senior Software Engineer",
      "company": "Tech Corp",
      "duration": "2024 – Present",
      "description": "What I did here.",
      "logo": "https://..."
    }
  ],

  "resumeUrl": "uploads/resume.pdf",
  "resumeFilename": "Manvir_Singh_Resume.pdf"
}
```

### Field Reference Table

| Field | Type | Where Used | Required |
|---|---|---|---|
| `id` | number | Card click → modal lookup | ✅ |
| `title` | string | Card, hero, modal title | ✅ |
| `image` | string URL | Card thumbnail (16:9) | ✅ |
| `bannerImage` | string URL | Hero banner (wide) | No → falls back to `image` |
| `videoPreview` | string URL | Autoplay on card hover | No |
| `shortDesc` | string | Hero subtitle, card tooltip | No |
| `description` | string | Modal body paragraph | No |
| `githubUrl` | string URL | GitHub badge on card + modal | No |
| `liveUrl` | string URL | Live Demo button in modal | No |
| `technologies` | string[] | Pills in modal + card hover | No |
| `useCases` | string[] | List in modal | No |
| `futureScope` | string | Section in modal | No |
| `year` | number | Badge on card and hero | No |
| `difficulty` | enum | Badge: Beginner/Intermediate/Advanced | No |
| `status` | enum | Badge: Live/In Dev/Archived | No |
| `buildTime` | string | Shown in modal meta row | No |
| `contributors` | object[] | Avatars in modal | No |
| `recommendations` | number[] | "More Like This" grid in modal | No |
| `row.style` | enum | standard/top10/featured/continue | No → default standard |

### Row Style Types

| style | What It Looks Like |
|---|---|
| `"standard"` | Normal Netflix row — 280×157 cards in horizontal scroll |
| `"top10"` | Cards have giant semi-transparent numbers (1-10) overlaid behind thumbnail |
| `"featured"` | Larger cards, 340×191, shown first in page |
| `"continue"` | "Continue Watching" style — progress bar overlay at bottom of card |

---

## 5. Page-by-Page Redesign Plan

---

### 5.1 Profile Gate — index.html

**What Netflix's gate looks like:**
- Pure black background (#141414)
- "Who's watching?" — large, thin-weight, white
- Profile avatars: square with rounded corners, ~10vw size (min 84px, max 160px)
- On hover: white border ring appears (2px solid white)
- Username below: gray (#808080) → white on hover
- "Manage Profiles" button: gray border outline, uppercase small text, no fill
- No logo — just the question and profiles

**Changes to make:**

```html
<!-- BEFORE (too small, wrong style) -->
<div class="group flex flex-col items-center gap-2 cursor-pointer w-24 md:w-32">

<!-- AFTER (Netflix exact spec) -->
<div class="profile-card group cursor-pointer flex flex-col items-center gap-3">
  <div class="w-[10vw] min-w-[84px] max-w-[160px] aspect-square rounded
              ring-2 ring-transparent group-hover:ring-white transition-all duration-200 overflow-hidden">
    <img src="..." class="w-full h-full object-cover">
  </div>
  <span class="text-[#808080] group-hover:text-white text-sm md:text-lg font-medium transition-colors">
    2024
  </span>
</div>
```

**Font changes:**
```html
<!-- Replace Inter with -->
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
  .who-heading {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: clamp(2rem, 3.5vw, 3.5rem);
    letter-spacing: -0.02em;
  }
</style>
```

**"Manage Profiles" button style:**
```html
<button class="mt-10 px-6 py-2 text-[#808080] border border-[#808080]
               hover:text-white hover:border-white transition uppercase
               tracking-[0.15em] text-sm font-medium">
  Manage Profiles
</button>
```

---

### 5.2 Browse Page — browse.html

#### 5.2.1 Navbar

**Netflix navbar exact spec:**
- Height: 68px
- Position: fixed, z-index 1000
- Before scroll: `linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, transparent 100%)`
- After scroll (>50px): solid `#141414`
- Logo: `Bebas Neue`, 2.2rem, #E50914, letter-spacing 2px
- Nav links: 0.82rem, font-weight 500, #B3B3B3 → white on hover
- Right side: Search icon → Bell icon → Profile avatar + caret

**Search behavior:**
1. Click search icon → input slides in from right (width: 0 → 260px, transition 0.35s)
2. As user types → search results overlay appears below navbar covering the page
3. Results show as a grid of project thumbnails + titles, filtered in real-time
4. Press Escape or click X → search closes

**Bell icon:**
- Static for now (no real notifications)
- Has a red dot badge to show there's "something new"
- On click → could show a dropdown of recent projects added

**Profile dropdown:**
- Appears on hover (not click) — CSS `:hover` on parent
- Triangle caret pointing up at the top
- Lists: other profiles to switch to → divider → "Manage Profiles" → "Sign out"
- Switching profile: sets localStorage.activeProfile and reloads

#### 5.2.2 Hero Section

**Netflix hero exact spec:**

```
┌─────────────────────────────────────────────────────────────────┐
│ [FULL BLEED IMAGE — 56.25vw height, max 80vh, min 460px]       │
│                                                                   │
│  ████████████████████████████████                LEFT GRADIENT   │
│  ██  [BADGE]  [BADGE]  [BADGE]  ██                               │
│  ██                             ██                               │
│  ██  PROJECT TITLE              ██  → TEXT SITS HERE             │
│  ██  Big, Bebas Neue font       ██                               │
│  ██                             ██                               │
│  ██  Short description, 3 lines ██                               │
│  ██                             ██                               │
│  ██  [▶ View Project] [ⓘ More]  ██                               │
│  ████████████████████████████████                                │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  BOTTOM FADE TO #141414   │
└─────────────────────────────────────────────────────────────────┘
```

**Gradient formulas:**
```css
/* Left fade (most critical) */
background: linear-gradient(
  to right,
  rgba(20,20,20, 0.88) 0%,
  rgba(20,20,20, 0.60) 35%,
  rgba(20,20,20, 0.15) 60%,
  transparent 100%
);

/* Bottom fade (second layer) */
background: linear-gradient(
  to top,
  #141414 0%,
  rgba(20,20,20, 0.5) 20%,
  transparent 50%
);

/* Bottom vignette element (separate div, absolute bottom of hero) */
height: 14.7vw;   /* Netflix's exact proportion */
background: linear-gradient(to top, #141414 0%, transparent 100%);
```

**Badges above the title:**
```html
<div class="hero-badges">
  <span class="badge badge-status-live">Live</span>
  <span class="badge badge-difficulty-advanced">Advanced</span>
  <span class="badge badge-year">2024</span>
</div>
```

**Slideshow logic (app.js update):**
```javascript
const startSlideshow = () => {
  let index = 0;
  let heroProjectId = null;

  const update = () => {
    const item = items[index];
    heroProjectId = item.id;

    // Fade out
    heroImage.style.opacity = '0.3';

    setTimeout(() => {
      // Update all hero elements
      heroImage.src = item.bannerImage || item.image;
      heroTitle.textContent = item.title;
      heroDesc.textContent = item.shortDesc || item.description?.substring(0, 140) + '...';

      // Update badges
      updateHeroBadges(item.status, item.difficulty, item.year);

      // Update GitHub button
      updateHeroGithub(item.githubUrl);

      // Fade in
      heroImage.style.opacity = '1';
    }, 400);

    index = (index + 1) % items.length;
  };

  update();
  setInterval(update, 6000);

  // "More Info" opens modal for currently shown project
  document.getElementById('hero-more-info-btn').onclick = () => {
    if (heroProjectId) openModal(heroProjectId);
  };
};
```

#### 5.2.3 Row Cards

**Netflix card hover spec:**
1. Mouse enters card → wait 280ms delay
2. Card scales from 1.0 → 1.3 (transform: scale(1.3))
3. Below the card, a "hover panel" drops down with:
   - Action buttons row (play, add, like, info)
   - Meta badges (status, difficulty, year)
   - Project title
   - Tech pills (first 3)
4. Left-edge cards expand to the right (transform-origin: left center)
5. Right-edge cards expand to the left (transform-origin: right center)
6. Middle cards expand from center (transform-origin: center center)
7. z-index elevated so card overlaps adjacent cards

**Card HTML structure:**
```html
<div class="project-card" data-id="101">
  <!-- Thumbnail -->
  <img class="card-thumb" src="..." alt="...">

  <!-- GitHub corner badge -->
  <a class="card-github-badge" href="..." target="_blank">...</a>

  <!-- Hover panel (drops below card) -->
  <div class="card-hover-panel">
    <div class="card-actions">
      <div class="left">
        <button class="btn-play">▶</button>
        <button class="btn-add">+</button>
        <button class="btn-like">👍</button>
      </div>
      <button class="btn-info">⌄</button>
    </div>
    <div class="badges">
      <span class="badge-live">Live</span>
      <span class="badge-advanced">Advanced</span>
    </div>
    <div class="card-title">Project Name</div>
    <div class="tech-pills">
      <span>React</span><span>Node.js</span><span>MongoDB</span>
    </div>
  </div>
</div>
```

**Smart edge detection (app.js):**
```javascript
function getCardOrigin(card, rowTrack) {
  const cardRect  = card.getBoundingClientRect();
  const trackRect = rowTrack.getBoundingClientRect();

  const leftEdge  = cardRect.left - trackRect.left < 80;
  const rightEdge = trackRect.right - cardRect.right < 80;

  if (leftEdge)  return 'left center';
  if (rightEdge) return 'right center';
  return 'center center';
}

// Apply on mouseenter (with delay)
card.addEventListener('mouseenter', () => {
  const timeout = setTimeout(() => {
    card.style.transformOrigin = getCardOrigin(card, rowTrack);
    card.classList.add('hovered');
  }, 280);
  card._hoverTimeout = timeout;
});

card.addEventListener('mouseleave', () => {
  clearTimeout(card._hoverTimeout);
  card.classList.remove('hovered');
});
```

#### 5.2.4 Top 10 Row

**How it works:**
- Row with `style: "top10"` gets special rendering
- Each card is wider (320px instead of 280px)
- A giant number is rendered behind the card thumbnail
- Numbers use Bebas Neue, ~9rem, color transparent with 3px stroke

```html
<div class="project-card top10-card" data-rank="1">
  <span class="top10-number">1</span>
  <img class="card-thumb" src="...">
</div>
```

```css
.top10-number {
  position: absolute;
  left: -22px; bottom: -10px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 9rem;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 3px #333;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}
.top10-card .card-thumb {
  position: relative;
  z-index: 1;
  margin-left: 60px;
  width: calc(100% - 60px);
}
```

#### 5.2.5 Project Detail Modal

**Netflix modal exact spec:**
```
┌────────────────────────────────────────────────────────┐
│  [WIDE IMAGE — 16:7 aspect ratio]                      │
│  gradient fades into modal body below                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  BIG PROJECT TITLE  (Bebas Neue, ~2.8rem)             │
│                                                        │
│  97% Match  •  2024  •  [Advanced]  •  [Live]          │
│                                                        │
│  [▶ Live Demo]  [GitHub]                               │
│                                                        │
│  Full description paragraph here. Lorem ipsum dolor   │
│  sit amet, describing what this project does and why  │
│  it was built.                                        │
│                                                        │
│  Technologies                                          │
│  [React] [Node.js] [MongoDB] [Express] [JWT]           │
│                                                        │
│  Use Cases                                             │
│  ▸ Use case one          ▸ Use case two               │
│  ▸ Use case three        ▸ Use case four               │
│                                                        │
│  Future Scope                                          │
│  Plans for v2 go here...                              │
│                                                        │
│  Contributors                                          │
│  [avatar] Manvir Singh                                │
│                                                        │
│  ─────────────────────────────────────────────────    │
│                                                        │
│  More Like This                                        │
│  [thumb] [thumb] [thumb]                               │
│  Title    Title    Title                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Scrollable within 90vh — content can be long, modal scrolls internally**

---

### 5.3 Skills Page — skills.html

**Redesign concept: "Genres" page**

Instead of plain progress bars in a grid, present skills as Netflix "rows":
- Each skill category (Frontend, Backend, DevOps) is a "row"
- Each row title is styled like a Netflix row header
- Skills show as cards with an animated bar

```
Frontend                                          Explore All ›
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  [JS]    │ │  [React] │ │  [CSS]   │ │  [TS]    │
│          │ │          │ │          │ │          │
│ ████████ │ │ ███████  │ │ ██████   │ │ ██████   │
│  90%     │ │  85%     │ │  80%     │ │  78%     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Skill card HTML:**
```html
<div class="skill-card">
  <div class="skill-icon">
    <img src="devicon url or svg" alt="JavaScript">
  </div>
  <div class="skill-name">JavaScript</div>
  <div class="skill-bar-track">
    <div class="skill-bar-fill" style="width:0%" data-level="90"></div>
  </div>
  <div class="skill-level">90%</div>
</div>
```

**Top 10 skills row:**
- The top 10 highest-level skills get a "Top Skills" row rendered with the Top-10 number overlay style

---

### 5.4 About Page — about.html

**Redesign concept: "Behind the Scenes / Creator Profile"**

```
┌────────────────────────────────────────────────────────┐
│  [FULL BLEED PROFILE PHOTO — circular ring around it]  │
│   gradient below                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│              MANVIR SINGH                              │
│         Developer · Creator · Builder                  │
│                                                        │
│    [GitHub]  [LinkedIn]  [Twitter]                     │
│                                                        │
│    [👁 View Resume]   [⬇ Download Resume]              │
│                                                        │
│  ──────────────────────────────────────────────────    │
│                                                        │
│  INTRO TEXT                                            │
│  The about.intro paragraph, styled like a synopsis     │
│                                                        │
│  ──────────────────────────────────────────────────    │
│                                                        │
│  MY JOURNEY  (styled as Netflix episode list)          │
│                                                        │
│  S01E03 · 2025                                         │
│  Senior Engineer                                       │
│  Leading AI integration projects at scale.             │
│                                                        │
│  S01E02 · 2024                                         │
│  Full Stack Developer                                  │
│  Built multiple SaaS products from scratch.            │
│                                                        │
│  S01E01 · 2023                                         │
│  Started Coding                                        │
│  Hello World!                                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Episode-style timeline item:**
```html
<div class="episode-item">
  <div class="episode-label">S01E03 · 2025</div>
  <div class="episode-thumb">
    <!-- Could use a color gradient or icon -->
  </div>
  <div class="episode-content">
    <h3 class="episode-title">Senior Engineer</h3>
    <p class="episode-desc">Leading AI integration projects at scale.</p>
  </div>
</div>
```

---

### 5.5 Admin Dashboard — admin.html

**Complete redesign goal: Professional dark CMS that matches the portfolio theme**

#### PIN Gate
```javascript
// At top of admin.js
const PIN = '1234'; // or read from a config
const entered = localStorage.getItem('admin_pin');
if (entered !== PIN) {
  const guess = prompt('Enter admin PIN:');
  if (guess !== PIN) {
    window.location.href = 'index.html';
  } else {
    localStorage.setItem('admin_pin', PIN);
  }
}
```

#### Tab Structure (updated)

```
[ Projects ] [ Skills ] [ About ] [ Experience ] [ Rows ] [ Settings ]
```

New tabs added:
- **Rows** — Add/rename/delete rows, change row style, reorder rows
- **Settings** — Site name, pinned project, resume URL, social links

#### Project Form — All Fields

When adding or editing a project, the form must have:

| Field | Input Type | Note |
|---|---|---|
| Title | text | Required |
| Thumbnail URL | url + live preview img | Required |
| Banner Image URL | url + live preview img | Falls back to thumbnail |
| Video Preview URL | url | mp4 file URL |
| Short Description | text (1 line) | Used in hero |
| Full Description | textarea | Used in modal |
| GitHub URL | url | Optional |
| Live Demo URL | url | Optional |
| Technologies | tag input (comma-separated) | Pills |
| Use Cases | textarea (one per line) | List items |
| Future Scope | textarea | One paragraph |
| Year | number | 2023/2024/2025 |
| Difficulty | select | Beginner/Intermediate/Advanced |
| Status | select | Live/In Dev/Archived |
| Build Time | text | e.g. "3 weeks" |
| Contributors | JSON textarea | [{name,url,avatar}] |
| Recommendations | comma-separated IDs | "More Like This" |
| Row/Category | select | Which row it belongs to |

#### Live Image Preview
```javascript
// When user types in image URL field, show preview
document.getElementById('p-image').addEventListener('input', function() {
  const preview = document.getElementById('image-preview');
  preview.src = this.value;
  preview.classList.remove('hidden');
});
```

#### Toast Notifications (replace all alert())
```javascript
function toast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `
    <span>${type === 'success' ? '✓' : '✗'}</span>
    <span>${message}</span>
  `;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Usage — replace all alert() calls:
// alert('Saved successfully!') → toast('Saved successfully!', 'success')
// alert('Error saving data.') → toast('Error saving', 'error')
```

#### Row Manager Tab
```html
<!-- For each row in data.rows -->
<div class="row-item draggable" data-id="...">
  <span class="drag-handle">⠿</span>
  <input type="text" value="2024 Projects" class="row-name-input">
  <select class="row-style-select">
    <option value="standard">Standard</option>
    <option value="top10">Top 10</option>
    <option value="featured">Featured</option>
  </select>
  <div class="row-profile-badges">
    <!-- Which profiles see this row -->
    <label><input type="checkbox" value="1"> 2023</label>
    <label><input type="checkbox" value="2"> 2024</label>
    <label><input type="checkbox" value="3"> 2025</label>
  </div>
  <button onclick="deleteRow(id)">Delete</button>
</div>
```

#### Bulk Import
```javascript
// Paste a JSON array of project objects → they all get added to selected row
document.getElementById('bulk-import-btn').onclick = () => {
  const raw = document.getElementById('bulk-json').value;
  try {
    const projects = JSON.parse(raw);
    const rowTitle = document.getElementById('bulk-row-select').value;
    const row = currentData.rows.find(r => r.title === rowTitle);
    projects.forEach(p => {
      p.id = Date.now() + Math.random();
      row.items.push(p);
    });
    saveData();
    toast('Imported ' + projects.length + ' projects', 'success');
  } catch(e) {
    toast('Invalid JSON format', 'error');
  }
};
```

---

## 6. Upload & Edit Flow — Admin Dashboard

### 6.1 Complete Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                           │
│                                                             │
│  USER ACTION        FRONTEND           BACKEND    STORAGE   │
│                                                             │
│  Fill project  →  Collect form    →   POST        content   │
│  form + submit     data into          /api/       .json     │
│                    currentData        content              │
│                    object                                   │
│                                                             │
│  Upload PDF    →  FormData with   →   POST        public/   │
│  resume           resume field        /api/       uploads/  │
│                                       upload      resume.pdf│
│                                                   + updates │
│                                                   content   │
│                                                   .json     │
│                                                             │
│  Upload image  →  FormData with   →   POST        public/   │
│  (NEW)            image field         /api/       uploads/  │
│                                       upload-    images/    │
│                                       image      file.jpg   │
│                                                             │
│  Export data   →  Click button    →   GET         downloads │
│  (NEW)                                /api/       as .json  │
│                                       export               │
│                                                             │
│  Import data   →  Upload .json    →   POST        replaces  │
│  (NEW)                                /api/       content   │
│                                       import     .json      │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Adding a Project — Step by Step

```
1. Open admin.html → Projects tab
2. Fill in "Add New Project" form:
   ├─ Title: "My Weather App"
   ├─ Thumbnail URL: paste image URL → preview appears instantly
   ├─ Banner URL: paste wide image URL → preview appears
   ├─ Short Desc: "Real-time weather with 7-day forecast"
   ├─ GitHub URL: https://github.com/manvir/weather
   ├─ Live URL: https://weather.manvir.dev
   ├─ Category: select "2024 Projects" row
   └─ Click "Add Project"

3. Project appears in "All Projects" list

4. Click "Edit" on the project to open detail editor:
   ├─ Full description (long paragraph)
   ├─ Technologies: React, OpenWeather API, Tailwind
   ├─ Use Cases: Personal use, Travel planning, API demo
   ├─ Future Scope: Add radar maps and alerts
   ├─ Difficulty: Intermediate
   ├─ Status: Live
   ├─ Year: 2024
   ├─ Build Time: 2 weeks
   └─ Click "Save Changes"

5. Saved to content.json via POST /api/content
6. Visible on browse.html immediately (refresh)
```

### 6.3 Editing the About Page

```
Admin → About tab:

PROFILE PICTURE
  - Paste image URL → preview updates → click "Save"
  - OR upload image file → POST /api/upload-image → URL auto-fills

INTRO TEXT
  - Textarea → click "Update Intro"

TIMELINE EVENTS
  - Year + Title + Description → click "Add Event"
  - Existing events listed → click Delete to remove
  - Events render on about.html in reverse-chronological order

SOCIAL LINKS
  - Currently hardcoded in JSON
  - Should have: Platform (select) + URL (text) + Add/Remove

RESUME
  - Upload PDF → POST /api/upload → saves to public/uploads/
  - resumeUrl in content.json updates automatically
  - View/Download buttons appear on about.html
```

### 6.4 Editing Skills

```
Admin → Skills tab:

ADD SKILL
  - Name: "TypeScript"
  - Level: 0-100 (slider + number input)
  - Category: "Frontend" (text input or select from existing categories)
  - Click "Add Skill"

MANAGE SKILLS
  - List of all skills grouped by category
  - Each has: name, level bar preview, delete button
  - Inline edit on click

Skills render on skills.html as horizontal category rows with animated bars
```

---

## 7. Display Process — How Data Reaches Screen

### 7.1 Complete Data Flow

```
data/content.json
       │
       │  fs.readFile()
       ▼
server.js  GET /api/content
       │
       │  JSON response
       ▼
app.js  fetch('/api/content')
       │
       │  DOMContentLoaded
       ▼
  ┌────┴─────────────────────────────────────────────────────────┐
  │                                                              │
  ├── path === '/' or 'index.html'                              │
  │   └── renderProfiles(data.profiles)                         │
  │       ├── Creates avatar divs                               │
  │       ├── Attaches click → localStorage + redirect          │
  │       └── Manage Profiles toggle shows edit overlays        │
  │                                                              │
  ├── path includes 'browse.html'                               │
  │   ├── Read localStorage.activeProfile                       │
  │   ├── Filter rows by profileIds.includes(activeProfile.id) │
  │   ├── Render nav avatar + dropdown                          │
  │   ├── forEach filteredRow → renderRow(row)                  │
  │   │   ├── Creates <section class="row-section">             │
  │   │   ├── Row title + "Explore All" link                    │
  │   │   └── forEach row.items → renderCard(item)              │
  │   │       ├── Creates .project-card div                     │
  │   │       ├── Sets thumbnail, github badge                   │
  │   │       └── Creates .card-hover-panel with buttons        │
  │   ├── Collect all items → possibleHeroItems[]               │
  │   ├── startSlideshow(possibleHeroItems)                     │
  │   │   ├── Picks item → updates hero-image, hero-title...    │
  │   │   ├── Updates badges (status, difficulty, year)         │
  │   │   └── Cycles every 6 seconds                            │
  │   ├── initCardHover() — attach hover delay logic            │
  │   ├── initSearch() — filter rows on input                   │
  │   ├── initModal() — openModal(id) function                  │
  │   │   ├── Finds project by ID across all rows               │
  │   │   ├── Builds modal HTML (title, desc, tech, etc.)       │
  │   │   └── Renders "More Like This" from recommendations[]   │
  │   └── initNavbarScroll() — add .scrolled class              │
  │                                                              │
  ├── path includes 'skills.html'                               │
  │   ├── Group data.skills[] by skill.category                 │
  │   ├── forEach category → renderSkillRow(category, skills)   │
  │   │   ├── Creates row section (like browse rows)            │
  │   │   └── forEach skill → renderSkillCard(skill)            │
  │   │       ├── Icon + name + level bar (starts at 0%)        │
  │   │       └── setTimeout → animates bar to skill.level%     │
  │   └── Build top-skills top10 row (sort by level, take 10)   │
  │                                                              │
  └── path includes 'about.html'                                │
      ├── about.profilePicture → profile pic img                │
      ├── about.intro → intro paragraph                         │
      ├── about.socials[] → social icon links                   │
      ├── resumeUrl → View + Download buttons                   │
      └── about.timeline[] → episode-style list items           │
          (rendered in reverse order, newest first)             │
```

### 7.2 The openModal() Function — Full Logic

```javascript
function openModal(projectId) {
  // 1. Find project
  let project = null;
  for (const row of data.rows) {
    project = row.items.find(i => i.id === projectId);
    if (project) break;
  }
  if (!project) return;

  // 2. Build tech pills HTML
  const techHtml = (project.technologies || [])
    .map(t => `<span class="tech-pill">${t}</span>`).join('');

  // 3. Build use cases HTML (2-column grid)
  const useCasesHtml = (project.useCases || [])
    .map(u => `<li>${u}</li>`).join('');

  // 4. Build contributors HTML
  const contribHtml = (project.contributors || [])
    .map(c => `
      <a href="${c.githubUrl}" class="contributor" target="_blank">
        <img src="${c.avatar}" alt="${c.name}">
        ${c.name}
      </a>
    `).join('');

  // 5. Build "More Like This" grid
  const recsHtml = (project.recommendations || [])
    .map(recId => {
      const rec = findProjectById(recId);
      if (!rec) return '';
      return `
        <div class="more-like-card" onclick="openModal(${recId})">
          <img src="${rec.image}" alt="${rec.title}">
          <div class="more-like-card-title">${rec.title}</div>
        </div>
      `;
    }).join('');

  // 6. Inject into modal DOM
  modalBody.innerHTML = `... all the HTML ...`;

  // 7. Show modal with animation
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
```

---

## 8. Netflix Design System

### 8.1 CSS Variables (Apply to :root)

```css
:root {
  /* Core Colors */
  --netflix-red:        #E50914;
  --netflix-red-hover:  #F40612;
  --netflix-black:      #141414;
  --netflix-dark:       #181818;
  --netflix-card-bg:    #181818;
  --netflix-gray:       #808080;
  --netflix-light-gray: #B3B3B3;
  --netflix-white:      #FFFFFF;
  --netflix-green:      #46d369;   /* "Match" percentage color */
  --netflix-yellow:     #f5c518;   /* IMDb-style rating */

  /* Typography */
  --font-heading: 'Bebas Neue', Impact, sans-serif;
  --font-body:    'DM Sans', 'Helvetica Neue', Arial, sans-serif;

  /* Navbar */
  --navbar-height: 68px;

  /* Cards */
  --card-width:  280px;
  --card-height: 157px;
  --card-gap:    4px;
  --card-scale:  1.3;
  --card-delay:  280ms;
  --card-radius: 3px;

  /* Row */
  --row-padding-x: 60px;

  /* Modal */
  --modal-max-width: 860px;

  /* Z-index stack */
  --z-cards:   10;
  --z-hovered: 50;
  --z-navbar:  1000;
  --z-modal:   2000;
  --z-toast:   5000;
  --z-loader:  9999;
  --z-noise:   10000;

  /* Transitions */
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --t-fast:   150ms;
  --t-normal: 300ms;
  --t-slow:   500ms;
}
```

### 8.2 Typography Scale

| Use | Font | Weight | Size |
|---|---|---|---|
| Logo | Bebas Neue | 400 | 2.2rem |
| Hero title | Bebas Neue | 400 | clamp(2.5rem, 5vw, 4.5rem) |
| Modal title | Bebas Neue | 400 | clamp(1.8rem, 3vw, 2.8rem) |
| Row title | DM Sans | 600 | 1.05rem |
| Card title | DM Sans | 600 | 0.82rem |
| Nav links | DM Sans | 500 | 0.82rem |
| Body text | DM Sans | 300 | 0.95rem |
| Badges | DM Sans | 700 | 0.65–0.75rem |
| Footer | DM Sans | 400 | 0.72rem |

### 8.3 Color Usage Rules

- **#E50914 (red)** — Logo, tech pills in modal, skill bars, active states, error toasts
- **#141414 (black)** — Page background, navbar after scroll
- **#181818 (dark)** — Card background, modal background, dropdown background
- **#808080 (gray)** — Row titles (default), nav link icons, body text in modals
- **#B3B3B3 (light gray)** — Nav links, descriptions, meta labels
- **#46d369 (green)** — "Match" percentage, success toasts, "Live" status badge
- **White** — Primary button, headings, active nav link, hover states

### 8.4 Badge Color Codes

```css
/* Status badges */
.badge-live     { background: #2ecc71; color: #000; }
.badge-indev    { background: #f39c12; color: #000; }
.badge-archived { background: #808080; color: #fff; }

/* Difficulty badges */
.badge-beginner     { background: #2ecc71; color: #000; }
.badge-intermediate { background: #f39c12; color: #000; }
.badge-advanced     { background: #E50914; color: #fff; }

/* Year badge */
.badge-year { background: rgba(255,255,255,0.12); color: #B3B3B3; }
```

### 8.5 Gradient Reference

```css
/* Hero — left fade */
.hero-fade-left {
  background: linear-gradient(
    to right,
    rgba(20,20,20,0.88) 0%,
    rgba(20,20,20,0.60) 35%,
    rgba(20,20,20,0.15) 60%,
    transparent 100%
  );
}

/* Hero — bottom fade (into page) */
.hero-fade-bottom {
  height: 14.7vw;
  background: linear-gradient(to top, #141414 0%, transparent 100%);
}

/* Modal hero image fade */
.modal-hero-fade {
  background: linear-gradient(
    to top,
    #181818 0%,
    transparent 60%
  );
}

/* Card hover overlay */
.card-overlay {
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.5) 50%,
    transparent 100%
  );
}

/* Navbar (before scrolling) */
.navbar-fade {
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.7) 10%,
    transparent 100%
  );
}
```

---

## 9. Component Library

### 9.1 Buttons

```html
<!-- Primary (white) -->
<button class="btn btn-primary">
  <svg>▶</svg> View Project
</button>

<!-- Secondary (gray transparent) -->
<button class="btn btn-secondary">
  <svg>ⓘ</svg> More Info
</button>

<!-- GitHub (dark) -->
<a class="btn btn-github" href="..." target="_blank">
  <svg>github icon</svg> GitHub
</a>

/* CSS */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 28px; border-radius: 4px;
  font-family: var(--font-body);
  font-size: 1rem; font-weight: 600;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap; cursor: pointer; border: none;
}
.btn:active { transform: scale(0.97); }
.btn-primary   { background: #fff; color: #000; }
.btn-secondary { background: rgba(109,109,110,0.7); color: #fff; }
.btn-github    { background: rgba(40,40,40,0.9); color: #fff; }
```

### 9.2 Card Action Buttons (circle buttons on hover panel)

```html
<button class="card-action-btn card-action-primary" title="View">
  <svg>▶</svg>
</button>
<button class="card-action-btn" title="Add">+</button>
<button class="card-action-btn" title="Like">👍</button>

/* CSS */
.card-action-btn {
  width: 34px; height: 34px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  background: transparent; color: #fff; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.card-action-btn:hover { border-color: #fff; }
.card-action-btn.card-action-primary { background: #fff; border-color: #fff; color: #000; }
```

### 9.3 Loading Spinner

```html
<div id="loader">
  <div class="loader-ring"></div>
</div>

/* CSS */
#loader {
  position: fixed; inset: 0; background: #141414;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; transition: opacity 0.4s;
}
#loader.hidden { opacity: 0; pointer-events: none; }
.loader-ring {
  width: 56px; height: 56px;
  border: 3px solid #222; border-top-color: var(--netflix-red);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### 9.4 Toast Notifications

```html
<div id="toast-container"><!-- JS injects toasts here --></div>

/* CSS */
#toast-container {
  position: fixed; bottom: 24px; right: 24px;
  z-index: 5000; display: flex; flex-direction: column; gap: 8px;
}
.toast {
  background: #222; border-left: 3px solid var(--netflix-red);
  padding: 12px 20px; font-size: 0.85rem; border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  animation: fadeUp 0.3s ease;
}
.toast.success { border-left-color: #46d369; }
.toast.error   { border-left-color: #E50914; }
```

---

## 10. Interactions & Animations

### 10.1 Page Load Sequence

```
1. Black screen (#141414) shown immediately
2. Red spinner appears (center)
3. Data fetches from /api/content (usually <100ms local)
4. Spinner fades out (opacity 0, 400ms)
5. Page content fades in staggered:
   - Navbar: fadeIn 0ms
   - Hero image: fadeIn 200ms
   - Hero text: fadeIn 400ms
   - Hero buttons: fadeIn 600ms
   - First row: fadeIn 800ms
   - Additional rows: fadeIn 1000ms+
```

### 10.2 Hero Slideshow Transition

```
Current image opacity: 1.0
             ↓
Fade to 0.3 over 400ms
             ↓
Swap src, title, desc, badges (instant, invisible during fade)
             ↓
Fade to 1.0 over 600ms
             ↓
Wait 6000ms total before repeating
```

### 10.3 Card Hover Sequence

```
Mouse enters card
       ↓
Start 280ms timer
       ↓
(if mouse still on card after 280ms)
       ↓
Detect edge position → set transform-origin
       ↓
Scale: 1.0 → 1.3 (CSS transition 300ms ease)
       ↓
Hover panel fades in (opacity 0 → 1, 200ms)
       ↓
GitHub badge fades in (opacity 0 → 1, 200ms)
       ↓
(Mouse leaves)
       ↓
Clear timer if pending
       ↓
Scale: 1.3 → 1.0 (CSS transition 200ms ease)
       ↓
Hover panel fades out
```

### 10.4 Modal Open/Close

```
OPEN:
  overlay opacity: 0 → 1 (250ms)
  modal transform: translateY(30px) scale(0.97) → translateY(0) scale(1) (300ms)
  body overflow: hidden

CLOSE:
  Triggered by: × button, clicking backdrop, pressing Escape
  overlay opacity: 1 → 0 (250ms)
  modal transform reverses
  body overflow: restored after 300ms
```

### 10.5 Search Overlay

```
Search icon clicked:
  Input expands: width 0 → 260px (350ms ease)
  Input focused automatically

User types (>1 char):
  Search overlay fades in (250ms)
  All rows filtered in real-time
  Non-matching cards hidden

User clears input / presses Escape:
  Search overlay fades out
  All cards restored
  Input collapses back to icon
```

### 10.6 Skill Bar Animation

```
Skills page loads
       ↓
All bars start at width: 0%
       ↓
100ms setTimeout fires
       ↓
All bars transition to their data-level value
  (CSS transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94))
       ↓
Numbers count up from 0 to level value (optional JS counter)
```

---

## 11. Server-Side Changes

### 11.1 New API Endpoints

```javascript
// Existing
GET  /api/content          → return content.json
POST /api/content          → overwrite content.json
POST /api/upload           → upload resume PDF

// New endpoints to add:

// Upload a project image
POST /api/upload-image
  Input: multipart/form-data, field: "image"
  Output: { success: true, url: "uploads/images/filename.jpg" }
  Storage: public/uploads/images/

// Export content.json as download
GET  /api/export
  Output: file download of content.json
  Header: Content-Disposition: attachment; filename="portfolio-backup.json"

// Import content.json from upload
POST /api/import
  Input: multipart/form-data, field: "data" (JSON file)
  Validates JSON structure before writing
  Output: { success: true }

// Reorder items within a row
POST /api/reorder
  Input: { rowTitle: "2024 Projects", fromIndex: 2, toIndex: 0 }
  Mutates content.json items array
  Output: { success: true }

// Reorder rows
POST /api/reorder-rows
  Input: { fromIndex: 1, toIndex: 3 }
  Mutates content.json rows array
  Output: { success: true }
```

### 11.2 Updated server.js

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Multer — resume storage
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'resume.pdf')
});

// Multer — image storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/uploads/images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const uploadResume = multer({ storage: resumeStorage });
const uploadImage  = multer({ storage: imageStorage });

const DATA_FILE = path.join(__dirname, 'data', 'content.json');

const readData  = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/api/content', (req, res) => {
  try { res.json(readData()); }
  catch(e) { res.status(500).json({ error: 'Failed to read data' }); }
});

app.post('/api/content', (req, res) => {
  try { writeData(req.body); res.json({ success: true }); }
  catch(e) { res.status(500).json({ error: 'Failed to save data' }); }
});

app.post('/api/upload', uploadResume.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const data = readData();
  data.resumeUrl = 'uploads/resume.pdf';
  writeData(data);
  res.json({ success: true, filePath: data.resumeUrl });
});

app.post('/api/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ success: true, url: `uploads/images/${req.file.filename}` });
});

app.get('/api/export', (req, res) => {
  res.download(DATA_FILE, 'portfolio-backup.json');
});

app.post('/api/reorder', (req, res) => {
  const { rowTitle, fromIndex, toIndex } = req.body;
  const data = readData();
  const row = data.rows.find(r => r.title === rowTitle);
  if (!row) return res.status(404).json({ error: 'Row not found' });
  const [item] = row.items.splice(fromIndex, 1);
  row.items.splice(toIndex, 0, item);
  writeData(data);
  res.json({ success: true });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
}

module.exports = app;
```

---

## 12. Feature Checklist

### 🔴 Phase 1 — Make It Look Like Netflix (Do First)

- [ ] Replace Inter with Bebas Neue (headings) + DM Sans (body) everywhere
- [ ] Profile gate: bigger avatars, white ring on hover, correct text weights
- [ ] Navbar: 68px height, correct gradient, spacing, caret on avatar
- [ ] Hero: dual gradient (left + bottom fade), badge pills above title, Bebas Neue title
- [ ] Hero slideshow: fade transition, update badges + github button each cycle
- [ ] Cards: 1.3x scale on hover with 280ms delay
- [ ] Cards: smart edge detection for transform-origin
- [ ] Cards: hover panel with action buttons, badges, tech pills
- [ ] Cards: GitHub badge in top-right corner
- [ ] Row titles: gray → white on row hover with "Explore All" label
- [ ] Loading spinner (red, before data loads)
- [ ] CSS variables for all design tokens
- [ ] Noise texture overlay on body

### 🟡 Phase 2 — Add Netflix Features

- [ ] Top 10 row style with overlaid numbers
- [ ] Search overlay with real-time filtering
- [ ] Toast notifications (replace all alert())
- [ ] Admin: all new JSON fields in project form
- [ ] Admin: live image URL preview
- [ ] Admin: row manager tab (add/rename/delete/reorder rows)
- [ ] Admin: PIN gate
- [ ] Modal: proper "More Like This" grid
- [ ] Skills: horizontal row layout with animated bars
- [ ] About: episode-style timeline

### 🟢 Phase 3 — Full Netflix Polish

- [ ] Video preview on card hover (muted mp4 autoplay)
- [ ] Image upload endpoint (stop requiring external URLs)
- [ ] Export/import buttons in admin
- [ ] Bulk JSON import for projects
- [ ] Drag-to-reorder projects within a row (HTML5 Drag API)
- [ ] Bell notification icon with dropdown
- [ ] Mobile hamburger menu for nav links
- [ ] Row scroll arrows (left/right buttons)
- [ ] Keyboard navigation (Escape closes modal/search)
- [ ] "Pinned project" always shows first in hero

---

## 13. Build Order

### Week 1 — Phase 1 (Visual)
```
Day 1: Update fonts everywhere (index, browse, skills, about, admin)
Day 1: Add CSS variables to :root
Day 2: Redo profile gate (sizing, ring style, text weights)
Day 2: Rebuild navbar (height, gradient, spacing, dropdown)
Day 3: Fix hero (gradients, badges, Bebas Neue title, slideshow update)
Day 4: Rebuild cards (hover scale, delay, edge detection, hover panel)
Day 5: Row titles, loading spinner, noise texture
```

### Week 2 — Phase 2 (Features)
```
Day 1-2: Admin form fields (shortDesc, bannerImage, difficulty, status, year, videoPreview)
Day 2:   Admin image preview, toast system, PIN gate
Day 3:   Top 10 row renderer in app.js
Day 4:   Search overlay logic in app.js
Day 5:   Skills page as rows, About page episode timeline
```

### Week 3 — Phase 3 (Polish)
```
Day 1-2: Image upload endpoint + admin UI for it
Day 2-3: Row manager tab in admin
Day 3:   Drag-to-reorder (HTML5 drag API)
Day 4:   Video preview on cards
Day 5:   Export/import, mobile nav menu, final QA
```

---

## Summary: The Golden Rule

> **Any new field added to `content.json` must appear in THREE places:**
> 1. The **JSON schema** (documented in this file)
> 2. The **admin form** (so it can be edited without touching code)
> 3. The **app.js renderer** (so it actually shows on the page)
>
> Break this rule and you'll have data that is saved but never displayed, or displayed but can't be edited.

---

*Document version: 2.0 — April 2026*  
*Author: Manvir Singh Portfolio Planning*