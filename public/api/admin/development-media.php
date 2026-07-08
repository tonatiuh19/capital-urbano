<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $devId = (int) ($_GET['development_id'] ?? 0);
    if ($devId <= 0) {
        json_respond(['error' => 'development_id requerido'], 400);
    }
    $stmt = $pdo->prepare(
        'SELECT id, development_id, media_type, url, caption, display_order, is_active
         FROM development_media WHERE development_id = ? ORDER BY display_order'
    );
    $stmt->execute([$devId]);
    json_respond(['media' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $b = json_body();
    $devId = (int) ($b['development_id'] ?? 0);
    $url = trim($b['url'] ?? '');
    if ($devId <= 0 || $url === '') {
        json_respond(['error' => 'development_id y url requeridos'], 400);
    }
    $pdo->prepare(
        'INSERT INTO development_media (development_id, media_type, url, caption, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, 1)'
    )->execute([
        $devId,
        $b['media_type'] ?? 'image',
        $url,
        $b['caption'] ?? null,
        (int) ($b['display_order'] ?? 0),
    ]);
    json_respond(['success' => true, 'id' => (int) $pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $b = json_body();
    $id = (int) ($b['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $set = [];
    $params = [];
    foreach (['url', 'caption', 'media_type', 'display_order', 'is_active'] as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            $params[] = $b[$f];
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE development_media SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $pdo->prepare('DELETE FROM development_media WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
