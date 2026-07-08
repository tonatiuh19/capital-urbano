<?php
/**
 * GET /api/liv-feed.php?slug=liv-capital
 * Proxies live public data from livcapitalgdl.mx (avoids browser CORS).
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$slug = trim($_GET['slug'] ?? 'liv-capital');

/** Known LIV microsites — extend when new product sites launch. */
$registry = [
    'liv-capital' => 'https://livcapitalgdl.mx',
];

if (!isset($registry[$slug])) {
    json_respond(['error' => 'Proyecto LIV no configurado'], 404);
}

$base = rtrim($registry[$slug], '/');
$cacheTtl = 300;
$cacheFile = sys_get_temp_dir() . '/cu-liv-feed-' . preg_replace('/[^a-z0-9_-]/', '', $slug) . '.json';

if (is_readable($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTtl) {
    $cached = json_decode((string) file_get_contents($cacheFile), true);
    if (is_array($cached)) {
        $cached['cached'] = true;
        json_respond($cached);
    }
}

$paths = [
    'config'     => '/api/site-config.php',
    'amenities'  => '/api/amenities.php',
    'gallery'    => '/api/gallery.php',
    'models'     => '/api/models.php',
    'location'   => '/api/location.php',
];

$payload = [
    'slug'       => $slug,
    'source'     => $base,
    'fetched_at' => gmdate('c'),
    'cached'     => false,
];

$errors = [];
foreach ($paths as $key => $path) {
    $result = liv_http_get($base . $path);
    if ($result === null) {
        $errors[] = $key;
        $payload[$key] = null;
        continue;
    }
    $payload[$key] = $result;
}

if (count($errors) === count($paths)) {
    json_respond(['error' => 'No se pudo contactar el sitio LIV', 'slug' => $slug], 502);
}

$payload['partial_errors'] = $errors ?: null;

@file_put_contents($cacheFile, json_encode($payload, JSON_UNESCAPED_UNICODE));

json_respond($payload);

function liv_http_get(string $url): ?array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 12,
            CURLOPT_CONNECTTIMEOUT => 6,
            CURLOPT_USERAGENT      => 'CapitalUrbano-LivFeed/1.0',
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($body === false || $code < 200 || $code >= 300) {
            return null;
        }
    } else {
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 12,
                'header'  => "User-Agent: CapitalUrbano-LivFeed/1.0\r\n",
            ],
        ]);
        $body = @file_get_contents($url, false, $ctx);
        if ($body === false) {
            return null;
        }
    }

    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}
