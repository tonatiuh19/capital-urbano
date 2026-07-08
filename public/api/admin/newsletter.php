<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$page = max(1, (int) ($_GET['page'] ?? 1));
$status = $_GET['status'] ?? '';
$limit = 50;
$offset = ($page - 1) * $limit;

$where = [];
$params = [];
if ($status !== '') {
    $where[] = 'status = ?';
    $params[] = $status;
}
$whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM newsletter_subscribers {$whereSQL}");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

$params[] = $limit;
$params[] = $offset;
$stmt = $pdo->prepare(
    "SELECT id, email, status, source, subscribed_at, unsubscribed_at
     FROM newsletter_subscribers {$whereSQL}
     ORDER BY subscribed_at DESC LIMIT ? OFFSET ?"
);
$stmt->execute($params);

json_respond([
    'subscribers' => $stmt->fetchAll(),
    'total'       => $total,
    'page'        => $page,
    'total_pages' => (int) ceil($total / $limit),
]);
