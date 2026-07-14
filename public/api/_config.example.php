<?php
/**
 * _config.example.php — Copy this to _config.php and fill in real values.
 * _config.php is gitignored and must be uploaded manually to the server.
 * NEVER commit _config.php — it contains secrets.
 *
 * Local dev: same file as liv-capital (remote DB_HOST, APP_ENV=development, CORS_ORIGIN=*).
 *
 * This file is the PHP equivalent of .env (same pattern as liv-capital).
 */
defined('APP_INIT') or die('Direct access not allowed.');

// ─── Database ────────────────────────────────────────────────────────────────
define('DB_HOST',    '50.31.188.69');        // Banahosting; 'localhost' on server only
define('DB_NAME',    'gmwbyxyp_capital-urbano'); // exact name from cPanel → MySQL Databases
define('DB_USER',    'gmwbyxyp_capital-urbano_admin');
define('DB_USER',    'your_db_user');
define('DB_PASS',    'your_db_password');
define('DB_CHARSET', 'utf8mb4');

// ─── Under construction bypass (coming soon gate) ────────────────────────────
define('BYPASS_PASSWORD', 'change-me-strong-passphrase');
define('BYPASS_SECRET',   'change-me-64-char-random-hex-string'); // openssl rand -hex 32

// ─── PHPMailer / SMTP (Banahosting) ──────────────────────────────────────────
define('SMTP_HOST',       'hd-4938.banahosting.com');
define('SMTP_PORT',       465);
define('SMTP_ENCRYPTION', 'ssl');
define('SMTP_USER',       'no-responder@capitalurbano.com');
define('SMTP_PASS',       'your-smtp-password');
define('SMTP_FROM_NAME',  'Capital Urbano');

// Always notified on contact form (plus site_settings.contact_email when different)
define('CONTACT_NOTIFY_EMAIL', 'contacto@capitalurbano.com');

// ─── App ─────────────────────────────────────────────────────────────────────
define('APP_ENV',     'production');          // development | production
define('APP_URL',     'https://capitalurbanomx.com');
define('CORS_ORIGIN', 'https://capitalurbanomx.com');

// ─── Cron secret (optional — for future scheduled jobs) ──────────────────────
define('CRON_SECRET', 'change-me-random-secret-for-cron');
