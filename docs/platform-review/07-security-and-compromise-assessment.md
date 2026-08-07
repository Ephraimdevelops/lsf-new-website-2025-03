# Security and Compromise Assessment

## Evidence grades

- **Confirmed:** observed in source, local artifact, GitHub API or runtime.
- **Likely:** supported inference requiring logs to prove exploitation/exposure.
- **Unknown:** owner-console/log access required.

## Suspicious-file inventory

All were added in GitHub commit `ec5005950e43c78a1c00a17226a232f53bf40951` on 2026-01-22 19:14:35Z by GitHub user/author `Ephraimdevelops`, commit message “Fix environment variables for Next.js.” Parent: `206d4a969447a6e89f4890dfdcaa301ca2e95900`.

| Path group | Local content | SHA-256 / assessment |
|---|---|---|
| `index.php`, `1748506793.php`, `geko.php`, `a.php`, `perl.alfa`, `.htaccess` | empty | empty-file hash `e3b0...b855`; suspicious decoy/artifact names |
| `x.php` | unrelated Indonesian admin-user/password form | `625769...4048`; suspicious contamination |
| `cs.php` | related Indonesian form, references `sidrapkab.go.id`/example endpoint | `48111a...53ae`; suspicious contamination |
| `x.html` | same unrelated form family | `7b5459...666f`; suspicious contamination |

Remote recursive-tree search found no other PHP/CGI/Perl/shell executable paths outside this set. Pattern search found no `base64_decode`, shell-exec family, private-key markers, common GitHub/OpenAI token formats or obvious obfuscated payload in non-dependency source. This is not malware clearance: binary steganography, deleted history and production hosts were not forensically scanned.

## Exposure assessment

- **Confirmed:** Vite copies these files from `public` into `dist/NewsImages`; local build reproduced this.
- **Confirmed:** GitHub reports multiple Vercel `Production` deployments after the introducing commit (Feb–Mar 2026).
- **Likely:** those deployments served the files as static public assets. Vercel static hosting does not execute PHP, limiting code-execution risk there, but the files and forms were publicly retrievable.
- **Unknown:** whether a legacy Apache/PHP host executed any prior version, whether URLs were requested/submitted, or how the files entered the upload folder. Preserve and inspect Vercel/CDN, legacy host, WAF and GitHub audit logs before retention expires.

## Other critical risks

| Risk | Severity | Evidence / action |
|---|---|---|
| public admin promotion and caller-controlled role sync | critical | disable immediately; inspect role-change/user records |
| public destructive seed/content and email actions | critical | internalize; review Convex logs |
| committed `.env`; gitignore omission | critical process | remove from current tree/history strategy; rotate affected credentials |
| frontend fallback admin PIN | high | remove; assume disclosed |
| public/private data reads and paralegal writes | critical | centralized RBAC and ownership |
| raw HTML/email interpolation | high | sanitize stored CMS HTML; escape transactional fields |
| upload metadata trusted from client | high | purpose-bound upload ticket, server storage metadata, magic-byte scan, quarantine |
| direct n8n webhook | high | server proxy, authentication/signature, quotas, schema validation |
| client-provided rate-limit identifier/default shared bucket | medium/high | trusted edge token/IP hash plus account/device limits |
| no retention/access-log model | high for legal data | approve policy before case launch |

## Credential response

Rotate in this order: any secret values ever committed; Vercel/GitHub Actions deployment tokens; Convex deploy key and sensitive environment secrets; Clerk secret/JWT configuration; OpenAI; Resend; n8n; Supabase service-role/database; Sentry auth tokens. Public Clerk publishable, Convex URL, Sentry DSN and Supabase anon keys are not secrets by themselves, but review scope/RLS and rotate where history or policy is uncertain. Revoke unused OAuth/GitHub apps and review collaborator/admin access.

## Safe removal plan

1. Preserve hashes, commit metadata, raw files and logs in a restricted incident record outside the deployed tree.
2. Determine deployment requests and legacy-host execution; open an incident with owner/security lead.
3. Delete the nine contaminated files plus `x.html` from `public`; rebuild so `dist` no longer contains them. Add CI-deny patterns for executable server extensions in public assets.
4. Purge CDN caches and verify each former URL returns 404/410.
5. Rotate credentials, inspect anomalous role/data/email/AI activity, and document closure.

## Remediation applied in this checkout

After preserving hashes, contents and GitHub provenance above, the contaminated files were removed from `public` and a pre-build executable-file deny check was added. The local build recreates `dist`, removing its copied versions. This does not purge Git history/CDN caches or replace production incident work. The unauthenticated user role/admin/upload paths, quick-links PIN/backend, and fail-open route guard were also closed as a first remediation slice; the rest of the permission matrix remains release-blocking until repaired and tested.

## Upload remediation

Clients request an upload intent specifying purpose and expected constraints. Convex authorizes actor/purpose and issues a short-lived ticket. After upload, a server job reads authoritative storage metadata, validates size and extension, checks magic bytes, scans malware, strips risky metadata where appropriate, quarantines until clean, and stores an access policy. Downloads use authorization-aware functions/signed URLs; sensitive files are never permanent public URLs.
