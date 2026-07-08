-- Expanded About page copy (UTF-8) + fix team bios if still showing mock markers.

UPDATE `cms_pages` SET
  `body_markdown` = '## Nuestra esencia\n\nCapital Urbano es la desarrolladora del grupo especializada en **proyectos verticales residenciales y mixos** que elevan el perfil urbano de Guadalajara. Cada torre combina arquitectura contemporánea, eficiencia constructiva y ubicaciones estratégicas que conectan con servicios, movilidad y vida de ciudad.\n\n## Liderazgo con visión\n\nBajo la dirección de **Gilberto Cordero**, hemos consolidado un portafolio que incluye desarrollos emblemáticos como Punto Sao Paulo, Vista Magna y Torres Myth, además de alianzas con marcas verticales como LIV Capital cuando el proyecto lo requiere.\n\n## Lo que nos distingue\n\n- Más de 25 años de trayectoria en el mercado tapatío\n- Metodología BIM y control de calidad con inspecciones independientes\n- Alianzas de largo plazo con proveedores certificados\n- Enfoque en comunidades sustentables, seguras y con amenidades de primer nivel\n- Transparencia en plazos, documentación y comunicación con inversionistas y compradores\n\n## Compromiso social y urbano\n\nCreemos que un desarrollo vertical exitoso no solo suma metros cuadrados: **reactiva zonas**, genera empleo en la cadena de valor y ofrece hogares con estándares internacionales para familias que buscan ubicación, diseño y plusvalía.\n\n> Construimos no solo edificios: creamos el escenario donde miles de familias escriben su siguiente capítulo.',
  `meta_description` = 'Capital Urbano: 25+ años desarrollando proyectos verticales premium en Guadalajara bajo el liderazgo de Gilberto Cordero.',
  `is_published` = 1
WHERE `slug` = 'about';

UPDATE `team_members` SET `bio` = 'Más de 25 años liderando desarrollos verticales de alto perfil en Guadalajara. Referente en calidad constructiva, planeación urbana y visión de largo plazo.'
WHERE `name` = 'Gilberto Cordero';

UPDATE `team_members` SET `bio` = 'Especialista en preventa de desarrollos verticales premium y diseño de la experiencia del cliente en cada punto de contacto.'
WHERE `name` = 'María Fernanda Ruiz';

UPDATE `team_members` SET `bio` = 'Ingeniero civil con enfoque BIM, control de obra y cumplimiento de estándares internacionales en proyectos de gran escala.'
WHERE `name` = 'Carlos Méndez';

UPDATE `team_members` SET `bio` = 'Estrategia de marca, comunicación y relaciones públicas para el portafolio Capital Urbano y sus lanzamientos.'
WHERE `name` = 'Ana Lucía Torres';
