<?php
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
$rows = $pdo->query(
    'SELECT id, title, description_short, description, icon, display_order
     FROM quality_pillars WHERE is_active = 1 ORDER BY display_order ASC'
)->fetchAll();
json_respond(['pillars' => $rows]);
