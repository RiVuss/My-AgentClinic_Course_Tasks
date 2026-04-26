# Phase 2 Plan - Core UI, Agent List, Agent Detail, and Ailments Catalog

## Group 1 - Shared Layout Shell

1. Create a reusable server-side JSX layout component with `header`, `nav`, `main`, and `footer`
2. Ensure all Phase 2 pages render inside the shared layout wrapper
3. Include navigation links for core routes (`/`, `/agents`, `/ailments`)

## Group 2 - Responsive Base Styling

4. Add `@picocss/pico` as the Phase 2 styling foundation (pin exact package version)
5. Wire PicoCSS into the shared layout so all Phase 2 routes inherit the same base typography and component styling
6. Add a project override stylesheet for AgentClinic-specific spacing, colors, and layout tuning on top of PicoCSS
7. Add explicit tablet and desktop breakpoint overrides where needed beyond PicoCSS defaults
8. Confirm shared layout and page sections stay readable on narrow screens without horizontal scrolling

## Group 3 - Agents Data Foundation

9. Add SQLite migration to create an `agents` table
10. Define essential `agents` columns for list and detail needs (name, model type, current status, presenting complaints)
11. Seed a handful of fictional agents for development and test coverage
12. Add data access helpers for fetching all agents and fetching a single agent by id

## Group 4 - Agents List Page

13. Implement `GET /agents` route
14. Build `/agents` page to list all agents with key fields and links to detail pages
15. Use PicoCSS semantic table/list patterns and add responsive fallback behavior for narrow screens

## Group 5 - Agent Detail Page

16. Implement `GET /agents/:id` route
17. Build agent detail view showing name, model type, current status, and presenting complaints
18. Compose detail sections with PicoCSS semantic elements and project overrides for clear hierarchy
19. Add responsive detail layout with readable spacing on phone, tablet, and desktop
20. Handle unknown agent ids gracefully with a clear not-found response

## Group 6 - Ailments Catalog

21. Add SQLite migration to create an `ailments` table
22. Seed ailments catalog data (for example, context-window claustrophobia and prompt fatigue)
23. Implement `GET /ailments` route and render an ailments list page inside shared layout with PicoCSS-consistent markup

## Group 7 - Agent to Ailment Mapping

24. Add join table migration for many-to-many links between agents and ailments
25. Seed relationship data mapping agents to one or more ailments
26. Display linked ailments on agent detail pages using consistent PicoCSS-styled list/tag patterns

## Group 8 - Validation and Verification

27. Add Vitest integration tests for `GET /`, `GET /agents`, `GET /agents/:id`, and `GET /ailments`
28. Add assertions for required list/detail fields and mapped ailment rendering
29. Add assertions that PicoCSS is loaded in rendered HTML and project override CSS is linked
30. Add assertions verifying responsive CSS baseline rules are present (viewport + tablet and desktop breakpoints)
31. Verify `npm run typecheck` exits 0
32. Verify `npm run test` exits 0
33. Run `npm run dev` and perform manual `curl` checks for route availability and expected HTML content

## Group 9 - Visual Accessibility and Branding

34. Audit Phase 2 text colors and update CSS tokens/rules so body, metadata, helper text, and navigation labels maintain readable contrast on light backgrounds
35. Ensure muted/secondary text still meets readability expectations while preserving visual hierarchy
36. Create a simple local SVG brand mark (`/static/agentclinic-mark.svg`) and display it next to the `AgentClinic` logo text in the shared header
37. Ensure logo mark placement scales cleanly at mobile and desktop breakpoints without clipping or layout shift
38. Add automated assertions that the logo SVG is referenced in rendered HTML and that the SVG asset is served successfully
