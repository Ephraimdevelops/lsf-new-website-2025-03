# Privacy and Data safety review worksheet

Status: incomplete; not an approved public policy or a completed Google declaration.

The public privacy page contains generic January 2024 language. It does not adequately describe the current Haki Yangu flows. A deletion page now explains actual login deletion and provides a request path, but the backend retains records and no approved retention schedule was provided. Do not claim full erasure or Play compliance on this basis.

| Data/flow to review | Implementation evidence | Required decision/evidence |
| --- | --- | --- |
| Identity and login | Clerk; Convex users and role assignments | Production processors, account fields, purpose and retention |
| Requests, case text, messages and attachments | legalHelp, caseManagement, managedUploads | Access scope, lawful retention reasons and durations, erasure/anonymisation process |
| Personal document library | personalDocuments | Deletion on account closure; files and metadata retention |
| Intake audio/transcription | intakeAudio uses OpenAI after consent | Processor terms, audio/transcript retention and prominent disclosure |
| Saada conversations | sara/sara_actions | What is sent to AI provider, retention, approval/evaluation and disclosures |
| Foreground beneficiary search | location queries | Confirm transient handling and Mapbox SDK network behavior |
| Opt-in paralegal location/presence | paralegalLocation, presence | Explain approximate location, opt-in and expiry; verify all deletion paths |
| Notifications | push_subscriptions and Expo delivery | Token retention, opt-out, third-party processing, neutral content |
| Crash/diagnostic data | Web Sentry dependency; actual runtime configuration must be inspected | Enabled SDKs, collected fields, scrubbers, retention and consent where applicable |
| Profile images and professional credentials | users, paralegals, formSubmissions | Public/private visibility, processor inventory, retention |
| Audit and safeguarding records | audit_logs, restricted records | Approved exceptions, durations, access and requests process |

LSF must name an accountable reviewer and approve: legal entity/contact; actual collection and sharing; production processors; retention by category; deletion exceptions and reasons; identity verification for requests; response process; child/age audience; relevant rights and cross-border disclosures. Engineering must implement the approved deletion schedule and test that storage objects, related tables, tokens, caches and third-party copies are handled as stated.

The existing info@lsftz.org address is taken from the website; confirm it is monitored for deletion requests before publishing the new page. Set the final HTTPS `/account-deletion` and `/privacy` URLs in Play Console only after deployment and verification while signed out.

Map each enabled SDK and data category to the actual Play Data safety questionnaire; distinguish service-provider processing from sharing using Google's definitions. Do not guess “not collected”, “not shared”, or encrypted-at-rest claims from the presence of HTTPS alone.

Sources: [Google account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en-EN), [Google User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en-gb).
