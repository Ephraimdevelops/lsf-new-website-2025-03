# Auth dashboard audit — 2026-09-29

Inspection of the signed-in LSF Website Clerk application, LSF Vercel project, and LSF Convex deployments. Updated below with the changes made on 2026-09-29.

## Changes completed

- Clerk Production now verifies email at signup by code and allows signup with password. Email remains optional so verified phone-only signup can be added later. Clerk Development permits phone signup with verification and phone/password sign-in, while username signup and Facebook sign-in have been removed from the signup choices. The local web form now shows Google, email/password, and a phone switch without the former username and Facebook controls.
- Local web and mobile development keys now use Clerk Development (`pk_test_`) with Development Convex (`joyous-spaniel-5`). Development Convex auth configuration and the updated account sync were deployed with `npx convex dev --once`.
- Mobile phone/password signup, SMS verification, sign-in, and recovery have been implemented behind `EXPO_PUBLIC_PHONE_AUTH_ENABLED`, which defaults to off. A new account is asked for its name and then its intended role. A professional role is granted only through an approved workflow; preapproved paralegal matching now requires a verified email claim.
- Production phone signup remains disabled. Tanzania numbers are currently blocked by Clerk's Development SMS allowlist (Tier D requires support activation), and production phone auth requires a paid plan. Google mobile SSO remains hidden until native registration and redirect testing finish.

## Blocking findings

1. **Production phone authentication is not available yet.** Clerk Production needs the phone method and a paid plan. Tanzania SMS is blocked in Development until Clerk enables the Tier D country. Keep the phone release flag off and verify SMS delivery, code expiry, rate limits, password recovery, and cost before release.
2. **The end-to-end session claim path is not verified yet.** The Clerk Convex integration is off in both environments, and the token has no explicit verified email/phone claims. Account creation, one-account web/mobile access, and preapproved paralegal matching need real session testing after these settings are reviewed and applied.
3. **Production mobile social login is not ready.** The original mobile screen showed Google and Apple buttons. They are now gated by `EXPO_PUBLIC_GOOGLE_SSO_ENABLED` and `EXPO_PUBLIC_APPLE_SSO_ENABLED`, defaulting to off until each provider is proven working. Production Clerk lists Google as **Setup required** and has no Apple connection. The Production Native applications page has Native API enabled but no iOS app, no Android app, and no mobile SSO redirect URL. The Clerk Convex integration switch is also off, although Convex Production currently lists a Clerk OIDC provider; review the token configuration before changing the switch.
4. **Vercel Preview is not isolated.** `VITE_CONVEX_URL` and `VITE_CLERK_PUBLISHABLE_KEY` are each assigned to **All Environments**. The Convex URL is Production (`dusty-ox-781`) and the Clerk key is `pk_live_`, so preview deployments use both Production services unless overridden. Production Vercel and Production Convex do match; Production Convex auth is configured for `https://clerk.lsftz.org` with application ID `convex`. Vercel's Vite preset and empty root directory are appropriate for this repository.
5. **Production delivery and recovery need attention.** Clerk shows an email deliverability recommendation to add a second email provider. Convex warns that the team's latest subscription payment failed and says service interruption is possible. Production Convex reports no backup yet and was last deployed about seven months ago. The live Vercel deployment is ready but dates from September 9; it does not contain the current local auth fixes.
6. **Vercel flags `CLERK_SECRET_KEY` as Needs Attention.** It is stored as a Config variable in All Environments. Audit whether this Vite-only project uses it; if needed by a server component, store it as Secret and scope it to the required environments. Never expose it in `VITE_` or `EXPO_PUBLIC_` variables.

## Remaining action order

1. Activate and inspect the Clerk Convex integration, add only the verified contact claims the application needs, and test a real development session on web and mobile.
2. Scope Vercel Preview to the Development pair, keeping Production on the Production pair. Set the three Expo/EAS values for Development, Preview, and Production builds. `mobile/eas.json` now selects these EAS environments without blank overrides.
3. Configure Google, complete native redirect/app registrations, test it on devices, then set `EXPO_PUBLIC_GOOGLE_SSO_ENABLED=true` in EAS and rebuild. Obtain the Apple Team ID and Android signing SHA-256 fingerprint from the release owner/build system if Apple login is added later.
4. Resolve Convex billing and create a tested backup before a production backend deployment. Review the pending backend changes and deploy deliberately; then deploy the current web changes and rebuild mobile.
5. Verify the role matrix in `auth-launch-checklist.md` on web, iOS, and Android. Confirm the same Clerk user ID, Convex user, and active roles across production web and production mobile.

## Evidence observed

- Clerk application: **LSF Website**, Production domain `lsftz.org`, Production Frontend API `clerk.lsftz.org`.
- Convex project: `lsf-new-website-2025-03`, Production `dusty-ox-781`, Development `joyous-spaniel-5`.
- Vercel project: `lsf-new-website-2025-03`, production domain `lsftz.org`.
- The iPhone simulator opened mobile email and phone sign-in/signup screens. The local web signup visibly showed Google, email/password, and phone options after the dashboard changes. A real account was not created or authenticated, so same-account access is not yet proven.
- `npm run test:security`, all 62 Haki contract tests, web and mobile TypeScript checks, and `npm run build` passed after the code changes.
- A Clerk Development email/password test signup (`haki-mobile-smoke-20260929+clerk_test@example.com`) completed on the iPhone Simulator. The first signed-in render failed because private case queries ran before the Clerk user finished syncing into Convex. Mobile navigation and private tab queries now wait for account sync, with a retry/sign-out state on failure. After reloading, the account synced, the name `Test User` was saved, the beneficiary path completed, and Home, My Case, Messages, and Profile rendered without the authorization error. Mobile TypeScript passed after this fix. This is Development-only evidence; web login and Production remain untested end to end.
