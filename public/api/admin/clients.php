<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare(
            "SELECT c.*, d.name AS development_name FROM clients c
             LEFT JOIN developments d ON d.id = c.preferred_development_id WHERE c.id = ?"
        );
        $stmt->execute([$id]);
        $client = $stmt->fetch();
        if (!$client) {
            json_respond(['error' => 'No encontrado'], 404);
        }
        if (!empty($client['tags'])) {
            $client['tags'] = json_decode($client['tags'], true);
        }
        $contacts = $pdo->prepare(
            'SELECT id, subject, message, status, created_at FROM contact_submissions WHERE client_id = ? ORDER BY created_at DESC'
        );
        $contacts->execute([$id]);
        json_respond(['client' => $client, 'submissions' => $contacts->fetchAll()]);
    }

    $page = max(1, (int) ($_GET['page'] ?? 1));
    $search = trim($_GET['search'] ?? '');
    $limit = 25;
    $offset = ($page - 1) * $limit;
    $where = '1=1';
    $params = [];
    if ($search !== '') {
        $where .= ' AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
        $q = '%' . $search . '%';
        $params = [$q, $q, $q];
    }
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM clients c WHERE {$where}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $params[] = $limit;
    $params[] = $offset;
    $stmt = $pdo->prepare(
        "SELECT c.id, c.email, c.name, c.phone, c.interest, c.newsletter_opt_in,
                c.first_source, c.last_contact_at, d.name AS development_name
         FROM clients c
         LEFT JOIN developments d ON d.id = c.preferred_development_id
         WHERE {$where}
         ORDER BY c.last_contact_at DESC, c.id DESC
         LIMIT ? OFFSET ?"
    );
    $stmt->execute($params);
    json_respond([
        'clients'     => $stmt->fetchAll(),
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
    $set = [];
    $params = [];
    if (array_key_exists('admin_notes', $b)) {
        $set[] = 'admin_notes = ?';
        $params[] = $b['admin_notes'];
    }
    if (array_key_exists('tags', $b)) {
        $set[] = 'tags = ?';
        $params[] = json_encode($b['tags'], JSON_UNESCAPED_UNICODE);
    }
    if (array_key_exists('interest', $b)) {
        $set[] = 'interest = ?';
        $params[] = $b['interest'];
    }
    if (array_key_exists('preferred_development_id', $b)) {
        $set[] = 'preferred_development_id = ?';
        $params[] = $b['preferred_development_id'] ?: null;
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE clients SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
