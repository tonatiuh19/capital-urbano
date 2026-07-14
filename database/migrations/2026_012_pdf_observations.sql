-- Client feedback — Observaciones página WEB (2026-07-09)

-- Contact office address
UPDATE `site_settings` SET `setting_value` = 'Francisco J. Mujica 604, Jardines Alcalda, Guadalajara, Jalisco. C.P. 44298'
WHERE `setting_key` = 'contact_address';

-- Hero / about subtitles (CMS-driven where applicable)
UPDATE `site_settings` SET `setting_value` = 'Desarrollamos vivienda conectada a la ciudad'
WHERE `setting_key` = 'about_hero_subtitle';

UPDATE `site_settings` SET `setting_value` = 'Construimos Valor Que Permanece'
WHERE `setting_key` = 'coming_soon_subtitle';

-- Remove confusing stat (keep value in DB for admin reference; UI hides it)
UPDATE `site_settings` SET `setting_value` = ''
WHERE `setting_key` = 'stat_sqm_developed';

-- Quality pillar rename (home + /quality)
UPDATE `quality_pillars` SET
  `title` = 'Alianza con los mejores fabricantes',
  `description` = 'Relaciones con fabricantes líderes y socios certificados que respaldan cada acabado y sistema constructivo.'
WHERE `title` = 'Alianzas a Largo Plazo';

-- About page CMS body
UPDATE `cms_pages` SET
  `meta_description` = 'Capital Urbano desarrolla vivienda vertical construida con metodología técnica, control de calidad y visión de largo plazo en Guadalajara.',
  `body_markdown` = '## Nuestra esencia

Capital Urbano es la desarrolladora del grupo especializada en **proyectos verticales residenciales y mixos** que elevan el perfil urbano de Guadalajara.

## Liderazgo con visión

Bajo la dirección de **Gilberto Cordero**, consolidamos un portafolio con desarrollos emblemáticos y alianzas estratégicas con proveedores confiables.

## Lo que nos distingue

- Metodología BIM y control de calidad con inspecciones externas independientes del contratista
- Alianzas de largo plazo con proveedores y materiales certificados
- Enfoque en las comunidades para entregar amenidades funcionales y adecuadas
- Transparencia en plazos de ejecución, reportes y comunicación con compradores e inversionistas

> Construimos no solo edificios: creamos el escenario donde miles de familias escriben su siguiente capítulo.'
WHERE `slug` = 'about';

UPDATE `cms_pages` SET
  `meta_description` = 'Experiencia del cliente Capital Urbano: asesoría, contrato PROFECO, entrega documentada y participación de propietarios.'
WHERE `slug` = 'experience';

-- Experience journey (editable in admin; defaults applied here)
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`)
SELECT 'experience_owners_integration',
  'Integramos a los propietarios desde el día 1 del inicio de operación del edificio, en comisiones de inspección y vigilancia para que se vigile el correcto gasto de los recursos.',
  1
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `setting_key` = 'experience_owners_integration'
);

UPDATE `site_settings` SET `setting_value` = 'Integramos a los propietarios desde el día 1 del inicio de operación del edificio, en comisiones de inspección y vigilancia para que se vigile el correcto gasto de los recursos.'
WHERE `setting_key` = 'experience_owners_integration';

UPDATE `site_settings` SET `setting_value` = '[
  {"icon":"message-circle","title":"Asesoría inicial","description":"Entendemos tu perfil, respondemos dudas y te orientamos sobre el desarrollo que mejor se adapta a ti."},
  {"icon":"file-check","title":"Reserva y documentación","description":"Contrato supervisado por PROFECO y reportes mensuales de avance durante la construcción."},
  {"icon":"key-round","title":"Entrega","description":"Recorrido de entrega de tu unidad con protocolos de revisión de la calidad de tus acabados y entrega de llaves."},
  {"icon":"headphones","title":"Postventa","description":"Canal dedicado para garantías, dudas y soporte después de la escrituración."}
]'
WHERE `setting_key` = 'experience_journey_steps';

-- Team: add Olaf (confirm remaining names/photos via Admin → Equipo)
INSERT INTO `team_members` (`name`, `role_title`, `bio`, `photo_url`, `is_leadership`, `display_order`, `is_active`)
SELECT 'Olaf Rodriguez Arroche', 'Análisis de datos manager', 'Análisis de datos y seguimiento de indicadores para la toma de decisiones en desarrollo y operación.', NULL, 0, 5, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `team_members` WHERE `name` = 'Olaf Rodriguez Arroche');

UPDATE `team_members` SET `bio` = REPLACE(`bio`, ' (Perfil mock)', '') WHERE `bio` LIKE '%(Perfil mock)%';
UPDATE `team_members` SET `bio` = REPLACE(`bio`, ' (Mock)', '') WHERE `bio` LIKE '%(Mock)%';
