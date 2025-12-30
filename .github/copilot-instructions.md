<!-- Copilot / AI agent guidance for the Backend repo -->

# Repo quick orientation

This document gives concise, actionable knowledge an AI coding agent needs to be productive in this repository.

- Purpose: Node.js + Express backend for an e‑commerce system using Sequelize (MySQL).
- Entry point: `App.js` (registers module aliases, middleware, static assets, and routes).

# Architecture & key boundaries

- HTTP API: routes live under `src/Routes` and map to handlers in `src/Controllers/*`.
- Business logic helpers and project aliases live under `src/Libs`. `App.js` dynamically requires each file in `src/Libs` which should export a function that registers module aliases (using `module-alias`). Example aliases are registered in `src/Libs/index.js`.
- Data layer: Sequelize models are in `src/Models` (index exports `sequelize` and models). DB connection config is in `src/Config/sequelizeConnect.js` and is environment-aware (uses DEV\_ vs production env vars).
- Middlewares: request logging and error-handling are centralized under `src/Middlewares` (`Log.js`, `authenticated.js`, `authorizeRole.js`, `errorHandlers.js`). Use these for cross-cutting behavior.
- Utilities: standard JSON response helper is aliased as `response` -> `src/Libs/Utils/response.js`. Controllers use this consistently to shape API responses.

# Developer workflows (how to run & test locally)

- Install dependencies: `npm install`.
- Start dev server: `npm run dev` (uses `nodemon App.js`).
- Start production: `npm start`.
- Sync DB (one-off): `node sync-db.js` — authenticates and runs `sequelize.sync()`; useful for initial schema sync.
- Environment: copy/create `.env` with appropriate `DEV_DB_*` or production DB vars and `ALLOWED_ORIGIN` (comma-separated origins) — `App.js` expects `ALLOWED_ORIGIN` to exist.

# Project-specific conventions & patterns

- Module aliases: `module-alias` is used instead of relative paths. Aliases are registered by functions inside `src/Libs/*`. To add an alias, create a new file in `src/Libs` that calls `addAlias("aliasName", path.join(__dirname, ...))` and export that function; `App.js` will auto-register it.
- Controllers: each controller exports a function `(req, res)` and uses the `response(res, {...})` alias to return JSON with `statusCode`, `message`, and `data`.
- Auth flows: there is a device-aware login OTP flow. See `src/Controllers/Auth/Login.js`, `src/Libs/Auth/generateLoginOtp.js`, and `src/Models/scripts/UserLoginDevice.js` for the pattern — verify device, create OTP record, and send email via `sendLoginOtpEmail` alias.
- Config selection: `src/Config/sequelizeConnect.js` switches DB config by `NODE_ENV` (development uses `DEV_DB_*` env vars).
- Static assets: served at `/public` and `/images` using `src/Assets/Public` (see `App.js`). Put uploaded product images under `src/Assets/Public/images/products`.

# Integration points & external dependencies

- Sequelize + mysql2: DB ORM and driver. Models in `src/Models` and seeders under `Seeders/` (e.g., `catalogSeeder.js`).
- Email: `nodemailer` via alias `sendLoginOtpEmail` and `sendEmailConfirmation` under `src/Libs/Auth/`.
- File upload: `multer` is available for multipart handling; static file serving is configured in `App.js`.

# Helpful code pointers (examples for common tasks)

- Return API responses: use `response(res, { statusCode, message, data })` (see `src/Libs/Utils/response.js`).
- Add a new route + controller: add route in `src/Routes/index.js` referencing a controller in `src/Controllers/<Feature>/<action>.js` which should `module.exports = handler`.
- Add a new alias helper: add file `src/Libs/<name>.js` exporting a registration function that calls `addAlias(...)`. Confirm the alias file is `.js` and will be auto-registered by `App.js`.

# Pitfalls & things an AI should avoid changing without context

- Do not remove or rename module aliases unless you update all dependent `require("alias")` calls — aliases are registered dynamically and used throughout controllers.
- Be careful when modifying auth/device/OTP logic; it includes device fingerprinting (`UserLoginDevice`) and time-limited OT P creation — changing expiry or storage requires full test of flows.
- `ALLOWED_ORIGIN` is read and split in `App.js`; changing CORS handling may break client integrations.

# If you need clarification

- Ask the maintainer for missing `.env` values or sample `.env.example`. If asked to run DB migrations or seeds, request DB credentials or a dev dump; use `node sync-db.js` and `Seeders/` scripts as guidance.

---

If you'd like, I can: (1) add a small `.env.example`, (2) create a CONTRIBUTING/dev-setup doc, or (3) run a quick pass to list all module aliases used by controllers.
