<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

$cols = 'id, slug, name, tagline, description_short, description, location_label, address_line, city, state,
         latitude, longitude, units_label, status, delivery_estimate, total_floors, total_units,
         hero_image_url, brochure_url, highlights, external_site_url, liv_project_slug,
         contact_email, contact_phone, is_featured, is_active, display_order';

if ($method === 'GET') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT {$cols} FROM developments WHERE id = ?");
        $stmt->execute([$id]);
        $dev = $stmt->fetch();
        if (!$dev) {
            json_respond(['error' => 'No encontrado'], 404);
        }
        $media = $pdo->prepare(
            'SELECT id, media_type, url, caption, display_order, is_active
             FROM development_media WHERE development_id = ? ORDER BY display_order'
        );
        $media->execute([$id]);
        $dev['media'] = $media->fetchAll();
        $amenities = $pdo->prepare(
            'SELECT id, development_id, name, description, icon, image_url, display_order, is_active
             FROM development_amenities
             WHERE development_id = ?
             ORDER BY display_order ASC, id ASC'
        );
        $amenities->execute([$id]);
        $dev['amenities'] = $amenities->fetchAll();
        $models = $pdo->prepare(
            'SELECT id, development_id, name, bedrooms, bathrooms, area_sqm, terrace_m2,
                    image_url, display_order, is_active
             FROM development_models
             WHERE development_id = ?
             ORDER BY display_order ASC, id ASC'
        );
        $models->execute([$id]);
        $dev['models'] = $models->fetchAll();
        if (!empty($dev['highlights'])) {
            $dev['highlights'] = json_decode($dev['highlights'], true);
        }
        cast_development_coords($dev);
        json_respond(['development' => $dev]);
    }
    $rows = $pdo->query("SELECT {$cols} FROM developments ORDER BY display_order, name")->fetchAll();
    foreach ($rows as &$r) {
        if (!empty($r['highlights'])) {
            $r['highlights'] = json_decode($r['highlights'], true);
        }
        cast_development_coords($r);
    }
    unset($r);
    json_respond(['developments' => $rows]);
}

if ($method === 'POST') {
    $b = json_body();
    $name = trim($b['name'] ?? '');
    if ($name === '') {
        json_respond(['error' => 'Nombre requerido'], 400);
    }
    $slug = trim($b['slug'] ?? '') ?: slugify($name);
    $highlights = isset($b['highlights']) ? json_encode($b['highlights'], JSON_UNESCAPED_UNICODE) : null;

    $stmt = $pdo->prepare(
        "INSERT INTO developments (slug, name, tagline, description_short, description, location_label, address_line, city, state,
         latitude, longitude, units_label, status, delivery_estimate, total_floors, total_units,
         hero_image_url, brochure_url, highlights, external_site_url, liv_project_slug, contact_email,
         contact_phone, is_featured, is_active, display_order)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $slug, $name, $b['tagline'] ?? null, $b['description_short'] ?? null, $b['description'] ?? null, $b['location_label'] ?? null,
        $b['address_line'] ?? null, $b['city'] ?? 'Guadalajara', $b['state'] ?? 'Jalisco',
        coord_or_null($b['latitude'] ?? null), coord_or_null($b['longitude'] ?? null),
        $b['units_label'] ?? null, $b['status'] ?? 'construction', $b['delivery_estimate'] ?? null,
        $b['total_floors'] ?? null, $b['total_units'] ?? null, $b['hero_image_url'] ?? null,
        $b['brochure_url'] ?? null, $highlights, $b['external_site_url'] ?? null,
        $b['liv_project_slug'] ?? null, $b['contact_email'] ?? null, $b['contact_phone'] ?? null,
        !empty($b['is_featured']) ? 1 : 0, isset($b['is_active']) ? (int) (bool) $b['is_active'] : 1,
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
    $fields = [
        'slug', 'name', 'tagline', 'description_short', 'description', 'location_label', 'address_line', 'city', 'state',
        'latitude', 'longitude', 'units_label', 'status', 'delivery_estimate', 'total_floors', 'total_units',
        'hero_image_url', 'brochure_url', 'external_site_url', 'liv_project_slug', 'contact_email',
        'contact_phone',
    ];
    $set = [];
    $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            if ($f === 'latitude' || $f === 'longitude') {
                $params[] = coord_or_null($b[$f]);
            } else {
                $params[] = $b[$f];
            }
        }
    }
    if (array_key_exists('highlights', $b)) {
        $set[] = 'highlights = ?';
        $params[] = json_encode($b['highlights'], JSON_UNESCAPED_UNICODE);
    }
    foreach (['is_featured', 'is_active', 'display_order'] as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            $params[] = in_array($f, ['is_featured', 'is_active'], true)
                ? (int) (bool) $b[$f]
                : (int) $b[$f];
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE developments SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $pdo->prepare('UPDATE developments SET is_active = 0 WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);

function coord_or_null(mixed $v): ?float
{
    if ($v === null || $v === '') {
        return null;
    }

    return (float) $v;
}

function cast_development_coords(array &$row): void
{
    foreach (['latitude', 'longitude'] as $key) {
        if (array_key_exists($key, $row) && $row[$key] !== null) {
            $row[$key] = (float) $row[$key];
        }
    }
}

function slugify(string $s): string {
    $s = mb_strtolower($s, 'UTF-8');
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-') ?: 'proyecto';
}
