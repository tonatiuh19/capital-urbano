-- Professional CMS copy for public pages (replaces short mock bodies).

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('contact_address', 'Av. Américas 1500, Piso 12, Providencia, Guadalajara, Jalisco', 1),
('contact_hours', 'Lunes a viernes · 9:00 – 18:00 hrs', 1),
('about_hero_subtitle', 'Desarrolladora vertical premium en Guadalajara', 1),
('quality_hero_subtitle', 'Estándares internacionales en cada metro construido', 1),
('experience_hero_subtitle', 'Un proceso claro, humano y transparente de principio a fin', 1)
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`), `is_public` = 1;

UPDATE `team_members` SET
  `bio` = 'Más de 25 años liderando desarrollos verticales de alto perfil en Guadalajara. Referente en calidad constructiva, planeación urbana y visión de largo plazo.'
WHERE `name` = 'Gilberto Cordero';

UPDATE `team_members` SET
  `bio` = 'Especialista en preventa de desarrollos verticales premium y diseño de la experiencia del cliente en cada punto de contacto.'
WHERE `name` = 'María Fernanda Ruiz';

UPDATE `team_members` SET
  `bio` = 'Ingeniero civil con enfoque BIM, control de obra y cumplimiento de estándares internacionales en proyectos de gran escala.'
WHERE `name` = 'Carlos Méndez';

UPDATE `team_members` SET
  `bio` = 'Estrategia de marca, comunicación y relaciones públicas para el portafolio Capital Urbano y sus lanzamientos.'
WHERE `name` = 'Ana Lucía Torres';

UPDATE `cms_pages` SET
  `title` = 'Nosotros',
  `meta_description` = 'Capital Urbano: 25+ años desarrollando proyectos verticales premium en Guadalajara bajo el liderazgo de Gilberto Cordero.',
  `body_markdown` = '## Nuestra esencia\n\nCapital Urbano es la desarrolladora del grupo especializada en **proyectos verticales residenciales y mixos** que elevan el perfil urbano de Guadalajara. Cada torre combina arquitectura contemporánea, eficiencia constructiva y ubicaciones estratégicas.\n\n## Liderazgo con visión\n\nBajo la dirección de **Gilberto Cordero**, hemos consolidado un portafolio que incluye desarrollos emblemáticos como Punto Sao Paulo, Vista Magna y Torres Myth, además de alianzas con marcas verticales como LIV Capital cuando el proyecto lo requiere.\n\n## Lo que nos distingue\n\n- Más de 25 años de trayectoria en el mercado tapatío\n- Metodología BIM y control de calidad con inspecciones independientes\n- Alianzas de largo plazo con proveedores certificados\n- Enfoque en comunidades sustentables, seguras y con amenidades de primer nivel\n\n> Construimos no solo edificios: creamos el escenario donde miles de familias escriben su siguiente capítulo.',
  `is_published` = 1,
  `published_at` = COALESCE(`published_at`, NOW())
WHERE `slug` = 'about';

UPDATE `cms_pages` SET
  `title` = 'Calidad',
  `meta_description` = 'Cuatro pilares de calidad Capital Urbano: alianzas, BIM, inspecciones externas y automatización de procesos.',
  `body_markdown` = '## Compromiso con la excelencia\n\nEn Capital Urbano la calidad no es un departamento: es el **sistema** que articula diseño, obra, proveedores y entrega. Cada proyecto se documenta, supervisa y valida con estándares comparables a desarrollos internacionales.\n\n## De la planeación a la entrega\n\nIntegramos modelado BIM desde las etapas tempranas para anticipar interferencias, optimizar tiempos y garantizar que lo proyectado sea lo construido. Las inspecciones externas en hitos críticos añaden una capa independiente de verificación.\n\n## Resultado para el cliente\n\nDepartamentos con acabados premium, procesos transparentes y garantías documentadas. La confianza se construye metro a metro.',
  `is_published` = 1,
  `published_at` = COALESCE(`published_at`, NOW())
WHERE `slug` = 'quality';

UPDATE `cms_pages` SET
  `title` = 'Experiencia',
  `meta_description` = 'Acompañamiento personalizado en Capital Urbano: asesoría, preventa, personalización y postventa.',
  `body_markdown` = '## Más que una compra, un acompañamiento\n\nSabemos que invertir en un departamento vertical es una decisión relevante. Por eso diseñamos un recorrido claro, con asesores dedicados y comunicación constante en cada etapa.\n\n## Nuestro compromiso contigo\n\n- Respuesta ágil a consultas por correo, teléfono o WhatsApp\n- Información veraz sobre avances de obra, fechas y disponibilidad\n- Documentación ordenada al momento de la firma y la entrega\n- Canal de postventa para garantías y atención posterior\n\n> Tu tranquilidad es parte del producto que entregamos.',
  `is_published` = 1,
  `published_at` = COALESCE(`published_at`, NOW())
WHERE `slug` = 'experience';

UPDATE `cms_pages` SET
  `title` = 'Contacto',
  `meta_description` = 'Contacta a Capital Urbano: asesoría comercial, inversiones y alianzas en Guadalajara.',
  `body_markdown` = '## Hablemos de tu próximo proyecto\n\nNuestro equipo comercial está listo para orientarte sobre disponibilidad, planes de inversión o alianzas estratégicas. Cuéntanos qué desarrollo te interesa y te respondemos con información clara y actualizada.',
  `is_published` = 1,
  `published_at` = COALESCE(`published_at`, NOW())
WHERE `slug` = 'contact';
