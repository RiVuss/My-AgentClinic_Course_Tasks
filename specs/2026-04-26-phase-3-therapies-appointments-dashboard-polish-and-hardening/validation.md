# Phase 3 Validation - Therapies, Appointments, Dashboard, Polish, and Hardening

## Definition of Done

All checks below must pass before Phase 3 is considered complete.

### 1. TypeScript compiles cleanly

```bash
npm run typecheck
```

Must exit with code 0 and produce no TypeScript errors.

### 2. Automated tests pass

```bash
npm run test
```

Must execute Vitest and pass route, repository, and hardening assertions added for this phase.

### 3. Server starts successfully

```bash
npm run dev
```

Must start without runtime errors and expose an HTTP listener.

### 4. New core routes respond correctly

Run while dev server is running:

```bash
curl -sI http://localhost:3000/therapies
curl -sI http://localhost:3000/agents/1/appointments/new
curl -sI http://localhost:3000/dashboard
```

Each valid route must return `200 OK`.

### 5. Booking flow works end-to-end

- Submit appointment form for a seeded agent with valid therapist and future datetime.
- Response must redirect to `/appointments/:id/confirmation`.
- Confirmation page must show saved appointment details.

Invalid booking submissions (missing/invalid therapist or datetime) must return `400` and render validation feedback.

### 6. Dashboard status updates are constrained

- `POST /dashboard/appointments/:id/status` must accept only `booked|confirmed|completed|canceled`.
- `POST /dashboard/agents/:id/status` must accept only configured agent status values.
- Invalid status submissions must return `400`.
- Valid submissions must update persisted records and redirect back to `/dashboard`.

### 7. Hardening behavior is active

- Unknown route returns custom `404` page.
- Unhandled server exceptions return custom `500` page.
- Request logging middleware emits method/path/status/duration and request id.
- Responses include `x-request-id` header.

### 8. Responsive and accessibility baselines are verifiable

- Viewport meta tag remains present.
- CSS contains explicit tablet and desktop breakpoints.
- CSS contains visible `:focus-visible` styles for keyboard navigation.
- New forms include associated labels and semantic grouping.

### 9. Therapies and dashboard content is visible

`GET /therapies` response must include:

- therapies catalog entries
- ailment-to-therapy mapping section

`GET /dashboard` response must include:

- summary metrics (agents, open appointments, ailments in-flight)
- appointment and agent management tables/forms

## Not Required

- Production auth model is not required for this phase.
- Browser automation is not required if route + content checks are covered by automated tests and command-line validation.