# Shared Clerk and Convex account launch checklist

## Architecture

- Web and mobile must use the same Clerk instance and Convex deployment for each environment.
- Clerk authenticates the person. Convex validates the Clerk JWT, stores the account record, and enforces roles and record scope.
- One person has one Clerk user ID and one matching Convex `users.clerkId`. Professional roles live in Convex `role_assignments`; the user cannot grant these roles to themselves.
- Keep development and production Clerk keys, Convex URLs, redirect URLs, and JWT issuer settings paired. Never mix a development Clerk instance with a production Convex deployment.

## Configuration to verify in staging and production

- Web: `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CONVEX_URL`.
- Mobile: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_CONVEX_URL`. Set `EXPO_PUBLIC_EAS_PROJECT_ID` before push notification and release testing.
- Mobile Google and Apple buttons appear only when `EXPO_PUBLIC_GOOGLE_SSO_ENABLED=true` or `EXPO_PUBLIC_APPLE_SSO_ENABLED=true` respectively. Enable each after its Clerk connection, native registration, redirect allowlist, and device test pass. The phone/password option is likewise gated by `EXPO_PUBLIC_PHONE_AUTH_ENABLED=true`; leave it off until SMS verification and recovery work for intended countries.
- Convex: `CLERK_JWT_ISSUER_DOMAIN`, the Clerk Convex integration, and the corresponding deployment auth configuration.
- Clerk: email/password and email-code verification; Google and Apple providers if their buttons are shown; native app redirect URLs; authorized web domains; second-factor methods used for staff accounts.
- Store private keys and administrator credentials only in the corresponding service dashboards or secret manager. Do not place them in public app environment variables or this repository.

## Dashboard configuration for this repository

| Service and environment | Required state | How to check |
| --- | --- | --- |
| Clerk Development | Separate development instance and `pk_test_` publishable key | Instance switcher and API Keys |
| Clerk Production | Production domain verified and `pk_live_` publishable key | Instance switcher, Domains, API Keys |
| Clerk, both instances | Email sign-up with verification **code**, email sign-in, password sign-up/sign-in, and password reset enabled; allow email to be absent only if verified phone signup is supported | User & authentication |
| Clerk, both instances | Convex integration active; Google and Apple SSO enabled and fully configured if their visible app buttons are retained | Integrations, SSO connections |
| Clerk Production | Native iOS app registered with bundle ID `org.lsftz.hakiyangu` and correct Apple Team ID; Android app registered with package `org.lsftz.hakiyangu`; mobile SSO redirect `hakiyangu://sso-callback` allowlisted | Native applications |
| Convex Development | `CLERK_JWT_ISSUER_DOMAIN` equals the Development Clerk Frontend API URL; backend auth config deployed | Deployment settings; `npx convex dev` |
| Convex Production | `CLERK_JWT_ISSUER_DOMAIN` equals the Production Clerk Frontend API URL; backend auth config deployed | Production deployment settings; `npx convex deploy` |
| Vercel Preview | `VITE_CLERK_PUBLISHABLE_KEY=pk_test_…`, `VITE_CONVEX_URL` points to matching development/staging Convex; correct project root, `npm run build`, output `dist` | Project settings and a preview deployment |
| Vercel Production | `VITE_CLERK_PUBLISHABLE_KEY=pk_live_…`, `VITE_CONVEX_URL` points to production Convex; production domain matches Clerk domain | Project settings and production deployment |
| Expo/EAS Development and Preview | Matching non-production `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_CONVEX_URL`, and `EXPO_PUBLIC_EAS_PROJECT_ID` configured in the EAS environment | Project environment variables and internal build |
| Expo/EAS Production | Matching production values for the same three variables | Production EAS environment and release build |

`mobile/eas.json` selects EAS environments. Keep the actual values in EAS project settings; never restore empty `env` entries to the build profiles. The publishable key and Convex URL are public app configuration, but Clerk secret keys and privileged Convex credentials must never be put in `VITE_` or `EXPO_PUBLIC_` variables. After changing Vercel or EAS variables, make a new build; existing bundles retain their built-in values.

Do not enable instance-wide **Require multi-factor authentication** until the mobile custom sign-in can complete Clerk's `setup-mfa` session task and that path passes device testing. Existing enrolled second factors (authenticator, phone code, backup code) are supported in mobile sign-in; verify the exact factors enabled in the Clerk instance. Keep backup codes available for recovery.

## Device and browser acceptance checks

Use dedicated staging accounts. Do not test sensitive roles against real beneficiary records.

| Account | Web check | iOS and Android check | Backend denial check |
| --- | --- | --- | --- |
| Guest | Public pages, then sign-in prompt for private pages | Public tabs, then sign-in prompt | Private Convex calls denied |
| New beneficiary | Sign up, verify email, connect account, open own dashboard | Same account signs in and sees own cases | Cannot read another user's case |
| Paralegal | Approved role opens provider dashboard | Same role opens assignments | Cannot access unassigned case |
| Provider staff | Provider workspace opens | Own organisation and referrals visible | Another organisation's records denied |
| Staff and supervisor | Correct operations workspace | Correct operations and review screens | Unauthorised approval denied |
| Safeguarding officer | Restricted safeguarding workspace opens | Safeguarding queue visible | Ordinary case access denied unless assigned |
| Content editor | Editorial workspace opens | Editorial workspace opens | Case data denied |
| Stakeholder and donor | Approved aggregate snapshot only | Approved aggregate snapshot only | Draft and case-level data denied |
| Administrator | Admin workspace opens | Access management opens | Self-approval and self-revocation denied |

For every account, check sign-out, session expiry, password recovery, a second-factor challenge where enabled, slow/offline connection, and role revocation while a screen is open. Confirm the same Clerk ID resolves to the same Convex user on web and mobile.

## Release gate

1. `npm run test:security`, `npm run test:haki-contracts`, `npx tsc --noEmit`, and `npm run build` pass in the web root.
2. `npm run typecheck` and `npm run env:check` pass in `mobile` for the intended build environment.
3. The staging account matrix above passes on web, iOS, and Android with real Clerk sessions and the matching Convex deployment.
4. An LSF owner verifies the professional role assignment and recovery process, and keeps a way to suspend access when an account is compromised.
