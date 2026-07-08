<?php
/**
 * POST /api/contact — public contact form + CRM client upsert.
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$body = json_body();
$name  = trim($body['name'] ?? '');
$email = mb_strtolower(trim($body['email'] ?? ''));
$phone = trim($body['phone'] ?? '');
$message = trim($body['message'] ?? '');
$subject = trim($body['subject'] ?? '');
$interest = $body['interest'] ?? 'general';
$developmentId = isset($body['development_id']) ? (int) $body['development_id'] : null;
if ($developmentId <= 0) {
    $developmentId = null;
}
$newsletterOptIn = !empty($body['newsletter_opt_in']);

$allowedInterest = ['general', 'investment', 'partnership', 'press', 'acquisition', 'other'];
if (!in_array($interest, $allowedInterest, true)) {
    $interest = 'general';
}

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
    json_respond(['error' => 'Completa nombre, correo y mensaje'], 400);
}

$pdo = db_connect();

$pdo->prepare(
    "INSERT INTO clients (email, name, phone, interest, preferred_development_id,
                          newsletter_opt_in, first_source, last_contact_at)
     VALUES (?, ?, ?, ?, ?, ?, 'contact_form', NOW())
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       phone = COALESCE(VALUES(phone), phone),
       interest = VALUES(interest),
       preferred_development_id = COALESCE(VALUES(preferred_development_id), preferred_development_id),
       newsletter_opt_in = GREATEST(newsletter_opt_in, VALUES(newsletter_opt_in)),
       last_contact_at = NOW()"
)->execute([
    $email,
    $name,
    $phone ?: null,
    $interest,
    $developmentId ?: null,
    $newsletterOptIn ? 1 : 0,
]);

$clientStmt = $pdo->prepare('SELECT id FROM clients WHERE email = ?');
$clientStmt->execute([$email]);
$clientId = (int) $clientStmt->fetchColumn();

if ($newsletterOptIn) {
    $pdo->prepare(
        "INSERT INTO newsletter_subscribers (email, status, source, ip_address)
         VALUES (?, 'subscribed', 'contact', ?)
         ON DUPLICATE KEY UPDATE status = 'subscribed', unsubscribed_at = NULL"
    )->execute([$email, client_ip()]);
}

$pdo->prepare(
    "INSERT INTO contact_submissions
       (client_id, development_id, name, email, phone, interest, subject, message, source_page, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
)->execute([
    $clientId ?: null,
    $developmentId ?: null,
    $name,
    $email,
    $phone ?: null,
    $interest,
    $subject ?: null,
    $message,
    trim($body['source_page'] ?? '/contact'),
    client_ip(),
    mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512) ?: null,
]);

json_respond(['ok' => true]);
