<?php
/**
 * GET /api/site-config — public settings for SiteGate (liv-capital compatible shape).
 * Returns { config: { under_construction: bool, ... } }
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$booleanKeys = ['under_construction', 'feature_blog_enabled'];
$numericKeys = ['map_lat', 'map_lng'];
$config = [];

try {
    $pdo  = db_connect();
    $rows = $pdo->query(
        'SELECT setting_key, setting_value FROM site_settings WHERE is_public = 1'
    )->fetchAll();

    foreach ($rows as $row) {
        $key   = $row['setting_key'];
        $value = $row['setting_value'];

        if (in_array($key, $booleanKeys, true)) {
            $value = ($value === '1' || $value === 'true' || $value === true);
        } elseif (in_array($key, $numericKeys, true) && $value !== null && $value !== '') {
            $value = (float) $value;
        }

        $config[$key] = $value;
    }
} catch (Throwable $e) {
    error_log('[site-config] ' . $e->getMessage());
    $config['under_construction'] = false;
    if (defined('APP_ENV') && APP_ENV === 'development') {
        $config['_db_error'] = $e->getMessage();
    }
}

if (!isset($config['under_construction'])) {
    $config['under_construction'] = false;
}
if (!isset($config['feature_blog_enabled'])) {
    $config['feature_blog_enabled'] = true;
}

json_respond(['config' => $config, 'settings' => $config]);
