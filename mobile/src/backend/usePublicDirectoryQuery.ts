import { ConvexHttpClient } from "convex/browser";
import { useQueries } from "convex/react";
import { FunctionArgs, FunctionReference, FunctionReturnType, getFunctionName, makeFunctionReference } from "convex/server";
import { useEffect, useMemo, useState } from "react";
import { appConfig } from "../config";
import { withRequestDeadline } from "./requestDeadline";

// HTTP recovery is restricted to projections that already allow guest access.
const publicDirectoryQueries = new Set([
  "justiceServices:listPublicServices",
  "paralegals:listApprovedParalegals",
]);

export function usePublicDirectoryQuery<Q extends FunctionReference<"query", "public">>(query: Q, args: FunctionArgs<Q>) {
  const name = getFunctionName(query);
  if (!publicDirectoryQueries.has(name)) throw new Error("Not a public directory query");
  if (name === "paralegals:listApprovedParalegals" && args.includePrivate) throw new Error("Private directory recovery is forbidden");
  const key = JSON.stringify(args);
  const stableQuery = useMemo(() => makeFunctionReference(name) as Q, [name]);
  const stableArgs = useMemo(() => JSON.parse(key) as FunctionArgs<Q>, [key]);
  const requests = useMemo(() => ({ directory: { query: stableQuery, args: stableArgs } }), [stableQuery, stableArgs]);
  const live = useQueries(requests).directory as FunctionReturnType<Q> | Error | undefined;
  const queryFailed = live instanceof Error;
  const needsRecovery = live === undefined || queryFailed;
  const [attempt, setAttempt] = useState(0);
  const [recovery, setRecovery] = useState<{ key: string; data?: FunctionReturnType<Q>; failed?: boolean }>();

  useEffect(() => {
    if (!needsRecovery) return;
    let disposed = false;
    const controller = new AbortController();
    setRecovery(undefined);
    const timer = setTimeout(() => {
      const client = new ConvexHttpClient(appConfig.convexUrl, {
        logger: false,
        fetch: (input, init) => fetch(input, { ...init, signal: controller.signal }),
      });
      void withRequestDeadline(client.query(stableQuery, stableArgs)).then(
        data => { if (!disposed) setRecovery({ key, data }); },
        () => { if (!disposed) setRecovery({ key, failed: true }); },
      ).finally(() => controller.abort());
    }, queryFailed ? 0 : 8_000);
    return () => { disposed = true; clearTimeout(timer); controller.abort(); };
  }, [needsRecovery, queryFailed, stableQuery, stableArgs, key, attempt]);

  const current = recovery?.key === key ? recovery : undefined;
  return {
    data: live !== undefined && !(live instanceof Error) ? live : current?.data,
    failed: live === undefined || live instanceof Error ? current?.failed === true : false,
    retry: () => { setRecovery(undefined); setAttempt(value => value + 1); },
  };
}
