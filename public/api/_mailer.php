<?php
/**
 * _mailer.php — Self-contained SMTP mailer (no Composer dependencies).
 */
defined('APP_INIT') or die('Direct access not allowed.');

function smtp_send_mail(
    string $to_email,
    string $to_name,
    string $subject,
    string $html,
    array  $attachments = []
): bool {
    $host       = defined('SMTP_HOST') ? SMTP_HOST : 'localhost';
    $port       = defined('SMTP_PORT') ? (int)SMTP_PORT : 25;
    $encryption = defined('SMTP_ENCRYPTION') ? strtolower(SMTP_ENCRYPTION) : '';
    $user       = defined('SMTP_USER') ? SMTP_USER : '';
    $pass       = defined('SMTP_PASS') ? SMTP_PASS : '';
    $fromAddr   = defined('SMTP_USER') ? SMTP_USER : 'noreply@capitalurbano.com';
    $fromName   = defined('SMTP_FROM_NAME') ? SMTP_FROM_NAME : 'Capital Urbano';

    $address = ($encryption === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $errno   = 0;
    $errstr  = '';
    $conn    = @stream_socket_client($address, $errno, $errstr, 15);

    if (!$conn) {
        throw new RuntimeException("SMTP connect failed: {$errstr} ({$errno})");
    }

    stream_set_timeout($conn, 15);

    $read = function () use ($conn): string {
        $buf = '';
        while (!feof($conn)) {
            $line = fgets($conn, 512);
            $buf .= $line;
            if (strlen($line) >= 4 && $line[3] === ' ') {
                break;
            }
        }
        return $buf;
    };

    $cmd = function (string $command) use ($conn, $read): string {
        fwrite($conn, $command . "\r\n");
        return $read();
    };

    $expect = function (string $response, string $code) {
        if (substr(trim($response), 0, 3) !== $code) {
            throw new RuntimeException('SMTP error (expected ' . $code . '): ' . trim($response));
        }
    };

    $ehloHost = parse_url(defined('APP_URL') ? APP_URL : 'https://capitalurbano.com', PHP_URL_HOST) ?: 'capitalurbano.com';

    $expect($read(), '220');
    $expect($cmd("EHLO {$ehloHost}"), '250');

    if ($encryption === 'tls') {
        $expect($cmd('STARTTLS'), '220');
        stream_socket_enable_crypto($conn, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT);
        $expect($cmd("EHLO {$ehloHost}"), '250');
    }

    if ($user !== '' && $pass !== '') {
        $expect($cmd('AUTH LOGIN'), '334');
        $expect($cmd(base64_encode($user)), '334');
        $expect($cmd(base64_encode($pass)), '235');
    }

    $expect($cmd("MAIL FROM:<{$fromAddr}>"), '250');
    $expect($cmd("RCPT TO:<{$to_email}>"), '250');
    $expect($cmd('DATA'), '354');

    $boundary    = '----CU_BOUNDARY_' . bin2hex(random_bytes(8));
    $fromEncoded = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $toEncoded   = '=?UTF-8?B?' . base64_encode($to_name) . '?=';
    $subEncoded  = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $msgId       = '<' . time() . '.' . bin2hex(random_bytes(6)) . "@{$ehloHost}>";
    $date        = date('r');

    $headers  = "Date: {$date}\r\n";
    $headers .= "From: {$fromEncoded} <{$fromAddr}>\r\n";
    $headers .= "To: {$toEncoded} <{$to_email}>\r\n";
    $headers .= "Subject: {$subEncoded}\r\n";
    $headers .= "Message-ID: {$msgId}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "X-Mailer: CAPITAL-URBANO-PHP\r\n";

    if (empty($attachments)) {
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";
        $body = chunk_split(base64_encode($html));
    } else {
        $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
        $body  = "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($html)) . "\r\n";
        foreach ($attachments as $att) {
            $b64name = '=?UTF-8?B?' . base64_encode($att['name']) . '?=';
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: {$att['mime']}; name=\"{$b64name}\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"{$b64name}\"\r\n\r\n";
            $body .= chunk_split(base64_encode($att['data'])) . "\r\n";
        }
        $body .= "--{$boundary}--\r\n";
    }

    $message = $headers . "\r\n" . $body;
    $message = preg_replace('/^\.$/m', '..', $message);

    fwrite($conn, $message . "\r\n.\r\n");
    $expect($read(), '250');
    $cmd('QUIT');
    fclose($conn);

    return true;
}
