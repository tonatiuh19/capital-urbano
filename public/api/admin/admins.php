<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';
require_once __DIR__ . '/../_mailer.php';
require_once __DIR__ . '/_admin_emails.php';

$pdo = db_connect();
$admin = require_superadmin($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_respond(['admins' => $pdo->query(
        'SELECT id, name, email, role, is_active, last_login_at, created_at FROM admins ORDER BY role DESC, name'
    )->fetchAll()]);
}

if ($method === 'POST') {
    $b = json_body();
    $name = trim($b['name'] ?? '');
    $email = mb_strtolower(trim($b['email'] ?? ''));
    $role = in_array($b['role'] ?? '', ['superadmin', 'admin'], true) ? $b['role'] : 'admin';
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_respond(['error' => 'Nombre y correo válidos requeridos'], 400);
    }
    $dup = $pdo->prepare('SELECT id FROM admins WHERE email = ?');
    $dup->execute([$email]);
    if ($dup->fetch()) {
        json_respond(['error' => 'Correo ya registrado'], 409);
    }
    $pdo->prepare('INSERT INTO admins (name, email, role) VALUES (?,?,?)')->execute([$name, $email, $role]);
    $newId = (int) $pdo->lastInsertId();

    $emailSent = false;
    try {
        smtp_send_mail(
            $email,
            $name,
            'Bienvenido al panel administrativo — Capital Urbano',
            admin_welcome_email_html($name, admin_role_label($role), admin_login_url())
        );
        $emailSent = true;
    } catch (Throwable $e) {
        error_log('[admins.php] Welcome email failed for id ' . $newId . ': ' . $e->getMessage());
    }

    json_respond(['success' => true, 'id' => $newId, 'welcome_email_sent' => $emailSent], 201);
}

if ($method === 'PUT') {
    $b = json_body();
    $id = (int) ($b['id'] ?? 0);
    if ($id === (int) $admin['id'] && isset($b['role']) && $b['role'] !== 'superadmin') {
        json_respond(['error' => 'No puedes cambiar tu propio rol'], 403);
    }
    if ($id === (int) $admin['id'] && isset($b['is_active']) && !$b['is_active']) {
        json_respond(['error' => 'No puedes desactivarte'], 403);
    }
    $set = [];
    $params = [];
    foreach (['name', 'email', 'role', 'is_active'] as $f) {
        if (array_key_exists($f, $b)) {
            $set[] = "{$f} = ?";
            $params[] = $f === 'is_active' ? (int) (bool) $b[$f] : $b[$f];
        }
    }
    if (!$set) {
        json_respond(['error' => 'Sin campos'], 400);
    }
    $params[] = $id;
    $pdo->prepare('UPDATE admins SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
    json_respond(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id === (int) $admin['id']) {
        json_respond(['error' => 'No puedes eliminarte'], 403);
    }
    $pdo->prepare('UPDATE admins SET is_active = 0 WHERE id = ?')->execute([$id]);
    $pdo->prepare('UPDATE admin_sessions SET revoked_at = NOW() WHERE admin_id = ? AND revoked_at IS NULL')->execute([$id]);
    json_respond(['success' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
