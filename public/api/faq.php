<?php
/**
 * GET /api/faq — published FAQ items for contact page (and elsewhere).
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$category = trim($_GET['category'] ?? '');

$pdo = db_connect();

if ($category !== '') {
    $stmt = $pdo->prepare(
        "SELECT id, question, answer, category, display_order
         FROM faq_items
         WHERE is_active = 1 AND category = ?
         ORDER BY display_order ASC, id ASC"
    );
    $stmt->execute([$category]);
} else {
    $stmt = $pdo->query(
        "SELECT id, question, answer, category, display_order
         FROM faq_items
         WHERE is_active = 1
         ORDER BY display_order ASC, id ASC"
    );
}

json_respond(['items' => $stmt->fetchAll()]);
