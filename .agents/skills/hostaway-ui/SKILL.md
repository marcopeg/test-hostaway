---
name: hostaway-ui
description: Use when building or revising Hostaway-like operational app interfaces in this repository, especially React/Tailwind unified inbox, guest messaging, reservation, calendar, admin shell, dashboard, card, table, list, filter, status, AI reply, or property-management workflows. Apply this skill to make screens feel like Hostaway's dense, clean SaaS product UI without copying proprietary assets or exact screenshot details.
---

# Hostaway UI

## Source Priority

Use the original `OG27-create-hostaway-ui-moodboard-signature` screenshots as evidence when available.

- `messaging.png` is canonical. Prioritize it for app chrome, messaging layout, typography density, panels, filters, icons, AI reply treatment, and reservation sidebars.
- `reservations.png` is supporting evidence for the left admin navigation, dashboard cards, metric cards, and soft gray page shell.
- `calendar.png` is supporting evidence for dense operational data, tabs, filters, channel badges, booking/status blocks, and horizontal scanning.
- `card.png` is supporting evidence for compact reservation cards and payment/status badges.
- `home.png` is not canonical for app UI. Do not let the marketing hero, oversized type, or public-site layout drive product screens.

## Visual Signature

Build a crisp operational SaaS interface:

- White content surfaces on a very light cool gray app background.
- Compact but readable density; prefer information-rich panels over large decorative spacing.
- Teal as the active/product action color, orange as brand/channel accent, green for successful paid states, red/coral only for warnings or external channel marks.
- Mostly square geometry with small radius. Use `rounded-md` for controls and panels, `rounded-lg` only for featured cards, and full circles only for avatars/logos.
- Thin borders and subtle shadows. Prefer `border border-hw-border` and `shadow-hw-panel` over heavy elevation.
- Muted gray iconography and labels, with dark navy text for titles and primary content.
- Use icons in navigation and toolbars. Keep icon buttons compact and aligned to list/table density.

## Tailwind Tokens

Prefer the project tokens defined in `apps/webapp/src/index.css`:

- Backgrounds: `bg-hw-app`, `bg-hw-surface`, `bg-hw-surface-muted`, `bg-hw-active-soft`.
- Text: `text-hw-ink`, `text-hw-muted`, `text-hw-faint`.
- Borders: `border-hw-border`, `border-hw-border-strong`.
- Accents: `bg-hw-teal`, `text-hw-teal`, `bg-hw-orange`, `text-hw-orange`, `bg-hw-success`, `text-hw-success`.
- Shadows/radius: `shadow-hw-panel`, `shadow-hw-popover`, `rounded-hw-panel`, `rounded-hw-control`.

If a token is missing, extend `apps/webapp/src/index.css` instead of scattering one-off hex values.

## Layout Rules

For app screens:

- Use a persistent left sidebar around `16rem` wide for admin navigation when screen width allows.
- Put page title and section tabs in the top row. Tabs are compact text labels with a teal active underline.
- Use a three-column messaging shell when appropriate: inbox list, conversation workspace, reservation/details sidebar.
- Keep list rows between `4rem` and `5.5rem` tall. Rows should show avatar/channel, guest title, date/booking range, preview text, and status cues.
- Detail sidebars should be narrow and scannable, using small labels above stronger values.
- Use cards as individual information containers only. Avoid nested cards and decorative marketing sections inside the app.

## Component Patterns

Buttons:

- Primary action: teal filled button, compact height, medium weight.
- Brand/secondary accent: orange only when it carries Hostaway/channel emphasis.
- Icon buttons: muted gray on white or active-soft background, with teal selected states.

Inputs and filters:

- Use compact controls with light borders, white background, and muted placeholder text.
- Search fields should sit near list filters, not dominate the header.

Badges:

- Status badges are small, rounded, and softly tinted.
- Paid/success states use mint/green. Modified/current states use teal. Warnings can use warm orange or coral.

Messaging:

- Guest messages are white panels with a left avatar/channel identity.
- AI suggested replies should be visibly distinct: white card, warm orange/coral border tint, small label, action buttons aligned to the lower right, and a subdued source block.
- Conversation metadata is small and muted; primary message text stays dark and readable.

Calendar/data density:

- Use teal blocks for active bookings or confirmed occupancy.
- Use pale gray cells for prices/availability.
- Keep row and column labels compact; preserve horizontal scanning.

## Typography

Use system UI fonts unless the app has a stronger local font decision. Approximate the screenshots with:

- Page title: `text-3xl font-semibold text-hw-ink`.
- Section title: `text-lg font-semibold text-hw-ink`.
- Row title: `text-sm font-semibold text-hw-ink`.
- Body: `text-sm text-hw-ink`.
- Metadata/labels: `text-xs font-medium text-hw-muted` or `text-hw-faint`.

Avoid landing-page scale typography inside the product app.

## Do Not Copy

- Do not copy Hostaway logos, exact channel icons, proprietary artwork, exact screenshot text, or pixel-perfect layouts.
- Do not make the UI a marketing page.
- Do not use `home.png` as a product-screen pattern.
- Do not overuse orange. In the app, teal carries most active/product UI; orange is an accent.
- Do not introduce large gradients, decorative orbs, or oversized hero treatments in operational screens.
