<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
require_admin($pdo);

$settings = [];
foreach ($pdo->query('SELECT setting_key, setting_value FROM site_settings')->fetchAll() as $row) {
    $settings[$row['setting_key']] = $row['setting_value'] ?? '';
}

$members = $pdo->query(
    'SELECT name, role_title, bio_short, bio, photo_url, team_section, is_leadership, is_active
     FROM team_members ORDER BY display_order'
)->fetchAll();

json_respond([
    'settings' => $settings,
    'team_members' => $members,
]);
