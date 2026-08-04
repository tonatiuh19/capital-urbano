<?php
/**
 * GET /api/blog.php — public blog list / detail
 * Query: ?slug=... | ?category=... | ?tag=... | ?q=... | ?featured=1 | ?page=&limit=
 */
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';
require_once __DIR__ . '/_blog.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
blog_require_feature($pdo);
blog_publish_due($pdo);

$slug = trim((string) ($_GET['slug'] ?? ''));
if ($slug !== '') {
    $stmt = $pdo->prepare(
        "SELECT * FROM blog_posts
         WHERE slug = ?
           AND status = 'published'
           AND published_at IS NOT NULL
           AND published_at <= NOW()
         LIMIT 1"
    );
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) {
        json_respond(['error' => 'Artículo no encontrado', 'post' => null], 404);
    }
    json_respond(['post' => blog_hydrate_post($pdo, $row, true, true)]);
}

$q = trim((string) ($_GET['q'] ?? ''));
$category = trim((string) ($_GET['category'] ?? ''));
$tag = trim((string) ($_GET['tag'] ?? ''));
$featured = $_GET['featured'] ?? null;
$page = max(1, (int) ($_GET['page'] ?? 1));
$limit = min(24, max(1, (int) ($_GET['limit'] ?? 9)));
$offset = ($page - 1) * $limit;

$where = [
    "p.status = 'published'",
    'p.published_at IS NOT NULL',
    'p.published_at <= NOW()',
];
$params = [];

if ($q !== '') {
    $where[] = '(p.title LIKE ? OR p.excerpt LIKE ? OR p.meta_keywords LIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like);
}
if ($category !== '') {
    $where[] = 'c.slug = ?';
    $params[] = $category;
}
if ($tag !== '') {
    $where[] = 'EXISTS (
      SELECT 1 FROM blog_post_tags pt
      INNER JOIN blog_tags t ON t.id = pt.tag_id
      WHERE pt.post_id = p.id AND t.slug = ?
    )';
    $params[] = $tag;
}
if ($featured === '1') {
    $where[] = 'p.is_featured = 1';
}

$whereSql = implode(' AND ', $where);

$countSql = "SELECT COUNT(*) FROM blog_posts p
             LEFT JOIN blog_categories c ON c.id = p.category_id
             WHERE {$whereSql}";
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

$listSql = "SELECT p.* FROM blog_posts p
            LEFT JOIN blog_categories c ON c.id = p.category_id
            WHERE {$whereSql}
            ORDER BY p.is_featured DESC, p.published_at DESC, p.id DESC
            LIMIT {$limit} OFFSET {$offset}";
$listStmt = $pdo->prepare($listSql);
$listStmt->execute($params);

$posts = [];
foreach ($listStmt->fetchAll() as $row) {
    $posts[] = blog_hydrate_post($pdo, $row, false);
}

$categories = $pdo->query(
    "SELECT c.id, c.slug, c.name, COUNT(p.id) AS post_count
     FROM blog_categories c
     INNER JOIN blog_posts p ON p.category_id = c.id
       AND p.status = 'published' AND p.published_at <= NOW()
     WHERE c.is_active = 1
     GROUP BY c.id
     ORDER BY c.display_order ASC, c.name ASC"
)->fetchAll();

json_respond([
    'posts' => $posts,
    'categories' => $categories,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'pages' => (int) ceil($total / $limit),
    ],
]);
