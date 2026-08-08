-- Contact form admin notify + public contact email.
UPDATE `site_settings`
SET `setting_value` = 'contacto@capitalurbanogdl.com',
    `is_public` = 1
WHERE `setting_key` = 'contact_email';
