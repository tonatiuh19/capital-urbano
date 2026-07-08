<?php
/**
 * GET /api/contact-page — contact page bundle: settings, FAQ, developments summary.
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();

$settings = [];
$rows = $pdo->query(
    "SELECT setting_key, setting_value FROM site_settings
     WHERE is_public = 1 AND setting_key IN (
       'site_name','contact_email','contact_phone','contact_address','contact_hours',
       'newsletter_heading','newsletter_subcopy'
     )"
)->fetchAll();
foreach ($rows as $row) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

$faq = $pdo->query(
    "SELECT id, question, answer, category
     FROM faq_items WHERE is_active = 1
     ORDER BY display_order ASC"
)->fetchAll();

$developments = $pdo->query(
    "SELECT id, slug, name, tagline, location_label, status, delivery_estimate,
            total_units, external_site_url, liv_project_slug, contact_email, contact_phone
     FROM developments WHERE is_active = 1
     ORDER BY display_order ASC"
)->fetchAll();

$pageStmt = $pdo->prepare(
    'SELECT slug, title, body_markdown, meta_description
     FROM cms_pages WHERE slug = ? AND is_published = 1 LIMIT 1'
);
$pageStmt->execute(['contact']);
$page = $pageStmt->fetch() ?: null;

json_respond([
    'settings'     => $settings,
    'faq'          => $faq,
    'developments' => $developments,
    'page'         => $page,
]);
