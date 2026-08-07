# Local Setup and Environments

## Verified toolchain

- macOS; Node `v22.14.0`; npm `10.9.2`.
- Repository package manager is ambiguous: `package-lock.json` and `bun.lockb` are both committed. Standardize on npm for now because `npm ci` is reproducible.
- `npm ci`: completed; 617 packages audited; npm reported 30 vulnerabilities (2 low, 6 moderate, 20 high, 2 critical). Re-run with network access and triage transitive production reachability before upgrading.
- `npx tsc --noEmit`: passes.
- `npm run build`: passes; warnings for 15-month-old Browserslist data and ambiguous `duration-[10s]` class.
- `npm run lint`: fails, including a parser error in `src/components/home/hero/SlidingHero.tsx`, many `no-explicit-any` failures, and hook dependency warnings.
- No `test`, `typecheck`, E2E, accessibility, or security scripts exist.

## Commands

```bash
npm ci
cp src/.env.example .env.local
npx convex dev
npm run dev -- --host 127.0.0.1 --port 8080
npx tsc --noEmit
npm run lint
npm run build
```

Do not use the committed `.env` as a template. Remove it from Git after history/rotation handling and add `.env`, `.env.*`, and exceptions for `.env.example` to `.gitignore`.

## Configuration contract

| Variable | Scope | Required by | Classification |
|---|---|---|---|
| `VITE_CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` | client | Convex provider | public endpoint |
| `VITE_CLERK_PUBLISHABLE_KEY` or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | client | Clerk provider | public configuration |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex server | JWT validation | server configuration |
| `OPENAI_API_KEY` | Convex server | SARA + classification | secret |
| `RESEND_API_KEY` | Convex server | email actions | secret |
| `NEXT_PUBLIC_SUPABASE_URL` | legacy client | no active imports found | obsolete pending verification |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | legacy client | no active imports found | public credential; obsolete pending verification |
| `VITE_ADMIN_PIN` | client | quick-links page | insecure design; remove |
| Sentry DSN | client hard-coded | error telemetry | public config; environment-separate it |
| n8n webhook URLs | client hard-coded | chatbot/status | public endpoint; replace with authenticated server integration |

## Environment separation

Use separate Clerk instances, Convex deployments, OpenAI projects, Resend domains, n8n credentials and Sentry environments for development, staging and production. Never let development data or prompt experiments touch production legal data. Production promotion requires migration dry-run, authorization tests, smoke tests, backup verification and an explicit owner approval.

## Current runtime result

The dev server responds at `http://127.0.0.1:8080`, but the browser displays `Deployment Configuration Error`: Convex URL and Clerk publishable key are missing. Consequently no authenticated or data-backed flow was marked as passed. Exact secret values are intentionally excluded from this dossier.
