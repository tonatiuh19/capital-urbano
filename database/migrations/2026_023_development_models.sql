-- Per-project apartment models (independent of LIV live feed).
CREATE TABLE IF NOT EXISTS `development_models` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `development_id` int(10) unsigned NOT NULL,
  `name` varchar(120) NOT NULL,
  `bedrooms` tinyint unsigned DEFAULT NULL,
  `bathrooms` decimal(3,1) DEFAULT NULL,
  `area_sqm` decimal(8,2) DEFAULT NULL,
  `terrace_m2` decimal(8,2) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_dev_models_dev` (`development_id`),
  KEY `idx_dev_models_order` (`development_id`, `display_order`),
  CONSTRAINT `fk_dev_models_development`
    FOREIGN KEY (`development_id`) REFERENCES `developments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
