<?php
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$slug = trim($_GET['slug'] ?? '');
$pdo = db_connect();

if ($slug !== '') {
    $stmt = $pdo->prepare(
        'SELECT slug, title, body_markdown, meta_description, updated_at
         FROM cms_pages WHERE slug = ? AND is_published = 1 LIMIT 1'
    );
    $stmt->execute([$slug]);
    $page = $stmt->fetch();
    json_respond(['page' => $page ?: null]);
}

$rows = $pdo->query(
    'SELECT slug, title, meta_description, updated_at
     FROM cms_pages WHERE is_published = 1 ORDER BY slug ASC'
)->fetchAll();
json_respond(['pages' => $rows]);
