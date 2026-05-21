BEGIN;

TRUNCATE TABLE data.messages_pending CASCADE;
TRUNCATE TABLE data.messages CASCADE;
TRUNCATE TABLE data.threads CASCADE;
TRUNCATE TABLE data.bookings CASCADE;
TRUNCATE TABLE data.listings CASCADE;
TRUNCATE TABLE data.channels CASCADE;
TRUNCATE TABLE data.guests CASCADE;
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE auth.tenants CASCADE;

INSERT INTO auth.tenants (id, name, icon, updated_at)
VALUES
  ('gre', 'Greyhound Estates', 'https://ui-avatars.com/api/?name=Greyhound+Estates&background=random&size=128&format=svg', '2026-05-21T10:00:00Z'),
  ('blu', 'Blue Harbor Stays', 'https://ui-avatars.com/api/?name=Blue+Harbor+Stays&background=random&size=128&format=svg', '2026-05-21T10:00:00Z'),
  ('sun', 'Sunset Ridge Homes', 'https://ui-avatars.com/api/?name=Sunset+Ridge+Homes&background=random&size=128&format=svg', '2026-05-21T10:00:00Z');

INSERT INTO auth.users (id, name, icon, updated_at)
VALUES
  ('amy', 'Amy Rivers', 'https://ui-avatars.com/api/?name=Amy+Rivers&background=random&size=128&format=svg', '2026-05-21T10:00:00Z'),
  ('ben', 'Ben Carter', 'https://ui-avatars.com/api/?name=Ben+Carter&background=random&size=128&format=svg', '2026-05-21T10:00:00Z'),
  ('cia', 'Cia Morgan', 'https://ui-avatars.com/api/?name=Cia+Morgan&background=random&size=128&format=svg', '2026-05-21T10:00:00Z');

INSERT INTO data.guests (id, tenant_id, name, icon, updated_at)
VALUES
  ('g01', 'gre', 'Maya Bennett', 'https://ui-avatars.com/api/?name=Maya+Bennett&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g02', 'gre', 'Theo Walker', 'https://ui-avatars.com/api/?name=Theo+Walker&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g03', 'gre', 'Nora Chen', 'https://ui-avatars.com/api/?name=Nora+Chen&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g04', 'gre', 'Owen Brooks', 'https://ui-avatars.com/api/?name=Owen+Brooks&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g05', 'blu', 'Lina Patel', 'https://ui-avatars.com/api/?name=Lina+Patel&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g06', 'blu', 'Jonas Meyer', 'https://ui-avatars.com/api/?name=Jonas+Meyer&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g07', 'blu', 'Sara Novak', 'https://ui-avatars.com/api/?name=Sara+Novak&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g08', 'blu', 'Caleb Stone', 'https://ui-avatars.com/api/?name=Caleb+Stone&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g09', 'sun', 'Elena Rossi', 'https://ui-avatars.com/api/?name=Elena+Rossi&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g10', 'sun', 'Marco Silva', 'https://ui-avatars.com/api/?name=Marco+Silva&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g11', 'sun', 'Priya Shah', 'https://ui-avatars.com/api/?name=Priya+Shah&background=random&size=128&format=svg', '2026-05-21T10:05:00Z'),
  ('g12', 'sun', 'Noah Kim', 'https://ui-avatars.com/api/?name=Noah+Kim&background=random&size=128&format=svg', '2026-05-21T10:05:00Z');

INSERT INTO data.channels (id, name, icon, updated_at)
VALUES
  ('air', 'Airbnb', 'https://logo.clearbit.com/airbnb.com', '2026-05-21T10:10:00Z'),
  ('bkc', 'Booking.com', 'https://logo.clearbit.com/booking.com', '2026-05-21T10:10:00Z'),
  ('vrb', 'Vrbo', 'https://logo.clearbit.com/vrbo.com', '2026-05-21T10:10:00Z'),
  ('exp', 'Expedia', 'https://logo.clearbit.com/expedia.com', '2026-05-21T10:10:00Z'),
  ('gvr', 'Google Vacation Rentals', 'https://logo.clearbit.com/google.com', '2026-05-21T10:10:00Z');

INSERT INTO data.listings (id, tenant_id, name, updated_at)
VALUES
  ('l01', 'gre', 'The Elm Carriage House', '2026-05-21T10:15:00Z'),
  ('l02', 'gre', 'Juniper Courtyard Loft', '2026-05-21T10:15:00Z'),
  ('l03', 'gre', 'Willow Garden Flat', '2026-05-21T10:15:00Z'),
  ('l04', 'gre', 'Harbor Clocktower Suite', '2026-05-21T10:15:00Z'),
  ('l05', 'gre', 'Cedar Mews Cottage', '2026-05-21T10:15:00Z'),
  ('l06', 'blu', 'Bluefin Beach Villa', '2026-05-21T10:15:00Z'),
  ('l07', 'blu', 'Seabird Watch Apartment', '2026-05-21T10:15:00Z'),
  ('l08', 'blu', 'Tidepool Terrace', '2026-05-21T10:15:00Z'),
  ('l09', 'blu', 'Mariner Studio', '2026-05-21T10:15:00Z'),
  ('l10', 'blu', 'Coral Key Townhouse', '2026-05-21T10:15:00Z'),
  ('l11', 'sun', 'Sunset Ridge Lodge', '2026-05-21T10:15:00Z'),
  ('l12', 'sun', 'Saguaro Sky Casita', '2026-05-21T10:15:00Z'),
  ('l13', 'sun', 'Canyon Lantern House', '2026-05-21T10:15:00Z'),
  ('l14', 'sun', 'Desert Pearl Bungalow', '2026-05-21T10:15:00Z'),
  ('l15', 'sun', 'Mesa Dawn Retreat', '2026-05-21T10:15:00Z');

INSERT INTO data.bookings (id, tenant_id, listing_id, channel_id, start_date, end_date, stage, updated_at)
VALUES
  ('b01', 'gre', 'l01', 'air', '2026-05-22T15:00:00Z', '2026-05-26T10:00:00Z', 'booked', '2026-05-21T10:20:00Z'),
  ('b02', 'gre', 'l02', 'bkc', '2026-05-24T15:00:00Z', '2026-05-29T10:00:00Z', 'pre-booking', '2026-05-21T10:20:00Z'),
  ('b03', 'blu', 'l06', 'vrb', '2026-05-18T15:00:00Z', '2026-05-23T10:00:00Z', 'checked-in', '2026-05-21T10:20:00Z'),
  ('b04', 'blu', 'l07', 'exp', '2026-05-15T15:00:00Z', '2026-05-20T10:00:00Z', 'checked-out', '2026-05-21T10:20:00Z'),
  ('b05', 'sun', 'l11', 'gvr', '2026-05-27T15:00:00Z', '2026-06-02T10:00:00Z', 'booked', '2026-05-21T10:20:00Z'),
  ('b06', 'sun', 'l12', 'air', '2026-05-21T15:00:00Z', '2026-05-25T10:00:00Z', 'checked-in', '2026-05-21T10:20:00Z'),
  ('b07', 'gre', 'l04', 'vrb', '2026-06-03T15:00:00Z', '2026-06-08T10:00:00Z', 'pre-booking', '2026-05-21T10:20:00Z'),
  ('b08', 'blu', 'l09', 'bkc', '2026-06-01T15:00:00Z', '2026-06-05T10:00:00Z', 'booked', '2026-05-21T10:20:00Z');

INSERT INTO data.threads (id, tenant_id, channel_id, listing_id, booking_id, title, mood_value, mood_updated_at, topic_value, topic_updated_at, updated_at)
VALUES
  ('00000000-0000-4000-8000-000000002001', 'gre', 'air', 'l01', 'b01', 'Arrival time and door code', 'neutral', '2026-05-21T10:40:00Z', 'check-in-issue', '2026-05-21T10:40:00Z', '2026-05-21T10:40:00Z'),
  ('00000000-0000-4000-8000-000000002002', 'gre', 'bkc', 'l02', 'b02', 'Question before confirming stay', 'happy', '2026-05-21T10:41:00Z', 'payment_issue', '2026-05-21T10:41:00Z', '2026-05-21T10:41:00Z'),
  ('00000000-0000-4000-8000-000000002003', 'blu', 'vrb', 'l06', 'b03', 'Air conditioning stopped cooling', 'frustrated', '2026-05-21T10:42:00Z', 'appliance-incident', '2026-05-21T10:42:00Z', '2026-05-21T10:42:00Z'),
  ('00000000-0000-4000-8000-000000002004', 'blu', 'exp', 'l07', 'b04', 'Security deposit follow up', 'neutral', '2026-05-21T10:43:00Z', 'payment_issue', '2026-05-21T10:43:00Z', '2026-05-21T10:43:00Z'),
  ('00000000-0000-4000-8000-000000002005', 'sun', 'gvr', 'l11', 'b05', 'Late checkout request', 'happy', '2026-05-21T10:44:00Z', 'check-in-issue', '2026-05-21T10:44:00Z', '2026-05-21T10:44:00Z'),
  ('00000000-0000-4000-8000-000000002006', 'gre', 'air', 'l03', NULL, 'Is parking included?', NULL, NULL, NULL, NULL, '2026-05-21T10:45:00Z'),
  ('00000000-0000-4000-8000-000000002007', 'blu', 'vrb', 'l08', NULL, 'Noise from nearby renovation', 'angry', '2026-05-21T10:46:00Z', 'guest_complaint', '2026-05-21T10:46:00Z', '2026-05-21T10:46:00Z'),
  ('00000000-0000-4000-8000-000000002008', 'sun', 'gvr', 'l13', NULL, 'Pool heating availability', NULL, NULL, NULL, NULL, '2026-05-21T10:47:00Z'),
  ('00000000-0000-4000-8000-000000002009', 'sun', 'air', 'l14', NULL, 'Broken patio chair photo', 'frustrated', '2026-05-21T10:48:00Z', 'guest-incident', '2026-05-21T10:48:00Z', '2026-05-21T10:48:00Z'),
  ('00000000-0000-4000-8000-000000002010', 'gre', 'bkc', 'l05', NULL, 'Can we bring two bicycles?', NULL, NULL, NULL, NULL, '2026-05-21T10:49:00Z');

INSERT INTO data.messages (id, thread_id, tenant_id, operator_id, guest_id, message, sent_at, updated_at)
VALUES
  ('00000000-0000-4000-8000-000000003001', '00000000-0000-4000-8000-000000002001', 'gre', NULL, 'g01', 'Hi, we land earlier than expected. Can we check in around noon?', '2026-05-21T08:10:00Z', '2026-05-21T08:10:00Z'),
  ('00000000-0000-4000-8000-000000003002', '00000000-0000-4000-8000-000000002001', 'gre', 'amy', NULL, 'The home is still being prepared, but I can offer luggage drop from 12:15.', '2026-05-21T08:16:00Z', '2026-05-21T08:16:00Z'),
  ('00000000-0000-4000-8000-000000003003', '00000000-0000-4000-8000-000000002001', 'gre', NULL, 'g02', 'That works. Could you also resend the door code?', '2026-05-21T08:22:00Z', '2026-05-21T08:22:00Z'),
  ('00000000-0000-4000-8000-000000003004', '00000000-0000-4000-8000-000000002002', 'gre', NULL, 'g03', 'Before I confirm, is the second bedroom suitable for a cot?', '2026-05-21T08:30:00Z', '2026-05-21T08:30:00Z'),
  ('00000000-0000-4000-8000-000000003005', '00000000-0000-4000-8000-000000002002', 'gre', 'ben', NULL, 'Yes, the second bedroom has enough space and we can provide a travel cot.', '2026-05-21T08:36:00Z', '2026-05-21T08:36:00Z'),
  ('00000000-0000-4000-8000-000000003006', '00000000-0000-4000-8000-000000002003', 'blu', NULL, 'g05', 'The air conditioner stopped cooling overnight and the bedroom is very warm.', '2026-05-21T09:05:00Z', '2026-05-21T09:05:00Z'),
  ('00000000-0000-4000-8000-000000003007', '00000000-0000-4000-8000-000000002003', 'blu', 'cia', NULL, 'I am sorry about that. I have contacted maintenance and they can arrive within the hour.', '2026-05-21T09:09:00Z', '2026-05-21T09:09:00Z'),
  ('00000000-0000-4000-8000-000000003008', '00000000-0000-4000-8000-000000002003', 'blu', NULL, 'g06', 'Please make it quick, we have a baby sleeping here.', '2026-05-21T09:12:00Z', '2026-05-21T09:12:00Z'),
  ('00000000-0000-4000-8000-000000003009', '00000000-0000-4000-8000-000000002004', 'blu', NULL, 'g07', 'When will the security deposit hold be released?', '2026-05-21T09:25:00Z', '2026-05-21T09:25:00Z'),
  ('00000000-0000-4000-8000-000000003010', '00000000-0000-4000-8000-000000002004', 'blu', 'amy', NULL, 'It is released automatically by Expedia after inspection, usually within three business days.', '2026-05-21T09:31:00Z', '2026-05-21T09:31:00Z'),
  ('00000000-0000-4000-8000-000000003011', '00000000-0000-4000-8000-000000002005', 'sun', NULL, 'g09', 'Would a 1 PM checkout be possible on our departure day?', '2026-05-21T09:40:00Z', '2026-05-21T09:40:00Z'),
  ('00000000-0000-4000-8000-000000003012', '00000000-0000-4000-8000-000000002005', 'sun', 'ben', NULL, 'We can confirm noon now and I will check whether 1 PM is possible closer to arrival.', '2026-05-21T09:45:00Z', '2026-05-21T09:45:00Z'),
  ('00000000-0000-4000-8000-000000003013', '00000000-0000-4000-8000-000000002006', 'gre', NULL, 'g04', 'Is parking included with Willow Garden Flat?', '2026-05-21T10:00:00Z', '2026-05-21T10:00:00Z'),
  ('00000000-0000-4000-8000-000000003014', '00000000-0000-4000-8000-000000002007', 'blu', NULL, 'g08', 'There is loud renovation noise next door and we were not warned.', '2026-05-21T10:04:00Z', '2026-05-21T10:04:00Z'),
  ('00000000-0000-4000-8000-000000003015', '00000000-0000-4000-8000-000000002008', 'sun', NULL, 'g10', 'Can the pool be heated during our stay?', '2026-05-21T10:08:00Z', '2026-05-21T10:08:00Z'),
  ('00000000-0000-4000-8000-000000003016', '00000000-0000-4000-8000-000000002009', 'sun', NULL, 'g11', 'One of the patio chairs broke when I sat down. I uploaded a photo in the app.', '2026-05-21T10:12:00Z', '2026-05-21T10:12:00Z'),
  ('00000000-0000-4000-8000-000000003017', '00000000-0000-4000-8000-000000002010', 'gre', NULL, 'g02', 'Can we bring two bicycles and store them inside?', '2026-05-21T10:16:00Z', '2026-05-21T10:16:00Z');

INSERT INTO data.messages_pending (id, thread_id, tenant_id, operator_id, message, sent_at, updated_at)
VALUES
  ('00000000-0000-4000-8000-000000004001', '00000000-0000-4000-8000-000000002001', 'gre', 'amy', 'I will send the door code again once housekeeping marks the unit ready.', '2026-05-21T10:25:00Z', '2026-05-21T10:25:00Z'),
  ('00000000-0000-4000-8000-000000004002', '00000000-0000-4000-8000-000000002003', 'blu', 'cia', 'Maintenance is on site now and will update me after checking the unit.', '2026-05-21T10:27:00Z', '2026-05-21T10:27:00Z');

COMMIT;
