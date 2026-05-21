BEGIN;

TRUNCATE TABLE data.todos CASCADE;
TRUNCATE TABLE auth.users CASCADE;

INSERT INTO auth.users (id, username)
VALUES
  ('jh', 'john'),
  ('jn', 'jane'),
  ('jk', 'jake');

INSERT INTO data.todos (id, user_id, title, notes)
VALUES
  ('00000000-0000-4000-8000-000000001001', 'jh', 'Review booking requests', 'Check the latest guest messages and confirm any pending reservations.'),
  ('00000000-0000-4000-8000-000000001002', 'jh', 'Update house manual', 'Add parking instructions and Wi-Fi troubleshooting notes.'),
  ('00000000-0000-4000-8000-000000001003', 'jn', 'Prepare turnover checklist', 'Confirm linen pickup, cleaning schedule, and restocking tasks.'),
  ('00000000-0000-4000-8000-000000001004', 'jn', 'Send welcome note', 'Include check-in window, door code, and local recommendations.'),
  ('00000000-0000-4000-8000-000000001005', 'jk', 'Audit listing photos', 'Flag outdated room photos and missing amenity images.'),
  ('00000000-0000-4000-8000-000000001006', 'jk', 'Reconcile maintenance tickets', 'Close completed work orders and follow up on open repairs.');

COMMIT;
