-- Per-project amenities with optional image (independent of LIV live feed).
CREATE TABLE IF NOT EXISTS `development_amenities` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `development_id` int(10) unsigned NOT NULL,
  `name` varchar(160) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `icon` varchar(60) DEFAULT NULL COMMENT 'Optional lucide key, e.g. paw-print',
  `image_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_dev_amenities_dev` (`development_id`),
  KEY `idx_dev_amenities_order` (`development_id`, `display_order`),
  CONSTRAINT `fk_dev_amenities_development`
    FOREIGN KEY (`development_id`) REFERENCES `developments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed LIV Capital amenities (images under /uploads/amenities/ — deploy with site).
INSERT INTO `development_amenities`
  (`development_id`, `name`, `description`, `icon`, `image_url`, `display_order`, `is_active`)
SELECT d.`id`, v.`name`, v.`description`, v.`icon`, v.`image_url`, v.`display_order`, 1
FROM `developments` d
CROSS JOIN (
  SELECT 'Pet Park & Pet Shower' AS `name`,
         'Parque de mascotas con bebedero y secador de aire climatizado' AS `description`,
         'paw-print' AS `icon`,
         '/uploads/amenities/pet-park.jpg' AS `image_url`,
         1 AS `display_order`
  UNION ALL SELECT 'Gym', 'Área de fitness y wellness con equipos de última generación', 'dumbbell', '/uploads/amenities/gym.jpg', 2
  UNION ALL SELECT 'Coworking & Sala de Juntas', 'Estaciones de trabajo colaborativo y sala de reuniones privada', 'laptop', '/uploads/amenities/coworking.jpg', 3
  UNION ALL SELECT 'Grill Zone', 'Espacios sociales con asadores para convivir con familia y amigos', 'flame', '/uploads/amenities/grill-zone.jpg', 4
  UNION ALL SELECT 'Lavandería', 'Área de lavandería compartida con equipos de alta eficiencia', 'shirt', '/uploads/amenities/lavanderia.jpg', 5
  UNION ALL SELECT 'Playground', 'Zona de juegos segura para los más pequeños', 'baby', NULL, 6
) v
WHERE d.`slug` = 'liv-capital'
  AND NOT EXISTS (
    SELECT 1 FROM `development_amenities` a
    WHERE a.`development_id` = d.`id` AND a.`name` = v.`name`
  );
