<?php
/**
 * Admin CRUD for per-project amenities.
 * GET    ?development_id=
 * POST   { development_id, name, description?, icon?, image_url?, display_order? }
 * PUT    { id, name?, description?, icon?, image_url?, display_order?, is_active? }
 * DELETE ?id=
 */
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
        'SELECT id, development_id, name, description, icon, image_url, display_order, is_active
         FROM development_amenities
         WHERE development_id = ?
         ORDER BY display_order ASC, id ASC'
    );
    $stmt->execute([$devId]);
    json_respond(['amenities' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $b = json_body();
    $devId = (int) ($b['development_id'] ?? 0);
    $name = trim($b['name'] ?? '');
    if ($devId <= 0 || $name === '') {
        json_respond(['error' => 'development_id y name requeridos'], 400);
    }
    $pdo->prepare(
        'INSERT INTO development_amenities
           (development_id, name, description, icon, image_url, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)'
    )->execute([
        $devId,
        $name,
        trim($b['description'] ?? '') ?: null,
        trim($b['icon'] ?? '') ?: null,
        trim($b['image_url'] ?? '') ?: null,
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
    foreach (['name', 'description', 'icon', 'image_url', 'display_order', 'is_active'] as $f) {
        if (!array_key_exists($f, $b)) {
            continue;
        }
        $set[] = "{$f} = ?";
        if ($f === 'display_order' || $f === 'is_active') {
            $params[] = (int) $b[$f];
        } elseif (in_array($f, ['description', 'icon', 'image_url'], true)) {
            $val = is_string($b[$f]) ? trim($b[$f]) : $b[$f];
            $params[] = ($val === '' || $val === null) ? null : $val;
        } else {
            $params[] = trim((string) $b[$f]);
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE development_amenities SET ' . implode(', ', $set) . ' WHERE id = ?')
        ->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $pdo->prepare('DELETE FROM development_amenities WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
