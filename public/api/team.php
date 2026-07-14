<?php
define('APP_INIT', true);
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_headers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();

$hasTeamSection = false;
try {
    $pdo->query('SELECT team_section FROM team_members LIMIT 1');
    $hasTeamSection = true;
} catch (PDOException $e) {
    $hasTeamSection = false;
}

$sql = $hasTeamSection
    ? 'SELECT id, name, role_title, bio_short, bio, photo_url, linkedin_url, team_section, is_leadership, display_order
       FROM team_members WHERE is_active = 1 ORDER BY display_order ASC'
    : 'SELECT id, name, role_title, bio_short, bio, photo_url, linkedin_url, is_leadership, display_order
       FROM team_members WHERE is_active = 1 ORDER BY is_leadership DESC, display_order ASC';

$rows = $pdo->query($sql)->fetchAll();
json_respond(['members' => $rows]);
