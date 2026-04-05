# 🎬 Netflix-Style Portfolio — Complete Idea & Planning Document

> **Owner:** Manvir Singh  
> **Goal:** Transform the current Express/TailwindCSS portfolio into a pixel-perfect Netflix clone experience — from the profile gate through every browse row, modal, skills page, about page, and admin dashboard.

---

## 1. Big Picture: What Netflix Actually Does (and What We Copy)

| Netflix Feature | Portfolio Equivalent | Status |
|---|---|---|
| "Who's Watching?" gate | Year-based profiles (2023 / 2024 / 2025) | ✅ Exists, needs visual polish |
| Top navbar + logo | "Manvir Singh" red logo + nav links | ✅ Exists |
| Auto-cycling hero banner | Slideshow from project images | ✅ Exists |
| Horizontal scroll rows | Project rows by year/category | ✅ Exists |
| Card hover expand + title | Project cards hover reveal | ✅ Exists |
| Detail modal (80% view) | Project modal with tech, links | ✅ Exists |
| "More Like This" section | `recommendations[]` array in JSON | ✅ Exists |
| Profile switcher dropdown | Avatar dropdown in navbar | ✅ Exists |
| Footer with social links | Social icons from `data.about` | ✅ Exists |
| Netflix-red (#E50914) | Already in tailwind config | ✅ Exists |
| Maturity rating badge | Project "year" / difficulty badge | ❌ Missing |
| Progress bar on card | Skill level bar on hover | ❌ Missing |
| Search overlay | Filter projects by name | ❌ Missing |
| Top 10 row with big numbers | "Top Skills" row with rank overlay | ❌ Missing |
| Trailers on hover | Project GIF / video preview on hover | ❌ Missing |
| Continue watching row | "Pinned / Featured" row | ❌ Missing |
| Netflix loading spinner | Custom red spinner | ❌ Missing |

---

## 2. File-by-File Change Map

### 2.1 `data/content.json` — Schema Extensions Needed

Current schema is good but missing these fields:

```jsonc
// Every item in rows[].items needs:
{
  "id": 101,
  "title": "Project Name",
  "image": "https://...",          // thumbnail (16:9)
  "bannerImage": "https://...",    // wide hero image (optional, falls back to image)
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "description": "Full description shown in modal.",
  "shortDesc": "One-line teaser shown in hero.",  // NEW
  "technologies": ["React", "Node.js"],
  "useCases": ["Use case 1", "Use case 2"],
  "futureScope": "What comes next.",
  "contributors": [{ "name": "...", "githubUrl": "...", "avatar": "..." }],
  "recommendations": [102, 201],   // IDs of similar projects
  "year": 2024,                    // NEW — shown as maturity-style badge
  "difficulty": "Advanced",        // NEW — badge: Beginner / Intermediate / Advanced
  "status": "Live",                // NEW — badge: Live / In Dev / Archived
  "videoPreview": "https://..."    // NEW — autoplay muted mp4 on card hover (optional)
}

// Every row needs:
{
  "title": "2024 Projects",
  "profileIds": [2],
  "style": "standard",            // NEW — "standard" | "top10" | "featured" | "continue"
  "items": [...]
}

// Top-level additions:
{
  "pinnedProject": 101,           // NEW — ID shown in hero on first load
  "maturityRatings": {            // NEW — like Netflix's rating system
    "Beginner": "🟢",
    "Intermediate": "🟡",
    "Advanced": "🔴"
  }
}
```

### 2.2 `public/index.html` — Profile Gate

**What to change:**
- Font: Replace Inter with `Netflix Sans` clone — use `Bebas Neue` for headings, `DM Sans` for body
- Profile avatars: Add subtle red glow ring on hover (like Netflix's thick border)
- "Who's watching?" text: Larger, Netflix-weight (thin/light), centered
- Manage Profiles button: Style exactly as Netflix — gray border, no fill, uppercase tracking
- Add profile name below avatar in Netflix's exact gray → white hover transition
- Background: Pure `#141414` (already done) — add very subtle noise texture overlay
- Add Netflix-style animated loading on page enter (fade in from black)

**Code pattern (profile card):**
```html
<div class="profile-card group cursor-pointer flex flex-col items-center gap-3">
  <div class="w-[10vw] min-w-[84px] max-w-[160px] aspect-square rounded 
              ring-2 ring-transparent group-hover:ring-white transition-all duration-200">
    <img src="..." class="w-full h-full object-cover rounded">
  </div>
  <span class="text-[#808080] group-hover:text-white text-sm font-medium transition-colors">
    2024
  </span>
</div>
```

### 2.3 `public/browse.html` — Main Browse Page

**Navbar (exact Netflix copy):**
```
[Logo]  Home  Skills  About         [🔍]  [🔔]  [Avatar ▾]
```
- Logo: `MANVIR` in Netflix red, bold, tracked tight
- Links fade from white to gray on scroll down (opposite on scroll up)
- Navbar background transitions: transparent → solid black after 50px scroll (already in JS)
- Avatar dropdown: Mini profile images for switch, "Sign Out" at bottom — already works, needs styling
- Search icon: Clicking expands an inline search bar (Netflix-style slide from right)
- Bell icon: Can show "New project added!" notification (optional/cosmetic)

**Hero Banner (full Netflix spec):**
```
[Full-bleed image, 56.25vw height, max 85vh]
[Gradient overlay: left 60% black fade, bottom 40% fade to #141414]
[Logo/Title: large, drop-shadow]
[Description: 3-line clamp, gray-300]
[▶ View Project]  [ⓘ More Info]
[Maturity badge]  [Year badge]  [Status pill]
[Auto-cycle every 5s with smooth fade]
```

**Row Cards (Netflix card spec):**
- Default size: `280×157px` (16:9)
- On hover: Scale 1.0 → 1.3, z-index elevation, box shadow
- Hover card shows:
  - Project title (bold)
  - Tech stack pills (first 3)
  - Action buttons: `▶ View`, `+`, `👍`, `ⓘ`
  - Year badge + difficulty badge
  - Short description (2 lines)
- Left-edge cards expand right, right-edge cards expand left (CSS `transform-origin`)
- Smooth scroll with hidden scrollbar (already done)
- Row title: Netflix gray, uppercase, small tracking → white on row hover

**Top 10 Row (new):**
- Cards have giant semi-transparent number overlaid behind thumbnail
- Number font: Ultra-heavy, Netflix red/dark
- Only show if `row.style === "top10"`

### 2.4 `public/js/app.js` — Logic Changes

**New functions needed:**

```javascript
// 1. Search overlay
function initSearch() {
  // Opens slide-in search bar
  // Filters all rows by title match
  // Shows results inline
}

// 2. Card hover with delay (Netflix doesn't expand immediately)
function initCardHover() {
  // 300ms delay before expanding
  // Abort if mouse leaves before delay
}

// 3. Smart transform-origin for cards
function getCardOrigin(card, container) {
  const rect = card.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  if (rect.left - containerRect.left < 50) return 'left center';
  if (containerRect.right - rect.right < 50) return 'right center';
  return 'center center';
}

// 4. Loading spinner
function showSpinner() { ... }
function hideSpinner() { ... }

// 5. Pinned/Featured row
// If data.pinnedProject exists, show a "Continue Watching" style row at top
```

### 2.5 `public/about.html` — About Page

**Netflix-ify as a "special feature" page:**
- Full-bleed profile photo hero (like Netflix's "behind the scenes")
- Timeline styled as Netflix episode list (S01E01 style)
- Each timeline entry = one "episode" card with year as episode number
- Social links as large pill buttons with hover lift
- Resume buttons in Netflix action button style

### 2.6 `public/skills.html` — Skills Page

**Netflix-ify as a "genres" or "top picks" page:**
- Each skill category = a row
- Each skill = a card with animated fill bar on hover
- "Top Skills" row with Top-10 style overlaid numbers
- Skill cards: language icon (devicon CDN) + name + level bar

### 2.7 `public/admin.html` — Admin Dashboard

**Improvements needed:**
- Password gate (simple client-side PIN, e.g., `?pin=1234`)
- Tab system: already exists, needs URL hash routing so refresh keeps tab
- Project form: add all new fields (`shortDesc`, `bannerImage`, `difficulty`, `status`, `videoPreview`, `year`)
- Image preview: Show live preview of image URL when typed
- Drag-to-reorder rows and items within rows (HTML5 drag API)
- Row manager tab: Add / rename / delete rows, change `style` type
- Profile manager: Create/delete year profiles, assign rows to profiles
- Bulk import: Paste JSON array of projects to add many at once
- Dark success/error toasts instead of `alert()`

---

## 3. The Upload & Data Flow (Complete Picture)

```
USER ACTION                    FRONTEND                       BACKEND                    STORAGE
─────────────────────────────────────────────────────────────────────────────────────────────────
Add project via admin form  →  POST /api/content (full JSON)  →  fs.writeFile()         → data/content.json
Upload resume PDF           →  POST /api/upload (FormData)    →  multer → disk          → public/uploads/resume.pdf
                                                               →  updates resumeUrl in    data/content.json
Browse page loads           →  GET /api/content               →  fs.readFile()           → data/content.json → client
Profile image               →  just a URL string in JSON      →  no upload, external URL → data/content.json
Project image               →  just a URL string in JSON      →  no upload, external URL → data/content.json
Avatar images               →  local files in public/images/  →  served as static        → public/images/
```

**What to ADD to upload flow:**
1. **Image upload endpoint** (`POST /api/upload-image`): Accept image files, save to `public/uploads/images/`, return URL — eliminates need to use external URLs
2. **Backup endpoint** (`GET /api/export`): Download `content.json` as file
3. **Import endpoint** (`POST /api/import`): Upload a JSON file to replace content

---

## 4. Display Process — How Content Gets From JSON to Screen

```
data/content.json
      │
      ▼
GET /api/content (server.js)
      │
      ▼
fetch('/api/content') in app.js  DOMContentLoaded
      │
      ├─── path === '/'  ──────────────────────────────► renderProfiles()
      │                                                    └─ reads data.profiles[]
      │                                                    └─ creates avatar divs
      │                                                    └─ onclick → localStorage + redirect
      │
      ├─── path includes 'browse.html' ───────────────► 
      │     │
      │     ├─ navAvatar → activeProfile.avatar
      │     ├─ dropdown → other profiles
      │     ├─ filteredRows = rows where profileIds includes activeProfile.id
      │     ├─ forEach filteredRow → creates <section> with horizontal scroll
      │     │    └─ forEach item → creates card div with img + hover overlay
      │     ├─ possibleHeroItems = all items from all filtered rows
      │     ├─ startSlideshow() → cycles hero every 5s
      │     └─ openModal(id) → finds project, renders modal HTML
      │
      ├─── path includes 'skills.html' ──────────────►
      │     └─ groups data.skills[] by category
      │     └─ creates skill bar sections
      │
      └─── path includes 'about.html' ───────────────►
            ├─ about.intro → #about-intro
            ├─ about.profilePicture → #about-profile-pic
            ├─ about.socials[] → #social-links
            ├─ about.timeline[] → #timeline-container
            └─ resumeUrl → #resume-container buttons
```

---

## 5. What Needs to Change — Prioritized Checklist

### 🔴 Critical (Makes it look Netflix)
- [ ] Card hover: scale + expand with delayed trigger + smart origin
- [ ] Hero: real gradient overlays matching Netflix exactly
- [ ] Font: Replace Inter with Bebas Neue (headings) + DM Sans (body)
- [ ] Profile gate: larger avatars, thicker hover ring, Netflix-exact sizing
- [ ] Row title: gray by default, white on row hover
- [ ] Loading state: red spinner between page/data loads
- [ ] Navbar: exact Netflix height (68px), logo sizing, link spacing

### 🟡 Important (Adds Netflix features)
- [ ] Top 10 row style with overlaid numbers
- [ ] Card hover detail panel: tech pills + action buttons + ratings
- [ ] Search overlay: slide-in, real-time filter
- [ ] Admin: Add all new JSON fields to edit form
- [ ] Admin: Live image URL preview
- [ ] Admin: Success/error toasts (no more `alert()`)
- [ ] Modal: "More Like This" grid properly laid out

### 🟢 Nice to Have (Full Netflix)
- [ ] Video preview on card hover (muted autoplay `<video>`)
- [ ] Maturity/difficulty badge on cards and modal
- [ ] Bell notification icon (cosmetic)
- [ ] Drag-to-reorder in admin
- [ ] Bulk JSON import in admin
- [ ] Image upload endpoint (stop relying on external URLs)
- [ ] PIN gate for admin page
- [ ] Export/backup button in admin

---

## 6. Exact Netflix Design Tokens to Apply Everywhere

```css
:root {
  /* Colors */
  --netflix-red: #E50914;
  --netflix-red-hover: #F40612;
  --netflix-black: #141414;
  --netflix-dark: #181818;
  --netflix-card-bg: #181818;
  --netflix-gray: #808080;
  --netflix-light-gray: #B3B3B3;
  --netflix-white: #FFFFFF;

  /* Typography */
  --font-heading: 'Bebas Neue', 'Netflix Sans', Impact, sans-serif;
  --font-body: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;

  /* Navbar */
  --navbar-height: 68px;

  /* Cards */
  --card-width: 280px;
  --card-height: 157px;  /* 16:9 */
  --card-hover-scale: 1.3;
  --card-hover-delay: 300ms;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-indexes */
  --z-card: 10;
  --z-card-hover: 50;
  --z-navbar: 100;
  --z-modal: 200;
  --z-spinner: 300;
}
```

---

## 7. Netflix Gradient Formulas (Copy These Exactly)

```css
/* Hero left-side fade (most important) */
.hero-gradient-left {
  background: linear-gradient(
    to right,
    rgba(20, 20, 20, 0.8) 0%,
    rgba(20, 20, 20, 0.4) 50%,
    transparent 100%
  );
}

/* Hero bottom fade into page bg */
.hero-gradient-bottom {
  background: linear-gradient(
    to top,
    #141414 0%,
    transparent 100%
  );
  height: 14.7vw;  /* Netflix's exact ratio */
}

/* Card hover overlay */
.card-hover-overlay {
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.5) 50%,
    transparent 100%
  );
}

/* Navbar scroll gradient (before scrolling) */
.navbar-gradient {
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.7) 10%,
    transparent 100%
  );
}
```

---

## 8. Server Changes Needed (`server.js`)

```javascript
// ADD: Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ success: true, url: `uploads/images/${req.file.filename}` });
});

// ADD: Export backup
app.get('/api/export', (req, res) => {
  res.download(DATA_FILE, 'portfolio-backup.json');
});

// ADD: Import
app.post('/api/import', upload.single('data'), (req, res) => {
  // validate JSON, write to DATA_FILE
});

// ADD: Row reorder
app.post('/api/reorder', (req, res) => {
  // { rowIndex, fromItemIndex, toItemIndex }
  // update content.json
});

// MODIFY: Add caching headers so browse page loads instantly
app.get('/api/content', (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); // keep fresh
  // ...existing code
});
```

---

## 9. Admin Dashboard — Complete Field Map

When editing a project, these are ALL the fields the admin form must expose:

| Field | Input Type | JSON Key | Notes |
|---|---|---|---|
| Title | text | `title` | Required |
| Thumbnail Image URL | url + preview | `image` | 16:9 preferred |
| Banner Image URL | url + preview | `bannerImage` | Wide, for hero |
| Short Description | text (1 line) | `shortDesc` | Hero subtitle |
| Full Description | textarea | `description` | Modal body |
| GitHub URL | url | `githubUrl` | Optional |
| Live Demo URL | url | `liveUrl` | Optional |
| Video Preview URL | url | `videoPreview` | mp4, hover play |
| Technologies | tags input / comma | `technologies[]` | Pills in modal |
| Use Cases | textarea (1/line) | `useCases[]` | List in modal |
| Future Scope | textarea | `futureScope` | Section in modal |
| Year | number | `year` | Badge on card |
| Difficulty | select | `difficulty` | Beginner/Inter/Adv |
| Status | select | `status` | Live/InDev/Archived |
| Contributors | JSON textarea | `contributors[]` | {name,url,avatar} |
| Recommendations | IDs (comma) | `recommendations[]` | "More Like This" |

---

## 10. Summary: The Three Files That Drive Everything

```
data/content.json   ←── Source of Truth
       │
       ├── server.js  ←── Reads/writes JSON, serves API
       │
       ├── public/js/admin.js  ←── Admin writes via POST /api/content
       │
       └── public/js/app.js   ←── Browse/Skills/About reads via GET /api/content
```

**The golden rule:** Any new field you add to `content.json` must be:
1. Editable in `admin.js` (form field + save logic)  
2. Displayed in `app.js` (render logic for browse/modal/skills/about)  
3. Documented in this file  

---

*Last updated: April 2026 — Manvir Singh Portfolio v3.0 Planning Document*