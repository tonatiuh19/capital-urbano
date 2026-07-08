-- Coming soon / site gate (same pattern as liv-capital building_config.under_construction)

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('under_construction', '0', 1),
('coming_soon_title', 'Capital Urbano', 1),
('coming_soon_subtitle', 'Desarrollos verticales de excelencia — Guadalajara, Jalisco', 1),
('instagram_url', '', 1)
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`), `is_public` = 1;
