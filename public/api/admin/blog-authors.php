<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';
require_once __DIR__ . '/../_blog.php';

$pdo = db_connect();
$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_respond([
        'authors' => $pdo->query(
            'SELECT * FROM blog_authors ORDER BY display_order ASC, name ASC'
        )->fetchAll(),
    ]);
}

if ($method === 'POST') {
    $b = json_body();
    $name = trim($b['name'] ?? '');
    if ($name === '') {
        json_respond(['error' => 'Nombre requerido'], 400);
    }
    $slugInput = trim((string) ($b['slug'] ?? ''));
    $slug = blog_unique_slug_in_table($pdo, 'blog_authors', $slugInput !== '' ? $slugInput : $name);
    try {
        $pdo->prepare(
            'INSERT INTO blog_authors (slug, name, role_title, bio, photo_url, is_active, display_order)
             VALUES (?,?,?,?,?,?,?)'
        )->execute([
            $slug,
            $name,
            $b['role_title'] ?? null,
            $b['bio'] ?? null,
            $b['photo_url'] ?? null,
            isset($b['is_active']) ? (int) (bool) $b['is_active'] : 1,
            (int) ($b['display_order'] ?? 0),
        ]);
    } catch (PDOException $e) {
        json_respond(['error' => 'No se pudo crear el autor (¿slug duplicado?)'], 409);
    }
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
    foreach (['slug', 'name', 'role_title', 'bio', 'photo_url', 'is_active', 'display_order'] as $f) {
        if (!array_key_exists($f, $b)) {
            continue;
        }
        $set[] = "{$f} = ?";
        if ($f === 'slug') {
            $params[] = blog_unique_slug_in_table($pdo, 'blog_authors', (string) $b[$f], $id);
        } elseif (in_array($f, ['is_active'], true)) {
            $params[] = (int) (bool) $b[$f];
        } elseif ($f === 'display_order') {
            $params[] = (int) $b[$f];
        } else {
            $params[] = $b[$f];
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    try {
        $pdo->prepare('UPDATE blog_authors SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    } catch (PDOException $e) {
        json_respond(['error' => 'No se pudo actualizar el autor'], 409);
    }
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    $pdo->prepare('DELETE FROM blog_authors WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
