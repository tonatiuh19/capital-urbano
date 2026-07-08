<?php
/**
 * POST /api/bypass — under-construction gate (same as liv-capital).
 * Actions: login | verify
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respond(['error' => 'Método no permitido'], 405);
}

if (!defined('BYPASS_SECRET') || !defined('BYPASS_PASSWORD')) {
    json_respond(['error' => 'Bypass no configurado'], 500);
}

function bypass_token(): string {
    return hash_hmac('sha256', 'bypass:' . date('o-W'), BYPASS_SECRET);
}

$body   = json_body();
$action = $body['action'] ?? '';

if ($action === 'login') {
    $submitted = $body['password'] ?? '';
    if (!hash_equals(BYPASS_PASSWORD, $submitted)) {
        usleep(400000);
        json_respond(['valid' => false], 401);
    }
    json_respond(['valid' => true, 'token' => bypass_token()]);
}

if ($action === 'verify') {
    $token = $body['token'] ?? '';
    $valid = $token !== '' && hash_equals(bypass_token(), $token);
    json_respond(['valid' => $valid]);
}

json_respond(['error' => 'Acción inválida'], 400);
