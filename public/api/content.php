<?php
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$slug = trim($_GET['slug'] ?? '');
if ($slug === '') {
    json_respond(['error' => 'slug requerido'], 400);
}

$pdo = db_connect();
$stmt = $pdo->prepare(
    'SELECT slug, title, content, updated_at FROM cms_content
     WHERE slug = ? AND is_published = 1 LIMIT 1'
);
$stmt->execute([$slug]);
json_respond(['content' => $stmt->fetch() ?: null]);
