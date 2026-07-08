<?php
/**
 * GET /api/developments — active portfolio projects (public).
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
$slug = trim($_GET['slug'] ?? '');

if ($slug !== '') {
    $stmt = $pdo->prepare(
        "SELECT id, slug, name, tagline, description_short, description, location_label, address_line, city, state,
                latitude, longitude, units_label, status, delivery_estimate, total_floors, total_units,
                hero_image_url, brochure_url, highlights, external_site_url, liv_project_slug,
                contact_email, contact_phone, is_featured, display_order
         FROM developments WHERE is_active = 1 AND slug = ? LIMIT 1"
    );
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if ($row) {
        cast_development_coords($row);
        if (!empty($row['highlights'])) {
            $row['highlights'] = json_decode($row['highlights'], true);
        }
        $media = $pdo->prepare(
            'SELECT id, media_type, url, caption, display_order FROM development_media
             WHERE development_id = ? AND is_active = 1 ORDER BY display_order'
        );
        $media->execute([$row['id']]);
        $row['media'] = $media->fetchAll();
    }
    json_respond(['development' => $row ?: null]);
}

$mapOnly = isset($_GET['map']) && $_GET['map'] !== '0' && $_GET['map'] !== '';

if ($mapOnly) {
    $rows = $pdo->query(
        "SELECT id, slug, name, location_label, latitude, longitude, hero_image_url, status, display_order
         FROM developments
         WHERE is_active = 1 AND latitude IS NOT NULL AND longitude IS NOT NULL
         ORDER BY display_order ASC, name ASC"
    )->fetchAll();
    foreach ($rows as &$r) {
        cast_development_coords($r);
    }
    unset($r);

    $center = ['lat' => 20.6736, 'lng' => -103.3444];
    $cfg = $pdo->query(
        "SELECT setting_key, setting_value FROM site_settings
         WHERE setting_key IN ('map_lat','map_lng')"
    )->fetchAll(PDO::FETCH_KEY_PAIR);
    if (!empty($cfg['map_lat']) && !empty($cfg['map_lng'])) {
        $center = ['lat' => (float) $cfg['map_lat'], 'lng' => (float) $cfg['map_lng']];
    }

    json_respond(['center' => $center, 'markers' => $rows]);
}

$rows = $pdo->query(
    "SELECT id, slug, name, tagline, description_short, description, location_label, address_line, city, state,
            latitude, longitude, units_label, status, delivery_estimate, total_units,
            hero_image_url, external_site_url, liv_project_slug, is_featured, display_order
     FROM developments
     WHERE is_active = 1
     ORDER BY display_order ASC, name ASC"
)->fetchAll();
foreach ($rows as &$r) {
    cast_development_coords($r);
}
unset($r);
json_respond(['developments' => $rows]);

function cast_development_coords(array &$row): void
{
    foreach (['latitude', 'longitude'] as $key) {
        if (array_key_exists($key, $row) && $row[$key] !== null) {
            $row[$key] = (float) $row[$key];
        }
    }
}
