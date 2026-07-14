<?php
/**
 * POST /api/contact — public contact form + CRM upsert + email notify/confirm.
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';
require_once __DIR__ . '/_mailer.php';
require_once __DIR__ . '/_contact_emails.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$body = json_body();
$name  = mb_substr(strip_tags(trim($body['name'] ?? '')), 0, 120);
$email = mb_strtolower(trim($body['email'] ?? ''));
$phone = mb_substr(strip_tags(trim($body['phone'] ?? '')), 0, 40);
$message = mb_substr(strip_tags(trim($body['message'] ?? '')), 0, 4000);
$subject = mb_substr(strip_tags(trim($body['subject'] ?? '')), 0, 200);
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

$pdo = null;
$submissionId = 0;

try {
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
    $submissionId = (int) $pdo->lastInsertId();
} catch (Throwable $e) {
    error_log('[contact] DB error: ' . $e->getMessage());
    json_respond(['error' => 'No se pudo guardar tu mensaje. Intenta de nuevo.'], 500);
}

$adminRecipients = contact_admin_recipients($pdo);
$adminSubject = "Nueva consulta de {$name} — Capital Urbano";
$adminHtml = contact_notification_html(
    $name,
    $email,
    $phone,
    $interest,
    $subject,
    $message,
    $submissionId
);
$replyTo = ['email' => $email, 'name' => $name];

$adminEmailsSent = 0;
foreach ($adminRecipients as $adminEmail) {
    try {
        smtp_send_mail($adminEmail, 'Equipo Capital Urbano', $adminSubject, $adminHtml, [], $replyTo);
        contact_log_email($pdo, $adminEmail, 'Equipo Capital Urbano', 'contact_admin_notify', $submissionId, $adminSubject, 'sent');
        $adminEmailsSent++;
    } catch (Throwable $e) {
        error_log('[contact] admin mail [' . $adminEmail . ']: ' . $e->getMessage());
        contact_log_email($pdo, $adminEmail, 'Equipo Capital Urbano', 'contact_admin_notify', $submissionId, $adminSubject, 'failed', $e->getMessage());
    }
}

$confirmSubject = 'Recibimos tu mensaje — Capital Urbano';
$confirmHtml = contact_confirmation_html($name, $interest);
$visitorEmailSent = false;
try {
    smtp_send_mail($email, $name, $confirmSubject, $confirmHtml);
    contact_log_email($pdo, $email, $name, 'contact_confirmation', $submissionId, $confirmSubject, 'sent');
    $visitorEmailSent = true;
} catch (Throwable $e) {
    error_log('[contact] visitor mail: ' . $e->getMessage());
    contact_log_email($pdo, $email, $name, 'contact_confirmation', $submissionId, $confirmSubject, 'failed', $e->getMessage());
}

json_respond([
    'ok' => true,
    'id' => $submissionId,
    'emails' => [
        'admin_notified' => $adminEmailsSent > 0,
        'admin_recipients' => count($adminRecipients),
        'visitor_confirmed' => $visitorEmailSent,
    ],
]);
