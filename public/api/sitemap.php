<?php
/**
 * GET /api/sitemap.php — dynamic XML sitemap (also routed as /sitemap.xml via .htaccess).
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';

header('Content-Type: application/xml; charset=utf-8');

$origin = defined('APP_URL') ? rtrim(APP_URL, '/') : 'https://capitalurbanomx.com';
if (str_starts_with($origin, 'http://localhost')) {
    $origin = 'https://capitalurbanomx.com';
}

$static = [
    ['loc' => '/', 'changefreq' => 'weekly', 'priority' => '1.0'],
    ['loc' => '/about', 'changefreq' => 'monthly', 'priority' => '0.8'],
    ['loc' => '/quality', 'changefreq' => 'monthly', 'priority' => '0.8'],
    ['loc' => '/projects', 'changefreq' => 'weekly', 'priority' => '0.9'],
    ['loc' => '/experience', 'changefreq' => 'monthly', 'priority' => '0.7'],
    ['loc' => '/contact', 'changefreq' => 'monthly', 'priority' => '0.8'],
];

$pdo = db_connect();
require_once __DIR__ . '/_blog.php';
$blogEnabled = blog_feature_enabled($pdo);
if ($blogEnabled) {
    $static[] = ['loc' => '/blog', 'changefreq' => 'weekly', 'priority' => '0.8'];
}

$projects = $pdo->query(
    "SELECT slug, updated_at FROM developments WHERE is_active = 1 ORDER BY display_order, name"
)->fetchAll();

$posts = [];
if ($blogEnabled) {
    try {
        $posts = $pdo->query(
            "SELECT slug, updated_at FROM blog_posts
             WHERE status = 'published'
               AND (published_at IS NULL OR published_at <= NOW())
             ORDER BY published_at DESC"
        )->fetchAll();
    } catch (Throwable $e) {
        $posts = [];
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($static as $row) {
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($origin . $row['loc'], ENT_XML1) . "</loc>\n";
    echo '    <changefreq>' . $row['changefreq'] . "</changefreq>\n";
    echo '    <priority>' . $row['priority'] . "</priority>\n";
    echo "  </url>\n";
}

foreach ($projects as $p) {
    $path = '/projects/' . $p['slug'];
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($origin . $path, ENT_XML1) . "</loc>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    if (!empty($p['updated_at'])) {
        echo '    <lastmod>' . date('Y-m-d', strtotime($p['updated_at'])) . "</lastmod>\n";
    }
    echo "  </url>\n";
}

foreach ($posts as $p) {
    $path = '/blog/' . $p['slug'];
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($origin . $path, ENT_XML1) . "</loc>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>0.6</priority>\n";
    if (!empty($p['updated_at'])) {
        echo '    <lastmod>' . date('Y-m-d', strtotime($p['updated_at'])) . "</lastmod>\n";
    }
    echo "  </url>\n";
}

echo "</urlset>\n";
