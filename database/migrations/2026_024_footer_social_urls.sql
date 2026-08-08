-- Footer social links (client feedback Aug 2026).
UPDATE `site_settings`
SET `setting_value` = 'https://www.linkedin.com/company/capital-urbano-gdl-dptos',
    `is_public` = 1
WHERE `setting_key` = 'linkedin_url';

UPDATE `site_settings`
SET `setting_value` = 'https://www.instagram.com/capital.urbano.gdl/',
    `is_public` = 1
WHERE `setting_key` = 'instagram_url';

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`)
SELECT 'facebook_url', 'https://www.facebook.com/profile.php?id=61592216379502', 1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `setting_key` = 'facebook_url'
);

UPDATE `site_settings`
SET `setting_value` = 'https://www.facebook.com/profile.php?id=61592216379502',
    `is_public` = 1
WHERE `setting_key` = 'facebook_url';
