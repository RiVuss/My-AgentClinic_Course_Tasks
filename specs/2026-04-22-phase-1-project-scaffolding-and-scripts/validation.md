# Phase 1 Validation - Hello Hono

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```bash
npm run typecheck
```

Must exit with code 0 and produce no errors.

### 2. Automated tests pass

```bash
npm run test
```

Must execute Vitest and pass all tests.

### 3. Server starts

```bash
npm run dev
```

Must start without errors. The terminal should show the server is listening (port 3000 or logged port).

### 4. Route returns an HTML home page

```bash
curl -s http://localhost:3000
```

HTTP status must be `200 OK`. Response body must be HTML and must contain:

- An `<h1>` element with the text `AgentClinic`
- A tagline (any short descriptive text; exact wording is implementation choice)

### 5. Static assets are served

```bash
curl -sI http://localhost:3000/static/style.css
```

HTTP status must be `200 OK` and content type must be CSS.

### 6. Hono version is pinned

`package.json` must list `hono` without a `^` or `~` range prefix.

### 7. Strict TypeScript is on

`tsconfig.json` must contain `"strict": true`.

## Not Required

- No CI pipeline required
- No browser automation required (command-line checks are sufficient)
