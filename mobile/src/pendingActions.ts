import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";
import { useUser } from "./auth";
import { draftStorageKey } from "./intake/draftStorage";

const MAX_PENDING_ACTIONS = 25;
const writes = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<() => void>>();
function changed(owner: string) { for (const listener of listeners.get(owner) ?? []) listener(); }
export function subscribePendingActions(owner: string, listener: () => void) {
  const group = listeners.get(owner) ?? new Set<() => void>(); group.add(listener); listeners.set(owner, group);
  return () => { group.delete(listener); if (!group.size) listeners.delete(owner); };
}

export function pendingActionKey(owner: string) {
  return draftStorageKey(owner).replace("haki_yangu_intake_v2_", "haki_yangu_pending_v2_");
}

type PendingActionBase = {
  id: string;
  clientActionId?: string;
  caseId: Id<"cases">;
  createdAt: number;
  attempts: number;
  lastError?: string;
};

export type PendingAction =
  | (PendingActionBase & {
    type: "case_message";
    body: string;
    clientMessageId: string;
  })
  | (PendingActionBase & {
    type: "appointment_request";
    preferredMode: "in_person" | "phone" | "remote";
    preferredTime?: string;
    note?: string;
  })
  | (PendingActionBase & {
    type: "case_review_request";
    reason: "reassignment" | "service_concern" | "safety_concern" | "other";
    note?: string;
  })
  | (PendingActionBase & {
    type: "case_feedback";
    rating: number;
    comment?: string;
  });

type PendingActionInput = PendingAction extends infer Action
  ? Action extends PendingAction
    ? Omit<Action, "id" | "createdAt" | "attempts" | "lastError">
    : never
  : never;

function createId() {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isPendingAction(value: unknown): value is PendingAction {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PendingAction>;
  if (typeof item.id !== "string" || !item.id.trim() || item.id.length > 100 || typeof item.caseId !== "string" || !item.caseId.trim() || item.caseId.length > 100 || !Number.isFinite(item.createdAt) || !Number.isInteger(item.attempts) || item.attempts! < 0) return false;
  if (item.clientActionId !== undefined && (typeof item.clientActionId !== "string" || !item.clientActionId.trim() || item.clientActionId.length > 100)) return false;
  const optionalText = (value: unknown, max: number) => value === undefined || typeof value === "string" && value.length <= max;
  if (!optionalText(item.lastError, 100)) return false;
  if (item.type === "case_message") return typeof item.body === "string" && item.body.length > 0 && item.body.length <= 4000 && typeof item.clientMessageId === "string" && item.clientMessageId.trim().length > 0 && item.clientMessageId.length <= 100;
  if (item.type === "appointment_request") return ["in_person", "phone", "remote"].includes(item.preferredMode!) && optionalText(item.preferredTime, 160) && optionalText(item.note, 800);
  if (item.type === "case_review_request") return ["reassignment", "service_concern", "safety_concern", "other"].includes(item.reason!) && optionalText(item.note, 1200);
  return item.type === "case_feedback" && Number.isInteger(item.rating) && item.rating! >= 1 && item.rating! <= 5 && optionalText(item.comment, 2000);
}

export function shouldQueueError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /network|fetch|offline|internet|timeout|connection|failed to send/i.test(message);
}

export async function getPendingActions(owner: string | null) {
  if (!owner) return [];
  // Never assign the old, ownerless queue to whichever account signs in next.
  const value = await SecureStore.getItemAsync(pendingActionKey(owner));
  if (!value) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(value); } catch { throw new Error("Saved pending actions could not be read. They have not been deleted."); }
  if (!Array.isArray(parsed) || parsed.length > MAX_PENDING_ACTIONS || parsed.some(item => !isPendingAction(item))) throw new Error("Saved pending actions need recovery. They have not been deleted.");
  return (parsed as PendingAction[]).sort((a,b) => a.createdAt - b.createdAt);
}

async function savePendingActions(owner: string, actions: PendingAction[]) {
  await SecureStore.setItemAsync(pendingActionKey(owner), JSON.stringify(actions), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  changed(owner);
}

function updateQueue<T>(owner: string | null, update: () => Promise<T>): Promise<T> {
  if (!owner) return Promise.reject(new Error("Sign in before saving a case action."));
  const key = pendingActionKey(owner);
  const task = (writes.get(key) ?? Promise.resolve()).catch(() => undefined).then(update);
  writes.set(key, task);
  void task.then(() => { if (writes.get(key) === task) writes.delete(key); }, () => { if (writes.get(key) === task) writes.delete(key); });
  return task;
}

export async function enqueuePendingAction(owner: string | null, input: PendingActionInput) {
  return updateQueue(owner, async () => {
    const actions = await getPendingActions(owner);
    const previous = actions.find(action => input.type === "case_message" && action.type === "case_message" ? action.clientMessageId === input.clientMessageId : !!input.clientActionId && action.clientActionId === input.clientActionId);
    if (previous) {
      const fields = Object.keys(input) as Array<keyof PendingActionInput>;
      if (fields.some(key => JSON.stringify((previous as unknown as Record<string, unknown>)[key]) !== JSON.stringify((input as unknown as Record<string, unknown>)[key]))) throw new Error("Pending retry must match the original action.");
      return previous;
    }
    if (actions.length >= MAX_PENDING_ACTIONS) throw new Error("Send your pending actions before saving another one.");
    const id = createId();
    const action = {
      ...input,
      id,
      clientActionId: input.clientActionId ?? id,
      createdAt: Date.now(),
      attempts: 0,
    } as PendingAction;
    if (!isPendingAction(action)) throw new Error("Invalid pending case action.");
    await savePendingActions(owner!, [...actions, action]);
    return action;
  });
}

export async function removePendingAction(owner: string | null, id: string) {
  return updateQueue(owner, async () => {
    const actions = await getPendingActions(owner);
    await savePendingActions(owner!, actions.filter((action) => action.id !== id));
  });
}

export async function markPendingActionFailed(owner: string | null, id: string, _error: unknown) {
  return updateQueue(owner, async () => {
    const actions = await getPendingActions(owner);
    await savePendingActions(owner!, actions.map((action) =>
      action.id === id ? { ...action, attempts: action.attempts + 1, lastError: "Sync failed" } : action,
    ));
  });
}

export function usePendingActions() {
  const { user } = useUser();
  const owner = user?.id ?? null;
  const [snapshot, setSnapshot] = useState<{ owner: string | null; actions: PendingAction[]; hydrated: boolean; error?: string }>({ owner: null, actions: [], hydrated: false });

  async function refresh() {
    const pending = await getPendingActions(owner);
    setSnapshot({ owner, actions: pending, hydrated: true });
    return pending;
  }

  useEffect(() => {
    let active = true;
    const read = () => { void getPendingActions(owner).then(actions => {
      if (active) setSnapshot({ owner, actions, hydrated: true });
    }).catch(() => {
      if (active) setSnapshot({ owner, actions: [], hydrated: true, error: "Pending actions could not be loaded. Stored data has not been deleted." });
    }); };
    const unsubscribe = owner ? subscribePendingActions(owner, read) : () => {};
    read();
    return () => { active = false; unsubscribe(); };
  }, [owner]);

  const actions = snapshot.owner === owner ? snapshot.actions : [];

  return {
    actions,
    error: snapshot.owner === owner ? snapshot.error : undefined,
    hydrated: snapshot.owner === owner && snapshot.hydrated,
    refresh,
    pendingCount: actions.length,
    enqueue: (input: PendingActionInput) => enqueuePendingAction(owner, input),
    remove: (id: string) => removePendingAction(owner, id),
    markFailed: (id: string, error: unknown) => markPendingActionFailed(owner, id, error),
  };
}
