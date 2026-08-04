<?php
/**
 * Cron: promote scheduled blog posts.
 * Usage: GET /api/cron/publish-blog.php?secret=CRON_SECRET
 */
define('APP_INIT', true);
require_once __DIR__ . '/../_config.php';
require_once __DIR__ . '/../_headers.php';
require_once __DIR__ . '/../_blog.php';

$secret = (string) ($_GET['secret'] ?? '');
if (!defined('CRON_SECRET') || CRON_SECRET === '' || !hash_equals(CRON_SECRET, $secret)) {
    json_respond(['error' => 'No autorizado'], 401);
}

$pdo = db_connect();
if (!blog_feature_enabled($pdo)) {
    json_respond(['ok' => true, 'published' => 0, 'feature' => 'blog', 'enabled' => false]);
}
$n = blog_publish_due($pdo);
json_respond(['ok' => true, 'published' => $n]);
