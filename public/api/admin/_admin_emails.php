<?php
/**
 * HTML templates for admin transactional email (Spanish, no emojis).
 */
defined('APP_INIT') or die('Direct access not allowed.');

function admin_email_layout(string $bodyHtml): string {
    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Josefin Sans','Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:48px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#000000;padding:36px 48px;text-align:center;">
            <div style="font-size:11px;letter-spacing:4px;color:#ff9933;font-weight:700;margin-bottom:6px;">CAPITAL URBANO</div>
            <div style="font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.5);">PANEL ADMINISTRATIVO</div>
          </td>
        </tr>
        <tr>
          <td style="padding:48px;">
            {$bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="background:#f8f7f5;padding:20px 48px;text-align:center;border-top:1px solid #ece8e3;">
            <p style="margin:0;font-size:11px;color:#bbb;">&copy; 2026 Capital Urbano. Todos los derechos reservados.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function admin_login_url(): string {
    $base = defined('APP_URL') ? rtrim(APP_URL, '/') : 'https://capitalurbano.com';
    return $base . '/admin/login';
}

function otp_email_html(string $name, string $code): string {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $body = <<<HTML
<p style="margin:0 0 6px;font-size:18px;font-weight:600;color:#000000;">Hola, {$safeName}</p>
<p style="margin:0 0 36px;font-size:14px;color:#888;line-height:1.6;">
  Tu código de acceso de un solo uso para el panel de Capital Urbano.
</p>
<div style="background:#f8f7f5;border-radius:4px;padding:32px;text-align:center;margin-bottom:36px;border:1px solid #e8e4df;">
  <div style="font-size:13px;color:#aaa;letter-spacing:2px;margin-bottom:12px;text-transform:uppercase;">Tu código</div>
  <div style="font-size:44px;font-weight:700;letter-spacing:14px;color:#000000;font-family:monospace;">{$code}</div>
</div>
<p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
  Expira en <strong style="color:#666;">10 minutos</strong>. Si no lo solicitaste, ignora este mensaje.
</p>
HTML;
    return admin_email_layout($body);
}

function admin_welcome_email_html(string $name, string $roleLabel, string $loginUrl): string {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeRole = htmlspecialchars($roleLabel, ENT_QUOTES, 'UTF-8');
    $safeUrl  = htmlspecialchars($loginUrl, ENT_QUOTES, 'UTF-8');
    $body = <<<HTML
<p style="margin:0 0 6px;font-size:18px;font-weight:600;color:#000000;">Hola, {$safeName}</p>
<p style="margin:0 0 24px;font-size:14px;color:#888;line-height:1.6;">
  Tu cuenta en el panel administrativo de Capital Urbano fue creada correctamente.
  Ya puedes ingresar cuando lo necesites.
</p>
<p style="margin:0 0 8px;font-size:12px;color:#aaa;letter-spacing:1px;text-transform:uppercase;">Tu perfil</p>
<p style="margin:0 0 28px;font-size:15px;color:#333;font-weight:600;">{$safeRole}</p>
<p style="margin:0 0 28px;font-size:14px;color:#666;line-height:1.6;">
  Para iniciar sesión, visita el panel con tu correo corporativo. El sistema te enviará
  un código de verificación de un solo uso cada vez que accedas.
</p>
<table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
  <tr>
    <td style="background:#ff9933;border-radius:2px;">
      <a href="{$safeUrl}"
         style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#000000;text-decoration:none;letter-spacing:0.5px;">
        Ir al panel administrativo
      </a>
    </td>
  </tr>
</table>
<p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
  Enlace directo: <a href="{$safeUrl}" style="color:#666;">{$safeUrl}</a><br>
  Si no reconoces este acceso, contacta al superadministrador de inmediato.
</p>
HTML;
    return admin_email_layout($body);
}

function admin_role_label(string $role): string {
    return $role === 'superadmin' ? 'Superadministrador' : 'Administrador';
}
