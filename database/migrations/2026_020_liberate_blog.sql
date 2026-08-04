-- Liberate blog for everyone: public flag ON, remove per-admin lock.
UPDATE `site_settings`
SET `setting_value` = '1', `is_public` = 1
WHERE `setting_key` = 'feature_blog_enabled';

SET @cu_blog_col := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'admins'
    AND COLUMN_NAME = 'can_manage_blog'
);
SET @cu_blog_sql := IF(
  @cu_blog_col > 0,
  'ALTER TABLE `admins` DROP COLUMN `can_manage_blog`',
  'SELECT 1'
);
PREPARE cu_blog_stmt FROM @cu_blog_sql;
EXECUTE cu_blog_stmt;
DEALLOCATE PREPARE cu_blog_stmt;
