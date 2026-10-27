import { BrandLoading } from '../src/components/BrandLoading';
import type { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useConvex, useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { notificationAppearance } from "../src/notificationAppearance";
import { useState } from "react";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const labels: Record<string, { sw: string; en: string }> = {
  "request.message": { sw: "Kuna ujumbe mpya kuhusu ombi lako.", en: "There is a new message about your request." },
  "request.submitted": { sw: "Ombi lako limepokelewa.", en: "Your request was received." },
  "case.created": { sw: "Kesi yako imefunguliwa.", en: "Your case has been opened." },
  "assignment.offered": { sw: "Una kazi mpya inayohitaji majibu.", en: "You have a new assignment to review." },
  "assignment.accepted": { sw: "Kuna taarifa mpya kuhusu msaada wako.", en: "There is an update on your support." },
  "assignment.ended": { sw: "Ufikiaji wako wa kesi umebadilika.", en: "Your case access has changed." },
  "assignment.expired": { sw: "Muda wa kujibu ombi la kesi umeisha.", en: "The time to respond to a case assignment has expired." },
  "case.status_changed": { sw: "Kuna taarifa mpya kwenye kesi yako.", en: "There is an update on your case." },
  "message.received": { sw: "Una ujumbe mpya kwenye Haki Yangu.", en: "You have a new message in Haki Yangu." },
  "appointment.created": { sw: "Kuna taarifa mpya kuhusu miadi yako.", en: "There is an update about your appointment." },
  "appointment.changed": { sw: "Miadi yako imesasishwa.", en: "Your appointment was updated." },
  "appointment.reminder": { sw: "Una miadi inayokaribia.", en: "You have an upcoming appointment." },
  "appointment.requested": { sw: "Ombi la miadi linahitaji kushughulikiwa.", en: "An appointment request needs attention." },
  "feedback.requested": { sw: "Tuambie kuhusu msaada uliopokea.", en: "Tell us about the support you received." },
  "case.review_requested": { sw: "Ombi la kupitia kesi linahitaji kushughulikiwa.", en: "A case review request needs attention." },
  "case.review_closed": { sw: "Kuna taarifa mpya kuhusu ombi lako la kupitia kesi.", en: "There is an update on your review request." },
  "referral.consent_requested": { sw: "Rufaa inahitaji uamuzi wako. Kagua huduma na taarifa zitakazoshirikiwa.", en: "A referral needs your decision. Review the service and information to be shared." },
  "referral.updated": { sw: "Kuna taarifa mpya kuhusu rufaa yako.", en: "There is an update on your referral." },
  "referral.created": { sw: "Rufaa imeidhinishwa na inaendelea.", en: "A referral was approved and is progressing." },
};

export default function NotificationsScreen() {
  const convex = useConvex();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const notifications = useQuery(api.notifications.inbox, isSignedIn ? { limit: 50 } : "skip");
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const visibleNotifications = notifications;
  const [error, setError] = useState("");
  const unreadCount = notifications?.filter(item => !item.readAt).length ?? 0;
  return (
    <Screen>
      <CivicPageHeader back compact title={locale === "sw" ? "Arifa" : "Notifications"} actionIcon="settings-outline" actionLabel={locale === "sw" ? "Mipangilio" : "Settings"} onAction={() => router.push("/notification-settings")} />
      <View style={styles.intro}><View style={styles.copy}><Text style={styles.introTitle}>{locale === "sw" ? "Taarifa zako muhimu." : "Your important updates."}</Text><Text style={styles.emptyText}>{locale === "sw" ? "Ujumbe, miadi na hatua mpya za msaada wako." : "Messages, appointments and the next steps in your support."}</Text></View><CivicIllustration pose="contact" size={96} /></View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!isSignedIn ? (
        <View style={styles.empty}>
          <Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Ingia kuona arifa zako" : "Sign in to view notifications"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Arifa za kesi, ujumbe na miadi zinalindwa kwenye akaunti yako."
              : "Case, message, and appointment notifications are protected by your account."}
          </Text>
          <Button label={locale === "sw" ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} />
        </View>
      ) : visibleNotifications === undefined ? (
        <View style={styles.empty}>
          <Ionicons name="hourglass-outline" size={32} color={colors.burgundy} />
          <BrandLoading compact text={locale === "sw" ? "Tunapakua arifa zako..." : "Loading your notifications..."}/>
        </View>
      ) : visibleNotifications.length ? (
        <>
          <View style={styles.listHeading}><Text style={styles.count}>{unreadCount ? `${unreadCount} ${locale === "sw" ? "mpya" : "unread"}` : (locale === "sw" ? "Umesoma zote" : "All caught up")}</Text>{unreadCount ? <Pressable accessibilityRole="button" style={styles.markButton} onPress={() => { void markAllRead().catch(() => setError(locale === "sw" ? "Haijakamilika. Jaribu tena." : "Could not update. Try again.")); }}>
            <Text style={styles.markAll}>{locale === "sw" ? "Weka zote zimesomwa" : "Mark all as read"}</Text>
          </Pressable> : null}</View>
          {visibleNotifications.map((notification) => {
            const appearance = notificationAppearance(notification.type);
            return (
            <Pressable
              key={notification._id}
              onPress={() => {
                if (notification.resourceType === "legal_help_request" && notification.resourceId) {
                  void convex.query(api.requestMessages.state, { requestId: notification.resourceId as Id<"legal_help_requests"> }).then(request => {
                    if (!notification.readAt) void markRead({ notificationId: notification._id }).catch(() => undefined);
                    router.push({ pathname: request.canRequestInformation ? "/operations-request/[id]" : "/request/[id]", params: { id: notification.resourceId! } });
                  }).catch(() => setError(locale === "sw" ? "Ombi halipatikani kwenye akaunti hii." : "This request is not available in your account."));
                  return;
                }
                if (notification.resourceType === "referral" && notification.resourceId) {
                  void convex.query(api.notifications.referralContext, { notificationId: notification._id }).then(context => {
                    if (!notification.readAt) void markRead({ notificationId: notification._id }).catch(() => undefined);
                    if (context.beneficiaryCaseId) router.push({ pathname: "/referral/[id]", params: { id: notification.resourceId!, caseId: context.beneficiaryCaseId } });
                    else if (access?.roles.some(role => ["admin", "staff", "supervisor"].includes(role))) router.push({ pathname: "/referral-oversight/[id]", params: { id: notification.resourceId! } });
                    else router.push({ pathname: "/provider-referral/[id]", params: { id: notification.resourceId! } });
                  }).catch(() => setError(locale === "sw" ? "Rufaa haipatikani kwenye akaunti hii." : "This referral is not available in your account."));
                  return;
                }
                if (!notification.readAt) void markRead({ notificationId: notification._id }).catch(() => setError(locale === "sw" ? "Arifa haijawekwa kuwa imesomwa." : "Could not mark notification as read."));
                if (notification.resourceType === "legal_guide" && notification.resourceId && access?.roles.some(role=>["admin","content_editor"].includes(role))) router.push({pathname:"/legal-guide-review/[id]",params:{id:notification.resourceId}});
                else if (notification.resourceType === "matching_decision" && notification.resourceId && access?.roles.some(role => ["admin", "staff", "supervisor", "safeguarding_officer"].includes(role))) router.push({ pathname: "/matching-review", params: { id: notification.resourceId } });
                else if (notification.resourceType === "case_review_request" && notification.resourceId && access?.roles.some(role => ["admin", "staff", "supervisor", "safeguarding_officer"].includes(role))) router.push({ pathname: "/safeguarding-review/[id]", params: { id: notification.resourceId, returnTo: access.roles.some(role => ["staff","supervisor"].includes(role)) ? "supervision" : "safeguarding" } });
                else if (notification.resourceType === "case_assignment" && access?.roles.some(role => ["admin", "staff", "supervisor"].includes(role))) router.push("/supervision?view=offers");
                else if (notification.resourceType === "case_assignment" && notification.resourceId) router.push({ pathname: "/assignment/[id]", params: { id: notification.resourceId } });
                else if (notification.resourceType === "case_appointment" && notification.resourceId) router.push({ pathname: "/appointment/[id]", params: { id: notification.resourceId } });
                else if (notification.type === "paralegal.support_requested" && notification.resourceId) router.push({ pathname: "/admin-support", params: { id: notification.resourceId } });
                else if (notification.resourceType === "paralegal_support_request" && notification.resourceId && access?.roles.some(role => ["admin", "staff", "supervisor"].includes(role))) router.push({pathname:"/admin-support",params:{id:notification.resourceId}});
                else if (notification.resourceType === "paralegal_support_request" && notification.resourceId && notification.type !== "paralegal.support_requested") router.push({ pathname: "/paralegal-support-request/[id]", params: { id: notification.resourceId } });
                else if (notification.resourceType === "case" && notification.resourceId) router.push({ pathname: "/case/[id]", params: { id: notification.resourceId } });
                else if (notification.type.startsWith("message.")) router.push("/(tabs)/help");
                else if (notification.type.startsWith("appointment.")) router.push("/appointments");
                else if (notification.resourceType === "legal_help_request" && notification.resourceId) router.push(access?.roles.some(role => ["admin", "staff", "supervisor"].includes(role)) ? { pathname: "/operations-request/[id]", params: { id: notification.resourceId } } : { pathname: "/request/[id]", params: { id: notification.resourceId } });
              }}
              accessibilityRole="button"
              style={[styles.card, { backgroundColor: !notification.readAt ? appearance.tone : colors.surface }]}
            >
              <View style={[styles.icon, { backgroundColor: appearance.tone }]}><Ionicons name={appearance.icon} size={23} color={appearance.accent} /></View>
              <View style={styles.copy}>
                <Text style={[styles.kind, { color: appearance.accent }]}>{appearance[locale]}</Text>
                <Text style={styles.message}>{labels[notification.type]?.[locale] || (locale === "sw" ? "Una taarifa mpya kwenye Haki Yangu." : "You have an update in Haki Yangu.")}</Text>
                <Text style={styles.date}>{new Date(notification.createdAt).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text>
              </View>
              {!notification.readAt ? <View accessibilityLabel={locale === "sw" ? "Haijasomwa" : "Unread"} style={[styles.dot, { backgroundColor: appearance.accent }]} /> : null}
            </Pressable>
          ); })}
        </>
      ) : (
        <View style={styles.empty}>
          <Ionicons name="notifications-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna arifa bado" : "No notifications yet"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "Taarifa mpya za maombi, kesi, ujumbe na miadi zitaonekana hapa."
              : "Updates about requests, cases, messages and appointments will appear here."}
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 }, introTitle: { fontFamily: type.semibold, fontSize: 22, lineHeight: 29, color: colors.ink, marginBottom: 7 },
  listHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }, count: { fontFamily: type.medium, fontSize: 13, color: colors.inkMuted }, markButton: { minHeight: 48, justifyContent: "center" }, kind: { fontFamily: type.medium, fontSize: 12, marginBottom: 3 }, error: { fontFamily: type.regular, color: colors.danger, fontSize: 13, marginBottom: 12 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.xl },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 19 },
  markAll: { fontFamily: type.medium, color: colors.burgundy, textAlign: "right", fontSize: 12 },
  card: { flexDirection: "row", gap: spacing.md, alignItems: "center", borderRadius: 8, padding: spacing.md, marginBottom: 10 },
  unread: { backgroundColor: colors.softPink, borderColor: "#E1C8D4" },
  icon: { width: 44, height: 44, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: spacing.xs },
  message: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 14, lineHeight: 19 },
  date: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.burgundy },
  empty: { alignItems: "center", gap: spacing.md, marginTop: 36 },
  emptyTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18, textAlign: "center" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22 },
});
