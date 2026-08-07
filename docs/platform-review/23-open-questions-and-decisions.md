# Open Questions and Owner Decisions

No engineering team should guess these decisions.

## Release-blocking owner decisions

| Decision | Required owners | Recommended default |
|---|---|---|
| incident classification and evidence retention | executive, security, legal | treat as security incident until logs clear it |
| production credential rotation scope | security/platform owners | rotate all server/deploy secrets plausibly exposed |
| Haki Yangu claims currently on website | product, MEL, communications, legal | remove/qualify unless independently evidenced |
| public assistant name: SARA or Saada | brand/product/legal | one public identity; aliases only during migration |
| authoritative AI execution | architecture, legal, AI owner | Convex governed service; private provider/orchestrator behind it |
| guest AI availability and retention | legal/DPO/product | general info only, minimized short retention, explicit consent |
| role/capability and multiple-role approval | operations/security | normalized assignments + org scope, no client metadata |
| whistleblower/safeguarding access groups | safeguarding/DPO | specialist default-deny groups, break-glass audited |
| data retention/deletion/legal hold | DPO/legal/programmes | record-specific approved schedule before case pilot |
| Supabase production status | platform/data owner | decommission after backup and zero-write proof |
| app package/bundle IDs and store accounts | LSF technology owner | LSF-owned accounts and `org.lsftz.hakiyangu` |
| pilot regions, issue categories and capacity | operations/programmes | narrow capacity-bounded pilot |

## Facts requiring console/operational access

- Which exact Vercel domains/deployments served the contaminated paths, request history and cache state?
- Do legacy PHP hosts or upload directories exist, and were these files executable there?
- What anomalous Clerk users/roles, Convex mutations, Resend emails, n8n calls or OpenAI usage occurred since 2026-01-22?
- Which secret values appeared in `.env` history, deployment logs, documentation or prior commits?
- Is Supabase receiving writes or holding unique users/files/data?
- What are current Clerk sign-in methods, webhook setup, JWT template and unsafe-metadata permissions?
- What are n8n workflow prompts, credentials, logs, retention, error handling and WhatsApp plans?
- Who reviews Tanzanian legal sources, emergency contacts, prompts, templates and translations, on what schedule?

## Product/process questions

- What legally and operationally distinguishes a help request, case, referral, complaint and whistleblower report at LSF?
- Which LSF roles triage, supervise, safeguard, edit content, administer identity and approve outcomes?
- Can partner staff message beneficiaries directly, and under what consent/supervision?
- What is a verified paralegal, who can suspend verification, and how is capacity represented?
- Which issue categories/regions/languages are in the first pilot and what response SLA is realistic?
- Which channels are safe for each beneficiary, especially shared phones and GBV/child matters?
- What constitutes resolved versus closed unresolved, and whose perspective is recorded?
- What donor metrics and geographic granularity are contractually required?

## Approval gates

1. **Security gate:** incident, secrets, authorization, uploads, HTML/email, CI.
2. **Governance gate:** roles, consent, retention, safeguarding, AI/content ownership.
3. **Contract gate:** domain model, statuses/taxonomy, service contracts and migration.
4. **Pilot gate:** capacity, user research, operational playbooks, vertical-slice E2E and rollback.
5. **Scale gate:** measured safety/service quality, offline reliability and independently reconciled reporting.
