# SARA / Saada AI Architecture Review

## Decision required

Code/routes call the system **SARA**; the user interface and document title call it **Saada**. Treat these as one intended assistant until LSF approves otherwise. Recommended public name: owner decision; internal service name must not leak into product semantics.

| Dimension | Convex/OpenAI path | n8n widget path |
|---|---|---|
| Entry | `/sara`, `/sara-ai` | floating widget, `/lsfchatbot`, Haki Yangu bot |
| Identity | Clerk required | guest/browser direct |
| History | `sara_chats` per Clerk subject | widget/browser/n8n, separate |
| Knowledge | Convex documents + vector embeddings | unknown n8n workflow |
| Safety | hard-coded emergency keywords/replies, confidence fallback, kill switch | disclaimer/UI logic; server policy unknown |
| Operations | OpenAI key, analytics, all-chat budget scan | public webhook URLs, separate test/prod |
| Governance | weak admin checks, no prompt version table | workflow access/history unknown |
| Channels | web; mobile could reuse | web; possibly channel automation |

## Recommendation: one governed AI service

Use a Convex `aiService` boundary as the authoritative API and history. It may invoke OpenAI directly or a private n8n orchestration workflow, but clients never call providers/webhooks. The service contract supports website, mobile and future WhatsApp with channel metadata, consent state, language, session purpose (`general_information` versus `case_assistance`), retrieved source IDs and escalation output.

```text
client → ai.startSession / ai.sendMessage
       → policy + consent + rate/cost gate
       → approved emergency rules (no model-generated contacts)
       → approved retrieval sources
       → model/orchestrator
       → safety checks + citations + confidence
       → persisted response/audit/cost + optional human escalation
```

## Governance model

- `aiPromptVersions`: purpose, language, body hash, model, owner, reviewer, approved/effective/retired dates.
- `legalSources`: jurisdiction, citation, publisher, version/effective date, reviewer, approval and expiry.
- `emergencyGuidance`: category, language, region/coverage, exact contacts, owner, approval, effective/review/expiry dates, active flag and change history.
- `aiSafetyEvents`: policy, severity, redacted context, action, reviewer and outcome.
- `aiEscalations`: session, reason, urgency, consent, target queue and status.
- `aiCostMonthly`: month/channel/model/purpose totals; update incrementally. Remove `getAllChats` budget scans.

## Safety rules

General legal information is not a case record and must not silently create one. Case context is fetched only after explicit consent and `requireCaseAccess`. Emergency contacts are deterministic governed content. Answers cite approved sources, state limitations, support harmful-answer reporting and never claim advocate-client privilege, guaranteed confidentiality, legal representation or document validity.

## Migration

Freeze n8n workflow changes, export its prompts/mappings/log-retention design, compare answer quality and safety against Convex, then route both UIs through the shared service. Migrate only consented/useful history; otherwise expire it under policy. Retire direct webhook URLs after parity and revoke them.
