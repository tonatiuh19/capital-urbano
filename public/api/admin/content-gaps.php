<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
require_admin($pdo);

$settings = [];
try {
    foreach ($pdo->query('SELECT setting_key, setting_value FROM site_settings')->fetchAll() as $row) {
        $settings[$row['setting_key']] = $row['setting_value'] ?? '';
    }
} catch (Throwable $e) {
    $settings = [];
}

$members = [];
try {
    $hasTeamSection = false;
    $cols = $pdo->query('SHOW COLUMNS FROM team_members')->fetchAll(PDO::FETCH_COLUMN);
    $hasTeamSection = in_array('team_section', $cols, true);

    if ($hasTeamSection) {
        $members = $pdo->query(
            'SELECT name, role_title, bio_short, bio, photo_url, team_section, is_leadership, is_active
             FROM team_members ORDER BY display_order'
        )->fetchAll();
    } else {
        $members = $pdo->query(
            'SELECT name, role_title, bio_short, bio, photo_url, is_leadership, is_active
             FROM team_members ORDER BY display_order'
        )->fetchAll();
    }
} catch (Throwable $e) {
    $members = [];
}

$blog = null;
try {
    require_once __DIR__ . '/../_blog.php';
    if (blog_feature_enabled($pdo)) {
        $blog = [
            'published_count' => 0,
            'author_count' => 0,
            'category_count' => 0,
            'scheduled_count' => 0,
        ];
        $blog['published_count'] = (int) $pdo->query(
            "SELECT COUNT(*) FROM blog_posts
             WHERE status = 'published'
               AND published_at IS NOT NULL
               AND published_at <= NOW()"
        )->fetchColumn();
        $blog['author_count'] = (int) $pdo->query(
            'SELECT COUNT(*) FROM blog_authors WHERE is_active = 1'
        )->fetchColumn();
        $blog['category_count'] = (int) $pdo->query(
            'SELECT COUNT(*) FROM blog_categories WHERE is_active = 1'
        )->fetchColumn();
        $blog['scheduled_count'] = (int) $pdo->query(
            "SELECT COUNT(*) FROM blog_posts WHERE status = 'scheduled'"
        )->fetchColumn();
    }
} catch (Throwable $e) {
    $blog = null;
}

json_respond([
    'settings' => $settings,
    'team_members' => $members,
    'blog' => $blog,
]);
