# Phase 2 Validation - Core UI, Agent List, Agent Detail, and Ailments Catalog

## Definition of Done

All checks below must pass before Phase 2 is considered complete.

### 1. TypeScript compiles cleanly

```bash
npm run typecheck
```

Must exit with code 0 and produce no TypeScript errors.

### 2. Automated tests pass

```bash
npm run test
```

Must execute Vitest and pass all Phase 2 route and rendering assertions.

### 3. Server starts successfully

```bash
npm run dev
```

Must start without runtime errors and report a listening HTTP port.

### 4. Core routes respond with 200

Run these checks while the dev server is running:

```bash
curl -sI http://localhost:3000/
curl -sI http://localhost:3000/agents
curl -sI http://localhost:3000/agents/1
curl -sI http://localhost:3000/ailments
```

Each endpoint must return `200 OK` for valid paths and seeded ids.

### 5. Required page content is present

```bash
curl -s http://localhost:3000/agents
curl -s http://localhost:3000/agents/1
curl -s http://localhost:3000/ailments
```

Responses must include expected fields:

- `/agents`: list entries with agent-identifying data and links to details
- `/agents/:id`: name, model type, current status, presenting complaints
- `/ailments`: seeded ailments catalog items

### 6. PicoCSS is active across Phase 2 pages

Rendered HTML for `/agents`, `/agents/:id`, and `/ailments` must include stylesheet references proving:

- PicoCSS is loaded
- project override CSS is loaded after PicoCSS

Automated tests should assert these stylesheet references are present in route responses.

### 7. Agent-ailment links are visible and correct

For at least one seeded agent, detail output must show one or more linked ailments from join-table data, and test coverage must assert this mapping.

### 8. Responsive baseline requirements are verifiable

The rendered HTML and stylesheet must demonstrate:

- viewport meta tag present
- mobile-first baseline styling
- explicit tablet breakpoint rules
- explicit desktop breakpoint rules

Automated tests should assert presence of expected responsive CSS indicators where practical.

## Not Required

- CI pipeline execution is not required in this phase validation checklist
- Browser automation is not required if route and content checks are covered by tests and command-line verification
