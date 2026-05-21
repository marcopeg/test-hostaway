CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS data;

CREATE TABLE auth.users (
  id text PRIMARY KEY,
  username text NOT NULL UNIQUE
);

CREATE TABLE data.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  notes text
);

CREATE INDEX todos_user_id_idx ON data.todos(user_id);
