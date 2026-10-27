import { useState, useEffect, useCallback, useRef, type SetStateAction } from 'react';

type StorageKind = 'local' | 'session';
type Snapshot<T> = { scope: string | null; value: T; edited: boolean };

function browserStorage(kind: StorageKind): Storage | null {
    try {
        if (typeof window === 'undefined') return null;
        return kind === 'session' ? window.sessionStorage : window.localStorage;
    } catch {
        return null;
    }
}

function matchesShape(value: unknown, initial: unknown): boolean {
    if (initial === null) return value === null;
    if (Array.isArray(initial)) return Array.isArray(value);
    if (typeof initial !== 'object') return typeof value === typeof initial;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    return Object.keys(initial).every(key =>
        Object.prototype.hasOwnProperty.call(value, key) &&
        matchesShape((value as Record<string, unknown>)[key], (initial as Record<string, unknown>)[key])
    );
}

function readDraft<T>(storage: Storage | null, key: string | null, owner: string | null, initial: T): T {
    if (!storage || !key) return initial;
    try {
        const raw = storage.getItem(key);
        if (!raw) return initial;
        const saved = JSON.parse(raw);
        // Legacy unowned drafts are deliberately not migrated to an account.
        if (saved?.version !== 2 || saved.owner !== owner || !matchesShape(saved.value, initial)) return initial;
        return saved.value as T;
    } catch {
        return initial;
    }
}

/**
 * undefined owner: optional guest draft in sessionStorage.
 * null owner: private form is signed out/loading; do not restore or save.
 * user ID: owner-checked draft, with an optional session-only lifetime.
 * Storage is browser storage, not encryption or a substitute for authentication.
 */
export function useFormPersistence<T>(
    baseKey: string,
    initialValue: T,
    userId?: string | null,
    storageKind: StorageKind = 'local'
) {
    const initial = useRef(initialValue);
    const owner = userId || null;
    const kind = owner ? storageKind : 'session';
    const key = userId === null ? null : owner
        ? `form:v2:${encodeURIComponent(baseKey)}:user:${encodeURIComponent(owner)}`
        : `form:v2:${encodeURIComponent(baseKey)}:guest`;
    const scope = key ? `${kind}:${key}` : null;
    const storage = browserStorage(kind);
    const currentScope = useRef(scope);
    currentScope.current = scope;
    const [snapshot, setSnapshot] = useState<Snapshot<T>>(() => ({
        scope, value: readDraft(storage, key, owner, initial.current), edited: false,
    }));

    // Return blank data immediately on an identity change, before effects run.
    const value = snapshot.scope === scope ? snapshot.value : initial.current;
    useEffect(() => {
        if (currentScope.current !== scope) return;
        setSnapshot(previous => previous.scope === scope ? previous : {
            scope, value: readDraft(storage, key, owner, initial.current), edited: false,
        });
    }, [scope, storage, key, owner]);

    useEffect(() => {
        if (!storage || !key || !snapshot.edited || snapshot.scope !== scope || currentScope.current !== scope) return;
        try {
            storage.setItem(key, JSON.stringify({ version: 2, owner, value: snapshot.value }));
        } catch {
            console.warn('Could not save the form draft in this browser.');
        }
    }, [storage, key, scope, owner, snapshot]);

    const setValue = useCallback((update: SetStateAction<T>) => {
        // Ignore callbacks retained by the previous signed-in account.
        if (!scope || currentScope.current !== scope) return;
        setSnapshot(previous => {
            if (currentScope.current !== scope) return previous;
            const previousValue = previous.scope === scope ? previous.value : readDraft(storage, key, owner, initial.current);
            return { scope, value: typeof update === 'function'
                ? (update as (previous: T) => T)(previousValue) : update, edited: true };
        });
    }, [scope, storage, key, owner]);

    const clearStorage = useCallback(() => {
        if (currentScope.current !== scope) return;
        try {
            if (storage && key) storage.removeItem(key);
        } catch {
            console.warn('Could not remove the form draft from this browser.');
        } finally {
            setSnapshot({ scope, value: initial.current, edited: false });
        }
    }, [scope, storage, key]);

    const clearAllUserForms = useCallback(() => {
        if (!owner || !storage || currentScope.current !== scope) return;
        try {
            const suffix = `:user:${encodeURIComponent(owner)}`;
            const keys: string[] = [];
            for (let i = 0; i < storage.length; i++) {
                const candidate = storage.key(i);
                if (candidate?.startsWith('form:v2:') && candidate.endsWith(suffix)) keys.push(candidate);
            }
            keys.forEach(candidate => storage.removeItem(candidate));
        } catch {
            console.warn('Could not remove saved form drafts from this browser.');
        } finally {
            clearStorage();
        }
    }, [owner, storage, scope, clearStorage]);

    return [value, setValue, clearStorage, clearAllUserForms] as const;
}

export default useFormPersistence;
