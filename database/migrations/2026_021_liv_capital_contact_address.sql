-- Correct LIV Capital contact and address (client feedback Aug 2026).
UPDATE `developments`
SET
  `address_line` = 'Padre Kino 1030',
  `latitude` = 20.6902718,
  `longitude` = -103.3432575,
  `contact_email` = 'contacto@livcapitalgdl.mx',
  `contact_phone` = '33 2560 1815'
WHERE `slug` = 'liv-capital';
