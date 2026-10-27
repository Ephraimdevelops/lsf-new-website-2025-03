import MatchingLocation, { type MatchOrigin } from "@/components/location/MatchingLocation";
import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader } from "@/components/dashboard/WorkArea";
import { displayLabel, type Locale } from "../../shared/plainLanguage";
import { usePlainError } from "@/i18n/usePlainError";
import { useLanguage } from "@/providers/LanguageProvider";
import { useDateFormat } from "@/i18n/useDateFormat";
import { useStatusLabel } from "@/i18n/useStatusLabel";
import { useCopy } from "@/i18n/useCopy";
import RequestConversation from "@/components/haki-yangu/RequestConversation";
import CaseReferralRequests from "@/components/paralegal/CaseReferralRequests";
import CasePresence from "@/components/location/CasePresence";
import { WorkConfirmation } from "@/components/dashboard/WorkConfirmation";
import { workCaseJourney, finalChecks } from "../../shared/workCaseJourney";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import ParalegalIllustration from "@/components/paralegal/ParalegalIllustration";
import DirectoryResearchQueue from "@/components/haki-yangu/DirectoryResearchQueue";
import { useAuth } from "@clerk/clerk-react";
import type { FunctionReturnType } from "convex/server";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileSearch,
  FileText,
  LogOut,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type TriageDetail = FunctionReturnType<typeof api.legalHelp.openForTriage>;
type WorkspaceTab = "requests" | "cases" | "documents" | "reviews" | "assignments" | "matching" | "referrals" | "services";
const workspaceTabs: WorkspaceTab[] = ["requests", "cases", "documents", "reviews", "assignments", "matching", "referrals", "services"];
const workspaceDescriptions: Record<WorkspaceTab, string> = {
  requests: "Read new requests and choose the next safe step.",
  cases: "Follow the work on each case through to completion.",
  documents: "Check documents and proof of consent alongside the case.",
  reviews: "Read concerns and decide whether a case needs another helper.",
  assignments: "Track assignment offers and provider responses.",
  matching: "Check suggested helpers and record why you choose them.",
  referrals: "Check consent, service replies and the help provided.",
  services: "Check organisations, services and proposed corrections.",
};
type ReferralQueueStatus =
  | "awaiting_beneficiary_consent"
  | "created"
  | "destination_notified"
  | "accepted"
  | "declined"
  | "scheduled"
  | "service_delivered"
  | "returned"
  | "escalated"
  | "closed";
type MatchingReviewStatus = "pending_review" | "approved" | "needs_changes" | "escalated" | "restricted";

type ServiceFormState = {
  name: string;
  organizationId: string;
  organizationName: string;
  servicePointType:
    | "paralegal"
    | "legal_aid_provider"
    | "partner_organisation"
    | "government_office"
    | "local_government"
    | "police_gender_children_desk"
    | "social_welfare"
    | "court_or_tribunal"
    | "labour_service"
    | "land_service"
    | "mediation"
    | "cso"
    | "protection_service"
    | "safe_house"
    | "other";
  classification: "public" | "community" | "government" | "private" | "restricted";
  visibility: "public" | "restricted" | "confidential";
  verificationStatus: "draft" | "verified" | "expired" | "inactive";
  region: string;
  district: string;
  issueCategories: string;
  serviceTypes: string;
  phone: string;
  latitude: string;
  longitude: string;
  physicalLocation: string;
  serviceCoverageRegions: string;
  eligibility: string;
  openingHours: string;
  currentIntakeState: "open" | "limited" | "closed" | "emergency_only";
  capacity: string;
  languages: string;
  referralCapability: boolean;
  walkIn: boolean;
  appointmentRequired: boolean;
  remoteSupport: boolean;
  phoneSupport: boolean;
  emergencyCapability: boolean;
  privacyAvailable: boolean;
  genderSensitive: boolean;
};

type OrganizationFormState = {
  name: string;
  organizationType: "lsf" | "legal_aid_provider" | "government" | "cso" | "community_paralegal_network" | "private_provider" | "donor_partner" | "other";
  verificationStatus: "draft" | "verified" | "suspended" | "inactive";
  referralAgreementStatus: "none" | "draft" | "active" | "expired" | "suspended";
  focalPersonName: string;
  focalPersonEmail: string;
  focalPersonPhone: string;
  slaHours: string;
  safeguardingReady: boolean;
  dataSharingAgreementVersion: string;
  notes: string;
};

const initialServiceForm: ServiceFormState = {
  name: "",
  organizationId: "",
  organizationName: "",
  servicePointType: "paralegal",
  classification: "community",
  visibility: "public",
  verificationStatus: "draft",
  region: "",
  district: "",
  issueCategories: "",
  serviceTypes: "",
  phone: "",
  latitude: "",
  longitude: "",
  physicalLocation: "",
  serviceCoverageRegions: "",
  eligibility: "",
  openingHours: "",
  currentIntakeState: "closed",
  capacity: "",
  languages: "",
  referralCapability: false,
  walkIn: false,
  appointmentRequired: false,
  remoteSupport: false,
  phoneSupport: false,
  emergencyCapability: false,
  privacyAvailable: false,
  genderSensitive: false,
};

const initialOrganizationForm: OrganizationFormState = {
  name: "",
  organizationType: "legal_aid_provider",
  verificationStatus: "draft",
  referralAgreementStatus: "none",
  focalPersonName: "",
  focalPersonEmail: "",
  focalPersonPhone: "",
  slaHours: "",
  safeguardingReady: false,
  dataSharingAgreementVersion: "",
  notes: "",
};

const requestLabels = {
  submitted: "New",
  under_review: "Under review",
  waiting_for_information: "Waiting for information",
} as const;

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
  under_review: ["waiting_for_information", "referred", "closed_unresolved"],
  waiting_for_information: ["under_review", "closed_unresolved"],
  assignment_pending: ["referred", "closed_unresolved"],
  assigned: [
    "appointment_scheduled",
    "assistance_underway",
    "referred",
    "closed_unresolved",
  ],
  appointment_scheduled: [
    "assistance_underway",
    "assigned",
    "closed_unresolved",
  ],
  referred: ["assistance_underway", "closed_unresolved"],
  assistance_underway: [
    "appointment_scheduled",
    "referred",
    "resolved",
    "closed_unresolved",
  ],
  resolved: ["closed"],
  closed_unresolved: ["closed"],
  closed: [],
};

function formatDate(timestamp?: number) {
  if (!timestamp) return "Not provided";
  return new Intl.DateTimeFormat("en-TZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The operation could not be completed.";
}

function languageLabel(language?: string, otherLanguage?: string) {
  if (language === "other" && otherLanguage?.trim()) return otherLanguage.trim();
  const labels: Record<string, string> = {
    sw: "Kiswahili",
    en: "English",
    both: "Kiswahili + English",
    other: "Other",
  };
  return language ? labels[language] ?? language : "Not provided";
}

function eventTitle(event: { publicLabelKey?: string; type: string }, locale: Locale) {
  return displayLabel(event.type, locale);
}

function eventDetail(event: { type: string; metadata?: unknown }, locale: Locale) {
  if (
    event.type !== "appointment_requested" ||
    !event.metadata ||
    typeof event.metadata !== "object"
  ) {
    return null;
  }
  const metadata = event.metadata as {
    preferredMode?: string;
    preferredTime?: string;
    note?: string;
  };
  const detail = [
    metadata.preferredMode
      ? `${locale === "sw" ? "Njia" : "Method"}: ${displayLabel(metadata.preferredMode, locale)}`
      : null,
    metadata.preferredTime ? `${locale === "sw" ? "Muda anaopendelea" : "Preferred time"}: ${metadata.preferredTime}` : null,
    metadata.note ? `${locale === "sw" ? "Maelezo" : "Note"}: ${metadata.note}` : null,
  ].filter(Boolean);
  return detail.length ? detail.join(" · ") : null;
}

function StatusPill({
  value,
  urgent = false,
}: {
  value: string;
  urgent?: boolean;
}) {
  const c = useCopy();
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgent ? "bg-orange-100 text-orange-800" : "bg-primary/10 text-primary"}`}
    >
      {c(value)}
    </span>
  );
}

import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import PersonalAvatar from '@/components/dashboard/PersonalAvatar';

const StaffDashboard = () => {
  const readError = usePlainError();
  const { locale } = useLanguage();
  const formatDate = useDateFormat();
  const statusLabel = useStatusLabel();
  const c = useCopy();
  const { greeting: greetingEn, greetingSw } = usePersonalGreeting();
  const greeting = locale === "sw" ? greetingSw : greetingEn;
  const { signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab: WorkspaceTab = workspaceTabs.find((item) => item === requestedTab) ?? "requests";
  const setTab = (next: WorkspaceTab) => {
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("tab", next);
      return updated;
    });
  };
  const [requestStatus, setRequestStatus] = useState<
    "all" | "submitted" | "under_review" | "waiting_for_information"
  >("all");
  const [documentStatus, setDocumentStatus] = useState<
    "pending_review" | "accepted" | "rejected"
  >("pending_review");
  const [consentEvidenceStatus, setConsentEvidenceStatus] = useState<
    "pending_review" | "accepted" | "rejected"
  >("pending_review");
  const [reviewStatus, setReviewQueueStatus] = useState<
    "submitted" | "under_review" | "resolved" | "declined"
  >("submitted");
  const [assignmentStatus, setAssignmentStatus] = useState<
    "offered" | "accepted" | "declined" | "expired" | "ended"
  >("offered");
  const [matchingReviewStatus, setMatchingReviewStatus] =
    useState<MatchingReviewStatus>("pending_review");
  const [referralStatus, setReferralStatus] = useState<ReferralQueueStatus>("awaiting_beneficiary_consent");
  const [detail, setDetail] = useState<TriageDetail | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | null>(
    null,
  );
  const [evidenceReview, setEvidenceReview] = useState(false);
  const [caseArea, setCaseArea] = useState("next");
  const [statusReview, setStatusReview] = useState<string | null>(null);
  useEffect(() => { setCaseArea("next"); setStatusReview(null); setEvidenceReview(false); setReferralServiceId(""); setReferralDestinationUserId(""); setReferralReason(""); setReferralConsentEvidenceNote(""); setReferralConsentFile(null); }, [selectedCaseId]);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState<
    "standard" | "urgent" | "safeguarding"
  >("standard");
  const [providerId, setProviderId] = useState("");
  const [reassignmentProviderId, setReassignmentProviderId] = useState("");
  const [assignmentOverrideReason, setAssignmentOverrideReason] = useState("");
  const [reassignmentOverrideReason, setReassignmentOverrideReason] = useState("");
  const [reviewNotesById, setReviewNotesById] = useState<Record<string, string>>({});
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentMode, setAppointmentMode] = useState<"in_person" | "phone" | "remote">("phone");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [referralServiceId, setReferralServiceId] = useState("");
  const [referralDestinationUserId, setReferralDestinationUserId] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [referralInformationShared, setReferralInformationShared] = useState("case summary, safe contact preference, district, issue category");
  const [referralConsentMethod, setReferralConsentMethod] = useState<"documented_verbal" | "written" | "sms" | "email" | "signed_document">("documented_verbal");
  const [referralConsentStatement, setReferralConsentStatement] = useState("I consent for LSF to share the minimum information listed here with this referral destination so they can provide legal support.");
  const [referralConsentEvidenceNote, setReferralConsentEvidenceNote] = useState("");
  const [referralConsentFile, setReferralConsentFile] = useState<File | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(initialServiceForm);
  const [editingOrganizationId, setEditingOrganizationId] = useState<Id<"justice_service_organizations"> | null>(null);
  const directoryAccess = useQuery(api.users.currentAccess);
  const isSupervisor = directoryAccess?.roles.includes("supervisor") && !directoryAccess.roles.includes("admin");
  const compactWorkspace = true; // One focused queue layout for every operational role.
  const [reviewDecision, setReviewDecision] = useState<{id:string;status:string;note:string}|null>(null);
  const [workSearch, setWorkSearch] = useState("");
  useEffect(() => { setWorkSearch(""); }, [tab]);
  const matchesWork = (values: (string | undefined)[]) => values.join(" ").toLowerCase().includes(workSearch.trim().toLowerCase());
  const directoryCanManage = directoryAccess?.roles.some(role => role === "admin" || role === "staff") ?? false;
  const [serviceEditReason, setServiceEditReason] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<Id<"justice_services"> | null>(null);
  const [organizationForm, setOrganizationForm] = useState<OrganizationFormState>(initialOrganizationForm);
  const [serviceDecisionReasons, setServiceDecisionReasons] = useState<Record<string, string>>({});
  const [serviceEvidence, setServiceEvidence] = useState<Record<string, { source: string; authority: string }>>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const requests = useQuery(
    api.legalHelp.staffQueue,
    requestStatus === "all" ? {} : { status: requestStatus },
  );
  useEffect(() => {
    setDetail(current => {
      if (!current) return current;
      const latest = requests?.find(item => item._id === current.request._id);
      if (!latest || !["under_review", "waiting_for_information"].includes(latest.status) || (latest.version === current.request.version && latest.status === current.request.status)) return current;
      return { ...current, request: { ...current.request, status: latest.status as "under_review" | "waiting_for_information", version: latest.version, updatedAt: latest.updatedAt } };
    });
  }, [requests]);
  const cases = useQuery(api.caseManagement.staffCaseQueue);
  const linkedCase = searchParams.get("case");
  useEffect(() => { if (linkedCase && cases?.some(item => item._id === linkedCase)) setSelectedCaseId(linkedCase as Id<"cases">); }, [linkedCase, cases]);
  const providers = useQuery(api.caseManagement.serviceProviders);
  const receivingProviders = useQuery(api.referrals.destinationProviders, selectedCaseId && referralServiceId && caseArea === "referral" ? { caseId: selectedCaseId, destinationServiceId: referralServiceId as Id<"justice_services"> } : "skip");
  const caseDetail = useQuery(
    api.caseManagement.getCase,
    selectedCaseId ? { caseId: selectedCaseId } : "skip",
  );
  const [matchingOrigin,setMatchingOrigin]=useState<MatchOrigin>();
  const [matchingRefresh,setMatchingRefresh]=useState(0);
  useEffect(()=>{const timer=setInterval(()=>setMatchingRefresh(value=>value+1),30000);return ()=>clearInterval(timer);},[]);
  useEffect(()=>{setMatchingOrigin(undefined);},[selectedCaseId]);
  const recommendations = useQuery(
    api.caseManagement.providerRecommendations,
    selectedCaseId ? { caseId: selectedCaseId, origin: matchingOrigin, refresh: matchingRefresh } : "skip",
  );
  const documentQueue = useQuery(api.caseManagement.staffDocumentQueue, {
    status: documentStatus,
  });
  const consentEvidenceQueue = useQuery(api.referrals.staffConsentEvidenceQueue, {
    status: consentEvidenceStatus,
  });
  const reviewQueueFiltered = useQuery(api.caseManagement.staffReviewRequests, {
    status: reviewStatus,
  });
  const assignmentOffersFiltered = useQuery(api.caseManagement.staffAssignmentOffers, {
    status: assignmentStatus,
  });
  const referralQueueFiltered = useQuery(api.referrals.staffQueue, {
    status: referralStatus,
  });
  const linkedReviews = useQuery(api.caseManagement.staffReviewRequests, searchParams.get("review") ? {reviewRequestId: searchParams.get("review") as Id<"case_review_requests">} : "skip");
  const linkedOffers = useQuery(api.caseManagement.staffAssignmentOffers, searchParams.get("offer") ? {} : "skip");
  const linkedReferrals = useQuery(api.referrals.staffQueue, searchParams.get("referral") ? {} : "skip");
  const reviewQueue = searchParams.get("review") ? linkedReviews : reviewQueueFiltered;
  const assignmentOffers = searchParams.get("offer") ? linkedOffers : assignmentOffersFiltered;
  const referralQueue = searchParams.get("referral") ? linkedReferrals : referralQueueFiltered;
  const matchingDecisionQueue = useQuery(api.justiceServices.staffMatchingDecisionQueue, {
    status: matchingReviewStatus,
  });
  const justiceOrganizations = useQuery(api.justiceServices.staffListOrganizations);
  const justiceServices = useQuery(api.justiceServices.staffListServices);
  const partnerPerformance = useQuery(api.justiceServices.staffPartnerPerformance, { days: 30 });
  const openForTriage = useMutation(api.legalHelp.openForTriage);
  const setReviewStatus = useMutation(api.legalHelp.setReviewStatus);
  const createCase = useMutation(api.caseManagement.createFromRequest);
  const offerAssignment = useMutation(api.caseManagement.offerAssignment);
  const reassignCase = useMutation(api.caseManagement.reassignCase);
  const updateCaseStatus = useMutation(api.caseManagement.updateStatus);
  const reviewDocument = useMutation(api.caseManagement.reviewDocument);
  const scheduleAppointmentFromRequest = useMutation(api.caseManagement.scheduleAppointmentFromRequest);
  const expireStaleAssignmentOffersNow = useMutation(
    api.caseManagement.expireStaleAssignmentOffersNow,
  );
  const resolveCaseReviewRequest = useMutation(
    api.caseManagement.resolveCaseReviewRequest,
  );
  const createJusticeOrganization = useMutation(api.justiceServices.createOrganization);
  const createJusticeService = useMutation(api.justiceServices.createService);
  const updateJusticeOrganization = useMutation(api.justiceServices.updateOrganization);
  const [organisationRemovalReasons, setOrganisationRemovalReasons] = useState<Record<string, string>>({});
  const updateJusticeService = useMutation(api.justiceServices.updateService);
  const createReferral = useMutation(api.referrals.createForCase);
  const generateReferralConsentUploadUrl = useMutation(api.referrals.generateConsentUploadUrl);
  const reviewConsentEvidence = useMutation(api.referrals.reviewConsentEvidence);
  const updateReferralStatus = useMutation(api.referrals.updateStatus);
  const reviewMatchingDecision = useMutation(api.justiceServices.reviewMatchingDecision);

  const selectedAssignmentProvider =
    recommendations?.find((provider) => provider.id === providerId) ??
    providers?.find((provider) => provider.id === providerId);
  const selectedReassignmentProvider =
    recommendations?.find((provider) => provider.id === reassignmentProviderId) ??
    providers?.find((provider) => provider.id === reassignmentProviderId);
  const referralCapableServices =
    justiceServices?.filter(
      (service) =>
        service.active &&
        service.verificationStatus === "verified" &&
        service.visibility === "public" &&
        service.referralCapability,
    ) ?? [];

  function requiresAvailabilityOverride(provider?: { availabilityStatus?: string; canOffer?: boolean }) {
    return !!provider && (provider.canOffer !== true || !["accepting_cases", "limited"].includes(provider.availabilityStatus ?? "unknown"));
  }

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

  function selectRequest(request: NonNullable<typeof requests>[number]) {
    void run(async () => {
      const opened = await openForTriage({
        requestId: request._id,
        expectedVersion: request.version,
      });
      setDetail(opened);
      setSummary(opened.request.description ?? "");
      setPriority(
        opened.request.urgency === "immediate_safety"
          ? "safeguarding"
          : opened.request.urgency === "urgent"
            ? "urgent"
            : "standard",
      );
    });
  }

  function changeReviewStatus(
    status: "under_review" | "waiting_for_information",
  ) {
    if (!detail) return;
    if (status === "waiting_for_information") {
      const composer = document.getElementById(`reply-${detail.request._id}`);
      composer?.scrollIntoView({ behavior: "smooth", block: "center" });
      composer?.focus();
      setNotice({ type: "success", text: "Write and send your question below. The request will wait for a reply after the question is sent." });
      return;
    }
    void run(async () => {
      const result = await setReviewStatus({
        requestId: detail.request._id,
        expectedVersion: requests?.find(item => item._id === detail.request._id)?.version ?? detail.request.version,
        status,
      });
      setDetail({
        ...detail,
        request: {
          ...detail.request,
          status: result.status,
          version: result.version,
        },
      });
      setNotice({ type: "success", text: "Request status updated." });
    });
  }

  function convertToCase() {
    if (!detail || summary.trim().length < 10) {
      setNotice({
        type: "error",
        text: "Add a concise case summary of at least 10 characters.",
      });
      return;
    }
    void run(async () => {
      const result = await createCase({
        requestId: detail.request._id,
        summary: summary.trim(),
        priority,
      });
      setSelectedCaseId(result.caseId);
      setDetail(null);
      setTab("cases");
      setNotice({
        type: "success",
        text: `${result.publicId} is ready for assignment.`,
      });
    });
  }

  function assignProvider() {
    if (!selectedCaseId || !providerId) return;
    if (requiresAvailabilityOverride(selectedAssignmentProvider) && assignmentOverrideReason.trim().length < 10) {
      setNotice({
        type: "error",
        text: "Add an override reason of at least 10 characters before assigning a provider with unknown, paused, unavailable or full capacity.",
      });
      return;
    }
    void run(async () => {
      await offerAssignment({
        caseId: selectedCaseId,
        assigneeId: providerId as Id<"users">,
        availabilityOverrideReason: assignmentOverrideReason.trim() || undefined,
      });
      setProviderId("");
      setAssignmentOverrideReason("");
      setNotice({
        type: "success",
        text: "Assignment offer sent to the service provider.",
      });
    });
  }

  function changeCaseStatus(status: string) {
    if (statusReview !== status) { setStatusReview(status); return; }
    if (!selectedCaseId || !caseDetail) return;
    void run(async () => {
      await updateCaseStatus({
        caseId: selectedCaseId,
        status: status as Parameters<typeof updateCaseStatus>[0]["status"],
        expectedVersion: caseDetail.case.version,
      });
      setStatusReview(null);
      setNotice({ type: "success", text: "Case updated. The person will receive an update." });
    });
  }

  function decideDocument(
    documentId: Id<"case_documents">,
    status: "accepted" | "rejected",
  ) {
    void run(async () => {
      await reviewDocument({ documentId, status });
      setNotice({ type: "success", text: `Document ${status}.` });
    });
  }

  function decideConsentEvidence(
    consentId: Id<"consents">,
    status: "accepted" | "rejected",
  ) {
    void run(async () => {
      await reviewConsentEvidence({ consentId, status });
      setNotice({ type: "success", text: `Consent evidence ${status}.` });
    });
  }

  function decideReviewRequest(
    reviewRequestId: Id<"case_review_requests">,
    status: "under_review" | "resolved" | "declined",
    confirmed = false,
  ) {
    if (status !== "under_review" && (reviewNotesById[reviewRequestId]?.trim().length ?? 0) < 10) { setNotice({type:"error",text:"Record the reason for this decision in at least 10 characters."}); return; }
    if (status !== "under_review" && !confirmed) { setReviewDecision({id:reviewRequestId,status,note:reviewNotesById[reviewRequestId]?.trim() ?? ""}); return; }
    void run(async () => {
      const note = reviewNotesById[reviewRequestId]?.trim();
      await resolveCaseReviewRequest({
        reviewRequestId,
        status,
        resolutionNote: note || undefined,
        expectedUpdatedAt: reviewQueue?.find(item => item.review._id === reviewRequestId)?.review.updatedAt,
      });
      setReviewDecision(null);
      setReviewNotesById((current) => ({ ...current, [reviewRequestId]: "" }));
      setNotice({ type: "success", text: `Review request marked ${status.replaceAll("_", " ")}.` });
    });
  }

  function reassignFromReview(
    reviewRequestId: Id<"case_review_requests">,
    caseId: Id<"cases">,
    reason?: string,
  ) {
    if (!reassignmentProviderId) {
      setNotice({ type: "error", text: "Select the replacement service provider." });
      return;
    }
    if (requiresAvailabilityOverride(selectedReassignmentProvider) && reassignmentOverrideReason.trim().length < 10) {
      setNotice({
        type: "error",
        text: "Add an override reason of at least 10 characters before reassigning to a provider with unknown, paused, unavailable or full capacity.",
      });
      return;
    }
    void run(async () => {
      const note = reviewNotesById[reviewRequestId]?.trim();
      await reassignCase({
        caseId,
        newAssigneeId: reassignmentProviderId as Id<"users">,
        reviewRequestId,
        reason,
        resolutionNote: note || "Replacement provider offer sent after staff review.",
        availabilityOverrideReason: reassignmentOverrideReason.trim() || undefined,
      });
      setReassignmentProviderId("");
      setReassignmentOverrideReason("");
      setReviewNotesById((current) => ({ ...current, [reviewRequestId]: "" }));
      setNotice({
        type: "success",
        text: "Current assignment ended and replacement offer sent.",
      });
    });
  }

  function expireStaleOffersNow() {
    void run(async () => {
      const result = await expireStaleAssignmentOffersNow({ limit: 50 });
      setNotice({
        type: "success",
        text: `${result.expiredCount} stale assignment offer${result.expiredCount === 1 ? "" : "s"} expired.`,
      });
    });
  }

  function splitList(value: string) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  function updateServiceForm(updates: Partial<ServiceFormState>) {
    setServiceForm((current) => {
      const next = { ...current, ...updates };
      if (updates.servicePointType === "safe_house" && next.visibility === "public") {
        next.visibility = "restricted";
        next.classification = "restricted";
      }
      return next;
    });
  }

  function updateOrganizationForm(updates: Partial<OrganizationFormState>) {
    setOrganizationForm((current) => ({ ...current, ...updates }));
  }

  function createOrganization() {
    if (!organizationForm.name.trim()) {
      setNotice({ type: "error", text: "Add an organization name." });
      return;
    }
    void run(async () => {
      const organizationContent = {
        name: organizationForm.name.trim(),
        organizationType: organizationForm.organizationType,
        verificationStatus: editingOrganizationId ? organizationForm.verificationStatus : "draft" as const,
        referralAgreementStatus: editingOrganizationId ? organizationForm.referralAgreementStatus : "none" as const,
        focalPersonName: organizationForm.focalPersonName.trim() || undefined,
        focalPersonEmail: organizationForm.focalPersonEmail.trim() || undefined,
        focalPersonPhone: organizationForm.focalPersonPhone.trim() || undefined,
        slaHours: organizationForm.slaHours.trim() && Number.isFinite(Number(organizationForm.slaHours)) ? Number(organizationForm.slaHours) : undefined,
        safeguardingReady: organizationForm.safeguardingReady,
        dataSharingAgreementVersion: organizationForm.dataSharingAgreementVersion.trim() || undefined,
        notes: organizationForm.notes.trim() || undefined,
      };
      if (editingOrganizationId) {
        await updateJusticeOrganization({ id: editingOrganizationId, updates: organizationContent });
        setEditingOrganizationId(null); setOrganizationForm(initialOrganizationForm);
        setNotice({ type: "success", text: "Organisation updated. Material changes require renewed verification." });
        return;
      }
      const result = await createJusticeOrganization(organizationContent);
      setOrganizationForm(initialOrganizationForm);
      setServiceForm((current) => ({ ...current, organizationId: result.id, organizationName: "" }));
      setNotice({ type: "success", text: "Justice service organization created and selected for the service form." });
    });
  }

  function createServicePoint() {
    if (!serviceForm.name.trim() || !serviceForm.region.trim() || !serviceForm.district.trim()) {
      setNotice({ type: "error", text: "Add a service name, region and district." });
      return;
    }
    if (serviceForm.servicePointType === "protection_service" && !serviceForm.privacyAvailable) {
      setNotice({ type: "error", text: "Protection services must indicate privacy availability before publishing." });
      return;
    }
    if (serviceForm.servicePointType === "safe_house" && serviceForm.visibility === "public") {
      setNotice({ type: "error", text: "Safe houses must be saved as restricted or confidential entries." });
      return;
    }
    if ((serviceForm.latitude.trim() || serviceForm.longitude.trim()) && (!serviceForm.latitude.trim() || !serviceForm.longitude.trim() || !Number.isFinite(Number(serviceForm.latitude)) || !Number.isFinite(Number(serviceForm.longitude)) || Math.abs(Number(serviceForm.latitude)) > 90 || Math.abs(Number(serviceForm.longitude)) > 180)) { setNotice({ type: "error", text: "Enter valid latitude and longitude together." }); return; }
    void run(async () => {
      const serviceContent = {
        name: serviceForm.name.trim(),
        organizationId: serviceForm.organizationId ? serviceForm.organizationId as Id<"justice_service_organizations"> : undefined,
        organizationName: serviceForm.organizationName.trim() || undefined,
        servicePointType: serviceForm.servicePointType,
        classification: serviceForm.classification,
        visibility: serviceForm.visibility,
        country: "Tanzania",
        region: serviceForm.region.trim(),
        district: serviceForm.district.trim(),
        serviceCoverageRegions: splitList(serviceForm.serviceCoverageRegions),
        latitude: serviceForm.latitude.trim() ? Number(serviceForm.latitude) : undefined,
        longitude: serviceForm.longitude.trim() ? Number(serviceForm.longitude) : undefined,
        physicalLocation: serviceForm.physicalLocation.trim(),
        eligibility: serviceForm.eligibility.trim(),
        issueCategories: splitList(serviceForm.issueCategories),
        serviceTypes: splitList(serviceForm.serviceTypes),
        referralCapability: serviceForm.referralCapability,
        openingHours: serviceForm.openingHours.trim() || undefined,
        walkIn: serviceForm.walkIn,
        appointmentRequired: serviceForm.appointmentRequired,
        remoteSupport: serviceForm.remoteSupport,
        phoneSupport: serviceForm.phoneSupport,
        phone: serviceForm.phone.trim() || undefined,
        currentIntakeState: serviceForm.currentIntakeState,
        capacity: serviceForm.capacity.trim() && Number.isFinite(Number(serviceForm.capacity)) ? Number(serviceForm.capacity) : undefined,
        emergencyCapability: serviceForm.emergencyCapability,
        languages: splitList(serviceForm.languages),
        privacyAvailable: serviceForm.privacyAvailable,
        genderSensitive: serviceForm.genderSensitive,
      };
      if (editingServiceId) {
        await updateJusticeService({ id: editingServiceId, decisionReason: serviceEditReason.trim(), clearCoordinates: !serviceForm.latitude.trim() && !serviceForm.longitude.trim(), updates: serviceContent });
        setEditingServiceId(null);
      } else await createJusticeService({ ...serviceContent, verificationStatus: "draft", active: false });
      setServiceForm(initialServiceForm);
      setNotice({ type: "success", text: editingServiceId ? "Service updated. Material changes require renewed verification." : "Justice service point created." });
    });
  }

  function setServiceVerified(id: Id<"justice_services">) {
    const decisionReason = serviceDecisionReasons[id]?.trim();
    const record = justiceServices?.find((item) => item._id === id);
    const source = serviceEvidence[id]?.source?.trim() || record?.source?.trim();
    const verifyingAuthority = serviceEvidence[id]?.authority?.trim() || record?.verifyingAuthority?.trim();
    if (!decisionReason || decisionReason.length < 10) { setNotice({ type: "error", text: "Record a verification reason of at least 10 characters." }); return; }
    if (!source || !verifyingAuthority) { setNotice({ type: "error", text: "Record a checked source and verifying authority before approval." }); return; }
    void run(async () => {
      await updateJusticeService({
        id,
        decisionReason,
        updates: {
          source,
          verifyingAuthority,
          verificationStatus: "verified",
          active: true,
          lastVerifiedAt: Date.now(),
          nextReviewAt: Date.now() + 1000 * 60 * 60 * 24 * 180,
        },
      });
      setServiceDecisionReasons((current) => ({ ...current, [id]: "" }));
      setNotice({ type: "success", text: "Service verified and active." });
    });
  }

  function deactivateService(id: Id<"justice_services">) {
    const decisionReason = serviceDecisionReasons[id]?.trim();
    if (!decisionReason || decisionReason.length < 10) { setNotice({ type: "error", text: "Record a deactivation reason of at least 10 characters." }); return; }
    void run(async () => {
      await updateJusticeService({
        id,
        decisionReason,
        updates: {
          verificationStatus: "inactive",
          active: false,
          currentIntakeState: "closed",
        },
      });
      setServiceDecisionReasons((current) => ({ ...current, [id]: "" }));
      setNotice({ type: "success", text: "Service deactivated." });
    });
  }

  function moveReferral(
    referralId: Id<"referrals">,
    status: ReferralQueueStatus,
    note?: string,
  ) {
    void run(async () => {
      await updateReferralStatus({
        referralId,
        status,
        note,
        declineReason: status === "declined" ? note || "Destination cannot accept this referral." : undefined,
        finalDisposition: status === "closed" ? note || "Referral closed by LSF operations." : undefined,
      });
      setReferralStatus(status === "closed" ? "closed" : referralStatus);
      setNotice({ type: "success", text: `Referral marked ${status.replaceAll("_", " ")}.` });
    });
  }

  function reviewMatchDecision(
    decisionId: Id<"matching_decisions">,
    status: MatchingReviewStatus,
  ) {
    void run(async () => {
      const note = reviewNotesById[decisionId]?.trim();
      const current = matchingDecisionQueue?.find(item=>item.decision._id===decisionId)?.decision;
      if(!current) throw new Error("Refresh this matching review before saving.");
      await reviewMatchingDecision({
        decisionId,
        status,
        expectedReviewedAt: current.reviewedAt ?? 0,
        expectedReviewStatus: current.reviewStatus ?? "pending_review",
        reviewNote: note || undefined,
        restrictionReason:
          status === "restricted"
            ? note || "Restricted by LSF pending safeguarding review."
            : undefined,
      });
      setMatchingReviewStatus(status);
      setNotice({ type: "success", text: `Matching decision marked ${status.replaceAll("_", " ")}.` });
    });
  }

  function scheduleRequestedAppointment(requestEventId: Id<"case_events">) {
    if (!selectedCaseId || !appointmentDate) {
      setNotice({ type: "error", text: "Choose a future appointment date and time before confirming this request." });
      return;
    }
    const startsAt = new Date(appointmentDate).getTime();
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
      setNotice({ type: "success", text: "Appointment request confirmed and beneficiary notified." });
    });
  }

  function createCaseReferral(confirmed = false) {
    if (!selectedCaseId || !referralServiceId) {
      setNotice({ type: "error", text: "Select a case and referral destination." });
      return;
    }
    if (referralReason.trim().length < 12) {
      setNotice({ type: "error", text: "Add a referral reason of at least 12 characters." });
      return;
    }
    const informationShared = splitList(referralInformationShared);
    if (informationShared.length === 0) {
      setNotice({ type: "error", text: "Record what minimum-necessary information will be shared." });
      return;
    }
    if (referralConsentStatement.trim().length < 20) {
      setNotice({ type: "error", text: "Record the beneficiary consent statement before creating the referral." });
      return;
    }
    if (referralConsentMethod === "signed_document" && !referralConsentFile) {
      setNotice({ type: "error", text: "Attach the signed consent file before creating this referral." });
      return;
    }
    if (!confirmed) { setEvidenceReview(true); return; }
    void run(async () => {
      let consentUpload:
        | {
            storageId: Id<"_storage">;
            fileName: string;
            fileType: string;
            fileSize: number;
          }
        | null = null;
      if (referralConsentFile) {
        if (referralConsentFile.size > 10 * 1024 * 1024) {
          throw new Error("Consent evidence file must be 10MB or smaller.");
        }
        const uploadUrl = await generateReferralConsentUploadUrl({ caseId: selectedCaseId });
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": referralConsentFile.type || "application/octet-stream" },
          body: referralConsentFile,
        });
        if (!uploadResult.ok) {
          throw new Error("Could not upload signed consent evidence.");
        }
        const { storageId } = await uploadResult.json() as { storageId: Id<"_storage"> };
        consentUpload = {
          storageId,
          fileName: referralConsentFile.name,
          fileType: referralConsentFile.type || "application/octet-stream",
          fileSize: referralConsentFile.size,
        };
      }
      const result = await createReferral({
        caseId: selectedCaseId,
        destinationServiceId: referralServiceId as Id<"justice_services">,
        destinationUserId: referralDestinationUserId ? referralDestinationUserId as Id<"users"> : undefined,
        reason: referralReason.trim(),
        informationShared,
        consentMethod: referralConsentMethod,
        consentStatement: referralConsentStatement.trim(),
        consentEvidenceNote: referralConsentEvidenceNote.trim() || undefined,
        consentEvidenceStorageId: consentUpload?.storageId,
        consentEvidenceFileName: consentUpload?.fileName,
        consentEvidenceFileType: consentUpload?.fileType,
        consentEvidenceFileSize: consentUpload?.fileSize,
      });
      setEvidenceReview(false);
      setReferralServiceId("");
      setReferralDestinationUserId("");
      setReferralReason("");
      setReferralInformationShared("case summary, safe contact preference, district, issue category");
      setReferralConsentMethod("documented_verbal");
      setReferralConsentStatement("I consent for LSF to share the minimum information listed here with this referral destination so they can provide legal support.");
      setReferralConsentEvidenceNote("");
      setReferralConsentFile(null);
      setReferralStatus("awaiting_beneficiary_consent");
      setTab("referrals");
      setNotice({ type: "success", text: `${result.publicId} proposed. The beneficiary must review and approve before the provider is notified.` });
    });
  }

  const newCount =
    requests?.filter((request) => request.status === "submitted").length ?? 0;
  const urgentCount =
    requests?.filter(
      (request) =>
        request.urgency === "urgent" || request.urgency === "immediate_safety",
    ).length ?? 0;
  const activeCases =
    cases?.filter(
      (record) => !["closed", "closed_unresolved"].includes(record.status),
    ).length ?? 0;
  const pendingDocumentCount =
    documentQueue?.filter((item) => item.document.status === "pending_review")
      .length ?? 0;
  const pendingReviewCount =
    reviewQueue?.filter((item) => item.review.status === "submitted").length ??
    0;
  const openAssignmentOfferCount =
    assignmentOffers?.filter((item) => item.assignment.status === "offered").length ??
    0;
  const matchingDecisionCount =
    matchingDecisionQueue?.filter((item) =>
      ["pending_review", "restricted", "escalated"].includes(item.decision.reviewStatus ?? "pending_review"),
    ).length ?? 0;
  const activeReferralCount =
    referralQueue?.filter((item) => !["closed", "declined"].includes(item.referral.status)).length ?? 0;
  const verifiedServiceCount =
    justiceServices?.filter((service) => service.verificationStatus === "verified" && service.active).length ?? 0;
  const appointmentRequests =
    caseDetail?.events.filter((event) => {
      if (event.type !== "appointment_requested") return false;
      const metadata = event.metadata;
      return !metadata || typeof metadata !== "object" || !("scheduledAppointmentId" in metadata);
    }) ?? [];

  const shownCount = tab === "reviews" ? reviewQueue?.filter(item => matchesWork([item.case?.publicId,item.review.note,item.requester?.name]) && (!searchParams.get("review") || item.review._id === searchParams.get("review"))).length : tab === "assignments" ? assignmentOffers?.filter(item => matchesWork([item.case?.publicId,item.assignee?.name]) && (!searchParams.get("offer") || item.assignment._id === searchParams.get("offer"))).length : tab === "referrals" ? referralQueue?.filter(item => matchesWork([item.referral.publicId,item.referral.reason,item.case?.publicId]) && (!searchParams.get("referral") || item.referral._id === searchParams.get("referral"))).length : tab === "cases" ? cases?.filter(item => matchesWork([item.publicId,item.summary,item.status])).length : tab === "requests" ? requests?.filter(item => matchesWork([item.publicId,item.description,item.district]) && (!searchParams.get("request") || item._id === searchParams.get("request"))).length : undefined;
  return (
    <div className="workspace-page text-neutral-900">
      <header className="workspace-legacy-header border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading text-sm font-black text-white">
              LSF
            </div>
            <div>
              <p className="mb-0 font-heading text-base font-bold leading-tight">{c("Haki Yangu Operations")}</p>
              <p className="mb-0 text-xs text-neutral-500">{c("Legal assistance workspace")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("Updates")}</Link>
            <Link to="/dashboard/paralegal-reviews" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("Paralegal reviews")}</Link>
            <Link to="/dashboard/training-management" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("Training")}</Link>
            <Link to="/dashboard/reporting" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">{c("Reporting")}</Link>
            <Link
              to="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 sm:block"
            >{c("Public website")}</Link>
            <Button variant="outline" size="sm" onClick={() => signOut({ redirectUrl: '/' })}>
              <LogOut className="mr-2 h-4 w-4" />{c("Sign out")}</Button>
          </div>
        </div>
      </header>

      <main className="work-page mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-8">
        <WorkHeader eyebrow={greeting} title={c(({requests:'Requests',cases:'Cases',documents:'Documents',reviews:'Case reviews',assignments:'Cases to accept',matching:'Find a helper',referrals:'Referrals',services:'Service records'})[tab])} description={c(workspaceDescriptions[tab])}/>

        {!compactWorkspace && <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-8">
          <button type="button" onClick={() => setTab("requests")} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSearch className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{newCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("New requests")}</p>
          </button>
          <button type="button" onClick={() => { setTab("requests"); setRequestStatus("all"); }} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{urgentCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Urgent or safeguarding")}</p>
          </button>
          <button type="button" onClick={() => setTab("cases")} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{activeCases}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Active cases in scope")}</p>
          </button>
          <button type="button" onClick={() => { setTab("documents"); setDocumentStatus("pending_review"); }} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{pendingDocumentCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Documents to review")}</p>
          </button>
          <button type="button" onClick={() => { setTab("reviews"); setReviewQueueStatus("submitted"); }} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{pendingReviewCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Case review requests")}</p>
          </button>
          <button type="button" onClick={() => { setTab("assignments"); setAssignmentStatus("offered"); }} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <Clock3 className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{openAssignmentOfferCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Open assignment offers")}</p>
          </button>
          <button type="button" onClick={() => { setTab("matching"); setMatchingReviewStatus("pending_review"); }} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRoundCheck className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{matchingDecisionCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Matching reviews")}</p>
          </button>
          <button type="button" onClick={() => setTab("referrals")} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <ChevronRight className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{activeReferralCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Referrals in selected queue")}</p>
          </button>
          <button type="button" onClick={() => setTab("services")} className="rounded-2xl border bg-white p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{verifiedServiceCount}</p>
            <p className="mb-0 text-sm text-neutral-500">{c("Verified services")}</p>
          </button>
        </section>}

        {compactWorkspace && <div className="mb-5 space-y-4"><Link to={isSupervisor ? "/dashboard/supervisor" : "/dashboard/staff"} className="inline-block min-h-11 py-3 text-sm font-semibold text-primary">{c("← LSF workspace")}</Link><SearchFilterBar value={workSearch} onChange={setWorkSearch} placeholder={c("Find a case, request or name")} label={c("Show")} title={c("Work area and status")} summary={workspaceDescriptions[tab]} count={Number(!!workSearch)} onReset={() => setWorkSearch("")}><label className="block text-sm font-medium">{c("Work area")}<select className="mt-2 min-h-12 w-full rounded-xl border p-3" value={tab} onChange={event => setTab(event.target.value as WorkspaceTab)}>{workspaceTabs.map(value => <option key={value} value={value}>{{requests:"Requests",cases:"Cases",documents:"Documents",reviews:"Case reviews",assignments:"Cases to accept",matching:"Find a helper",referrals:"Referrals",services:"Service records"}[value]}</option>)}</select></label>{tab === "requests" && <label className="block text-sm font-medium">{c("Status")}<select className="mt-2 min-h-12 w-full rounded-xl border p-3" value={requestStatus} onChange={event=>setRequestStatus(event.target.value as typeof requestStatus)}>{[["all","All"],["submitted","New"],["under_review","Being reviewed"],["waiting_for_information","Waiting for details"]].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>}{tab === "documents" && <label className="block text-sm font-medium">{c("Status")}<select
                value={documentStatus}
                onChange={(event) =>
                  setDocumentStatus(event.target.value as typeof documentStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">{c("Pending review")}</option>
                <option value="accepted">{c("Accepted")}</option>
                <option value="rejected">{c("Rejected")}</option>
              </select></label>}{tab === "documents" && <label className="block text-sm font-medium">{c("Consent evidence status")}<select
                value={consentEvidenceStatus}
                onChange={(event) =>
                  setConsentEvidenceStatus(event.target.value as typeof consentEvidenceStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">{c("Pending review")}</option>
                <option value="accepted">{c("Accepted")}</option>
                <option value="rejected">{c("Rejected")}</option>
              </select></label>}{tab === "reviews" && <label className="block text-sm font-medium">{c("Status")}<select
                value={reviewStatus}
                onChange={(event) =>
                  setReviewQueueStatus(event.target.value as typeof reviewStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="submitted">{c("Submitted")}</option>
                <option value="under_review">{c("Under review")}</option>
                <option value="resolved">{c("Resolved")}</option>
                <option value="declined">{c("Declined")}</option>
              </select></label>}{tab === "assignments" && <label className="block text-sm font-medium">{c("Status")}<select
                  value={assignmentStatus}
                  onChange={(event) =>
                    setAssignmentStatus(event.target.value as typeof assignmentStatus)
                  }
                  className="h-11 rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="offered">{c("Offered")}</option>
                  <option value="accepted">{c("Accepted")}</option>
                  <option value="declined">{c("Declined")}</option>
                  <option value="expired">{c("Expired")}</option>
                  <option value="ended">{c("Ended")}</option>
                </select></label>}{tab === "matching" && <label className="block text-sm font-medium">{c("Status")}<select
                value={matchingReviewStatus}
                onChange={(event) => setMatchingReviewStatus(event.target.value as MatchingReviewStatus)}
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">{c("Pending review")}</option>
                <option value="restricted">{c("Restricted")}</option>
                <option value="escalated">{c("Escalated")}</option>
                <option value="needs_changes">{c("Needs changes")}</option>
                <option value="approved">{c("Approved")}</option>
              </select></label>}{tab === "referrals" && <label className="block text-sm font-medium">{c("Status")}<select
                value={referralStatus}
                onChange={(event) => setReferralStatus(event.target.value as ReferralQueueStatus)}
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="awaiting_beneficiary_consent">{c("Awaiting beneficiary consent")}</option>
                <option value="created">{c("Created")}</option>
                <option value="destination_notified">{c("Destination notified")}</option>
                <option value="accepted">{c("Accepted")}</option>
                <option value="declined">{c("Declined")}</option>
                <option value="scheduled">{c("Scheduled")}</option>
                <option value="service_delivered">{c("Service delivered")}</option>
                <option value="returned">{c("Returned")}</option>
                <option value="escalated">{c("Escalated")}</option>
                <option value="closed">{c("Closed")}</option>
              </select></label>}</SearchFilterBar>{(searchParams.get("review") || searchParams.get("offer") || searchParams.get("referral") || searchParams.get("request")) && <button className="min-h-11 text-sm font-semibold text-primary" onClick={() => setSearchParams(current => {const next=new URLSearchParams(current);["review","offer","referral","request"].forEach(key=>next.delete(key));return next;})}>{c("Show all in this queue")}</button>}{shownCount === 0 && <p role="status" className="rounded-xl bg-[#e7f4f1] p-4 text-sm">{c("No matches in this queue. Clear the search or choose another status.")}</p>}</div>}
        {notice && (
          <div
            role="status"
            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}
          >
            {notice.text}
          </div>
        )}

        <WorkConfirmation open={evidenceReview} title={c("Create a request with permission evidence?")} busy={pending} onConfirm={() => createCaseReferral(true)} onEdit={() => setEvidenceReview(false)}><p>{referralCapableServices.find(service => service._id === referralServiceId)?.name} · {receivingProviders?.find(person => person._id === referralDestinationUserId)?.name ?? "Receiving person not chosen"}</p><p className="whitespace-pre-wrap">{referralReason}</p><p>{c("Details to share: ")}{referralInformationShared}</p><p className="whitespace-pre-wrap">{c("Permission statement: ")}{referralConsentStatement}</p><p>{c("Evidence: ")}{statusLabel(referralConsentMethod)} · {referralConsentFile?.name ?? "No file"}</p><p>{c("The person must still agree before the receiving service is notified.")}</p>{notice?.type === "error" && <p role="alert" className="text-red-800">{notice.text}</p>}</WorkConfirmation>
        <WorkConfirmation open={Boolean(reviewDecision)} title={reviewDecision?.status === "resolved" ? "Complete this review?" : "Decline this review?"} busy={pending} onConfirm={() => { if (reviewDecision) decideReviewRequest(reviewDecision.id as Id<"case_review_requests">, reviewDecision.status as "resolved" | "declined", true); }} onEdit={() => setReviewDecision(null)}><p className="whitespace-pre-wrap">{reviewDecision?.note}</p><p>{c("This saves the decision and reason. It does not close the case.")}</p></WorkConfirmation>

        {tab === "referrals" ? (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl">{c("Referral coordination")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Propose a handoff, wait for beneficiary consent, then track where the case moved, what was shared, and whether the destination accepted responsibility.")}</p>
              </div>
              {!compactWorkspace && (<select
                value={referralStatus}
                onChange={(event) => setReferralStatus(event.target.value as ReferralQueueStatus)}
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="awaiting_beneficiary_consent">{c("Awaiting beneficiary consent")}</option>
                <option value="created">{c("Created")}</option>
                <option value="destination_notified">{c("Destination notified")}</option>
                <option value="accepted">{c("Accepted")}</option>
                <option value="declined">{c("Declined")}</option>
                <option value="scheduled">{c("Scheduled")}</option>
                <option value="service_delivered">{c("Service delivered")}</option>
                <option value="returned">{c("Returned")}</option>
                <option value="escalated">{c("Escalated")}</option>
                <option value="closed">{c("Closed")}</option>
              </select>)}
            </div>
            <div className="divide-y">
              {referralQueue === undefined && (
                <BrandLoading compact text={c("Loading referrals...")}/>
              )}
              {referralQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <ChevronRight className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">{c("No referrals in this queue")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Referrals created from cases will appear here with their destination service and beneficiary-safe status trail.")}</p>
                </div>
              )}
              {referralQueue?.filter(item => matchesWork([item.referral.publicId, item.referral.reason, item.case?.publicId]) && (!searchParams.get("referral") || item.referral._id === searchParams.get("referral"))).map((item) => (
                <div key={item.referral._id} className="work-decision-row">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.referral.publicId}
                      </h3>
                      <StatusPill value={statusLabel(item.referral.status)} urgent={["created", "returned", "escalated"].includes(item.referral.status)} />
                      {item.case && (
                        <StatusPill value={statusLabel(item.case.status)} urgent={item.case.priority !== "standard"} />
                      )}
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {item.case?.publicId ?? "Case unavailable"} ·{" "}
                      {item.destinationService?.name ?? "Destination service unavailable"}
                    </p>
                    <p className="mb-3 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                      {item.referral.reason}
                    </p>
                    <div className="grid gap-2 text-xs text-neutral-600 sm:grid-cols-2">
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{c("Destination")}</p>
                        <p className="mb-0">
                          {item.destinationService
                            ? `${item.destinationService.district}, ${item.destinationService.region}`
                          : "Not available"}
                        </p>
                      </div>
                      {item.parentReferral && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-3">
                          <p className="mb-1 font-bold text-neutral-800">{c("Parent referral")}</p>
                          <p className="mb-0">{item.parentReferral.publicId}</p>
                        </div>
                      )}
                      {item.onwardReferral && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-3">
                          <p className="mb-1 font-bold text-neutral-800">{c("Onward referral")}</p>
                          <p className="mb-0">{item.onwardReferral.publicId}</p>
                        </div>
                      )}
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{item.referral.status === "awaiting_beneficiary_consent" ? c("Information proposed for sharing") : c("Information shared")}</p>
                        <p className="mb-0">
                          {item.referral.informationShared.join(", ") || "Not recorded"}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{c("Consent status")}</p>
                        <p className="mb-0 capitalize">
                          {item.consent?.granted ? statusLabel(item.consent.method) ?? "Recorded" : "Awaiting beneficiary decision"}
                        </p>
                        {item.consent?.evidenceNote && (
                          <p className="mb-0 mt-1 text-neutral-500">{item.consent.evidenceNote}</p>
                        )}
                        {item.consent?.evidenceFileName && (
                          <p className="mb-0 mt-1 text-neutral-500">{c("File: ")}{item.consent.evidenceFileName}
                          </p>
                        )}
                        {item.consent?.reviewStatus && (
                          <p className="mb-0 mt-1 text-neutral-500 capitalize">{c("Review: ")}{statusLabel(item.consent.reviewStatus)}
                          </p>
                        )}
                        {item.consent?.retentionStatus && (
                          <p className="mb-0 mt-1 text-neutral-500 capitalize">{c("Retention: ")}{item.consent.retentionStatus}
                          </p>
                        )}
                        {item.consentEvidenceUrl && (
                          <a
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary underline"
                            href={item.consentEvidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >{c("Open consent file")}<ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    {item.referral.declineReason && (
                      <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                        <span className="font-bold">{c("Decline reason:")}</span>{" "}
                        {item.referral.declineReason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="mb-0 rounded-xl bg-[#fbf7f8] p-3 text-xs text-neutral-600">{c("Created ")}{formatDate(item.referral.createdAt)}{c(". Update only when there is evidence from the destination service.")}</p>
                    {item.case && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCaseId(item.case!._id);
                          setTab("cases");
                        }}
                      >{c("Open case")}</Button>
                    )}
                    {item.referral.status === "created" && (
                      <>
                        <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "destination_notified", "Destination service notified by LSF.")}>{c("Mark notified")}</Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "accepted", "Destination accepted the referral.")}>{c("Mark accepted")}</Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "declined", "Destination cannot accept this referral.")}>{c("Mark declined")}</Button>
                      </>
                    )}
                    {item.referral.status === "destination_notified" && (
                      <>
                        <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "accepted", "Destination accepted the referral.")}>{c("Mark accepted")}</Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "returned", "Destination returned the referral for LSF follow-up.")}>{c("Mark returned")}</Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "declined", "Destination cannot accept this referral.")}>{c("Mark declined")}</Button>
                      </>
                    )}
                    {item.referral.status === "accepted" && (
                      <>
                        <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "scheduled", "Destination scheduled support with the beneficiary.")}>{c("Mark scheduled")}</Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "service_delivered", "Destination delivered the referred service.")}>{c("Service delivered")}</Button>
                      </>
                    )}
                    {item.referral.status === "scheduled" && (
                      <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "service_delivered", "Destination delivered the referred service.")}>{c("Service delivered")}</Button>
                    )}
                    {["accepted", "scheduled", "service_delivered", "returned", "escalated"].includes(item.referral.status) && (
                      <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "closed", "Referral closed by LSF operations.")}>{c("Close referral")}</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "matching" ? (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl">{c("Matching decision review")}</h2>
                <p className="mb-0 max-w-3xl text-sm text-neutral-500">{c("Review Haki Yangu service matches before they become operational evidence. Immediate-safety matches are restricted until LSF safeguarding staff approves the route.")}</p>
              </div>
              {!compactWorkspace && (<select
                value={matchingReviewStatus}
                onChange={(event) => setMatchingReviewStatus(event.target.value as MatchingReviewStatus)}
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">{c("Pending review")}</option>
                <option value="restricted">{c("Restricted")}</option>
                <option value="escalated">{c("Escalated")}</option>
                <option value="needs_changes">{c("Needs changes")}</option>
                <option value="approved">{c("Approved")}</option>
              </select>)}
            </div>
            <div className="divide-y">
              {matchingDecisionQueue === undefined && (
                <BrandLoading compact text={c("Loading matching decisions...")}/>
              )}
              {matchingDecisionQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <UserRoundCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">{c("No matching decisions in this queue")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Service directory and app matching decisions will appear here for staff governance.")}</p>
                </div>
              )}
              {matchingDecisionQueue?.filter(item => matchesWork([item.decision?._id, item.case?.publicId])).map((item) => (
                <div key={item.decision._id} className="grid gap-4 p-5 xl:grid-cols-[1fr_300px]">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.decision.issueCategory || item.decision.ordinaryProblem || "Uncategorized match"}
                      </h3>
                      <StatusPill value={statusLabel((item.decision.reviewStatus ?? "pending_review"))} urgent={["restricted", "escalated"].includes(item.decision.reviewStatus ?? "")} />
                      {item.decision.urgency && (
                        <StatusPill value={statusLabel(item.decision.urgency)} urgent={item.decision.urgency === "immediate_safety"} />
                      )}
                    </div>
                    <p className="mb-3 text-sm text-neutral-600">{c("Source: ")}{item.decision.source} · {item.decision.region || "region unknown"}
                      {item.decision.district ? `, ${item.decision.district}` : ""}{c(" · Created ")}{formatDate(item.decision.createdAt)}
                    </p>
                    <div className="grid gap-3 lg:grid-cols-2">
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{c("Linked record")}</p>
                        <p className="mb-0 text-sm text-neutral-600">
                          {item.request?.publicId ?? item.case?.publicId ?? "No request or case linked"}
                        </p>
                        {item.requester && (
                          <p className="mb-0 mt-1 text-xs text-neutral-500">
                            {item.requester.name || item.requester.email || "Requester recorded"}
                          </p>
                        )}
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">{c("Safety controls")}</p>
                        <p className="mb-0 text-sm text-neutral-600">
                          {item.decision.safetyFlags.length > 0 ? item.decision.safetyFlags.join(", ") : "No safety flags"}
                        </p>
                        {item.decision.restrictionReason && (
                          <p className="mb-0 mt-1 text-xs text-primary">{item.decision.restrictionReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl border bg-white p-3">
                      <p className="mb-2 font-bold text-neutral-800">{c("Why this match happened")}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.decision.explanation.length > 0 ? item.decision.explanation.map((reason) => (
                          <span key={reason} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {reason}
                          </span>
                        )) : (
                          <span className="text-sm text-neutral-500">{c("No explanation recorded.")}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl border bg-white p-3">
                      <p className="mb-2 font-bold text-neutral-800">{c("Recommended services")}</p>
                      {item.recommendedServices.length === 0 ? (
                        <p className="mb-0 text-sm text-neutral-500">{c("No service recommendations are shown. This is expected for restricted safeguarding matches.")}</p>
                      ) : (
                        <div className="grid gap-2 md:grid-cols-2">
                          {item.recommendedServices.map((service) => (
                            <div key={service._id} className="rounded-xl border bg-[#fbf7f8] p-3">
                              <p className="mb-1 font-bold text-neutral-800">{service.name}</p>
                              <p className="mb-1 text-xs text-neutral-600">
                                {service.organizationName || "Organization not linked"} · {service.district}, {service.region}
                              </p>
                              <p className="mb-0 text-xs text-neutral-500">{c("Intake: ")}{statusLabel(service.currentIntakeState)}{c(" · Referral: ")}{service.referralCapability ? "yes" : "no"}{c(" · Emergency: ")}{service.emergencyCapability ? "yes" : "no"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Textarea
                      value={reviewNotesById[item.decision._id] ?? ""}
                      onChange={(event) =>
                        setReviewNotesById((previous) => ({
                          ...previous,
                          [item.decision._id]: event.target.value,
                        }))
                      }
                      placeholder={c("Staff review note, safety reason, or route correction")}
                      rows={5}
                    />
                    <Button disabled={pending} onClick={() => reviewMatchDecision(item.decision._id, "approved")}>{c("Approve match")}</Button>
                    <Button disabled={pending} variant="outline" onClick={() => reviewMatchDecision(item.decision._id, "needs_changes")}>{c("Needs changes")}</Button>
                    <Button disabled={pending} variant="outline" onClick={() => reviewMatchDecision(item.decision._id, "escalated")}>{c("Escalate to safeguarding lead")}</Button>
                    <Button disabled={pending} variant="outline" onClick={() => reviewMatchDecision(item.decision._id, "restricted")}>{c("Restrict recommendations")}</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "services" ? (
          <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
            <DirectoryResearchQueue />
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl">{editingOrganizationId ? c("Edit organisation") : "Partner organization"}</h2>{editingOrganizationId && <button className="text-sm underline" onClick={() => { setEditingOrganizationId(null); setOrganizationForm(initialOrganizationForm); }}>{c("Cancel editing")}</button>}
                <p className="mb-0 text-sm text-neutral-500">{c("Create accountable organizations before linking their service points.")}</p>
              </div>
              <div className="space-y-3">
                <input
                  value={organizationForm.name}
                  onChange={(event) => updateOrganizationForm({ name: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Organization name")}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={organizationForm.organizationType}
                    onChange={(event) => updateOrganizationForm({ organizationType: event.target.value as OrganizationFormState["organizationType"] })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                  >
                    <option value="legal_aid_provider">{c("Legal aid provider")}</option>
                    <option value="government">{c("Government")}</option>
                    <option value="cso">{c("CSO")}</option>
                    <option value="community_paralegal_network">{c("Paralegal network")}</option>
                    <option value="private_provider">{c("Private provider")}</option>
                    <option value="donor_partner">{c("Donor partner")}</option>
                    <option value="lsf">LSF</option>
                    <option value="other">{c("Other")}</option>
                  </select>
                  <p className="rounded-xl border bg-[#fbf7f8] p-3 text-sm text-neutral-600">{c("New organisation: draft until independent LSF review.")}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="rounded-xl border bg-[#fbf7f8] p-3 text-sm text-neutral-600">{c("Referral agreement: none until separately reviewed.")}</p>
                  <input
                    value={organizationForm.slaHours}
                    onChange={(event) => updateOrganizationForm({ slaHours: event.target.value })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("SLA hours")}
                  />
                </div>
                <input
                  value={organizationForm.focalPersonName}
                  onChange={(event) => updateOrganizationForm({ focalPersonName: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Focal person")}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={organizationForm.focalPersonEmail}
                    onChange={(event) => updateOrganizationForm({ focalPersonEmail: event.target.value })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("Focal email")}
                  />
                  <input
                    value={organizationForm.focalPersonPhone}
                    onChange={(event) => updateOrganizationForm({ focalPersonPhone: event.target.value })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("Focal phone")}
                  />
                </div>
                <input
                  value={organizationForm.dataSharingAgreementVersion}
                  onChange={(event) => updateOrganizationForm({ dataSharingAgreementVersion: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Data sharing agreement version")}
                />
                <label className="flex items-center gap-2 rounded-xl border bg-[#fbf7f8] p-3 text-sm font-semibold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={organizationForm.safeguardingReady}
                    onChange={(event) => updateOrganizationForm({ safeguardingReady: event.target.checked })}
                  />{c("Safeguarding ready")}</label>
                <Textarea
                  value={organizationForm.notes}
                  onChange={(event) => updateOrganizationForm({ notes: event.target.value })}
                  className="min-h-[72px]"
                  placeholder={c("Operational notes, coverage limits, escalation contacts...")}
                />
                <Button onClick={createOrganization} disabled={pending || !directoryCanManage} className="w-full">
                  {editingOrganizationId ? "Save organisation changes" : "Create organization"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl">{c("Justice Service Management")}</h2>{editingServiceId && <button className="text-sm underline" onClick={() => { setEditingServiceId(null); setServiceForm(initialServiceForm); }}>{c("Cancel editing")}</button>}
                <p className="mb-0 text-sm text-neutral-500">{c("Add and verify service points for Haki Yangu matching. Public mobile discovery only shows active, verified, public records.")}</p>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">{c("Service name")}</label>
                <input
                  value={serviceForm.name}
                  onChange={(event) => updateServiceForm({ name: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Kinondoni Community Paralegal Desk")}
                />
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">{c("Organisation")}</label>
                <select
                  value={serviceForm.organizationId}
                  onChange={(event) => updateServiceForm({ organizationId: event.target.value, organizationName: "" })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="">{c("No linked organization")}</option>
                  {justiceOrganizations?.filter(organization => matchesWork([organization.name, organization.organizationType])).map((organization) => (
                    <option key={organization._id} value={organization._id}>
                      {organization.name} · {organization.verificationStatus}
                    </option>
                  ))}
                </select>
                <input
                  value={serviceForm.organizationName}
                  onChange={(event) => updateServiceForm({ organizationName: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Fallback organization name if not linked")}
                  disabled={Boolean(serviceForm.organizationId)}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">{c("Type")}</label>
                    <select
                      value={serviceForm.servicePointType}
                      onChange={(event) => updateServiceForm({ servicePointType: event.target.value as ServiceFormState["servicePointType"] })}
                      className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    >
                      <option value="paralegal">{c("Paralegal")}</option>
                      <option value="legal_aid_provider">{c("Legal aid provider")}</option>
                      <option value="partner_organisation">{c("Partner organisation")}</option>
                      <option value="government_office">{c("Government office")}</option>
                      <option value="local_government">{c("Local government")}</option>
                      <option value="police_gender_children_desk">{c("Police gender / children desk")}</option>
                      <option value="social_welfare">{c("Social welfare office")}</option>
                      <option value="court_or_tribunal">{c("Court or tribunal")}</option>
                      <option value="labour_service">{c("Labour service")}</option>
                      <option value="land_service">{c("Land service")}</option>
                      <option value="mediation">{c("Mediation service")}</option>
                      <option value="protection_service">{c("Protection service")}</option>
                      <option value="safe_house">{c("Safe house / shelter")}</option>
                      <option value="cso">{c("CSO")}</option>
                      <option value="other">{c("Other")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">{c("Verification")}</label>
                    <p className="rounded-xl border bg-[#fbf7f8] p-3 text-sm text-neutral-600">{c("New service: inactive draft until source and contact verification.")}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={serviceForm.region}
                    onChange={(event) => updateServiceForm({ region: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("Region")}
                  />
                  <input
                    value={serviceForm.district}
                    onChange={(event) => updateServiceForm({ district: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("District")}
                  />
                </div>
                <Textarea
                  value={serviceForm.issueCategories}
                  onChange={(event) => updateServiceForm({ issueCategories: event.target.value })}
                  className="min-h-[72px]"
                  placeholder={c("employment, land, family")}
                />
                <Textarea
                  value={serviceForm.serviceTypes}
                  onChange={(event) => updateServiceForm({ serviceTypes: event.target.value })}
                  className="min-h-[72px]"
                  placeholder={c("legal_information, referral, appointment")}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={serviceForm.phone}
                    onChange={(event) => updateServiceForm({ phone: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("+255...")}
                  />
                  <input
                    value={serviceForm.capacity}
                    onChange={(event) => updateServiceForm({ capacity: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder={c("Capacity")}
                  />
                </div>
                <input
                  value={serviceForm.languages}
                  onChange={(event) => updateServiceForm({ languages: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Swahili, English")}
                />
                <input
                  value={serviceForm.openingHours}
                  onChange={(event) => updateServiceForm({ openingHours: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder={c("Mon - Fri, 9:00 AM - 5:00 PM")}
                />
                <label className="block text-sm">{c("Intake availability")}<select aria-label={c("Intake availability")} value={serviceForm.currentIntakeState} onChange={event => updateServiceForm({currentIntakeState: event.target.value as ServiceFormState['currentIntakeState']})} className="mt-1 block w-full rounded-lg border p-3"><option value="closed">{c("Unavailable for matching")}</option><option value="open">{c("Confirmed open")}</option><option value="limited">{c("Confirmed limited intake")}</option><option value="emergency_only">{c("Confirmed emergency intake only")}</option></select></label>
                <p className="text-xs text-neutral-500">{c("New drafts start unavailable for matching. Record only confirmed capacity, languages and capabilities; unchecked capabilities have not been established. Independent verification is still required before publication.")}</p>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    ["Referral capable", "referralCapability"],
                    ["Walk-in", "walkIn"],
                    ["Appointment required", "appointmentRequired"],
                    ["Remote support", "remoteSupport"],
                    ["Phone support", "phoneSupport"],
                    ["Emergency capable", "emergencyCapability"],
                    ["Private space", "privacyAvailable"],
                    ["Gender-sensitive", "genderSensitive"],
                  ].map(([label, key]) => (
                    <label key={key} className="flex items-center gap-2 rounded-xl border bg-[#fbf7f8] p-3 font-semibold text-neutral-700">
                      <input
                        type="checkbox"
                        checked={Boolean(serviceForm[key as keyof ServiceFormState])}
                        onChange={(event) => updateServiceForm({ [key]: event.target.checked } as Partial<ServiceFormState>)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {editingServiceId && <label className="block text-sm">{c("Reason for service changes")}<textarea value={serviceEditReason} onChange={event => setServiceEditReason(event.target.value)} className="mt-1 block w-full rounded-lg border p-3" placeholder={c("Explain any intake or lifecycle change (10–1000 characters)")} /></label>}
                {([['latitude', 'Office latitude (verified pin)'], ['longitude', 'Office longitude (verified pin)'], ['physicalLocation', 'Public address or meeting location'], ['serviceCoverageRegions', 'Coverage regions (comma separated)'], ['eligibility', 'Who can use this service']] as const).map(([key,label]) => <label className="block text-sm" key={key}>{label}<input value={serviceForm[key]} onChange={event => updateServiceForm({ [key]: event.target.value })} className="mt-1 block w-full rounded-lg border p-3" /></label>)}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button onClick={createServicePoint} disabled={pending || !directoryCanManage}>
                    {editingServiceId ? "Save service changes" : "Create service"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm xl:col-span-2">
              <div className="border-b p-5">
                <h2 className="text-xl">{c("Verified service ecosystem")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Review active services, visibility, verification and intake state. Confidential locations must not be made public.")}</p>
              </div>
              <div className="border-b bg-[#fbf7f8] p-5">
                <h3 className="mb-3 text-base">{c("Organization accountability")}</h3>
                <div className="grid gap-3 lg:grid-cols-2">
                  {justiceOrganizations?.filter(organization => matchesWork([organization.name, organization.organizationType])).map((organization) => (
                    <div key={organization._id} className="rounded-xl border bg-white p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="mb-0 font-bold">{organization.name}</p>
                        <StatusPill value={organization.verificationStatus} urgent={organization.verificationStatus !== "verified"} />
                        <StatusPill value={statusLabel(organization.referralAgreementStatus)} urgent={organization.referralAgreementStatus !== "active"} />
                      </div>
                      <p className="mb-1 text-sm capitalize text-neutral-600">
                        {statusLabel(organization.organizationType)} · {organization.focalPersonName ?? "No focal person"}
                      </p>
                      <p className="mb-0 text-xs text-neutral-500">{c("SLA: ")}{organization.slaHours ? `${organization.slaHours}h` : "not set"}{c(" · Services: ")}{organization.serviceCount}{c(" · Referral capable: ")}{organization.activeReferralServiceCount}
                      </p><Button disabled={!directoryCanManage} variant="outline" className="mt-3" onClick={() => { setEditingOrganizationId(organization._id); setOrganizationForm({ ...initialOrganizationForm, name: organization.name, organizationType: organization.organizationType, verificationStatus: organization.verificationStatus, referralAgreementStatus: organization.referralAgreementStatus, focalPersonName: organization.focalPersonName ?? "", focalPersonEmail: organization.focalPersonEmail ?? "", focalPersonPhone: organization.focalPersonPhone ?? "", slaHours: organization.slaHours === undefined ? "" : String(organization.slaHours), safeguardingReady: organization.safeguardingReady, dataSharingAgreementVersion: organization.dataSharingAgreementVersion ?? "", notes: organization.notes ?? "" }); }}>{c("Edit organisation")}</Button>{<div className="mt-3 space-y-2">{organization.verificationStatus !== "verified" && organization.verificationStatus !== "inactive" && <Button disabled={pending || !directoryCanManage || (organisationRemovalReasons[organization._id]?.trim().length ?? 0) < 10} onClick={() => void run(async () => { await updateJusticeOrganization({ id: organization._id, updates: { verificationStatus: "verified", notes: organisationRemovalReasons[organization._id] } }); setNotice({ type: "success", text: "Organisation independently verified. Service records still require their own review." }); })}>{c("Verify organisation")}</Button>}{organization.verificationStatus === "verified" && organization.referralAgreementStatus !== "active" && <Button disabled={pending || !directoryCanManage || !organization.safeguardingReady || !organization.dataSharingAgreementVersion || (organisationRemovalReasons[organization._id]?.trim().length ?? 0) < 10} onClick={() => void run(async () => { await updateJusticeOrganization({ id: organization._id, updates: { referralAgreementStatus: "active", notes: organisationRemovalReasons[organization._id] } }); setNotice({ type: "success", text: "Reviewed referral agreement activated." }); })}>{c("Activate reviewed referral agreement")}</Button>}<p className="text-xs text-neutral-500">{c("A different reviewer must verify this organisation. Activate referrals only after confirming safeguarding readiness and the agreement.")}</p><label className="block text-xs">{c("Review, removal or restoration reason")}<input value={organisationRemovalReasons[organization._id] ?? ""} onChange={event => setOrganisationRemovalReasons(current => ({ ...current, [organization._id]: event.target.value }))} className="mt-1 block w-full rounded-lg border p-2" /></label><Button disabled={pending || !directoryCanManage || (organisationRemovalReasons[organization._id]?.trim().length ?? 0) < 10} variant="outline" onClick={() => void run(async () => { await updateJusticeOrganization({ id: organization._id, updates: { verificationStatus: organization.verificationStatus === "inactive" ? "draft" : "inactive", notes: organisationRemovalReasons[organization._id] } }); setNotice({ type: "success", text: organization.verificationStatus === "inactive" ? "Organisation restored as a draft. Services require verification before public use." : "Organisation removed from active use. Linked services are deactivated; history is retained." }); })}>{organization.verificationStatus === "inactive" ? "Restore to review" : c("Remove from active directory")}</Button></div>}
                    </div>
                  ))}
                  {justiceOrganizations?.length === 0 && (
                    <p className="mb-0 text-sm text-neutral-500">{c("No organizations created yet.")}</p>
                  )}
                </div>
              </div>
              <div className="border-b p-5">
                <div className="mb-4 flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
                  <div>
                    <h3 className="mb-1 text-base">{c("Partner referral performance")}</h3>
                    <p className="mb-0 text-sm text-neutral-500">{c("Last 30 days: SLA compliance, first response speed, overdue open referrals, delivery and onward referrals.")}</p>
                  </div>
                  {partnerPerformance && (
                    <div className="grid gap-2 text-xs text-neutral-600 sm:grid-cols-5">
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{partnerPerformance.totals.referrals}{c(" referrals")}</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{partnerPerformance.totals.responded}{c(" responded")}</span>
                      <span className="rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-800">{partnerPerformance.totals.overdueOpen}{c(" overdue")}</span>
                      <span className="rounded-full bg-teal-100 px-3 py-1 font-bold text-teal-800">{partnerPerformance.totals.delivered}{c(" delivered")}</span>
                      <span className="rounded-full bg-[#f8eaf0] px-3 py-1 font-bold text-primary">{partnerPerformance.totals.onward}{c(" onward")}</span>
                    </div>
                  )}
                </div>
                {partnerPerformance === undefined && (
                  <BrandLoading compact text={c("Loading partner performance...")}/>
                )}
                {partnerPerformance?.partners.length === 0 && (
                  <p className="mb-0 text-sm text-neutral-500">{c("No referral performance data for this period yet.")}</p>
                )}
                <div className="grid gap-3 xl:grid-cols-2">
                  {partnerPerformance?.partners.slice(0, 8).map((partner) => (
                    <div key={partner.organizationId} className="rounded-xl border bg-[#fbfafa] p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="mb-0 font-bold">{partner.organizationName}</p>
                        <StatusPill value={`${partner.slaComplianceRate}% SLA`} urgent={partner.slaComplianceRate < 80 && partner.respondedCount > 0} />
                        {partner.overdueOpenCount > 0 && <StatusPill value={`${partner.overdueOpenCount} overdue`} urgent />}
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">{c("Response: ")}{partner.responseRate}{c("% · Avg response: ")}{partner.averageResponseHours ?? "n/a"}{c("h · SLA: ")}{partner.slaHours}h
                      </p>
                      <p className="mb-2 text-xs text-neutral-500">{c("Delivered: ")}{partner.deliveredCount}{c(" · Closed: ")}{partner.closedCount}{c(" · Onward: ")}{partner.onwardCount}
                      </p>
                      <p className="mb-0 text-xs text-neutral-500">{c("Services: ")}{partner.serviceNames.join(", ") || "No linked service names"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="divide-y">
                {justiceServices === undefined && (
                  <BrandLoading compact text={c("Loading services...")}/>
                )}
                {justiceServices?.length === 0 && (
                  <div className="p-10 text-center">
                    <Building2 className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                    <p className="mb-1 font-bold">{c("No services yet")}</p>
                    <p className="mb-0 text-sm text-neutral-500">{c("Add a service manually or seed QA services for mobile testing.")}</p>
                  </div>
                )}
                {justiceServices?.filter(service => matchesWork([service.name, service.region, service.district])).map((service) => (
                  <div key={service._id} className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="mb-0 text-lg">{service.name}</h3>
                        <StatusPill value={service.verificationStatus} urgent={service.verificationStatus !== "verified"} />
                        <StatusPill value={service.visibility} urgent={service.visibility !== "public"} />
                        {!service.active && <StatusPill value="inactive" urgent />}
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">
                        {service.organizationName ?? "No organisation"} · {statusLabel(service.servicePointType)} · {service.district}, {service.region}
                      </p>
                      {service.organization && (
                        <p className="mb-2 text-sm text-neutral-500">{c("Owner status: ")}{service.organization.verificationStatus}{c(" · Agreement: ")}{service.organization.referralAgreementStatus}{c(" · SLA: ")}{service.organization.slaHours ? `${service.organization.slaHours}h` : "not set"}
                        </p>
                      )}
                      <p className="mb-3 text-sm text-neutral-500">{c("Intake: ")}{statusLabel(service.currentIntakeState)}{c(" · Capacity: ")}{service.capacity ?? "not set"}{c(" · Languages: ")}{service.languages.join(", ") || "not set"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.issueCategories.slice(0, 6).map((category) => (
                          <span key={category} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button disabled={!directoryCanManage} variant="outline" onClick={() => { setEditingServiceId(service._id); setServiceEditReason(""); setServiceForm({ ...initialServiceForm, name: service.name, organizationId: service.organizationId ?? "", organizationName: service.organizationName ?? "", servicePointType: service.servicePointType, classification: service.classification, visibility: service.visibility, verificationStatus: service.verificationStatus, region: service.region, district: service.district, latitude: service.latitude?.toString() ?? "", longitude: service.longitude?.toString() ?? "", physicalLocation: service.physicalLocation ?? "", serviceCoverageRegions: service.serviceCoverageRegions.join(", "), eligibility: service.eligibility ?? "", issueCategories: service.issueCategories.join(", "), serviceTypes: service.serviceTypes.join(", "), phone: service.phone ?? "", openingHours: service.openingHours ?? "", currentIntakeState: service.currentIntakeState, capacity: service.capacity === undefined ? "" : String(service.capacity), languages: service.languages.join(", "), referralCapability: service.referralCapability, walkIn: service.walkIn, appointmentRequired: service.appointmentRequired, remoteSupport: service.remoteSupport, phoneSupport: service.phoneSupport, emergencyCapability: service.emergencyCapability, privacyAvailable: service.privacyAvailable, genderSensitive: service.genderSensitive }); }}>{c("Edit service")}</Button>
                      <textarea value={serviceDecisionReasons[service._id] ?? ""} onChange={(event) => setServiceDecisionReasons((current) => ({ ...current, [service._id]: event.target.value }))} className="min-h-[72px] rounded-xl border bg-white p-3 text-sm" placeholder={c("Verification or deactivation reason (10+ characters)")} aria-label={`Decision reason for ${service.name}`} />
                      {service.verificationStatus !== "verified" ? <><input value={serviceEvidence[service._id]?.source ?? service.source ?? ""} onChange={(event) => setServiceEvidence((current) => ({ ...current, [service._id]: { source: event.target.value, authority: current[service._id]?.authority ?? service.verifyingAuthority ?? "" } }))} className="h-11 rounded-xl border bg-white px-3 text-sm" placeholder={c("Checked source (official URL or named contact)")} aria-label={`Checked source for ${service.name}`} /><input value={serviceEvidence[service._id]?.authority ?? service.verifyingAuthority ?? ""} onChange={(event) => setServiceEvidence((current) => ({ ...current, [service._id]: { source: current[service._id]?.source ?? service.source ?? "", authority: event.target.value } }))} className="h-11 rounded-xl border bg-white px-3 text-sm" placeholder={c("Verifying authority")} aria-label={`Verifying authority for ${service.name}`} /><p className="text-xs text-neutral-500">{c("A different LSF reviewer must confirm this source and the service contact.")}</p></> : null}
                      {service.verificationStatus !== "verified" && (
                        <Button disabled={pending || !directoryCanManage} onClick={() => setServiceVerified(service._id)}>{c("Verify")}</Button>
                      )}
                      {service.verificationStatus !== "inactive" ? (
                        <Button disabled={pending || !directoryCanManage} variant="outline" onClick={() => deactivateService(service._id)}>{c("Remove from active directory")}</Button>
                      ) : null}
                      <p className="mb-0 rounded-xl bg-[#fbf7f8] p-3 text-xs text-neutral-600">{c("Public app can only show active, verified, public service records.")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : tab === "assignments" ? (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl">{c("Assignment offer monitor")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Track provider offers, expiry windows, and stalled assignment handoffs.")}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {!compactWorkspace && (<select
                  value={assignmentStatus}
                  onChange={(event) =>
                    setAssignmentStatus(event.target.value as typeof assignmentStatus)
                  }
                  className="h-11 rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="offered">{c("Offered")}</option>
                  <option value="accepted">{c("Accepted")}</option>
                  <option value="declined">{c("Declined")}</option>
                  <option value="expired">{c("Expired")}</option>
                  <option value="ended">{c("Ended")}</option>
                </select>)}
                <Button
                  disabled={pending}
                  variant="outline"
                  onClick={expireStaleOffersNow}
                >{c("Expire stale offers now")}</Button>
              </div>
            </div>
            <div className="divide-y">
              {assignmentOffers === undefined && (
                <BrandLoading compact text={c("Loading assignment offers...")}/>
              )}
              {assignmentOffers?.length === 0 && (
                <div className="p-10 text-center">
                  <UserRoundCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">{c("No assignment offers in this status")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("New provider offers and expired handoffs will appear here.")}</p>
                </div>
              )}
              {assignmentOffers?.filter(item => matchesWork([item.case?.publicId, item.assignee?.name]) && (!searchParams.get("offer") || item.assignment._id === searchParams.get("offer"))).map((item) => {
                const expiresAt = item.history.expiresAt;
                const isStale = item.history.isOverdue;
                return (
                  <div
                    key={item.assignment._id}
                    className="work-decision-row"
                  >
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="mb-0 text-lg">
                          {item.case?.publicId ?? "Case unavailable"}
                        </h3>
                        <StatusPill
                          value={item.assignment.status}
                          urgent={isStale || item.assignment.status === "expired"}
                        />
                        {item.case && (
                          <StatusPill
                            value={statusLabel(item.case.status)}
                            urgent={item.case.priority !== "standard"}
                          />
                        )}
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">{c("Offered to ")}{item.assignee?.name ?? "Unknown provider"} by{" "}
                        {item.offeredBy?.name ?? "LSF staff"}
                      </p>
                      {item.case?.summary && (
                        <p className="mb-0 line-clamp-2 max-w-4xl text-sm leading-6 text-neutral-600">
                          {item.case.summary}
                        </p>
                      )}
                      {item.assignment.reason && (
                        <p className="mt-3 rounded-xl bg-[#f8f2f4] p-3 text-sm text-neutral-700">
                          {item.assignment.reason}
                        </p>
                      )}
                      <div className="mt-3 grid gap-2 text-xs text-neutral-600 sm:grid-cols-2">
                        <div className="rounded-xl border bg-white p-3">
                          <p className="mb-1 font-bold text-neutral-800">{c("Availability at offer")}</p>
                          <p className="mb-0 capitalize">
                            {statusLabel(item.history.availabilityStatus)}
                          </p>
                        </div>
                        <div className="rounded-xl border bg-white p-3">
                          <p className="mb-1 font-bold text-neutral-800">{c("Response evidence")}</p>
                          <p className="mb-0">
                            {item.history.responseHours !== null
                              ? `${item.history.responseHours} hours after offer`
                              : `${item.history.offerAgeHours} hours open`}
                          </p>
                        </div>
                      </div>
                      {item.history.availabilityOverrideReason && (
                        <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                          <span className="font-bold">{c("Availability override:")}</span>{" "}
                          {item.history.availabilityOverrideReason}
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl border bg-[#fbf7f8] p-4 text-sm">
                      <p className="mb-2 font-bold">{c("Offer timing")}</p>
                      <p className="mb-1 text-neutral-600">{c("Offered: ")}{formatDate(item.assignment.offeredAt)}
                      </p>
                      <p className={`mb-3 ${isStale ? "font-bold text-orange-700" : "text-neutral-600"}`}>{c("Expires: ")}{formatDate(expiresAt)}
                      </p>
                      {item.assignment.respondedAt && (
                        <p className="mb-1 text-neutral-600">{c("Responded: ")}{formatDate(item.assignment.respondedAt)}
                        </p>
                      )}
                      {item.assignment.endedAt && (
                        <p className="mb-3 text-neutral-600">{c("Ended: ")}{formatDate(item.assignment.endedAt)}
                        </p>
                      )}
                      {item.assignment.reason && (
                        <p className="mb-3 rounded-lg bg-white p-2 text-xs text-neutral-700">
                          <span className="font-bold">{c("Reason:")}</span>{" "}
                          {item.assignment.reason}
                        </p>
                      )}
                      {item.case && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSelectedCaseId(item.case!._id);
                            setTab("cases");
                          }}
                        >{c("Open case")}</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : tab === "reviews" ? (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl">{c("Case review and reassignment requests")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Review beneficiary concerns without exposing details directly to the assigned provider.")}</p>
              </div>
              {!compactWorkspace && (<select
                value={reviewStatus}
                onChange={(event) =>
                  setReviewQueueStatus(event.target.value as typeof reviewStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="submitted">{c("Submitted")}</option>
                <option value="under_review">{c("Under review")}</option>
                <option value="resolved">{c("Resolved")}</option>
                <option value="declined">{c("Declined")}</option>
              </select>)}
            </div>
            <div className="divide-y">
              {reviewQueue === undefined && (
                <BrandLoading compact text={c("Loading review requests...")}/>
              )}
              {reviewQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">{c("No review requests in this queue")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Beneficiary concerns and reassignment requests will appear here.")}</p>
                </div>
              )}
              {reviewQueue?.filter(item => matchesWork([item.case?.publicId, item.review.note, item.requester?.name]) && (!searchParams.get("review") || item.review._id === searchParams.get("review"))).map((item) => (
                <div
                  key={item.review._id}
                  className="work-decision-row"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.case?.publicId ?? "Case unavailable"}
                      </h3>
                      <StatusPill
                        value={statusLabel(item.review.status)}
                        urgent={item.review.reason === "safety_concern"}
                      />
                      <StatusPill
                        value={statusLabel(item.review.reason)}
                        urgent={item.review.reason === "safety_concern"}
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">{c("Requested by ")}{item.requester?.name ?? "Beneficiary"} on{" "}
                      {formatDate(item.review.createdAt)}
                    </p>
                    {item.review.note && (
                      <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f8f2f4] p-3 text-sm text-neutral-700">
                        {item.review.note}
                      </p>
                    )}
                    {item.review.resolutionNote && (
                      <p className="mt-3 whitespace-pre-wrap rounded-xl border p-3 text-sm text-neutral-700">{c("Resolution: ")}{item.review.resolutionNote}
                      </p>
                    )}
                    {["submitted", "under_review"].includes(item.review.status) && (
                      <div className="mt-3">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">{c("Decision and next step")}</label>
                        <Textarea
                          value={reviewNotesById[item.review._id] ?? ""}
                          onChange={(event) => {
                            setReviewDecision(null);
                            setReviewNotesById((current) => ({ ...current, [item.review._id]: event.target.value }));
                          }}
                          placeholder={c("What did you review? What should happen next?")}
                          className="min-h-[92px]"
                        />
                        <p className="mb-0 mt-2 text-xs text-neutral-500">{c("Keep this beneficiary-safe. Do not include internal disciplinary details or sensitive provider-side notes.")}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.case && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCaseId(item.case!._id);
                          setTab("cases");
                        }}
                      >{c("Open case")}</Button>
                    )}
                    {item.case && ["submitted", "under_review"].includes(item.review.status) && (
                      <details className="rounded-xl border bg-[#fbf7f8] p-3"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-primary">{c("Review another helper")}</summary>
                        <p className="text-sm text-neutral-600">{c("Check the matching reasons before offering the case to another helper.")}</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mb-2 w-full"
                          onClick={() => setSelectedCaseId(item.case!._id)}
                        >{c("Load matching evidence")}</Button>
                        {selectedCaseId === item.case._id && recommendations && (
                          <div className="mb-2 space-y-2">
                            {recommendations.slice(0, 3).map((provider) => (
                              <button
                                type="button"
                                key={provider.id}
                                onClick={() => setReassignmentProviderId(provider.id)}
                                className={`w-full rounded-lg border bg-white p-2 text-left text-xs hover:bg-[#fff8fa] ${reassignmentProviderId === provider.id ? "border-primary bg-primary/5" : "border-neutral-200"}`}
                              >
                                <div className="mb-1 flex items-center justify-between gap-2">
                                  <span className="font-bold text-neutral-800">
                                    {provider.name}
                                  </span>
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">{c("Score ")}{provider.score}
                                  </span>
                                </div>
                                <p className="mb-1 capitalize text-neutral-500">
                                  {statusLabel(provider.role)}
                                  {provider.district ? ` · ${provider.district}` : ""}
                                  {provider.region ? `, ${provider.region}` : ""}
                                  {` · ${provider.activeLoad} active case${provider.activeLoad === 1 ? "" : "s"}`}
                                </p>
                                <p className="mb-0 text-neutral-600">
                                  {provider.reasons.slice(0, 3).join(" · ")}{provider.distanceKm !== null ? ` · ${provider.distanceKm.toFixed(1)} km (${provider.distanceSource === "current_location" ? "current location" : "office"})` : ""}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                        <select
                          value={reassignmentProviderId}
                          onChange={(event) =>
                            setReassignmentProviderId(event.target.value)
                          }
                          className="mb-2 h-10 w-full rounded-lg border bg-white px-3 text-sm"
                        >
                          <option value="">{c("Select provider")}</option>
                          {providers?.map((provider) => (
                            <option key={provider.id} value={provider.id}>
                              {provider.name} ·{" "}
                              {statusLabel(provider.role)} ·{" "}
                              {statusLabel((provider.availabilityStatus ?? "unknown"))}
                            </option>
                          ))}
                        </select>
                        {requiresAvailabilityOverride(selectedReassignmentProvider) && (
                          <Textarea
                            value={reassignmentOverrideReason}
                            onChange={(event) => setReassignmentOverrideReason(event.target.value)}
                            placeholder={c("Required: confirm provider availability and explain this capacity exception.")}
                            className="mb-2 min-h-[78px] bg-white text-sm"
                          />
                        )}
                        <Button
                          disabled={pending || !reassignmentProviderId}
                          onClick={() =>
                            reassignFromReview(
                              item.review._id,
                              item.case!._id,
                              item.review.reason.replaceAll("_", " "),
                            )
                          }
                          className="w-full"
                        >{c("Reassign and offer")}</Button>
                      </details>
                    )}
                    {item.review.status === "submitted" && (
                      <Button
                        disabled={pending}
                        onClick={() =>
                          decideReviewRequest(item.review._id, "under_review")
                        }
                      >{c("Mark under review")}</Button>
                    )}
                    {["submitted", "under_review"].includes(item.review.status) && (
                      <>
                        <Button
                          disabled={pending}
                          onClick={() =>
                            decideReviewRequest(item.review._id, "resolved")
                          }
                        >{c("Mark resolved")}</Button>
                        <Button
                          disabled={pending}
                          variant="outline"
                          onClick={() =>
                            decideReviewRequest(item.review._id, "declined")
                          }
                        >{c("Decline request")}</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "documents" ? (
          <>
          <section className="mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl">{c("Document review")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Review private case documents uploaded by beneficiaries and case workers.")}</p>
              </div>
              {!compactWorkspace && (<select
                value={documentStatus}
                onChange={(event) =>
                  setDocumentStatus(event.target.value as typeof documentStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">{c("Pending review")}</option>
                <option value="accepted">{c("Accepted")}</option>
                <option value="rejected">{c("Rejected")}</option>
              </select>)}
            </div>
            <div className="divide-y">
              {documentQueue === undefined && (
                <BrandLoading compact text={c("Loading documents...")}/>
              )}
              {documentQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <FileText className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">{c("No documents in this queue")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Uploaded files will appear here after case access is created.")}</p>
                </div>
              )}
              {documentQueue?.filter(item => matchesWork([item.document.name, item.case?.publicId, item.uploader?.name])).map((item) => (
                <div
                  key={item.document._id}
                  className="work-decision-row"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">{item.document.name}</h3>
                      <StatusPill
                        value={statusLabel(item.document.status)}
                        urgent={item.document.status === "pending_review"}
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {item.case?.publicId ?? "Case unavailable"} ·{" "}
                      {statusLabel(item.document.category)} ·{" "}
                      {(item.document.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="mb-0 text-sm text-neutral-500">{c("Uploaded by ")}{item.uploader?.name ?? "Unknown"} on{" "}
                      {formatDate(item.document.createdAt)}
                    </p>
                    {item.document.note && (
                      <p className="mt-3 rounded-xl bg-[#f8f2f4] p-3 text-sm text-neutral-700">
                        {item.document.note}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-bold text-primary hover:bg-primary/5"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />{c("Open document")}</a>
                    )}
                    {item.document.status === "pending_review" && (
                      <>
                        <Button
                          disabled={pending}
                          onClick={() =>
                            decideDocument(item.document._id, "accepted")
                          }
                        >{c("Accept document")}</Button>
                        <Button
                          disabled={pending}
                          variant="outline"
                          onClick={() =>
                            decideDocument(item.document._id, "rejected")
                          }
                        >{c("Reject document")}</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl">{c("Referral consent evidence")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Review signed consent files attached to service referrals before they become accepted audit evidence.")}</p>
              </div>
              {!compactWorkspace && (<select
                value={consentEvidenceStatus}
                onChange={(event) =>
                  setConsentEvidenceStatus(event.target.value as typeof consentEvidenceStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">{c("Pending review")}</option>
                <option value="accepted">{c("Accepted")}</option>
                <option value="rejected">{c("Rejected")}</option>
              </select>)}
            </div>
            <div className="divide-y">
              {consentEvidenceQueue === undefined && (
                <BrandLoading compact text={c("Loading consent evidence...")}/>
              )}
              {consentEvidenceQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">{c("No consent evidence in this queue")}</p>
                  <p className="mb-0 text-sm text-neutral-500">{c("Signed referral consent files appear here after staff create referrals.")}</p>
                </div>
              )}
              {consentEvidenceQueue?.filter(item => matchesWork([item.referral.publicId, item.case?.publicId])).map((item) => (
                <div
                  key={item.consent._id}
                  className="work-decision-row"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.consent.evidenceFileName ?? "Signed consent evidence"}
                      </h3>
                      <StatusPill
                        value={statusLabel((item.consent.reviewStatus ?? "pending_review"))}
                        urgent={(item.consent.reviewStatus ?? "pending_review") === "pending_review"}
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {item.referral?.publicId ?? "Referral pending link"} ·{" "}
                      {item.case?.publicId ?? "Case unavailable"} ·{" "}
                      {item.destinationService?.name ?? "Destination unavailable"}
                    </p>
                    <p className="mb-2 text-sm text-neutral-500">{c("Recorded by ")}{item.recordedBy?.name ?? "Unknown"}{c(" for")}{" "}
                      {item.beneficiary?.name ?? "Unknown beneficiary"} on{" "}
                      {formatDate(item.consent.recordedAt)}
                    </p>
                    <p className="mb-0 text-sm text-neutral-700">
                      {item.consent.statement}
                    </p>
                    {item.consent.evidenceNote && (
                      <p className="mt-3 rounded-xl bg-[#f8f2f4] p-3 text-sm text-neutral-700">
                        {item.consent.evidenceNote}
                      </p>
                    )}
                    {item.consent.reviewNotes && (
                      <p className="mt-3 rounded-xl border bg-white p-3 text-sm text-neutral-700">
                        <span className="font-bold">{c("Review note:")}</span>{" "}
                        {item.consent.reviewNotes}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-neutral-500">{c("Retention: ")}{statusLabel((item.consent.retentionStatus ?? "active"))}
                      {item.consent.retentionUntil ? ` until ${formatDate(item.consent.retentionUntil)}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-bold text-primary hover:bg-primary/5"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />{c("Open consent file")}</a>
                    )}
                    {(item.consent.reviewStatus ?? "pending_review") === "pending_review" && (
                      <>
                        <Button
                          disabled={pending}
                          onClick={() =>
                            decideConsentEvidence(item.consent._id, "accepted")
                          }
                        >{c("Accept consent evidence")}</Button>
                        <Button
                          disabled={pending}
                          variant="outline"
                          onClick={() =>
                            decideConsentEvidence(item.consent._id, "rejected")
                          }
                        >{c("Reject consent evidence")}</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          </>
        ) : tab === "requests" ? (
          <section className={`work-record-browser ${selectedCaseId ? "has-record" : ""}`}>
            <div
              className={`${detail ? "hidden lg:block" : "block"} border-r border-neutral-200`}
            >
              {!compactWorkspace && <div className="border-b p-4">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500"
                  htmlFor="request-status"
                >{c("Queue")}</label>
                <select
                  id="request-status"
                  value={requestStatus}
                  onChange={(event) =>
                    setRequestStatus(event.target.value as typeof requestStatus)
                  }
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="all">{c("Open requests")}</option>
                  <option value="submitted">{c("New")}</option>
                  <option value="under_review">{c("Under review")}</option>
                  <option value="waiting_for_information">{c("Waiting for information")}</option>
                </select>
              </div>}
              <div className="max-h-[680px] overflow-y-auto">
                {requests === undefined && (
                  <BrandLoading compact text={c("Loading secure queue...")}/>
                )}
                {requests?.length === 0 && (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-teal-600" />
                    <p className="mb-1 font-bold">{c("Queue clear")}</p>
                    <p className="mb-0 text-sm text-neutral-500">{c("No requests match this filter.")}</p>
                  </div>
                )}
                {requests?.filter(request => matchesWork([request.publicId, request.description, request.district]) && (!searchParams.get("request") || request._id === searchParams.get("request"))).map((request) => (
                  <button
                    key={request._id}
                    onClick={() => selectRequest(request)}
                    className="w-full border-b px-4 py-4 text-left hover:bg-[#fbf7f8] focus-visible:bg-[#fbf7f8]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold">
                        {request.publicId}
                      </span>
                      <StatusPill
                        value={
                          requestLabels[
                            request.status as keyof typeof requestLabels
                          ] ?? request.status
                        }
                        urgent={request.urgency === "immediate_safety"}
                      />
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm leading-5 text-neutral-600">
                      {request.description || "No description provided"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {request.district}, {request.region}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`${detail ? "block" : "hidden"} min-w-0 flex-col`}
            >
              {!detail ? (
                <div className="m-auto max-w-sm p-8 text-center">
                  <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary/40" />
                  <h2 className="mb-2 text-xl">{c("Select a request")}</h2>
                  <p className="mb-0 text-sm text-neutral-500">{c("Opening a request is recorded in the audit trail. Only use information necessary to coordinate assistance.")}</p>
                </div>
              ) : (
                <div className="p-4 sm:p-7">
                  <button
                    onClick={() => setDetail(null)}
                    className="mb-5 flex items-center gap-2 text-sm font-bold text-primary lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />{c("Back to queue")}</button>
                  <div className="mb-6 flex flex-col justify-between gap-3 border-b pb-5 sm:flex-row sm:items-start">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl">{detail.request.publicId}</h2>
                        <StatusPill
                          value={
                            requestLabels[
                              detail.request
                                .status as keyof typeof requestLabels
                            ] ?? detail.request.status
                          }
                          urgent={detail.request.urgency === "immediate_safety"}
                        />
                      </div>
                      <p className="mb-0 text-sm text-neutral-500">{c("Submitted ")}{formatDate(detail.request.submittedAt)}
                      </p>
                    </div>
                    <select
                      value={detail.request.status}
                      disabled={pending}
                      onChange={(event) =>
                        changeReviewStatus(
                          event.target.value as
                            | "under_review"
                            | "waiting_for_information",
                        )
                      }
                      className="h-10 rounded-xl border bg-white px-3 text-sm"
                    >
                      <option value="under_review">{c("Under review")}</option>
                      <option value="waiting_for_information">{c("Waiting for information")}</option>
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Info
                      label={c("Beneficiary")}
                      value={detail.beneficiary?.name ?? "Account unavailable"}
                    />
                    <Info
                      label={c("Safe contact")}
                      value={statusLabel((
                        detail.request.safeContactMethod ?? "Not provided"
                      ))}
                    />
                    <Info
                      label={c("Support language")}
                      value={languageLabel(detail.request.preferredLanguage, detail.request.preferredLanguageOther)}
                    />
                    <Info
                      label={c("Location")}
                      value={`${detail.request.district ?? "-"}, ${detail.request.region ?? "-"}`}
                    />
                    <Info
                      label={c("Urgency")}
                      value={statusLabel((detail.request.urgency ?? "standard"))}
                    />
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#f8f2f4] p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{c("What happened")}</p>
                    <p className="mb-0 whitespace-pre-wrap text-base leading-7">
                      {detail.request.description}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Info
                      label={c("Issue selected")}
                      value={statusLabel(detail.request.issueCategory) ?? "Not selected"}
                    />
                    <Info
                      label={c("Find Help service")}
                      value={detail.sourceService ? `${detail.sourceService.name} · ${detail.sourceService.district}, ${detail.sourceService.region}${!detail.sourceService.active || detail.sourceService.verificationStatus !== "verified" ? " (verify before referral)" : ""}` : "None selected"}
                    />
                    <Info
                      label={c("Help requested")}
                      value={detail.request.desiredHelp ?? "Not provided"}
                    />
                    <Info
                      label={c("When it happened")}
                      value={detail.request.occurredAt ? formatDate(detail.request.occurredAt) : c("Not provided")}
                    />
                    <Info
                      label={c("People or organisations involved")}
                      value={detail.request.involvedParties ?? "Not provided"}
                    />
                    <Info
                      label={c("Documents available")}
                      value={detail.request.hasDocuments ? c("Yes") : c("No")}
                    />
                  </div>
                  <div className="mt-6"><RequestConversation key={detail.request._id} requestId={detail.request._id} /></div>
                  {detail.answers.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg">{c("Additional intake answers")}</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {detail.answers.map((answer) => (
                          <Info
                            key={answer._id}
                            label={statusLabel(answer.questionKey)}
                            value={answer.value}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-7 border-t pt-6">
                    <div className="mb-4">
                      <h3 className="mb-1 text-lg">{c("Create accountable case")}</h3>
                      <p className="mb-0 text-sm text-neutral-500">{c("Use a factual minimum-necessary summary. Do not copy unrelated sensitive details.")}</p>
                    </div>
                    <Textarea
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      maxLength={3000}
                      className="min-h-28"
                      aria-label={c("Case summary")}
                    />
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <select
                        value={priority}
                        onChange={(event) =>
                          setPriority(event.target.value as typeof priority)
                        }
                        className="h-11 rounded-xl border bg-white px-3 text-sm sm:w-52"
                      >
                        <option value="standard">{c("Standard priority")}</option>
                        <option value="urgent">{c("Urgent")}</option>
                        <option value="safeguarding">{c("Safeguarding")}</option>
                      </select>
                      <Button
                        disabled={pending}
                        onClick={convertToCase}
                        className="sm:ml-auto"
                      >
                        {pending ? "Working..." : c("Create case")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className={`work-record-browser ${selectedCaseId ? "has-record" : ""}`}>
            <div
              className={`${selectedCaseId ? "hidden lg:block" : "block"} border-r border-neutral-200`}
            >
              <div className="border-b p-5">
                <h2 className="text-xl">{c("Cases in your scope")}</h2>
                <p className="mb-0 text-sm text-neutral-500">{c("Ordered by latest activity")}</p>
              </div>
              {cases?.filter(record => matchesWork([record.publicId, record.summary, record.status])).map((record) => (
                <button
                  key={record._id}
                  onClick={() => setSelectedCaseId(record._id)}
                  className="w-full border-b p-4 text-left hover:bg-[#fbf7f8]"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-bold">
                      {record.publicId}
                    </span>
                    <StatusPill
                      value={caseLabels[record.status]}
                      urgent={record.priority !== "standard"}
                    />
                  </div>
                  <p className="mb-2 line-clamp-2 text-sm text-neutral-600">
                    {record.summary}
                  </p>
                  <p className="mb-0 text-xs text-neutral-400">{c("Updated ")}{formatDate(record.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
            <div
              className={`${selectedCaseId ? "block" : "hidden"} min-w-0 flex-col`}
            >
              {!selectedCaseId || !caseDetail ? (
                <div className="m-auto p-8 text-center">
                  <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-primary/40" />
                  <h2 className="mb-2 text-xl">{c("Select a case")}</h2>
                  <p className="mb-0 text-sm text-neutral-500">{c("Review its accountable timeline and coordinate the next action.")}</p>
                </div>
              ) : (
                <div className="p-4 sm:p-7">
                  <button
                    onClick={() => setSelectedCaseId(null)}
                    className="mb-5 flex items-center gap-2 text-sm font-bold text-primary lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />{c("Back to cases")}</button>
                  <div className="mb-5"><CasePresence caseId={selectedCaseId} /></div>
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b pb-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h2 className="text-2xl">{caseDetail.case.publicId}</h2>
                        <StatusPill
                          value={caseLabels[caseDetail.case.status]}
                          urgent={caseDetail.case.priority !== "standard"}
                        />
                      </div>
                      <p className="mb-0 text-sm text-neutral-500">{c("Opened ")}{formatDate(caseDetail.case.createdAt)}
                      </p>
                    </div>
                    {caseArea === "finish" && caseDetail.closureReadiness?.canClose && ["resolved", "closed_unresolved"].includes(caseDetail.case.status) && <Button disabled={pending} onClick={() => changeCaseStatus("closed")}>{c("Close case")}</Button>}
                    {caseArea === "assign" && nextStatuses[caseDetail.case.status]?.length > 0 && (
                      <select
                        defaultValue=""
                        disabled={pending}
                        onChange={(event) => {
                          if (event.target.value)
                            changeCaseStatus(event.target.value);
                          event.currentTarget.value = "";
                        }}
                        className="h-10 rounded-xl border bg-white px-3 text-sm"
                      >
                        <option value="" disabled>{c("Update status...")}</option>
                        {nextStatuses[caseDetail.case.status].map((status) => (
                          <option
                            key={status}
                            value={status}
                            disabled={status === "closed" && !caseDetail.closureReadiness?.canClose}
                          >
                            {caseLabels[status]}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <nav aria-label={c("Case tasks")} className="work-tabs">{[["next", "Next step"], ["assign", "Choose a helper"], ["meetings", "Meetings"], ["referral", "Other service"], ["finish", "Finish case"], ["history", "History"]].map(([value,label]) => <button key={value} aria-current={caseArea === value ? "page" : undefined} onClick={() => { setCaseArea(value); setStatusReview(null); }} className={`min-h-11 rounded-xl px-3 py-2 text-sm font-semibold ${caseArea === value ? "bg-primary text-white" : "border bg-white"}`}>{label}</button>)}</nav>
                  {statusReview && <section className="mb-5 rounded-xl bg-teal-50 p-4"><h3>{c("Confirm: ")}{caseLabels[statusReview]}</h3><p>{statusReview === "closed" ? "This ends case work. No new work can be added." : "The person will see this update."}</p><div className="flex gap-2"><Button disabled={pending} onClick={() => changeCaseStatus(statusReview)}>{c("Confirm and save")}</Button><Button variant="outline" disabled={pending} onClick={() => setStatusReview(null)}>{c("Cancel")}</Button></div></section>}
                  {caseArea === "next" && <section className="mb-5 rounded-2xl bg-teal-50 p-5"><h3>{workCaseJourney(caseDetail.case.status, Boolean(caseDetail.outcome), caseDetail.closureReadiness?.canClose, locale === "sw").title}</h3><p>{workCaseJourney(caseDetail.case.status, Boolean(caseDetail.outcome), caseDetail.closureReadiness?.canClose, locale === "sw").description}</p><Link className="font-bold text-primary" to={`/dashboard/${isSupervisor ? "supervisor" : "staff"}/cases/${caseDetail.case._id}?section=${caseDetail.outcome ? "outcome" : "messages"}`}>{caseDetail.outcome ? "Open the result" : "Open case messages"} →</Link></section>}
                  {compactWorkspace && <Link to={`/dashboard/${isSupervisor ? "supervisor" : "staff"}/cases/${caseDetail.case._id}`} className="inline-block min-h-12 rounded-xl bg-[#e7f4f1] px-4 py-3 font-semibold text-primary">{c("Open case tools: messages, documents, tasks and appointments →")}</Link>}
                  <div className="rounded-2xl bg-[#f8f2f4] p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{c("Case summary")}</p>
                    <p className="mb-0 whitespace-pre-wrap leading-7">
                      {caseDetail.case.summary}
                    </p>
                  </div>
                  {caseArea === "finish" && caseDetail.closureReadiness && (
                    <div className={`mt-5 rounded-xl border p-4 ${caseDetail.closureReadiness.canClose ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"}`}>
                      <h3 className="mb-3 flex items-center gap-2 text-base">
                        <ShieldCheck className="h-5 w-5 text-primary" />{c("Before you close the case")}</h3>
                      <div className="grid gap-2 sm:grid-cols-2">{finalChecks.map(check => <Link key={check.key} to={check.key === "reviewRequestsResolved" ? "/dashboard/staff?tab=reviews" : `/dashboard/${isSupervisor ? "supervisor" : "staff"}/cases/${caseDetail.case._id}?section=${check.area}`} className="flex min-h-12 items-center gap-2 rounded-xl border bg-white p-3 text-sm"><span>{caseDetail.closureReadiness!.requirements[check.key] ? "✓" : "○"}</span>{caseDetail.closureReadiness!.requirements[check.key] ? (locale === "sw" ? check.doneSw : check.doneLabel) : (locale === "sw" ? check.sw : check.label)}<span className="ml-auto text-primary">→</span></Link>)}</div>
                      <p className="mt-3 text-sm">{c("Saving the result asks for feedback. The person does not need to reply before closure.")}</p>
                      {!caseDetail.closureReadiness.canClose && (
                        <p className="mb-0 mt-3 text-sm font-semibold text-orange-800">{c("Final close is blocked until every closure requirement is complete.")}</p>
                      )}
                    </div>
                  )}
                  {caseArea === "history" && caseDetail.assignmentHistory.length > 0 && (
                    <div className="mt-5 rounded-xl border bg-white p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-base">
                        <UserRoundCheck className="h-5 w-5 text-primary" />{c("Assignment history")}</h3>
                      <div className="grid gap-3">
                        {caseDetail.assignmentHistory.map((item) => (
                          <div key={item.assignment._id} className="rounded-xl border bg-[#fbf7f8] p-3">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="font-bold">{item.assigneeName}</span>
                              <StatusPill value={item.assignment.status} urgent={item.history.isOverdue || item.assignment.status === "expired"} />
                              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold capitalize text-neutral-600">
                                {statusLabel(item.history.availabilityStatus)}
                              </span>
                            </div>
                            <p className="mb-1 text-sm text-neutral-600">{c("Offered by ")}{item.offeredByName} on {formatDate(item.assignment.offeredAt)}
                            </p>
                            <p className="mb-1 text-xs text-neutral-500">{c("Expires ")}{formatDate(item.history.expiresAt)} · {item.history.responseHours !== null ? `responded after ${item.history.responseHours}h` : `${item.history.offerAgeHours}h open`}
                            </p>
                            {item.assignment.reason && (
                              <p className="mb-1 text-xs text-neutral-600">{c("Reason: ")}{item.assignment.reason}
                              </p>
                            )}
                            {item.history.availabilityOverrideReason && (
                              <p className="mb-0 rounded-lg border border-orange-200 bg-orange-50 p-2 text-xs text-orange-900">{c("Override: ")}{item.history.availabilityOverrideReason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {caseArea === "meetings" && appointmentRequests.length > 0 && (
                    <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <h3 className="mb-2 flex items-center gap-2 text-base">
                        <Clock3 className="h-5 w-5 text-primary" />{c("Appointment requests awaiting confirmation")}</h3>
                      <p className="mb-3 text-sm text-neutral-600">{c("Choose a final date/time and confirm directly from the beneficiary request.")}</p>
                      <div className="mb-3 grid gap-3 md:grid-cols-3">
                        <input
                          type="datetime-local"
                          value={appointmentDate}
                          onChange={(event) => setAppointmentDate(event.target.value)}
                          className="h-11 rounded-xl border bg-white px-3 text-sm"
                        />
                        <select
                          value={appointmentMode}
                          onChange={(event) => setAppointmentMode(event.target.value as typeof appointmentMode)}
                          className="h-11 rounded-xl border bg-white px-3 text-sm"
                        >
                          <option value="phone">{c("Phone")}</option>
                          <option value="remote">{c("Remote")}</option>
                          <option value="in_person">{c("In person")}</option>
                        </select>
                        <input
                          value={appointmentLocation}
                          onChange={(event) => setAppointmentLocation(event.target.value)}
                          maxLength={300}
                          placeholder={c("Location or call note")}
                          className="h-11 rounded-xl border bg-white px-3 text-sm"
                        />
                      </div>
                      <div className="grid gap-3 lg:grid-cols-2">
                        {appointmentRequests.map((event) => (
                          <div key={event._id} className="rounded-xl border bg-white p-3">
                            <p className="mb-1 text-sm font-bold">{eventDetail(event, locale) ?? c("Appointment requested")}</p>
                            <p className="mb-3 text-xs text-neutral-500">{c("Requested ")}{formatDate(event.occurredAt)}</p>
                            <Button disabled={pending} size="sm" onClick={() => scheduleRequestedAppointment(event._id)}>{c("Confirm selected slot")}</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {caseArea === "meetings" && caseDetail.appointments.length > 0 && (
                    <div className="mt-5 rounded-xl border bg-white p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-base">
                        <Clock3 className="h-5 w-5 text-primary" />{c("Meeting results")}</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {caseDetail.appointments.map((appointment) => (
                          <div key={appointment._id} className="rounded-xl border bg-[#fbf7f8] p-3">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <p className="mb-0 font-bold">{formatDate(appointment.startsAt)}</p>
                              <StatusPill value={appointment.status} urgent={appointment.status === "missed" || appointment.status === "cancelled"} />
                            </div>
                            <p className="mb-0 text-sm capitalize text-neutral-600">
                              {statusLabel(appointment.mode)}
                              {appointment.location ? ` · ${appointment.location}` : ""}
                            </p>
                            {appointment.statusNote && (
                              <p className="mb-0 mt-2 rounded-lg bg-white p-2 text-sm text-neutral-600">
                                {appointment.statusNote}
                              </p>
                            )}
                            {appointment.statusUpdatedAt && (
                              <p className="mb-0 mt-2 text-xs text-neutral-500">{c("Updated ")}{formatDate(appointment.statusUpdatedAt)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-6">
                    {caseArea === "history" && <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg">
                        <Clock3 className="h-5 w-5 text-primary" />{c("Case history")}</h3>
                      <div className="space-y-3">
                        {caseDetail.events.map((event) => (
                          <div
                            key={event._id}
                            className="relative rounded-xl border p-4 pl-11"
                          >
                            <div className="absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <p className="mb-1 text-sm font-bold">
                              {eventTitle(event, locale)}
                            </p>
                            {eventDetail(event, locale) && (
                              <p className="mb-1 text-sm text-neutral-600">
                                {eventDetail(event, locale)}
                              </p>
                            )}
                            <p className="mb-0 text-xs text-neutral-500">
                              {formatDate(event.occurredAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>}
                    <div>
                      {caseArea === "assign" && <><h3 className="mb-3 flex items-center gap-2 text-lg">
                        <UserRoundCheck className="h-5 w-5 text-primary" />{c("Offer assignment")}</h3>
                      <div className="rounded-xl border p-4">
                        <p className="mb-4 text-sm text-neutral-600">{c("Recommended providers are ranked by location, issue fit, verification, language fit, declared availability, and current accepted caseload. The provider must accept before receiving case access.")}</p>
                        <MatchingLocation key={selectedCaseId} onChange={setMatchingOrigin} />
                        {recommendations && recommendations.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {recommendations.slice(0, 3).map((provider) => (
                              <button
                                key={provider.id}
                                onClick={() => setProviderId(provider.id)}
                                className={`w-full rounded-xl border p-3 text-left hover:bg-[#fbf7f8] ${providerId === provider.id ? "border-primary bg-primary/5" : "border-neutral-200"}`}
                              >
                                <div className="mb-1 flex items-center justify-between gap-2">
                                  <span className="font-bold">
                                    {provider.name}
                                  </span>
                                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                                    {provider.score}
                                  </span>
                                </div>
                                <p className="mb-1 text-xs capitalize text-neutral-500">
                                  {statusLabel(provider.role)}
                                  {provider.district
                                    ? ` · ${provider.district}`
                                    : ""}
                                  {provider.region
                                    ? `, ${provider.region}`
                                    : ""}
                                </p>
                                <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                                  <span className="rounded-full bg-[#f8f2f4] px-2 py-1 text-primary">
                                    {statusLabel((provider.availabilityStatus ?? "unknown"))}
                                  </span>
                                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800">
                                    {provider.weeklyCapacity === null ? c("Capacity not declared") : `${provider.remainingCapacity}/${provider.weeklyCapacity}` + c(" slots")}</span>
                                  {provider.workingHours && (
                                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700">
                                      {provider.workingHours}
                                    </span>
                                  )}
                                </div>
                                <p className="mb-0 text-xs text-neutral-600">
                                  {provider.reasons.slice(0, 3).join(" · ")}{provider.distanceKm !== null ? ` · ${provider.distanceKm.toFixed(1)} km (${provider.distanceSource === "current_location" ? "current location" : "office"})` : ""}
                                </p>
                                {provider.availabilityNotes && (
                                  <p className="mb-0 mt-1 text-xs text-neutral-500">{c("Note: ")}{provider.availabilityNotes}
                                  </p>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                        <select
                          value={providerId}
                          onChange={(event) =>
                            setProviderId(event.target.value)
                          }
                          className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                        >
                          <option value="">{c("Select service provider")}</option>
                          {providers?.map((provider) => (
                            <option key={provider.id} value={provider.id}>
                              {provider.name} ·{" "}
                              {statusLabel(provider.role)} ·{" "}
                              {statusLabel((provider.availabilityStatus ?? "unknown"))}
                            </option>
                          ))}
                        </select>
                        {requiresAvailabilityOverride(selectedAssignmentProvider) && (
                          <Textarea
                            value={assignmentOverrideReason}
                            onChange={(event) => setAssignmentOverrideReason(event.target.value)}
                            placeholder={c("Required: confirm provider availability and explain this capacity exception.")}
                            className="mt-3 min-h-[82px] text-sm"
                          />
                        )}
                        <Button
                          disabled={
                            !providerId ||
                            pending ||
                            ![
                              "under_review",
                              "waiting_for_information",
                            ].includes(caseDetail.case.status)
                          }
                          onClick={assignProvider}
                          className="mt-3 w-full"
                        >{c("Send assignment offer")}</Button>
                      </div>
                      </>}
                      {caseArea === "referral" && <><CaseReferralRequests key={caseDetail.case._id} caseId={caseDetail.case._id} status={caseDetail.case.status} operations supportHref={isSupervisor ? "/dashboard/supervisor?view=support" : "/dashboard/staff?view=support"} />
                      {!['resolved','closed_unresolved','closed'].includes(caseDetail.case.status) && <details className="mt-5 rounded-2xl border bg-white p-4"><summary className="cursor-pointer font-semibold text-primary">{c("Add a request with existing permission evidence")}</summary><div className="mt-4 grid gap-3"><p className="text-sm">{c("Use this if you already have a permission statement or signed file. The person still needs to agree before the service is notified.")}</p><label className="grid gap-2 text-sm font-semibold">{c("Which service can help?")}<select value={referralServiceId} onChange={event => { setReferralServiceId(event.target.value); setReferralDestinationUserId(""); }} className="min-h-12 rounded-xl border p-3"><option value="">{c("Choose a service")}</option>{referralCapableServices.map(service => <option key={service._id} value={service._id}>{service.name} · {service.district}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">{c("Who will receive it? (optional)")}<select value={referralDestinationUserId} onChange={event => setReferralDestinationUserId(event.target.value)} disabled={!referralServiceId || receivingProviders === undefined} className="min-h-12 rounded-xl border p-3"><option value="">{c("Choose a receiving person")}</option>{receivingProviders?.map(person => <option key={person._id} value={person._id}>{person.name}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">{c("Why is this help needed?")}<Textarea value={referralReason} maxLength={2000} onChange={event => setReferralReason(event.target.value)} /></label><label className="grid gap-2 text-sm font-semibold">{c("Details needed for this help (separate with commas)")}<Textarea value={referralInformationShared} maxLength={1000} onChange={event => setReferralInformationShared(event.target.value)} /></label><label className="grid gap-2 text-sm font-semibold">{c("How was permission recorded?")}<select value={referralConsentMethod} onChange={event => setReferralConsentMethod(event.target.value as typeof referralConsentMethod)} className="min-h-12 rounded-xl border p-3">{[['documented_verbal','Spoken permission, written down'],['written','Written statement'],['sms','Text message'],['email','Email'],['signed_document','Signed document']].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">{c("Permission statement")}<Textarea value={referralConsentStatement} maxLength={2000} onChange={event => setReferralConsentStatement(event.target.value)} /></label><label className="grid gap-2 text-sm font-semibold">{c("Evidence note (optional)")}<Textarea value={referralConsentEvidenceNote} maxLength={1200} onChange={event => setReferralConsentEvidenceNote(event.target.value)} /></label><label className="grid gap-2 text-sm font-semibold">{c("Permission file (required for signed documents)")}<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={event => setReferralConsentFile(event.target.files?.[0] ?? null)} className="min-h-12 rounded-xl border p-3" /></label><Button disabled={pending || !referralServiceId || referralReason.trim().length < 12 || referralConsentStatement.trim().length < 20} onClick={() => createCaseReferral()}>{c("Review this request")}</Button></div></details>}
                      </>}

                      {caseArea === "next" && <div className="mt-5 rounded-xl border p-4">
                        <h3 className="mb-2 flex items-center gap-2 text-base">
                          <MessageSquareText className="h-5 w-5 text-primary" />{c("Case communication")}</h3>
                        <p className="mb-0 text-sm text-neutral-500">{c("Talk to the person and team in the case messages. Use the case tools to add documents, tasks or meeting results.")}</p>
                      </div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="mb-0 break-words text-sm font-semibold capitalize text-neutral-800">
        {value}
      </p>
    </div>
  );
}

function ClosureItem({
  label,
  ready,
  detail,
}: {
  label: string;
  ready: boolean;
  detail?: string;
}) {
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

export default StaffDashboard;
