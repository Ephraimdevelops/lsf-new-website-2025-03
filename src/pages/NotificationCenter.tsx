import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, BellOff, CheckCheck, ChevronRight, ShieldCheck } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { dashboardPath } from "@/components/auth/dashboardPath";
import Layout from "@/components/layout/Layout";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

type Category = "cases" | "messages" | "appointments" | "documents" | "service";

const categories: Array<{ key: Category; label: string; detail: string }> = [
  { key: "cases", label: "Cases, requests and referrals", detail: "Status and assignment updates" },
  { key: "messages", label: "Messages", detail: "Messages from your case team" },
  { key: "appointments", label: "Appointments", detail: "Meeting changes and reminders" },
  { key: "documents", label: "Documents", detail: "Document requests and reviews" },
  { key: "service", label: "Service and account", detail: "Other workspace notices" },
];

const copy: Record<string, string> = {
  "request.submitted": "Your request was received.",
  "case.created": "Your request is being reviewed.",
  "case.status_changed": "There is an update on your case.",
  "message.received": "You have a new message in Haki Yangu.",
  "appointment.created": "There is an update about an appointment.",
  "appointment.changed": "An appointment has changed.",
  "appointment.reminder": "You have an upcoming appointment.",
  "assignment.offered": "A new assignment needs your review.",
  "assignment.accepted": "There is an update on your support.",
  "assignment.ended": "Your case access has changed.",
  "assignment.expired": "An assignment offer has expired.",
  "referral.consent_requested": "A referral needs your decision in the app.",
  "referral.updated": "There is an update on a referral.",
  "referral.created": "A referral is progressing.",
  "case.review_requested": "A case review request needs attention.",
  "case.review_closed": "There is an update on a case review.",
  "feedback.requested": "Your feedback has been requested.",
  "access.revoked": "Your workspace access has changed.",
};

export default function NotificationCenter() {
  const navigate = useNavigate();
  const access = useQuery(api.users.currentAccess);
  const inbox = useQuery(api.notifications.inbox, { limit: 100 });
  const preferences = useQuery(api.notifications.getPreferences);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const updatePreferences = useMutation(api.notifications.updatePreferences);
  const setPushEnabled = useMutation(api.notifications.setPushEnabled);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const home = access ? dashboardPath(access.roles) : "/profile";
  const beneficiary = Boolean(access && home === "/dashboard/user");
  const unread = inbox?.filter((item) => !item.readAt).length ?? 0;

  async function open(item: NonNullable<typeof inbox>[number]) {
    setError("");
    try {
      if (!item.readAt) await markRead({ notificationId: item._id });
      if (beneficiary && item.resourceType === "case" && item.resourceId) {
        navigate(`/dashboard/user/cases/${encodeURIComponent(item.resourceId)}`);
      } else if (beneficiary && item.resourceType === "legal_help_request" && item.resourceId) {
        navigate(`/dashboard/user/requests/${encodeURIComponent(item.resourceId)}`);
      } else navigate(home);
    } catch {
      setError("Could not open this update. Check your connection and try again.");
    }
  }

  async function changeCategory(category: Category, enabled: boolean) {
    if (!preferences) return;
    setBusy(true);
    setError("");
    try {
      await updatePreferences({ preferences: {
        cases: preferences.cases,
        messages: preferences.messages,
        appointments: preferences.appointments,
        documents: preferences.documents,
        service: preferences.service,
        [category]: enabled,
      } });
    } catch { setError("Could not save external-alert settings. Please retry."); }
    finally { setBusy(false); }
  }

  async function disablePush() {
    setBusy(true);
    setError("");
    try { await setPushEnabled({ enabled: false }); }
    catch { setError("Could not disable external alerts. Please retry."); }
    finally { setBusy(false); }
  }

  return <Layout>
    <div className="min-h-[70vh] bg-[#FBF7F8] py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8F0D3A]">Haki Yangu · private workspace</p>
              <h1 className="mt-2 text-3xl font-bold text-[#251820]">Updates and notifications</h1>
              <p className="mt-2 text-sm text-[#625660]">Taarifa zako salama · Your updates stay in your account on web and mobile.</p>
            </div>
            <Link to={home}><Button variant="outline">Back to workspace</Button></Link>
          </div>

          {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section aria-labelledby="inbox-title" className="rounded-3xl border border-[#EAD8DE] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-[#FBE7EE] p-3 text-[#8F0D3A]"><Bell size={22} /></span>
                  <div><h2 id="inbox-title" className="text-xl font-bold text-[#251820]">Inbox</h2><p className="text-xs text-[#766B72]">{unread} unread · latest 100 updates</p></div>
                </div>
                {unread > 0 && <button type="button" disabled={busy} onClick={() => { setBusy(true); void markAllRead().catch(() => setError("Could not mark updates as read.")).finally(() => setBusy(false)); }} className="inline-flex items-center gap-1 text-sm font-semibold text-[#8F0D3A] disabled:opacity-50"><CheckCheck size={16} /> Mark all read</button>}
              </div>
              {inbox === undefined ? <p role="status" className="rounded-2xl bg-[#F8F2F4] p-6 text-sm text-[#625660]">Loading your updates…</p>
                : inbox.length === 0 ? <div className="rounded-2xl bg-[#F8F2F4] p-8 text-center"><ShieldCheck className="mx-auto text-[#8F0D3A]" size={30} /><p className="mt-3 font-semibold text-[#251820]">No updates yet</p><p className="mt-1 text-sm text-[#625660]">Case, message and appointment updates will appear here.</p></div>
                : <ul className="space-y-2">{inbox.map((item) => <li key={item._id}>
                  <button type="button" onClick={() => void open(item)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors hover:bg-[#FBF7F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8F0D3A] ${item.readAt ? "border-[#EEE7E9] bg-white" : "border-[#E7C1CE] bg-[#FFF5F8]"}`}>
                    <span aria-hidden="true" className={`h-2.5 w-2.5 flex-none rounded-full ${item.readAt ? "bg-[#D9CED2]" : "bg-[#8F0D3A]"}`} />
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#251820]">{copy[item.type] ?? "There is an update in Haki Yangu."}</span><time className="mt-1 block text-xs text-[#766B72]" dateTime={new Date(item.createdAt).toISOString()}>{new Date(item.createdAt).toLocaleString("en-TZ", { dateStyle: "medium", timeStyle: "short" })}</time></span>
                    <ChevronRight aria-hidden="true" size={18} className="flex-none text-[#8F0D3A]" />
                  </button>
                </li>)}</ul>}
            </section>
            <aside aria-labelledby="alerts-title" className="self-start rounded-3xl border border-[#EAD8DE] bg-white p-5 shadow-sm sm:p-6">
              <h2 id="alerts-title" className="text-lg font-bold text-[#251820]">External alerts</h2>
              <p className="mt-2 text-sm leading-6 text-[#625660]">Your private inbox always keeps all updates. These choices only affect alerts sent to opted-in mobile devices.</p>
              <div className="mt-4 rounded-2xl bg-[#F8F2F4] p-4 text-sm text-[#625660]">{preferences === undefined ? "Loading alert settings…" : preferences.pushEnabled ? "Device alerts are enabled. You can turn them off here." : "Device alerts are off. Turn them on from the mobile app and grant device permission."}</div>
              {preferences?.pushEnabled && <Button variant="outline" disabled={busy} onClick={() => void disablePush()} className="mt-4 w-full"><BellOff className="mr-2 h-4 w-4" /> Turn off device alerts</Button>}
              <div className="mt-5 space-y-4 border-t border-[#EEE7E9] pt-5">
                {categories.map((category) => <label key={category.key} className="flex cursor-pointer items-start gap-3 text-sm">
                  <input type="checkbox" checked={preferences?.[category.key] ?? true} disabled={!preferences || busy} onChange={(event) => void changeCategory(category.key, event.target.checked)} className="mt-1 accent-[#8F0D3A]" />
                  <span><span className="block font-semibold text-[#251820]">{category.label}</span><span className="block text-xs text-[#766B72]">{category.detail}</span></span>
                </label>)}
              </div>
              <p className="mt-5 text-xs leading-5 text-[#766B72]">Safe-contact choices on a request can further suppress external alerts. Updates remain available after sign-in.</p>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  </Layout>;
}
