import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

const STORAGE_KEY = "haki_yangu_pending_actions";
const MAX_PENDING_ACTIONS = 25;

type PendingActionBase = {
  id: string;
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
  return typeof item.id === "string" && typeof item.caseId === "string" && typeof item.type === "string" && typeof item.createdAt === "number";
}

export function shouldQueueError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /network|fetch|offline|internet|timeout|connection|failed to send/i.test(message);
}

export async function getPendingActions() {
  const value = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPendingAction).slice(0, MAX_PENDING_ACTIONS);
  } catch {
    return [];
  }
}

async function savePendingActions(actions: PendingAction[]) {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(actions.slice(0, MAX_PENDING_ACTIONS)), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function enqueuePendingAction(input: PendingActionInput) {
  const actions = await getPendingActions();
  const action = {
    ...input,
    id: createId(),
    createdAt: Date.now(),
    attempts: 0,
  } as PendingAction;
  await savePendingActions([action, ...actions].slice(0, MAX_PENDING_ACTIONS));
  return action;
}

export async function removePendingAction(id: string) {
  const actions = await getPendingActions();
  await savePendingActions(actions.filter((action) => action.id !== id));
}

export async function markPendingActionFailed(id: string, error: unknown) {
  const actions = await getPendingActions();
  const message = error instanceof Error ? error.message : String(error ?? "Sync failed");
  await savePendingActions(actions.map((action) =>
    action.id === id ? { ...action, attempts: action.attempts + 1, lastError: message.slice(0, 180) } : action,
  ));
}

export function usePendingActions() {
  const [actions, setActions] = useState<PendingAction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  async function refresh() {
    const pending = await getPendingActions();
    setActions(pending);
    setHydrated(true);
    return pending;
  }

  useEffect(() => {
    void refresh();
  }, []);

  return {
    actions,
    hydrated,
    refresh,
    pendingCount: actions.length,
  };
}
