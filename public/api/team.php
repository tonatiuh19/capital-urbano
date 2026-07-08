<?php
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
$rows = $pdo->query(
    'SELECT id, name, role_title, bio_short, bio, photo_url, linkedin_url, is_leadership, display_order
     FROM team_members WHERE is_active = 1 ORDER BY is_leadership DESC, display_order ASC'
)->fetchAll();
json_respond(['members' => $rows]);
