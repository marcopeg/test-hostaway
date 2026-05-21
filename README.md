# Hostaway Code Test

For this test I used:

- coffee, lot of it
- Codex
- Docker & Docker Compose
- Hasura.io
- React / Apollo Client / React Router / Tailwind
- more coffee

## System Design

![System Design](./docs/artifacts/design.svg)

### Adapter Pattern

At system design, I would use an _adapter pattern_ to interface with the different data providers. Each adapter knows the specific provider's API, and the internal communication logic.

Each adapter communicates with the _Aggregation Service_ via events in an _Event Sourcing_ fashion. Based on the amount of data, I would think what service to use. But one common and very hyped choice is Kafka.

### Aggregation Service

It's the source of truth for the internal data model.

It talks with the adapters via bus and it is in charge of materializing those events in a database of sort.

For this exercise I picked Postgres because I know it well and [I believe it's awesome](https://postgresforeverything.com/) 😉.

IMPORTANT: for the sake of this exercise I assume this service is also in charge of keeping read-ready tables from different internal events streams from other domain-specific services (auth, listing, bookings, ...)

### BFF

The frontend(s) would mediate access to the internal data model via BFF:

- it knows the common data model (read only)
- it implements an outbox pattern to send commands towards the adapters

### Real Time

The exercise mentions _real time_ expectations. 2h is a bit on the short side to make a full custom design around it.

My first idea was to go with a Fastify/TypeScript BFF so to use tRPC for bff/frontend type-safe continuity, use Postgres as development bus for events, and _Server Side Events_ as monodirectional push channel.

After thorough evaluation (~30 seconds) I've decided this is too ambitious for 2h. I will short cut it and use GraphQL with Hasura ([see Tech Stack](#tech-stack)) so that I get the subscriptions for free.

## Tech Stack

For this exercise I use [Hasura](https://hasura.io) as interface "data model <-> graphql". The APIs that I plan to expose are mainly defined by the data model itself, and the Hasura's ACL metadata.

The frontend is a React app that uses Apollo Client for GraphQL communication and React Router (TanStack) for internal app routing.

The UI is based on Tailwind and I will try to convert a few screenshot from the website into an agent skill to comply with the requirement **"consistent with our branding"**. Let's hope it will work!

> **IMPORTANT:** I'm importing code from another project as boilerplate. I don't think you want to assess how good I am at following tutorials to wire together a few existing tools anyway, and this will buy me time to focus on the data model and the app itself.

## Development Log

### 14:30 Go!

- Imagined and document (here, up above) the system design.
- Evaluated and decided the technical stack

`commit: b2fdf481e9fc47ca0ac5f6d21b4321302d7a44d1`

### 14:40 Boilerplate & Cleanup

As mentioned, I'm going to copy over from another project.

`commit: 0fb4b7832b11a03eaf52b90068136fa3e282bc9e`

### 15:14 Design Data Model
