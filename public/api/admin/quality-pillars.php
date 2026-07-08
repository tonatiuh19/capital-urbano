<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_respond(['pillars' => $pdo->query('SELECT * FROM quality_pillars ORDER BY display_order')->fetchAll()]);
}

if ($method === 'POST') {
    $b = json_body();
    if (trim($b['title'] ?? '') === '') {
        json_respond(['error' => 'Título requerido'], 400);
    }
    $pdo->prepare(
        'INSERT INTO quality_pillars (title, description_short, description, icon, display_order, is_active) VALUES (?,?,?,?,?,?)'
    )->execute([
        $b['title'], $b['description_short'] ?? null, $b['description'] ?? null, $b['icon'] ?? null,
        (int) ($b['display_order'] ?? 0), isset($b['is_active']) ? (int) (bool) $b['is_active'] : 1,
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
    foreach (['title', 'description_short', 'description', 'icon', 'display_order', 'is_active'] as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            $params[] = $f === 'is_active'
                ? (int) (bool) $b[$f]
                : ($f === 'display_order' ? (int) $b[$f] : $b[$f]);
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE quality_pillars SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    $pdo->prepare('DELETE FROM quality_pillars WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
