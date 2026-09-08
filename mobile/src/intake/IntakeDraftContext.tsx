import * as SecureStore from "expo-secure-store";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Locale } from "../i18n";

export type IntakeDraft = {
  clientRequestId: string;
  locale: Locale;
  description: string;
  region: string;
  district: string;
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
    region: "",
    district: "",
    desiredHelp: "",
    safeContactMethod: "in_app",
    preferredLanguage: locale,
    preferredLanguageOther: "",
    urgency: "standard",
    hasDocuments: false,
  };
}

const STORAGE_KEY = "haki_yangu_intake_draft";

type IntakeContextValue = {
  draft: IntakeDraft;
  hasSavedDraft: boolean;
  updateDraft: (updates: Partial<IntakeDraft>) => void;
  resetDraft: (locale: Locale) => void;
  saveDraftForLater: () => Promise<void>;
  restoreSavedDraft: () => Promise<boolean>;
  clearSavedDraft: () => Promise<void>;
};

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function IntakeDraftProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [draft, setDraft] = useState(() => newDraft(initialLocale));
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((value) => setHasSavedDraft(Boolean(value)))
      .catch(() => setHasSavedDraft(false));
  }, []);

  async function clearSavedDraft() {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    setHasSavedDraft(false);
  }

  return (
    <IntakeContext.Provider
      value={{
        draft,
        hasSavedDraft,
        updateDraft: (updates) => setDraft((current) => ({ ...current, ...updates })),
        resetDraft: (locale) => setDraft(newDraft(locale)),
        saveDraftForLater: async () => {
          await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(draft), {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          });
          setHasSavedDraft(true);
        },
        restoreSavedDraft: async () => {
          const value = await SecureStore.getItemAsync(STORAGE_KEY);
          if (!value) {
            setHasSavedDraft(false);
            return false;
          }
          const parsed = JSON.parse(value) as IntakeDraft;
          setDraft({ ...newDraft(parsed.locale ?? initialLocale), ...parsed });
          setHasSavedDraft(true);
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
