export async function withRequestDeadline<T>(work: Promise<T>, milliseconds = 12_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Request timed out")), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer!);
  }
}
