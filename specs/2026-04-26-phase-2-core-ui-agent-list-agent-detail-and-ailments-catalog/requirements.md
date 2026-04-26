# Phase 2 Requirements - Core UI, Agent List, Agent Detail, and Ailments Catalog

## Scope

- Server-side JSX layout component (header, nav, main, footer)
- PicoCSS as the base styling framework across Phase 2 routes
- Project CSS overrides for responsive spacing, layout tuning, and visual consistency on top of PicoCSS
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

## Out of Scope

- Appointment booking workflows and appointment data model
- Staff dashboard routes, metrics, and management views
- Cross-phase polish and accessibility audit work
- Hardening tasks (error pages, sanitization, logging middleware)
- Authentication, notifications, therapist profiles, and reporting
- Client-side SPA frameworks or front-end build-pipeline expansion beyond current stack

## Decisions

### Reuse a single SSR layout shell

All Phase 2 routes render inside one shared server-side JSX layout (header/nav/main/footer) to keep structure consistent and reduce duplication.

### Keep mobile-first responsiveness as a hard requirement

All new UI in this phase must remain usable on phone, tablet, and desktop viewports with explicit breakpoint behavior.

### Standardize on PicoCSS for UI styling

Phase 2 uses `@picocss/pico` as the shared CSS baseline for typography, forms, tables, and semantic elements, with a small project override stylesheet for AgentClinic-specific layout and spacing adjustments.

### Use SQLite with SQL migrations

Persist domain entities using SQLite and plain SQL migrations, aligned with the current tech stack and early-phase simplicity goals.

### Model agent-ailment links as many-to-many

An agent may have multiple ailments, and an ailment may be linked to multiple agents, implemented via a join table.

### Use Vitest for automated validation

Route behavior and key content/rendering expectations are verified with Vitest-based tests, alongside manual smoke checks.

## Public APIs / Interfaces

- Planned routes:
- `GET /agents`
- `GET /agents/:id`
- `GET /ailments`
- Planned styling interface:
- shared layout includes PicoCSS and one project override stylesheet for all Phase 2 pages
- Planned database interfaces:
- `agents` table
- `ailments` table
- join table for agent-to-ailment associations (many-to-many)
- Planned seeded-data expectations:
- multiple fictional agents suitable for list and detail rendering
- ailments seed entries including at least examples from roadmap text
- association seed rows linking agents to one or more ailments

## Context

Phase 2 establishes the first substantial product slice: shared page structure, PicoCSS-backed responsive UI patterns, and domain data for agents and ailments. It moves the system from a single home page into meaningful catalog and detail workflows while preserving server-rendered simplicity.

This phase directly supports the mission by making agent wellness records visible and navigable. It also prepares later phases (therapies, appointments, dashboard) by introducing reusable layout and foundational relational data structures.

## Stakeholder Notes

- **Mary**: Requires TypeScript correctness and a credible path toward a real dashboard; this phase builds the core records that dashboard summaries will depend on.
- **Steve**: Needs a dependable developer loop with clear validation; route tests and repeatable data seeds support that requirement.
- **Cross-cutting rule**: Every user-facing web UI increment must preserve responsive behavior on mobile, tablet, and desktop.

## Assumptions

- "Next phase" is interpreted as Phase 2 because the implementation currently reflects only Phase 1.
- File naming follows existing convention using `requirements.md`.
- Scope is roadmap-only for Phase 2 with no custom additions.
- Folder naming follows date + phase slug convention.
