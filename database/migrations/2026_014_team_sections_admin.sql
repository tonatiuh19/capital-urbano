-- Team sections (Dirección / Staff técnico / Equipo) + editable About section titles.

ALTER TABLE `team_members`
  ADD COLUMN `team_section` ENUM('leadership', 'technical', 'general') NOT NULL DEFAULT 'general'
  COMMENT 'Sección en /about: dirección, staff técnico o equipo general'
  AFTER `role_title`;

UPDATE `team_members` SET `team_section` = 'leadership' WHERE `is_leadership` = 1;
UPDATE `team_members` SET `team_section` = 'technical' WHERE `name` = 'Olaf Rodriguez Arroche';

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('about_leadership_title', 'Dirección', 1),
('about_leadership_subtitle', 'Gilberto Cordero Estrada — socio fundador y CEO. Ingeniero civil (UdG), maestría en valuación inmobiliaria (UNIVA) y 27 años en desarrollo vertical en Guadalajara.', 1),
('about_technical_title', 'Staff técnico', 1),
('about_technical_subtitle', 'Especialistas en obra, datos, ingenierías y control de calidad que respaldan cada desarrollo.', 1),
('about_team_title', 'Equipo multidisciplinario', 1),
('about_team_subtitle', 'Comercial, marketing y operación trabajando de forma integrada en cada desarrollo.', 1)
ON DUPLICATE KEY UPDATE `is_public` = VALUES(`is_public`);
