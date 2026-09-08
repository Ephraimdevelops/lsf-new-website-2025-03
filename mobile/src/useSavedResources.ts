import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const STORAGE_KEY = "haki_yangu_saved_resources";

export function useSavedResources() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setSavedIds(parsed);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  async function persist(nextIds: string[]) {
    setSavedIds(nextIds);
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(nextIds), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  async function toggleSaved(id: string) {
    const nextIds = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [id, ...savedIds];
    await persist(nextIds);
  }

  return {
    hydrated,
    savedIds,
    isSaved: (id: string) => savedIds.includes(id),
    toggleSaved,
  };
}
