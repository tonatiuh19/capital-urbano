-- Email audit trail for contact (and other) transactional mail.

CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `recipient_email` varchar(255) NOT NULL,
  `recipient_name` varchar(160) DEFAULT NULL,
  `template_type` varchar(64) NOT NULL,
  `contact_id` int unsigned DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` enum('sent','failed','skipped') NOT NULL DEFAULT 'sent',
  `mailer_response` text,
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email_logs_contact` (`contact_id`),
  KEY `idx_email_logs_recipient` (`recipient_email`),
  KEY `idx_email_logs_type` (`template_type`),
  CONSTRAINT `fk_email_logs_contact`
    FOREIGN KEY (`contact_id`) REFERENCES `contact_submissions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
