-- Editable customer journey (4 steps) for /experience — public site_settings JSON.

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `is_public`) VALUES
('experience_journey_title', 'Tu recorrido con nosotros', 1),
('experience_journey_intro', 'Cuatro etapas pensadas para que cada decisión sea informada y tranquila.', 1),
(
  'experience_journey_steps',
  '[{"icon":"message-circle","title":"Asesoría inicial","description":"Entendemos tu perfil, respondemos dudas y te orientamos sobre el desarrollo que mejor se adapta a ti."},{"icon":"file-check","title":"Reserva y documentación","description":"Acompañamiento en contratos, planes de pago y actualizaciones periódicas del avance de obra."},{"icon":"key-round","title":"Entrega","description":"Recorrido de entrega, revisión de acabados y entrega de llaves con protocolos claros."},{"icon":"headphones","title":"Postventa","description":"Canal dedicado para garantías, dudas y soporte después de la escrituración."}]',
  1
)
ON DUPLICATE KEY UPDATE
  `setting_value` = VALUES(`setting_value`),
  `is_public` = 1;
