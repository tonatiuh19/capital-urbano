-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 02, 2026 at 10:12 PM
-- Server version: 11.4.10-MariaDB-cll-lve
-- PHP Version: 8.4.21

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
(1, 'Admin Pruebas', 'admin@capitalurbano.test', 'superadmin', 1, NULL, '2026-06-02 21:45:25', '2026-06-02 21:45:25');

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

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `email`, `name`, `phone`, `interest`, `preferred_development_id`, `tags`, `admin_notes`, `newsletter_opt_in`, `first_source`, `last_contact_at`, `created_at`, `updated_at`) VALUES
(1, 'lead.mock1@example.com', 'Juan Pérez Mock', '+52 33 3000 0001', 'investment', 1, '[\"hot_lead\",\"mock\"]', 'Interesado en Punto Sao Paulo — dato de prueba.', 1, 'contact_form', '2026-06-02 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(2, 'lead.mock2@example.com', 'Sofía López Mock', '+52 33 3000 0002', 'general', 2, '[\"needs_followup\",\"mock\"]', 'Preguntó por Vista Magna y LIV Capital.', 0, 'contact_form', '2026-05-31 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(3, 'socio.mock@example.com', 'Grupo Inmobiliario Delta (Mock)', '+52 55 5000 0000', 'partnership', NULL, '[\"investor\",\"mock\"]', 'Busca alianza para Torres Myth.', 0, 'contact_form', '2026-05-28 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(4, 'prensa.mock@example.com', 'Revista Skyline Mock', NULL, 'press', NULL, '[\"mock\"]', 'Solicitud de prensa — mock.', 0, 'contact_form', '2026-06-01 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(5, 'newsletter.mock1@example.com', 'newsletter.mock1@example.com', NULL, 'general', NULL, NULL, NULL, 1, 'newsletter', '2026-06-02 21:45:25', '2026-06-02 21:45:25', '2026-06-02 21:45:25');

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
(1, 'about', 'Nosotros', '# Sobre Capital Urbano\n\nBajo el liderazgo de **Gilberto Cordero**, somos una desarrolladora especializada en proyectos verticales residenciales y mixtos en Guadalajara.\n\n## Cifras (mock)\n- 900,000+ m² construidos\n- 500,000+ m² desarrollados\n- 5,000+ familias\n\n> Contenido de demostración para pruebas del CMS.', 'Historia, liderazgo y trayectoria de Capital Urbano en Guadalajara.', 1, '2026-06-02 21:45:54', '2026-06-02 21:45:54'),
(2, 'quality', 'Calidad', '# Calidad\n\nNuestros cuatro pilares garantizan excelencia en cada etapa: alianzas, BIM, inspecciones externas y automatización.\n\nEste texto es **mock** hasta cargar contenido final.', 'Pilares de calidad y estándares constructivos de Capital Urbano.', 1, '2026-06-02 21:45:54', '2026-06-02 21:45:54'),
(3, 'experience', 'Experiencia', '# Experiencia del Cliente\n\nAcompañamos desde la primera visita hasta la entrega y post-venta.\n\n- Asesoría personalizada\n- Portal de propietarios (próximamente)\n- Garantías documentadas\n\n*Datos de prueba.*', 'Experiencia premium para inversionistas y compradores.', 1, '2026-06-02 21:45:54', '2026-06-02 21:45:54'),
(4, 'contact', 'Contacto', '# Contacto\n\nEscríbenos o agenda una llamada. Horario: Lunes a Viernes 9:00–18:00.\n\n**contacto@capitalurbano.com** · +52 33 0000 0000', 'Contacta al equipo comercial de Capital Urbano.', 1, '2026-06-02 21:45:54', '2026-06-02 21:45:54');

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

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `client_id`, `development_id`, `name`, `email`, `phone`, `interest`, `subject`, `message`, `source_page`, `status`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 1, 'Juan Pérez Mock', 'lead.mock1@example.com', '+52 33 3000 0001', 'investment', 'Información Punto Sao Paulo', 'Me interesa conocer precios y planes de pago para invertir. (Mensaje mock)', '/contact', 'new', '127.0.0.1', NULL, '2026-06-02 21:45:25'),
(2, 2, 2, 'Sofía López Mock', 'lead.mock2@example.com', '+52 33 3000 0002', 'general', 'Visita Vista Magna', '¿Puedo agendar recorrido la próxima semana? (Mock)', '/contact', 'read', '127.0.0.1', NULL, '2026-06-02 21:45:25'),
(3, 3, NULL, 'Grupo Inmobiliario Delta (Mock)', 'socio.mock@example.com', NULL, 'partnership', 'Alianza estratégica', 'Representamos fondo de inversión — buscamos co-desarrollo. (Mock)', '/contact', 'new', '127.0.0.1', NULL, '2026-06-02 21:45:25'),
(4, 4, NULL, 'Revista Skyline Mock', 'prensa.mock@example.com', NULL, 'press', 'Entrevista dirección', 'Solicitud de entrevista con dirección general para reportaje especial. (Mock)', '/contact', 'archived', '127.0.0.1', NULL, '2026-06-02 21:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `developments`
--

CREATE TABLE `developments` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(120) NOT NULL,
  `name` varchar(160) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location_label` varchar(120) DEFAULT NULL,
  `address_line` varchar(255) DEFAULT NULL,
  `city` varchar(80) DEFAULT 'Guadalajara',
  `state` varchar(80) DEFAULT 'Jalisco',
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

INSERT INTO `developments` (`id`, `slug`, `name`, `tagline`, `description`, `location_label`, `address_line`, `city`, `state`, `units_label`, `total_floors`, `total_units`, `status`, `delivery_estimate`, `hero_image_url`, `brochure_url`, `external_site_url`, `liv_project_slug`, `contact_email`, `contact_phone`, `is_featured`, `is_active`, `display_order`, `created_at`, `updated_at`, `highlights`) VALUES
(1, 'punto-sao-paulo', 'Punto Sao Paulo', 'Vida vertical en el corazón de la ciudad', 'Punto Sao Paulo redefine el centro de Guadalajara con torres residenciales de diseño contemporáneo, amenidades de primer nivel y conectividad urbana inmediata. Proyecto mock para pruebas de CMS.', 'Guadalajara Centro', 'Av. Juárez 500, Zona Centro', 'Guadalajara', 'Jalisco', '220 departamentos', 32, 220, 'construction', 'Segundo semestre 2027', '/uploads/developments/punto-sao-paulo-hero.jpg', '/uploads/brochures/punto-sao-paulo.pdf', NULL, NULL, 'punto@capitalurbano.com', '+52 33 1000 1001', 1, 1, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25', '[\"Roof garden con alberca\",\"Lobby doble altura\",\"Estacionamiento inteligente\",\"Certificación en proceso LEED\"]'),
(2, 'vista-magna', 'Vista Magna', 'Elegancia vertical en Providencia', 'Vista Magna ofrece departamentos premium con vistas panorámicas, acabados de lujo y proximidad a los mejores servicios de la zona. Datos de demostración.', 'Providencia', 'Av. Américas 1500, Providencia', 'Guadalajara', 'Jalisco', '180 departamentos', 28, 180, 'construction', 'Primer trimestre 2028', '/uploads/developments/vista-magna-hero.jpg', '/uploads/brochures/vista-magna.pdf', 'https://livcapitalgdl.mx', 'liv-capital', 'vista@capitalurbano.com', '+52 33 1000 1002', 1, 1, 2, '2026-06-02 21:45:25', '2026-06-02 21:45:25', '[\"Coworking en planta baja\",\"Gimnasio equipado\",\"Terrazas privadas en niveles altos\",\"Seguridad 24/7\"]'),
(3, 'torres-myth', 'Torres Myth', 'El siguiente ícono en zona Country', 'Torres Myth será un complejo de gran escala con dos torres residenciales, áreas verdes y concepto de comunidad integrada. Proyecto en planeación — contenido mock.', 'Country', 'Av. Patria 2400, Jardines de la Patria', 'Guadalajara', 'Jalisco', '320 departamentos', 40, 320, 'planning', 'Por definir — 2029+', '/uploads/developments/torres-myth-hero.jpg', NULL, NULL, NULL, 'myth@capitalurbano.com', '+52 33 1000 1003', 1, 1, 3, '2026-06-02 21:45:25', '2026-06-02 21:45:25', '[\"Master plan de 2 torres\",\"Áreas verdes centralizadas\",\"Comercio en planta baja\",\"Modelo sustentable\"]');

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
(2, 1, 'image', '/uploads/developments/punto-sao-paulo-2.jpg', 'Lobby (mock)', 2, 1, '2026-06-02 21:45:25'),
(3, 2, 'image', '/uploads/developments/vista-magna-1.jpg', 'Vista aérea (mock)', 1, 1, '2026-06-02 21:45:25'),
(4, 3, 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Recorrido virtual (mock)', 1, 1, '2026-06-02 21:45:25');

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

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `email`, `status`, `source`, `ip_address`, `subscribed_at`, `unsubscribed_at`) VALUES
(1, 'newsletter.mock1@example.com', 'subscribed', 'footer', '127.0.0.1', '2026-06-02 21:45:25', NULL),
(2, 'newsletter.mock2@example.com', 'subscribed', 'contact', '127.0.0.1', '2026-06-02 21:45:25', NULL),
(3, 'inversionista.mock@example.com', 'subscribed', 'footer', '127.0.0.1', '2026-06-02 21:45:25', NULL);

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

-- --------------------------------------------------------

--
-- Table structure for table `quality_pillars`
--

CREATE TABLE `quality_pillars` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(120) NOT NULL,
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

INSERT INTO `quality_pillars` (`id`, `title`, `description`, `icon`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Alianzas a Largo Plazo', 'Relaciones duraderas con proveedores y socios certificados internacionalmente.', 'handshake', 1, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(2, 'Metodología BIM', 'Procesos constructivos optimizados con modelado de información de construcción.', 'grid-3x3', 2, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(3, 'Inspecciones Externas', 'Control de calidad independiente en cada fase del proyecto.', 'clipboard-check', 3, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(4, 'Automatización de Procesos', 'Sistemas avanzados para garantizar eficiencia y precisión constructiva.', 'cog', 4, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25');

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
(5, 'contact_address', 'Guadalajara, Jalisco, México', 1, '2026-06-02 21:45:25'),
(6, 'contact_hours', 'Lunes a Viernes, 9:00 – 18:00', 1, '2026-06-02 21:45:25'),
(7, 'newsletter_heading', 'Mantente actualizado', 1, '2026-06-02 21:45:25'),
(8, 'newsletter_subcopy', 'Suscríbete para recibir información sobre nuestros nuevos proyectos.', 1, '2026-06-02 21:45:25'),
(9, 'stat_sqm_built', '900000', 1, '2026-06-02 21:45:25'),
(10, 'stat_sqm_developed', '500000', 1, '2026-06-02 21:45:25'),
(11, 'stat_years_experience', '25', 1, '2026-06-02 21:45:25'),
(12, 'stat_families', '5000', 1, '2026-06-02 21:45:25'),
(13, 'whatsapp_number', '526241234567', 1, '2026-06-02 21:45:25'),
(14, 'map_lat', '20.6736', 0, '2026-06-02 21:45:25'),
(15, 'map_lng', '-103.3444', 0, '2026-06-02 21:45:25'),
(17, 'under_construction', '0', 1, '2026-06-02 22:12:23'),
(18, 'coming_soon_title', 'Capital Urbano', 1, '2026-06-02 22:12:23'),
(19, 'coming_soon_subtitle', 'Desarrollos verticales de excelencia — Guadalajara, Jalisco', 1, '2026-06-02 22:12:23'),
(20, 'instagram_url', '', 1, '2026-06-02 22:12:23');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `role_title` varchar(120) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
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

INSERT INTO `team_members` (`id`, `name`, `role_title`, `bio`, `photo_url`, `linkedin_url`, `is_leadership`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Gilberto Cordero', 'Director General', 'Más de 25 años liderando desarrollos verticales de alto perfil en Guadalajara. Referente en calidad constructiva y visión urbana. (Perfil mock)', '/uploads/team/gilberto-cordero.jpg', 'https://linkedin.com/in/mock-gilberto', 1, 1, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(2, 'María Fernanda Ruiz', 'Directora Comercial', 'Especialista en preventa de desarrollos verticales y experiencia del cliente. (Mock)', '/uploads/team/maria-ruiz.jpg', NULL, 1, 2, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(3, 'Carlos Méndez', 'Director de Obra', 'Ingeniero civil con enfoque BIM y cumplimiento de estándares internacionales. (Mock)', '/uploads/team/carlos-mendez.jpg', NULL, 1, 3, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25'),
(4, 'Ana Lucía Torres', 'Marketing & Comunicación', 'Estrategia de marca y relaciones públicas para el portafolio Capital Urbano. (Mock)', '/uploads/team/ana-torres.jpg', NULL, 0, 4, 1, '2026-06-02 21:45:25', '2026-06-02 21:45:25');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `developments`
--
ALTER TABLE `developments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `development_media`
--
ALTER TABLE `development_media`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quality_pillars`
--
ALTER TABLE `quality_pillars`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_sessions`
--
ALTER TABLE `admin_sessions`
  ADD CONSTRAINT `fk_sessions_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
