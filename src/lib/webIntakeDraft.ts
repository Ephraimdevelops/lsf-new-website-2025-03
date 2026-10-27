export type Issue = 'employment' | 'land' | 'family' | 'safety' | 'consumer' | 'other';
export type Urgency = 'standard' | 'urgent' | 'immediate_safety';
export type Contact = 'in_app' | 'phone' | 'sms' | 'email' | 'none';
export type WebIntakeDraft = { id: string; story: string; issue: Issue; region: string; district: string; desiredHelp: string; urgency: Urgency; contact: Contact; locale: 'sw' | 'en'; sourceServiceId?: string };
export const issues: Issue[] = ['employment', 'land', 'family', 'safety', 'consumer', 'other'];
export function webDraftKey(owner: string | null) { return `haki_yangu_web_intake_v2_${owner === null ? 'guest' : `user_${encodeURIComponent(owner)}`}`; }
export function newWebDraft(params: URLSearchParams): WebIntakeDraft {
  const requested = params.get('issue');
  return { id: `web-${crypto.randomUUID()}`, story: '', issue: issues.includes(requested as Issue) ? requested as Issue : 'other', region: params.get('region') ?? '', district: params.get('district') ?? '', desiredHelp: '', urgency: 'standard', contact: 'in_app', locale: 'sw', sourceServiceId: params.get('serviceId') ?? undefined };
}
export function decodeWebDraft(raw: string, owner: string | null): WebIntakeDraft {
  const envelope = JSON.parse(raw);
  if (!envelope || envelope.owner !== owner || !envelope.draft || typeof envelope.draft !== 'object') throw new Error('Draft belongs to another session');
  const d = envelope.draft;
  for (const [key, max] of Object.entries({ id: 100, story: 5000, region: 100, district: 100, desiredHelp: 1000 })) if (typeof d[key] !== 'string' || d[key].length > max) throw new Error('Unreadable draft');
  if (!d.id.trim() || !issues.includes(d.issue) || !['standard','urgent','immediate_safety'].includes(d.urgency) || !['in_app','phone','sms','email','none'].includes(d.contact) || !['sw','en'].includes(d.locale)) throw new Error('Unreadable draft');
  if (d.sourceServiceId !== undefined && (typeof d.sourceServiceId !== 'string' || d.sourceServiceId.length > 100)) throw new Error('Unreadable service');
  return { id: d.id, story: d.story, issue: d.issue, region: d.region, district: d.district, desiredHelp: d.desiredHelp, urgency: d.urgency, contact: d.contact, locale: d.locale, sourceServiceId: d.sourceServiceId };
}
export function webDraftReady(draft: WebIntakeDraft) { return draft.story.trim().length >= 10 && !!draft.region.trim() && !!draft.district.trim() && draft.desiredHelp.trim().length >= 3; }
