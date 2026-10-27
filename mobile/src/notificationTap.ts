/** Never trust a push payload as a URL, resource permission or read receipt. */
export function notificationTapKey(response: { actionIdentifier?: string; notification?: { date?: number; request?: { identifier?: string; content?: { data?: Record<string, unknown> } } } } | null | undefined, defaultAction: string) {
  if (!response || response.actionIdentifier !== defaultAction) return null;
  const request = response.notification?.request;
  const id = request?.content?.data?.notificationId;
  if (typeof id !== "string" || !id.trim() || id.length > 100 || !request?.identifier) return null;
  return `${request.identifier}:${response.notification?.date ?? ""}:${id}`;
}
