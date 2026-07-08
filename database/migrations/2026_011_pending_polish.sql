-- Social links, Phase 3 short fields, brand domain placeholders.

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('linkedin_url', 'https://www.linkedin.com/company/capital-urbano', 1)
ON DUPLICATE KEY UPDATE `is_public` = 1;

UPDATE `site_settings`
SET `setting_value` = 'https://www.instagram.com/capitalurbanomx'
WHERE `setting_key` = 'instagram_url' AND (`setting_value` IS NULL OR `setting_value` = '');

ALTER TABLE `developments`
  ADD COLUMN `description_short` varchar(320) DEFAULT NULL COMMENT 'Card/teaser copy' AFTER `tagline`;

ALTER TABLE `quality_pillars`
  ADD COLUMN `description_short` varchar(200) DEFAULT NULL COMMENT 'Home teaser copy' AFTER `title`;

ALTER TABLE `team_members`
  ADD COLUMN `bio_short` varchar(240) DEFAULT NULL COMMENT 'Card teaser bio' AFTER `role_title`;
