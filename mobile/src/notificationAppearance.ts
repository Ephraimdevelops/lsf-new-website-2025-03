export function notificationAppearance(type: string) {
  if (type.startsWith("message.")) return { icon: "chatbubble-ellipses-outline", sw: "Ujumbe", en: "Message", tone: "#F0F7F6", accent: "#228C88" } as const;
  if (type.startsWith("appointment.")) return { icon: "calendar-outline", sw: "Miadi", en: "Appointment", tone: "#F8F5EA", accent: "#867022" } as const;
  if (type.startsWith("referral.")) return { icon: "git-branch-outline", sw: "Rufaa", en: "Referral", tone: "#F4F1F8", accent: "#766184" } as const;
  if (type.startsWith("assignment.")) return { icon: "briefcase-outline", sw: "Majukumu", en: "Assignment", tone: "#F2F5F8", accent: "#547080" } as const;
  return { icon: "folder-open-outline", sw: "Ombi na kesi", en: "Request & case", tone: "#FBF2F5", accent: "#8B1538" } as const;
}
