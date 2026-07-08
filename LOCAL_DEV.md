# Local Development

Same pattern as **liv-capital**: Vite at `localhost:8080`, PHP API at `localhost:9000`, secrets in `public/api/_config.php` (gitignored).

---

## Requirements

- Node.js 18+
- PHP 8.4+ with PDO MySQL (mysqlnd)

---

## Setup

```bash
npm install
cp public/api/_config.example.php public/api/_config.php
# Edit _config.php — use exact DB name + user from cPanel (see liv-capital)
```

### Run both servers (same as liv)

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev
```

App: **http://localhost:8080**  
API (proxied): **http://localhost:8080/api/ping.php**

---

## How it works locally

```
Browser → http://localhost:8080
             │
             ├── Vite (React HMR)
             └── /api/* → proxy → http://localhost:9000/public/api/*.php
```

---

## Config (identical to liv-capital)

| File | Role |
|------|------|
| `public/api/_config.php` | DB, SMTP, CORS, bypass — **gitignored**, one file for local + manual server upload |
| `public/api/_config.example.php` | Template |
| `.env` | Optional Vite-only (`VITE_*`) |
| `public/assets/videos/CapitalUrbano.mp4` | **gitignored** (~118MB) — copy from team storage or production |
| `public/assets/videos/SomosCapitalUrbano.mp4` | **gitignored** (~186MB) — same |
| `public/assets/videos/capital-hero-section.mp4` | In git (~5MB) — home hero |

For local video playback, place the two large MP4s in `public/assets/videos/` on your machine. They are not in the repo (see `DEPLOY.md`).

**liv** uses remote Banahosting from `_config.php` (`DB_HOST=50.31.188.69`, `APP_ENV=development`, `CORS_ORIGIN=*`). **Capital Urbano** should use the same approach — not a second `_config.local.php` file.

Example local `_config.php` (mirror liv):

```php
define('DB_HOST',    '50.31.188.69');
define('DB_NAME',    'gmwbyxyp_capital-urbano');      // exact name from cPanel
define('DB_USER',    'gmwbyxyp_capital-urbano_admin'); // exact user from cPanel
define('DB_PASS',    '…');
define('APP_ENV',     'development');
define('CORS_ORIGIN', '*');
```

---

## Troubleshooting: `Access denied … to database` (1044)

**liv-capital works; capital-urbano returns 503** — credentials in `_config.php` are fine; the MySQL user is **not linked** to the database.

Diagnostic (dev only):

```text
GET http://localhost:8080/api/db-ping.php
```

If `visible_app_dbs` is empty and you see 1044, the user only has `information_schema` (no app DB granted).

### Fix in cPanel (required)

1. **MySQL® Databases** → section **“Add User To Database”**
2. User: `gmwbyxyp_capital-urbano_admin`
3. Database: `gmwbyxyp_capital-urbano`
4. Check **ALL PRIVILEGES** → **Make Changes**
5. Restart `npm run dev:api` and reload — `db-ping.php` should return `"ok": true`

Same step you already did for `gmwbyxyp_liv_capital_admin` → `gmwbyxyp_liv_capital`.

Also confirm **Remote MySQL®** allows your IP (liv working usually means this is already OK).

---

## Database migrations

```bash
DB_HOST=50.31.188.69 DB_NAME=gmwbyxyp_capital-urbano DB_USER=… DB_PASS=… npm run db:migrate
```

Or set the same values in `_config.php` and run `npm run db:migrate` after extending `migrate.php` to read `_config.php` (optional).

---

## Coming soon gate

Controlled by `site_settings.under_construction`. Admin → Configuración, or bypass via triple-click logo + `BYPASS_PASSWORD` in `_config.php`.
