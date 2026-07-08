<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $slug = trim($_GET['slug'] ?? '');
    if ($slug !== '') {
        $stmt = $pdo->prepare('SELECT * FROM cms_pages WHERE slug = ?');
        $stmt->execute([$slug]);
        json_respond(['page' => $stmt->fetch() ?: null]);
    }
    json_respond(['pages' => $pdo->query('SELECT * FROM cms_pages ORDER BY slug')->fetchAll()]);
}

if ($method === 'PUT') {
    $b = json_body();
    $slug = trim($b['slug'] ?? '');
    if ($slug === '') {
        json_respond(['error' => 'slug requerido'], 400);
    }
    $pdo->prepare(
        'UPDATE cms_pages SET title = ?, body_markdown = ?, meta_description = ?,
         is_published = ?, published_at = IF(? = 1, COALESCE(published_at, NOW()), published_at)
         WHERE slug = ?'
    )->execute([
        $b['title'] ?? '',
        $b['body_markdown'] ?? null,
        $b['meta_description'] ?? null,
        !empty($b['is_published']) ? 1 : 0,
        !empty($b['is_published']) ? 1 : 0,
        $slug,
    ]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
