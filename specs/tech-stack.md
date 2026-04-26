# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good.

## Core

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety end-to-end; satisfies Mary's requirement |
| Runtime | Node.js | Stable, well-supported, vast ecosystem |
| Server framework | **Hono** | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating | Hono JSX (server-side) | JSX without React overhead; components are just functions |
| CSS | Plain CSS + CSS custom properties | No build step required; Steve gets a modern, attractive result |

## Recommended: Hono

[Hono](https://hono.dev) is chosen over Express/Fastify because:

- First-class TypeScript with zero config
- Built-in JSX renderer for server-side HTML
- Middleware model is simple and composable
- Runs on Node, Deno, Bun, and edge runtimes without changes

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production - simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing

- **Vitest** is the default test runner for validation.
- Use Vitest unit tests for components and helper functions.
- Use Vitest integration tests for Hono routes and middleware.
- Use Vitest regression tests when bugs are fixed.
- Validation commands are `npm run typecheck` for static correctness and `npm run test` for behavioral correctness.

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds
- `vitest` for automated test execution in local development and CI
- `prettier` for formatting

## What We Are Not Using

- No React, Vue, or Svelte - server-side rendering keeps the stack simple
- No ORM - SQL is sufficient at this scale
- No Docker - not yet; that's a later phase concern
