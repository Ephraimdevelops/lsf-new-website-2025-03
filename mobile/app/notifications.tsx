import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { notificationCategory, useNotificationPreferences } from "../src/useNotificationPreferences";
import { colors, radius, spacing, type } from "../src/theme";

const labels: Record<string, { sw: string; en: string }> = {
  "request.submitted": { sw: "Ombi lako limepokelewa.", en: "Your request was received." },
  "case.created": { sw: "Ombi lako linaendelea kupitiwa.", en: "Your request is being reviewed." },
  "assignment.offered": { sw: "Una kazi mpya inayohitaji majibu.", en: "You have a new assignment to review." },
  "assignment.accepted": { sw: "Kuna taarifa mpya kuhusu msaada wako.", en: "There is an update on your support." },
  "assignment.ended": { sw: "Ufikiaji wako wa kesi umebadilika.", en: "Your case access has changed." },
  "assignment.expired": { sw: "Ofa ya kazi imeisha muda wake.", en: "An assignment offer has expired." },
  "case.status_changed": { sw: "Kuna taarifa mpya kwenye kesi yako.", en: "There is an update on your case." },
  "message.received": { sw: "Una ujumbe mpya kwenye Haki Yangu.", en: "You have a new message in Haki Yangu." },
  "appointment.created": { sw: "Kuna taarifa mpya kuhusu miadi yako.", en: "There is an update about your appointment." },
  "appointment.changed": { sw: "Miadi yako imesasishwa.", en: "Your appointment was updated." },
  "appointment.reminder": { sw: "Una miadi inayokaribia.", en: "You have an upcoming appointment." },
  "appointment.requested": { sw: "Ombi la miadi linahitaji kushughulikiwa.", en: "An appointment request needs attention." },
  "feedback.requested": { sw: "Tuambie kuhusu msaada uliopokea.", en: "Tell us about the support you received." },
  "case.review_requested": { sw: "Ombi la kupitia kesi linahitaji kushughulikiwa.", en: "A case review request needs attention." },
  "case.review_closed": { sw: "Kuna taarifa mpya kuhusu ombi lako la kupitia kesi.", en: "There is an update on your review request." },
};

export default function NotificationsScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const notifications = useQuery(api.notifications.inbox, isSignedIn ? { limit: 50 } : "skip");
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const { preferences } = useNotificationPreferences();
  const visibleNotifications = notifications?.filter((notification) => preferences[notificationCategory(notification.type)]);
  const demoNotifications = [
    { id: "demo-message", type: "message.received", date: "Today, 10:08 AM", unread: true },
    { id: "demo-status", type: "case.status_changed", date: "Today, 8:30 AM", unread: true },
    { id: "demo-appointment", type: "appointment.reminder", date: "Tomorrow, 8:00 AM", unread: false },
  ];
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
        <Text style={styles.title}>{locale === "sw" ? "Arifa" : "Notifications"}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Mipangilio" : "Settings"} onPress={() => router.push("/notification-settings")}>
          <Ionicons name="settings-outline" size={23} color={colors.burgundy} />
        </Pressable>
      </View>
      {isSignedIn && visibleNotifications?.length ? <><Pressable onPress={() => void markAllRead()}><Text style={styles.markAll}>{locale === "sw" ? "Weka zote zimesomwa" : "Mark all as read"}</Text></Pressable>{visibleNotifications.map((notification) => <Pressable key={notification._id} onPress={() => { if (!notification.readAt) void markRead({ notificationId: notification._id }); if (notification.resourceType === "case" && notification.resourceId) router.push({ pathname: "/case/[id]", params: { id: notification.resourceId } }); }} style={[styles.card, !notification.readAt && styles.unread]}><View style={styles.icon}><Ionicons name="notifications-outline" size={20} color={colors.burgundy} /></View><View style={styles.copy}><Text style={styles.message}>{labels[notification.type]?.[locale] || (locale === "sw" ? "Una taarifa mpya kwenye Haki Yangu." : "You have an update in Haki Yangu.")}</Text><Text style={styles.date}>{new Date(notification.createdAt).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text></View>{!notification.readAt ? <View style={styles.dot} /> : null}</Pressable>)}</> : <>{demoNotifications.map((notification) => <Pressable key={notification.id} onPress={() => router.push(notification.type === "appointment.reminder" ? "/appointments" : "/(tabs)/cases")} style={[styles.card, notification.unread && styles.unread]}><View style={styles.icon}><Ionicons name="notifications-outline" size={20} color={colors.burgundy} /></View><View style={styles.copy}><Text style={styles.message}>{labels[notification.type]?.[locale]}</Text><Text style={styles.date}>{notification.date}</Text></View>{notification.unread ? <View style={styles.dot} /> : null}</Pressable>)}</>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.xl },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 19 },
  markAll: { fontFamily: type.medium, color: colors.burgundy, textAlign: "right", fontSize: 13, marginBottom: spacing.md },
  card: { flexDirection: "row", gap: spacing.md, alignItems: "center", borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, marginBottom: spacing.sm },
  unread: { backgroundColor: colors.softPink, borderColor: "#E1C8D4" },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: spacing.xs },
  message: { fontFamily: type.medium, color: colors.charcoal, fontSize: 14, lineHeight: 19 },
  date: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.burgundy },
  empty: { alignItems: "center", gap: spacing.lg, marginTop: 100 },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
});
