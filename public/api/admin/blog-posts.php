<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';
require_once __DIR__ . '/../_blog.php';

$pdo = db_connect();
$admin = require_admin($pdo);
$method = $_SERVER['REQUEST_METHOD'];
blog_publish_due($pdo);

if ($method === 'GET') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id > 0) {
        $stmt = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            json_respond(['error' => 'Artículo no encontrado'], 404);
        }
        json_respond(['post' => blog_hydrate_post($pdo, $row, true)]);
    }

    $q = trim((string) ($_GET['q'] ?? ''));
    $status = trim((string) ($_GET['status'] ?? ''));
    $categoryId = (int) ($_GET['category_id'] ?? 0);
    $authorId = (int) ($_GET['author_id'] ?? 0);
    $featured = $_GET['featured'] ?? null;

    $where = ['1=1'];
    $params = [];
    if ($q !== '') {
        $where[] = '(p.title LIKE ? OR p.excerpt LIKE ? OR p.slug LIKE ? OR p.meta_keywords LIKE ?)';
        $like = '%' . $q . '%';
        array_push($params, $like, $like, $like, $like);
    }
    if (in_array($status, ['draft', 'scheduled', 'published', 'archived'], true)) {
        $where[] = 'p.status = ?';
        $params[] = $status;
    }
    if ($categoryId > 0) {
        $where[] = 'p.category_id = ?';
        $params[] = $categoryId;
    }
    if ($authorId > 0) {
        $where[] = 'p.author_id = ?';
        $params[] = $authorId;
    }
    if ($featured === '1' || $featured === '0') {
        $where[] = 'p.is_featured = ?';
        $params[] = (int) $featured;
    }

    $sql = 'SELECT p.* FROM blog_posts p WHERE ' . implode(' AND ', $where)
         . ' ORDER BY COALESCE(p.published_at, p.scheduled_at, p.updated_at) DESC, p.id DESC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = [];
    foreach ($stmt->fetchAll() as $row) {
        $posts[] = blog_hydrate_post($pdo, $row, false);
    }
    json_respond([
        'posts' => $posts,
        'featured_count' => blog_featured_count($pdo),
        'featured_max' => blog_max_featured(),
    ]);
}

if ($method === 'POST' || $method === 'PUT') {
    $b = json_body();
    $id = $method === 'PUT' ? (int) ($b['id'] ?? 0) : 0;
    if ($method === 'PUT' && $id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }

    $title = trim((string) ($b['title'] ?? ''));
    if ($title === '') {
        json_respond(['error' => 'Título requerido'], 400);
    }

    $status = (string) ($b['status'] ?? 'draft');
    if (!in_array($status, ['draft', 'scheduled', 'published', 'archived'], true)) {
        $status = 'draft';
    }

    $scheduledAt = blog_normalize_datetime(
        !empty($b['scheduled_at']) ? (string) $b['scheduled_at'] : null
    );
    $publishedAt = blog_normalize_datetime(
        !empty($b['published_at']) ? (string) $b['published_at'] : null
    );

    if ($status === 'scheduled') {
        if (!$scheduledAt) {
            json_respond(['error' => 'Indica fecha/hora de publicación programada'], 400);
        }
        // Past/present schedule → publish immediately
        if (strtotime($scheduledAt) !== false && strtotime($scheduledAt) <= time()) {
            $status = 'published';
            $publishedAt = $publishedAt ?: $scheduledAt;
            $scheduledAt = null;
        }
    } else {
        $scheduledAt = null;
    }

    if ($status === 'published') {
        if (!$publishedAt) {
            $publishedAt = date('Y-m-d H:i:s');
        }
    } elseif ($status === 'draft') {
        // Unpublish: clear dates so public API cannot surface the post
        $publishedAt = null;
        $scheduledAt = null;
    } elseif ($status === 'archived') {
        $scheduledAt = null;
        // Keep published_at for history unless client clears it
        if (array_key_exists('published_at', $b) && ($b['published_at'] === null || $b['published_at'] === '')) {
            $publishedAt = null;
        } elseif ($method === 'POST' && !$publishedAt) {
            $publishedAt = null;
        }
    }

    $autoSeo = !empty($b['auto_seo']);
    $tagIds = is_array($b['tag_ids'] ?? null) ? $b['tag_ids'] : [];
    $tagNames = [];
    if ($tagIds) {
        $in = implode(',', array_fill(0, count($tagIds), '?'));
        $ts = $pdo->prepare("SELECT name FROM blog_tags WHERE id IN ($in)");
        $ts->execute(array_map('intval', $tagIds));
        $tagNames = array_column($ts->fetchAll(), 'name');
    }

    $excerpt = isset($b['excerpt']) ? trim((string) $b['excerpt']) : null;
    $metaTitle = isset($b['meta_title']) ? trim((string) $b['meta_title']) : null;
    $metaDescription = isset($b['meta_description']) ? trim((string) $b['meta_description']) : null;
    $metaKeywords = isset($b['meta_keywords']) ? trim((string) $b['meta_keywords']) : null;

    if ($autoSeo || !$metaTitle || !$metaDescription) {
        $seo = blog_auto_seo($title, $excerpt, $tagNames);
        if ($autoSeo || !$metaTitle) {
            $metaTitle = $seo['meta_title'];
        }
        if ($autoSeo || !$metaDescription) {
            $metaDescription = $seo['meta_description'];
        }
        if ($autoSeo || !$metaKeywords) {
            $metaKeywords = $seo['meta_keywords'];
        }
    }

    $slugInput = trim((string) ($b['slug'] ?? ''));
    $slug = blog_unique_slug($pdo, $slugInput !== '' ? $slugInput : $title, $id ?: null);

    $authorId = isset($b['author_id']) && (int) $b['author_id'] > 0 ? (int) $b['author_id'] : null;
    if ($authorId === null) {
        json_respond(['error' => 'El autor es obligatorio'], 400);
    }
    $authorCheck = $pdo->prepare('SELECT id FROM blog_authors WHERE id = ?');
    $authorCheck->execute([$authorId]);
    if (!$authorCheck->fetchColumn()) {
        json_respond(['error' => 'Autor no válido'], 400);
    }
    $categoryId = isset($b['category_id']) && (int) $b['category_id'] > 0 ? (int) $b['category_id'] : null;
    $hero = isset($b['hero_image_url']) ? trim((string) $b['hero_image_url']) ?: null : null;
    $featured = !empty($b['is_featured']) ? 1 : 0;
    $order = (int) ($b['display_order'] ?? 0);
    $sections = is_array($b['sections'] ?? null) ? $b['sections'] : [];

    if ($method === 'POST') {
        try {
            $pdo->prepare(
                'INSERT INTO blog_posts
                   (slug, title, excerpt, meta_title, meta_description, meta_keywords, hero_image_url,
                    author_id, category_id, status, published_at, scheduled_at, is_featured, display_order)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
            )->execute([
                $slug, $title, $excerpt, $metaTitle, $metaDescription, $metaKeywords, $hero,
                $authorId, $categoryId, $status, $publishedAt, $scheduledAt, $featured, $order,
            ]);
        } catch (PDOException $e) {
            json_respond(['error' => 'No se pudo crear el artículo (¿slug duplicado?)'], 409);
        }
        $id = (int) $pdo->lastInsertId();
    } else {
        // On PUT, if status not published and published_at not explicitly sent, leave DB value unless draft/archive clear
        $fields = [
            'slug' => $slug,
            'title' => $title,
            'excerpt' => $excerpt,
            'meta_title' => $metaTitle,
            'meta_description' => $metaDescription,
            'meta_keywords' => $metaKeywords,
            'hero_image_url' => $hero,
            'author_id' => $authorId,
            'category_id' => $categoryId,
            'status' => $status,
            'scheduled_at' => $scheduledAt,
            'is_featured' => $featured,
            'display_order' => $order,
        ];
        if ($status === 'published' || $status === 'draft' || array_key_exists('published_at', $b)) {
            $fields['published_at'] = $publishedAt;
        }
        if ($status === 'archived' && array_key_exists('published_at', $b)) {
            $fields['published_at'] = $publishedAt;
        }
        $set = [];
        $params = [];
        foreach ($fields as $k => $v) {
            $set[] = "{$k} = ?";
            $params[] = $v;
        }
        $params[] = $id;
        $pdo->prepare('UPDATE blog_posts SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($params);
        $pdo->prepare('DELETE FROM blog_post_sections WHERE post_id = ?')->execute([$id]);
    }

    blog_replace_tags($pdo, $id, $tagIds);
    blog_replace_sections($pdo, $id, $sections);

    $demoted = blog_enforce_featured_limit($pdo, $id, $featured);

    $stmt = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?');
    $stmt->execute([$id]);
    json_respond([
        'success' => true,
        'id' => $id,
        'post' => blog_hydrate_post($pdo, $stmt->fetch(), true),
        'featured_demoted' => $demoted,
        'featured_count' => blog_featured_count($pdo),
        'featured_max' => blog_max_featured(),
    ], $method === 'POST' ? 201 : 200);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_respond(['error' => 'ID inválido'], 400);
    }
    $hard = !empty($_GET['hard']);
    // Soft-archive published content; hard-delete drafts / archived / hard=1
    $stmt = $pdo->prepare('SELECT status FROM blog_posts WHERE id = ?');
    $stmt->execute([$id]);
    $status = $stmt->fetchColumn();
    if ($status === false) {
        json_respond(['error' => 'No encontrado'], 404);
    }
    if (!$hard && ($status === 'published' || $status === 'scheduled')) {
        $pdo->prepare(
            "UPDATE blog_posts SET status = 'archived', is_featured = 0 WHERE id = ?"
        )->execute([$id]);
        json_respond(['success' => true, 'archived' => true]);
    }
    $pdo->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([$id]);
    json_respond(['success' => true, 'deleted' => true]);
}

json_respond(['error' => 'Método no permitido'], 405);
