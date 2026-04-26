# Phase 3 Requirements - Therapies, Appointments, Dashboard, Polish, and Hardening

## Scope

- `therapies` table and seed data
- `ailment_therapies` mapping table and seed data
- `therapists` table and seed data
- `appointments` table with constrained lifecycle status values
- `GET /therapies` SSR page with therapy catalog and ailment-to-therapy mapping
- Appointment booking flow:
- `GET /agents/:id/appointments/new`
- `POST /agents/:id/appointments`
- `GET /appointments/:id/confirmation`
- `GET /dashboard` SSR page with metrics and management tables
- `POST /dashboard/appointments/:id/status` for appointment status updates
- `POST /dashboard/agents/:id/status` for agent status updates
- Shared navigation updates for `/therapies` and `/dashboard`
- Responsive and accessibility refinements across all new pages
- Hardening additions: request logging middleware, custom 404 page, custom 500 page, and server-side input sanitization

## Out of Scope

- Authentication and authorization for dashboard actions
- Email/SMS notifications for appointment changes
- Therapist profile detail pages beyond booking selection
- Full CRUD interfaces for every domain entity
- External reporting pipelines or analytics systems
- Client-side SPA state management frameworks

## Decisions

### Keep a single SSR application surface

All new capabilities are implemented with server-rendered routes and HTML forms. No client-side SPA behavior is introduced.

### Model therapists as first-class persisted records

Appointments reference a real `therapists` table (`therapist_id`), not free-text therapist names.

### Enforce explicit appointment lifecycle states

Appointments are constrained to `booked`, `confirmed`, `completed`, or `canceled`. Dashboard update endpoints must reject any other value.

### Keep dashboard management lightweight

`/dashboard` supports summary metrics plus inline status updates for appointments and agents. It does not introduce full create/edit/delete admin workflows.

### Normalize datetime persistence to UTC

Appointment scheduled times are stored as UTC text (`scheduled_at_utc`) for predictable rendering and consistent comparisons.

### Harden forms at the server boundary

All submitted form values must be sanitized and normalized before validation and persistence.

### Add baseline operational observability

A request logging middleware must record request id, method, path, status, and request duration for all routes.

## Public APIs / Interfaces

- New routes:
- `GET /therapies`
- `GET /agents/:id/appointments/new`
- `POST /agents/:id/appointments`
- `GET /appointments/:id/confirmation`
- `GET /dashboard`
- `POST /dashboard/appointments/:id/status`
- `POST /dashboard/agents/:id/status`
- New persisted entities:
- `therapies(id, name, description)`
- `ailment_therapies(ailment_id, therapy_id)`
- `therapists(id, name, specialty, is_active)`
- `appointments(id, agent_id, therapist_id, scheduled_at_utc, status, notes, created_at)`
- Input contract notes:
- booking post accepts `therapistId`, `scheduledAt`, optional `notes`
- invalid booking submissions re-render booking page with validation feedback
- dashboard status posts accept only constrained values; invalid values return `400`

## Context

Phase 3 completes the currently planned roadmap by delivering the remaining functional slices in one implementation train:

- therapies catalog and ailment recommendations (Phase 3)
- appointment booking flow (Phase 4)
- staff dashboard with operational metrics and lightweight management controls (Phase 5)
- responsive/a11y refinements (Phase 6)
- hardening controls around errors, sanitization, and request logging (Phase 7)

This scope extends the current Phase 2 data model and SSR UI architecture without introducing framework churn.

## Stakeholder Notes

- **Mary**: gets a real dashboard with metrics and status management workflows built on persisted data.
- **Steve**: keeps a predictable TypeScript + SSR + Vitest development loop with explicit validation criteria.
- **Cross-cutting rule**: all user-facing pages must remain responsive on mobile, tablet, and desktop.

## Assumptions

- Folder naming remains phase-based even though this implementation spans phases 3-7.
- Dashboard remains unauthenticated for this milestone.
- Existing in-code SQL migration pattern remains the source of truth for schema evolution.
- Existing seeded domain records are preserved and extended, not replaced.