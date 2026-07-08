<?php
require_once __DIR__ . '/_init.php';
require_once __DIR__ . '/_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_respond(['error' => 'Método no permitido'], 405);
}

$pdo = db_connect();
$admin = require_admin($pdo);

$stats = [
    'developments_active' => (int) $pdo->query('SELECT COUNT(*) FROM developments WHERE is_active = 1')->fetchColumn(),
    'contacts_new'        => (int) $pdo->query("SELECT COUNT(*) FROM contact_submissions WHERE status = 'new'")->fetchColumn(),
    'contacts_total'      => (int) $pdo->query('SELECT COUNT(*) FROM contact_submissions')->fetchColumn(),
    'clients_total'       => (int) $pdo->query('SELECT COUNT(*) FROM clients')->fetchColumn(),
    'newsletter_active'   => (int) $pdo->query("SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'subscribed'")->fetchColumn(),
    'faq_active'          => (int) $pdo->query('SELECT COUNT(*) FROM faq_items WHERE is_active = 1')->fetchColumn(),
];

$recent = $pdo->query(
    "SELECT id, name, email, subject, status, created_at FROM contact_submissions
     ORDER BY created_at DESC LIMIT 5"
)->fetchAll();

json_respond([
    'admin'  => [
        'id'    => (int) $admin['id'],
        'name'  => $admin['name'],
        'email' => $admin['email'],
        'role'  => $admin['role'],
    ],
    'stats'  => $stats,
    'recent_contacts' => $recent,
]);
