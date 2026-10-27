import type { IntakeDraft } from "./IntakeDraftContext";

export function draftStorageKey(owner: string | null): string {
  if (owner === null) return "haki_yangu_intake_v2_guest";
  if (!owner) throw new Error("Missing draft owner");
  // Hex encoding keeps arbitrary identity characters legal for SecureStore,
  // without collisions between identity strings or the anonymous namespace.
  return "haki_yangu_intake_v2_user_" + Array.from(owner).map(char => char.codePointAt(0)!.toString(16)).join("_");
}

export function decodeDraft(value: string): IntakeDraft {
  let data: unknown;
  try { data = JSON.parse(value); } catch { throw new Error("Saved draft is unreadable. Start a new request."); }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid saved draft");
  const row = data as Record<string, unknown>;
  const text = (key: string, max: number) => {
    if (typeof row[key] !== "string" || (row[key] as string).length > max) throw new Error("Invalid saved draft field: " + key);
    return row[key] as string;
  };
  const choice = <T extends string>(key: string, options: readonly T[]): T => {
    if (!options.includes(row[key] as T)) throw new Error("Invalid saved draft field: " + key);
    return row[key] as T;
  };
  const clientRequestId = text("clientRequestId", 100);
  if (!clientRequestId.trim()) throw new Error("Invalid saved draft identity");
  if (typeof row.hasDocuments !== "boolean") throw new Error("Invalid saved draft documents flag");
  const issueCategory = row.issueCategory === undefined ? undefined : choice("issueCategory", ["employment", "land", "family", "safety", "consumer", "other"] as const);
  const sourceServiceId = row.sourceServiceId === undefined ? undefined : text("sourceServiceId", 100);
  const extra: Partial<IntakeDraft> = {};
  if (row.issueDetail !== undefined) extra.issueDetail = text("issueDetail", 100);
  if (row.helpGoal !== undefined) extra.helpGoal = choice("helpGoal", ["rights", "professional", "claim", "safety", "guidance"] as const);
  if (row.evidence !== undefined) {
    if (!Array.isArray(row.evidence) || row.evidence.length > 10) throw new Error("Invalid saved attachments");
    extra.evidence = row.evidence.map(file => {
      if (!file || typeof file !== "object") throw new Error("Invalid saved attachment");
      const item = file as Record<string, unknown>;
      if (typeof item.uri !== "string" || item.uri.length > 2000 || !/^(file:|blob:|content:)/.test(item.uri) || typeof item.name !== "string" || item.name.length > 180 || typeof item.mimeType !== "string" || item.mimeType.length > 120 || typeof item.size !== "number" || !Number.isFinite(item.size) || item.size <= 0 || item.size > 10 * 1024 * 1024) throw new Error("Invalid saved attachment");
      const receipt: Record<string, string> = {};
      for (const key of ["storageId", "attachmentId", "requestId"]) if (item[key] !== undefined) {
        if (typeof item[key] !== "string" || (item[key] as string).length > 100) throw new Error("Invalid upload receipt");
        receipt[key] = item[key] as string;
      }
      return { uri: item.uri, name: item.name, mimeType: item.mimeType, size: item.size, ...receipt };
    });
  }
  return {
    ...extra,
    clientRequestId, locale: choice("locale", ["sw", "en"] as const),
    description: text("description", 5000), issueCategory, sourceServiceId,
    region: text("region", 100), district: text("district", 100), occurredOn: text("occurredOn", 10),
    involvedParties: text("involvedParties", 1000), desiredHelp: text("desiredHelp", 1000),
    safeContactMethod: choice("safeContactMethod", ["in_app", "phone", "sms", "email", "none"] as const),
    preferredLanguage: choice("preferredLanguage", ["sw", "en", "both", "other"] as const),
    preferredLanguageOther: text("preferredLanguageOther", 80),
    urgency: choice("urgency", ["standard", "urgent", "immediate_safety"] as const), hasDocuments: row.hasDocuments,
  };
}

type DraftStore = {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
};

export async function transferGuestDraft(owner: string, clientRequestId: string, store: DraftStore): Promise<IntakeDraft | null> {
  const target = draftStorageKey(owner);
  const guest = draftStorageKey(null);
  const value = await store.read(guest);
  if (!value) return null;
  const transferred = { ...decodeDraft(value), clientRequestId };
  // Copy before removing. Failure leaves recoverable text, and the caller must
  // not expose the transferred form until the anonymous copy is gone.
  await store.write(target, JSON.stringify(transferred));
  await store.remove(guest);
  return transferred;
}
