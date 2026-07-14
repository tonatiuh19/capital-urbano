<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

$pdo = db_connect();
require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

function normalize_team_section(?string $section, $isLeadership): string
{
    $allowed = ['leadership', 'technical', 'general'];
    if ($section !== null && in_array($section, $allowed, true)) {
        return $section;
    }
    return !empty($isLeadership) ? 'leadership' : 'general';
}

if ($method === 'GET') {
    json_respond(['members' => $pdo->query('SELECT * FROM team_members ORDER BY display_order')->fetchAll()]);
}

if ($method === 'POST') {
    $b = json_body();
    if (trim($b['name'] ?? '') === '') {
        json_respond(['error' => 'Nombre requerido'], 400);
    }
    $section = normalize_team_section($b['team_section'] ?? null, $b['is_leadership'] ?? null);
    $isLeadership = $section === 'leadership' ? 1 : 0;
    $pdo->prepare(
        'INSERT INTO team_members (name, role_title, team_section, bio_short, bio, photo_url, linkedin_url, is_leadership, display_order, is_active)
         VALUES (?,?,?,?,?,?,?,?,?,?)'
    )->execute([
        $b['name'], $b['role_title'] ?? null, $section, $b['bio_short'] ?? null, $b['bio'] ?? null, $b['photo_url'] ?? null,
        $b['linkedin_url'] ?? null, $isLeadership,
        (int) ($b['display_order'] ?? 0), isset($b['is_active']) ? (int) (bool) $b['is_active'] : 1,
    ]);
    json_respond(['success' => true, 'id' => (int) $pdo->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $b = json_body();
    $id = (int) ($b['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    if (array_key_exists('team_section', $b) || array_key_exists('is_leadership', $b)) {
        $section = normalize_team_section($b['team_section'] ?? null, $b['is_leadership'] ?? null);
        $b['team_section'] = $section;
        $b['is_leadership'] = $section === 'leadership' ? 1 : 0;
    }
    $set = [];
    $params = [];
    foreach (['name', 'role_title', 'team_section', 'bio_short', 'bio', 'photo_url', 'linkedin_url', 'is_leadership', 'display_order', 'is_active'] as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            if (in_array($f, ['is_leadership', 'is_active'], true)) {
                $params[] = (int) (bool) $b[$f];
            } elseif ($f === 'display_order') {
                $params[] = (int) $b[$f];
            } else {
                $params[] = $b[$f];
            }
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin cambios'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE team_members SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    $pdo->prepare('DELETE FROM team_members WHERE id = ?')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
