<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $slug = trim($_GET['slug'] ?? '');
    if ($slug !== '') {
        $stmt = $pdo->prepare('SELECT * FROM cms_content WHERE slug = ?');
        $stmt->execute([$slug]);
        json_respond(['content' => $stmt->fetch() ?: null]);
    }
    json_respond(['contents' => $pdo->query('SELECT slug, title, is_published, updated_at FROM cms_content ORDER BY slug')->fetchAll()]);
}

if ($method === 'PUT') {
    $b = json_body();
    $slug = trim($b['slug'] ?? '');
    if ($slug === '') {
        json_respond(['error' => 'slug requerido'], 400);
    }
    $exists = $pdo->prepare('SELECT id FROM cms_content WHERE slug = ?');
    $exists->execute([$slug]);
    if ($exists->fetch()) {
        $pdo->prepare(
            'UPDATE cms_content SET title = ?, content = ?, is_published = ?,
             published_at = IF(? = 1, COALESCE(published_at, NOW()), published_at) WHERE slug = ?'
        )->execute([
            $b['title'] ?? '', $b['content'] ?? '', !empty($b['is_published']) ? 1 : 0,
            !empty($b['is_published']) ? 1 : 0, $slug,
        ]);
    } else {
        $pdo->prepare(
            'INSERT INTO cms_content (slug, title, content, is_published, published_at) VALUES (?,?,?,?,IF(?=1,NOW(),NULL))'
        )->execute([
            $slug, $b['title'] ?? '', $b['content'] ?? '',
            !empty($b['is_published']) ? 1 : 0, !empty($b['is_published']) ? 1 : 0,
        ]);
    }
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
