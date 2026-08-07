# Convex Schema and Function Inventory

## Existing tables

| Domain | Tables | Decision |
|---|---|---|
| Identity | `users` | extend via profiles, roles, memberships, consents; migrate single role |
| Public content | `heros`, `success_stories`, `news`, `publications`, `programs`, `hero_slides`, `team_members`, `testimonials`, `stats`, `quick_links`, `site_settings` | retain; consolidate duplicate story/hero models later |
| Media | `media_library`, Convex `_storage` | extend with ownership, purpose, signature/MIME, scan status and access policy |
| Outreach | `newsletter_subscribers`, `newsletter_campaigns`, `newsletter_templates`, `contact_submissions` | retain only after RBAC, consent, retention and email hardening |
| Sensitive intake | `whistleblower_reports`, `paralegal_applications` | retain/migrate into protected specialist workflows |
| AI | `documents`, `embeddings`, `sara_chats`, `sara_feedback`, `sara_config` | migrate into governed AI model; add source/prompt/safety/cost entities |
| Controls | `rate_limits`, `audit_logs`, `analytics_events` | replace weak client identifier limits; expand immutable audit/access logs |

There are 27 application tables. There are **no** organisations, memberships, help requests, cases, participants, assignments, referrals, appointments, case messages, notifications, outcomes, consent history or safeguarding entities.

## Function permission matrix

Legend: `PUB` intended public read/submit; `AUTH` any signed-in user; `ADM` admin; `STAFF` admin/staff; `OWN` record owner; `INT` Convex internal. “Current” is based on actual server checks, not comments or routes.

| Module | Functions | Current | Required / risk |
|---|---|---|---|
| `users` | `getDashboardData`, `getCurrentUser/current`, `updateProfile` | AUTH/OWN | keep; validate profile fields |
| `users` | `syncUser`, `makeAdmin`, `generateUploadUrl` | **PUB** | **critical:** authenticate subject; ignore client role; makeAdmin internal bootstrap; upload AUTH |
| `admin` | `getAnalytics`, `getUsers`, `updateUserRole` | ADM | keep; audit role changes |
| `debug` | `getUserByEmail`, `listAdmins`, `checkCurrentSession` | first two PUB | remove from production or ADM; leaks identity/roles |
| `formSubmissions` | `submitContact`, `submitWhistleblowerReport`, `submitParalegalApplication` | PUB | validate, rate limit server-derived identity, consent, retention |
| `formSubmissions` | `listContactSubmissions`, `updateContactStatus`, `deleteContact`, `updateWhistleblowerReport`, `reviewParalegalApplication`, `getParalegalApplicationStats` | **PUB** | STAFF/ADM; critical private reads/writes |
| `formSubmissions` | `listWhistleblowerReports`, `listParalegalApplications` | AUTH with ad-hoc email/role | STAFF; central helper, remove email bypass |
| `whistleblower` | `submit` | PUB | retain hardened specialist endpoint |
| `whistleblower` | `list`, `getById`, `updateStatus`, `getStats` | STAFF | keep; add assignment/safeguarding scopes |
| `whistleblower` | `remove` | ADM | prefer retention workflow over hard delete |
| `paralegals` | `listApprovedParalegals`, `incrementProfileViews` | PUB | return public projection only; anti-abuse counter |
| `paralegals` | `getParalegal`, `getParalegalByEmail`, `getParalegalStats`, `getDashboardData` | **PUB full records/email** | public projection or OWN/STAFF; high PII leak |
| `paralegals` | `toggleVerified`, `updateParalegalProfile`, `deactivateParalegal` | **PUB write** | ADM/OWN/STAFF with state machine; critical |
| `paralegals` | `addParalegalManually`, `importParalegalsBatch` | STAFF plus email bypass | STAFF; remove bypass; audit imports |
| `media` | `generateUploadUrl`, `saveMedia` | AUTH | require purpose/role; verify storage metadata and content signature |
| `sara` | `createDocument`, `addEmbeddings`, `getChunks`, `getConfigInternal`, `getAllChats` | INT | retain with bounded queries |
| `sara` | `generateUploadUrl`, `getConfig`, `updateConfig`, `getDocuments`, `deleteDocument` | **PUB** | read public config projection only; training/config/storage ADM |
| `sara_actions` | `ingestDocument` | **PUB action** | ADM; file validation/scanning |
| `sara_actions` | `ask` | AUTH | add consent, policy version, safety/audit and case-data separation |
| `sara_chat` | `getMessages`, `sendMessage`, `clearHistory`, `submitFeedback` | AUTH/OWN | keep; enforce retention and deletion semantics |
| `sara_chat` | `saveMessage`, `createBotMessage`, `updateMessage` | INT | keep |
| `sara_chat` | `getAnalytics`, `getFeedbackList` | **PUB** | ADM/AI reviewer; sensitive chat analytics |
| `analytics` | `logEvent` | PUB | strict event allow-list, minimization, abuse controls |
| `analytics` | reporting queries (`getKnowledgeStats`, `getParalegalFunnel`, `getCostMetrics`, `getChatTopicStats`, `getDailyChats`, `getUserGrowth`, `getPageViewStats`, `getDashboardOverview`) | ADM | retain; aggregate/de-identify |
| `analytics` | `classifyChat` | **PUB action** | internal/scheduled; cost-abuse and data-export risk |
| `analytics` | `logClassification` | INT | keep |
| `ops` | `getBudgetStatus`, `listStaleDocuments`, `getSystemStatus`, `toggleSystemStatus` | ADM | keep; audit kill-switch changes |
| `resend` | `sendEmail`, `sendTransactionalEmail` | **PUB actions** | internal-only templated mail; critical spam/exfiltration surface |
| `newsletter` | all subscriber/campaign/template list, import, update, delete, send functions | mostly **PUB** | subscription/unsubscribe token endpoints public; all management STAFF; send internal job |
| `news` | `get`, `getFeatured`, `getById`, `getBySlugOrId` | PUB | public projection |
| `news` | `create`, `createForMigration`, `update`, `remove`, `seed` | auth-only or inconsistent | content editor/ADM; migration/seed internal |
| `publications` | reads and `incrementDownloadCount` | PUB | validate counters; safe public projection |
| `publications` | `create`, `createForMigration`, `update`, `remove`, `seed` | inconsistent auth | content editor/ADM; migration internal |
| `programs` | `get`, `getBySlug`, `getById` | PUB | public |
| `programs` | `create`, `update` | AUTH only | content editor; `remove` is ADM |
| `opportunities` | reads | PUB | public |
| `opportunities` | `create`, `update`, `remove` | AUTH only | content editor |
| `team`, `stories` | reads | PUB | public projection |
| `team`, `stories` | create/update/remove/seed/migration | AUTH only/inconsistent | content editor; seed/migration internal |
| `hero`, `heros`, `testimonials`, `stats` | reads | PUB | public |
| same CMS modules | writes/seeds | mixed PUB/AUTH | content editor; seed internal |
| `quickLinks` | `getPublic`, `trackClick` | PUB | validate/rate limit counter |
| `quickLinks` | `getAll`, create/update/swap/toggle | **PUB** | content editor |
| `settings` | `getSettings`, `getSetting` | PUB | expose allow-listed public settings only |
| `settings` | `updateSettings` | ADM | keep/audit |
| `seedContent` | `clearAllAndReseed`, `seedAllContent` | **PUB** | internal development only; destructive critical |
| `seo` | `getSitemapData` | PUB | keep; escape/validate URLs |
| HTTP | `GET /sitemap.xml` | PUB | expected public endpoint |

## Relationships and jobs

Most relationships are stringly typed (`programId`, uploader subject) rather than Convex IDs. Embeddings reference documents. Rate limits and analytics are unbounded collections in several queries. Contact submissions schedule email; newsletter send behavior and SARA ingestion/actions are external side-effect paths. There is no cron declaration found and no durable notification delivery table.
