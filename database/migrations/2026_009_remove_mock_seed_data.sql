-- Remove demo/mock rows seeded in 2026_003 (and related inbox/newsletter test data).
-- Keeps Punto Sao Paulo and non-mock production-ready records.

-- ─── Contact inbox (mock leads) ─────────────────────────────────────────────
DELETE FROM `contact_submissions`
WHERE `email` IN (
  'lead.mock1@example.com',
  'lead.mock2@example.com',
  'socio.mock@example.com',
  'prensa.mock@example.com'
);

-- Also remove any submission tied to developments we are dropping
DELETE cs FROM `contact_submissions` cs
INNER JOIN `developments` d ON d.`id` = cs.`development_id`
WHERE d.`slug` IN ('vista-magna', 'torres-myth');

-- ─── CRM clients (mock) ───────────────────────────────────────────────────────
DELETE FROM `clients`
WHERE `email` IN (
  'lead.mock1@example.com',
  'lead.mock2@example.com',
  'socio.mock@example.com',
  'prensa.mock@example.com',
  'newsletter.mock1@example.com'
);

-- ─── Newsletter (mock subscribers) ───────────────────────────────────────────
DELETE FROM `newsletter_subscribers`
WHERE `email` IN (
  'newsletter.mock1@example.com',
  'newsletter.mock2@example.com',
  'inversionista.mock@example.com'
);

-- ─── Developments Vista Magna & Torres Myth (+ media via CASCADE) ─────────────
DELETE FROM `developments`
WHERE `slug` IN ('vista-magna', 'torres-myth');
