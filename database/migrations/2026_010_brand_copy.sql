-- Brand alignment: official copy from Comunicación Capital Urbano (PDF).

UPDATE `site_settings` SET `setting_value` = 'Desarrollamos permanencia urbana'
WHERE `setting_key` = 'about_hero_subtitle';

UPDATE `site_settings` SET `setting_value` = 'Construimos valor que permanece.'
WHERE `setting_key` = 'coming_soon_subtitle';

UPDATE `cms_pages` SET
  `meta_description` = 'Capital Urbano desarrolla vivienda vertical intraurbana con método, control técnico y visión de largo plazo en Guadalajara.',
  `body_markdown` = '## Nuestra esencia

Capital Urbano es la desarrolladora del grupo especializada en **proyectos verticales residenciales y mixos** que elevan el perfil urbano de Guadalajara. Cada torre combina arquitectura contemporánea, eficiencia constructiva y ubicaciones estratégicas.

## Liderazgo con visión

Bajo la dirección de **Gilberto Cordero**, consolidamos un portafolio con desarrollos emblemáticos y alianzas estratégicas cuando el proyecto lo requiere.

## Lo que nos distingue

- Más de 25 años de trayectoria en el mercado tapatío
- Metodología BIM y control de calidad con inspecciones independientes
- Alianzas de largo plazo con proveedores certificados
- Enfoque en comunidades con amenidades de primer nivel y operación documentada
- Transparencia en plazos, documentación y comunicación con inversionistas y compradores

## Compromiso social y urbano

Creemos que un desarrollo vertical exitoso no solo suma metros cuadrados: **reactiva zonas**, genera empleo en la cadena de valor y ofrece hogares con estándares internacionales para familias que buscan ubicación, diseño y valor patrimonial.

> Construimos no solo edificios: creamos el escenario donde miles de familias escriben su siguiente capítulo.'
WHERE `slug` = 'about';

UPDATE `cms_pages` SET
  `meta_description` = 'Cuatro pilares de calidad verificable: alianzas, BIM, inspecciones externas y automatización de procesos.',
  `body_markdown` = '## Compromiso con la excelencia

En Capital Urbano la calidad no es un departamento: es el **sistema** que articula diseño, obra, proveedores y entrega. Cada proyecto se documenta, supervisa y valida con estándares comparables a desarrollos internacionales.

## De la planeación a la entrega

Integramos modelado BIM desde las etapas tempranas para anticipar interferencias, optimizar tiempos y garantizar que lo proyectado sea lo construido. Las inspecciones externas en hitos críticos añaden una capa independiente de verificación.

## Resultado para el cliente

Departamentos con acabados de calidad, procesos transparentes y garantías documentadas. La confianza se construye metro a metro.'
WHERE `slug` = 'quality';

UPDATE `cms_pages` SET
  `meta_description` = 'Acompañamiento con método: asesoría, preventa, personalización y postventa documentada.',
  `body_markdown` = '## Experiencia del cliente

Acompañamos desde la primera visita hasta la entrega y postventa con procesos claros y comunicación transparente.

- Asesoría personalizada
- Documentación y seguimiento de obra
- Garantías documentadas'
WHERE `slug` = 'experience';

UPDATE `cms_pages` SET
  `meta_description` = 'Contacta a Capital Urbano: asesoría comercial, inversiones y alianzas en Guadalajara.'
WHERE `slug` = 'contact';

UPDATE `team_members` SET `bio` = 'Especialista en preventa de desarrollos verticales y diseño de la experiencia del cliente en cada punto de contacto.'
WHERE `name` = 'María Fernanda Ruiz';
