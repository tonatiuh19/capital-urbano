-- Developer credentials & stats from «Experiencia del desarrollador» (2025-11-26)
-- and brand narrative refinements from «Comunicación Capital Urbano» presentation.

UPDATE `site_settings` SET `setting_value` = '27' WHERE `setting_key` = 'stat_years_experience';
UPDATE `site_settings` SET `setting_value` = '1000000' WHERE `setting_key` = 'stat_sqm_built';

UPDATE `cms_pages` SET
  `meta_description` = 'Capital Urbano: fundada en 2021, liderada por Gilberto Cordero Estrada con 27 años y cerca de 1M m² construidos en desarrollo vertical en Guadalajara.',
  `body_markdown` = '## Nuestra esencia

Capital Urbano es la desarrolladora del grupo especializada en **proyectos verticales residenciales y mixos** que elevan el perfil urbano de Guadalajara.

## Liderazgo con visión

Bajo la dirección de **Gilberto Cordero Estrada**, socio fundador y CEO, consolidamos un portafolio con desarrollos emblemáticos y alianzas estratégicas con proveedores confiables.

Gilberto es ingeniero civil por la Universidad de Guadalajara, con maestría en valuación inmobiliaria por la UNIVA y posgrado en finanzas por la Universidad Panamericana. Cuenta con **27 años de experiencia** en construcción y cerca de **un millón de m² construidos**, incluyendo desarrollos verticales premium en Lomas del Valle, Providencia, Punto Sao Paulo, San Javier y Andares.

Entre los desarrollos en los que ha participado como director de proyectos: Moralta, Corporativo Vista Acueducto, Torres Myth del Country, Vista Magna, Villa Colomos, Citela, Vista Lomas, Neruda Providencia y Entorno México.

## Lo que nos distingue

- Metodología BIM y control de calidad con inspecciones externas independientes del contratista
- Alianzas de largo plazo con proveedores y materiales certificados (Urrea, Rinnai, Rehau, Arauco, Vitromex y más)
- Enfoque en las comunidades para entregar amenidades funcionales y adecuadas
- Transparencia en plazos de ejecución, reportes y comunicación con compradores e inversionistas

> No construimos solo para entregar. Construimos para que cada proyecto funcione, se mantenga y conserve valor.'
WHERE `slug` = 'about';

UPDATE `team_members` SET
  `name` = 'Gilberto Cordero Estrada',
  `role_title` = 'Socio fundador y CEO',
  `bio_short` = 'Ing. civil (UdG), maestría en valuación inmobiliaria (UNIVA). 27 años y cerca de 1M m² construidos en desarrollo vertical en Guadalajara.',
  `bio` = 'Ingeniero civil por la Universidad de Guadalajara, con maestría en valuación inmobiliaria por la UNIVA y posgrado en finanzas por la Universidad Panamericana. Fundó Capital Urbano en 2021 tras 27 años en construcción y desarrollo, con cerca de un millón de m² construidos. Como director de proyectos y encargado de desarrollo de producto en Rocher Holdings y Gerbera Capital, lideró desarrollos verticales premium y mixtos en Guadalajara — entre ellos Moralta, Vista Magna, Torres Myth del Country, Neruda Providencia y Entorno México. Estableció protocolos de calidad, alianzas con fabricantes líderes y sistemas de posventa con seguimiento en Procore.'
WHERE `name` IN ('Gilberto Cordero', 'Gilberto Cordero Estrada');
