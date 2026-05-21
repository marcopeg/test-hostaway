WITH word_bank AS (
  SELECT
    ARRAY[
      'Review',
      'Prepare',
      'Confirm',
      'Update',
      'Schedule',
      'Inspect',
      'Organize',
      'Draft'
    ] AS verbs,
    ARRAY[
      'guest notes',
      'cleaning checklist',
      'booking request',
      'arrival details',
      'maintenance task',
      'welcome message',
      'listing photos',
      'house manual'
    ] AS objects,
    ARRAY[
      'before lunch',
      'for the next stay',
      'with the operations team',
      'after the latest message',
      'before check-in',
      'with fresh context'
    ] AS details
),
random_words AS (
  SELECT
    verbs[(floor(random() * array_length(verbs, 1))::int) + 1] AS verb,
    objects[(floor(random() * array_length(objects, 1))::int) + 1] AS object,
    details[(floor(random() * array_length(details, 1))::int) + 1] AS detail
  FROM word_bank
)
INSERT INTO data.todos (user_id, title, notes)
SELECT
  'jh',
  verb || ' ' || object,
  'Random todo generated ' || detail || ' at ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
FROM random_words
RETURNING id, user_id, title, notes;
