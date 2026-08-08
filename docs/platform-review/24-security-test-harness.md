# Security Test Harness

## Purpose

This project now has a dependency-free security test harness that protects the Phase 0 remediation work from regression.

The harness is intentionally static because the current ZIP working copy is not connected to a Convex deployment and has no Jest/Vitest setup.

## Commands

```bash
npm run test:security
```

Runs:

```bash
npm run security:public-assets
npm run security:convex
```

`npm run build` also runs `npm run test:security` through `prebuild`.

## Covered Checks

### Public Asset Guard

Script:

```bash
scripts/check-public-assets.mjs
```

Fails if executable or server-side files are found under `public`, including:

- `.php`
- `.phtml`
- `.phar`
- `.cgi`
- `.pl`
- `.alfa`
- `.sh`
- `.htaccess`

### Convex Permission Matrix

Script:

```bash
scripts/check-convex-security.mjs
```

Checks every public Convex `query`, `mutation`, and `action` export against an explicit classification matrix.

Current coverage:

- 162 public Convex functions classified.
- Admin-only functions must contain the expected `requireAnyRole(ctx, ["admin"])` gate.
- Staff/admin functions must contain the expected staff gate.
- Authenticated/self functions must contain an identity or central auth gate.
- Public functions must be explicitly classified as public read, public submission, public tracking, public counter, public subscription, or public proxied chatbot.

The script fails if a new public Convex function is added without a classification.

### Frontend HTML Injection Guard

The Convex security script also scans frontend files for `dangerouslySetInnerHTML`.

Allowed:

- Calls that use `sanitizeHtml(...)`.
- The chart component, because it injects generated CSS variables rather than CMS/user HTML.

Blocked:

- Any new raw `dangerouslySetInnerHTML` usage in application content paths.

### Legacy Secret/Bypass Strings

The matrix script fails if these known bad strings reappear:

- hard-coded n8n webhook URLs
- `anonymous_dev_user`
- `Lsf2026`
- `unsafeMetadata?.role`

## Limits

This is a regression harness, not a full runtime security test suite.

It does not prove Convex auth behavior against real Clerk JWTs. That requires a connected Convex deployment or a proper Convex test runtime.

It does not prove sanitizer correctness against a full XSS corpus. It confirms every known render path uses the sanitizer and that backend write/send paths sanitize rich HTML.

## Next Step

Once the repo is restored as a proper Git checkout and Convex is configured, add runtime tests for:

- unauthenticated user denied from admin/staff functions
- normal user denied from admin/staff functions
- staff allowed only where staff is expected
- admin allowed everywhere admin is expected
- public submission paths still work without login
- migrated rich HTML is sanitized before display
