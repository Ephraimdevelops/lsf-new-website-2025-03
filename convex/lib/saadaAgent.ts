import { CLARIFICATION_FIELDS } from "./saadaAssistance";
import { SAADA_SKILLS } from "./saadaSkills";

const text = { type: "string", minLength: 1, maxLength: 200 };
const jurisdiction = {
  type: "string",
  enum: ["national", "tanzania_mainland", "zanzibar"],
};
const definitions = {
  prepare_appointment_request: {description:"Prepare a review card for an appointment REQUEST on an accessible open case, after the person asks. Get the exact reference from my_cases; clarify missing mode/time. The person must tap Confirm. This does not book or send anything.",properties:{caseReference:text,preferredMode:{type:"string",enum:["phone","remote","in_person"]},preferredTime:text,note:text},required:["caseReference","preferredMode"]},
  referral_destinations: {description:"For authorised case workers: list current public referral services by district or service name, or their recipient providers when serviceId is supplied. Use the exact accessible case reference and returned service/provider IDs. Excludes safe houses and inactive agreements. Does not send anything.",properties:{caseReference:text,serviceId:text,district:text,search:text},required:["caseReference"]},
  prepare_referral: {description:"For authorised case workers: prepare a minimum-information referral proposal for review, using exact IDs returned by referral_destinations. Clarify the destination, recipient, reason and allowed information with the worker. The worker must confirm; beneficiary consent is still required before any provider receives details. Never claim it is sent or consented.",properties:{caseReference:text,destinationServiceId:text,destinationUserId:text,reason:text,information:{type:"string",minLength:10,maxLength:160}},required:["caseReference","destinationServiceId","destinationUserId","reason","information"]},
  my_work: { description: "Read the signed-in paralegal or provider worker's open task and assignment-offer metadata when asked. Cannot accept offers or edit tasks.", properties: {}, required: [] },
  staff_workload: { description: "Read authorised staff/supervisor case queue counts and selected case status metadata, when requested. No beneficiary stories or contact details.", properties: {}, required: [] },
  knowledge_readiness: { description: "Read source/guide/directory readiness aggregate counts for an authorised administrator or staff member. Does not approve anything.", properties: {}, required: [] },
  ai_spending: { description: "Read application AI allowance and estimated spending for authorised administrators/staff. Not the provider invoice; cannot change the limit.", properties: {}, required: [] },
  programme_results: { description: "Read approved programme reporting snapshots allowed to this staff, supervisor, donor or stakeholder. Suppressed small groups remain hidden. No beneficiary records.", properties: {}, required: [] },
  my_saved_documents: { description: "List the authenticated person's own saved document names and whether a previously consented AI summary exists. Only when asked about saved documents.", properties: {}, required: [] },
  read_my_document_summary: { description: "Read a previously consented AI description of the person's own saved document by id from my_saved_documents. It is not original document text or legal evidence. Cannot analyse a new file or someone else's file.", properties: { id: text }, required: ["id"] },
  conversation_reply: { description: "Respond to a greeting, identity/name question, thanks, a question about your abilities, or a request to recall this conversation, including misspellings and informal English/Kiswahili. Select the person's intent; the server supplies truthful conversational wording. Not for legal advice or service matching.", properties: { kind: { type: "string", enum: ["identity", "greeting", "thanks", "capabilities", "recall", "availability"] } }, required: ["kind"] },
  ask_clarification: { description: "Ask a safe structured clarification when jurisdiction, location, issue, dates or desired help is missing. No legal evidence is required to ask a question.", properties: { field: { type: "string", enum: CLARIFICATION_FIELDS } }, required: ["field"] },
  find_information_resources: { description: "Find publisher-owned public support information links and published office contacts. This is not verified intake, an individual paralegal match, or a referral.", properties: { issueCategory: text, district: text, search: text }, required: [] },
  load_skill: {
    description:
      "Load a versioned procedural workflow. This is not legal evidence.",
    properties: { skill: { type: "string", enum: Object.keys(SAADA_SKILLS) } },
    required: ["skill"],
  },
  search_knowledge: {
    description:
      "Search current independently approved legal source passages; use for legal claims and citations.",
    properties: { search: text },
    required: ["search"],
  },
  find_guides: {
    description:
      "Search current independently approved bilingual rights and justice-pathway guides.",
    properties: { search: text, jurisdiction },
    required: ["search"],
  },
  find_services: {
    description:
      "Search verified public services with current intake. Never confidential safe-house locations.",
    properties: {
      search: text,
      issueCategory: {
        type: "string",
        enum: ["employment", "land", "family", "safety", "consumer", "other"],
      },
      region: text,
      district: text,
    },
    required: [],
  },
  find_paralegals: {
    description:
      "Find eligible public paralegals by region OR district. A district alone is enough to search; do not invent a region or silently substitute a district.",
    properties: { region: text, district: text },
    required: [],
  },
  my_requests: {
    description:
      "Read selected status metadata for the authenticated person's own help requests, only when they ask.",
    properties: {},
    required: [],
  },
  my_cases: {
    description:
      "Read selected status metadata for the authenticated person's accessible cases, only when asked.",
    properties: {},
    required: [],
  },
  my_appointments: {
    description:
      "Read selected appointment metadata for the authenticated person's personal cases, only when asked. Cannot book/cancel.",
    properties: {},
    required: [],
  },
  my_documents: {
    description:
      "Read document names/categories/review status in the person's personal cases, only when asked. Does not read file contents.",
    properties: {},
    required: [],
  },
  prepare_help_draft: {
    description:
      "Prepare an unsaved help-request worksheet from the current user's own words, with missing fields left blank. Does not submit or share anything.",
    properties: {},
    required: [],
  },
  app_help: {
    description:
      "Explain the app's supported help, case, appointment and document flows without making legal claims.",
    properties: {},
    required: [],
  },
} as const;
export type SaadaToolName = keyof typeof definitions;
export const SAADA_TOOLS = Object.entries(definitions).map(([name, spec]) => ({
  type: "function" as const,
  function: {
    name,
    description: spec.description,
    parameters: {
      type: "object",
      properties: spec.properties,
      required: spec.required,
      additionalProperties: false,
    },
  },
}));

export function validateSaadaTool(
  name: string,
  raw: string,
): { name: SaadaToolName; args: Record<string, string> } {
  if (
    !Object.prototype.hasOwnProperty.call(definitions, name) ||
    raw.length > 4096
  )
    throw new Error("Unsupported tool or argument size.");
  const args = JSON.parse(raw);
  if (!args || typeof args !== "object" || Array.isArray(args))
    throw new Error("Expected an argument object.");
  const spec = definitions[name as SaadaToolName];
  for (const key of Object.keys(args)) {
    const property = (
      spec.properties as Record<string, { enum?: readonly string[] }>
    )[key];
    if (
      !Object.prototype.hasOwnProperty.call(spec.properties, key) ||
      !property ||
      typeof args[key] !== "string" ||
      !args[key].trim() ||
      args[key].length > 200 ||
      (property.enum && !property.enum.includes(args[key]))
    )
      throw new Error("Invalid tool arguments.");
    args[key] = args[key].trim();
  }
  if (
    spec.required.some(
      (key) => !Object.prototype.hasOwnProperty.call(args, key),
    )
  )
    throw new Error("Missing required tool arguments.");
  return { name: name as SaadaToolName, args };
}

export type AgentToolResult = {
  content: string;
  evidence: "legal" | "directory" | "personal" | "none";
  fallback?: string;
  clarification?: boolean;
};
type Call = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};
type Chunk = {
  choices: Array<{
    delta?: {
      content?: string | null;
      tool_calls?: Array<{
        index: number;
        id?: string;
        function?: { name?: string; arguments?: string };
      }>;
    };
    finish_reason?: string | null;
  }>;
  usage?: { total_tokens?: number } | null;
};

// Dependency-injected runtime: tested without network or a real user identity.
export async function runSaadaAgent(options: {
  messages: any[];
  create: (
    messages: any[],
    toolsAllowed: boolean,
    remainingMs: number,
  ) => Promise<AsyncIterable<Chunk>>;
  onToolError?: (name: string) => Promise<void>;
  execute: (
    name: SaadaToolName,
    args: Record<string, string>,
  ) => Promise<AgentToolResult>;
  hasLegalEvidence: () => boolean;
  hasPersonalEvidence?: () => boolean;
  noEvidence: string;
  now?: () => number;
}) {
  const now = options.now ?? Date.now;
  const deadline = now() + 80_000;
  const cache = new Map<string, AgentToolResult>();
  const results: AgentToolResult[] = [];
  const toolsUsed: string[] = [];
  let tokens = 0,
    executed = 0,
    content = "",
    exhausted = false;
  for (let round = 0; round < 6; round++) {
    if (now() >= deadline || tokens >= 12_000) {
      exhausted = true;
      break;
    }
    const toolsAllowed = round < 5 && executed < 10;
    const calls = new Map<number, Call>();
    let draft = "",
      finish: string | null | undefined;
    const stream = await options.create(
      options.messages,
      toolsAllowed,
      deadline - now(),
    );
    for await (const chunk of stream) {
      if (now() >= deadline) {
        exhausted = true;
        break;
      }
      tokens += chunk.usage?.total_tokens ?? 0;
      const choice = chunk.choices[0];
      finish = choice?.finish_reason ?? finish;
      draft += choice?.delta?.content ?? "";
      if (draft.length > 24_000)
        throw new Error("Agent response limit exceeded.");
      for (const delta of choice?.delta?.tool_calls ?? []) {
        if (
          !Number.isInteger(delta.index) ||
          delta.index < 0 ||
          delta.index > 9
        )
          throw new Error("Invalid tool index.");
        const call = calls.get(delta.index) ?? {
          id: "",
          type: "function",
          function: { name: "", arguments: "" },
        };
        if (delta.id) call.id = delta.id;
        call.function.name += delta.function?.name ?? "";
        call.function.arguments += delta.function?.arguments ?? "";
        if (
          call.function.arguments.length > 4096 ||
          call.function.name.length > 80 ||
          call.id.length > 200
        )
          throw new Error("Tool payload limit exceeded.");
        calls.set(delta.index, call);
      }
    }
    if (exhausted) break;
    if (!calls.size) {
      if (finish === "stop") content = draft;
      else exhausted = true; // Never publish truncated or filtered model output.
      break;
    }
    if (finish !== "tool_calls") {
      exhausted = true;
      break;
    }
    const batch = [...calls.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, call]) => call);
    if (
      !toolsAllowed ||
      batch.some((call) => !call.id) ||
      new Set(batch.map((call) => call.id)).size !== batch.length
    )
      throw new Error("Invalid tool-call envelope.");
    options.messages.push({
      role: "assistant",
      content: null,
      tool_calls: batch,
    });
    for (const call of batch) {
      let result: AgentToolResult;
      try {
        if (executed >= 10 || now() >= deadline || tokens >= 12_000)
          throw new Error("Tool budget reached.");
        const validated = validateSaadaTool(
          call.function.name,
          call.function.arguments,
        );
        const key = JSON.stringify([
          validated.name,
          Object.entries(validated.args).sort(([a], [b]) => a.localeCompare(b)),
        ]);
        // Count attempts as well as successful calls; repeated calls cannot extend the loop.
        executed++;
        result =
          cache.get(key) ??
          (await options.execute(validated.name, validated.args));
        cache.set(key, result);
        toolsUsed.push(validated.name);
        results.push(result);
      } catch {
        await options.onToolError?.(call.function.name);
        result = {
          content:
            "Tool unavailable or arguments rejected. Do not infer a result or claim success. Ask for corrected details or use the existing app flow.",
          evidence: "none",
        };
      }
      options.messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify({
          untrustedData: result.content.slice(0, 16_000),
          evidenceType: result.evidence,
        }),
      });
    }
  }
  // Directory/skill-only responses are deterministic: they cannot authorize invented legal advice.
  const canGenerate =
    options.hasLegalEvidence() || options.hasPersonalEvidence?.() ||
    results.some(
      (result) => result.evidence === "legal" || result.evidence === "personal",
    );
  const question = results.filter(result => result.clarification && result.fallback).slice(-1)[0]?.fallback;
  if (question) content = question;
  else if (!canGenerate || !content.trim() || exhausted)
    content =
      [
        ...new Set(results.map((result) => result.fallback).filter(Boolean)),
      ].join("\n\n") || options.noEvidence;
  return { content, tokens, toolsUsed: [...new Set(toolsUsed)], exhausted };
}

const toolRoles: Partial<Record<SaadaToolName, readonly string[]>> = {
 referral_destinations:["admin","staff","supervisor","paralegal","provider_staff"],prepare_referral:["admin","staff","supervisor","paralegal","provider_staff"],
 my_work:["paralegal","provider_staff"],staff_workload:["admin","staff","supervisor"],knowledge_readiness:["admin","staff"],ai_spending:["admin","staff"],programme_results:["admin","staff","supervisor","stakeholder","donor"],
};
export function canUseSaadaTool(name: SaadaToolName, roles: readonly string[]) { return !toolRoles[name] || roles.some(role => toolRoles[name]!.includes(role)); }
export function saadaToolsForRoles(roles: readonly string[]) { return SAADA_TOOLS.filter(tool => canUseSaadaTool(tool.function.name as SaadaToolName,roles)); }
