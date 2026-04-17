# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Tumulty Audit** — a single-user Laravel 11 CRM/audit application.

Stack: PHP 8.4 · Laravel 11 · Inertia.js v3 · React 19 · Tailwind CSS v4 · PostgreSQL 17 · Vite 6 · Docker + Nginx

## Purpose

This app has two parts:

1. A public-facing AI-powered audit questionnaire that assesses a business's automation readiness and generates a branded PDF report with a score, opportunities, and recommended next steps. No auth required.
2. An internal CRM where every completed audit automatically creates a contact record with their responses, score, and report attached.

## Guardrails

- Minimal changes first — no refactoring without a clear reason
- One feature per PR, never mix concerns
- All inputs validated via Laravel Form Requests before hitting the database
- No raw SQL — Eloquent only
- Soft deletes on all models — never hard delete
- No `any` in TypeScript
- Every controller must have at least one Pest feature test before merging
- Ask before making architectural decisions

---

## Development commands

### Start all services (recommended)

```bash
composer run dev
```

This runs four processes concurrently via `concurrently`: Laravel dev server (`php artisan serve`), queue worker, Pail log watcher, and Vite HMR (`npm run dev`).

### Individual processes

```bash
php artisan serve          # PHP dev server only
npm run dev                # Vite HMR only
npm run build              # Production asset build
```

### Docker (full stack)

```bash
docker compose up -d       # Start app, nginx, postgres
docker compose down        # Stop
docker compose exec app php artisan migrate
```

The app is served at `http://localhost:8080` via Nginx when running in Docker. `DB_HOST=db` (the Docker service name) is set in `.env` for container-to-container connectivity.

### Database

```bash
php artisan migrate
php artisan migrate:fresh --seed
```

Tests use the PostgreSQL database defined in `.env` (not SQLite in-memory). The commented-out SQLite lines in `phpunit.xml` are intentionally left disabled.

### Linting / formatting

```bash
./vendor/bin/pint           # Laravel Pint (PHP code style, PSR-12-ish)
```

### Tests

```bash
php artisan test                                  # All tests
php artisan test --testsuite=Unit                 # Unit suite only
php artisan test --testsuite=Feature              # Feature suite only
php artisan test tests/Feature/ExampleTest.php    # Single file
php artisan test --filter=test_method_name        # Single test method
```

---

## Architecture

### Request lifecycle

All HTTP requests flow through Laravel → Inertia → React. There are no API routes or JSON endpoints; the entire frontend is driven by Inertia's server-side rendering protocol.

1. Laravel route returns `Inertia::render('PageName', $props)` from `routes/web.php`
2. `HandleInertiaRequests` middleware (registered in `bootstrap/app.php`) intercepts every web request — use its `share()` method to pass global props (auth user, flash messages, etc.) to all React pages
3. The Blade root template is `resources/views/app.blade.php` — this is rendered only on the first full-page load; subsequent navigations are XHR
4. React pages live in `resources/js/Pages/` and are resolved by name in `resources/js/app.jsx`

### Frontend conventions

- **Pages**: `resources/js/Pages/**/*.jsx` — one file per route, named to match the string passed to `Inertia::render()`
- **CSS**: Tailwind v4 — uses the `@tailwindcss/vite` plugin (no `tailwind.config.js` needed). Import is `@import "tailwindcss"` in `resources/css/app.css`

### Backend conventions

- Laravel 11 uses the slim `bootstrap/app.php` application bootstrap — there is no `App\Http\Kernel`. Middleware registration happens via `->withMiddleware()` in that file.
- `HandleInertiaRequests` is the only custom middleware registered so far.

### Docker layout

| Container | Image | Role |
|---|---|---|
| `app` | `docker/php/Dockerfile` (php:8.4-fpm) | PHP-FPM application |
| `nginx` | nginx:alpine | Web server, proxies to `app:9000` |
| `db` | postgres:17-alpine | PostgreSQL |

PHP config overrides are in `docker/php/local.ini`. Nginx config is in `docker/nginx/default.conf`.

### Environment

Copy `.env.example` to `.env` and generate a key (`php artisan key:generate`). The example is pre-configured for PostgreSQL with Docker service names (`DB_HOST=db`). When running outside Docker, change `DB_HOST` to `127.0.0.1`.

## Current Status
