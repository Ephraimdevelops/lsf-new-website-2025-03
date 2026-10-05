import * as SecureStore from "expo-secure-store";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Locale } from "../i18n";
import { useAuth } from "../auth";
import { decodeDraft, draftStorageKey, transferGuestDraft } from "./draftStorage";

export type IntakeDraft = {
  clientRequestId: string;
  locale: Locale;
  description: string;
  issueCategory?: "employment" | "land" | "family" | "safety" | "consumer" | "other";
  sourceServiceId?: string;
  region: string;
  district: string;
  occurredOn: string;
  involvedParties: string;
  desiredHelp: string;
  safeContactMethod: "in_app" | "phone" | "sms" | "email" | "none";
  preferredLanguage: "sw" | "en" | "both" | "other";
  preferredLanguageOther: string;
  urgency: "standard" | "urgent" | "immediate_safety";
  hasDocuments: boolean;
};

function newDraft(locale: Locale): IntakeDraft {
  return {
    clientRequestId: `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    locale,
    description: "",
    issueCategory: undefined,
    sourceServiceId: undefined,
    region: "",
    district: "",
    occurredOn: "",
    involvedParties: "",
    desiredHelp: "",
    safeContactMethod: "in_app",
    preferredLanguage: locale,
    preferredLanguageOther: "",
    urgency: "standard",
    hasDocuments: false,
  };
}

type IntakeContextValue = {
  draft: IntakeDraft;
  hasSavedDraft: boolean;
  hasGuestDraft: boolean;
  updateDraft: (updates: Partial<IntakeDraft>) => void;
  resetDraft: (locale: Locale) => void;
  saveDraftForLater: () => Promise<void>;
  restoreSavedDraft: () => Promise<boolean>;
  restoreGuestDraft: () => Promise<boolean>;
  clearSavedDraft: () => Promise<void>;
};

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function IntakeDraftProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const { isLoaded, userId } = useAuth();
  const owner = isLoaded ? userId ?? null : undefined;
  return <ScopedIntakeDraftProvider key={owner === undefined ? "loading" : owner === null ? "guest" : `user:${owner}`} owner={owner} initialLocale={initialLocale}>{children}</ScopedIntakeDraftProvider>;
}

function ScopedIntakeDraftProvider({ children, initialLocale, owner }: { children: ReactNode; initialLocale: Locale; owner: string | null | undefined }) {
  const storageKey = owner === undefined ? null : draftStorageKey(owner);
  const guestKey = draftStorageKey(null);
  const [draft, setDraft] = useState(() => newDraft(initialLocale));
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [hasGuestDraft, setHasGuestDraft] = useState(false);

  useEffect(() => {
    let active = true;
    if (!storageKey) return;
    SecureStore.getItemAsync(storageKey)
      .then(value => { if (active) setHasSavedDraft(Boolean(value)); })
      .catch(() => { if (active) setHasSavedDraft(false); });
    if (owner) SecureStore.getItemAsync(guestKey)
      .then(value => { if (active) setHasGuestDraft(Boolean(value)); })
      .catch(() => { if (active) setHasGuestDraft(false); });
    return () => { active = false; };
  }, [storageKey, guestKey, owner]);

  function requireKey() {
    if (!storageKey) throw new Error("Wait for account loading before saving a draft.");
    return storageKey;
  }

  async function clearSavedDraft() {
    await SecureStore.deleteItemAsync(requireKey());
    setHasSavedDraft(false);
  }

  async function restore(key: string) {
    const value = await SecureStore.getItemAsync(key);
    if (!value) return false;
    const parsed = decodeDraft(value);
    setDraft({ ...newDraft(initialLocale), ...parsed });
    return true;
  }

  return (
    <IntakeContext.Provider
      value={{
        draft,
        hasSavedDraft,
        hasGuestDraft,
        updateDraft: (updates) => setDraft((current) => ({ ...current, ...updates })),
        resetDraft: (locale) => setDraft(newDraft(locale)),
        saveDraftForLater: async () => {
          await SecureStore.setItemAsync(requireKey(), JSON.stringify(draft), {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          });
          setHasSavedDraft(true);
        },
        restoreSavedDraft: async () => {
          const restored = await restore(requireKey());
          setHasSavedDraft(restored);
          return restored;
        },
        restoreGuestDraft: async () => {
          if (!owner) return false;
          const transferred = await transferGuestDraft(owner, newDraft(initialLocale).clientRequestId, {
            read: key => SecureStore.getItemAsync(key),
            write: async (key, value) => {
              await SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
              setHasSavedDraft(true);
            },
            remove: key => SecureStore.deleteItemAsync(key),
          });
          if (!transferred) { setHasGuestDraft(false); return false; }
          setHasSavedDraft(true);
          setHasGuestDraft(false);
          setDraft(transferred);
          return true;
        },
        clearSavedDraft,
      }}
    >
      {children}
    </IntakeContext.Provider>
  );
}

export function useIntakeDraft() {
  const value = useContext(IntakeContext);
  if (!value) throw new Error("useIntakeDraft must be used inside IntakeDraftProvider");
  return value;
}
