## Purpose

Short, actionable guide for AI coding assistants working in this repository.

## Quick Start (local)
- **Install:** `npm install`
- **Start server (prod-like):** `npm start` (runs `node server.js`)
- **Dev (auto-reload):** `npm run dev` (uses `nodemon server.js`)
- **Tailwind dev/build (watch):** `npm run build-css` (reads `src/input.css` → `public/css/style.css`)

## High-level architecture
- Backend: `server.js` — minimal Express app that
  - Serves static files from `public/`
  - Exposes API: `GET /api/content`, `POST /api/content` and `POST /api/upload`
  - Persists a single canonical JSON at `data/content.json`
  - Exports `app` for Vercel and avoids calling `listen()` when `process.env.VERCEL === '1'`
- Frontend: static HTML + plain JS in `public/` (pages: `index.html`, `browse.html`, `admin.html`)
  - Client code lives in `public/js/` (`app.js`, `admin.js`) and talks to `/api/*`
  - Admin UI updates `data/content.json` via `POST /api/content`

## Important patterns & conventions (project-specific)
- Single source of truth: `data/content.json` — both server and admin UI read/write this file.
- Uploads: files are written to `public/uploads/`; server expects multipart field name `resume` (see `upload.single('resume')` in `server.js` and `FormData.append('resume', ...)` in `public/js/admin.js`).
- Frontend state: `localStorage.activeProfile` is used by `public/js/app.js` to gate `browse.html`.
- IDs / form hooks: admin forms use explicit element IDs that JS references (examples: `add-project-form`, `edit-project-form`, `upload-resume-form`, `resume-file`, `p-category`). Modify those files when changing admin behavior.
- CSS build: Tailwind is used at dev-time via `src/input.css` → `public/css/style.css` (watch mode used for local development).

## Files to edit for common tasks
- Update displayed content / hero / rows / skills: `data/content.json`
- Change server behavior or add APIs: `server.js`
- Modify admin functionality: `public/js/admin.js` (uses `POST /api/content` and in-memory `currentData`)
- Modify browsing UX, slideshow, modals: `public/js/app.js`
- Change styles / utilities: `src/input.css` and `tailwind.config.js`

## Debugging & developer workflows
- To reproduce local behavior: run `npm run dev` and open `http://localhost:3000`.
- If admin changes don't appear, check `data/content.json` (server writes this file) and reload the client; the admin UI calls `POST /api/content` which overwrites the file.
- For upload debugging, verify `public/uploads/` exists and that `resume` field is present in request payload (see `public/js/admin.js`).
- Logs: server prints startup logs to console when running locally; errors reading/writing `data/content.json` are returned as 500 responses.

## Deployment notes
- Vercel config: `vercel.json` routes all requests to `server.js` and uses `@vercel/node`. `server.js` exports `app` for that environment.
- Ensure `data/content.json` is writable in the deployment environment if you expect runtime writes (Vercel ephemeral filesystem means persisted writes may not be durable).

## Safety / constraints for AI agents
- Do not change the single `data/content.json` structure shape without updating both `public/js/admin.js` and `public/js/app.js`.
- Preserve existing element IDs in `admin.html` when refactoring — JS relies on them.
- When adding endpoints, prefer keeping the simple file-backed approach unless you also update admin logic and document the change.

## Where to look for examples
- API implementation: `server.js`
- Admin UI patterns (forms → `currentData` → `POST /api/content`): `public/js/admin.js`
- Browse UI and client-side data usage: `public/js/app.js`

---
If any area above is ambiguous or you'd like a shorter/longer form (e.g., change checklist for a feature), tell me which part to expand. 
