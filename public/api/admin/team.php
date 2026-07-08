<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_respond(['members' => $pdo->query('SELECT * FROM team_members ORDER BY display_order')->fetchAll()]);
}

if ($method === 'POST') {
    $b = json_body();
    if (trim($b['name'] ?? '') === '') {
        json_respond(['error' => 'Nombre requerido'], 400);
    }
    $pdo->prepare(
        'INSERT INTO team_members (name, role_title, bio_short, bio, photo_url, linkedin_url, is_leadership, display_order, is_active)
         VALUES (?,?,?,?,?,?,?,?,?)'
    )->execute([
        $b['name'], $b['role_title'] ?? null, $b['bio_short'] ?? null, $b['bio'] ?? null, $b['photo_url'] ?? null,
        $b['linkedin_url'] ?? null, !empty($b['is_leadership']) ? 1 : 0,
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
    foreach (['name', 'role_title', 'bio_short', 'bio', 'photo_url', 'linkedin_url', 'is_leadership', 'display_order', 'is_active'] as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            if (in_array($f, ['is_leadership', 'is_active'], true)) {
                $params[] = (int) (bool) $b[$f];
            } elseif ($f === 'display_order') {
                $params[] = (int) $b[$f];
            } else {
                $params[] = $b[$f];
            }
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE team_members SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    $pdo->prepare('DELETE FROM team_members WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
