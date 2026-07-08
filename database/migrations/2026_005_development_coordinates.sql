-- Per-development map pins (portfolio map) + public default map center in site_settings.

ALTER TABLE `developments`
  ADD COLUMN `latitude` decimal(10,7) DEFAULT NULL COMMENT 'WGS84 latitude' AFTER `state`,
  ADD COLUMN `longitude` decimal(10,7) DEFAULT NULL COMMENT 'WGS84 longitude' AFTER `latitude`;

UPDATE `site_settings` SET `is_public` = 1 WHERE `setting_key` IN ('map_lat', 'map_lng');

UPDATE `developments` SET `latitude` = 20.6772000, `longitude` = -103.3472000 WHERE `slug` = 'punto-sao-paulo';
UPDATE `developments` SET `latitude` = 20.6945000, `longitude` = -103.3824000 WHERE `slug` = 'vista-magna';
UPDATE `developments` SET `latitude` = 20.7081000, `longitude` = -103.4128000 WHERE `slug` = 'torres-myth';
