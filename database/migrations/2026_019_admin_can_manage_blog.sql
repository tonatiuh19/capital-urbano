-- Per-admin blog access (admin CMS only; public still uses feature_blog_enabled).
ALTER TABLE `admins`
  ADD COLUMN `can_manage_blog` tinyint(1) NOT NULL DEFAULT 0
  AFTER `is_active`;

UPDATE `admins`
SET `can_manage_blog` = 1
WHERE LOWER(`email`) IN (
  'alex@disruptinglabs.com',
  'hebert@trueduplora.com'
);
