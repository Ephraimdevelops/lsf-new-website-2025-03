import { useState, useEffect } from 'react';

/**
 * useFormPersistence Hook
 * 
 * Automatically saves and restores form state from localStorage.
 * Critical for rural users with unstable internet connections.
 * 
 * Usage:
 * const [formData, setFormData] = useFormPersistence('my-unique-form-id', initialData);
 */
export function useFormPersistence<T>(key: string, initialValue: T) {
    // Initialize state with stored value or default
    const [value, setValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') return initialValue;

            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.warn(`Error saving to localStorage key "${key}":`, error);
        }
    }, [key, value]);

    // Clear storage helper (call this on successful submission)
    const clearStorage = () => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
                setValue(initialValue);
            }
        } catch (error) {
            console.warn(`Error clearing localStorage key "${key}":`, error);
        }
    };

    return [value, setValue, clearStorage] as const;
}

export default useFormPersistence;
