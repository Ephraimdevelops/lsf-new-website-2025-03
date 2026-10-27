// Architecture reviewed 26 October 2026. Static explanatory content; no live operational metrics.
  export const nodes: Record<string, {name: string; facts: string[][]}> = {
    web:{name:'Website and web workspaces',facts:[['Experience','Public information, Find Help, rights guides, AI chat and role-specific workspaces.'],['Engineering','React 18, TypeScript, Vite, React Router, Tailwind and shadcn/Radix.'],['Data path','Browser → Clerk identity + Convex API. The local preview can still use the remote development backend.'],['Evidence','src/App.tsx · src/components/ConvexClientProvider.tsx']]},
    mobile:{name:'Mobile application',facts:[['Experience','iOS/Android access to support, cases, AI, documents and professional/admin screens.'],['Engineering','Expo 57, React Native 0.86, Expo Router and the same Convex/Clerk services.'],['Device capabilities','Consented audio/photos/files, notifications, maps, protected screens and selected offline drafts.'],['Limit','Offline preparation is not offline AI; an internal build is not a store release.']]},
    identity:{name:'Identity is separate from permission',facts:[['Clerk','Signs the person in and provides session identity.'],['Convex','Looks up the account, active role assignments, ownership, case access and organisation scope.'],['Roles','Beneficiary, paralegal, provider worker, staff, supervisor, safeguarding officer, editor, admin, donor and stakeholder.'],['Boundary','A claimed role in chat does not grant access. UI route guards are not the server security boundary.']]},
    backend:{name:'One shared application backend',facts:[['Queries','Read permitted records and reactively update connected interfaces.'],['Mutations','Apply validated database changes transactionally.'],['Actions','Call OpenAI, scan files or contact configured external services.'],['Persistence','Convex database, indexed/vector search, file storage, audit logs and scheduled jobs.']]},
    ai:{name:'Saada / Haki Yangu AI',facts:[['Architecture','One bounded agent with 24 server tools and 8 workflow skills.'],['Inputs','Chat, transcribed voice and previously consented document descriptions; English and Kiswahili.'],['Authority','Approved legal evidence, current directory records and authorised personal data have different scopes.'],['Actions','Draft first; separate user/staff confirmation and server checks before a supported action.']]},
    help:{name:'Finding suitable assistance',facts:[['Public discovery','Eligible public services and paralegal profiles; optional region, district, issue and location filters.'],['Different paths','Website/AI service search uses filtering. Mobile structured service recommendations and staff assignment use separate ranking rules.'],['Privacy','Short-lived worker locations and public office fallback; confidential safe houses are not public results.'],['Current data','Results depend on independently verified, active public records. This explanation does not query live availability.']]},
    cases:{name:'Accountable human casework',facts:[['Intake','The person reviews and submits a request with safe contact preferences.'],['Delivery','Triage → case → assignment offer → worker acceptance → messages, tasks and appointments.'],['Referrals','Authorised proposal, beneficiary consent and recipient access checks; no automatic external sharing by the AI.'],['Accountability','Case timeline, outcomes, feedback, review requests, supervision and safeguarding workflows.']]},
    documents:{name:'Private files, descriptions and letters',facts:[['Storage','Purpose-bound, owned uploads with quarantine/scanning and access checks.'],['Document checker','Preparation checklist plus optional consented PDF/photo description; not authentication or legal approval.'],['Chat','Can discuss an owned saved summary; filenames alone do not reveal document contents.'],['Letters','User-reviewed factual/template drafts, optional case attachment and user-controlled sharing; no automatic filing.']]},
    learning:{name:'Rights, learning and public content',facts:[['Knowledge','Versioned source PDFs, legal guides, expiry dates and independent review.'],['Paralegal readiness','Onboarding, ID/certificate evidence, ethics/code acknowledgement and safeguarding training requirements.'],['Content operations','Training modules plus website publications, news, programmes and stories.'],['Offline','Selected mobile preparation checklists and saved drafts; not automatically approved legal guidance.']]},
    operations:{name:'Administration, governance and results',facts:[['Control','Role/access requests, provider verification, organisation membership and scoped workspaces.'],['AI governance','Source/prompt review, risk/evaluation queues, activity logs, maintenance controls and spending estimates.'],['Operations','Assignment expiry, appointment reminders, draft/location expiry and quarantine cleanup.'],['Reporting','Independently approved aggregate snapshots with small-group suppression for permitted external audiences.']]}
  };
  export const aiFlows: Record<string, string[][]> = {
    rights:[['Person asks a legal question','English or Kiswahili; retain relevant conversation context.'],['Server checks access and limits','Session, ownership, maintenance and application AI allowance.'],['Saada loads the rights workflow','Versioned system prompt + load_skill(rights_and_pathways).'],['Retrieve evidence','search_knowledge + find_guides: only approved/current records support legal claims.'],['Check evidence and answer','Cited explanation where supported; otherwise clarification and a truthful next step.'],['Return to chat','Display the completed answer with verified server-produced cards.']],
    support:[['Person gives issue and location','A district can be enough; the AI should not invent a different district.'],['Saada loads find_support','The model chooses tools; the server validates arguments and role scope.'],['Search verified public records','find_services + find_paralegals; return eligible records, not research drafts.'],['Add public information if needed','find_information_resources supplies labelled publisher contacts/links.'],['Show suitable help','A result card is information, not a sent referral or confirmed intake.']],
    appointment:[['Person identifies an accessible case','Use an exact returned case reference; clarify preference and necessary details.'],['Prepare an owner-bound draft','prepare_appointment_request creates a review card.'],['Person reviews and confirms','The confirmation action is outside the model tool list.'],['Server rechecks and records request','Permission and duplicate/replay protections apply.'],['Case team schedules separately','Appointment requested does not mean a time has been booked.']],
    referral:[['Authorised worker chooses a case','Role + case access are checked on the server.'],['Find allowed referral destinations','referral_destinations excludes unavailable or restricted destinations.'],['Prepare the proposal','prepare_referral includes exact returned IDs and agreed minimum information.'],['Worker reviews and confirms','Creates an awaiting-consent referral through the existing workflow.'],['Beneficiary consents to disclosure','Only then can permitted recipient access and referral processing proceed.']],
    voice:[['Person records with consent','The app uploads a bounded recording through the owned media flow.'],['OpenAI transcribes','whisper-1 produces text; this is not legal reasoning.'],['Normal Saada chat workflow','Language/context, scoped tools and evidence checks remain the same.'],['Answer appears in chat','The text answer is the authoritative app response.'],['Optional read-aloud','gpt-4o-mini-tts / coral reads the owned completed answer, not a new legal answer.']],
    document:[['Person saves a PDF or photo','Ownership, purpose, malware checks and AI-analysis consent.'],['Create a short document description','Readable PDF text or a clear photo; do not authenticate or invent unreadable clauses.'],['Person selects the saved description','The chat receives that owned summary, not unrestricted file/database access.'],['Discuss visible facts carefully','read_my_document_summary can retrieve an already-consented summary.'],['Separate legal claims from file facts','Approved legal evidence is still needed for legal rules or deadlines.']]
  };
  export const aiBoundaries: Record<string, string> = {rights:'Legal claims require approved, current sources. Indexing a PDF alone does not make it eligible evidence.',support:'Only eligible public providers can appear as verified matches. Publisher links are a separate information fallback.',appointment:'Confirmation creates a request. A human case team must still schedule the appointment.',referral:'Worker confirmation is not beneficiary consent, and preparation does not send information.',voice:'Online model calls are required. Voice uses the server’s configured OpenAI access, not a separate client API key.',document:'A personal file summary is not legal evidence, identity verification or document authentication.'};
  export const matchFlows: Record<string, {flow: string[][]; rows: string[][]; caption: string; boundary: string}> = {
    browse:{flow:[['Start from reviewed public services','listPublicServices excludes inactive, expired, unverified, synthetic and safe-house records.'],['Website: filter and show records','Search, area and issue filters; optional radius/distance. A listed service may have closed intake, shown in its record.'],['AI: query location and issue','find_services calls the same public query with supplied filters, then keeps open/limited intake.'],['Return directory information','AI emits up to 3 verified service cards. This path does not call the mobile weighted ranking function.']],rows:[['Website list','Public eligibility + text/area/issue filtering'],['Optional distance','Coordinates and known-distance ordering'],['AI intake filter','Open or limited only'],['AI card limit','Up to 3 results'],['Weighted suitability score','Not used by this AI service-search path']],caption:'Website directory and AI lookup · filtered discovery',boundary:'Public visibility and intake are separate checks. There is no promise that the first AI result is the closest or best possible match; the AI service tool has no GPS-origin parameter.'},
    service:{flow:[['Collect location and issue','Browse filters, or structured recommendation inputs.'],['Apply public eligibility gates','Active, verified, public, review unexpired, non-synthetic, not a safe house.'],['Narrow the candidate set','Service/issue fit, region/coverage, district; recommendation logic may include remote support.'],['Rank recommendations','Deterministic priority points, then known distance as a tie-breaker.'],['Explain the result','Return up to 5 recommended services with reasons; directory browse uses filters/distance instead.']],rows:[['Issue fit','+35'],['Region / coverage','+20'],['Same district','+10'],['Intake open','+15'],['Referral capability','+10'],['Phone / remote support','+5']],caption:'Structured service recommendations · priority points, not confidence',boundary:'Immediate-safety requests are restricted from this public ranking path. Staff/safeguarding handling is required; confidential shelter locations stay hidden.'},
    paralegal:{flow:[['Collect region/district or optional origin','A district-only request can be filtered by the AI over eligible public results.'],['Check professional readiness','Approval, verification, reviewer, ID/certificate and required onboarding/ethics/safeguarding steps.'],['Exclude synthetic/private-only data','Return a public profile projection, not application evidence or full private records.'],['Resolve eligible location','Fresh shared worker location, otherwise a verified public meeting office, otherwise unknown.'],['Show public profiles','Known-distance sorting/radius filtering where requested; no automatic case assignment.']],rows:[['Public readiness','Hard eligibility filter'],['Region / district','Location filtering'],['Distance','Only when suitable coordinates exist'],['Presence','Optional recent activity signal'],['Case capacity','Separate from being online']],caption:'Public paralegal discovery · eligibility and location, not an LLM score',boundary:'Being online is not consent to a meeting or an available case slot. Worker location is short-lived; private exact coordinates are not exposed as a public profile.'},
    assignment:{flow:[['LSF reviews a real request/case','Case/request access and active worker affiliations are checked.'],['Build the eligible worker pool','Verified/readied paralegals or authorised partner staff; applicable organisation scope.'],['Check availability and workload','Declared weekly capacity minus open accepted assignments; unknown/full/paused is not ready to offer.'],['Rank with recorded reasons','Offer readiness first, then score, distance and load. Return up to 8 candidates.'],['Staff chooses; worker responds','An assignment offer must be accepted. Overrides require an explicit recorded reason.']],rows:[['Verified profile','+15'],['Same region / district','+30 / +25'],['Specialisation fit','+12 per match, capped at +30'],['Language fit','+8'],['No active accepted cases','+10'],['Existing workload','Penalty up to −20'],['Unknown capacity / paused','−30 / −60; offer gate also applies']],caption:'Staff assignment recommendations · separate algorithm',boundary:'AI does not directly assign a case. Declared capacity, availability and human acceptance remain operational requirements.'}
  };
  export const personas: Record<string, {flow: string[][]; rows: string[][]}> = {
    user:{flow:[['Understand the problem','Use guides, AI clarification or public support information.'],['Prepare and submit a request','Necessary facts, location and safe contact preferences.'],['Follow my case','Messages, documents, appointments and recorded progress.'],['Control sharing and give feedback','Review consent requests, outcomes and any service concern.']],rows:[['Can access','Own requests, accessible cases, saved documents and consent decisions.'],['AI helps with','Preparation, status explanations, supported guidance and appointment-request drafts.'],['Cannot do through AI','Self-approve legal sources, choose another person’s records or claim a referral was sent.']]},
    paralegal:{flow:[['Become eligible','Application evidence, independent checks, onboarding, ethics and safeguarding readiness.'],['Declare professional availability','Languages, specialisations, capacity and optional presence/location.'],['Review assignment offers','Accept or decline; access follows the permitted assignment.'],['Deliver support','Scoped messages, notes, tasks, files, appointments and referral proposals.'],['Close the loop','Record outcomes, follow training and request LSF support when needed.']],rows:[['Scope','Assigned/accessible cases; not the whole beneficiary database.'],['AI helps with','Own work metadata, case preparation, appointment drafts and authorised referral proposals.'],['Control','The worker accepts assignments; beneficiary consent still governs referrals.']]},
    provider_staff:{flow:[['Join a verified partner team','Invitation/membership and role scope.'],['Keep service information current','Permitted intake, availability and capacity updates.'],['Accept permitted case/referral work','Only through assigned or recipient-authorised records.'],['Deliver and record the service','Messages, appointments, documents, tasks and outcomes.']],rows:[['Organisation scope','Professional membership/affiliation and case access govern records.'],['AI helps with','My work, preparation and authorised referral drafts.'],['Boundary','Organisation membership does not grant unrestricted access to every person.']]},
    staff:{flow:[['Triage incoming help','Review facts, urgency and safe contact needs.'],['Open cases and review matches','Check suitability, capacity and recorded ranking reasons.'],['Offer assignments and manage delivery','Track acceptance, delays, appointments and referrals.'],['Verify and improve records','Provider/contact evidence, corrections, outcomes and quality follow-up.']],rows:[['AI helps with','Staff workload metadata, readiness/spending, preparation and authorised case/referral flows.'],['Human decisions','Triage, assignments, verification and consequential case decisions.'],['Safety','Escalate immediate-safety matters to protected workflows.']]},
    supervisor:{flow:[['Review workload and progress','Open cases, acceptance, delays and recorded outcomes.'],['Check suitability and quality','Review matching decisions, capacity and concerns.'],['Coordinate improvements','Reassignment, escalation or case review within authorised scope.'],['Review permitted reporting','Approved aggregate programme results.']],rows:[['AI helps with','Authorised workload, programme results and case-worker referral preparation.'],['Boundary','Supervision does not remove beneficiary consent or confidentiality requirements.']]},
    safeguarding_officer:{flow:[['Open protected safety queues','Use dedicated safeguarding access, not public map discovery.'],['Review risks and safe contact','Minimum necessary sensitive information.'],['Coordinate protected support','Controlled disclosure and accountable human decisions.'],['Record follow-up','Restricted decisions and audit trail.']],rows:[['AI scope','A safeguarding role alone does not unlock every staff-only AI tool.'],['Public visibility','Safe-house locations stay out of public/AI recommendation results.'],['Boundary','This is a human safeguarding workflow, not automatic emergency dispatch.']]},
    content_editor:{flow:[['Prepare bilingual content','Rights guides, source citations and learning material.'],['Edit own pending drafts','Keep source identity and version history clear.'],['Submit for independent review','Legal/language/source checks before public availability.'],['Maintain reviewed versions','Replace/retire outdated content through governed workflows.']],rows:[['AI knowledge','A content draft is not automatically searchable approved evidence.'],['Management','Images and content can be managed through backend/CMS workflows where supported.'],['Boundary','Publication/review is a human-controlled operation, not an AI tool action.']]},
    admin:{flow:[['Manage access and membership','Review role requests and permitted organisation/team access.'],['Govern directory and knowledge','Independent review, activation, withdrawal and corrections.'],['Watch AI operations','Readiness, cost estimates, activity, evaluations and risk queues.'],['Maintain platform delivery','Configuration, safe operations, reporting approval and release checks.']],rows:[['AI helps with','Aggregate readiness, spending, workload and permitted programme results.'],['Human control','Permissions, approvals, spending settings and maintenance controls live outside autonomous AI execution.'],['Audit','Important changes record responsible actors and reasons.']]},
    donor:{flow:[['Receive permitted reporting access','Authenticate into the donor/stakeholder workspace.'],['Read approved snapshots','Aggregated programme outputs and permitted performance measures.'],['Ask AI to explain those figures','programme_results uses approved scoped snapshots.']],rows:[['Can see','Approved, de-identified aggregate snapshots; small groups suppressed.'],['Cannot see','Individual beneficiary case stories, documents or unrestricted internal queues.']]},
    stakeholder:{flow:[['Receive permitted reporting access','Use the stakeholder workspace for approved programme information.'],['Review published aggregate results','Definitions, periods and privacy-safe values.'],['Ask AI to explain available results','Only within the actor’s permitted snapshots.']],rows:[['Can see','Approved programme snapshots and permitted public/platform content.'],['Cannot see','Unrestricted beneficiary records or private provider evidence.']]}
  };
  export const dataPaths: Record<string, {flow: string[][]; boundary: string}> = {
    law:{flow:[['Preserve the original source','Record provenance, hash and source identity separately from publication status.'],['Scan and extract','Purpose-bound clean upload; extract PDF text or prepare a separate searchable OCR copy.'],['Create chunks and embeddings','text-embedding-3-small → Convex vector records, linked to the source.'],['Review independently','Confirm metadata, legal applicability, amendments and extraction; OCR needs transcription review too.'],['Approve and maintain currency','Only approved/current sources and guides qualify for legal answers.'],['Retrieve selected evidence','Question embedding → similarity search → approved passages/citations → evidence-gated answer.']],boundary:'RAG means retrieving reviewed information at answer time. Indexing is not approval, and conversations do not automatically become public legal sources.'},
    private:{flow:[['Person selects a file or takes a photo','Permission and explicit AI-analysis consent where required.'],['Validate an owned upload','Type, size, purpose, quarantine and malware verdict.'],['Store privately with ownership','Case attachment or personal-document records; never the public legal library by default.'],['Create a limited AI description','PDF text or image input; reject unreadable/too-long material rather than invent content.'],['Person selects summary for chat','Only the already-consented owned description is supplied to the assistant.']],boundary:'A description is not legal approval, authentication, proof of admissibility or access to every page of every file. Scanned PDFs without readable text may need clear photos instead.'},
    voice:{flow:[['Record and consent','Bounded audio upload with owner/purpose checks.'],['Transcribe to words','OpenAI whisper-1; review/use the resulting text in the supported flow.'],['Process the question normally','Same language, access, evidence and cost rules as typed chat.'],['Save/show the chat answer','No separate spoken legal reasoning path.'],['Read aloud if requested','Owned completed answer → gpt-4o-mini-tts / coral; strip UI markers/URLs and preserve the reply language.']],boundary:'Audio/media processing is online and metered. Speech playback is a rendering of the answer, not a second independent agent.'},
    security:{flow:[['Identify the caller','Clerk session → account lookup → active server-side roles.'],['Check the requested record','Ownership, assignment, organisation or explicit recipient scope.'],['Minimise the payload','Selected metadata/context; safe-contact and disclosure rules.'],['Check gates before changing state','Freshness, independent reviewer, consent, capacity, confirmation and idempotency where applicable.'],['Record and expire','Audit/risk events, lifecycle status, retention/expiry and cleanup schedules.']],boundary:'These are implemented controls, not a claim of perfect security or legal compliance. Real-device, operational and production configuration reviews remain necessary.'}
  };

export const platformDetails = {
  "agentRules": [
    [
      "System prompt",
      "Identity, English/Kiswahili, evidence rules, privacy and action boundaries. An independently approved admin prompt can replace the default."
    ],
    [
      "Workflow skills",
      "Versioned instructions loaded with load_skill; not legal evidence or executable plug-ins."
    ],
    [
      "Tool loop",
      "At most 6 model rounds, 10 tool executions, 80 seconds and 12,000 tracked tokens per agent run."
    ],
    [
      "Role scope",
      "The server filters tools and rechecks permissions when executing them."
    ],
    [
      "Evidence gate",
      "Generation is enabled by legal evidence or authorised personal-summary context. Policy restricts legal claims to approved law; directory-only results use controlled responses."
    ],
    [
      "Confirmation",
      "AI prepares appointment/referral drafts. A separate review UI confirms them; the model cannot call the confirmation action."
    ],
    [
      "Architecture",
      "Custom OpenAI tool-calling loop. No MCP transport or autonomous subagent coordinator found in the active Saada path. Audio, embeddings and document briefs are helper model calls."
    ]
  ],
  "toolGroups": [
    [
      "Conversation",
      "conversation_reply · ask_clarification · app_help"
    ],
    [
      "Skills & legal knowledge",
      "load_skill · search_knowledge · find_guides"
    ],
    [
      "Support directory",
      "find_services · find_paralegals · find_information_resources"
    ],
    [
      "My case information",
      "my_requests · my_cases · my_appointments · my_documents"
    ],
    [
      "My saved documents",
      "my_saved_documents · read_my_document_summary"
    ],
    [
      "Prepare requests",
      "prepare_help_draft · prepare_appointment_request"
    ],
    [
      "Referrals",
      "referral_destinations · prepare_referral"
    ],
    [
      "Team work",
      "my_work · staff_workload"
    ],
    [
      "Governance & results",
      "knowledge_readiness · ai_spending · programme_results"
    ]
  ],
  "skills": [
    "Rights and justice pathways",
    "Finding support",
    "Preparing a help request",
    "Evidence checklists",
    "Case follow-up",
    "Appointment preparation",
    "Document preparation",
    "Human handoff"
  ],
  "organisationDetails": [
    {
      "title": "What an organisation or service record needs",
      "rows": [
        [
          "Organisation",
          "Identity, registration evidence, responsible staff, verification status, safeguarding readiness and referral/data-sharing agreement status."
        ],
        [
          "Service point",
          "Region, district, ward, safe public address, contacts, service types, issues served, coverage, eligibility, languages, hours, accessibility, fees and intake/capacity."
        ],
        [
          "Location",
          "Coordinates are optional. A map pin is not proof of contact accuracy, availability or a confirmed meeting."
        ],
        [
          "Lifecycle",
          "Research lead → inactive draft → independent verification → activation → periodic review. Material edits require review again."
        ],
        [
          "Restricted support",
          "Safe houses and confidential locations are excluded from public directory and AI recommendation results."
        ]
      ]
    }
  ],
  "securityDetails": [
    {
      "title": "Additional controls across the platform",
      "rows": [
        [
          "Identity & roles",
          "Clerk session tokens identify the user. Convex checks active roles, record ownership, assignments and organisation scope on the server."
        ],
        [
          "File handling",
          "Purpose-bound upload tickets, size/type/hash checks, quarantine and private malware scanning precede acceptance. A scanner refusal stays excluded."
        ],
        [
          "AI boundaries",
          "Retrieved text and document content are untrusted data. The server validates tool names/arguments and adds verified result cards."
        ],
        [
          "Human decisions",
          "Source, guide, directory, training and reporting approval workflows record reviewers and reasons. Independent-review requirements vary by record."
        ],
        [
          "Location privacy",
          "Optional short-lived worker location; office fallback where eligible. Shared presence means foreground/recent activity, not willingness to take a case."
        ],
        [
          "Contact safety",
          "Contact preferences, generic push notifications and consent-controlled disclosure; protected support routes avoid public shelter addresses."
        ],
        [
          "Reporting privacy",
          "Approved aggregate snapshots; small nonzero groups below 5 and sensitive derived percentages are suppressed."
        ],
        [
          "Cost protection",
          "Server-held API key, request limits, metered reservations, bounded model/tool calls and an enforcing application allowance. Estimates are not the OpenAI invoice."
        ],
        [
          "Operations",
          "Audit/risk logs, evaluation review, maintenance switch, expiring drafts/locations, quarantine cleanup and appointment-reminder schedules."
        ],
        [
          "Analytics",
          "Public page and service-journey events are separate from private case/audit records. Private workspace paths are excluded from the Layout page-view tracker."
        ],
        [
          "Offline",
          "Some mobile drafts/actions and preparation checklists remain on-device. Users reconnect, review and retry; there is no unrestricted offline AI or automatic legal filing."
        ],
        [
          "External processing",
          "Selected chat context/passages go to OpenAI; consented file/audio flows send their relevant payload. Provider retention settings were not audited here."
        ]
      ]
    }
  ],
  "engineeringDetails": [
    {
      "title": "Interfaces and product experience",
      "rows": [
        [
          "React 18 · TypeScript · Vite",
          "Website, web workspaces and compiled browser application; React Router handles routes."
        ],
        [
          "Tailwind · shadcn/Radix",
          "Web layouts, forms, dialogs and accessible controls."
        ],
        [
          "Expo SDK 57 · React Native 0.86 · Expo Router",
          "iOS/Android interfaces and shared mobile navigation; mobile uses React 19."
        ],
        [
          "SecureStore · AsyncStorage",
          "Selected on-device secrets/drafts and saved app state; storage choice depends on the feature."
        ],
        [
          "Expo Audio · Camera/Image Picker · Document Picker",
          "Record inquiries, photograph pages and choose attachments with user permission."
        ],
        [
          "Mapbox",
          "Public service maps; list/directions fallback when maps or tokens are unavailable."
        ],
        [
          "Lucide · Framer Motion · Recharts",
          "Web icons, UI movement and reporting charts."
        ]
      ]
    },
    {
      "title": "Identity, backend and AI",
      "rows": [
        [
          "Clerk",
          "Authentication/session identity on web and mobile. Product permissions live in server-side platform records."
        ],
        [
          "Convex",
          "Database, indexed/vector search, reactive queries, transactional mutations, server actions, file storage and scheduled jobs."
        ],
        [
          "OpenAI SDK",
          "Server-side chat/tool calling, embedding, transcription, speech and document-description requests."
        ],
        [
          "Chat model",
          "Server configurable with SAADA_CHAT_MODEL; code default gpt-4o. Effective deployed override not inspected."
        ],
        [
          "text-embedding-3-small",
          "Legal-text and question embeddings used for similarity retrieval."
        ],
        [
          "whisper-1",
          "Consented recording transcription before normal chat/intake review."
        ],
        [
          "gpt-4o-mini-tts · coral",
          "Read an owned, completed answer aloud; no separate legal answer generation."
        ],
        [
          "Document brief model",
          "Configurable; code default gpt-4o-mini. Describe readable PDF text or clear document photos."
        ],
        [
          "PDF.js · prepared OCR",
          "PDF text extraction. Scanned research PDFs can have separately prepared, independently reviewed searchable copies."
        ],
        [
          "Private ClamAV scanner",
          "Quarantined-file malware inspection before purpose-bound uploads are accepted."
        ]
      ]
    },
    {
      "title": "Delivery, monitoring and release",
      "rows": [
        [
          "Expo Push",
          "Opt-in mobile notifications, delivery tickets and receipt checks."
        ],
        [
          "Resend",
          "Server-side email integration; sender/domain and credentials require configuration."
        ],
        [
          "Sentry",
          "Web error/performance monitoring configured for production builds; separate from business/audit logs."
        ],
        [
          "Vercel",
          "SPA deployment configuration and the isolated scanner hosting used in development."
        ],
        [
          "Expo EAS · Gradle",
          "Mobile project/build configuration and Android APK generation. A successful internal build is not a store release."
        ],
        [
          "Node test runner · TypeScript · security checks",
          "Handler/contract tests, type checks, access-control classification and build verification."
        ],
        [
          "Git · npm",
          "Source history, dependencies and repeatable build/test scripts. No repository CI workflow was found in this inspection."
        ]
      ]
    },
    {
      "title": "Legacy and separate paths",
      "rows": [
        [
          "n8n chatbot",
          "/lsfchatbot still points to a separate chatbot component and Convex webhook proxy. It is not the normal /sara Saada loop; its live configuration/governance was not validated."
        ],
        [
          "Supabase",
          "A package/legacy references remain; the inspected Haki Yangu operational data path uses Convex."
        ],
        [
          "MCP / subagents",
          "Not wired into the active Saada implementation inspected here. Ordinary server tools are not automatically MCP tools."
        ]
      ]
    }
  ],
  "lifecycle": [
    [
      "Person submits a help request",
      "Issue, location, necessary facts and a safe contact preference"
    ],
    [
      "LSF triages and opens a case",
      "Priority, ownership and safeguarding review"
    ],
    [
      "A suitable worker receives an offer",
      "Eligibility and capacity checked; the worker accepts or declines"
    ],
    [
      "The team delivers and records support",
      "Messages, tasks, documents, appointments and consented referrals"
    ],
    [
      "Outcome, feedback and review",
      "Resolution is recorded, not promised; review/reassignment routes remain available"
    ],
    [
      "Approved aggregate reporting",
      "Donors see permitted snapshots, not beneficiary case stories"
    ]
  ]
};
