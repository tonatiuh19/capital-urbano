-- Newsletter, FAQ, clients CRM, contact enrichments, development general info

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `status` enum('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
  `source` varchar(40) NOT NULL DEFAULT 'footer' COMMENT 'footer | contact | admin',
  `ip_address` varchar(45) DEFAULT NULL,
  `subscribed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `unsubscribed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_newsletter_email` (`email`),
  KEY `idx_newsletter_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `faq_items` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(80) DEFAULT 'general' COMMENT 'general | proyectos | inversion | contacto',
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_faq_active_order` (`is_active`,`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cms_content` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL COMMENT 'terms_and_conditions | privacy_policy | faq_markdown',
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL COMMENT 'Markdown',
  `version` smallint(6) NOT NULL DEFAULT 1,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cms_content_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(120) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `interest` enum('general','investment','partnership','press','acquisition','other') NOT NULL DEFAULT 'general',
  `preferred_development_id` int(10) UNSIGNED DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of strings' CHECK (json_valid(`tags`) OR `tags` IS NULL),
  `admin_notes` text DEFAULT NULL,
  `newsletter_opt_in` tinyint(1) NOT NULL DEFAULT 0,
  `first_source` varchar(100) DEFAULT NULL COMMENT 'contact_form | newsletter | admin',
  `last_contact_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_clients_email` (`email`),
  KEY `idx_clients_development` (`preferred_development_id`),
  CONSTRAINT `fk_clients_development` FOREIGN KEY (`preferred_development_id`) REFERENCES `developments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `contact_submissions`
  ADD COLUMN `client_id` int(10) UNSIGNED DEFAULT NULL AFTER `id`,
  ADD COLUMN `development_id` int(10) UNSIGNED DEFAULT NULL AFTER `client_id`,
  ADD COLUMN `interest` enum('general','investment','partnership','press','acquisition','other') NOT NULL DEFAULT 'general' AFTER `phone`,
  ADD COLUMN `subject` varchar(160) DEFAULT NULL AFTER `interest`;

ALTER TABLE `contact_submissions`
  ADD KEY `idx_contact_client` (`client_id`),
  ADD KEY `idx_contact_development` (`development_id`);

ALTER TABLE `contact_submissions`
  ADD CONSTRAINT `fk_contact_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_contact_development` FOREIGN KEY (`development_id`) REFERENCES `developments` (`id`) ON DELETE SET NULL;

ALTER TABLE `developments`
  ADD COLUMN `address_line` varchar(255) DEFAULT NULL AFTER `location_label`,
  ADD COLUMN `city` varchar(80) DEFAULT 'Guadalajara' AFTER `address_line`,
  ADD COLUMN `state` varchar(80) DEFAULT 'Jalisco' AFTER `city`,
  ADD COLUMN `delivery_estimate` varchar(120) DEFAULT NULL COMMENT 'e.g. Q4 2027' AFTER `status`,
  ADD COLUMN `total_floors` smallint(5) UNSIGNED DEFAULT NULL AFTER `units_label`,
  ADD COLUMN `total_units` int(10) UNSIGNED DEFAULT NULL AFTER `total_floors`,
  ADD COLUMN `brochure_url` varchar(500) DEFAULT NULL AFTER `hero_image_url`,
  ADD COLUMN `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of short bullets' CHECK (json_valid(`highlights`) OR `highlights` IS NULL),
  ADD COLUMN `contact_email` varchar(255) DEFAULT NULL AFTER `liv_project_slug`,
  ADD COLUMN `contact_phone` varchar(40) DEFAULT NULL AFTER `contact_email`;

INSERT INTO `faq_items` (`question`, `answer`, `category`, `display_order`, `is_active`) VALUES
('¿Cómo puedo conocer los proyectos de Capital Urbano?', 'Puedes explorar nuestro portafolio en la sección Proyectos o contactarnos para recibir asesoría personalizada sobre disponibilidad e inversión.', 'proyectos', 1, 1),
('¿Capital Urbano es lo mismo que LIV Capital?', 'Capital Urbano es la desarrolladora del grupo. LIV Capital es uno de nuestros desarrollos verticales en Guadalajara; otros proyectos como Punto Sao Paulo, Vista Magna y Torres Myth forman parte del mismo portafolio.', 'general', 2, 1),
('¿Cómo me suscribo a novedades de nuevos proyectos?', 'Usa el formulario «Mantente actualizado» en el pie de página o déjanos tu correo en Contacto. Solo enviamos información relevante sobre lanzamientos y avances.', 'contacto', 3, 1),
('¿Puedo invertir o ser socio en un desarrollo?', 'Sí. Indica tu interés en el formulario de contacto o escríbenos directamente; un asesor del equipo comercial te responderá.', 'inversion', 4, 1)
ON DUPLICATE KEY UPDATE `answer` = VALUES(`answer`);

INSERT INTO `cms_content` (`slug`, `title`, `content`, `is_published`, `published_at`) VALUES
('privacy_policy', 'Aviso de Privacidad', '# Aviso de Privacidad\n\n**Capital Urbano S.A. de C.V.** es responsable del tratamiento de sus datos conforme a la LFPDPPP.\n\nRecopilamos datos de contacto cuando usted nos escribe, se suscribe al boletín o solicita información sobre desarrollos.\n\nPara ejercer derechos ARCO: **privacidad@capitalurbano.com**', 1, NOW()),
('terms_and_conditions', 'Términos y Condiciones', '# Términos y Condiciones\n\nEste sitio es informativo. Precios, disponibilidad y fechas de entrega pueden cambiar sin previo aviso.\n\nEl contenido visual puede incluir renders artísticos.', 1, NOW())
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('contact_address', 'Guadalajara, Jalisco, México', 1),
('contact_hours', 'Lunes a Viernes, 9:00 – 18:00', 1),
('newsletter_heading', 'Mantente actualizado', 1),
('newsletter_subcopy', 'Suscríbete para recibir información sobre nuestros nuevos proyectos.', 1)
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

UPDATE `developments` SET
  `description` = 'Desarrollo vertical residencial en el corazón de Guadalajara.',
  `delivery_estimate` = 'Por confirmar',
  `total_units` = 220
WHERE `slug` = 'punto-sao-paulo';

UPDATE `developments` SET
  `description` = 'Torre de departamentos premium en zona Providencia.',
  `delivery_estimate` = 'Por confirmar',
  `total_units` = 180
WHERE `slug` = 'vista-magna';

UPDATE `developments` SET
  `description` = 'Complejo residencial de gran escala en zona Country.',
  `delivery_estimate` = 'En planeación',
  `total_units` = 320
WHERE `slug` = 'torres-myth';
