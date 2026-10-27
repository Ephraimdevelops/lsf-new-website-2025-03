/** A stalled native transfer must release the form so the user can review and retry. */
export async function uploadWithDeadline<T>(task: { uploadAsync(): Promise<T>; cancelAsync(): Promise<void> }, timeoutMs = 120000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(() => task.uploadAsync()),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error("Upload timed out. Check your connection and retry; your request was not submitted by this upload."));
          void task.cancelAsync().catch(() => undefined);
        }, timeoutMs);
      }),
    ]);
  } finally { if (timer) clearTimeout(timer); }
}
