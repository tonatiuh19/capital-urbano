<?php
/**
 * Shared blog helpers (admin + public).
 */
defined('APP_INIT') or die('Direct access not allowed.');

/**
 * Whether the blog module is enabled (site_settings.feature_blog_enabled only).
 * Missing row → enabled (backwards compatible).
 */
function blog_feature_enabled(PDO $pdo): bool
{
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    try {
        $stmt = $pdo->prepare(
            "SELECT setting_value FROM site_settings WHERE setting_key = 'feature_blog_enabled' LIMIT 1"
        );
        $stmt->execute();
        $value = $stmt->fetchColumn();
        if ($value === false) {
            $cached = true;
            return true;
        }
        $cached = ($value === '1' || $value === 'true' || $value === true);
        return $cached;
    } catch (Throwable $e) {
        $cached = true;
        return true;
    }
}

/** Halt with 404 when the blog feature flag is off. */
function blog_require_feature(PDO $pdo): void
{
    if (!blog_feature_enabled($pdo)) {
        json_respond(['error' => 'El blog está desactivado', 'feature' => 'blog', 'enabled' => false], 404);
    }
}

function blog_slugify(string $text): string
{
    $text = trim(mb_strtolower($text));
    $map = [
        'á'=>'a','à'=>'a','ä'=>'a','â'=>'a','ã'=>'a',
        'é'=>'e','è'=>'e','ë'=>'e','ê'=>'e',
        'í'=>'i','ì'=>'i','ï'=>'i','î'=>'i',
        'ó'=>'o','ò'=>'o','ö'=>'o','ô'=>'o','õ'=>'o',
        'ú'=>'u','ù'=>'u','ü'=>'u','û'=>'u',
        'ñ'=>'n','ç'=>'c',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    $text = trim($text, '-');
    return $text !== '' ? mb_substr($text, 0, 160) : 'articulo';
}

function blog_unique_slug(PDO $pdo, string $base, ?int $excludeId = null): string
{
    return blog_unique_slug_in_table($pdo, 'blog_posts', $base, $excludeId);
}

/**
 * Unique slug for blog_posts | blog_authors | blog_categories | blog_tags.
 */
function blog_unique_slug_in_table(
    PDO $pdo,
    string $table,
    string $base,
    ?int $excludeId = null
): string {
    static $allowed = [
        'blog_posts' => true,
        'blog_authors' => true,
        'blog_categories' => true,
        'blog_tags' => true,
    ];
    if (!isset($allowed[$table])) {
        throw new InvalidArgumentException('Tabla de slug no permitida');
    }
    $slug = blog_slugify($base);
    $candidate = $slug;
    $i = 2;
    while (true) {
        $sql = "SELECT id FROM {$table} WHERE slug = ?";
        $params = [$candidate];
        if ($excludeId) {
            $sql .= ' AND id != ?';
            $params[] = $excludeId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if (!$stmt->fetch()) {
            return $candidate;
        }
        $candidate = mb_substr($slug, 0, 150) . '-' . $i;
        $i++;
    }
}

/** Normalize HTML datetime-local / ISO → MySQL DATETIME (server local time). */
function blog_normalize_datetime(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    if ($value === '') {
        return null;
    }
    $value = str_replace('T', ' ', $value);
    // Drop timezone suffix if present (treat as wall-clock server time)
    $value = preg_replace('/(Z|[+-]\d{2}:?\d{2})$/', '', $value) ?? $value;
    $value = trim($value);
    if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/', $value)) {
        $value .= ':00';
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $value)) {
        $ts = strtotime($value);
        if ($ts === false) {
            return null;
        }
        return date('Y-m-d H:i:s', $ts);
    }
    return $value;
}

/**
 * Sanitize admin-authored embed HTML: strip handlers / javascript: URLs,
 * allow common social embed markup + trusted script CDNs.
 */
function blog_sanitize_embed_html(string $html): string
{
    $html = trim($html);
    if ($html === '') {
        return '';
    }
    // Event handlers
    $html = preg_replace('/\son\w+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $html) ?? '';
    // javascript: / data:text/html URLs
    $html = preg_replace(
        '/\s(href|src|action)\s*=\s*(["\'])\s*(javascript:|data:text\/html)[^"\']*\2/i',
        ' $1=$2#$2',
        $html
    ) ?? '';

    $allowed = '<iframe><blockquote><a><p><div><span><br><strong><em><ul><ol><li><img><script>';
    $html = strip_tags($html, $allowed);

    // Drop scripts that are not from trusted widget hosts
    $html = preg_replace_callback(
        '/<script\b([^>]*)>(.*?)<\/script>/is',
        static function (array $m): string {
            $attrs = $m[1];
            $inner = trim($m[2]);
            if ($inner !== '') {
                return ''; // no inline script bodies
            }
            if (!preg_match('/\bsrc\s*=\s*["\']([^"\']+)["\']/i', $attrs, $sm)) {
                return '';
            }
            $src = $sm[1];
            $trusted = [
                'platform.twitter.com',
                'www.instagram.com',
                'instagram.com',
                'www.tiktok.com',
                'platform.linkedin.com',
                'www.facebook.com',
                'connect.facebook.net',
            ];
            $host = parse_url($src, PHP_URL_HOST);
            if (!$host) {
                return '';
            }
            $host = strtolower($host);
            foreach ($trusted as $ok) {
                if ($host === $ok || str_ends_with($host, '.' . $ok)) {
                    return '<script async src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '"></script>';
                }
            }
            return '';
        },
        $html
    ) ?? $html;

    // Iframe: replace whole element (paired or self-closing); allow only trusted hosts
    $html = preg_replace_callback(
        '/<iframe\b([^>]*)(?:\/>|>(?:.*?)<\/iframe>)/is',
        static function (array $m): string {
            $attrs = $m[1];
            if (!preg_match('/\bsrc\s*=\s*["\']([^"\']+)["\']/i', $attrs, $sm)) {
                return '';
            }
            $src = $sm[1];
            $host = strtolower((string) parse_url($src, PHP_URL_HOST));
            $okHosts = [
                'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com',
                'player.vimeo.com', 'www.instagram.com', 'www.facebook.com',
                'www.linkedin.com', 'www.tiktok.com', 'platform.twitter.com',
            ];
            $allowed = false;
            foreach ($okHosts as $ok) {
                if ($host === $ok || str_ends_with($host, '.' . $ok)) {
                    $allowed = true;
                    break;
                }
            }
            if (!$allowed) {
                return '';
            }
            $safeSrc = htmlspecialchars($src, ENT_QUOTES | ENT_HTML5);
            return '<iframe src="' . $safeSrc . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        },
        $html
    ) ?? $html;

    return trim($html);
}

/** Extract YouTube video id from URL or bare id. */
function blog_youtube_id(string $raw): ?string
{
    $raw = trim($raw);
    if (preg_match('/^[\w-]{11}$/', $raw)) {
        return $raw;
    }
    $parts = parse_url($raw);
    if (!$parts || empty($parts['host'])) {
        return null;
    }
    $host = strtolower(preg_replace('/^www\./', '', $parts['host']));
    $path = $parts['path'] ?? '';
    if ($host === 'youtu.be') {
        $id = ltrim($path, '/');
        $id = explode('/', $id)[0] ?? '';
        return preg_match('/^[\w-]{11}$/', $id) ? $id : null;
    }
    if (str_contains($host, 'youtube.com')) {
        if (preg_match('#^/embed/([\w-]{11})#', $path, $m)) {
            return $m[1];
        }
        if (preg_match('#^/shorts/([\w-]{11})#', $path, $m)) {
            return $m[1];
        }
        parse_str($parts['query'] ?? '', $q);
        $v = $q['v'] ?? '';
        return preg_match('/^[\w-]{11}$/', $v) ? $v : null;
    }
    return null;
}

/**
 * Build iframe embed HTML from a public social post URL.
 * @return array{url:string,html:string,provider:string}|null
 */
function blog_build_embed_from_url(string $rawUrl): ?array
{
    $rawUrl = trim($rawUrl);
    if ($rawUrl === '' || str_starts_with($rawUrl, '<')) {
        return null;
    }

    $yt = blog_youtube_id($rawUrl);
    if ($yt) {
        $src = 'https://www.youtube.com/embed/' . $yt;
        return [
            'url' => $rawUrl,
            'provider' => 'youtube',
            'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        ];
    }

    $parts = parse_url($rawUrl);
    if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
        return null;
    }
    if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) {
        return null;
    }
    $host = strtolower(preg_replace('/^www\./', '', $parts['host']));
    $path = $parts['path'] ?? '';

    if ($host === 'vimeo.com' || str_ends_with($host, '.vimeo.com')) {
        if (preg_match('#/(\d+)#', $path, $m)) {
            $src = 'https://player.vimeo.com/video/' . $m[1];
            return [
                'url' => $rawUrl,
                'provider' => 'vimeo',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
    }

    if ($host === 'instagram.com' || str_ends_with($host, '.instagram.com')) {
        if (preg_match('#/(p|reel|tv|reels)/([A-Za-z0-9_-]+)#', $path, $m)) {
            $kind = $m[1] === 'reels' ? 'reel' : $m[1];
            $src = 'https://www.instagram.com/' . $kind . '/' . $m[2] . '/embed';
            return [
                'url' => $rawUrl,
                'provider' => 'instagram',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
    }

    if ($host === 'tiktok.com' || str_ends_with($host, '.tiktok.com')) {
        if (preg_match('#/video/(\d+)#', $path, $m)) {
            $src = 'https://www.tiktok.com/embed/v2/' . $m[1];
            return [
                'url' => $rawUrl,
                'provider' => 'tiktok',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
    }

    if (in_array($host, ['twitter.com', 'x.com', 'mobile.twitter.com'], true)) {
        if (preg_match('#/status/(\d+)#', $path, $m)) {
            $src = 'https://platform.twitter.com/embed/Tweet.html?id=' . $m[1];
            return [
                'url' => $rawUrl,
                'provider' => 'x',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
    }

    if ($host === 'facebook.com' || $host === 'fb.watch' || str_ends_with($host, '.facebook.com')) {
        $isPost = $host === 'fb.watch'
            || preg_match('#/(posts|videos|watch|permalink\.php|share|reel|photo)\b#i', $path)
            || (isset($parts['query']) && (str_contains($parts['query'], 'story_fbid=') || preg_match('/(?:^|&)v=/', $parts['query'])));
        if ($isPost) {
            $href = rawurlencode(explode('#', $rawUrl, 2)[0]);
            $src = 'https://www.facebook.com/plugins/post.php?href=' . $href . '&show_text=true&width=550';
            return [
                'url' => $rawUrl,
                'provider' => 'facebook',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
    }

    if ($host === 'linkedin.com' || str_ends_with($host, '.linkedin.com')) {
        if (str_contains($path, '/embed/feed/update/')) {
            $src = explode('?', $rawUrl, 2)[0];
            return [
                'url' => $rawUrl,
                'provider' => 'linkedin',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
        $activity = null;
        if (preg_match('/activity-(\d+)/', $path, $m)) {
            $activity = $m[1];
        }
        if ($activity) {
            $src = 'https://www.linkedin.com/embed/feed/update/urn:li:activity:' . $activity;
            return [
                'url' => $rawUrl,
                'provider' => 'linkedin',
                'html' => '<iframe src="' . htmlspecialchars($src, ENT_QUOTES | ENT_HTML5) . '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            ];
        }
    }

    return null;
}

function blog_normalize_section_meta(string $type, $meta, ?string $body = null): ?array
{
    if (!is_array($meta)) {
        $meta = blog_decode_meta($meta) ?? [];
    }
    switch ($type) {
        case 'gallery':
            $images = [];
            if (isset($meta['images']) && is_array($meta['images'])) {
                foreach ($meta['images'] as $img) {
                    $img = trim((string) $img);
                    if ($img !== '') {
                        $images[] = $img;
                    }
                }
            }
            return ['images' => array_values(array_unique($images))];
        case 'youtube':
            $raw = trim((string) ($meta['youtube'] ?? ''));
            return ['youtube' => $raw];
        case 'embed': {
            $url = trim((string) ($meta['url'] ?? ''));
            $html = trim((string) ($meta['html'] ?? $body ?? ''));
            $provider = trim((string) ($meta['provider'] ?? ''));

            // Prefer explicit URL → auto embed
            $source = $url !== '' ? $url : ((!str_starts_with($html, '<')) ? $html : '');
            if ($source !== '') {
                $built = blog_build_embed_from_url($source);
                if ($built) {
                    return $built;
                }
            }

            // Raw HTML paste (legacy / advanced)
            if ($html !== '' && str_starts_with($html, '<')) {
                $out = ['html' => blog_sanitize_embed_html($html)];
                if ($url !== '') {
                    $out['url'] = $url;
                }
                if ($provider !== '') {
                    $out['provider'] = $provider;
                }
                return $out;
            }

            if ($url !== '') {
                return ['url' => $url, 'html' => '', 'provider' => $provider];
            }
            return ['html' => blog_sanitize_embed_html($html)];
        }
        case 'cta':
            $href = trim((string) ($meta['href'] ?? '/contact'));
            if ($href === '') {
                $href = '/contact';
            }
            // Block javascript: URLs
            if (preg_match('/^\s*javascript:/i', $href)) {
                $href = '/contact';
            }
            return ['href' => $href];
        default:
            return $meta ?: null;
    }
}

/** Promote scheduled posts whose scheduled_at has passed. */
function blog_publish_due(PDO $pdo): int
{
    $stmt = $pdo->prepare(
        "UPDATE blog_posts
         SET status = 'published',
             published_at = COALESCE(published_at, scheduled_at, NOW()),
             scheduled_at = NULL
         WHERE status = 'scheduled'
           AND scheduled_at IS NOT NULL
           AND scheduled_at <= NOW()"
    );
    $stmt->execute();
    return $stmt->rowCount();
}

/** Max posts that can be featured (home + blog spotlight). */
function blog_max_featured(): int
{
    return 3;
}

/**
 * Keep at most N featured posts. When $postId is featured, demote the oldest
 * other featured posts so the limit holds. Returns how many were demoted.
 */
function blog_enforce_featured_limit(PDO $pdo, int $postId, int $isFeatured): int
{
    $limit = blog_max_featured();
    if ($isFeatured !== 1 || $postId <= 0) {
        return 0;
    }
    $countStmt = $pdo->prepare(
        'SELECT COUNT(*) FROM blog_posts WHERE is_featured = 1 AND id != ?'
    );
    $countStmt->execute([$postId]);
    $others = (int) $countStmt->fetchColumn();
    $allowedOthers = max(0, $limit - 1);
    if ($others <= $allowedOthers) {
        return 0;
    }
    $extra = $others - $allowedOthers;
    $stmt = $pdo->prepare(
        "UPDATE blog_posts
         SET is_featured = 0
         WHERE id IN (
           SELECT id FROM (
             SELECT id FROM blog_posts
             WHERE is_featured = 1 AND id != ?
             ORDER BY COALESCE(published_at, updated_at) ASC, id ASC
             LIMIT {$extra}
           ) AS old_featured
         )"
    );
    $stmt->execute([$postId]);
    return $stmt->rowCount();
}

function blog_featured_count(PDO $pdo): int
{
    return (int) $pdo->query(
        'SELECT COUNT(*) FROM blog_posts WHERE is_featured = 1'
    )->fetchColumn();
}

function blog_decode_meta($raw): ?array
{
    if ($raw === null || $raw === '') {
        return null;
    }
    if (is_array($raw)) {
        return $raw;
    }
    $decoded = json_decode((string) $raw, true);
    return is_array($decoded) ? $decoded : null;
}

function blog_fetch_tags(PDO $pdo, int $postId): array
{
    $stmt = $pdo->prepare(
        "SELECT t.id, t.slug, t.name
         FROM blog_tags t
         INNER JOIN blog_post_tags pt ON pt.tag_id = t.id
         WHERE pt.post_id = ?
         ORDER BY t.name ASC"
    );
    $stmt->execute([$postId]);
    return $stmt->fetchAll();
}

function blog_fetch_sections(PDO $pdo, int $postId, bool $activeOnly = true): array
{
    $sql = 'SELECT id, section_type, title, body, image_url, meta_json, display_order, is_active
            FROM blog_post_sections WHERE post_id = ?';
    if ($activeOnly) {
        $sql .= ' AND is_active = 1';
    }
    $sql .= ' ORDER BY display_order ASC, id ASC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$postId]);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        $row['meta_json'] = blog_decode_meta($row['meta_json'] ?? null);
        $row['id'] = (int) $row['id'];
        $row['display_order'] = (int) $row['display_order'];
        $row['is_active'] = (int) ($row['is_active'] ?? 1);
    }
    unset($row);
    return $rows;
}

function blog_hydrate_post(
    PDO $pdo,
    array $row,
    bool $withSections = false,
    bool $activeSectionsOnly = false
): array {
    $id = (int) $row['id'];
    $row['id'] = $id;
    $row['author_id'] = $row['author_id'] !== null ? (int) $row['author_id'] : null;
    $row['category_id'] = $row['category_id'] !== null ? (int) $row['category_id'] : null;
    $row['is_featured'] = (int) ($row['is_featured'] ?? 0);
    $row['display_order'] = (int) ($row['display_order'] ?? 0);

    if (!empty($row['author_id'])) {
        $a = $pdo->prepare(
            'SELECT id, slug, name, role_title, bio, photo_url FROM blog_authors WHERE id = ?'
        );
        $a->execute([$row['author_id']]);
        $row['author'] = $a->fetch() ?: null;
        if ($row['author']) {
            $row['author']['id'] = (int) $row['author']['id'];
        }
    } else {
        $row['author'] = null;
    }

    if (!empty($row['category_id'])) {
        $c = $pdo->prepare('SELECT id, slug, name, description FROM blog_categories WHERE id = ?');
        $c->execute([$row['category_id']]);
        $row['category'] = $c->fetch() ?: null;
        if ($row['category']) {
            $row['category']['id'] = (int) $row['category']['id'];
        }
    } else {
        $row['category'] = null;
    }

    $row['tags'] = blog_fetch_tags($pdo, $id);
    $row['tag_ids'] = array_map(static fn ($t) => (int) $t['id'], $row['tags']);

    if ($withSections) {
        $row['sections'] = blog_fetch_sections($pdo, $id, $activeSectionsOnly);
    }

    return $row;
}

function blog_replace_tags(PDO $pdo, int $postId, array $tagIds): void
{
    $pdo->prepare('DELETE FROM blog_post_tags WHERE post_id = ?')->execute([$postId]);
    $ins = $pdo->prepare('INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)');
    $seen = [];
    foreach ($tagIds as $tid) {
        $tid = (int) $tid;
        if ($tid <= 0 || isset($seen[$tid])) {
            continue;
        }
        $seen[$tid] = true;
        $ins->execute([$postId, $tid]);
    }
}

function blog_replace_sections(PDO $pdo, int $postId, array $sections): void
{
    $pdo->prepare('DELETE FROM blog_post_sections WHERE post_id = ?')->execute([$postId]);
    $ins = $pdo->prepare(
        'INSERT INTO blog_post_sections
           (post_id, section_type, title, body, image_url, meta_json, display_order, is_active)
         VALUES (?,?,?,?,?,?,?,?)'
    );
    $allowed = ['text','heading','image','gallery','youtube','embed','quote','cta'];
    foreach ($sections as $i => $s) {
        if (!is_array($s)) {
            continue;
        }
        $type = (string) ($s['section_type'] ?? 'text');
        if (!in_array($type, $allowed, true)) {
            $type = 'text';
        }
        $body = isset($s['body']) ? (string) $s['body'] : null;
        $normalized = blog_normalize_section_meta($type, $s['meta_json'] ?? null, $body);
        $meta = $normalized !== null
            ? json_encode($normalized, JSON_UNESCAPED_UNICODE)
            : null;
        if ($type === 'embed' && is_array($normalized) && isset($normalized['html'])) {
            // Keep sanitized HTML also in body for simpler consumers
            $body = (string) $normalized['html'];
        }
        // Skip empty gallery / youtube / embed sections that have no usable media
        if ($type === 'gallery' && empty($normalized['images'])) {
            continue;
        }
        if ($type === 'youtube' && empty(trim((string) ($normalized['youtube'] ?? '')))) {
            continue;
        }
        if ($type === 'embed' && trim((string) ($normalized['html'] ?? '')) === '') {
            continue;
        }
        $ins->execute([
            $postId,
            $type,
            isset($s['title']) ? trim((string) $s['title']) ?: null : null,
            $body,
            isset($s['image_url']) ? trim((string) $s['image_url']) ?: null : null,
            $meta,
            isset($s['display_order']) ? (int) $s['display_order'] : $i,
            isset($s['is_active']) ? (int) (bool) $s['is_active'] : 1,
        ]);
    }
}

function blog_auto_seo(string $title, ?string $excerpt, array $tagNames = []): array
{
    $title = trim($title);
    $metaTitle = mb_substr($title, 0, 60);
    $descSource = trim((string) $excerpt);
    if ($descSource === '') {
        $descSource = $title . ' — Capital Urbano, desarrolladora de vivienda vertical en Guadalajara.';
    }
    $metaDescription = mb_substr($descSource, 0, 160);
    $keywords = array_merge(
        ['Capital Urbano', 'Guadalajara', 'vivienda vertical', 'desarrollo inmobiliario'],
        $tagNames
    );
    $keywords = array_values(array_unique(array_filter(array_map('trim', $keywords))));
    return [
        'meta_title' => $metaTitle,
        'meta_description' => $metaDescription,
        'meta_keywords' => mb_substr(implode(', ', $keywords), 0, 320),
    ];
}
