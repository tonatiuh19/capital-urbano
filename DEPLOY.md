# Deploying to Banahosting

This project builds to a **static React SPA + PHP API** designed for traditional shared hosting (Apache + PHP).

---

## Requirements

- Node.js 18+ and npm (local machine for building)
- Banahosting account with cPanel access
- Apache with `mod_rewrite` enabled (standard on Banahosting)
- PHP 7.4+ (standard on Banahosting)

---

## Build & Deploy (Manual — cPanel File Manager)

### 1. Build the project

```bash
npm run build
```

This outputs the compiled SPA to `dist/spa/`.

### 2. Assemble the deploy folder

```bash
bash deploy.sh
```

This creates a `deploy/` folder containing:

```
deploy/
├── index.html
├── assets/
├── .htaccess
└── api/
    ├── _config.php          ← NOT in deploy/ — upload manually (see below)
    ├── ping.php
    ├── site-config.php
    ├── developments.php
    ├── contact.php
    └── admin/
        ├── auth.php
        └── dashboard.php
```

### Server secrets (`_config.php`)

Same pattern as **liv-capital**: copy `public/api/_config.example.php` → `public/api/_config.php`, fill DB + SMTP, and upload `_config.php` to `public_html/api/` on the server. It is **never** included in `deploy/` by `deploy.sh`.

### Large brand videos (manual upload)

GitHub blocks files over 100MB, so these are **gitignored** and must exist on the server under `public_html/assets/videos/`:

| File | In git? | Used on |
|------|---------|---------|
| `capital-hero-section.mp4` | Yes (~5MB) | Home hero background |
| `liv-capital-promo.mp4` | Yes (~10MB) | LIV Capital cards, ficha LIV, preview en proyectos |
| `CapitalUrbano.mp4` | No (~118MB) | About, Projects showcase (portafolio general) |
| `SomosCapitalUrbano.mp4` | No (~186MB) | Home “Somos” section |

After each deploy, verify the two large files are still on the server (FTP/cPanel). `deploy.sh --upload` with `--delete` will not remove them if they were never in `deploy/` — but if you replace the whole `assets/videos/` folder, re-upload the large MP4s.

For a new environment or teammate machine: copy the two large files from secure storage (or download from production) into `public/assets/videos/` locally — same idea as `_config.php`.

Or run both steps at once:

```bash
npm run deploy
```

### 3. Compress and upload

```bash
cd deploy && zip -r ../capital-urbano.zip .
```

In **cPanel → File Manager**:

1. Navigate to `public_html/`
2. Upload `capital-urbano.zip`
3. Extract in place
4. Delete the zip file

### 4. Verify

Visit your domain. The React app should load, and `/api/ping` should return `{"message":"ping"}`.

---

## Deploy via FTP (Automated)

### Prerequisites

Install `lftp`:

```bash
brew install lftp  # macOS
```

Create a `.env.deploy` file in the project root (**never commit this file — it's gitignored**):

```env
FTP_HOST=ftp.yourdomain.com
FTP_USER=your_ftp_username
FTP_PASS=your_ftp_password
FTP_REMOTE_DIR=/public_html
```

### Run

```bash
bash deploy.sh --upload
```

This builds, assembles `deploy/`, and mirrors it to your server via FTP, deleting remote files that no longer exist locally.

---

## Adding New API Endpoints

1. Create `public/api/your-endpoint.php`
2. Follow this template:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Your logic here
echo json_encode(['data' => 'value']);
```

3. It will be available at `/api/your-endpoint` after the next deploy.
4. Add the corresponding mock in `server/routes/` for local development (see LOCAL_DEV.md).

---

## Blog publish cron

Scheduled posts are also promoted when `/api/blog.php` or the admin blog API is hit. For reliable publishing without traffic, add a cron job (every 5–15 minutes):

```bash
# Example: Banahosting cron → Fetch URL
https://YOUR_DOMAIN/api/cron/publish-blog.php?secret=YOUR_CRON_SECRET
```

`CRON_SECRET` must match `define('CRON_SECRET', ...)` in `public/api/_config.php` (see `_config.example.php`).

---

## Environment Variables on Banahosting

PHP reads environment variables via `getenv()`. Set them in cPanel under **Software → PHP Variables** or in a `.htaccess` file:

```apache
SetEnv MY_SECRET_KEY your_value_here
```

Then in PHP:

```php
$value = getenv('MY_SECRET_KEY');
```
