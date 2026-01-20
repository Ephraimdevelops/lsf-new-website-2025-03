import { useState, useEffect, useCallback } from 'react';

/**
 * useFormPersistence Hook (SECURED)
 * 
 * Automatically saves and restores form state from localStorage.
 * Critical for rural users with unstable internet connections.
 * 
 * SECURITY: Now supports user-scoped storage to prevent cross-user data leaks.
 * 
 * Usage:
 * ```tsx
 * // Without user ID (uses sessionStorage - clears on close)
 * const [formData, setFormData, clearStorage] = useFormPersistence('my-form', initialData);
 * 
 * // With user ID (uses localStorage - persists per user)
 * const [formData, setFormData, clearStorage] = useFormPersistence('my-form', initialData, userId);
 * ```
 */
export function useFormPersistence<T>(
    baseKey: string,
    initialValue: T,
    userId?: string | null
) {
    // Generate a user-scoped key if userId is provided
    const storageKey = userId ? `form_${baseKey}_${userId}` : `form_${baseKey}`;

    // Use sessionStorage for anonymous users (clears on browser close)
    // Use localStorage for authenticated users (persists per user)
    const storage = typeof window !== 'undefined'
        ? (userId ? window.localStorage : window.sessionStorage)
        : null;

    // Initialize state with stored value or default
    const [value, setValue] = useState<T>(() => {
        try {
            if (!storage) return initialValue;

            const item = storage.getItem(storageKey);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading storage key "${storageKey}":`, error);
            return initialValue;
        }
    });

    // Update storage when state changes
    useEffect(() => {
        try {
            if (storage) {
                storage.setItem(storageKey, JSON.stringify(value));
            }
        } catch (error) {
            console.warn(`Error saving to storage key "${storageKey}":`, error);
        }
    }, [storageKey, value, storage]);

    // Clear storage helper (call this on successful submission)
    const clearStorage = useCallback(() => {
        try {
            if (storage) {
                storage.removeItem(storageKey);
                setValue(initialValue);
            }
        } catch (error) {
            console.warn(`Error clearing storage key "${storageKey}":`, error);
        }
    }, [storage, storageKey, initialValue]);

    // Clear ALL form data for this user (for logout cleanup)
    const clearAllUserForms = useCallback(() => {
        try {
            if (!storage || !userId) return;

            const keysToRemove: string[] = [];
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key?.includes(`_${userId}`)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => storage.removeItem(key));
        } catch (error) {
            console.warn(`Error clearing all user forms:`, error);
        }
    }, [storage, userId]);

    return [value, setValue, clearStorage, clearAllUserForms] as const;
}

export default useFormPersistence;
