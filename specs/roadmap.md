# Roadmap

Phases are intentionally small - each one is a shippable slice of work, independently reviewable and testable.

Cross-cutting rule: every user-facing web UI increment must preserve responsive behavior on mobile, tablet, and desktop.

---

## Phase 1 - Hello Hono

- Install and configure Hono with `tsx` dev server
- Single `/` route returning server-rendered HTML
- Confirm TypeScript types work end-to-end
- Establish baseline responsive page structure and stylesheet behavior

## Phase 2 - Core UI, Agent List, Agent Detail, and Ailments Catalog

- Server-side JSX layout component (header, nav, main, footer)
- Base CSS with responsive spacing, typography, and breakpoints
- All routes render inside the shared layout
- SQLite database + first migration (`agents` table)
- Seed a handful of fictional agents
- `/agents` page listing all agents with responsive list/table behavior
- `/agents/:id` page showing a single agent's profile
- Name, model type, current status, presenting complaints
- Responsive detail layout with readable content on small screens
- `ailments` table + seed data (e.g., "context-window claustrophobia", "prompt fatigue")
- `/ailments` list page
- Link agents to one or more ailments

## Phase 3 - Therapies Catalog

- `therapies` table + seed data
- `/therapies` list page
- Map ailments -> recommended therapies

## Phase 4 - Appointment Booking

- `appointments` table (agent, therapist, datetime, status)
- Form to book an appointment from an agent's detail page
- Basic validation and confirmation page

## Phase 5 - Staff Dashboard

- `/dashboard` with summary counts: agents, open appointments, ailments in-flight
- Simple table views for staff to manage records
- Mary's dashboard is now real

## Phase 6 - Polish & Accessibility

- Refine responsive edge cases and consistency across all pages
- Semantic HTML audit
- Keyboard navigation and focus styles

## Phase 7 - Hardening

- Error pages (404, 500)
- Input sanitization on all forms
- Basic logging middleware

---

Later phases (not yet planned): auth, email notifications, therapist profiles, reporting.
