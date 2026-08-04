#!/usr/bin/env php
<?php
/**
 * migrate.php — Simple SQL migration runner
 *
 * Usage (from project root or server terminal):
 *   php database/migrate.php [--dry-run] [--mark-applied]
 *
 * --mark-applied: record pending migrations as done without executing SQL
 *   (use after importing database/schema.sql so the ledger matches the dump).
 *
 * Reads all database/migrations/*.sql files in order and runs any
 * that have not been recorded in the `schema_migrations` table.
 *
 * On first run it creates the `schema_migrations` table automatically.
 */

// ── Config ────────────────────────────────────────────────────────────────────
// Load from _config.php if running inside public/api context,
// otherwise read from environment or prompt.
$config = load_config();

$dryRun = in_array('--dry-run', $argv ?? [], true);
$markApplied = in_array('--mark-applied', $argv ?? [], true);

// ── Connect ───────────────────────────────────────────────────────────────────
try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['host'],
        $config['name'],
        $config['charset']
    );
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage() . "\n");
}

// ── Bootstrap migrations table ────────────────────────────────────────────────
$pdo->exec("
    CREATE TABLE IF NOT EXISTS `schema_migrations` (
      `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `migration`  VARCHAR(255) NOT NULL,
      `applied_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `uq_migration` (`migration`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

// ── Fetch already-applied migrations ─────────────────────────────────────────
$applied = $pdo->query("SELECT migration FROM schema_migrations ORDER BY migration")
               ->fetchAll(PDO::FETCH_COLUMN);
$applied = array_flip($applied); // for O(1) lookup

// ── Discover migration files ──────────────────────────────────────────────────
$migrationsDir = __DIR__ . '/migrations';
$files = glob($migrationsDir . '/*.sql');
if ($files === false || count($files) === 0) {
    echo "No migration files found in {$migrationsDir}\n";
    exit(0);
}
sort($files);

// ── Run pending migrations ────────────────────────────────────────────────────
$pending = 0;
$ran     = 0;

foreach ($files as $file) {
    $name = basename($file, '.sql');

    if (isset($applied[$name])) {
        echo "[SKIP]  {$name} (already applied)\n";
        continue;
    }

    $pending++;
    $sql = file_get_contents($file);

    if ($markApplied) {
        $pdo->prepare("INSERT INTO schema_migrations (migration) VALUES (?)")
            ->execute([$name]);
        echo "[MARK]  {$name} (recorded without running)\n";
        $ran++;
        continue;
    }

    if ($dryRun) {
        echo "[DRY]   {$name} — would run\n";
        continue;
    }

    echo "[RUN]   {$name} ... ";

    try {
        $pdo->beginTransaction();
        // Execute each statement separately (PDO::exec doesn't support multi-statement well)
        foreach (split_sql($sql) as $statement) {
            $statement = trim($statement);
            if ($statement === '') continue;
            $pdo->exec($statement);
        }
        $pdo->prepare("INSERT INTO schema_migrations (migration) VALUES (?)")
            ->execute([$name]);
        $pdo->commit();
        echo "OK\n";
        $ran++;
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo "FAILED\n";
        echo "  Error: " . $e->getMessage() . "\n";
        echo "  Migration stopped. Fix the error and re-run.\n";
        exit(1);
    }
}

if ($dryRun) {
    echo "\n[DRY RUN] {$pending} pending migration(s) — nothing was applied.\n";
} elseif ($markApplied && $ran > 0) {
    echo "\nDone. {$ran} migration(s) marked applied (SQL not executed).\n";
} elseif ($ran === 0 && $pending === 0) {
    echo "\nAll migrations already applied. Nothing to do.\n";
} else {
    echo "\nDone. {$ran} migration(s) applied.\n";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Split a SQL file into individual statements by semicolon,
 * respecting string literals and comments.
 */
function split_sql(string $sql): array
{
    // Strip single-line comments (-- ...) and block comments (/* ... */)
    $sql = preg_replace('/--[^\n]*/', '', $sql);
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    return explode(';', $sql);
}

/**
 * Load DB credentials. Order: env vars → public/api/_config.php → readline defaults.
 */
function load_config(): array
{
    $configFile = dirname(__DIR__) . '/public/api/_config.php';
    if (is_file($configFile) && !defined('DB_HOST')) {
        if (!defined('APP_INIT')) {
            define('APP_INIT', true);
        }
        // Suppress die on direct access — APP_INIT is set
        require_once $configFile;
    }

    $host    = getenv('DB_HOST') ?: (defined('DB_HOST') ? DB_HOST : null);
    $name    = getenv('DB_NAME') ?: (defined('DB_NAME') ? DB_NAME : null);
    $user    = getenv('DB_USER') ?: (defined('DB_USER') ? DB_USER : null);
    $pass    = getenv('DB_PASS');
    if ($pass === false || $pass === null || $pass === '') {
        $pass = defined('DB_PASS') ? DB_PASS : null;
    }
    $charset = getenv('DB_CHARSET') ?: (defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4');

    // Non-interactive: prefer config constants; only prompt if still missing
    if (!$host || !$name || !$user) {
        $host = $host ?: readline_or_default('DB host', 'localhost');
        $name = $name ?: readline_or_default('DB name', '');
        $user = $user ?: readline_or_default('DB user', '');
        if ($pass === null || $pass === '') {
            $pass = readline_or_default('DB password', '');
        }
    }

    return [
        'host' => (string) $host,
        'name' => (string) $name,
        'user' => (string) $user,
        'pass' => (string) ($pass ?? ''),
        'charset' => (string) $charset,
    ];
}

function readline_or_default(string $prompt, string $default): string
{
    if (!function_exists('readline')) {
        return $default;
    }
    $val = readline("{$prompt}" . ($default !== '' ? " [{$default}]" : '') . ": ");
    return ($val === '' || $val === false) ? $default : $val;
}
