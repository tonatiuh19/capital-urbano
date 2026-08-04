-- Seed default blog tags (idempotent)

INSERT INTO `blog_tags` (`slug`, `name`)
SELECT 'guadalajara', 'Guadalajara'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `blog_tags` WHERE `slug` = 'guadalajara');

INSERT INTO `blog_tags` (`slug`, `name`)
SELECT 'vivienda-vertical', 'Vivienda vertical'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `blog_tags` WHERE `slug` = 'vivienda-vertical');

INSERT INTO `blog_tags` (`slug`, `name`)
SELECT 'preventa', 'Preventa'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `blog_tags` WHERE `slug` = 'preventa');

INSERT INTO `blog_tags` (`slug`, `name`)
SELECT 'inversion', 'Inversión'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `blog_tags` WHERE `slug` = 'inversion');

INSERT INTO `blog_tags` (`slug`, `name`)
SELECT 'calidad', 'Calidad'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `blog_tags` WHERE `slug` = 'calidad');

INSERT INTO `blog_tags` (`slug`, `name`)
SELECT 'liv-capital', 'LIV Capital'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `blog_tags` WHERE `slug` = 'liv-capital');
