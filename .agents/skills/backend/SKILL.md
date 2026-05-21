---
name: backend
description: Use this skill when you are dealing with the backend of the application, hasura migrations, seeds, and metadata
---

# BFF with Hasura.io

This project uses [Hasura.io](https://hasura.io) as BFF erogating standard GraphQL APIs including subscriptions via Websockets.

## GraphQL Endpoint

The default endpoint is: `http://localhost:8080/v1/graphql`

But the port can be configured via env var `HASURA_PORT` in the `.env` file.

## Postgres Instance

The development enviroment ships a Postgres instance on standard port `5432` - but it is possible to change it via env var `POSTGRES_PORT` in the `.env` file.

## Hasura Admin Password

The default admin password to manage Hasura is `hasura` - but it is possible to change it via env var `HASURA_PASSWORD` in the `.env` file.

## Manage Hasura State

Hasura state definition is file based and stored in the `apps/bff` folder:

```bash
/apps/bff
  /migrations # contains migrations files as .sql
  /metadata   # contains Hasura metadata
  /seeds      # contains seed files for develompent or test
  /sql        # contains convenience sql statements to run during dev
```

The `Makefile` contains all the support scripts to properly pilot the `hasura-cli` providing the correct set of information.

The Makefile is the public interface for both humans and Codex agents. Raw `hasura`, `docker compose`, and `psql` commands are implementation details and should only be used when there is no Make target, when debugging a failed Make target, or when explicitly requested.

NOTE: The normal boot process (`make boot` using `docker-compose.yml`) will automatically apply the initial default state:

1. apply migrations
2. apply metadata
3. apply default seed file

## Codex BFF Workflow

For migrations, seeds, metadata, Hasura, and Postgres lifecycle work, use the Makefile interface first.

Do not call `hasura ...`, `docker compose ...`, or `psql ...` directly unless:

- there is no Make target for the operation
- you are debugging a failed Make target
- the user explicitly asks for the lower-level command

Preferred commands:

- Start backend and apply current state: `make start`
- Destroy local DB volume and containers: `make down`
- Full backend reset: `make down` then `make start`
- Apply migrations: `make migrate`
- Check migration status: `make migrate.status`
- Apply metadata: `make meta`
- Export metadata after console changes: `make meta.export`
- Apply seed: `make seed`
- Check metadata inconsistencies: `make hasura.debug`
- Open Hasura console: `make hasura.console`

When changing schema:

1. Create or edit files under `apps/bff/migrations/default`.
2. Update seeds under `apps/bff/seeds/default`.
3. Update metadata under `apps/bff/metadata`.
4. Verify with `make down` and `make start`.
5. Check `make migrate.status`.
6. Query through Hasura or Postgres only as verification.
