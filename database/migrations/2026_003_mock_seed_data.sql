-- Mock / seed data for local and staging testing.
-- Safe to run once via migrate.php; uses subqueries keyed by slug/email to avoid duplicates on re-import of schema.sql.

-- ─── Site stats (homepage trust indicators) ─────────────────────────────────
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('stat_sqm_built', '900000', 1),
('stat_sqm_developed', '500000', 1),
('stat_years_experience', '25', 1),
('stat_families', '5000', 1),
('whatsapp_number', '526241234567', 1),
('map_lat', '20.6736', 0),
('map_lng', '-103.3444', 0)
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- ─── Developments (rich mock detail) ────────────────────────────────────────
UPDATE `developments` SET
  `tagline` = 'Vida vertical en el corazón de la ciudad',
  `description` = 'Punto Sao Paulo redefine el centro de Guadalajara con torres residenciales de diseño contemporáneo, amenidades de primer nivel y conectividad urbana inmediata. Proyecto mock para pruebas de CMS.',
  `address_line` = 'Av. Juárez 500, Zona Centro',
  `city` = 'Guadalajara',
  `state` = 'Jalisco',
  `delivery_estimate` = 'Segundo semestre 2027',
  `total_floors` = 32,
  `total_units` = 220,
  `hero_image_url` = '/uploads/developments/punto-sao-paulo-hero.jpg',
  `brochure_url` = '/uploads/brochures/punto-sao-paulo.pdf',
  `highlights` = '["Roof garden con alberca","Lobby doble altura","Estacionamiento inteligente","Certificación en proceso LEED"]',
  `contact_email` = 'punto@capitalurbano.com',
  `contact_phone` = '+52 33 1000 1001',
  `external_site_url` = NULL,
  `liv_project_slug` = NULL
WHERE `slug` = 'punto-sao-paulo';

UPDATE `developments` SET
  `tagline` = 'Elegancia vertical en Providencia',
  `description` = 'Vista Magna ofrece departamentos premium con vistas panorámicas, acabados de lujo y proximidad a los mejores servicios de la zona. Datos de demostración.',
  `address_line` = 'Av. Américas 1500, Providencia',
  `city` = 'Guadalajara',
  `state` = 'Jalisco',
  `delivery_estimate` = 'Primer trimestre 2028',
  `total_floors` = 28,
  `total_units` = 180,
  `hero_image_url` = '/uploads/developments/vista-magna-hero.jpg',
  `brochure_url` = '/uploads/brochures/vista-magna.pdf',
  `highlights` = '["Coworking en planta baja","Gimnasio equipado","Terrazas privadas en niveles altos","Seguridad 24/7"]',
  `contact_email` = 'vista@capitalurbano.com',
  `contact_phone` = '+52 33 1000 1002',
  `external_site_url` = 'https://livcapitalgdl.mx',
  `liv_project_slug` = 'liv-capital'
WHERE `slug` = 'vista-magna';

UPDATE `developments` SET
  `tagline` = 'El siguiente ícono en zona Country',
  `description` = 'Torres Myth será un complejo de gran escala con dos torres residenciales, áreas verdes y concepto de comunidad integrada. Proyecto en planeación — contenido mock.',
  `address_line` = 'Av. Patria 2400, Jardines de la Patria',
  `city` = 'Guadalajara',
  `state` = 'Jalisco',
  `delivery_estimate` = 'Por definir — 2029+',
  `total_floors` = 40,
  `total_units` = 320,
  `hero_image_url` = '/uploads/developments/torres-myth-hero.jpg',
  `brochure_url` = NULL,
  `highlights` = '["Master plan de 2 torres","Áreas verdes centralizadas","Comercio en planta baja","Modelo sustentable"]',
  `contact_email` = 'myth@capitalurbano.com',
  `contact_phone` = '+52 33 1000 1003',
  `external_site_url` = NULL,
  `liv_project_slug` = NULL
WHERE `slug` = 'torres-myth';

-- ─── Development media (only if none exist for that project) ────────────────
INSERT INTO `development_media` (`development_id`, `media_type`, `url`, `caption`, `display_order`)
SELECT d.`id`, 'image', '/uploads/developments/punto-sao-paulo-1.jpg', 'Fachada principal (mock)', 1
FROM `developments` d WHERE d.`slug` = 'punto-sao-paulo'
  AND NOT EXISTS (SELECT 1 FROM `development_media` m WHERE m.`development_id` = d.`id`);

INSERT INTO `development_media` (`development_id`, `media_type`, `url`, `caption`, `display_order`)
SELECT d.`id`, 'image', '/uploads/developments/punto-sao-paulo-2.jpg', 'Lobby (mock)', 2
FROM `developments` d WHERE d.`slug` = 'punto-sao-paulo'
  AND (SELECT COUNT(*) FROM `development_media` m WHERE m.`development_id` = d.`id`) < 2;

INSERT INTO `development_media` (`development_id`, `media_type`, `url`, `caption`, `display_order`)
SELECT d.`id`, 'image', '/uploads/developments/vista-magna-1.jpg', 'Vista aérea (mock)', 1
FROM `developments` d WHERE d.`slug` = 'vista-magna'
  AND NOT EXISTS (SELECT 1 FROM `development_media` m WHERE m.`development_id` = d.`id`);

INSERT INTO `development_media` (`development_id`, `media_type`, `url`, `caption`, `display_order`)
SELECT d.`id`, 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Recorrido virtual (mock)', 1
FROM `developments` d WHERE d.`slug` = 'torres-myth'
  AND NOT EXISTS (SELECT 1 FROM `development_media` m WHERE m.`development_id` = d.`id`);

-- ─── Quality pillars (homepage) ─────────────────────────────────────────────
INSERT INTO `quality_pillars` (`title`, `description`, `icon`, `display_order`, `is_active`)
SELECT 'Alianzas a Largo Plazo', 'Relaciones duraderas con proveedores y socios certificados internacionalmente.', 'handshake', 1, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `quality_pillars` LIMIT 1);

INSERT INTO `quality_pillars` (`title`, `description`, `icon`, `display_order`, `is_active`)
SELECT 'Metodología BIM', 'Procesos constructivos optimizados con modelado de información de construcción.', 'grid-3x3', 2, 1
FROM DUAL WHERE (SELECT COUNT(*) FROM `quality_pillars`) < 2;

INSERT INTO `quality_pillars` (`title`, `description`, `icon`, `display_order`, `is_active`)
SELECT 'Inspecciones Externas', 'Control de calidad independiente en cada fase del proyecto.', 'clipboard-check', 3, 1
FROM DUAL WHERE (SELECT COUNT(*) FROM `quality_pillars`) < 3;

INSERT INTO `quality_pillars` (`title`, `description`, `icon`, `display_order`, `is_active`)
SELECT 'Automatización de Procesos', 'Sistemas avanzados para garantizar eficiencia y precisión constructiva.', 'cog', 4, 1
FROM DUAL WHERE (SELECT COUNT(*) FROM `quality_pillars`) < 4;

-- ─── Team ─────────────────────────────────────────────────────────────────────
INSERT INTO `team_members` (`name`, `role_title`, `bio`, `photo_url`, `linkedin_url`, `is_leadership`, `display_order`, `is_active`)
SELECT 'Gilberto Cordero', 'Director General', 'Más de 25 años liderando desarrollos verticales de alto perfil en Guadalajara. Referente en calidad constructiva y visión urbana. (Perfil mock)', '/uploads/team/gilberto-cordero.jpg', 'https://linkedin.com/in/mock-gilberto', 1, 1, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `team_members` WHERE `name` = 'Gilberto Cordero');

INSERT INTO `team_members` (`name`, `role_title`, `bio`, `photo_url`, `is_leadership`, `display_order`, `is_active`)
SELECT 'María Fernanda Ruiz', 'Directora Comercial', 'Especialista en preventa de desarrollos verticales y experiencia del cliente. (Mock)', '/uploads/team/maria-ruiz.jpg', 1, 2, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `team_members` WHERE `name` = 'María Fernanda Ruiz');

INSERT INTO `team_members` (`name`, `role_title`, `bio`, `photo_url`, `is_leadership`, `display_order`, `is_active`)
SELECT 'Carlos Méndez', 'Director de Obra', 'Ingeniero civil con enfoque BIM y cumplimiento de estándares internacionales. (Mock)', '/uploads/team/carlos-mendez.jpg', 1, 3, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `team_members` WHERE `name` = 'Carlos Méndez');

INSERT INTO `team_members` (`name`, `role_title`, `bio`, `photo_url`, `is_leadership`, `display_order`, `is_active`)
SELECT 'Ana Lucía Torres', 'Marketing & Comunicación', 'Estrategia de marca y relaciones públicas para el portafolio Capital Urbano. (Mock)', '/uploads/team/ana-torres.jpg', 0, 4, 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `team_members` WHERE `name` = 'Ana Lucía Torres');

-- ─── CMS pages (markdown bodies) ──────────────────────────────────────────────
UPDATE `cms_pages` SET
  `body_markdown` = '# Sobre Capital Urbano\n\nBajo el liderazgo de **Gilberto Cordero**, somos una desarrolladora especializada en proyectos verticales residenciales y mixtos en Guadalajara.\n\n## Cifras (mock)\n- 900,000+ m² construidos\n- 500,000+ m² desarrollados\n- 5,000+ familias\n\n> Contenido de demostración para pruebas del CMS.',
  `meta_description` = 'Historia, liderazgo y trayectoria de Capital Urbano en Guadalajara.',
  `is_published` = 1,
  `published_at` = NOW()
WHERE `slug` = 'about';

UPDATE `cms_pages` SET
  `body_markdown` = '# Calidad\n\nNuestros cuatro pilares garantizan excelencia en cada etapa: alianzas, BIM, inspecciones externas y automatización.\n\nEste texto es **mock** hasta cargar contenido final.',
  `meta_description` = 'Pilares de calidad y estándares constructivos de Capital Urbano.',
  `is_published` = 1,
  `published_at` = NOW()
WHERE `slug` = 'quality';

UPDATE `cms_pages` SET
  `body_markdown` = '# Experiencia del Cliente\n\nAcompañamos desde la primera visita hasta la entrega y post-venta.\n\n- Asesoría personalizada\n- Portal de propietarios (próximamente)\n- Garantías documentadas\n\n*Datos de prueba.*',
  `meta_description` = 'Experiencia premium para inversionistas y compradores.',
  `is_published` = 1,
  `published_at` = NOW()
WHERE `slug` = 'experience';

UPDATE `cms_pages` SET
  `body_markdown` = '# Contacto\n\nEscríbenos o agenda una llamada. Horario: Lunes a Viernes 9:00–18:00.\n\n**contacto@capitalurbano.com** · +52 33 0000 0000',
  `meta_description` = 'Contacta al equipo comercial de Capital Urbano.',
  `is_published` = 1,
  `published_at` = NOW()
WHERE `slug` = 'contact';

-- ─── Test admin (OTP login in dev — change email before production) ───────────
INSERT INTO `admins` (`name`, `email`, `role`, `is_active`) VALUES
('Admin Pruebas', 'admin@capitalurbano.test', 'superadmin', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `is_active` = 1;

-- ─── Newsletter subscribers ───────────────────────────────────────────────────
INSERT INTO `newsletter_subscribers` (`email`, `status`, `source`, `ip_address`) VALUES
('newsletter.mock1@example.com', 'subscribed', 'footer', '127.0.0.1'),
('newsletter.mock2@example.com', 'subscribed', 'contact', '127.0.0.1'),
('inversionista.mock@example.com', 'subscribed', 'footer', '127.0.0.1')
ON DUPLICATE KEY UPDATE `status` = 'subscribed';

-- ─── Clients (CRM mock) ───────────────────────────────────────────────────────
INSERT INTO `clients` (`email`, `name`, `phone`, `interest`, `preferred_development_id`, `tags`, `admin_notes`, `newsletter_opt_in`, `first_source`, `last_contact_at`)
SELECT 'lead.mock1@example.com', 'Juan Pérez Mock', '+52 33 3000 0001', 'investment', d.`id`, '["hot_lead","mock"]', 'Interesado en Punto Sao Paulo — dato de prueba.', 1, 'contact_form', NOW()
FROM `developments` d WHERE d.`slug` = 'punto-sao-paulo'
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `admin_notes` = VALUES(`admin_notes`);

INSERT INTO `clients` (`email`, `name`, `phone`, `interest`, `preferred_development_id`, `tags`, `admin_notes`, `newsletter_opt_in`, `first_source`, `last_contact_at`)
SELECT 'lead.mock2@example.com', 'Sofía López Mock', '+52 33 3000 0002', 'general', d.`id`, '["needs_followup","mock"]', 'Preguntó por Vista Magna y LIV Capital.', 0, 'contact_form', DATE_SUB(NOW(), INTERVAL 2 DAY)
FROM `developments` d WHERE d.`slug` = 'vista-magna'
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `clients` (`email`, `name`, `phone`, `interest`, `tags`, `admin_notes`, `newsletter_opt_in`, `first_source`, `last_contact_at`) VALUES
('socio.mock@example.com', 'Grupo Inmobiliario Delta (Mock)', '+52 55 5000 0000', 'partnership', '["investor","mock"]', 'Busca alianza para Torres Myth.', 0, 'contact_form', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('prensa.mock@example.com', 'Revista Skyline Mock', NULL, 'press', '["mock"]', 'Solicitud de prensa — mock.', 0, 'contact_form', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `admin_notes` = VALUES(`admin_notes`);

INSERT INTO `clients` (`email`, `name`, `newsletter_opt_in`, `first_source`, `last_contact_at`) VALUES
('newsletter.mock1@example.com', 'newsletter.mock1@example.com', 1, 'newsletter', NOW())
ON DUPLICATE KEY UPDATE `newsletter_opt_in` = 1;

-- ─── Contact submissions (inbox mock) ─────────────────────────────────────────
INSERT INTO `contact_submissions` (`client_id`, `development_id`, `name`, `email`, `phone`, `interest`, `subject`, `message`, `source_page`, `status`, `ip_address`)
SELECT c.`id`, d.`id`, 'Juan Pérez Mock', 'lead.mock1@example.com', '+52 33 3000 0001', 'investment', 'Información Punto Sao Paulo',
  'Me interesa conocer precios y planes de pago para invertir. (Mensaje mock)', '/contact', 'new', '127.0.0.1'
FROM `clients` c
JOIN `developments` d ON d.`slug` = 'punto-sao-paulo'
WHERE c.`email` = 'lead.mock1@example.com'
  AND NOT EXISTS (SELECT 1 FROM `contact_submissions` cs WHERE cs.`email` = 'lead.mock1@example.com');

INSERT INTO `contact_submissions` (`client_id`, `development_id`, `name`, `email`, `phone`, `interest`, `subject`, `message`, `source_page`, `status`, `ip_address`)
SELECT c.`id`, d.`id`, 'Sofía López Mock', 'lead.mock2@example.com', '+52 33 3000 0002', 'general', 'Visita Vista Magna',
  '¿Puedo agendar recorrido la próxima semana? (Mock)', '/contact', 'read', '127.0.0.1'
FROM `clients` c
JOIN `developments` d ON d.`slug` = 'vista-magna'
WHERE c.`email` = 'lead.mock2@example.com'
  AND NOT EXISTS (SELECT 1 FROM `contact_submissions` cs WHERE cs.`email` = 'lead.mock2@example.com');

INSERT INTO `contact_submissions` (`client_id`, `name`, `email`, `interest`, `subject`, `message`, `source_page`, `status`, `ip_address`)
SELECT c.`id`, 'Grupo Inmobiliario Delta (Mock)', 'socio.mock@example.com', 'partnership', 'Alianza estratégica',
  'Representamos fondo de inversión — buscamos co-desarrollo. (Mock)', '/contact', 'new', '127.0.0.1'
FROM `clients` c WHERE c.`email` = 'socio.mock@example.com'
  AND NOT EXISTS (SELECT 1 FROM `contact_submissions` cs WHERE cs.`email` = 'socio.mock@example.com');

INSERT INTO `contact_submissions` (`client_id`, `name`, `email`, `interest`, `subject`, `message`, `source_page`, `status`, `ip_address`)
SELECT c.`id`, 'Revista Skyline Mock', 'prensa.mock@example.com', 'press', 'Entrevista dirección',
  'Solicitud de entrevista con dirección general para reportaje especial. (Mock)', '/contact', 'archived', '127.0.0.1'
FROM `clients` c WHERE c.`email` = 'prensa.mock@example.com'
  AND NOT EXISTS (SELECT 1 FROM `contact_submissions` cs WHERE cs.`email` = 'prensa.mock@example.com');
