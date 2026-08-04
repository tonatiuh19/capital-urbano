-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 30, 2026 at 11:26 PM
-- Server version: 11.4.12-MariaDB-cll-lve
-- PHP Version: 8.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gmwbyxyp_capital-urbano`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('superadmin','admin') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 'Alex Gomez', 'alex@disruptinglabs.com', 'superadmin', 1, '2026-07-30 21:29:35', '2026-06-02 21:45:25', '2026-07-30 21:29:35'),
(3, 'Hebert Montecinos', 'hebert@trueduplora.com', 'superadmin', 1, NULL, '2026-06-03 17:31:47', '2026-06-03 17:31:47');

-- --------------------------------------------------------

--
-- Table structure for table `admin_sessions`
--

CREATE TABLE `admin_sessions` (
  `id` int(10) UNSIGNED NOT NULL,
  `admin_id` int(10) UNSIGNED NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(512) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_sessions`
--

INSERT INTO `admin_sessions` (`id`, `admin_id`, `token_hash`, `ip_address`, `user_agent`, `expires_at`, `revoked_at`, `created_at`) VALUES
(1, 1, 'bf38e4b24812019969c8484be66d3ec0132cded1034ff70584b681d0b09695e2', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-10 03:19:59', NULL, '2026-06-02 23:19:58'),
(2, 1, '9784b342d3ddaeb0d5ac3c5a5c1d40a16467a808ac588cf5d24f4c02a1e54bd1', '187.189.149.139', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-10 20:21:50', '2026-06-03 16:22:58', '2026-06-03 16:21:50'),
(3, 1, 'feacf66d7eb2e6a087b944502d57f1087075e18b450f20864bc840adfe1a4a34', '187.189.149.139', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-06-10 20:28:52', '2026-06-03 17:32:25', '2026-06-03 16:28:52'),
(4, 1, '7976b8b312850935212777e4cda2f48fe4488ad8bd22423db2ff3c1c3130be32', '187.172.48.209', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-07-12 19:37:52', '2026-07-05 15:42:03', '2026-07-05 15:37:52'),
(5, 1, '10b1283aa4ace863e29d1aba3226572ee1cd1b8242ca819820907a9f7786714e', '189.203.206.51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-07-21 16:08:53', NULL, '2026-07-14 12:08:53'),
(6, 1, '32dcee63cc5ddb6d2a716cdb112db82a37629e8a248b41a0bfb0db42b444d788', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-08-07 01:29:36', NULL, '2026-07-30 21:29:35');

-- --------------------------------------------------------

--
-- Table structure for table `blog_authors`
--

CREATE TABLE `blog_authors` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(120) NOT NULL,
  `name` varchar(120) NOT NULL,
  `role_title` varchar(120) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_authors`
--

INSERT INTO `blog_authors` (`id`, `slug`, `name`, `role_title`, `bio`, `photo_url`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'equipo-capital-urbano', 'Equipo Capital Urbano', 'Redacción', 'Contenido editorial del equipo Capital Urbano.', NULL, 1, 1, '2026-07-30 21:12:09', '2026-07-30 21:12:09');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(120) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` varchar(320) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `slug`, `name`, `description`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'noticias', 'Noticias', 'Novedades de Capital Urbano y el sector.', 1, 1, '2026-07-30 21:12:09', '2026-07-30 21:12:09');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(160) NOT NULL,
  `title` varchar(200) NOT NULL,
  `excerpt` varchar(400) DEFAULT NULL,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` varchar(320) DEFAULT NULL,
  `meta_keywords` varchar(320) DEFAULT NULL,
  `hero_image_url` varchar(500) DEFAULT NULL,
  `author_id` int(10) UNSIGNED DEFAULT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('draft','scheduled','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_post_sections`
--

CREATE TABLE `blog_post_sections` (
  `id` int(10) UNSIGNED NOT NULL,
  `post_id` int(10) UNSIGNED NOT NULL,
  `section_type` enum('text','heading','image','gallery','youtube','embed','quote','cta') NOT NULL DEFAULT 'text',
  `title` varchar(200) DEFAULT NULL,
  `body` mediumtext DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `meta_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_json`) or `meta_json` is null),
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_post_tags`
--

CREATE TABLE `blog_post_tags` (
  `post_id` int(10) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_tags`
--

CREATE TABLE `blog_tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(120) NOT NULL,
  `name` varchar(80) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_tags`
--

INSERT INTO `blog_tags` (`id`, `slug`, `name`, `created_at`) VALUES
(1, 'guadalajara', 'Guadalajara', '2026-07-30 21:53:11'),
(2, 'vivienda-vertical', 'Vivienda vertical', '2026-07-30 21:53:11'),
(3, 'preventa', 'Preventa', '2026-07-30 21:53:11'),
(4, 'inversion', 'Inversión', '2026-07-30 21:53:11'),
(5, 'calidad', 'Calidad', '2026-07-30 21:53:12'),
(6, 'liv-capital', 'LIV Capital', '2026-07-30 21:53:12');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(120) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `interest` enum('general','investment','partnership','press','acquisition','other') NOT NULL DEFAULT 'general',
  `preferred_development_id` int(10) UNSIGNED DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of strings' CHECK (json_valid(`tags`) or `tags` is null),
  `admin_notes` text DEFAULT NULL,
  `newsletter_opt_in` tinyint(1) NOT NULL DEFAULT 0,
  `first_source` varchar(100) DEFAULT NULL COMMENT 'contact_form | newsletter | admin',
  `last_contact_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cms_content`
--

CREATE TABLE `cms_content` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(100) NOT NULL COMMENT 'terms_and_conditions | privacy_policy | faq_markdown',
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL COMMENT 'Markdown',
  `version` smallint(6) NOT NULL DEFAULT 1,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cms_content`
--

INSERT INTO `cms_content` (`id`, `slug`, `title`, `content`, `version`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'privacy_policy', 'Aviso de Privacidad', '# Aviso de Privacidad\n\n**Capital Urbano S.A. de C.V.** es responsable del tratamiento de sus datos conforme a la LFPDPPP.\n\nRecopilamos datos de contacto cuando usted nos escribe, se suscribe al boletín o solicita información sobre desarrollos.\n\nPara ejercer derechos ARCO: **privacidad@capitalurbano.com**', 1, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(2, 'terms_and_conditions', 'Términos y Condiciones', '# Términos y Condiciones\n\nEste sitio es informativo. Precios, disponibilidad y fechas de entrega pueden cambiar sin previo aviso.\n\nEl contenido visual puede incluir renders artísticos.', 1, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `cms_pages`
--

CREATE TABLE `cms_pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(80) NOT NULL COMMENT 'about | quality | experience | privacy | terms',
  `title` varchar(160) NOT NULL,
  `body_markdown` mediumtext DEFAULT NULL,
  `meta_description` varchar(320) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cms_pages`
--

INSERT INTO `cms_pages` (`id`, `slug`, `title`, `body_markdown`, `meta_description`, `is_published`, `published_at`, `updated_at`) VALUES
(1, 'about', 'Nosotros', '## Nuestra esencia\r\n\r\nCapital Urbano es la desarrolladora del grupo especializada en **proyectos verticales residenciales y mixos** que elevan el perfil urbano de Guadalajara.\r\n\r\n## Liderazgo con visión\r\n\r\nBajo la dirección de **Gilberto Cordero Estrada**, socio fundador y CEO, consolidamos un portafolio con desarrollos emblemáticos y alianzas estratégicas con proveedores confiables.\r\n\r\nGilberto es ingeniero civil por la Universidad de Guadalajara, con maestría en valuación inmobiliaria por la UNIVA y posgrado en finanzas por la Universidad Panamericana. Cuenta con **27 años de experiencia** en construcción y cerca de **un millón de m² construidos**, incluyendo desarrollos verticales premium en Lomas del Valle, Providencia, Punto Sao Paulo, San Javier y Andares.\r\n\r\nEntre los desarrollos en los que ha participado como director de proyectos: Moralta, Corporativo Vista Acueducto, Torres Myth del Country, Vista Magna, Villa Colomos, Citela, Vista Lomas, Neruda Providencia y Entorno México.\r\n\r\n## Lo que nos distingue\r\n\r\n- Metodología BIM y control de calidad con inspecciones externas independientes del contratista\r\n- Alianzas de largo plazo con proveedores y materiales certificados (Urrea, Rinnai, Rehau, Arauco, Vitromex y más)\r\n- Enfoque en las comunidades para entregar amenidades funcionales y adecuadas\r\n- Transparencia en plazos de ejecución, reportes y comunicación con compradores e inversionistas\r\n\r\n> No construimos solo para entregar. Construimos para que cada proyecto funcione, se mantenga y conserve valor.', 'Capital Urbano: fundada en 2021, liderada por Gilberto Cordero Estrada con 27 años y cerca de 1M m² construidos en desarrollo vertical en Guadalajara.', 1, '2026-06-02 21:45:54', '2026-07-09 22:40:27'),
(2, 'quality', 'Calidad', '## Compromiso con la excelencia\r\n\r\nEn Capital Urbano la calidad no es un departamento: es el **sistema** que articula diseño, obra, proveedores y entrega. Cada proyecto se documenta, supervisa y valida con estándares comparables a desarrollos internacionales.\r\n\r\n## De la planeación a la entrega\r\n\r\nIntegramos modelado BIM desde las etapas tempranas para anticipar interferencias, optimizar tiempos y garantizar que lo proyectado sea lo construido. Las inspecciones externas en hitos críticos añaden una capa independiente de verificación.\r\n\r\n## Resultado para el cliente\r\n\r\nDepartamentos con acabados de calidad, procesos transparentes y garantías documentadas. La confianza se construye metro a metro.', 'Cuatro pilares de calidad verificable: alianzas, BIM, inspecciones externas y automatización de procesos.', 1, '2026-06-02 21:45:54', '2026-07-04 16:49:00'),
(3, 'experience', 'Experiencia', '## Experiencia del cliente\r\n\r\nAcompañamos desde la primera visita hasta la entrega y postventa con procesos claros y comunicación transparente.\r\n\r\n- Asesoría personalizada\r\n- Documentación y seguimiento de obra\r\n- Garantías documentadas', 'Experiencia del cliente Capital Urbano: asesoría, contrato PROFECO, entrega documentada y participación de propietarios.', 1, '2026-06-02 21:45:54', '2026-07-09 16:42:24'),
(4, 'contact', 'Contacto', '## Hablemos de tu próximo proyecto\n\nNuestro equipo comercial está listo para orientarte sobre disponibilidad, planes de inversión o alianzas estratégicas. Cuéntanos qué desarrollo te interesa y te respondemos con información clara y actualizada.', 'Contacta a Capital Urbano: asesoría comercial, inversiones y alianzas en Guadalajara.', 1, '2026-06-02 21:45:54', '2026-06-02 22:57:12');

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `client_id` int(10) UNSIGNED DEFAULT NULL,
  `development_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `interest` enum('general','investment','partnership','press','acquisition','other') NOT NULL DEFAULT 'general',
  `subject` varchar(160) DEFAULT NULL,
  `message` text NOT NULL,
  `source_page` varchar(120) DEFAULT NULL,
  `status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(512) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `developments`
--

CREATE TABLE `developments` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(120) NOT NULL,
  `name` varchar(160) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description_short` varchar(320) DEFAULT NULL COMMENT 'Card/teaser copy',
  `description` text DEFAULT NULL,
  `location_label` varchar(120) DEFAULT NULL,
  `address_line` varchar(255) DEFAULT NULL,
  `city` varchar(80) DEFAULT 'Guadalajara',
  `state` varchar(80) DEFAULT 'Jalisco',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT 'WGS84 latitude',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT 'WGS84 longitude',
  `units_label` varchar(80) DEFAULT NULL,
  `total_floors` smallint(5) UNSIGNED DEFAULT NULL,
  `total_units` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('planning','construction','delivered','sold_out') NOT NULL DEFAULT 'construction',
  `delivery_estimate` varchar(120) DEFAULT NULL COMMENT 'e.g. Q4 2027',
  `hero_image_url` varchar(500) DEFAULT NULL,
  `brochure_url` varchar(500) DEFAULT NULL,
  `external_site_url` varchar(500) DEFAULT NULL COMMENT 'Project microsite if any',
  `liv_project_slug` varchar(120) DEFAULT NULL COMMENT 'Links to LIV Capital when applicable',
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(40) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of short bullets' CHECK (json_valid(`highlights`) or `highlights` is null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `developments`
--

INSERT INTO `developments` (`id`, `slug`, `name`, `tagline`, `description_short`, `description`, `location_label`, `address_line`, `city`, `state`, `latitude`, `longitude`, `units_label`, `total_floors`, `total_units`, `status`, `delivery_estimate`, `hero_image_url`, `brochure_url`, `external_site_url`, `liv_project_slug`, `contact_email`, `contact_phone`, `is_featured`, `is_active`, `display_order`, `created_at`, `updated_at`, `highlights`) VALUES
(1, 'liv-capital', 'LIV Capital', 'Vivienda Vertical de Lujo', NULL, 'LIV CAPITAL es un desarrollo residencial contemporáneo que reimagina la vivienda urbana de clase mundial. Ubicado en el corazón de Guadalajara, el proyecto combina arquitectura sofisticada con espacios optimizados y amenidades de lujo.', 'Guadalajara Centro', 'C. Pedro Loza 869', 'Guadalajara', 'Jalisco', 20.6900800, -103.3489000, '55 departamentos', 32, 55, 'construction', 'Segundo semestre 2027', '/uploads/developments/ca2ef3d26b676373b07ce8c15b38d3dc.jpg', '/uploads/brochures/punto-sao-paulo.pdf', 'https://livcapitalgdl.mx/', NULL, 'info@livcapitalgdl.mx', '+523312345678', 1, 1, 1, '2026-06-02 21:45:25', '2026-07-05 15:39:23', '[\"Roof garden\",\"Pet Park\",\"Sala Lounge\",\"Gym\"]'),
(4, 'punto-sao-paulo', 'Punto Sao Paulo', NULL, NULL, NULL, 'Guadalajara Centro', NULL, 'Guadalajara', 'Jalisco', NULL, NULL, '220 departamentos', NULL, NULL, 'construction', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-07-30 21:18:25', '2026-07-30 21:18:25', NULL),
(5, 'vista-magna', 'Vista Magna', NULL, NULL, NULL, 'Providencia', NULL, 'Guadalajara', 'Jalisco', NULL, NULL, '180 departamentos', NULL, NULL, 'construction', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 2, '2026-07-30 21:18:25', '2026-07-30 21:18:25', NULL),
(6, 'torres-myth', 'Torres Myth', NULL, NULL, NULL, 'Country', NULL, 'Guadalajara', 'Jalisco', NULL, NULL, '320 departamentos', NULL, NULL, 'planning', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 3, '2026-07-30 21:18:25', '2026-07-30 21:18:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `development_media`
--

CREATE TABLE `development_media` (
  `id` int(10) UNSIGNED NOT NULL,
  `development_id` int(10) UNSIGNED NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `url` varchar(500) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `development_media`
--

INSERT INTO `development_media` (`id`, `development_id`, `media_type`, `url`, `caption`, `display_order`, `is_active`, `created_at`) VALUES
(1, 1, 'image', '/uploads/developments/punto-sao-paulo-1.jpg', 'Fachada principal (mock)', 1, 1, '2026-06-02 21:45:25'),
(2, 1, 'image', '/uploads/developments/punto-sao-paulo-2.jpg', 'Lobby (mock)', 2, 1, '2026-06-02 21:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `recipient_email` varchar(255) NOT NULL,
  `recipient_name` varchar(160) DEFAULT NULL,
  `template_type` varchar(64) NOT NULL,
  `contact_id` int(10) UNSIGNED DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` enum('sent','failed','skipped') NOT NULL DEFAULT 'sent',
  `mailer_response` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq_items`
--

CREATE TABLE `faq_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(80) DEFAULT 'general' COMMENT 'general | proyectos | inversion | contacto',
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faq_items`
--

INSERT INTO `faq_items` (`id`, `question`, `answer`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '¿Cómo puedo conocer los proyectos de Capital Urbano?', 'Puedes explorar nuestro portafolio en la sección Proyectos o contactarnos para recibir asesoría personalizada sobre disponibilidad e inversión.', 'proyectos', 1, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(2, '¿Capital Urbano es lo mismo que LIV Capital?', 'Capital Urbano es la desarrolladora del grupo. LIV Capital es uno de nuestros desarrollos verticales en Guadalajara; otros proyectos como Punto Sao Paulo, Vista Magna y Torres Myth forman parte del mismo portafolio.', 'general', 2, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(3, '¿Cómo me suscribo a novedades de nuevos proyectos?', 'Usa el formulario «Mantente actualizado» en el pie de página o déjanos tu correo en Contacto. Solo enviamos información relevante sobre lanzamientos y avances.', 'contacto', 3, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(4, '¿Puedo invertir o ser socio en un desarrollo?', 'Sí. Indica tu interés en el formulario de contacto o escríbenos directamente; un asesor del equipo comercial te responderá.', 'inversion', 4, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
  `source` varchar(40) NOT NULL DEFAULT 'footer' COMMENT 'footer | contact | admin',
  `ip_address` varchar(45) DEFAULT NULL,
  `subscribed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `unsubscribed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(10) UNSIGNED NOT NULL,
  `context_type` enum('admin_login') NOT NULL DEFAULT 'admin_login',
  `context_id` varchar(255) NOT NULL,
  `code_hash` varchar(255) NOT NULL,
  `purpose` varchar(64) NOT NULL DEFAULT 'login',
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `attempts` tinyint(4) NOT NULL DEFAULT 0,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `context_type`, `context_id`, `code_hash`, `purpose`, `expires_at`, `used_at`, `attempts`, `ip_address`, `created_at`) VALUES
(6, 'admin_login', '1', '9572aefc5c69eb41ade32f66d741b845239b881582084efa4f8d455ca58b2d52', 'login', '2026-07-31 01:38:49', '2026-07-30 21:29:34', 0, '::1', '2026-07-30 21:28:48');

-- --------------------------------------------------------

--
-- Table structure for table `quality_pillars`
--

CREATE TABLE `quality_pillars` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(120) NOT NULL,
  `description_short` varchar(200) DEFAULT NULL COMMENT 'Home teaser copy',
  `description` text DEFAULT NULL,
  `icon` varchar(80) DEFAULT NULL COMMENT 'lucide icon name',
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quality_pillars`
--

INSERT INTO `quality_pillars` (`id`, `title`, `description_short`, `description`, `icon`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Alianza con los mejores fabricantes', NULL, 'Relaciones con fabricantes líderes y socios certificados que respaldan cada acabado y sistema constructivo.', 'handshake', 1, 1, '2026-06-02 21:45:25', '2026-07-09 16:42:24'),
(2, 'Metodología BIM', NULL, 'Procesos constructivos optimizados con modelado de información de construcción.', 'grid-3x3', 2, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(3, 'Inspecciones Externas', NULL, 'Control de calidad independiente en cada fase del proyecto.', 'clipboard-check', 3, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(4, 'Automatización de Procesos', NULL, 'Sistemas avanzados para garantizar eficiencia y precisión constructiva.', 'cog', 4, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `schema_migrations`
--

CREATE TABLE `schema_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `applied_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schema_migrations`
--

INSERT INTO `schema_migrations` (`id`, `migration`, `applied_at`) VALUES
(1, '2026_001_initial', '2026-07-30 21:18:27'),
(2, '2026_002_newsletter_faq_clients', '2026-07-30 21:19:08'),
(3, '2026_003_mock_seed_data', '2026-07-30 21:19:08'),
(4, '2026_004_under_construction', '2026-07-30 21:19:08'),
(5, '2026_005_development_coordinates', '2026-07-30 21:19:08'),
(6, '2026_006_cms_pages_content', '2026-07-30 21:19:08'),
(7, '2026_007_about_content_utf8', '2026-07-30 21:19:09'),
(8, '2026_008_experience_journey', '2026-07-30 21:19:09'),
(9, '2026_009_remove_mock_seed_data', '2026-07-30 21:19:09'),
(10, '2026_010_brand_copy', '2026-07-30 21:19:09'),
(11, '2026_011_pending_polish', '2026-07-30 21:19:09'),
(12, '2026_012_pdf_observations', '2026-07-30 21:19:09'),
(13, '2026_013_developer_experience_content', '2026-07-30 21:19:09'),
(14, '2026_014_team_sections_admin', '2026-07-30 21:19:10'),
(15, '2026_015_email_logs', '2026-07-30 21:19:10'),
(16, '2026_016_blog', '2026-07-30 21:19:10'),
(17, '2026_017_blog_tags_seed', '2026-07-30 21:54:34'),
(18, '2026_018_feature_blog_enabled', '2026-07-30 23:23:34');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(80) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `is_public`, `updated_at`) VALUES
(1, 'site_name', 'Capital Urbano', 1, '2026-06-02 21:45:25'),
(2, 'site_tagline', 'Desarrollos verticales de excelencia en Guadalajara', 1, '2026-06-02 21:45:25'),
(3, 'contact_email', 'contacto@capitalurbano.com', 1, '2026-06-02 21:45:25'),
(4, 'contact_phone', '+52 33 0000 0000', 1, '2026-06-02 21:45:25'),
(5, 'contact_address', 'Francisco J. Mujica 604, Jardines Alcalda, Guadalajara, Jalisco. C.P. 44298', 1, '2026-07-09 16:42:24'),
(6, 'contact_hours', 'Lunes a viernes · 9:00 – 18:00 hrs', 1, '2026-06-02 22:57:12'),
(7, 'newsletter_heading', 'Mantente actualizado', 1, '2026-06-02 21:45:25'),
(8, 'newsletter_subcopy', 'Suscríbete para recibir información sobre nuestros nuevos proyectos.', 1, '2026-06-02 21:45:25'),
(9, 'stat_sqm_built', '1000000', 1, '2026-07-09 22:40:27'),
(10, 'stat_sqm_developed', '', 1, '2026-07-09 16:42:24'),
(11, 'stat_years_experience', '27', 1, '2026-07-09 22:40:27'),
(12, 'stat_families', '5000', 1, '2026-06-02 21:45:25'),
(13, 'whatsapp_number', '526241234567', 1, '2026-06-02 21:45:25'),
(14, 'map_lat', '20.6736', 1, '2026-06-02 22:24:01'),
(15, 'map_lng', '-103.3444', 1, '2026-06-02 22:24:01'),
(17, 'under_construction', '0', 1, '2026-06-04 14:25:19'),
(18, 'coming_soon_title', 'Capital Urbano', 1, '2026-06-03 17:32:19'),
(19, 'coming_soon_subtitle', 'Construimos Valor Que Permanece', 1, '2026-07-09 16:42:24'),
(20, 'instagram_url', 'https://www.instagram.com/capitalurbanomx', 1, '2026-07-04 18:11:38'),
(21, 'about_hero_subtitle', 'Desarrollamos vivienda conectada a la ciudad', 1, '2026-07-09 16:42:24'),
(22, 'quality_hero_subtitle', 'Estándares internacionales en cada metro construido', 1, '2026-06-02 22:57:12'),
(23, 'experience_hero_subtitle', 'Un proceso claro, humano y transparente de principio a fin', 1, '2026-06-02 22:57:12'),
(68, 'linkedin_url', 'https://www.linkedin.com/company/capital-urbano', 1, '2026-07-04 18:11:38'),
(69, 'experience_owners_integration', 'Integramos a los propietarios desde el día 1 del inicio de operación del edificio, en comisiones de inspección y vigilancia para que se vigile el correcto gasto de los recursos.', 1, '2026-07-09 16:42:24'),
(71, 'about_leadership_title', 'Dirección', 1, '2026-07-30 21:30:44'),
(72, 'about_leadership_subtitle', 'Gilberto Cordero Estrada — socio fundador y CEO. Ingeniero civil (UdG), maestría en valuación inmobiliaria (UNIVA) y 27 años en desarrollo vertical en Guadalajara.', 1, '2026-07-30 21:30:44'),
(73, 'about_technical_title', 'Staff técnico', 1, '2026-07-30 21:30:44'),
(74, 'about_technical_subtitle', 'Especialistas en obra, datos, ingenierías y control de calidad que respaldan cada desarrollo.', 1, '2026-07-30 21:30:44'),
(75, 'about_team_title', 'Equipo multidisciplinario', 1, '2026-07-30 21:30:44'),
(76, 'about_team_subtitle', 'Comercial, marketing y operación trabajando de forma integrada en cada desarrollo.', 1, '2026-07-30 21:30:44'),
(77, 'feature_blog_enabled', '1', 1, '2026-07-30 23:23:34');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `role_title` varchar(120) DEFAULT NULL,
  `bio_short` varchar(240) DEFAULT NULL COMMENT 'Card teaser bio',
  `bio` text DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `team_section` enum('leadership','technical','general') NOT NULL DEFAULT 'general',
  `linkedin_url` varchar(500) DEFAULT NULL,
  `is_leadership` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role_title`, `bio_short`, `bio`, `photo_url`, `team_section`, `linkedin_url`, `is_leadership`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Gilberto Cordero Estrada', 'Socio fundador y CEO', 'Ing. civil (UdG), maestría en valuación inmobiliaria (UNIVA). 27 años y cerca de 1M m² construidos en desarrollo vertical en Guadalajara.', 'Ingeniero civil por la Universidad de Guadalajara, con maestría en valuación inmobiliaria por la UNIVA y posgrado en finanzas por la Universidad Panamericana. Fundó Capital Urbano en 2021 tras 27 años en construcción y desarrollo, con cerca de un millón de m² construidos. Como director de proyectos y encargado de desarrollo de producto en Rocher Holdings y Gerbera Capital, lideró desarrollos verticales premium y mixtos en Guadalajara — entre ellos Moralta, Vista Magna, Torres Myth del Country, Neruda Providencia y Entorno México. Estableció protocolos de calidad, alianzas con fabricantes líderes y sistemas de posventa con seguimiento en Procore.', '/uploads/team/gilberto-cordero.jpg', 'leadership', 'https://linkedin.com/in/mock-gilberto', 1, 1, 1, '2026-06-02 21:45:25', '2026-07-30 21:30:37'),
(2, 'María Fernanda Ruiz', 'Directora Comercial', NULL, 'Especialista en preventa de desarrollos verticales y diseño de la experiencia del cliente en cada punto de contacto.', '/uploads/team/maria-ruiz.jpg', 'leadership', NULL, 1, 2, 1, '2026-06-02 21:45:25', '2026-07-30 21:30:37'),
(3, 'Carlos Méndez', 'Director de Obra', NULL, 'Ingeniero civil con enfoque BIM, control de obra y cumplimiento de estándares internacionales en proyectos de gran escala.', '/uploads/team/carlos-mendez.jpg', 'leadership', NULL, 1, 3, 1, '2026-06-02 21:45:25', '2026-07-30 21:30:37'),
(4, 'Ana Lucía Torres', 'Marketing & Comunicación', NULL, 'Estrategia de marca, comunicación y relaciones públicas para el portafolio Capital Urbano y sus lanzamientos.', '/uploads/team/ana-torres.jpg', 'general', NULL, 0, 4, 1, '2026-06-02 21:45:25', '2026-06-02 22:57:12'),
(5, 'Olaf Rodriguez Arroche', 'Análisis de datos manager', NULL, 'Análisis de datos y seguimiento de indicadores para la toma de decisiones en desarrollo y operación.', NULL, 'technical', NULL, 0, 5, 1, '2026-07-09 16:42:24', '2026-07-30 21:30:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_admins_email` (`email`);

--
-- Indexes for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sessions_token` (`token_hash`),
  ADD KEY `idx_sessions_admin` (`admin_id`);

--
-- Indexes for table `blog_authors`
--
ALTER TABLE `blog_authors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blog_authors_slug` (`slug`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blog_categories_slug` (`slug`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blog_posts_slug` (`slug`),
  ADD KEY `idx_blog_posts_status_pub` (`status`,`published_at`),
  ADD KEY `idx_blog_posts_scheduled` (`status`,`scheduled_at`),
  ADD KEY `idx_blog_posts_featured` (`is_featured`,`status`),
  ADD KEY `fk_blog_posts_author` (`author_id`),
  ADD KEY `fk_blog_posts_category` (`category_id`);

--
-- Indexes for table `blog_post_sections`
--
ALTER TABLE `blog_post_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bps_post_order` (`post_id`,`display_order`);

--
-- Indexes for table `blog_post_tags`
--
ALTER TABLE `blog_post_tags`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `idx_bpt_tag` (`tag_id`);

--
-- Indexes for table `blog_tags`
--
ALTER TABLE `blog_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_blog_tags_slug` (`slug`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_clients_email` (`email`),
  ADD KEY `idx_clients_development` (`preferred_development_id`);

--
-- Indexes for table `cms_content`
--
ALTER TABLE `cms_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cms_content_slug` (`slug`);

--
-- Indexes for table `cms_pages`
--
ALTER TABLE `cms_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cms_pages_slug` (`slug`);

--
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_status` (`status`,`created_at`),
  ADD KEY `idx_contact_client` (`client_id`),
  ADD KEY `idx_contact_development` (`development_id`);

--
-- Indexes for table `developments`
--
ALTER TABLE `developments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_developments_slug` (`slug`);

--
-- Indexes for table `development_media`
--
ALTER TABLE `development_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dev_media_development` (`development_id`);

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_logs_contact` (`contact_id`),
  ADD KEY `idx_email_logs_recipient` (`recipient_email`),
  ADD KEY `idx_email_logs_type` (`template_type`);

--
-- Indexes for table `faq_items`
--
ALTER TABLE `faq_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_faq_active_order` (`is_active`,`display_order`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_newsletter_email` (`email`),
  ADD KEY `idx_newsletter_status` (`status`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_context` (`context_type`,`context_id`),
  ADD KEY `idx_otp_expires` (`expires_at`);

--
-- Indexes for table `quality_pillars`
--
ALTER TABLE `quality_pillars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schema_migrations`
--
ALTER TABLE `schema_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_migration` (`migration`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_site_settings_key` (`setting_key`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `blog_authors`
--
ALTER TABLE `blog_authors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `blog_post_sections`
--
ALTER TABLE `blog_post_sections`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `blog_tags`
--
ALTER TABLE `blog_tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cms_content`
--
ALTER TABLE `cms_content`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cms_pages`
--
ALTER TABLE `cms_pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `developments`
--
ALTER TABLE `developments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `development_media`
--
ALTER TABLE `development_media`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `email_logs`
--
ALTER TABLE `email_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq_items`
--
ALTER TABLE `faq_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `quality_pillars`
--
ALTER TABLE `quality_pillars`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schema_migrations`
--
ALTER TABLE `schema_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `fk_sessions_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `fk_blog_posts_author` FOREIGN KEY (`author_id`) REFERENCES `blog_authors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_blog_posts_category` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_post_sections`
--
ALTER TABLE `blog_post_sections`
  ADD CONSTRAINT `fk_bps_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_post_tags`
--
ALTER TABLE `blog_post_tags`
  ADD CONSTRAINT `fk_bpt_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bpt_tag` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `fk_clients_development` FOREIGN KEY (`preferred_development_id`) REFERENCES `developments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD CONSTRAINT `fk_contact_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_contact_development` FOREIGN KEY (`development_id`) REFERENCES `developments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `development_media`
--
ALTER TABLE `development_media`
  ADD CONSTRAINT `fk_dev_media_development` FOREIGN KEY (`development_id`) REFERENCES `developments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD CONSTRAINT `fk_email_logs_contact` FOREIGN KEY (`contact_id`) REFERENCES `contact_submissions` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
