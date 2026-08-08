<?php
/**
 * Contact form email templates (Spanish, Capital Urbano brand).
 */
defined('APP_INIT') or die('Direct access not allowed.');

function contact_public_site_url(): string
{
    if (defined('SITE_PUBLIC_URL') && SITE_PUBLIC_URL !== '') {
        return rtrim((string) SITE_PUBLIC_URL, '/');
    }
    if (defined('APP_ENV') && APP_ENV === 'development') {
        return 'https://capitalurbanomx.com';
    }
    return defined('APP_URL') ? rtrim((string) APP_URL, '/') : 'https://capitalurbanomx.com';
}

function contact_interest_label(string $interest): string
{
    return match ($interest) {
        'investment'  => 'Inversión',
        'partnership' => 'Alianzas',
        'press'       => 'Prensa',
        'acquisition' => 'Adquisición',
        'other'       => 'Otro',
        default       => 'General',
    };
}

/**
 * Always notify contacto@capitalurbanogdl.com, plus site_settings.contact_email
 * and optional CONTACT_NOTIFY_EMAIL when different.
 *
 * @return list<string>
 */
function contact_admin_recipients(?PDO $pdo): array
{
    $recipients = ['contacto@capitalurbanogdl.com'];

    if (defined('CONTACT_NOTIFY_EMAIL') && CONTACT_NOTIFY_EMAIL !== '') {
        $recipients[] = (string) CONTACT_NOTIFY_EMAIL;
    }

    if ($pdo instanceof PDO) {
        try {
            $stmt = $pdo->prepare(
                "SELECT setting_value FROM site_settings WHERE setting_key = 'contact_email' LIMIT 1"
            );
            $stmt->execute();
            $configured = trim((string) ($stmt->fetchColumn() ?: ''));
            if ($configured !== '') {
                $recipients[] = $configured;
            }
        } catch (Throwable $e) {
            error_log('[contact] contact_email lookup: ' . $e->getMessage());
        }
    }

    $unique = [];
    foreach ($recipients as $addr) {
        $addr = mb_strtolower(trim($addr));
        if ($addr !== '' && filter_var($addr, FILTER_VALIDATE_EMAIL)) {
            $unique[$addr] = true;
        }
    }

    return array_keys($unique);
}

function contact_log_email(
    ?PDO $pdo,
    string $recipientEmail,
    string $recipientName,
    string $templateType,
    int $contactId,
    string $subject,
    string $status,
    ?string $mailerResponse = null
): void {
    if (!$pdo instanceof PDO) {
        return;
    }
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO email_logs
                (recipient_email, recipient_name, template_type, contact_id, subject, status, mailer_response)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $recipientEmail,
            $recipientName,
            $templateType,
            $contactId > 0 ? $contactId : null,
            $subject,
            $status,
            $mailerResponse,
        ]);
    } catch (Throwable $e) {
        error_log('[contact] email_logs: ' . $e->getMessage());
    }
}

function contact_notification_html(
    string $name,
    string $email,
    string $phone,
    string $interest,
    string $subjectLine,
    string $message,
    int $id
): string {
    $interestLabel = htmlspecialchars(contact_interest_label($interest), ENT_QUOTES, 'UTF-8');
    $safeName      = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail     = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safePhone     = htmlspecialchars($phone !== '' ? $phone : '—', ENT_QUOTES, 'UTF-8');
    $safeSubject   = htmlspecialchars($subjectLine !== '' ? $subjectLine : '—', ENT_QUOTES, 'UTF-8');
    $safeMessage   = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
    $ref           = $id > 0 ? "#CONT-{$id}" : '';
    $adminUrl      = contact_public_site_url() . '/admin/contactos';

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nueva consulta</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:48px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:2px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a1a;padding:28px 40px;text-align:center;">
          <div style="font-size:18px;font-weight:700;letter-spacing:0.5px;color:#fff;">CAPITAL URBANO</div>
          <div style="font-size:10px;letter-spacing:2px;color:#ff9933;margin-top:8px;">NUEVA CONSULTA {$ref}</div>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;">
              <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Nombre</span><br>
              <strong style="color:#1a1a1a;">{$safeName}</strong>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;">
              <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Correo</span><br>
              <a href="mailto:{$safeEmail}" style="color:#ff9933;">{$safeEmail}</a>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;">
              <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Teléfono</span><br>
              <strong style="color:#1a1a1a;">{$safePhone}</strong>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;">
              <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Interés</span><br>
              <strong style="color:#1a1a1a;">{$interestLabel}</strong>
            </td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;">
              <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Asunto</span><br>
              <strong style="color:#1a1a1a;">{$safeSubject}</strong>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <span style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Mensaje</span><br>
              <p style="color:#555;line-height:1.6;margin:8px 0 0;">{$safeMessage}</p>
            </td></tr>
          </table>
          <p style="margin:28px 0 0;text-align:center;">
            <a href="{$adminUrl}" style="display:inline-block;background:#ff9933;color:#fff;text-decoration:none;padding:12px 24px;font-size:12px;font-weight:700;letter-spacing:0.5px;">Ver en el panel</a>
          </p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;font-size:11px;color:#bbb;">© 2026 Capital Urbano · Guadalajara, Jalisco</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function contact_confirmation_html(string $name, string $interest): string
{
    $interestLabel = htmlspecialchars(contact_interest_label($interest), ENT_QUOTES, 'UTF-8');
    $firstName     = htmlspecialchars(explode(' ', trim($name))[0] ?: $name, ENT_QUOTES, 'UTF-8');
    $siteUrl       = contact_public_site_url();

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Mensaje recibido</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:48px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:2px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
          <div style="font-size:18px;font-weight:700;letter-spacing:0.5px;color:#fff;">CAPITAL URBANO</div>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">
            Hola, {$firstName}
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#666;line-height:1.6;">
            Recibimos tu mensaje. Nuestro equipo lo revisará y se pondrá en contacto contigo a la brevedad.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <div style="font-size:10px;letter-spacing:2px;color:#ff9933;font-weight:700;margin-bottom:12px;">
                TU CONSULTA
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px;color:#999;padding-bottom:6px;">Interés</td>
                  <td style="font-size:13px;font-weight:600;color:#1a1a1a;text-align:right;padding-bottom:6px;">{$interestLabel}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#999;">Tiempo de respuesta</td>
                  <td style="font-size:13px;font-weight:600;color:#1a1a1a;text-align:right;">24–48 horas hábiles</td>
                </tr>
              </table>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">
            Mientras tanto, puedes conocer nuestros proyectos en
            <a href="{$siteUrl}/projects" style="color:#ff9933;text-decoration:none;">capitalurbanomx.com</a>
          </p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;font-size:11px;color:#bbb;">© 2026 Capital Urbano · Guadalajara, Jalisco</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
