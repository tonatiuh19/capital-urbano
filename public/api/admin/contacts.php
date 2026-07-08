<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status = $_GET['status'] ?? '';
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = 25;
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];
    if ($status !== '') {
        $where[] = 'cs.status = ?';
        $params[] = $status;
    }
    $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM contact_submissions cs {$whereSQL}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $params[] = $limit;
    $params[] = $offset;
    $stmt = $pdo->prepare(
        "SELECT cs.id, cs.name, cs.email, cs.phone, cs.interest, cs.subject, cs.message,
                cs.source_page AS source, cs.status, cs.created_at,
                d.name AS development_name, c.admin_notes AS client_notes
         FROM contact_submissions cs
         LEFT JOIN developments d ON d.id = cs.development_id
         LEFT JOIN clients c ON c.id = cs.client_id
         {$whereSQL}
         ORDER BY cs.created_at DESC
         LIMIT ? OFFSET ?"
    );
    $stmt->execute($params);

    json_respond([
        'contacts'    => $stmt->fetchAll(),
        'total'       => $total,
        'page'        => $page,
        'total_pages' => (int) ceil($total / $limit),
    ]);
}

if ($method === 'PUT') {
    $b = json_body();
    $id = (int) ($b['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $allowed = ['new', 'read', 'replied', 'archived'];
    if (!empty($b['status']) && !in_array($b['status'], $allowed, true)) {
        json_respond(['error' => 'Estado inválido'], 400);
    }
    if (!empty($b['status'])) {
        $pdo->prepare('UPDATE contact_submissions SET status = ? WHERE id = ?')->execute([$b['status'], $id]);
    }
    if (array_key_exists('client_notes', $b)) {
        $stmt = $pdo->prepare('SELECT client_id FROM contact_submissions WHERE id = ?');
        $stmt->execute([$id]);
        $clientId = (int) $stmt->fetchColumn();
        if ($clientId > 0) {
            $pdo->prepare('UPDATE clients SET admin_notes = ? WHERE id = ?')->execute([$b['client_notes'], $clientId]);
        }
    }
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
