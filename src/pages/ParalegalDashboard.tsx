import { LoadingText } from '@/components/shared/BrandLoading';
import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader, WorkStats, WorkAction } from "@/components/dashboard/WorkArea";
import { displayLabel, type Locale } from "../../shared/plainLanguage";
import { usePlainError } from "@/i18n/usePlainError";
import { useLanguage } from "@/providers/LanguageProvider";
import { useDateFormat } from "@/i18n/useDateFormat";
import { useStatusLabel } from "@/i18n/useStatusLabel";
import { useCopy } from "@/i18n/useCopy";
import CaseReferralRequests from "@/components/paralegal/CaseReferralRequests";
import CasePresence from "@/components/location/CasePresence";
import { workCaseJourney, finalChecks, workCaseBucket } from "../../shared/workCaseJourney";
import ProviderOverview from '@/components/provider/ProviderOverview';
import ProviderRecords from '@/components/provider/ProviderRecords';
import { destinationActions, decisionLabels, referralLabels } from '../../mobile/src/provider/referralFlow';
import { CaseDocumentUpload, CaseVoiceNote } from "@/components/paralegal/CaseMedia";
import WorkTools from "@/components/paralegal/WorkTools";
import ReferralProposal from "@/components/paralegal/ReferralProposal";
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
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import ParalegalIllustration from "@/components/paralegal/ParalegalIllustration";
import { isParalegalReady } from "../../convex/lib/paralegalAccess";
import ParalegalProfileEdit from "@/components/paralegal/ParalegalProfileEdit";

type AssignmentInbox = FunctionReturnType<typeof api.caseManagement.assignmentInbox>;
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import PersonalAvatar from '@/components/dashboard/PersonalAvatar';

type ProviderTab = "home" | "appointments" | "documents" | "tools" | "inbox" | "cases" | "referrals";
type CaseSubTab = "work" | "overview" | "referrals" | "timeline" | "messages" | "documents" | "appointments" | "outcome";
type DestinationReferralStatus = "accepted" | "declined" | "scheduled" | "service_delivered" | "returned" | "closed";

const caseLabels: Record<string, string> = {
  under_review: "Under review",
  waiting_for_information: "Waiting for information",
  assignment_pending: "Waiting for a helper",
  assigned: "Ready to help",
  appointment_scheduled: "Appointment scheduled",
  referred: "Referred",
  assistance_underway: "Help in progress",
  resolved: "Result recorded",
  closed_unresolved: "Result: not resolved",
  closed: "Closed",
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
    timeZone: "Africa/Dar_es_Salaam",
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

function eventTitle(event: { publicLabelKey?: string; type: string }, locale: Locale) {
  return displayLabel(event.type, locale);
}

function eventDetail(event: { type: string; metadata?: unknown }, locale: Locale) {
  if (event.type !== "appointment_requested" || !event.metadata || typeof event.metadata !== "object") return null;
  const metadata = event.metadata as { preferredMode?: string; preferredTime?: string; note?: string };
  const detail = [
    metadata.preferredMode ? `${locale === "sw" ? "Njia" : "Method"}: ${displayLabel(metadata.preferredMode, locale)}` : null,
    metadata.preferredTime ? `${locale === "sw" ? "Muda anaopendelea" : "Preferred time"}: ${metadata.preferredTime}` : null,
    metadata.note ? `${locale === "sw" ? "Maelezo" : "Note"}: ${metadata.note}` : null,
  ].filter(Boolean);
  return detail.length ? detail.join(" · ") : null;
}

function statusClass(value: string) {
  if (["resolved", "closed"].includes(value)) return "bg-emerald-100 text-emerald-800";
  if (["closed_unresolved", "referred"].includes(value)) return "bg-orange-100 text-orange-800";
  return "bg-primary/10 text-primary";
}

function StatusPill({ value, urgent = false }: { value: string; urgent?: boolean }) {
  const { locale } = useLanguage();
  const statusLabel = useStatusLabel();
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgent ? "bg-orange-100 text-orange-800" : statusClass(value)}`}>
      {locale === "sw" ? statusLabel(value) : (caseLabels[value] ?? referralLabels[value]?.en ?? statusLabel(value))}
    </span>
  );
}

const ParalegalDashboard = () => {
  const readError = usePlainError();
  const { locale } = useLanguage();
  const formatDate = useDateFormat();
  const statusLabel = useStatusLabel();
  const c = useCopy();
  const { greeting: greetingEn, greetingSw } = usePersonalGreeting();
  const greeting = locale === "sw" ? greetingSw : greetingEn;
  const { signOut } = useAuth();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const access = useQuery(api.users.currentAccess);
  const organisationStaff = access?.roles.includes("provider_staff");
  const requestedTab = searchParams.get("tab");
  const tab: ProviderTab = ["home", "appointments", "documents", "tools", "inbox", "cases", "referrals"].includes(requestedTab ?? "") ? requestedTab as ProviderTab : organisationStaff ? "home" : "inbox";
  const setTab = (next: ProviderTab) => setSearchParams((current) => {
    const updated = new URLSearchParams(current);
    updated.set("tab", next);
    setWorkStatus(next === "cases" ? "active" : "all");
    return updated;
  });
  const requestedSection = searchParams.get("section");
  const caseTab: CaseSubTab = ["work", "overview", "timeline", "messages", "documents", "appointments", "referrals", "outcome"].includes(requestedSection ?? "") ? requestedSection as CaseSubTab : "overview";
  const caseWorkOpen = caseTab === "work";
  const setCaseTab = (next: CaseSubTab) => setSearchParams(current => { const updated = new URLSearchParams(current); updated.set("section", next); return updated; });
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | null>(null);
  const [workSearch, setWorkSearch] = useState("");
  const [workStatus, setWorkStatus] = useState(requestedTab === "cases" ? "active" : "all");
  const [reviewingOffer, setReviewingOffer] = useState<string | null>(searchParams.get("offer"));
  const [declineReason, setDeclineReason] = useState("");
  const [message, setMessage] = useState("");
  const messageAttempt = useRef<{ caseId: string; body: string; id: string } | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentMode, setAppointmentMode] = useState<"in_person" | "phone" | "remote">("phone");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentStatusNotes, setAppointmentStatusNotes] = useState<Record<string, string>>({});
  const [pendingStatus, setPendingStatus] = useState("");
  const [referralDecision, setReferralDecision] = useState<{ id: string; status: DestinationReferralStatus } | null>(null);
  const [expandedReferralHistory, setExpandedReferralHistory] = useState<Record<string, boolean>>({});
  const [referralNotesById, setReferralNotesById] = useState<Record<string, string>>({});
  const [outcomeCode, setOutcomeCode] = useState(outcomeOptions[0].value);
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [reviewingOutcome, setReviewingOutcome] = useState(false);
  const [outcomeResolution, setOutcomeResolution] = useState<"resolved" | "closed_unresolved">("resolved");
  const [documentReviewNotes, setDocumentReviewNotes] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const inbox = useQuery(api.caseManagement.assignmentInbox);
  const cases = useQuery(api.caseManagement.myCases);
  const openReferralInbox = useQuery(api.referrals.myDestinationQueue, {});
  const closedReferrals = useQuery(api.referrals.myDestinationQueue, { status: "closed" });
  const declinedReferrals = useQuery(api.referrals.myDestinationQueue, { status: "declined" });
  const referralInbox = openReferralInbox && closedReferrals && declinedReferrals ? [...openReferralInbox, ...closedReferrals, ...declinedReferrals] : undefined;
  const caseDetail = useQuery(api.caseManagement.getCase, selectedCaseId ? { caseId: selectedCaseId } : "skip");

  const messages = useQuery(api.caseManagement.listMessages, selectedCaseId ? { caseId: selectedCaseId } : "skip");
  const documents = useQuery(api.caseManagement.listDocuments, selectedCaseId ? { caseId: selectedCaseId } : "skip");
  const dashboardData = useQuery(
    api.paralegals.getDashboardData,
    user?.emailAddresses?.[0]?.emailAddress ? { email: user.emailAddresses[0].emailAddress } : "skip",
  );

  const application = useQuery(api.paralegals.getMyApplication, access?.roles.includes("paralegal") ? {} : "skip");
  const readyForOffers = !access?.roles.includes("paralegal") || isParalegalReady(application);

  const respondToAssignment = useMutation(api.caseManagement.respondToAssignment);
  const updateCaseStatus = useMutation(api.caseManagement.updateStatus);
  const sendCaseMessage = useMutation(api.caseManagement.sendMessage);
  const reviewDocument = useMutation(api.caseManagement.reviewDocument);
  const scheduleAppointment = useMutation(api.caseManagement.scheduleAppointment);
  const scheduleAppointmentFromRequest = useMutation(api.caseManagement.scheduleAppointmentFromRequest);
  const updateAppointmentStatus = useMutation(api.caseManagement.updateAppointmentStatus);
  const recordOutcome = useMutation(api.caseManagement.recordOutcome);
  const respondToReferral = useMutation(api.referrals.respondAsDestination);

  useEffect(() => {
    if (!cases || tab !== "cases") return;
    const linkedCase = cases.find((item) => item._id === searchParams.get("case") && item.beneficiaryId !== access?.user._id);
    if ((linkedCase?._id ?? null) !== selectedCaseId) setSelectedCaseId(linkedCase?._id ?? null);
  }, [cases, selectedCaseId, searchParams, tab, access?.user._id]);

  useEffect(() => { setOutcomeSummary(""); setReviewingOutcome(false); setMessage(""); setAppointmentDate(""); setNotice(null); setPendingStatus(""); messageAttempt.current = null; }, [selectedCaseId]);
  const selectCase = (caseId: Id<"cases"> | null) => {
    setSelectedCaseId(caseId);
    setWorkStatus("active");
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("tab", "cases");
      updated.set("section", "overview");
      if (caseId) updated.set("case", caseId);
      else updated.delete("case");
      return updated;
    });
  };

  async function run(action: () => Promise<void>) {
    setPending(true);
    setNotice(null);
    try {
      await action();
    } catch (error) {
      setNotice({ type: "error", text: readError(error) });
    } finally {
      setPending(false);
    }
  }

  function acceptAssignment(item: AssignmentInbox[number]) {
    if (!readyForOffers) { setNotice({ type: "error", text: "Complete your paralegal setup before accepting a case." }); return; }
    void run(async () => {
      await respondToAssignment({ assignmentId: item.assignment._id, response: "accepted" });
      if (item.case) {
        selectCase(item.case._id);
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
    if (pendingStatus !== status) { setPendingStatus(status); return; }
    void run(async () => {
      await updateCaseStatus({
        caseId: selectedCaseId,
        status: status as Parameters<typeof updateCaseStatus>[0]["status"],
        expectedVersion: caseDetail.case.version,
      });
      setPendingStatus(""); setNotice({ type: "success", text: "Case status updated." });
    });
  }

  function sendMessage() {
    if (!selectedCaseId || !message.trim()) return;
    const body = message.trim();
    if (!messageAttempt.current || messageAttempt.current.caseId !== selectedCaseId || messageAttempt.current.body !== body) messageAttempt.current = { caseId: selectedCaseId, body, id: crypto.randomUUID() };
    const clientMessageId = messageAttempt.current.id;
    void run(async () => {
      await sendCaseMessage({
        caseId: selectedCaseId,
        body,
        clientMessageId,
      });
      messageAttempt.current = null; setMessage("");
    });
  }

  function schedule() {
    if (!selectedCaseId || !appointmentDate) {
      setNotice({ type: "error", text: "Choose a future appointment date and time." });
      return;
    }
    const startsAt = Date.parse(`${appointmentDate}:00+03:00`);
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

  function scheduleFromRequest(requestEventId: Id<"case_events">) {
    if (!selectedCaseId || !appointmentDate) {
      setNotice({ type: "error", text: "Choose a future appointment date and time before confirming this request." });
      return;
    }
    const startsAt = Date.parse(`${appointmentDate}:00+03:00`);
    if (!Number.isFinite(startsAt) || startsAt <= Date.now()) {
      setNotice({ type: "error", text: "Appointment must be in the future." });
      return;
    }
    void run(async () => {
      await scheduleAppointmentFromRequest({
        caseId: selectedCaseId,
        requestEventId,
        startsAt,
        mode: appointmentMode,
        location: appointmentLocation.trim() || undefined,
      });
      setAppointmentDate("");
      setAppointmentLocation("");
      setNotice({ type: "success", text: "Requested appointment confirmed and beneficiary notified." });
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
    if (status === "rejected" && (documentReviewNotes[documentId]?.trim().length ?? 0) < 10) { setNotice({ type: "error", text: "Explain what needs changing before rejecting the document." }); return; }
    void run(async () => {
      await reviewDocument({ documentId, status, reviewNotes: documentReviewNotes[documentId]?.trim() || undefined });
      setNotice({ type: "success", text: `Document ${status.replace("_", " ")}.` });
    });
  }

  function saveOutcome() {
    if (!selectedCaseId || outcomeSummary.trim().length < 20) {
      setNotice({ type: "error", text: "Add an outcome summary of at least 20 characters." });
      return;
    }
    if (!reviewingOutcome) { setReviewingOutcome(true); return; }
    void run(async () => {
      await recordOutcome({ caseId: selectedCaseId, outcomeCode, summary: outcomeSummary.trim(), resolution: caseDetail?.case.status === "resolved" ? "resolved" : caseDetail?.case.status === "assistance_underway" ? outcomeResolution : "closed_unresolved" });
      setOutcomeSummary(""); setReviewingOutcome(false);
      setNotice({ type: "success", text: "Outcome recorded and feedback request sent." });
    });
  }

  function updateReferral(
    referralId: Id<"referrals">,
    status: DestinationReferralStatus,
    confirmed = false,
  ) {
    const note = referralNotesById[referralId]?.trim();
    if (status !== "accepted" && (note?.length ?? 0) < 10) { setNotice({ type: "error", text: "Explain the reason or action in at least 10 characters." }); return; }
    if (!confirmed) { setReferralDecision({ id: referralId, status }); return; }
    void run(async () => {
      await respondToReferral({
        referralId,
        status,
        expectedUpdatedAt: referralInbox?.find(item => item.referral._id === referralId)?.referral.updatedAt,
        note: note || undefined,
        declineReason: status === "declined" ? note : undefined,
        finalDisposition: status === "closed" ? note : undefined,
      });
      setReferralDecision(null);
      setReferralNotesById((current) => ({ ...current, [referralId]: "" }));
      setNotice({ type: "success", text: `Referral: ${referralLabels[status]?.en ?? status}.` });
    });
  }

  const paralegal = dashboardData && "paralegal" in dashboardData ? dashboardData.paralegal : null;
  const openAssignments = inbox?.filter((item) => item.case !== null).length ?? 0;
  const openReferrals = referralInbox?.filter((item) => !["declined", "closed"].includes(item.referral.status)).length ?? 0;
  const workCases = cases?.filter(record => record.beneficiaryId !== access?.user._id);
  const activeCases = workCases?.filter(record => record.status !== "closed").length ?? 0;
  const journey = caseDetail ? workCaseJourney(caseDetail.case.status, Boolean(caseDetail.outcome), caseDetail.closureReadiness?.canClose, locale === "sw") : null;
  const matches = (...values: (string | undefined)[]) => values.join(" ").toLowerCase().includes(workSearch.trim().toLowerCase());
  const visibleInbox = inbox?.filter(item => matches(item.case?.publicId, item.case?.summary));
  const visibleReferrals = referralInbox?.filter(item => (!searchParams.get("referral") || item.referral._id === searchParams.get("referral")) && (workStatus === "all" || item.referral.status === workStatus) && matches(item.referral.publicId, item.case?.publicId, item.referral.reason, item.destinationService?.name));
  const visibleCases = workCases?.filter(record => matches(record.publicId, record.summary) && (workStatus === "all" || (workStatus === "active" ? record.status !== "closed" : workStatus === "finish" ? workCaseBucket(record.status) === "finish" : record.status === "closed")));
  const appointments = caseDetail?.appointments ?? [];
  const appointmentRequests =
    caseDetail?.events.filter((event) => {
      if (event.type !== "appointment_requested") return false;
      const metadata = event.metadata;
      return !metadata || typeof metadata !== "object" || !("scheduledAppointmentId" in metadata);
    }) ?? [];
  const pendingDocuments = documents?.filter((document) => document.status === "pending_review").length ?? 0;
  const userName = paralegal?.fullName ?? access?.user.name ?? user?.fullName ?? "Service provider";
  const roleLabel = access?.roles.includes("provider_staff") ? "Provider staff" : "Community paralegal";

  return (
    <div className="workspace-page text-neutral-900">
      <header className="workspace-legacy-header border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading text-sm font-black text-white">LSF</div>
            <div>
              <p className="mb-0 font-heading text-base font-bold leading-tight">{c("Haki Yangu Provider")}</p>
              <p className="mb-0 text-xs text-neutral-500">{c("Assignments, cases, appointments")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("Updates")}</Link>
            {access?.roles.includes("paralegal") && <Link to="/dashboard/paralegal/learning" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("Learning")}</Link>}
            <Link to="/dashboard/provider/organisation" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("My organisation")}</Link>
            <Link to="/" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 sm:block">{c("Public website")}</Link>
            <Button variant="outline" size="sm" onClick={() => signOut({ redirectUrl: '/' })}>
              <LogOut className="mr-2 h-4 w-4" />{c("Sign out")}</Button>
          </div>
        </div>
      </header>

      <main className="work-page mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-8">
        {tab !== 'home' && !selectedCaseId && <WorkHeader eyebrow={greeting} title={c(({inbox:'Cases to accept',cases:'My cases',referrals:'Referrals received',appointments:'Work appointments',documents:'Case documents',tools:'Work tools',home:'Today'})[tab])} description={c(({inbox:'Read each offer and check that you can help before accepting.',cases:'Open a case to see its next step.',referrals:'Read the shared details. Record your reply and the next step.',appointments:'Plan and follow meetings.',documents:'Read and add case files.',tools:'The right next step, in one place.',home:'Your work today'})[tab])} action={paralegal ? <ParalegalProfileEdit paralegal={paralegal}/> : undefined}/>}
        {paralegal && tab !== 'home' && !selectedCaseId && <p className="work-availability">{c(availabilityLabel(paralegal.availabilityStatus))}{paralegal.weeklyCapacity != null ? ` · ${locale==='sw'?'Hadi kesi':'Up to'} ${paralegal.weeklyCapacity} ${locale==='sw'?'kwa wiki':'cases a week'}` : ''}{paralegal.workingHours ? ` · ${paralegal.workingHours}` : ''}</p>}
        {!selectedCaseId && <nav className="work-tabs" aria-label={c("Provider work areas")}>
          {(organisationStaff ? ['home','inbox','cases','referrals','appointments','documents','tools'] : ['inbox','cases','referrals','tools']).map(value=><button key={value} type="button" aria-current={tab===value?'page':undefined} onClick={()=>{setTab(value as ProviderTab);setWorkSearch('');setWorkStatus(value==='cases'?'active':'all');}}>{c(({home:'Today',inbox:'Cases to accept',cases:'Cases',referrals:'Referrals received',appointments:'Appointments',documents:'Documents',tools:'Work tools'} as Record<string,string>)[value])}</button>)}
        </nav>}
        {tab === 'inbox' && <WorkStats items={[{label:c("Cases to accept"),value:inbox===undefined?undefined:openAssignments,href:`${organisationStaff?'/dashboard/provider':'/dashboard/paralegal'}?tab=inbox`,icon:Inbox},{label:c("Referrals received"),value:referralInbox===undefined?undefined:openReferrals,href:`${organisationStaff?'/dashboard/provider':'/dashboard/paralegal'}?tab=referrals`,icon:ChevronRight},{label:c("Active cases"),value:cases===undefined||access===undefined?undefined:activeCases,href:`${organisationStaff?'/dashboard/provider':'/dashboard/paralegal'}?tab=cases`,icon:BriefcaseBusiness}]}/>}
        {application?.syntheticDevelopmentFixture && !selectedCaseId && <p className="mb-4 text-sm text-neutral-600">{c("Test account. Work readiness is simulated for development testing.")}</p>}
        {!readyForOffers && access?.roles.includes("paralegal") && <div className="mb-5 flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-4"><ParalegalIllustration pose="safety" size={64} /><div><h2 className="mb-1 text-lg">{c("Finish your setup")}</h2><p className="mb-2 text-base text-neutral-600">{c("LSF approval, your documents and required training must be complete before you accept cases.")}</p><Link to="/dashboard/paralegal/onboarding" className="font-semibold text-primary underline">{c("View my setup")}</Link></div></div>}
        {["inbox", "cases", "referrals"].includes(tab) && (tab !== "inbox" || !!inbox?.length || !!workSearch) && !(tab === "cases" && selectedCaseId) && <div className="mb-5"><SearchFilterBar showFilters={tab !== "inbox"} value={workSearch} onChange={setWorkSearch} placeholder={tab === "inbox" ? c("Search offers") : tab === "referrals" ? c("Search referrals") : c("Search cases")} label={c("Status")} title={tab === "referrals" ? c("Choose referral status") : c("Choose case status")} count={workStatus !== "all" ? 1 : 0} onReset={() => setWorkStatus("all")}>
          {tab === "cases" ? <fieldset><legend className="mb-2 font-semibold">{c("Show cases")}</legend>{[["all", "All cases"], ["active", "Open cases"], ["finish", "Needs final checks"], ["closed", "Closed"]].map(([value, label]) => <label key={value} className="flex min-h-12 items-center gap-3"><input type="radio" name="case-status" checked={workStatus === value} onChange={() => setWorkStatus(value)} />{label}</label>)}</fieldset> : null}
          {tab === "referrals" && <label className="grid gap-2">{c("Referral status")}<select value={workStatus} onChange={e => setWorkStatus(e.target.value)} className="min-h-12 rounded-xl border p-2"><option value="all">{c("All referrals")}</option>{Object.entries(referralLabels).filter(([value]) => value !== "awaiting_beneficiary_consent").map(([value,label]) => <option key={value} value={value}>{label.en}</option>)}</select></label>}
        </SearchFilterBar></div>}

        {notice && (
          <div role="status" className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
            {notice.text}
          </div>
        )}

        {tab === "home" ? <ProviderOverview /> : tab === "appointments" || tab === "documents" ? <ProviderRecords key={tab} kind={tab} /> : tab === "tools" ? <WorkTools onOpenCase={id => { selectCase(id); setCaseTab("overview"); }} /> : tab === "referrals" ? (
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5 flex items-center gap-4"><ParalegalIllustration pose="direction" size={72} /><div className="flex-1">
              <h2 className="text-xl">{c("Referrals received")}</h2>{searchParams.get("referral") && <button className="text-sm font-semibold text-primary underline" onClick={() => setSearchParams(current => { const next = new URLSearchParams(current); next.delete("referral"); return next; })}>{c("View all referrals")}</button>}
              <p className="mb-0 text-sm text-neutral-500">{c("Read the shared details. Record your reply and the next step.")}</p>
            </div></div>
            <div className="divide-y">
              {referralInbox === undefined && <BrandLoading compact text={c("Loading referral inbox...")}/>}
              {referralInbox?.length === 0 && (
                <div className="p-10 text-center">
                  <div className="mb-3 flex justify-center"><ParalegalIllustration pose="review" size={80} /></div>
                  <p className="mb-1 font-bold">{c("No referrals assigned to you")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Referrals approved by the beneficiary and assigned to you will appear here.")}</p>
                </div>
              )}
              {referralInbox && referralInbox.length > 0 && visibleReferrals?.length === 0 && <p role="status" className="p-5">{c("No referrals match. Try another word or clear the search.")}</p>}
              {visibleReferrals?.map((item) => (
                <div key={item.referral._id} className="work-decision-row">
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
                        <p className="mb-1 font-bold text-neutral-800">{c("Information shared")}</p>
                        <p className="mb-0">{item.referral.informationShared.join(", ") || "Not recorded"}</p>
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{c("Consent proof")}</p>
                        <p className="mb-0 capitalize">{statusLabel(item.consent?.method) ?? "Not recorded"}</p>
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{c("Service point")}</p>
                        <p className="mb-0">
                          {item.destinationService
                            ? `${item.destinationService.district}, ${item.destinationService.region}`
                            : "Not available"}
                        </p>
                      </div>
                      {item.onwardReferral && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-3">
                          <p className="mb-1 font-bold text-neutral-800">{c("Onward referral")}</p>
                          <p className="mb-0">{item.onwardReferral.publicId}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(expandedReferralHistory[item.referral._id] ? item.events : item.events.slice(-3)).map((event) => (
                        <div key={event._id} className="rounded-lg border bg-white p-3 text-xs text-neutral-600">
                          <p className="mb-1 font-bold capitalize text-neutral-800">{statusLabel(event.type)}</p>
                          <p className="mb-0">{formatDate(event.occurredAt)}{event.note ? ` · ${event.note}` : ""}</p>
                        </div>
                      ))}
                    </div>
                    {item.events.length > 3 && <button type="button" aria-expanded={!!expandedReferralHistory[item.referral._id]} className="mt-3 min-h-11 text-sm font-semibold text-primary" onClick={() => setExpandedReferralHistory(current => ({ ...current, [item.referral._id]: !current[item.referral._id] }))}>{expandedReferralHistory[item.referral._id] ? c("Show recent steps") : "Show all steps"}</button>}
                  </div>
                  <div className="rounded-xl border bg-[#fbf7f8] p-4">
                    <p className="mb-3 text-sm font-bold">{c("Your reply")}</p>
                    {!(destinationActions[item.referral.status] ?? []).length ? <p className="mb-0 text-sm text-neutral-600">{c("There is no reply to record at this stage. Read the previous steps in the history.")}</p> : <>

                    <Textarea
                      value={referralNotesById[item.referral._id] ?? ""}
                      onChange={(event) => { setReferralDecision(null); setReferralNotesById((current) => ({ ...current, [item.referral._id]: event.target.value })); }}
                      maxLength={1200}
                      aria-label={c("What happened and what comes next?")}
                      placeholder={c("What happened? What is the next step?")}
                      className="mb-3 min-h-24 bg-white"
                    />
                    {referralDecision?.id === item.referral._id && <div className="mb-3 rounded-xl bg-teal-50 p-3"><p className="mb-2 text-sm">{c("Confirm this response. The beneficiary will receive an update.")}</p><Button variant="ghost" onClick={() => setReferralDecision(null)}>{c("Cancel")}</Button></div>}
                    <div className="grid gap-2">
                      {referralDecision?.id === item.referral._id ? <section aria-label={c("Review referral reply")} className="rounded-xl bg-teal-50 p-4"><h3 className="text-base">{decisionLabels[referralDecision.status].en}</h3><p className="whitespace-pre-wrap text-sm">{referralNotesById[item.referral._id]?.trim() || "You agree to receive this referral."}</p><p className="text-sm">{c("This reply will be saved to the referral record.")}</p><div className="flex flex-wrap gap-2"><Button disabled={pending} onClick={() => updateReferral(item.referral._id, referralDecision.status, true)}>{c("Confirm and save")}</Button><Button variant="outline" disabled={pending} onClick={() => setReferralDecision(null)}>{c("Back and edit")}</Button></div></section> : (destinationActions[item.referral.status] ?? []).map(action => <Button key={action} disabled={pending} variant={action === "accepted" || action === "service_delivered" ? "default" : "outline"} onClick={() => updateReferral(item.referral._id, action)}>{decisionLabels[action].en}</Button>)}
                      {["accepted", "scheduled", "service_delivered"].includes(item.referral.status) && !item.onwardReferral && (
                        <ReferralProposal caseId={item.referral.caseId} parentId={item.referral._id} excludeServiceId={item.referral.destinationServiceId} />
                      )}
                    </div></>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "inbox" ? (
          <section className="work-inbox-panel rounded-2xl border bg-white">
            <div className="divide-y">
              {inbox === undefined && <BrandLoading compact text={c("Loading secure assignments...")}/>}
              {inbox?.length === 0 && (
                <div className="p-10 text-center">
                  <div className="mb-3 flex justify-center"><ParalegalIllustration pose="review" size={80} /></div>
                  <p className="mb-1 font-bold">{c("No pending assignments")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Accepted cases will stay available in your case workspace.")}</p>
                </div>
              )}
              {inbox && inbox.length > 0 && visibleInbox?.length === 0 && <p role="status" className="p-5">{c("No offers match. Try another word or clear the search.")}</p>}
              {visibleInbox?.map((item) => (
                <div key={item.assignment._id} className="work-decision-row">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">{item.case?.publicId ?? "Unavailable case"}</h3>
                      {item.case && <StatusPill value={item.case.status} urgent={item.case.priority !== "standard"} />}
                    </div>
                    <p className="mb-4 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-neutral-700">{item.case?.summary ?? "This case is no longer available."}</p>
                    <p className="mb-0 text-xs text-neutral-500">{c("Offered ")}{formatDate(item.assignment.offeredAt)}</p>
                  </div>
                  <div className="rounded-xl border bg-[#fbf7f8] p-4">
                    {(() => {
                      const expiresAt = item.assignment.expiresAt ?? item.assignment.offeredAt + 48 * 60 * 60 * 1000;
                      const remainingHours = hoursUntil(expiresAt);
                      return (
                        <div className={`mb-3 rounded-xl border p-3 text-sm ${remainingHours !== null && remainingHours <= 6 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-primary/10 bg-primary/5 text-primary"}`}>
                          <p className="mb-1 font-bold">{c("Response window")}</p>
                          <p className="mb-0">{c("Expires ")}{formatDate(expiresAt)}
                            {remainingHours !== null ? ` · about ${remainingHours} hour${remainingHours === 1 ? "" : "s"} left` : ""}
                          </p>
                        </div>
                      );
                    })()}
                    <Button variant="outline" className="min-h-12 w-full" aria-expanded={reviewingOffer === item.assignment._id} onClick={() => { setReviewingOffer(reviewingOffer === item.assignment._id ? null : item.assignment._id); setDeclineReason(""); }}>{c("Review this offer")}</Button>
                    {reviewingOffer === item.assignment._id && <div className="mt-4"><p className="mb-3 text-base">{c("Check your time and any conflict of interest. Accepting gives you access to the case so you can help.")}</p>
                    <Textarea value={declineReason} onChange={(event) => setDeclineReason(event.target.value)} maxLength={500} placeholder={c("Reason if declining")} className="mb-3 min-h-20 bg-white" />
                    <div className="grid grid-cols-2 gap-2">
                      <Button disabled={pending || !item.case || !readyForOffers} onClick={() => acceptAssignment(item)} className="bg-primary">
                        <CheckCircle2 className="mr-2 h-4 w-4" />{c("Accept")}</Button>
                      <Button disabled={pending} variant="outline" onClick={() => declineAssignment(item)}>
                        <XCircle className="mr-2 h-4 w-4" />{c("Decline")}</Button>
                    </div></div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className={`work-record-browser ${selectedCaseId ? "has-record" : ""}`}>
            <div className={`${selectedCaseId ? "hidden lg:block" : "block"} border-r border-neutral-200`}>
              <div className="border-b p-5">
                <h2 className="text-xl">{c("My cases")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Cases become visible after assignment acceptance.")}</p>
              </div>
              <div className="max-h-[740px] overflow-y-auto">
                {cases === undefined && <BrandLoading compact text={c("Loading cases...")}/>}
                {workCases?.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="mb-3 flex justify-center"><ParalegalIllustration pose="documents" size={80} /></div>
                    <p className="mb-1 font-bold">{c("No accepted cases yet")}</p>
                    <p className="mb-0 text-sm text-neutral-500">{c("Accept an assignment to start case work.")}</p>
                  </div>
                )}
                {workCases && workCases.length > 0 && visibleCases?.length === 0 && <p role="status" className="p-5">{c("No cases match. Try another word or clear your choices.")}</p>}
                {visibleCases?.map((record) => (
                  <button key={record._id} aria-current={selectedCaseId===record._id?"page":undefined} onClick={() => { selectCase(record._id); }} className="w-full border-b p-4 text-left hover:bg-[#fbf7f8] focus-visible:bg-[#fbf7f8]">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold">{record.publicId}</span>
                      <StatusPill value={record.status} urgent={record.priority !== "standard"} />
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-neutral-600">{record.summary}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{c("Updated ")}{formatDate(record.updatedAt)}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <LoadingText as="div" className={`${selectedCaseId ? "block" : "hidden"} min-w-0 flex-col`}>
              {!selectedCaseId || !caseDetail ? (
                <div className="m-auto max-w-sm p-8 text-center">
                  <div className="mb-4 flex justify-center"><ParalegalIllustration pose="documents" /></div>
                  <h2 className="mb-2 text-xl">{c("Select a case")}</h2>
                  <p className="mb-0 text-sm text-neutral-500">{c("Open a case to see its next step.")}</p>
                </div>
              ) : (
                <div className="p-4 sm:p-7">
                  <button onClick={() => selectCase(null)} className="mb-5 flex items-center gap-2 text-sm font-bold text-primary">
                    <ArrowLeft className="h-4 w-4" />{c("Back to cases")}</button>
                  <div className="mb-5 flex flex-col justify-between gap-3 border-b pb-5 xl:flex-row xl:items-start">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl">{caseDetail.case.publicId}</h1>
                        <StatusPill value={caseDetail.case.status} urgent={caseDetail.case.priority !== "standard"} />
                      </div>
                      <p className="mb-0 text-sm text-neutral-500">{c("Opened ")}{formatDate(caseDetail.case.createdAt)}</p>
                    </div>
                    {journey?.transition && (journey.transition !== "closed" || caseTab === "outcome") && <Button disabled={pending} onClick={() => changeCaseStatus(journey.transition!)}>{journey.transition === "closed" ? c("Close case") : c("Start helping")}</Button>}
                  </div>

                  {!!pendingStatus && <div className="mb-5 rounded-xl bg-teal-50 p-4"><p>{pendingStatus === "closed" ? c("Close this case? No new work can be added.") : c("Confirm that you have started helping. The person will see this update.")}</p><div className="flex gap-3"><Button disabled={pending} onClick={() => changeCaseStatus(pendingStatus)}>{c("Confirm and save")}</Button><Button variant="outline" onClick={() => setPendingStatus("")}>{c("Cancel")}</Button></div></div>}
                  <details className="work-presence"><summary>{c("Case team presence")}</summary><CasePresence caseId={selectedCaseId}/></details>



                  <nav aria-label={c("Case steps")} className="work-tabs">
                    <TabButton active={caseTab === "overview" && !caseWorkOpen} icon={<BriefcaseBusiness className="h-4 w-4" />} label={c("Next step")} onClick={() => { setCaseTab("overview"); }} />
                    <TabButton active={!caseWorkOpen && caseTab === "messages" && !caseWorkOpen} icon={<MessageSquareText className="h-4 w-4" />} label={c("Messages")} onClick={() => { setCaseTab("messages"); }} />
                    <TabButton active={caseWorkOpen || ["documents", "appointments", "referrals"].includes(caseTab)} icon={<FileText className="h-4 w-4" />} label={c("Case work")} onClick={() => setCaseTab(caseWorkOpen ? "overview" : "work")} />
                    <TabButton active={!caseWorkOpen && caseTab === "outcome" && !caseWorkOpen} icon={<FileCheck2 className="h-4 w-4" />} label={c("Finish case")} onClick={() => { setCaseTab("outcome"); }} />
                    <TabButton active={!caseWorkOpen && caseTab === "timeline" && !caseWorkOpen} icon={<Clock3 className="h-4 w-4" />} label={c("History")} onClick={() => { setCaseTab("timeline"); }} />
                  </nav>

                  {caseWorkOpen && <section aria-label={c("Choose case work")} className="mb-5 grid gap-2">{[["documents", "Work with documents", "Upload and review case papers."], ["appointments", "Arrange a meeting", "Plan a meeting and record what happened."], ["referrals", "Ask another service to help", "Choose a service, then ask the person for permission."]].map(([area,title,hint]) => <button key={area} onClick={() => { setCaseTab(area as CaseSubTab); }} className="min-h-14 rounded-xl border bg-white p-4 text-left"><strong className="block text-primary">{title} →</strong><span className="text-sm text-neutral-600">{hint}</span></button>)}</section>}
                  {caseTab === "overview" && !caseWorkOpen && journey && <section className="rounded-2xl bg-teal-50 p-5"><p className="mb-1 text-xs font-bold uppercase text-teal-800">{c("Your next step")}</p><h3 className="text-xl">{journey.title}</h3><p>{journey.description}</p>{journey.area !== "overview" && <Button onClick={() => setCaseTab(journey.area)}>{journey.action}</Button>}<p className="mb-0 mt-4 text-sm text-neutral-600">{c("Case work: documents, meetings and help from another service. Finish case: record the result and complete final checks.")}</p></section>}
                  {caseTab === "overview" && <div className="mb-5 rounded-2xl bg-[#f8f2f4] p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{c("Case summary")}</p>
                    <p className="mb-0 whitespace-pre-wrap leading-7">{caseDetail.case.summary}</p>
                  </div>}

                  {!caseWorkOpen && caseTab === "timeline" && (
                    <div className="space-y-3">
                      {caseDetail.assignmentHistory.length > 0 && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-4">
                          <h3 className="mb-3 flex items-center gap-2 text-base">
                            <UserRoundCheck className="h-5 w-5 text-primary" />{c("Assignment history")}</h3>
                          <div className="grid gap-2">
                            {caseDetail.assignmentHistory.map((item) => (
                              <div key={item.assignment._id} className="rounded-lg border bg-white p-3 text-sm">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <span className="font-bold">{item.assigneeName}</span>
                                  <StatusPill value={item.assignment.status} urgent={item.history.isOverdue || item.assignment.status === "expired"} />
                                </div>
                                <p className="mb-1 text-xs text-neutral-500">{c("Offered by ")}{item.offeredByName} · {formatDate(item.assignment.offeredAt)}
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
                          <p className="mb-1 text-sm font-bold">{eventTitle(event, locale)}</p>
                          {eventDetail(event, locale) && <p className="mb-1 text-sm text-neutral-600">{eventDetail(event, locale)}</p>}
                          <p className="mb-0 text-xs text-neutral-500">{formatDate(event.occurredAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!caseWorkOpen && caseTab === "messages" && (
                    <div className="grid gap-4">
                      <div className="max-h-[420px] overflow-y-auto rounded-xl border bg-[#fbfafa] p-4">
                        {messages === undefined && <BrandLoading compact text={c("Loading messages...")}/>}
                        {messages?.length === 0 && <p className="py-8 text-center text-sm text-neutral-500">{c("No case messages yet.")}</p>}
                        {messages?.map((item) => (
                          <div key={item._id} className="mb-3 max-w-[780px] rounded-xl border bg-white p-3">
                            <p className="mb-1 whitespace-pre-wrap text-sm leading-6">{item.body}</p>{item.type === "voice" && item.audioUrl && <audio controls preload="metadata" src={item.audioUrl} aria-label={c("Case voice note")} className="max-w-full" />}
                            <p className="mb-0 text-xs text-neutral-400">{formatDate(item.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Textarea aria-label={c("Message to the person and case team")} value={message} onChange={(event) => setMessage(event.target.value)} maxLength={4000} placeholder={c("Write a case-scoped message...")} className="min-h-24 flex-1" />
                        <Button disabled={pending || !message.trim()} onClick={sendMessage} className="sm:self-end">
                          <Send className="mr-2 h-4 w-4" />{c("Send")}</Button>
                      </div>
                      {selectedCaseId && <CaseVoiceNote key={selectedCaseId} caseId={selectedCaseId} />}
                    </div>
                  )}

                  {!caseWorkOpen && caseTab === "documents" && (
                    <div className="grid gap-4">
                      {selectedCaseId && caseDetail.case.status !== "closed" && <CaseDocumentUpload key={selectedCaseId} caseId={selectedCaseId} />}
                      {documents === undefined && <BrandLoading compact text={c("Loading case documents...")}/>}
                      {documents?.length === 0 && (
                        <div className="rounded-xl border bg-[#fbfafa] p-6 text-center">
                          <FileText className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                          <p className="mb-1 font-bold">{c("No documents uploaded")}</p>
                          <p className="mb-0 text-sm text-neutral-500">{c("Documents uploaded by the beneficiary or case worker will appear here for review.")}</p>
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
                              <p className="mb-0 text-sm capitalize text-neutral-500">{statusLabel(document.category)} · {(document.size / 1024 / 1024).toFixed(2)} MB</p>
                              {document.note && <p className="mb-0 mt-2 text-sm text-neutral-600">{document.note}</p>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {document.url && (
                                <a href={document.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-lg border px-3 text-sm font-bold text-primary hover:bg-primary/5">
                                  <ExternalLink className="mr-2 h-4 w-4" />{c("Open")}</a>
                              )}
                              {document.status === "pending_review" && (
                                <>
                                  <Button disabled={pending} size="sm" onClick={() => setDocumentStatus(document._id, "accepted")}>{c("Accept")}</Button>
                                  <Button disabled={pending} size="sm" variant="outline" onClick={() => setDocumentStatus(document._id, "rejected")}>{c("Reject")}</Button>
                                </>
                              )}
                            </div>
                          </div>
                          {document.status === "pending_review" && <Textarea aria-label={`Review note for ${document.name}`} value={documentReviewNotes[document._id] ?? ""} onChange={event => setDocumentReviewNotes(current => ({ ...current, [document._id]: event.target.value }))} maxLength={1200} placeholder={c("Explain any changes needed. Required when rejecting.")} className="mb-3" />}
                          {document.reviewNotes && <p className="mb-0 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">{document.reviewNotes}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {!caseWorkOpen && caseTab === "appointments" && (
                    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                      <div className="space-y-3">
                        {appointmentRequests.length > 0 && (
                          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <h3 className="mb-2 text-base">{c("Appointment requests")}</h3>
                            <p className="mb-3 text-sm text-neutral-600">{c("Beneficiary-requested appointments waiting for a confirmed date and time.")}</p>
                            <div className="grid gap-2">
                              {appointmentRequests.map((event) => (
                                <div key={event._id} className="rounded-xl border bg-white p-3">
                                  <p className="mb-1 text-sm font-bold">{eventDetail(event, locale) ?? c("Appointment requested")}</p>
                                  <p className="mb-2 text-xs text-neutral-500">{c("Requested ")}{formatDate(event.occurredAt)}</p>
                                  <Button disabled={pending} size="sm" onClick={() => scheduleFromRequest(event._id)}>{c("Schedule selected time from request")}</Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {appointments.length === 0 && <p className="rounded-xl border p-5 text-sm text-neutral-500">{c("No appointments scheduled for this case.")}</p>}
                        {appointments.map((appointment) => (
                          <div key={appointment._id} className="rounded-xl border p-4">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <p className="mb-0 font-bold">{formatDate(appointment.startsAt)}</p>
                              <StatusPill value={appointment.status} />
                            </div>
                            <p className="mb-0 text-sm capitalize text-neutral-600">{statusLabel(appointment.mode)}{appointment.location ? ` · ${appointment.location}` : ""}</p>
                            {appointment.statusNote && <p className="mb-0 mt-2 rounded-lg bg-neutral-50 p-2 text-sm text-neutral-600">{appointment.statusNote}</p>}
                            {appointment.status === "scheduled" && (
                              <div className="mt-3 grid gap-2">
                                <Textarea
                                  value={appointmentStatusNotes[appointment._id] ?? ""}
                                  onChange={(event) => setAppointmentStatusNotes((current) => ({ ...current, [appointment._id]: event.target.value }))}
                                  maxLength={800}
                                  placeholder={c("Optional lifecycle note for LSF and the case record...")}
                                  className="min-h-[76px] text-sm"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <Button disabled={pending} size="sm" onClick={() => changeAppointmentStatus(appointment._id, "completed")}>{c("Complete")}</Button>
                                  <Button disabled={pending} size="sm" variant="outline" onClick={() => changeAppointmentStatus(appointment._id, "cancelled")}>{c("Cancel")}</Button>
                                  <Button disabled={pending} size="sm" variant="outline" onClick={() => changeAppointmentStatus(appointment._id, "missed")}>{c("No-show")}</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-base"><CalendarClock className="h-5 w-5 text-primary" />{c("Schedule appointment")}</h3>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="appointment-date">{c("Date and time · Tanzania (EAT)")}</label>
                        <Input id="appointment-date" type="datetime-local" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} className="mb-3" />
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="appointment-mode">{c("Mode")}</label>
                        <select id="appointment-mode" value={appointmentMode} onChange={(event) => setAppointmentMode(event.target.value as typeof appointmentMode)} className="mb-3 h-10 w-full rounded-md border bg-white px-3 text-sm">
                          <option value="phone">{c("Phone")}</option>
                          <option value="in_person">{c("In person")}</option>
                          <option value="remote">{c("Remote")}</option>
                        </select>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="appointment-location">{c("Location or call note")}</label>
                        <Input id="appointment-location" value={appointmentLocation} onChange={(event) => setAppointmentLocation(event.target.value)} maxLength={300} placeholder={c("Optional")} />
                        <Button disabled={pending} onClick={schedule} className="mt-4 w-full">{c("Schedule and notify")}</Button>
                      </div>
                    </div>
                  )}

                  {caseTab === "referrals" && selectedCaseId && <CaseReferralRequests key={selectedCaseId} caseId={selectedCaseId} status={caseDetail.case.status} supportHref={organisationStaff ? "/dashboard/provider?tab=tools" : "/dashboard/paralegal?tab=tools"} />}
                  {!caseWorkOpen && caseTab === "outcome" && caseDetail.closureReadiness && Boolean(caseDetail.outcome) && caseDetail.case.status !== "closed" && <section className="mb-5 rounded-2xl border bg-[#fff8ef] p-5"><h3 className="text-lg">{c("Before you close the case")}</h3><p className="text-sm text-neutral-600">{c("Complete each check. Saving the result asks the person for feedback; they do not need to reply before closure.")}</p><div className="grid gap-2 sm:grid-cols-2">{finalChecks.map(check => { const ready = caseDetail.closureReadiness!.requirements[check.key]; return <button key={check.key} onClick={() => { if (check.area === "outcome") document.getElementById("outcome-summary")?.focus(); else setCaseTab(check.area); }} disabled={ready} className="flex min-h-12 items-center gap-3 rounded-xl border bg-white p-3 text-left text-sm"><span aria-label={ready ? c("Done") : "Needed"}>{ready ? "✓" : "○"}</span><span>{ready ? (locale === "sw" ? check.doneSw : check.doneLabel) : (locale === "sw" ? check.sw : check.label)}</span>{!ready && <span className="ml-auto font-semibold text-primary">{c("Open →")}</span>}</button>; })}</div>{!caseDetail.closureReadiness.requirements.reviewRequestsResolved && <p className="mt-3 text-sm">{c("LSF must answer the review request. ")}<Link className="font-bold text-primary" to={organisationStaff ? "/dashboard/provider?tab=tools" : "/dashboard/paralegal?tab=tools"}>{c("Ask LSF for help →")}</Link></p>}</section>}

                  {!caseWorkOpen && caseTab === "outcome" && (
                    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                      <div className="rounded-xl border bg-[#fbfafa] p-5">
                        <h3 className="mb-3 flex items-center gap-2 text-base"><FileCheck2 className="h-5 w-5 text-primary" />{c("Result")}</h3>
                        {caseDetail.outcome && <p className="whitespace-pre-wrap rounded-xl bg-teal-50 p-4">{caseDetail.outcome.summary}</p>}<p className="mb-0 text-sm leading-6 text-neutral-600">{c("When the work is finished, record the help provided and whether the issue was resolved. The person can read the result and give feedback.")}</p>
                      </div>
                      {!caseDetail.outcome && caseDetail.case.status !== "closed" && <div className="rounded-xl border p-4">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor="outcome-code">{c("What help did you give?")}</label>
                        <select id="outcome-code" value={outcomeCode} onChange={(event) => { setOutcomeCode(event.target.value); setReviewingOutcome(false); }} className="mb-3 h-10 w-full rounded-md border bg-white px-3 text-sm">
                          {outcomeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                        <label className="mb-2 block text-sm font-semibold" htmlFor="outcome-resolution">{c("Was the issue resolved?")}</label>
                        <select id="outcome-resolution" value={caseDetail.case.status === "resolved" ? "resolved" : caseDetail.case.status === "assistance_underway" ? outcomeResolution : "closed_unresolved"} onChange={event => { setOutcomeResolution(event.target.value as typeof outcomeResolution); setReviewingOutcome(false); }} className="mb-3 min-h-12 w-full rounded-xl border bg-white px-3"><option value="resolved" disabled={!["assistance_underway", "resolved"].includes(caseDetail.case.status)}>{c("Issue resolved")}</option><option value="closed_unresolved" disabled={caseDetail.case.status === "resolved"}>{c("Issue remains unresolved")}</option></select>
                        <label className="mb-2 block text-sm font-semibold" htmlFor="outcome-summary">{c("Help provided and next step")}</label>
                        <Textarea id="outcome-summary" value={outcomeSummary} onChange={(event) => { setOutcomeSummary(event.target.value); setReviewingOutcome(false); }} maxLength={3000} className="min-h-32" />
                        {reviewingOutcome && <p className="mt-3 text-sm">{c("Review the summary and whether the issue is resolved. The beneficiary will see this outcome. New work cannot be added after saving.")}</p>}<Button disabled={pending || outcomeSummary.trim().length < 20} onClick={saveOutcome} className="mt-4 w-full">{reviewingOutcome ? c("Confirm and save outcome") : c("Review outcome")}</Button>
                      </div>}
                    </div>
                  )}
                </div>
              )}
            </LoadingText>
          </section>
        )}
      </main>
    </div>
  );
};

function Metric({ icon, value, label, tone, onClick }: { icon: React.ReactNode; value: number; label: string; tone: "primary" | "teal" | "orange"; onClick: () => void }) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : tone === "teal" ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700";
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
      <p className="mb-1 text-2xl font-bold">{value}</p>
      <p className="mb-0 text-sm text-neutral-500">{label}</p>
    </button>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-current={active ? "page" : undefined} className={`flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${active ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
      {icon}
      {label}
    </button>
  );
}

function ClosureItem({ label, ready, detail }: { label: string; ready: boolean; detail?: string }) {
  const c = useCopy();
  return (
    <div className="rounded-lg border bg-white/80 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-neutral-800">{label}</span>
        <StatusPill value={ready ? c("Ready") : c("Missing")} urgent={!ready} />
      </div>
      {detail && <p className="mb-0 mt-1 text-xs text-neutral-500">{detail}</p>}
    </div>
  );
}

export default ParalegalDashboard;
