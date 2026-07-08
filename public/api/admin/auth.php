<?php
/**
 * POST /api/admin/auth
 * Actions: check-email | send-otp | verify-otp | verify-session | logout
 * Same OTP flow as liv-capital.
 */
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';
require_once __DIR__ . '/../_mailer.php';
require_once __DIR__ . '/_admin_emails.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$body   = json_body();
$action = $body['action'] ?? '';
$pdo    = db_connect();

switch ($action) {

    case 'check-email': {
        $email = mb_strtolower(trim($body['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_respond(['error' => 'Correo inválido'], 400);
        }

        $stmt = $pdo->prepare('SELECT id, name, is_active FROM admins WHERE email = ?');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || !$admin['is_active']) {
            json_respond(['exists' => false]);
        }

        json_respond(['exists' => true, 'name' => $admin['name']]);
        break;
    }

    case 'send-otp': {
        $email = mb_strtolower(trim($body['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_respond(['error' => 'Correo inválido'], 400);
        }

        $stmt = $pdo->prepare('SELECT id, name, email FROM admins WHERE email = ? AND is_active = 1');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin) {
            json_respond(['sent' => true]);
        }

        $pdo->prepare(
            "DELETE FROM otp_codes WHERE context_type = 'admin_login' AND context_id = ?"
        )->execute([(string) $admin['id']]);

        $code      = sprintf('%06d', random_int(0, 999999));
        $codeHash  = hash('sha256', $code);
        $expiresAt = date('Y-m-d H:i:s', time() + 600);
        $ip        = client_ip();

        $pdo->prepare(
            "INSERT INTO otp_codes (context_type, context_id, code_hash, purpose, expires_at, ip_address)
             VALUES ('admin_login', ?, ?, 'login', ?, ?)"
        )->execute([(string) $admin['id'], $codeHash, $expiresAt, $ip]);

        smtp_send_mail(
            $admin['email'],
            $admin['name'],
            'Tu código de acceso — Capital Urbano Admin',
            otp_email_html($admin['name'], $code)
        );

        json_respond(['sent' => true]);
        break;
    }

    case 'verify-otp': {
        $email = mb_strtolower(trim($body['email'] ?? ''));
        $code  = trim($body['code'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^\d{6}$/', $code)) {
            json_respond(['error' => 'Datos inválidos'], 400);
        }

        $stmt = $pdo->prepare('SELECT id, name, role FROM admins WHERE email = ? AND is_active = 1');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin) {
            json_respond(['error' => 'Código incorrecto'], 401);
        }

        $codeHash = hash('sha256', $code);
        $otpStmt  = $pdo->prepare(
            "SELECT id FROM otp_codes
             WHERE context_type = 'admin_login' AND context_id = ?
               AND code_hash = ? AND expires_at > NOW() AND used_at IS NULL
             LIMIT 1"
        );
        $otpStmt->execute([(string) $admin['id'], $codeHash]);
        $otp = $otpStmt->fetch();

        if (!$otp) {
            json_respond(['error' => 'Código incorrecto o expirado'], 401);
        }

        $pdo->prepare('UPDATE otp_codes SET used_at = NOW() WHERE id = ?')->execute([$otp['id']]);

        $token     = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $expiresAt = date('Y-m-d H:i:s', time() + 86400 * 7);
        $ip        = client_ip();
        $ua        = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512);

        $pdo->prepare(
            'INSERT INTO admin_sessions (admin_id, token_hash, expires_at, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([$admin['id'], $tokenHash, $expiresAt, $ip, $ua]);

        $pdo->prepare('UPDATE admins SET last_login_at = NOW() WHERE id = ?')->execute([$admin['id']]);

        json_respond([
            'token' => $token,
            'admin' => [
                'id'    => (int) $admin['id'],
                'name'  => $admin['name'],
                'email' => $email,
                'role'  => $admin['role'],
            ],
        ]);
        break;
    }

    case 'verify-session': {
        $token = get_bearer_token();
        if (!$token) {
            json_respond(['valid' => false]);
        }

        $tokenHash = hash('sha256', $token);
        $stmt = $pdo->prepare(
            "SELECT a.id, a.name, a.email, a.role
             FROM admin_sessions s
             JOIN admins a ON a.id = s.admin_id
             WHERE s.token_hash = ? AND s.expires_at > NOW()
               AND s.revoked_at IS NULL AND a.is_active = 1
             LIMIT 1"
        );
        $stmt->execute([$tokenHash]);
        $admin = $stmt->fetch();

        if (!$admin) {
            json_respond(['valid' => false]);
        }

        json_respond(['valid' => true, 'admin' => $admin]);
        break;
    }

    case 'logout': {
        $token = get_bearer_token();
        if ($token) {
            $tokenHash = hash('sha256', $token);
            $pdo->prepare(
                'UPDATE admin_sessions SET revoked_at = NOW() WHERE token_hash = ?'
            )->execute([$tokenHash]);
        }
        json_respond(['ok' => true]);
        break;
    }

    default:
        json_respond(['error' => 'Acción no válida'], 400);
}

