# Phase 1 Requirements - Hello Hono

## Scope

Install and configure Hono with a `tsx` dev server. Expose a single `/` route that renders a minimal HTML home page via Hono JSX. Confirm TypeScript types work end-to-end and add baseline automated validation with Vitest.

## Out of Scope

- No database or additional feature routes
- No CI/CD pipeline
- No end-to-end browser automation

## Decisions

### Pin Hono version

Record the exact Hono version in `package.json` with no range prefix (for example, `"hono": "4.x.y"`). Future phases must not silently upgrade without deliberate review.

### Enforce strict TypeScript

`tsconfig.json` must include `"strict": true`. This is non-negotiable from the first commit so the codebase never accumulates loose types.

### Use Vitest for validation

`package.json` must include a `test` script using Vitest, and Phase 1 must include at least one automated test that validates the home route behavior.

## Context

This phase proves the baseline works: Node runs TypeScript, Hono serves HTML, the dev loop is functional, and validation can run automatically.

The home page should render an `<h1>` containing `AgentClinic` and a short tagline that reflects the mission. The route returns HTML, not a plain string - Hono JSX handles the rendering.

This is the first visible page a developer sees when they clone and run the project.

## Stakeholder Notes

- **Mary** needs TypeScript end-to-end (satisfied by `strict: true` and successful `tsc --noEmit`)
- **Steve** needs a dependable developer loop and clear validation feedback
