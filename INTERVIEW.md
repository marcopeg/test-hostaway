# Principal Frontend Interview Prep

This document is a working interview script for discussing this solution as if a senior staff engineer were evaluating it for a principal frontend engineer role.

Use the `Your answer` sections to draft responses. When you say `next`, Codex should review the latest answers, challenge weak spots, and expand the document with sharper follow-up questions.

## Interview Frame

The project is a strong POC discussion artifact, not something to defend as production-ready. The strongest hiring signal is the ability to separate demo shortcuts from production architecture:

- what is real today
- what was intentionally simplified
- what is risky
- what would be done first in a production iteration
- how each decision scales technically and organizationally

Expected tone: direct, precise, and self-aware. Avoid overselling. Acknowledge the README's own framing that this is a POC/clickable mockup and not yet a first iteration.

## 1. Demo And Scope Control

### What I Would Ask

Run the app and walk me through:

- `/inbox`
- opening a thread
- sending a reply
- the stats view
- tenant/user identity
- what is real data, what is mocked, and what is future architecture

### Points To Navigate

- The README calls the result a "basic POC, a clickable mockup".
- The README says it is "not yet a first iteration".
- The app builds and lints, but has no tests.
- The project intentionally optimizes for a two-hour discussion artifact.

### Challenge

If this is not a first iteration, what concrete bar would make it one?

### Your Answer

TODO

## 2. System Architecture

### What I Would Ask

Walk through the intended architecture:

- channel adapters
- aggregation service
- event bus/event sourcing
- Postgres read model
- Hasura as BFF-ish GraphQL layer
- frontend data access

### Points To Navigate

The README describes a BFF that mediates frontend access and implements an outbox pattern. In the current app, the frontend talks directly to Hasura through Apollo.

Relevant files:

- `README.md`
- `apps/webapp/src/providers/GraphQLProvider/client.ts`
- `apps/webapp/vite.config.ts`

### Challenge

The Hasura admin secret and trusted Hasura headers are compiled into the frontend config. Where is the actual trust boundary? What would the production BFF look like?

### Your Answer

TODO

## 3. Real-Time Behavior

### What I Would Ask

What is live today?

The Apollo client supports WebSocket splitting for GraphQL subscriptions, but the inbox currently uses `query GetInbox`, not a subscription.

Relevant files:

- `apps/webapp/src/providers/GraphQLProvider/client.ts`
- `apps/webapp/src/views/inbox/InboxView.tsx`

### Points To Navigate

- Hasura can provide subscriptions.
- The client is configured for WebSocket transport.
- The inbox currently refetches after mutation.
- There is no active subscription in the inbox view.

### Challenge

What would you subscribe to first: thread list, selected thread messages, pending delivery state, stats, or all of them? How would you avoid resubscribing to the whole inbox?

### Your Answer

TODO

## 4. Data Fetching And Scale

### What I Would Ask

Redesign the current inbox query for:

- 10k threads
- 1M messages
- multiple operators
- server-side search
- real-time updates
- mobile clients

### Points To Navigate

The current `GetInbox` query fetches aggregates, every thread, every message, pending messages, booking, listing, and channel in one request.

Relevant file:

- `apps/webapp/src/views/inbox/InboxView.tsx`

### Challenge

How would you split the query surface?

Consider:

- paginated thread list
- selected-thread detail query
- cursor-based message pagination
- server-side search/filtering
- virtualized rendering
- normalized Apollo cache
- derived counters or materialized metrics

### Your Answer

TODO

## 5. Mutation And Outbox Semantics

### What I Would Ask

Explain what happens when an operator sends a reply.

Current behavior:

- insert row into `data_messages_pending`
- Hasura sets `tenant_id` and `operator_id`
- frontend calls `refetch`
- pending messages render together with persisted messages

Relevant files:

- `apps/webapp/src/views/inbox/InboxView.tsx`
- `apps/bff/metadata/databases/default/tables/data_messages_pending.yaml`

### Challenge

The README calls this an optimistic outbox pattern, but there is no Apollo optimistic response, idempotency key, retry policy, delivery status machine, or provider acknowledgment path.

How would you make this robust under:

- double-click send
- offline/reconnect
- mutation succeeds but refetch fails
- provider delivery failure
- message edited/deleted before delivery
- clock skew from client-owned `sentAt`

### Your Answer

TODO

## 6. Authorization And Tenancy

### What I Would Ask

How is tenant isolation enforced?

Current implementation uses Hasura permissions with `X-Hasura-Tenant-Id` and `X-Hasura-User-Id`.

Relevant files:

- `apps/bff/metadata/databases/default/tables/data_threads.yaml`
- `apps/bff/metadata/databases/default/tables/data_messages.yaml`
- `apps/bff/metadata/databases/default/tables/data_messages_pending.yaml`
- `apps/bff/metadata/databases/default/tables/auth_users.yaml`
- `apps/webapp/package.json`

### Points To Navigate

- Tenant filters exist on core data tables.
- Pending message insert sets tenant/operator from headers.
- Headers are currently demo-configured from `package.json`.
- There is no real auth service or session exchange in the POC.

### Challenge

Who is allowed to assert `x-hasura-user-id` and `x-hasura-tenant-id`? How would you prove cross-tenant isolation with tests?

### Your Answer

TODO

## 7. Frontend Architecture

### What I Would Ask

Explain the frontend module boundaries:

- routing
- layout
- data containers
- pure UI components
- local mapping from GraphQL result shape to view model

Relevant files:

- `apps/webapp/src/App.tsx`
- `apps/webapp/src/views/inbox/InboxView.tsx`
- `apps/webapp/src/views/inbox/InboxViewUI.tsx`
- `apps/webapp/src/views/inbox/types.ts`
- `apps/webapp/src/views/inbox/components/*`
- `apps/webapp/src/views/inbox/containers/*`

### Challenge

The GraphQL result types are handwritten near the query. How would you prevent schema drift? Would you introduce GraphQL codegen, typed document nodes, MSW mocks, or a generated SDK?

### Your Answer

TODO

## 8. Responsive UX And Accessibility

### What I Would Ask

Navigate the app on a mobile viewport. What should the list/detail interaction be?

Relevant files:

- `apps/webapp/src/components/layout/BaseLayout.tsx`
- `apps/webapp/src/components/layout/split-layout/SplitLayout.tsx`
- `apps/webapp/src/views/inbox/containers/thread-list/ThreadList.tsx`
- `apps/webapp/src/views/inbox/components/MessageList.tsx`

### Points To Navigate

- The desktop layout is a dense operational split view.
- The mobile nav button exists but has no behavior.
- The right details panel is hidden below `xl`.
- The split layout collapses to one column, but list/detail behavior is not fully designed.

### Challenge

Would mobile use route transitions, a drawer, tabs, or a bottom sheet? How would you preserve operator efficiency while keeping the UI accessible?

### Your Answer

TODO

## 9. Testing And Delivery

### What I Would Ask

What tests would you add first and why?

Current verified checks:

- `npm run build` passes
- `npm run lint` passes

Current gap:

- no frontend tests
- no e2e tests
- no automated Hasura permission tests

### Challenge

Name the first five tests you would add, in order, and what production risk each test reduces.

Suggested areas:

- mapper unit tests for `mapThread` and `createStats`
- Hasura permission tests across tenants
- reply mutation behavior
- selected thread route behavior
- Playwright inbox smoke flow

### Your Answer

TODO

## 10. AI-Assisted Development

### What I Would Ask

How did AI change your workflow here?

The README explicitly says AI was used heavily and more aggressively than would be recommended for a real app.

Relevant files:

- `README.md`
- `docs/backlog/**`
- `docs/codex/**`
- `docs/vibe-sessions/**`

### Challenge

How do you validate AI-generated code, SQL, metadata, and UX? What guardrails would you require before using this workflow on a production team?

### Your Answer

TODO

## High-Signal Follow-Up Questions

Use these when an answer is too broad or optimistic.

- What is the single riskiest production assumption in this solution?
- What would you delete before productionizing?
- What would you keep exactly as-is?
- What would you instrument first?
- Where would you put the first SLO?
- How would you debug a missing guest message?
- How would you handle provider-specific message capabilities?
- How would you model read receipts, attachments, and channel-specific delivery errors?
- How would you support multiple operators replying to the same thread?
- How would you prevent duplicated messages from adapter retries?
- How would you migrate this data model after real provider integrations expose mismatches?
- What user action would you make impossible until the backend contract is stronger?
- Which part should be owned by frontend, platform, data, or product engineering?

## Strong Closing Position

A strong principal-level answer should sound like:

> This solution is a demo-optimized vertical slice. It proves a useful product direction and gives us a concrete conversation surface. I would not present the current direct Hasura access, all-in-one inbox query, or pending-message mutation as production architecture. The first production iteration would introduce a real auth/BFF boundary, split the query model, add permission and e2e tests, and make the outbox idempotent and observable.
