# Route and Page Inventory

All routes are declared in `src/App.tsx`. `D` means dynamic Convex content; `S` means static/local content; `A` means AI; `F` means form/mutation. Mobile relevance is `reuse contract`, never reuse the page component.

| Routes | Audience / purpose | Data / functions | Guard | Status / mobile relevance |
|---|---|---|---|---|
| `/`, `/about`, `/what-we-do`, `/strategic-focuses`, `/approaches` | public institutional site | mixed S/D CMS queries | public | buildable; public-content contracts reusable |
| `/what-we-do/grant-making`, `/direct-implementation`, `/advocacy-policy`, `/capacity-building`, `/learning-research`, `/partnerships-networking` | public programme explanations | mostly S | public | website-specific presentation |
| `/focus-areas/accessible-legal-aid`, `/empowered-communities`, `/conducive-environment`, `/institutional-development`, `/climate-justice`, `/digital-transformation`, `/focus-areas/:slug` | public focus content | S plus local mappings | public | knowledge taxonomy candidate |
| `/programs`, `/programs/:id` | programme catalogue/detail | `programs.*` | public | content reusable; IDs/slugs need stable contract |
| `/legal-help` | contact/legal-help landing form | contact/form submission paths | public | not a case intake; replace with guided request contract |
| `/impact` | impact marketing | static/CMS analytics claims | public | metrics need governed definitions |
| `/heroes`, `/heroes/:id`, `/stories/:storyId`, `/success-stories` | stories | `heros.*`, `stories.*` | public | duplicate story models; consolidate later |
| `/news`, `/news/:id` | news | `news.*` | public | mobile knowledge/content reuse |
| `/publications`, `/publications/:id` | documents | `publications.*`, storage | public | mobile/offline relevance; secure download policy needed |
| `/resources`, `/resources/climate-justice`, `/gender-justice`, `/legal-empowerment` | resource navigation | mostly S | public | future knowledge centre seed |
| `/contact` | contact form | `formSubmissions.submitContact` | public F | rate limiting weak; HTML injection risk |
| `/team`, `/team/:id`, `/partners` | people/partners | `team.*`/static | public | no provider organisation model |
| `/opportunities`, `/opportunities/:id` | jobs/grants | `opportunities.*` | public | website-only content |
| `/donate` | donation marketing | static/external | public | payment flow not implemented here |
| `/admin/*` | CMS, forms, analytics, operations | broad admin modules | `ProtectedRoute(admin)` | **fail-open guard; backend checks incomplete** |
| `/admin/quick-links` | links manager | `quickLinks.*` | no route wrapper; frontend PIN | **critical access design flaw** |
| `/dashboard/staff` | staff dashboard | placeholder | `ProtectedRoute(staff)` | no case operations implemented |
| `/dashboard/paralegal` | paralegal profile dashboard | `paralegals.getDashboardData(email)` | `ProtectedRoute(paralegal)` | email-based access; no assignments/cases |
| `/dashboard/stakeholder` | stakeholder dashboard | placeholder | `ProtectedRoute(stakeholder)` | donor privacy model absent |
| `/dashboard/user` | user dashboard | mock tasks/user data | `ProtectedRoute(user)` | no My Cases |
| `/profile`, `/bookmarks` | user settings/saved UI | user/storage/local | no route guard | enforce auth and ownership server-side |
| `/become-a-paralegal` | application | `submitParalegalApplication` | public F | useful intake, not verification workflow |
| `/whistleblower` | sensitive report | `whistleblower.submit` and legacy duplicate paths | public F | specialist protected workflow required |
| `/faq` | public FAQ | static | public | knowledge-centre candidate |
| `/haki-yangu` | product marketing | S plus chatbot | public A | not the mobile app or operational service |
| `/sara-ai`, `/sara` | authenticated AI UI | `sara_actions.ask`, `sara_chat.*` | component sign-in | public name is “Saada” despite route/code “SARA” |
| `/sara/train` | RAG document administration | `sara.*`, `sara_actions.ingestDocument` | `ProtectedRoute(admin)` | backend functions currently unguarded |
| `/privacy`, `/terms`, `/cookies`, `/accessibility` | legal/policy pages | static | public | policies do not prove technical compliance |
| `/signup/*`, `/login/*`, `/paralegal-login/*`, `/paralegal-signup/*` | Clerk identity | Clerk + user sync | public | phone auth/guest migration/multi-role absent |
| `/lsfchatbot` | n8n AI full page | direct n8n webhook | public A | duplicate AI path; retire after migration |
| `/connect` | contact/navigation | static/form | public | review product purpose |
| `*` | 404 | none | public | working fallback |

## Route defects

- `/admin/quick-links` is outside the admin wrapper and uses a bundled fallback PIN.
- `/profile` and `/bookmarks` have no declared route guard.
- Four dashboards are largely shells; their presence must not be reported as operational capability.
- Dynamic route identifiers mix `_id`, string IDs and slugs; mobile needs stable public IDs/contracts.
- The global provider error blocks every route when Clerk/Convex configuration is absent.
