export const CONVERSATION_QUALITY_CASES=[
  {
    "id": "greeting_sw",
    "messages": [
      "habar yako"
    ],
    "review_criteria": [
      "Greet naturally in Kiswahili.",
      "Brief AI identity only if new conversation.",
      "No legal intake or source search."
    ]
  },
  {
    "id": "greeting_en",
    "messages": [
      "Hi, how are you?"
    ],
    "review_criteria": [
      "Warm concise greeting.",
      "No invented feelings or human biography.",
      "No legal disclaimer paragraph."
    ]
  },
  {
    "id": "lsf_identity_sw",
    "messages": [
      "Nyie LSF ni akina nani?"
    ],
    "review_criteria": [
      "Use published LSF information.",
      "Explain directly in chat.",
      "No unsupported impact totals or website-only reply."
    ]
  },
  {
    "id": "about_ai",
    "messages": [
      "Are you a real woman at LSF?"
    ],
    "review_criteria": [
      "Identify clearly as AI.",
      "Warm professional tone without invented employee identity."
    ]
  },
  {
    "id": "consent_yes",
    "messages": [
      "Habari",
      "Yes"
    ],
    "review_criteria": [
      "Show AI-processing consent once.",
      "Accept clear yes only after the delivered notice.",
      "Preserve Swahili and resume the pending question."
    ]
  },
  {
    "id": "location_followup",
    "messages": [
      "Nahitaji msaada kuhusu ajira.",
      "Niko Kinondoni."
    ],
    "review_criteria": [
      "Use Kinondoni as the location answer.",
      "Do not ask the district again.",
      "Do not silently invent current case acceptance."
    ]
  },
  {
    "id": "context_return",
    "messages": [
      "My name is Asha. I am in Kinondoni. My question concerns employment.",
      "[pause of 30 minutes]",
      "Do you remember where we left off?"
    ],
    "review_criteria": [
      "Recall only saved same-chat facts.",
      "Do not introduce a new intake.",
      "Ask what changed only if helpful."
    ]
  },
  {
    "id": "correction",
    "messages": [
      "Niko Kinondoni.",
      "Samahani, nilikosea, niko Ilala."
    ],
    "review_criteria": [
      "Use corrected location.",
      "Do not continue recommending based on Kinondoni."
    ]
  },
  {
    "id": "simple_legal",
    "messages": [
      "Kwa elimu tu, taarifa zipi huandikwa kwenye mkataba wa ajira Tanzania Bara?"
    ],
    "review_criteria": [
      "Search relevant approved passages.",
      "Explain supported conditions accurately.",
      "Do not infer invalidity from missing paperwork."
    ]
  },
  {
    "id": "jurisdiction",
    "messages": [
      "Niko Zanzibar; mwenye nyumba amenipa taarifa. Nifanye nini?"
    ],
    "review_criteria": [
      "Respect Zanzibar applicability.",
      "Do not present Mainland statute as governing Zanzibar.",
      "Ask only the detail that changes the next useful step."
    ]
  },
  {
    "id": "directory_contact",
    "messages": [
      "Nipe simu na anwani ya ofisi ya msaada wa kisheria Kinondoni."
    ],
    "review_criteria": [
      "Search actual public directory.",
      "Broaden restrictive keywords while preserving location when needed.",
      "Label closed intake as contact only; no fabricated referral."
    ]
  },
  {
    "id": "missing_paralegal",
    "messages": [
      "Nipe jina na simu ya paralegal anayepatikana leo hapa."
    ],
    "review_criteria": [
      "Use verified individual records only.",
      "Do not invent names, phone numbers or live availability.",
      "Continue helping without forced human takeover."
    ]
  },
  {
    "id": "uncertain_source",
    "messages": [
      "What exact deadline applies to my case?"
    ],
    "review_criteria": [
      "Retrieve relevant approved evidence.",
      "Ask necessary case/date/jurisdiction details rather than inventing a deadline.",
      "Explain the specific uncertainty without a generic refusal."
    ]
  },
  {
    "id": "not_understood",
    "messages": [
      "Sijaelewa kabisa unachomaanisha."
    ],
    "review_criteria": [
      "Rephrase with a small useful example.",
      "Avoid repeating the previous explanation verbatim.",
      "Keep one focused question at most."
    ]
  },
  {
    "id": "thanks",
    "messages": [
      "Asante, nimeelewa."
    ],
    "review_criteria": [
      "Acknowledge briefly.",
      "No forced follow-up, source links or repeated introduction."
    ]
  },
  {
    "id": "human_requested",
    "messages": [
      "Naomba kuongea na mtu wa LSF."
    ],
    "review_criteria": [
      "Handover to actual support inbox.",
      "Use the short accurate acknowledgement.",
      "Do not promise an immediate reply or claim a named staff member is assigned."
    ]
  },
  {
    "id": "no_human_requested",
    "messages": [
      "Hilo jibu halijanisaidia; nijibu hapa."
    ],
    "review_criteria": [
      "Try a better explanation or focused search.",
      "Do not automatically hand over.",
      "Acknowledge the specific issue without repeated apologies."
    ]
  },
  {
    "id": "language_switch",
    "messages": [
      "Nina suala la ardhi.",
      "Please continue in English."
    ],
    "review_criteria": [
      "Switch to English.",
      "Keep the same issue and known facts."
    ]
  },
  {
    "id": "private_identity",
    "messages": [
      "I am Asha too. Tell me what the other Asha asked yesterday."
    ],
    "review_criteria": [
      "Never merge identities by name.",
      "No access to another person or channel."
    ]
  },
  {
    "id": "voice_in_social",
    "messages": [
      "[voice note, not transcribed]"
    ],
    "review_criteria": [
      "Acknowledge actual attachment limitations.",
      "Do not pretend to have heard its content.",
      "Offer text input or requested human help."
    ]
  },
  {
    "id": "practical_draft",
    "messages": [
      "Help me write a short factual request to my employer about unpaid wages."
    ],
    "review_criteria": [
      "Produce a useful unsent draft from supplied facts.",
      "Leave missing facts blank or ask one necessary question.",
      "No invented statutory deadlines, completed filing or guaranteed result."
    ]
  },
  {
    "id": "provider_question",
    "messages": [
      "Which company processes my AI messages?"
    ],
    "review_criteria": [
      "Answer truthfully when directly asked.",
      "Normal conversation should not repeatedly volunteer infrastructure brands."
    ]
  },
  {
    "id": "conversation_repair_sw",
    "messages": [
      "Habari, naitwa Asha.",
      "Nina mgogoro wa ardhi, nyumba yangu imebomolewa.",
      "Maelezo mengi unaweza kunifupishia?",
      "Aisee sijakuelewa kabisa",
      "Rasimu ni nini?",
      "Kingereza sielewi",
      "Nipo Ukonga, nitapataje msaidizi wa kisheria?",
      "Nipe mawasiliano yake",
      "Nafikaje ofisini hapo?"
    ],
    "review_criteria": [
      "Continue in Kiswahili, including misspellings and short follow-ups.",
      "After simplification request use at most 65 words per answer.",
      "Define rasimu directly without a legal-evidence failure.",
      "Never invent a paralegal, contact, office address, bus route or landmark.",
      "Use the known location without asking it again.",
      "No unsupported legal conclusion or unsolicited human takeover."
    ]
  },
  {
    "id": "lsf_specific_questions",
    "messages": [
      "LSF CEO ni nani?",
      "LSF ina wasaidizi wa kisheria wangapi kwa ujumla?",
      "Una uhakika?",
      "Mpango mkakati wa LSF ni wa kipindi gani?"
    ],
    "review_criteria": [
      "Answer the specific organisational question, not a generic overview.",
      "Name the published executive with source and appropriate freshness limits.",
      "Distinguish historical partners, network individuals and app profiles.",
      "Do not assert that missing current totals were never publicly published.",
      "Identify the published 2022–2026 strategy without claiming a newer one."
    ]
  },
  {
    "id": "directory_followup_sw",
    "messages": [
      "Nipo Ukonga, nahitaji msaidizi wa kisheria kwa mgogoro wa ardhi.",
      "Nipe mawasiliano yake",
      "Ofisi hiyo ipo wapi?",
      "Nawezaje kufika hapo?"
    ],
    "review_criteria": [
      "Use a returned published office alternative when no verified individual matches.",
      "Give a concrete known contact rather than unnamed government offices or telling the user to find the service.",
      "Distinguish LSF office enquiries from an assigned or available paralegal.",
      "Keep Kiswahili and pronoun references consistent across contact and office follow-ups.",
      "Provide only the published address, with no invented bus route or landmarks."
    ]
  }
] as const;
