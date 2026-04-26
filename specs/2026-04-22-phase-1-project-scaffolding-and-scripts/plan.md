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

## Group 5 - Responsive Layout and Styling

14. Add mobile-first CSS tokens for spacing, typography, and colors
15. Use fluid sizing (`clamp`, relative widths) for key text and layout spacing
16. Add explicit breakpoint rules for tablet and desktop (`@media` queries)
17. Ensure home content stacks naturally on narrow viewports and expands cleanly on wider screens
18. Keep static stylesheet serving in place via `/static/style.css`

## Group 6 - Automated Validation

19. Add Vitest tests for `GET /` (status + expected HTML content)
20. Add Vitest tests for `/static/style.css` (status + expected CSS content)
21. Add assertions that verify responsive CSS rules are present

## Group 7 - Verify

22. Run `npm run typecheck` - must exit 0 with no errors
23. Run `npm run test` - must execute and pass
24. Run `npm run dev` and confirm `curl localhost:3000` returns HTML containing the heading
