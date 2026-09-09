import { useAuth, useUser } from "@clerk/clerk-react";
import type { FunctionReturnType } from "convex/server";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileText,
  Inbox,
  LogOut,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ParalegalProfileEdit from "@/components/paralegal/ParalegalProfileEdit";

type AssignmentInbox = FunctionReturnType<typeof api.caseManagement.assignmentInbox>;
type ProviderTab = "inbox" | "cases" | "referrals";
type CaseSubTab = "timeline" | "messages" | "documents" | "appointments" | "outcome";
type DestinationReferralStatus = "accepted" | "declined" | "scheduled" | "service_delivered" | "returned" | "closed";

const caseLabels: Record<string, string> = {
  under_review: "Under review",
  waiting_for_information: "Waiting for information",
  assignment_pending: "Assignment pending",
  assigned: "Assigned",
  appointment_scheduled: "Appointment scheduled",
  referred: "Referred",
  assistance_underway: "Assistance underway",
  resolved: "Resolved",
  closed_unresolved: "Closed unresolved",
  closed: "Closed",
};

const nextStatuses: Record<string, string[]> = {
  assigned: ["appointment_scheduled", "assistance_underway", "referred", "closed_unresolved"],
  appointment_scheduled: ["assistance_underway", "assigned", "closed_unresolved"],
  referred: ["assistance_underway", "closed_unresolved"],
  assistance_underway: ["appointment_scheduled", "referred", "resolved", "closed_unresolved"],
  resolved: ["closed"],
  closed_unresolved: ["closed"],
  closed: [],
};

const outcomeOptions = [
  { value: "advice_given", label: "Advice given" },
  { value: "document_prepared", label: "Document prepared" },
  { value: "mediation_supported", label: "Mediation supported" },
  { value: "referred_to_lawyer", label: "Referred to lawyer" },
  { value: "beneficiary_withdrew", label: "Beneficiary withdrew" },
  { value: "other", label: "Other outcome" },
];

function formatDate(timestamp?: number) {
  if (!timestamp) return "Not set";
  return new Intl.DateTimeFormat("en-TZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The operation could not be completed.";
}

function hoursUntil(timestamp?: number) {
  if (!timestamp) return null;
  const hours = Math.ceil((timestamp - Date.now()) / (60 * 60 * 1000));
  return Math.max(hours, 0);
}

function availabilityLabel(status?: string) {
  const labels: Record<string, string> = {
    accepting_cases: "Accepting new cases",
    limited: "Limited availability",
    paused: "Paused",
    unavailable: "Unavailable",
  };
  return labels[status ?? "accepting_cases"] ?? labels.accepting_cases;
}

function eventTitle(event: { publicLabelKey?: string; type: string }) {
  if (event.type === "appointment_requested") return "Appointment requested";
  return event.publicLabelKey?.split(".").pop()?.replaceAll("_", " ") ?? event.type.replaceAll("_", " ");
}

function eventDetail(event: { type: string; metadata?: unknown }) {
  if (event.type !== "appointment_requested" || !event.metadata || typeof event.metadata !== "object") return null;
  const metadata = event.metadata as { preferredMode?: string; preferredTime?: string; note?: string };
  const detail = [
    metadata.preferredMode ? `Mode: ${metadata.preferredMode.replaceAll("_", " ")}` : null,
    metadata.preferredTime ? `Preferred time: ${metadata.preferredTime}` : null,
    metadata.note ? `Note: ${metadata.note}` : null,
  ].filter(Boolean);
  return detail.length ? detail.join(" · ") : null;
}

function statusClass(value: string) {
  if (["resolved", "closed"].includes(value)) return "bg-emerald-100 text-emerald-800";
  if (["closed_unresolved", "referred"].includes(value)) return "bg-orange-100 text-orange-800";
  return "bg-primary/10 text-primary";
}

function StatusPill({ value, urgent = false }: { value: string; urgent?: boolean }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgent ? "bg-orange-100 text-orange-800" : statusClass(value)}`}>
      {caseLabels[value] ?? value.replaceAll("_", " ")}
    </span>
  );
}

const ParalegalDashboard = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [tab, setTab] = useState<ProviderTab>("inbox");
  const [caseTab, setCaseTab] = useState<CaseSubTab>("timeline");
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [message, setMessage] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentMode, setAppointmentMode] = useState<"in_person" | "phone" | "remote">("phone");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentStatusNotes, setAppointmentStatusNotes] = useState<Record<string, string>>({});
  const [referralNotesById, setReferralNotesById] = useState<Record<string, string>>({});
  const [onwardServiceByReferralId, setOnwardServiceByReferralId] = useState<Record<string, string>>({});
  const [onwardReasonByReferralId, setOnwardReasonByReferralId] = useState<Record<string, string>>({});
  const [onwardInfoByReferralId, setOnwardInfoByReferralId] = useState<Record<string, string>>({});
  const [onwardConsentByReferralId, setOnwardConsentByReferralId] = useState<Record<string, string>>({});
  const [outcomeCode, setOutcomeCode] = useState(outcomeOptions[0].value);
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const access = useQuery(api.users.currentAccess);
  const inbox = useQuery(api.caseManagement.assignmentInbox);
  const cases = useQuery(api.caseManagement.myCases);
  const referralInbox = useQuery(api.referrals.myDestinationQueue, {});
  const publicServices = useQuery(api.justiceServices.listPublicServices, {});
  const caseDetail = useQuery(api.caseManagement.getCase, selectedCaseId ? { caseId: selectedCaseId } : "skip");
  const messages = useQuery(api.caseManagement.listMessages, selectedCaseId ? { caseId: selectedCaseId } : "skip");
  const documents = useQuery(api.caseManagement.listDocuments, selectedCaseId ? { caseId: selectedCaseId } : "skip");
  const dashboardData = useQuery(
    api.paralegals.getDashboardData,
    user?.emailAddresses?.[0]?.emailAddress ? { email: user.emailAddresses[0].emailAddress } : "skip",
  );

  const respondToAssignment = useMutation(api.caseManagement.respondToAssignment);
  const updateCaseStatus = useMutation(api.caseManagement.updateStatus);
  const sendCaseMessage = useMutation(api.caseManagement.sendMessage);
  const reviewDocument = useMutation(api.caseManagement.reviewDocument);
  const scheduleAppointment = useMutation(api.caseManagement.scheduleAppointment);
  const updateAppointmentStatus = useMutation(api.caseManagement.updateAppointmentStatus);
  const recordOutcome = useMutation(api.caseManagement.recordOutcome);
  const respondToReferral = useMutation(api.referrals.respondAsDestination);
  const createOnwardReferral = useMutation(api.referrals.createOnwardReferral);

  useEffect(() => {
    if (!selectedCaseId && cases && cases.length > 0 && tab === "cases") {
      setSelectedCaseId(cases[0]._id);
    }
  }, [cases, selectedCaseId, tab]);

  async function run(action: () => Promise<void>) {
    setPending(true);
    setNotice(null);
    try {
      await action();
    } catch (error) {
      setNotice({ type: "error", text: errorMessage(error) });
    } finally {
      setPending(false);
    }
  }

  function acceptAssignment(item: AssignmentInbox[number]) {
    void run(async () => {
      await respondToAssignment({ assignmentId: item.assignment._id, response: "accepted" });
      if (item.case) {
        setSelectedCaseId(item.case._id);
        setCaseTab("timeline");
        setTab("cases");
      }
      setNotice({ type: "success", text: "Assignment accepted. The case is now in your workspace." });
    });
  }

  function declineAssignment(item: AssignmentInbox[number]) {
    void run(async () => {
      await respondToAssignment({
        assignmentId: item.assignment._id,
        response: "declined",
        reason: declineReason.trim() || undefined,
      });
      setDeclineReason("");
      setNotice({ type: "success", text: "Assignment declined and recorded." });
    });
  }

  function changeCaseStatus(status: string) {
    if (!selectedCaseId || !caseDetail) return;
    void run(async () => {
      await updateCaseStatus({
        caseId: selectedCaseId,
        status: status as Parameters<typeof updateCaseStatus>[0]["status"],
        expectedVersion: caseDetail.case.version,
      });
      setNotice({ type: "success", text: "Case status updated." });
    });
  }

  function sendMessage() {
    if (!selectedCaseId || !message.trim()) return;
    const body = message.trim();
    void run(async () => {
      await sendCaseMessage({
        caseId: selectedCaseId,
        body,
        clientMessageId: `provider-web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      });
      setMessage("");
    });
  }

  function schedule() {
    if (!selectedCaseId || !appointmentDate) {
      setNotice({ type: "error", text: "Choose a future appointment date and time." });
      return;
    }
    const startsAt = new Date(appointmentDate).getTime();
    if (!Number.isFinite(startsAt) || startsAt <= Date.now()) {
      setNotice({ type: "error", text: "Appointment must be in the future." });
      return;
    }
    void run(async () => {
      await scheduleAppointment({
        caseId: selectedCaseId,
        startsAt,
        mode: appointmentMode,
        location: appointmentLocation.trim() || undefined,
      });
      setAppointmentDate("");
      setAppointmentLocation("");
      setNotice({ type: "success", text: "Appointment scheduled and beneficiary notified." });
    });
  }

  function changeAppointmentStatus(
    appointmentId: Id<"case_appointments">,
    status: "completed" | "cancelled" | "missed",
  ) {
    void run(async () => {
      await updateAppointmentStatus({
        appointmentId,
        status,
        statusNote: appointmentStatusNotes[appointmentId]?.trim() || undefined,
      });
      setAppointmentStatusNotes((current) => ({ ...current, [appointmentId]: "" }));
      setNotice({ type: "success", text: `Appointment marked ${status}.` });
    });
  }

  function setDocumentStatus(documentId: Id<"case_documents">, status: "accepted" | "rejected") {
    void run(async () => {
      await reviewDocument({ documentId, status });
      setNotice({ type: "success", text: `Document ${status.replace("_", " ")}.` });
    });
  }

  function saveOutcome() {
    if (!selectedCaseId || outcomeSummary.trim().length < 10) {
      setNotice({ type: "error", text: "Add an outcome summary of at least 10 characters." });
      return;
    }
    void run(async () => {
      await recordOutcome({ caseId: selectedCaseId, outcomeCode, summary: outcomeSummary.trim() });
      setOutcomeSummary("");
      setNotice({ type: "success", text: "Outcome recorded and feedback request sent." });
    });
  }

  function updateReferral(
    referralId: Id<"referrals">,
    status: DestinationReferralStatus,
  ) {
    const note = referralNotesById[referralId]?.trim();
    void run(async () => {
      await respondToReferral({
        referralId,
        status,
        note: note || undefined,
        declineReason: status === "declined" ? note || "Destination declined the referral." : undefined,
        finalDisposition: status === "closed" ? note || "Referral closed by destination provider." : undefined,
      });
      setReferralNotesById((current) => ({ ...current, [referralId]: "" }));
      setNotice({ type: "success", text: `Referral marked ${status.replaceAll("_", " ")}.` });
    });
  }

  function createOnward(item: NonNullable<typeof referralInbox>[number]) {
    const destinationServiceId = onwardServiceByReferralId[item.referral._id];
    const reason = onwardReasonByReferralId[item.referral._id]?.trim();
    const informationShared = (onwardInfoByReferralId[item.referral._id] || "case summary, referral reason, safe contact preference")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const consentStatement = onwardConsentByReferralId[item.referral._id]?.trim()
      || "I consent for this provider to refer me onward and share the minimum information listed here so the next service can help.";
    if (!destinationServiceId || !reason || reason.length < 12) {
      setNotice({ type: "error", text: "Choose the next service and add an onward referral reason of at least 12 characters." });
      return;
    }
    if (informationShared.length === 0) {
      setNotice({ type: "error", text: "Record the minimum information shared for the onward referral." });
      return;
    }
    void run(async () => {
      const result = await createOnwardReferral({
        parentReferralId: item.referral._id,
        destinationServiceId: destinationServiceId as Id<"justice_services">,
        reason,
        informationShared,
        consentMethod: "documented_verbal",
        consentStatement,
        consentEvidenceNote: `Onward referral consent recorded by ${userName} from provider workspace.`,
      });
      setOnwardServiceByReferralId((current) => ({ ...current, [item.referral._id]: "" }));
      setOnwardReasonByReferralId((current) => ({ ...current, [item.referral._id]: "" }));
      setOnwardInfoByReferralId((current) => ({ ...current, [item.referral._id]: "" }));
      setOnwardConsentByReferralId((current) => ({ ...current, [item.referral._id]: "" }));
      setNotice({ type: "success", text: `${result.publicId} created as an onward referral.` });
    });
  }

  const paralegal = dashboardData && "paralegal" in dashboardData ? dashboardData.paralegal : null;
  const openAssignments = inbox?.filter((item) => item.case !== null).length ?? 0;
  const openReferrals = referralInbox?.filter((item) => !["declined", "closed"].includes(item.referral.status)).length ?? 0;
  const activeCases = cases?.filter((record) => !["closed", "closed_unresolved"].includes(record.status)).length ?? 0;
  const appointments = caseDetail?.appointments ?? [];
  const pendingDocuments = documents?.filter((document) => document.status === "pending_review").length ?? 0;
  const userName = paralegal?.fullName ?? access?.user.name ?? user?.fullName ?? "Service provider";
  const roleLabel = access?.roles.includes("provider_staff") ? "Provider staff" : "Community paralegal";

  return (
    <div className="min-h-screen bg-[#f7f4f2] text-neutral-900">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading text-sm font-black text-white">LSF</div>
            <div>
              <p className="mb-0 font-heading text-base font-bold leading-tight">Haki Yangu Provider</p>
              <p className="mb-0 text-xs text-neutral-500">Assignments, cases, appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 sm:block">
              Public website
            </Link>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary font-heading text-2xl font-black text-white">
              {userName.charAt(0)}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Human assistance network</p>
              <h1 className="text-3xl sm:text-4xl">{userName}</h1>
              <p className="mb-0 text-base text-neutral-600">{roleLabel}{paralegal?.region ? ` · ${paralegal.region}` : ""}</p>
              {paralegal && (
                <p className="mb-0 mt-2 text-sm font-semibold text-primary">
                  {availabilityLabel(paralegal.availabilityStatus)} · {paralegal.weeklyCapacity ?? 3} case/week capacity
                  {paralegal.workingHours ? ` · ${paralegal.workingHours}` : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {paralegal && <ParalegalProfileEdit paralegal={paralegal} />}
            <div className="inline-flex rounded-xl border bg-white p-1 shadow-sm">
              <button onClick={() => setTab("inbox")} className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "inbox" ? "bg-primary text-white" : "text-neutral-600"}`}>
                Inbox
              </button>
              <button onClick={() => setTab("cases")} className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "cases" ? "bg-primary text-white" : "text-neutral-600"}`}>
                Cases
              </button>
              <button onClick={() => setTab("referrals")} className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "referrals" ? "bg-primary text-white" : "text-neutral-600"}`}>
                Referrals
              </button>
            </div>
          </div>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-5">
          <Metric icon={<Inbox className="h-5 w-5" />} value={openAssignments} label="Assignment offers" tone="primary" />
          <Metric icon={<ChevronRight className="h-5 w-5" />} value={openReferrals} label="Referral inbox" tone="orange" />
          <Metric icon={<BriefcaseBusiness className="h-5 w-5" />} value={activeCases} label="Active cases" tone="teal" />
          <Metric icon={<FileText className="h-5 w-5" />} value={pendingDocuments} label="Documents to review" tone="primary" />
          <Metric icon={<CalendarClock className="h-5 w-5" />} value={appointments.length} label="Selected case appointments" tone="orange" />
        </section>

        {notice && (
          <div role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
            {notice.text}
          </div>
        )}

        {tab === "referrals" ? (
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl">Referral inbox</h2>
              <p className="mb-0 text-sm text-neutral-500">
                Referrals assigned to your provider account. Accept, return,
                schedule, deliver, or close only after you have real contact
                evidence.
              </p>
            </div>
            <div className="divide-y">
              {referralInbox === undefined && <p className="p-5 text-sm text-neutral-500">Loading referral inbox...</p>}
              {referralInbox?.length === 0 && (
                <div className="p-10 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-teal-600" />
                  <p className="mb-1 font-bold">No referrals assigned to you</p>
                  <p className="mb-0 text-sm text-neutral-500">LSF staff-assigned destination referrals will appear here.</p>
                </div>
              )}
              {referralInbox?.map((item) => (
                <div key={item.referral._id} className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">{item.referral.publicId}</h3>
                      <StatusPill value={item.referral.status} urgent={["created", "returned", "escalated"].includes(item.referral.status)} />
                      {item.case && <StatusPill value={item.case.status} urgent={item.case.priority !== "standard"} />}
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {item.case?.publicId ?? "Case unavailable"} · {item.destinationService?.name ?? "Destination service"}
                    </p>
                    <p className="mb-4 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-neutral-700">{item.referral.reason}</p>
                    <div className="mb-4 grid gap-2 text-xs text-neutral-600 sm:grid-cols-2">
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">Information shared</p>
                        <p className="mb-0">{item.referral.informationShared.join(", ") || "Not recorded"}</p>
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">Consent proof</p>
                        <p className="mb-0 capitalize">{item.consent?.method?.replaceAll("_", " ") ?? "Not recorded"}</p>
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">Service point</p>
                        <p className="mb-0">
                          {item.destinationService
                            ? `${item.destinationService.district}, ${item.destinationService.region}`
                            : "Not available"}
                        </p>
                      </div>
                      {item.onwardReferral && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-3">
                          <p className="mb-1 font-bold text-neutral-800">Onward referral</p>
                          <p className="mb-0">{item.onwardReferral.publicId}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {item.events.slice(-3).map((event) => (
                        <div key={event._id} className="rounded-lg border bg-white p-3 text-xs text-neutral-600">
                          <p className="mb-1 font-bold capitalize text-neutral-800">{event.type.replaceAll("_", " ")}</p>
                          <p className="mb-0">{formatDate(event.occurredAt)}{event.note ? ` · ${event.note}` : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-[#fbf7f8] p-4">
                    <p className="mb-3 text-sm font-bold">Destination response</p>
                    <Textarea
                      value={referralNotesById[item.referral._id] ?? ""}
                      onChange={(event) => setReferralNotesById((current) => ({ ...current, [item.referral._id]: event.target.value }))}
                      maxLength={1200}
                      placeholder="Add evidence note, appointment note, decline reason, or closure summary."
                      className="mb-3 min-h-24 bg-white"
                    />
                    <div className="grid gap-2">
                      {["created", "destination_notified"].includes(item.referral.status) && (
                        <>
                          <Button disabled={pending} onClick={() => updateReferral(item.referral._id, "accepted")}>Accept referral</Button>
                          <Button disabled={pending} variant="outline" onClick={() => updateReferral(item.referral._id, "declined")}>Decline referral</Button>
                          <Button disabled={pending} variant="outline" onClick={() => updateReferral(item.referral._id, "returned")}>Return to LSF</Button>
                        </>
                      )}
                      {item.referral.status === "accepted" && (
                        <>
                          <Button disabled={pending} onClick={() => updateReferral(item.referral._id, "scheduled")}>Mark scheduled</Button>
                          <Button disabled={pending} variant="outline" onClick={() => updateReferral(item.referral._id, "service_delivered")}>Service delivered</Button>
                        </>
                      )}
                      {item.referral.status === "scheduled" && (
                        <Button disabled={pending} onClick={() => updateReferral(item.referral._id, "service_delivered")}>Service delivered</Button>
                      )}
                      {["accepted", "scheduled", "service_delivered", "returned"].includes(item.referral.status) && (
                        <Button disabled={pending} variant="outline" onClick={() => updateReferral(item.referral._id, "closed")}>Close referral</Button>
                      )}
                      {["accepted", "scheduled", "service_delivered"].includes(item.referral.status) && !item.onwardReferral && (
                        <div className="mt-3 rounded-xl border border-primary/15 bg-white p-3">
                          <p className="mb-2 text-sm font-bold">Refer onward</p>
                          <select
                            value={onwardServiceByReferralId[item.referral._id] ?? ""}
                            onChange={(event) => setOnwardServiceByReferralId((current) => ({ ...current, [item.referral._id]: event.target.value }))}
                            className="mb-2 h-10 w-full rounded-lg border bg-white px-3 text-sm"
                          >
                            <option value="">Choose next service...</option>
                            {publicServices?.filter((service) => service._id !== item.referral.destinationServiceId && service.referralCapability).map((service) => (
                              <option key={String(service._id)} value={String(service._id)}>
                                {service.name} · {service.district}
                              </option>
                            ))}
                          </select>
                          <Textarea
                            value={onwardReasonByReferralId[item.referral._id] ?? ""}
                            onChange={(event) => setOnwardReasonByReferralId((current) => ({ ...current, [item.referral._id]: event.target.value }))}
                            placeholder="Why does this beneficiary need onward referral?"
                            className="mb-2 min-h-20 bg-white text-sm"
                          />
                          <Textarea
                            value={onwardInfoByReferralId[item.referral._id] ?? ""}
                            onChange={(event) => setOnwardInfoByReferralId((current) => ({ ...current, [item.referral._id]: event.target.value }))}
                            placeholder="Comma-separated minimum information shared"
                            className="mb-2 min-h-16 bg-white text-sm"
                          />
                          <Textarea
                            value={onwardConsentByReferralId[item.referral._id] ?? ""}
                            onChange={(event) => setOnwardConsentByReferralId((current) => ({ ...current, [item.referral._id]: event.target.value }))}
                            placeholder="Consent statement. Leave blank for the standard onward-consent statement."
                            className="mb-2 min-h-16 bg-white text-sm"
                          />
                          <Button disabled={pending || publicServices === undefined} variant="outline" onClick={() => createOnward(item)} className="w-full">
                            Create onward referral
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "inbox" ? (
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl">Assignment inbox</h2>
              <p className="mb-0 text-sm text-neutral-500">Review the minimum case summary before accepting access responsibility.</p>
            </div>
            <div className="divide-y">
              {inbox === undefined && <p className="p-5 text-sm text-neutral-500">Loading secure assignments...</p>}
              {inbox?.length === 0 && (
                <div className="p-10 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-teal-600" />
                  <p className="mb-1 font-bold">No pending assignments</p>
                  <p className="mb-0 text-sm text-neutral-500">Accepted cases will stay available in your case workspace.</p>
                </div>
              )}
              {inbox?.map((item) => (
                <div key={item.assignment._id} className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">{item.case?.publicId ?? "Unavailable case"}</h3>
                      {item.case && <StatusPill value={item.case.status} urgent={item.case.priority !== "standard"} />}
                    </div>
                    <p className="mb-4 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-neutral-700">{item.case?.summary ?? "This case is no longer available."}</p>
                    <p className="mb-0 text-xs text-neutral-500">Offered {formatDate(item.assignment.offeredAt)}</p>
                  </div>
                  <div className="rounded-xl border bg-[#fbf7f8] p-4">
                    {(() => {
                      const expiresAt = item.assignment.expiresAt ?? item.assignment.offeredAt + 48 * 60 * 60 * 1000;
                      const remainingHours = hoursUntil(expiresAt);
                      return (
                        <div className={`mb-3 rounded-xl border p-3 text-sm ${remainingHours !== null && remainingHours <= 6 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-primary/10 bg-primary/5 text-primary"}`}>
                          <p className="mb-1 font-bold">Response window</p>
                          <p className="mb-0">
                            Expires {formatDate(expiresAt)}
                            {remainingHours !== null ? ` · about ${remainingHours} hour${remainingHours === 1 ? "" : "s"} left` : ""}
                          </p>
                        </div>
                      );
                    })()}
                    <p className="mb-3 text-sm font-bold">Decision</p>
                    <Textarea value={declineReason} onChange={(event) => setDeclineReason(event.target.value)} maxLength={500} placeholder="Reason if declining" className="mb-3 min-h-20 bg-white" />
                    <div className="grid grid-cols-2 gap-2">
                      <Button disabled={pending || !item.case} onClick={() => acceptAssignment(item)} className="bg-primary">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button disabled={pending} variant="outline" onClick={() => declineAssignment(item)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="grid min-h-[640px] overflow-hidden rounded-2xl border bg-white shadow-sm lg:grid-cols-[390px_1fr]">
            <div className={`${selectedCaseId ? "hidden lg:block" : "block"} border-r border-neutral-200`}>
              <div className="border-b p-5">
                <h2 className="text-xl">My cases</h2>
                <p className="mb-0 text-sm text-neutral-500">Cases become visible after assignment acceptance.</p>
              </div>
              <div className="max-h-[740px] overflow-y-auto">
                {cases === undefined && <p className="p-5 text-sm text-neutral-500">Loading cases...</p>}
                {cases?.length === 0 && (
                  <div className="p-8 text-center">
                    <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                    <p className="mb-1 font-bold">No accepted cases yet</p>
                    <p className="mb-0 text-sm text-neutral-500">Accept an assignment to start case work.</p>
                  </div>
                )}
                {cases?.map((record) => (
                  <button key={record._id} onClick={() => { setSelectedCaseId(record._id); setCaseTab("timeline"); }} className="w-full border-b p-4 text-left hover:bg-[#fbf7f8] focus-visible:bg-[#fbf7f8]">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold">{record.publicId}</span>
                      <StatusPill value={record.status} urgent={record.priority !== "standard"} />
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-neutral-600">{record.summary}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Updated {formatDate(record.updatedAt)}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${selectedCaseId ? "block" : "hidden lg:flex"} min-w-0 flex-col`}>
              {!selectedCaseId || !caseDetail ? (
                <div className="m-auto max-w-sm p-8 text-center">
                  <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-primary/40" />
                  <h2 className="mb-2 text-xl">Select a case</h2>
                  <p className="mb-0 text-sm text-neutral-500">Work from the case timeline, messages, appointments, and outcome record.</p>
                </div>
              ) : (
                <div className="p-4 sm:p-7">
                  <button onClick={() => setSelectedCaseId(null)} className="mb-5 flex items-center gap-2 text-sm font-bold text-primary lg:hidden">
                    <ArrowLeft className="h-4 w-4" />
                    Back to cases
                  </button>
                  <div className="mb-5 flex flex-col justify-between gap-3 border-b pb-5 xl:flex-row xl:items-start">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl">{caseDetail.case.publicId}</h2>
                        <StatusPill value={caseDetail.case.status} urgent={caseDetail.case.priority !== "standard"} />
                      </div>
                      <p className="mb-0 text-sm text-neutral-500">Opened {formatDate(caseDetail.case.createdAt)}</p>
                    </div>
                    {nextStatuses[caseDetail.case.status]?.length > 0 && (
                      <select
                        defaultValue=""
                        disabled={pending}
                        onChange={(event) => {
                          if (event.target.value) changeCaseStatus(event.target.value);
                          event.currentTarget.value = "";
                        }}
                        className="h-10 rounded-xl border bg-white px-3 text-sm"
                      >
                        <option value="" disabled>Update status...</option>
                        {nextStatuses[caseDetail.case.status].map((status) => (
                          <option key={status} value={status} disabled={status === "closed" && !caseDetail.closureReadiness?.canClose}>
                            {caseLabels[status]}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mb-5 rounded-2xl bg-[#f8f2f4] p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Case summary</p>
                    <p className="mb-0 whitespace-pre-wrap leading-7">{caseDetail.case.summary}</p>
                  </div>

                  {caseDetail.closureReadiness && (
                    <div className={`mb-5 rounded-xl border p-4 ${caseDetail.closureReadiness.canClose ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"}`}>
                      <h3 className="mb-3 flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5 text-primary" />Closure readiness</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <ClosureItem label="Outcome recorded" ready={caseDetail.closureReadiness.requirements.outcomeRecorded} />
                        <ClosureItem label="Beneficiary-safe summary" ready={caseDetail.closureReadiness.requirements.beneficiarySafeSummary} />
                        <ClosureItem label="Documents reviewed" ready={caseDetail.closureReadiness.requirements.documentsReviewed} detail={`${caseDetail.closureReadiness.pendingDocumentCount} pending`} />
                        <ClosureItem label="Feedback requested" ready={caseDetail.closureReadiness.requirements.feedbackRequested} />
                      </div>
                      {!caseDetail.closureReadiness.canClose && <p className="mb-0 mt-3 text-sm font-semibold text-orange-800">Final close is blocked until every closure requirement is complete.</p>}
                    </div>
                  )}

                  <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border bg-white p-1">
                    <TabButton active={caseTab === "timeline"} icon={<Clock3 className="h-4 w-4" />} label="Timeline" onClick={() => setCaseTab("timeline")} />
                    <TabButton active={caseTab === "messages"} icon={<MessageSquareText className="h-4 w-4" />} label="Messages" onClick={() => setCaseTab("messages")} />
                    <TabButton active={caseTab === "documents"} icon={<FileText className="h-4 w-4" />} label="Documents" onClick={() => setCaseTab("documents")} />
                    <TabButton active={caseTab === "appointments"} icon={<CalendarClock className="h-4 w-4" />} label="Appointments" onClick={() => setCaseTab("appointments")} />
                    <TabButton active={caseTab === "outcome"} icon={<FileCheck2 className="h-4 w-4" />} label="Outcome" onClick={() => setCaseTab("outcome")} />
                  </div>

                  {caseTab === "timeline" && (
                    <div className="space-y-3">
                      {caseDetail.assignmentHistory.length > 0 && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-4">
                          <h3 className="mb-3 flex items-center gap-2 text-base">
                            <UserRoundCheck className="h-5 w-5 text-primary" />
                            Assignment history
                          </h3>
                          <div className="grid gap-2">
                            {caseDetail.assignmentHistory.map((item) => (
                              <div key={item.assignment._id} className="rounded-lg border bg-white p-3 text-sm">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <span className="font-bold">{item.assigneeName}</span>
                                  <StatusPill value={item.assignment.status} urgent={item.history.isOverdue || item.assignment.status === "expired"} />
                                </div>
                                <p className="mb-1 text-xs text-neutral-500">
                                  Offered by {item.offeredByName} · {formatDate(item.assignment.offeredAt)}
                                </p>
                                <p className="mb-0 text-xs text-neutral-500">
                                  {item.history.responseHours !== null ? `Responded after ${item.history.responseHours}h` : `${item.history.offerAgeHours}h open`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {caseDetail.events.map((event) => (
                        <div key={event._id} className="relative rounded-xl border p-4 pl-11">
                          <div className="absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10"><div className="h-2 w-2 rounded-full bg-primary" /></div>
                          <p className="mb-1 text-sm font-bold">{eventTitle(event)}</p>
                          {eventDetail(event) && <p className="mb-1 text-sm text-neutral-600">{eventDetail(event)}</p>}
                          <p className="mb-0 text-xs text-neutral-500">{formatDate(event.occurredAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {caseTab === "messages" && (
                    <div className="grid gap-4">
                      <div className="max-h-[420px] overflow-y-auto rounded-xl border bg-[#fbfafa] p-4">
                        {messages === undefined && <p className="text-sm text-neutral-500">Loading messages...</p>}
                        {messages?.length === 0 && <p className="py-8 text-center text-sm text-neutral-500">No case messages yet.</p>}
                        {messages?.map((item) => (
                          <div key={item._id} className="mb-3 max-w-[780px] rounded-xl border bg-white p-3">
                            <p className="mb-1 whitespace-pre-wrap text-sm leading-6">{item.body}</p>
                            <p className="mb-0 text-xs text-neutral-400">{formatDate(item.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={4000} placeholder="Write a case-scoped message..." className="min-h-24 flex-1" />
                        <Button disabled={pending || !message.trim()} onClick={sendMessage} className="sm:self-end">
                          <Send className="mr-2 h-4 w-4" />
                          Send
                        </Button>
                      </div>
                    </div>
                  )}

                  {caseTab === "documents" && (
                    <div className="grid gap-4">
                      {documents === undefined && <p className="rounded-xl border p-5 text-sm text-neutral-500">Loading case documents...</p>}
                      {documents?.length === 0 && (
                        <div className="rounded-xl border bg-[#fbfafa] p-6 text-center">
                          <FileText className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                          <p className="mb-1 font-bold">No documents uploaded</p>
                          <p className="mb-0 text-sm text-neutral-500">Documents uploaded by the beneficiary or case worker will appear here for review.</p>
                        </div>
                      )}
                      {documents?.map((document) => (
                        <div key={document._id} className="rounded-xl border p-4">
                          <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                            <div>
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <p className="mb-0 font-bold">{document.name}</p>
                                <StatusPill value={document.status} urgent={document.status === "pending_review"} />
                              </div>
                              <p className="mb-0 text-sm capitalize text-neutral-500">{document.category.replaceAll("_", " ")} · {(document.size / 1024 / 1024).toFixed(2)} MB</p>
                              {document.note && <p className="mb-0 mt-2 text-sm text-neutral-600">{document.note}</p>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {document.url && (
                                <a href={document.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-lg border px-3 text-sm font-bold text-primary hover:bg-primary/5">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open
                                </a>
                              )}
                              {document.status === "pending_review" && (
                                <>
                                  <Button disabled={pending} size="sm" onClick={() => setDocumentStatus(document._id, "accepted")}>Accept</Button>
                                  <Button disabled={pending} size="sm" variant="outline" onClick={() => setDocumentStatus(document._id, "rejected")}>Reject</Button>
                                </>
                              )}
                            </div>
                          </div>
                          {document.reviewNotes && <p className="mb-0 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">{document.reviewNotes}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {caseTab === "appointments" && (
                    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                      <div className="space-y-3">
                        {appointments.length === 0 && <p className="rounded-xl border p-5 text-sm text-neutral-500">No appointments scheduled for this case.</p>}
                        {appointments.map((appointment) => (
                          <div key={appointment._id} className="rounded-xl border p-4">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <p className="mb-0 font-bold">{formatDate(appointment.startsAt)}</p>
                              <StatusPill value={appointment.status} />
                            </div>
                            <p className="mb-0 text-sm capitalize text-neutral-600">{appointment.mode.replaceAll("_", " ")}{appointment.location ? ` · ${appointment.location}` : ""}</p>
                            {appointment.statusNote && <p className="mb-0 mt-2 rounded-lg bg-neutral-50 p-2 text-sm text-neutral-600">{appointment.statusNote}</p>}
                            {appointment.status === "scheduled" && (
                              <div className="mt-3 grid gap-2">
                                <Textarea
                                  value={appointmentStatusNotes[appointment._id] ?? ""}
                                  onChange={(event) => setAppointmentStatusNotes((current) => ({ ...current, [appointment._id]: event.target.value }))}
                                  maxLength={800}
                                  placeholder="Optional lifecycle note for LSF and the case record..."
                                  className="min-h-[76px] text-sm"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <Button disabled={pending} size="sm" onClick={() => changeAppointmentStatus(appointment._id, "completed")}>Complete</Button>
                                  <Button disabled={pending} size="sm" variant="outline" onClick={() => changeAppointmentStatus(appointment._id, "cancelled")}>Cancel</Button>
                                  <Button disabled={pending} size="sm" variant="outline" onClick={() => changeAppointmentStatus(appointment._id, "missed")}>No-show</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-base"><CalendarClock className="h-5 w-5 text-primary" />Schedule appointment</h3>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="appointment-date">Date and time</label>
                        <Input id="appointment-date" type="datetime-local" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} className="mb-3" />
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="appointment-mode">Mode</label>
                        <select id="appointment-mode" value={appointmentMode} onChange={(event) => setAppointmentMode(event.target.value as typeof appointmentMode)} className="mb-3 h-10 w-full rounded-md border bg-white px-3 text-sm">
                          <option value="phone">Phone</option>
                          <option value="in_person">In person</option>
                          <option value="remote">Remote</option>
                        </select>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="appointment-location">Location or call note</label>
                        <Input id="appointment-location" value={appointmentLocation} onChange={(event) => setAppointmentLocation(event.target.value)} maxLength={300} placeholder="Optional" />
                        <Button disabled={pending} onClick={schedule} className="mt-4 w-full">Schedule and notify</Button>
                      </div>
                    </div>
                  )}

                  {caseTab === "outcome" && (
                    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                      <div className="rounded-xl border bg-[#fbfafa] p-5">
                        <h3 className="mb-3 flex items-center gap-2 text-base"><FileCheck2 className="h-5 w-5 text-primary" />Outcome record</h3>
                        <p className="mb-0 text-sm leading-6 text-neutral-600">Record the final assistance outcome only when the case work has enough factual closure. This moves the case to resolved and triggers beneficiary feedback.</p>
                      </div>
                      <div className="rounded-xl border p-4">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="outcome-code">Outcome</label>
                        <select id="outcome-code" value={outcomeCode} onChange={(event) => setOutcomeCode(event.target.value)} className="mb-3 h-10 w-full rounded-md border bg-white px-3 text-sm">
                          {outcomeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="outcome-summary">Summary</label>
                        <Textarea id="outcome-summary" value={outcomeSummary} onChange={(event) => setOutcomeSummary(event.target.value)} maxLength={3000} className="min-h-32" />
                        <Button disabled={pending || caseDetail.case.status === "resolved" || caseDetail.case.status === "closed"} onClick={saveOutcome} className="mt-4 w-full">Record outcome</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: "primary" | "teal" | "orange" }) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : tone === "teal" ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700";
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
      <p className="mb-1 text-2xl font-bold">{value}</p>
      <p className="mb-0 text-sm text-neutral-500">{label}</p>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${active ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
      {icon}
      {label}
    </button>
  );
}

function ClosureItem({ label, ready, detail }: { label: string; ready: boolean; detail?: string }) {
  return (
    <div className="rounded-lg border bg-white/80 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-neutral-800">{label}</span>
        <StatusPill value={ready ? "Ready" : "Missing"} urgent={!ready} />
      </div>
      {detail && <p className="mb-0 mt-1 text-xs text-neutral-500">{detail}</p>}
    </div>
  );
}

export default ParalegalDashboard;
