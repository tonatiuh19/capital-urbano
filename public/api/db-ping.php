<?php
/**
 * GET /api/db-ping.php — Dev-only DB connectivity check (no table access).
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if (!defined('APP_ENV') || APP_ENV !== 'development') {
    json_respond(['error' => 'Not available'], 404);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';charset=' . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $visible = $pdo->query('SHOW DATABASES')->fetchAll(PDO::FETCH_COLUMN);
    $appDbs  = array_values(array_filter($visible, fn ($d) => str_starts_with($d, 'gmwbyxyp_')));

    try {
        $pdoDb = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET,
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        $pdoDb->query('SELECT 1');
        json_respond([
            'ok'       => true,
            'database' => DB_NAME,
            'user'     => DB_USER,
            'message'  => 'Conexión correcta',
        ]);
    } catch (PDOException $e) {
        json_respond([
            'ok'              => false,
            'configured_db'   => DB_NAME,
            'configured_user' => DB_USER,
            'visible_app_dbs' => $appDbs,
            'error'           => $e->getMessage(),
            'fix'             => 'cPanel → MySQL® Databases → añadir el usuario a la base de datos con ALL PRIVILEGES (igual que liv_capital).',
        ], 503);
    }
} catch (PDOException $e) {
    json_respond([
        'ok'    => false,
        'error' => $e->getMessage(),
    ], 503);
}
