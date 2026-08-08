<?php
/**
 * Admin CRUD for per-project apartment models.
 * GET    ?development_id=
 * POST   { development_id, name, bedrooms?, bathrooms?, area_sqm?, terrace_m2?, image_url?, display_order? }
 * PUT    { id, ... }
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
        'SELECT id, development_id, name, bedrooms, bathrooms, area_sqm, terrace_m2,
                image_url, display_order, is_active
         FROM development_models
         WHERE development_id = ?
         ORDER BY display_order ASC, id ASC'
    );
    $stmt->execute([$devId]);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        cast_model_numbers($r);
    }
    unset($r);
    json_respond(['models' => $rows]);
}

if ($method === 'POST') {
    $b = json_body();
    $devId = (int) ($b['development_id'] ?? 0);
    $name = trim($b['name'] ?? '');
    if ($devId <= 0 || $name === '') {
        json_respond(['error' => 'development_id y name requeridos'], 400);
    }
    $pdo->prepare(
        'INSERT INTO development_models
           (development_id, name, bedrooms, bathrooms, area_sqm, terrace_m2, image_url, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)'
    )->execute([
        $devId,
        $name,
        num_or_null($b['bedrooms'] ?? null, true),
        num_or_null($b['bathrooms'] ?? null),
        num_or_null($b['area_sqm'] ?? null),
        num_or_null($b['terrace_m2'] ?? null),
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
    foreach (['name', 'bedrooms', 'bathrooms', 'area_sqm', 'terrace_m2', 'image_url', 'display_order', 'is_active'] as $f) {
        if (!array_key_exists($f, $b)) {
            continue;
        }
        $set[] = "{$f} = ?";
        if ($f === 'name') {
            $params[] = trim((string) $b[$f]);
        } elseif ($f === 'image_url') {
            $val = is_string($b[$f]) ? trim($b[$f]) : $b[$f];
            $params[] = ($val === '' || $val === null) ? null : $val;
        } elseif ($f === 'display_order' || $f === 'is_active') {
            $params[] = (int) $b[$f];
        } elseif ($f === 'bedrooms') {
            $params[] = num_or_null($b[$f], true);
        } else {
            $params[] = num_or_null($b[$f]);
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE development_models SET ' . implode(', ', $set) . ' WHERE id = ?')
        ->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $pdo->prepare('DELETE FROM development_models WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);

function num_or_null(mixed $v, bool $asInt = false): mixed
{
    if ($v === null || $v === '') {
        return null;
    }
    return $asInt ? (int) $v : (float) $v;
}

function cast_model_numbers(array &$row): void
{
    foreach (['bedrooms'] as $k) {
        if (isset($row[$k]) && $row[$k] !== null) {
            $row[$k] = (int) $row[$k];
        }
    }
    foreach (['bathrooms', 'area_sqm', 'terrace_m2'] as $k) {
        if (isset($row[$k]) && $row[$k] !== null) {
            $row[$k] = (float) $row[$k];
        }
    }
}
