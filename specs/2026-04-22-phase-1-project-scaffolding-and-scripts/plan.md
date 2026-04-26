# Phase 1 Plan - Hello Hono

## Group 1 - Package Setup

1. Install `hono` (pin exact version, no `^` prefix)
2. Install `tsx` as a dev dependency
3. Install `vitest` as a dev dependency
4. Verify `tsconfig.json` has `"strict": true` and a sensible `target`/`module` for Node

## Group 2 - Application Entry Point

5. Create `src/app.tsx` with the Hono app configuration and routes
6. Configure static serving for `/static/*`
7. Keep `src/index.tsx` focused on starting the server with `serve()`

## Group 3 - Scripts

8. Add `"dev": "tsx watch src/index.tsx"` to `package.json`
9. Add `"typecheck": "tsc --noEmit"` to `package.json`
10. Add `"test": "vitest run"` to `package.json`

## Group 4 - Home Page

11. Create a Hono JSX component for the home page (`src/pages/Home.tsx`)
12. Page renders an `<h1>` with `AgentClinic` and a short tagline
13. `GET /` returns the rendered JSX

## Group 5 - Layout Component

14. Create `src/components/Layout.tsx` with a top-level shell (`<html>`, `<head>`, `<body>`)
15. Create `src/components/Header.tsx`, `src/components/Main.tsx`, and `src/components/Footer.tsx`
16. Link `/static/style.css` in `<head>`
17. Create `static/style.css` with baseline styles

## Group 6 - Automated Validation

18. Add Vitest tests for `GET /` (status + expected HTML content)
19. Add Vitest tests for `/static/style.css` (status + expected CSS content)

## Group 7 - Verify

20. Run `npm run typecheck` - must exit 0 with no errors
21. Run `npm run test` - must execute and pass
22. Run `npm run dev` and confirm `curl localhost:3000` returns HTML containing the heading
