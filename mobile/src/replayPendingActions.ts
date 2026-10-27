/** User-requested replay only. A failed/uncertain result must not let later actions overtake it. */
export async function replayPendingActions<T extends { id: string; createdAt: number }>(actions: T[], controls: {
  active: () => boolean;
  send: (action: T) => Promise<unknown>;
  acknowledge: (id: string) => Promise<unknown>;
  failed: (id: string, error: unknown) => Promise<unknown>;
}) {
  let sent = 0;
  for (const action of [...actions].sort((a,b) => a.createdAt - b.createdAt)) {
    if (!controls.active()) break;
    try {
      await controls.send(action);
      if (!controls.active()) break;
      await controls.acknowledge(action.id);
      sent++;
    } catch (error) {
      if (controls.active()) await controls.failed(action.id, error);
      throw error;
    }
  }
  return sent;
}
