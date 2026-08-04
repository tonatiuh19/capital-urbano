-- Feature flag: blog module (public + admin). Default ON so existing installs keep working.
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`)
VALUES ('feature_blog_enabled', '1', 1)
ON DUPLICATE KEY UPDATE `is_public` = 1;
