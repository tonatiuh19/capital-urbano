<?php
/**
 * POST /api/admin/upload.php
 * Authenticated multipart upload. Fields: file (required), folder (developments|team|brochures|blog).
 * Images (JPG/PNG/WebP) for developments|team|blog; PDF only for brochures.
 * Returns { "url": "/uploads/{folder}/..." } — same pattern as liv-capital amenity-upload.
 */
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';
require_once __DIR__ . '/_upload_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
$admin = require_admin($pdo);

$folder = $_POST['folder'] ?? 'developments';
admin_handle_image_upload($folder);
