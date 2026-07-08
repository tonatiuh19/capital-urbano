<?php
/**
 * POST /api/newsletter — subscribe email (footer, contact page).
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$body   = json_body();
$email  = mb_strtolower(trim($body['email'] ?? ''));
$source = trim($body['source'] ?? 'footer');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_respond(['error' => 'Correo inválido'], 400);
}

$allowedSources = ['footer', 'contact', 'admin'];
if (!in_array($source, $allowedSources, true)) {
    $source = 'footer';
}

$pdo = db_connect();

$pdo->prepare(
    "INSERT INTO newsletter_subscribers (email, status, source, ip_address)
     VALUES (?, 'subscribed', ?, ?)
     ON DUPLICATE KEY UPDATE
       status = 'subscribed',
       source = VALUES(source),
       unsubscribed_at = NULL,
       subscribed_at = IF(status = 'unsubscribed', NOW(), subscribed_at)"
)->execute([$email, $source, client_ip()]);

// Upsert lightweight client record for CRM (no name yet)
$pdo->prepare(
    "INSERT INTO clients (email, name, first_source, newsletter_opt_in, last_contact_at)
     VALUES (?, ?, 'newsletter', 1, NOW())
     ON DUPLICATE KEY UPDATE
       newsletter_opt_in = 1,
       last_contact_at = NOW(),
       first_source = IF(first_source IS NULL, 'newsletter', first_source)"
)->execute([$email, $email]);

json_respond(['ok' => true, 'subscribed' => true]);
