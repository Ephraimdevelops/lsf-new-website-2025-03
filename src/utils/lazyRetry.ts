import { lazy, ComponentType } from 'react';

/**
 * A wrapper for React.lazy that retries loading the component if it fails due to a ChunkLoadError.
 * This common error happens when a new deployment occurs and the user's browser attempts to 
 * load a script with an old hash that no longer exists on the server.
 */
export const lazyWithRetry = (componentImport: () => Promise<{ default: ComponentType<any> }>) => {
    return lazy(async () => {
        // Check if we've already tried to reload the page to fix a chunk error
        const hasRetried = window.sessionStorage.getItem('chunk_retry_occurred');

        try {
            return await componentImport();
        } catch (error: any) {
            // Only retry for chunk loading errors
            const isChunkError = error.message && (
                error.message.includes('Loading chunk') ||
                error.message.includes('ChunkLoadError')
            );

            if (isChunkError && !hasRetried) {
                window.sessionStorage.setItem('chunk_retry_occurred', 'true');
                window.location.reload();
                // Return a pending promise that never resolves as the page is reloading
                return new Promise(() => { });
            }

            // If it's a second failure or not a chunk error, clear the flag and throw
            window.sessionStorage.removeItem('chunk_retry_occurred');
            throw error;
        }
    });
};
