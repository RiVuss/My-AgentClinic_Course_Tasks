# Phase 3 Plan - Therapies, Appointments, Dashboard, Polish, and Hardening

## Group 1 - Therapies Domain Foundation

1. Add migration to create `therapies` table
2. Add migration to create `ailment_therapies` join table
3. Seed a baseline therapies catalog with practical descriptions
4. Seed many-to-many mappings from ailments to recommended therapies
5. Add repository queries for therapies list and ailment-to-therapy mapping

## Group 2 - Appointment Booking Domain

6. Add migration to create `therapists` table
7. Add migration to create `appointments` table with status constraint (`booked | confirmed | completed | canceled`)
8. Seed active therapists for booking flow
9. Seed baseline appointment records for dashboard visibility
10. Add repository methods to list active therapists, create appointments, and fetch appointment details

## Group 3 - Therapies and Booking Routes

11. Implement `GET /therapies` route and SSR page for therapies catalog + ailment mappings
12. Implement `GET /agents/:id/appointments/new` route for booking form
13. Implement `POST /agents/:id/appointments` route with server-side validation and sanitization
14. Implement redirect to confirmation route after successful booking
15. Implement `GET /appointments/:id/confirmation` route and SSR confirmation page

## Group 4 - Staff Dashboard

16. Implement `GET /dashboard` route with summary metrics (agents, open appointments, ailments in-flight)
17. Add dashboard table for appointments with inline status update form
18. Add dashboard table for agents with inline status update form
19. Implement `POST /dashboard/appointments/:id/status` with strict status validation
20. Implement `POST /dashboard/agents/:id/status` with constrained status values
21. Add repository queries/mutations for dashboard read models and status updates

## Group 5 - Navigation, Responsive UI, and Accessibility

22. Extend shared header navigation with `/therapies` and `/dashboard`
23. Add booking, confirmation, therapies, and dashboard CSS blocks using mobile-first layout rules
24. Ensure new pages remain usable at phone, tablet, and desktop breakpoints
25. Add explicit keyboard focus-visible styles for links, buttons, and form controls
26. Ensure forms and status update controls include labels and semantic structure

## Group 6 - Hardening

27. Add request logging middleware with request id, method, path, status, and duration
28. Add global 404 page via `app.notFound`
29. Add global 500 page via `app.onError`
30. Sanitize and normalize all form inputs before validation/persistence
31. Ensure invalid status submissions are rejected with `400` responses

## Group 7 - Validation and Verification

32. Expand automated route tests for therapies, booking, confirmation, dashboard, status updates, and error handling
33. Add repository-level tests for mappings, appointment persistence, and status update behavior
34. Add assertions for logging middleware output shape and request id response header
35. Add assertions for accessibility/responsive CSS indicators (focus-visible + breakpoints)
36. Verify `npm run typecheck` exits 0
37. Verify `npm run test` exits 0
38. Run `npm run dev` and manually smoke key workflows (`/therapies`, booking, `/dashboard`)