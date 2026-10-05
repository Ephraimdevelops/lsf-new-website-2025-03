type ProtectionAdapter = { enable(): Promise<void>; disable(): Promise<void> };

// Protection affects the whole native window. Apply it once and serialize
// transitions when navigation briefly overlaps sensitive screens.
export function createScreenProtection(adapter: ProtectionAdapter) {
  const active = new Set<symbol>();
  let enabled = false;
  let queue = Promise.resolve();
  function reconcile() {
    queue = queue.then(async () => {
      const desired = active.size > 0;
      if (desired === enabled) return;
      try {
        if (desired) await adapter.enable();
        else await adapter.disable();
        enabled = desired;
      } catch {
        // Unsupported protection must not crash a legal-aid journey.
      }
    });
  }
  return {
    acquire(screenKey: string) {
      const token = Symbol(screenKey);
      active.add(token);
      reconcile();
      return () => { active.delete(token); reconcile(); };
    },
    settled: () => queue,
  };
}
