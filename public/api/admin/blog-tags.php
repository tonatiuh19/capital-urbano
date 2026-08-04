<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';
require_once __DIR__ . '/../_blog.php';

$pdo = db_connect();
$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_respond([
        'tags' => $pdo->query('SELECT * FROM blog_tags ORDER BY name ASC')->fetchAll(),
    ]);
}

if ($method === 'POST') {
    $b = json_body();
    $name = trim($b['name'] ?? '');
    if ($name === '') {
        json_respond(['error' => 'Nombre requerido'], 400);
    }
    $slugInput = trim((string) ($b['slug'] ?? ''));
    $slug = blog_unique_slug_in_table($pdo, 'blog_tags', $slugInput !== '' ? $slugInput : $name);
    try {
        $pdo->prepare('INSERT INTO blog_tags (slug, name) VALUES (?,?)')->execute([$slug, $name]);
    } catch (PDOException $e) {
        json_respond(['error' => 'No se pudo crear la etiqueta'], 409);
    }
    json_respond(['success' => true, 'id' => (int) $pdo->lastInsertId(), 'slug' => $slug], 201);
}

if ($method === 'PUT') {
    $b = json_body();
    $id = (int) ($b['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $set = [];
    $params = [];
    foreach (['slug', 'name'] as $f) {
        if (!array_key_exists($f, $b)) {
            continue;
        }
        $set[] = "{$f} = ?";
        if ($f === 'slug') {
            $raw = trim((string) $b[$f]);
            $params[] = blog_unique_slug_in_table(
                $pdo,
                'blog_tags',
                $raw !== '' ? $raw : (string) ($b['name'] ?? $raw),
                $id
            );
        } else {
            $params[] = $b[$f];
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    try {
        $pdo->prepare('UPDATE blog_tags SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    } catch (PDOException $e) {
        json_respond(['error' => 'No se pudo actualizar la etiqueta'], 409);
    }
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    $pdo->prepare('DELETE FROM blog_tags WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
