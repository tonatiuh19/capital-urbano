<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $pdo->query(
        'SELECT id, question, answer, category, display_order, is_active FROM faq_items ORDER BY display_order'
    )->fetchAll();
    json_respond(['items' => $rows]);
}

if ($method === 'POST') {
    $b = json_body();
    if (trim($b['question'] ?? '') === '' || trim($b['answer'] ?? '') === '') {
        json_respond(['error' => 'Pregunta y respuesta requeridas'], 400);
    }
    $pdo->prepare(
        'INSERT INTO faq_items (question, answer, category, display_order, is_active) VALUES (?,?,?,?,?)'
    )->execute([
        $b['question'],
        $b['answer'],
        $b['category'] ?? 'general',
        (int) ($b['display_order'] ?? 0),
        isset($b['is_active']) ? (int) (bool) $b['is_active'] : 1,
    ]);
    json_respond(['success' => true, 'id' => (int) $pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $b = json_body();
    $id = (int) ($b['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $fields = ['question', 'answer', 'category', 'display_order', 'is_active'];
    $set = [];
    $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            $params[] = $f === 'is_active'
                ? (int) (bool) $b[$f]
                : ($f === 'display_order' ? (int) $b[$f] : $b[$f]);
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE faq_items SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $pdo->prepare('DELETE FROM faq_items WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
