<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $publicOnly = isset($_GET['public']) ? (int) $_GET['public'] : null;
    if ($publicOnly === 1) {
        $stmt = $pdo->query('SELECT setting_key, setting_value, is_public FROM site_settings WHERE is_public = 1');
    } else {
        $stmt = $pdo->query('SELECT setting_key, setting_value, is_public FROM site_settings ORDER BY setting_key');
    }
    $settings = [];
    foreach ($stmt->fetchAll() as $row) {
        $settings[] = $row;
    }
    json_respond(['settings' => $settings]);
}

if ($method === 'PUT') {
    $b = json_body();
    $updates = $b['updates'] ?? [];
    if (!is_array($updates)) {
        json_respond(['error' => 'updates debe ser un array'], 400);
    }
    $stmt = $pdo->prepare(
        'INSERT INTO site_settings (setting_key, setting_value, is_public) VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), is_public = VALUES(is_public)'
    );
    foreach ($updates as $u) {
        if (empty($u['key'])) {
            continue;
        }
        $stmt->execute([
            $u['key'],
            (string) ($u['value'] ?? ''),
            isset($u['is_public']) ? (int) (bool) $u['is_public'] : 1,
        ]);
    }
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
