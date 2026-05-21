CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS data;

CREATE TABLE auth.tenants (
  id text PRIMARY KEY CHECK (char_length(id) = 3),
  name text NOT NULL,
  icon text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auth.users (
  id text PRIMARY KEY CHECK (char_length(id) = 3),
  name text NOT NULL,
  icon text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE data.guests (
  id text PRIMARY KEY CHECK (char_length(id) = 3),
  tenant_id text NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE data.channels (
  id text PRIMARY KEY CHECK (char_length(id) = 3),
  name text NOT NULL,
  icon text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE data.listings (
  id text PRIMARY KEY CHECK (char_length(id) = 3),
  tenant_id text NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE data.bookings (
  id text PRIMARY KEY CHECK (char_length(id) = 3),
  tenant_id text NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  listing_id text NOT NULL REFERENCES data.listings(id) ON DELETE CASCADE,
  channel_id text NOT NULL REFERENCES data.channels(id) ON DELETE RESTRICT,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  stage text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date > start_date)
);

CREATE TABLE data.threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  channel_id text NOT NULL REFERENCES data.channels(id) ON DELETE RESTRICT,
  listing_id text REFERENCES data.listings(id) ON DELETE SET NULL,
  booking_id text REFERENCES data.bookings(id) ON DELETE SET NULL,
  title text NOT NULL,
  mood_value text,
  mood_updated_at timestamptz,
  topic_value text,
  topic_updated_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE data.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES data.threads(id) ON DELETE CASCADE,
  tenant_id text NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  operator_id text REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_id text REFERENCES data.guests(id) ON DELETE SET NULL,
  message text NOT NULL,
  sent_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((operator_id IS NULL) <> (guest_id IS NULL))
);

CREATE TABLE data.messages_pending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES data.threads(id) ON DELETE CASCADE,
  tenant_id text NOT NULL REFERENCES auth.tenants(id) ON DELETE CASCADE,
  operator_id text NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  message text NOT NULL,
  sent_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guests_tenant_id_idx ON data.guests(tenant_id);
CREATE INDEX listings_tenant_id_idx ON data.listings(tenant_id);
CREATE INDEX bookings_tenant_id_idx ON data.bookings(tenant_id);
CREATE INDEX bookings_listing_id_idx ON data.bookings(listing_id);
CREATE INDEX bookings_channel_id_idx ON data.bookings(channel_id);
CREATE INDEX threads_tenant_id_idx ON data.threads(tenant_id);
CREATE INDEX threads_channel_id_idx ON data.threads(channel_id);
CREATE INDEX threads_tenant_id_channel_id_idx ON data.threads(tenant_id, channel_id);
CREATE INDEX threads_listing_id_idx ON data.threads(listing_id);
CREATE INDEX threads_booking_id_idx ON data.threads(booking_id);
CREATE INDEX messages_tenant_id_idx ON data.messages(tenant_id);
CREATE INDEX messages_thread_id_idx ON data.messages(thread_id);
CREATE INDEX messages_guest_id_idx ON data.messages(guest_id);
CREATE INDEX messages_operator_id_idx ON data.messages(operator_id);
CREATE INDEX messages_thread_id_sent_at_idx ON data.messages(thread_id, sent_at);
CREATE INDEX messages_pending_tenant_id_idx ON data.messages_pending(tenant_id);
CREATE INDEX messages_pending_thread_id_idx ON data.messages_pending(thread_id);
CREATE INDEX messages_pending_operator_id_idx ON data.messages_pending(operator_id);
CREATE INDEX messages_pending_thread_id_sent_at_idx ON data.messages_pending(thread_id, sent_at);
