# LSF Backend API

## Authentication
- All endpoints (except /auth/*) require a Bearer token (Supabase JWT).
- Signup: `POST /auth/signup` (email, password, role)
- Login: `POST /auth/login` (email, password)
- Get current user: `GET /auth/me` (Bearer token)

## Role-Based Dashboards
- `GET /dashboard/admin` (admin only)
- `GET /dashboard/staff` (staff only)
- `GET /dashboard/paralegal` (paralegal only)
- `GET /dashboard/stakeholder` (stakeholder only)

## Resource Endpoints (CRUD)
All create, update, and delete endpoints require admin role.

### Programs
- `GET /programs` — List all programs
- `GET /programs/:id` — Get program by ID
- `POST /programs` — Create program (admin)
- `PUT /programs/:id` — Update program (admin)
- `DELETE /programs/:id` — Delete program (admin)

### News
- `GET /news` — List all news
- `GET /news/:id` — Get news by ID
- `POST /news` — Create news (admin)
- `PUT /news/:id` — Update news (admin)
- `DELETE /news/:id` — Delete news (admin)

### Publications
- `GET /publications` — List all publications
- `GET /publications/:id` — Get publication by ID
- `POST /publications` — Create publication (admin)
- `PUT /publications/:id` — Update publication (admin)
- `DELETE /publications/:id` — Delete publication (admin)

### Opportunities
- `GET /opportunities` — List all opportunities
- `GET /opportunities/:id` — Get opportunity by ID
- `POST /opportunities` — Create opportunity (admin)
- `PUT /opportunities/:id` — Update opportunity (admin)
- `DELETE /opportunities/:id` — Delete opportunity (admin)

### Resources
- `GET /resources` — List all resources
- `GET /resources/:id` — Get resource by ID
- `POST /resources` — Create resource (admin)
- `PUT /resources/:id` — Update resource (admin)
- `DELETE /resources/:id` — Delete resource (admin)

## Authentication Flow
1. User signs up or logs in via `/auth/signup` or `/auth/login`.
2. Receives a JWT token from Supabase.
3. Sends the token as `Authorization: Bearer <token>` in all requests.
4. Role-based middleware restricts access to endpoints as needed.

## Notes
- All endpoints return JSON.
- Only admin users can create, update, or delete resources.
- Each user role has a dedicated dashboard endpoint.
- Integrate with the frontend by calling these endpoints with the correct token and role.
