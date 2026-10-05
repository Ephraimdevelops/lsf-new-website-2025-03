export type TriageRequest = {
  status: string;
  submittedAt?: number;
  triageStartedAt?: number;
};

export function summarizeTriage(
  submittedInPeriod: readonly TriageRequest[],
  currentlyAwaiting: readonly TriageRequest[],
  now: number,
) {
  const triaged = submittedInPeriod.filter((request) =>
    request.submittedAt !== undefined &&
    request.triageStartedAt !== undefined &&
    request.triageStartedAt >= request.submittedAt,
  );
  const totalHours = triaged.reduce((sum, request) =>
    sum + (request.triageStartedAt! - request.submittedAt!) / 3_600_000, 0);
  return {
    startedWithTimestamp: triaged.length,
    averageHoursToStart: triaged.length ? Math.round(totalHours / triaged.length * 10) / 10 : null,
    awaitingStart: currentlyAwaiting.length,
    awaitingOver24Hours: currentlyAwaiting.filter((request) =>
      request.submittedAt !== undefined && now - request.submittedAt > 86_400_000,
    ).length,
  };
}

export function countDistinctReferralTransitions<T extends { type: string; referralId: unknown }>(
  events: readonly T[],
  types: readonly string[],
) {
  return Object.fromEntries(types.map((type) => [
    type,
    new Set(events.filter((event) => event.type === type).map((event) => String(event.referralId))).size,
  ]));
}
