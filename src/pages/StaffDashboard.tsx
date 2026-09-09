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
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type TriageDetail = FunctionReturnType<typeof api.legalHelp.openForTriage>;
type WorkspaceTab = "requests" | "cases" | "documents" | "reviews" | "assignments" | "referrals" | "services";
type ReferralQueueStatus =
  | "created"
  | "destination_notified"
  | "accepted"
  | "declined"
  | "scheduled"
  | "service_delivered"
  | "returned"
  | "escalated"
  | "closed";

type ServiceFormState = {
  name: string;
  organizationId: string;
  organizationName: string;
  servicePointType: "paralegal" | "legal_aid_provider" | "government_office" | "local_government" | "labour_service" | "land_service" | "protection_service" | "cso" | "other";
  classification: "public" | "community" | "government" | "private" | "restricted";
  visibility: "public" | "restricted" | "confidential";
  verificationStatus: "draft" | "verified" | "expired" | "inactive";
  region: string;
  district: string;
  issueCategories: string;
  serviceTypes: string;
  phone: string;
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
  region: "Dar es Salaam",
  district: "",
  issueCategories: "employment, land, family",
  serviceTypes: "legal_information, referral",
  phone: "",
  openingHours: "",
  currentIntakeState: "open",
  capacity: "10",
  languages: "Swahili, English",
  referralCapability: true,
  walkIn: true,
  appointmentRequired: false,
  remoteSupport: true,
  phoneSupport: true,
  emergencyCapability: false,
  privacyAvailable: true,
  genderSensitive: true,
};

const initialOrganizationForm: OrganizationFormState = {
  name: "",
  organizationType: "legal_aid_provider",
  verificationStatus: "draft",
  referralAgreementStatus: "none",
  focalPersonName: "",
  focalPersonEmail: "",
  focalPersonPhone: "",
  slaHours: "48",
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

function eventTitle(event: { publicLabelKey?: string; type: string }) {
  if (event.type === "appointment_requested") return "Appointment requested";
  return (
    event.publicLabelKey?.split(".").pop()?.replaceAll("_", " ") ??
    event.type.replaceAll("_", " ")
  );
}

function eventDetail(event: { type: string; metadata?: unknown }) {
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
      ? `Mode: ${metadata.preferredMode.replaceAll("_", " ")}`
      : null,
    metadata.preferredTime ? `Preferred time: ${metadata.preferredTime}` : null,
    metadata.note ? `Note: ${metadata.note}` : null,
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
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgent ? "bg-orange-100 text-orange-800" : "bg-primary/10 text-primary"}`}
    >
      {value}
    </span>
  );
}

const StaffDashboard = () => {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<WorkspaceTab>("requests");
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
  const [referralStatus, setReferralStatus] = useState<ReferralQueueStatus>("created");
  const [detail, setDetail] = useState<TriageDetail | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | null>(
    null,
  );
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState<
    "standard" | "urgent" | "safeguarding"
  >("standard");
  const [providerId, setProviderId] = useState("");
  const [reassignmentProviderId, setReassignmentProviderId] = useState("");
  const [assignmentOverrideReason, setAssignmentOverrideReason] = useState("");
  const [reassignmentOverrideReason, setReassignmentOverrideReason] = useState("");
  const [reviewNotesById, setReviewNotesById] = useState<Record<string, string>>({});
  const [referralServiceId, setReferralServiceId] = useState("");
  const [referralDestinationUserId, setReferralDestinationUserId] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [referralInformationShared, setReferralInformationShared] = useState("case summary, safe contact preference, district, issue category");
  const [referralConsentMethod, setReferralConsentMethod] = useState<"documented_verbal" | "written" | "sms" | "email" | "signed_document">("documented_verbal");
  const [referralConsentStatement, setReferralConsentStatement] = useState("I consent for LSF to share the minimum information listed here with this referral destination so they can provide legal support.");
  const [referralConsentEvidenceNote, setReferralConsentEvidenceNote] = useState("");
  const [referralConsentFile, setReferralConsentFile] = useState<File | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(initialServiceForm);
  const [organizationForm, setOrganizationForm] = useState<OrganizationFormState>(initialOrganizationForm);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const requests = useQuery(
    api.legalHelp.staffQueue,
    requestStatus === "all" ? {} : { status: requestStatus },
  );
  const cases = useQuery(api.caseManagement.staffCaseQueue);
  const providers = useQuery(api.caseManagement.serviceProviders);
  const caseDetail = useQuery(
    api.caseManagement.getCase,
    selectedCaseId ? { caseId: selectedCaseId } : "skip",
  );
  const recommendations = useQuery(
    api.caseManagement.providerRecommendations,
    selectedCaseId ? { caseId: selectedCaseId } : "skip",
  );
  const documentQueue = useQuery(api.caseManagement.staffDocumentQueue, {
    status: documentStatus,
  });
  const consentEvidenceQueue = useQuery(api.referrals.staffConsentEvidenceQueue, {
    status: consentEvidenceStatus,
  });
  const reviewQueue = useQuery(api.caseManagement.staffReviewRequests, {
    status: reviewStatus,
  });
  const assignmentOffers = useQuery(api.caseManagement.staffAssignmentOffers, {
    status: assignmentStatus,
  });
  const referralQueue = useQuery(api.referrals.staffQueue, {
    status: referralStatus,
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
  const expireStaleAssignmentOffersNow = useMutation(
    api.caseManagement.expireStaleAssignmentOffersNow,
  );
  const resolveCaseReviewRequest = useMutation(
    api.caseManagement.resolveCaseReviewRequest,
  );
  const createJusticeOrganization = useMutation(api.justiceServices.createOrganization);
  const createJusticeService = useMutation(api.justiceServices.createService);
  const updateJusticeService = useMutation(api.justiceServices.updateService);
  const seedJusticeServices = useMutation(api.hakiYanguSeed.seedJusticeServices);
  const createReferral = useMutation(api.referrals.createForCase);
  const generateReferralConsentUploadUrl = useMutation(api.referrals.generateConsentUploadUrl);
  const reviewConsentEvidence = useMutation(api.referrals.reviewConsentEvidence);
  const updateReferralStatus = useMutation(api.referrals.updateStatus);

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
        service.visibility !== "confidential" &&
        service.referralCapability,
    ) ?? [];

  function requiresAvailabilityOverride(provider?: { availabilityStatus?: string }) {
    return provider?.availabilityStatus === "paused" || provider?.availabilityStatus === "unavailable";
  }

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
    void run(async () => {
      const result = await setReviewStatus({
        requestId: detail.request._id,
        expectedVersion: detail.request.version,
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
        text: "Add an override reason of at least 10 characters before assigning a paused or unavailable provider.",
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
    if (!selectedCaseId || !caseDetail) return;
    void run(async () => {
      await updateCaseStatus({
        caseId: selectedCaseId,
        status: status as Parameters<typeof updateCaseStatus>[0]["status"],
        expectedVersion: caseDetail.case.version,
      });
      setNotice({ type: "success", text: "Case timeline updated." });
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
  ) {
    void run(async () => {
      const note = reviewNotesById[reviewRequestId]?.trim();
      await resolveCaseReviewRequest({
        reviewRequestId,
        status,
        resolutionNote: note || undefined,
      });
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
        text: "Add an override reason of at least 10 characters before reassigning to a paused or unavailable provider.",
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
    setServiceForm((current) => ({ ...current, ...updates }));
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
      const result = await createJusticeOrganization({
        name: organizationForm.name.trim(),
        organizationType: organizationForm.organizationType,
        verificationStatus: organizationForm.verificationStatus,
        referralAgreementStatus: organizationForm.referralAgreementStatus,
        focalPersonName: organizationForm.focalPersonName.trim() || undefined,
        focalPersonEmail: organizationForm.focalPersonEmail.trim() || undefined,
        focalPersonPhone: organizationForm.focalPersonPhone.trim() || undefined,
        slaHours: Number.isFinite(Number(organizationForm.slaHours)) ? Number(organizationForm.slaHours) : undefined,
        safeguardingReady: organizationForm.safeguardingReady,
        dataSharingAgreementVersion: organizationForm.dataSharingAgreementVersion.trim() || undefined,
        notes: organizationForm.notes.trim() || undefined,
      });
      setOrganizationForm(initialOrganizationForm);
      setServiceForm((current) => ({ ...current, organizationId: result.id, organizationName: "" }));
      setNotice({ type: "success", text: "Justice service organization created and selected for the service form." });
    });
  }

  function createServicePoint() {
    if (!serviceForm.name.trim() || !serviceForm.district.trim()) {
      setNotice({ type: "error", text: "Add at least a service name and district." });
      return;
    }
    if (serviceForm.servicePointType === "protection_service" && !serviceForm.privacyAvailable) {
      setNotice({ type: "error", text: "Protection services must indicate privacy availability before publishing." });
      return;
    }
    void run(async () => {
      await createJusticeService({
        name: serviceForm.name.trim(),
        organizationId: serviceForm.organizationId ? serviceForm.organizationId as Id<"justice_service_organizations"> : undefined,
        organizationName: serviceForm.organizationName.trim() || undefined,
        servicePointType: serviceForm.servicePointType,
        classification: serviceForm.classification,
        visibility: serviceForm.visibility,
        verificationStatus: serviceForm.verificationStatus,
        verifyingAuthority: "LSF",
        source: "Staff-entered service directory record",
        lastVerifiedAt: serviceForm.verificationStatus === "verified" ? Date.now() : undefined,
        nextReviewAt: serviceForm.verificationStatus === "verified" ? Date.now() + 1000 * 60 * 60 * 24 * 180 : undefined,
        active: serviceForm.verificationStatus !== "inactive",
        country: "Tanzania",
        region: serviceForm.region.trim(),
        district: serviceForm.district.trim(),
        serviceCoverageRegions: splitList(serviceForm.region),
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
        capacity: Number.isFinite(Number(serviceForm.capacity)) ? Number(serviceForm.capacity) : undefined,
        emergencyCapability: serviceForm.emergencyCapability,
        languages: splitList(serviceForm.languages),
        privacyAvailable: serviceForm.privacyAvailable,
        genderSensitive: serviceForm.genderSensitive,
      });
      setServiceForm(initialServiceForm);
      setNotice({ type: "success", text: "Justice service point created." });
    });
  }

  function setServiceVerified(id: Id<"justice_services">) {
    void run(async () => {
      await updateJusticeService({
        id,
        updates: {
          verificationStatus: "verified",
          active: true,
          lastVerifiedAt: Date.now(),
          nextReviewAt: Date.now() + 1000 * 60 * 60 * 24 * 180,
        },
      });
      setNotice({ type: "success", text: "Service verified and active." });
    });
  }

  function deactivateService(id: Id<"justice_services">) {
    void run(async () => {
      await updateJusticeService({
        id,
        updates: {
          verificationStatus: "inactive",
          active: false,
          currentIntakeState: "closed",
        },
      });
      setNotice({ type: "success", text: "Service deactivated." });
    });
  }

  function seedServices() {
    void run(async () => {
      const result = await seedJusticeServices({});
      setNotice({ type: "success", text: `Seeded ${result.total} justice services (${result.inserted} new, ${result.updated} updated).` });
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

  function createCaseReferral() {
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
      setReferralServiceId("");
      setReferralDestinationUserId("");
      setReferralReason("");
      setReferralInformationShared("case summary, safe contact preference, district, issue category");
      setReferralConsentMethod("documented_verbal");
      setReferralConsentStatement("I consent for LSF to share the minimum information listed here with this referral destination so they can provide legal support.");
      setReferralConsentEvidenceNote("");
      setReferralConsentFile(null);
      setReferralStatus("created");
      setTab("referrals");
      setNotice({ type: "success", text: `${result.publicId} created and visible in the referral queue.` });
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
  const activeReferralCount =
    referralQueue?.filter((item) => !["closed", "declined"].includes(item.referral.status)).length ?? 0;
  const verifiedServiceCount =
    justiceServices?.filter((service) => service.verificationStatus === "verified" && service.active).length ?? 0;

  return (
    <div className="min-h-screen bg-[#f7f4f2] text-neutral-900">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading text-sm font-black text-white">
              LSF
            </div>
            <div>
              <p className="mb-0 font-heading text-base font-bold leading-tight">
                Haki Yangu Operations
              </p>
              <p className="mb-0 text-xs text-neutral-500">
                Legal assistance workspace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 sm:block"
            >
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
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Human-supported justice
            </p>
            <h1 className="text-3xl sm:text-4xl">Triage and case operations</h1>
            <p className="mb-0 max-w-2xl text-base text-neutral-600">
              Review requests, establish accountable cases, and coordinate
              verified assistance from one controlled workspace.
            </p>
          </div>
          <div className="inline-flex w-fit rounded-xl border bg-white p-1 shadow-sm">
            <button
              onClick={() => setTab("requests")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "requests" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Requests
            </button>
            <button
              onClick={() => setTab("cases")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "cases" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Cases
            </button>
            <button
              onClick={() => setTab("documents")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "documents" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Documents
            </button>
            <button
              onClick={() => setTab("reviews")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "reviews" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Reviews
            </button>
            <button
              onClick={() => setTab("assignments")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "assignments" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Assignments
            </button>
            <button
              onClick={() => setTab("referrals")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "referrals" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Referrals
            </button>
            <button
              onClick={() => setTab("services")}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${tab === "services" ? "bg-primary text-white" : "text-neutral-600"}`}
            >
              Services
            </button>
          </div>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-8">
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSearch className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{newCount}</p>
            <p className="mb-0 text-sm text-neutral-500">New requests</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{urgentCount}</p>
            <p className="mb-0 text-sm text-neutral-500">
              Urgent or safeguarding
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{activeCases}</p>
            <p className="mb-0 text-sm text-neutral-500">
              Active cases in scope
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{pendingDocumentCount}</p>
            <p className="mb-0 text-sm text-neutral-500">Documents to review</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{pendingReviewCount}</p>
            <p className="mb-0 text-sm text-neutral-500">Case review requests</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <Clock3 className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{openAssignmentOfferCount}</p>
            <p className="mb-0 text-sm text-neutral-500">Open assignment offers</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <ChevronRight className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{activeReferralCount}</p>
            <p className="mb-0 text-sm text-neutral-500">Referrals in selected queue</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="mb-1 text-2xl font-bold">{verifiedServiceCount}</p>
            <p className="mb-0 text-sm text-neutral-500">Verified services</p>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}
          >
            {notice.text}
          </div>
        )}

        {tab === "referrals" ? (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl">Referral coordination</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Track cross-service handoffs after consent. This is the start
                  of the referral graph: where the case moved, what was shared,
                  and whether the destination accepted responsibility.
                </p>
              </div>
              <select
                value={referralStatus}
                onChange={(event) => setReferralStatus(event.target.value as ReferralQueueStatus)}
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="created">Created</option>
                <option value="destination_notified">Destination notified</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="scheduled">Scheduled</option>
                <option value="service_delivered">Service delivered</option>
                <option value="returned">Returned</option>
                <option value="escalated">Escalated</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="divide-y">
              {referralQueue === undefined && (
                <p className="p-5 text-sm text-neutral-500">Loading referrals...</p>
              )}
              {referralQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <ChevronRight className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">No referrals in this queue</p>
                  <p className="mb-0 text-sm text-neutral-500">
                    Referrals created from cases will appear here with their
                    destination service and beneficiary-safe status trail.
                  </p>
                </div>
              )}
              {referralQueue?.map((item) => (
                <div key={item.referral._id} className="grid gap-4 p-5 lg:grid-cols-[1fr_270px]">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.referral.publicId}
                      </h3>
                      <StatusPill value={item.referral.status.replaceAll("_", " ")} urgent={["created", "returned", "escalated"].includes(item.referral.status)} />
                      {item.case && (
                        <StatusPill value={item.case.status.replaceAll("_", " ")} urgent={item.case.priority !== "standard"} />
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
                        <p className="mb-1 font-bold text-neutral-800">Destination</p>
                        <p className="mb-0">
                          {item.destinationService
                            ? `${item.destinationService.district}, ${item.destinationService.region}`
                          : "Not available"}
                        </p>
                      </div>
                      {item.parentReferral && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-3">
                          <p className="mb-1 font-bold text-neutral-800">Parent referral</p>
                          <p className="mb-0">{item.parentReferral.publicId}</p>
                        </div>
                      )}
                      {item.onwardReferral && (
                        <div className="rounded-xl border bg-[#fbf7f8] p-3">
                          <p className="mb-1 font-bold text-neutral-800">Onward referral</p>
                          <p className="mb-0">{item.onwardReferral.publicId}</p>
                        </div>
                      )}
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">Information shared</p>
                        <p className="mb-0">
                          {item.referral.informationShared.join(", ") || "Not recorded"}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <p className="mb-1 font-bold text-neutral-800">Consent proof</p>
                        <p className="mb-0 capitalize">
                          {item.consent?.method?.replaceAll("_", " ") ?? "Not recorded"}
                        </p>
                        {item.consent?.evidenceNote && (
                          <p className="mb-0 mt-1 text-neutral-500">{item.consent.evidenceNote}</p>
                        )}
                        {item.consent?.evidenceFileName && (
                          <p className="mb-0 mt-1 text-neutral-500">
                            File: {item.consent.evidenceFileName}
                          </p>
                        )}
                        {item.consent?.reviewStatus && (
                          <p className="mb-0 mt-1 text-neutral-500 capitalize">
                            Review: {item.consent.reviewStatus.replaceAll("_", " ")}
                          </p>
                        )}
                        {item.consent?.retentionStatus && (
                          <p className="mb-0 mt-1 text-neutral-500 capitalize">
                            Retention: {item.consent.retentionStatus}
                          </p>
                        )}
                        {item.consentEvidenceUrl && (
                          <a
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary underline"
                            href={item.consentEvidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open consent file
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    {item.referral.declineReason && (
                      <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                        <span className="font-bold">Decline reason:</span>{" "}
                        {item.referral.declineReason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="mb-0 rounded-xl bg-[#fbf7f8] p-3 text-xs text-neutral-600">
                      Created {formatDate(item.referral.createdAt)}. Update only
                      when there is evidence from the destination service.
                    </p>
                    {item.case && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCaseId(item.case!._id);
                          setTab("cases");
                        }}
                      >
                        Open case
                      </Button>
                    )}
                    {item.referral.status === "created" && (
                      <>
                        <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "destination_notified", "Destination service notified by LSF.")}>
                          Mark notified
                        </Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "accepted", "Destination accepted the referral.")}>
                          Mark accepted
                        </Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "declined", "Destination cannot accept this referral.")}>
                          Mark declined
                        </Button>
                      </>
                    )}
                    {item.referral.status === "destination_notified" && (
                      <>
                        <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "accepted", "Destination accepted the referral.")}>
                          Mark accepted
                        </Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "returned", "Destination returned the referral for LSF follow-up.")}>
                          Mark returned
                        </Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "declined", "Destination cannot accept this referral.")}>
                          Mark declined
                        </Button>
                      </>
                    )}
                    {item.referral.status === "accepted" && (
                      <>
                        <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "scheduled", "Destination scheduled support with the beneficiary.")}>
                          Mark scheduled
                        </Button>
                        <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "service_delivered", "Destination delivered the referred service.")}>
                          Service delivered
                        </Button>
                      </>
                    )}
                    {item.referral.status === "scheduled" && (
                      <Button disabled={pending} onClick={() => moveReferral(item.referral._id, "service_delivered", "Destination delivered the referred service.")}>
                        Service delivered
                      </Button>
                    )}
                    {["accepted", "scheduled", "service_delivered", "returned", "escalated"].includes(item.referral.status) && (
                      <Button disabled={pending} variant="outline" onClick={() => moveReferral(item.referral._id, "closed", "Referral closed by LSF operations.")}>
                        Close referral
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "services" ? (
          <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl">Partner organization</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Create accountable organizations before linking their service points.
                </p>
              </div>
              <div className="space-y-3">
                <input
                  value={organizationForm.name}
                  onChange={(event) => updateOrganizationForm({ name: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Organization name"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={organizationForm.organizationType}
                    onChange={(event) => updateOrganizationForm({ organizationType: event.target.value as OrganizationFormState["organizationType"] })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                  >
                    <option value="legal_aid_provider">Legal aid provider</option>
                    <option value="government">Government</option>
                    <option value="cso">CSO</option>
                    <option value="community_paralegal_network">Paralegal network</option>
                    <option value="private_provider">Private provider</option>
                    <option value="donor_partner">Donor partner</option>
                    <option value="lsf">LSF</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={organizationForm.verificationStatus}
                    onChange={(event) => updateOrganizationForm({ verificationStatus: event.target.value as OrganizationFormState["verificationStatus"] })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="verified">Verified</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={organizationForm.referralAgreementStatus}
                    onChange={(event) => updateOrganizationForm({ referralAgreementStatus: event.target.value as OrganizationFormState["referralAgreementStatus"] })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                  >
                    <option value="none">No referral agreement</option>
                    <option value="draft">Draft agreement</option>
                    <option value="active">Active agreement</option>
                    <option value="expired">Expired agreement</option>
                    <option value="suspended">Suspended agreement</option>
                  </select>
                  <input
                    value={organizationForm.slaHours}
                    onChange={(event) => updateOrganizationForm({ slaHours: event.target.value })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                    placeholder="SLA hours"
                  />
                </div>
                <input
                  value={organizationForm.focalPersonName}
                  onChange={(event) => updateOrganizationForm({ focalPersonName: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Focal person"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={organizationForm.focalPersonEmail}
                    onChange={(event) => updateOrganizationForm({ focalPersonEmail: event.target.value })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                    placeholder="Focal email"
                  />
                  <input
                    value={organizationForm.focalPersonPhone}
                    onChange={(event) => updateOrganizationForm({ focalPersonPhone: event.target.value })}
                    className="h-11 rounded-xl border bg-white px-3 text-sm"
                    placeholder="Focal phone"
                  />
                </div>
                <input
                  value={organizationForm.dataSharingAgreementVersion}
                  onChange={(event) => updateOrganizationForm({ dataSharingAgreementVersion: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Data sharing agreement version"
                />
                <label className="flex items-center gap-2 rounded-xl border bg-[#fbf7f8] p-3 text-sm font-semibold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={organizationForm.safeguardingReady}
                    onChange={(event) => updateOrganizationForm({ safeguardingReady: event.target.checked })}
                  />
                  Safeguarding ready
                </label>
                <Textarea
                  value={organizationForm.notes}
                  onChange={(event) => updateOrganizationForm({ notes: event.target.value })}
                  className="min-h-[72px]"
                  placeholder="Operational notes, coverage limits, escalation contacts..."
                />
                <Button disabled={pending} onClick={createOrganization} className="w-full">
                  Create organization
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl">Justice Service Management</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Add and verify service points for Haki Yangu matching. Public
                  mobile discovery only shows active, verified, public records.
                </p>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Service name
                </label>
                <input
                  value={serviceForm.name}
                  onChange={(event) => updateServiceForm({ name: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Kinondoni Community Paralegal Desk"
                />
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Organisation
                </label>
                <select
                  value={serviceForm.organizationId}
                  onChange={(event) => updateServiceForm({ organizationId: event.target.value, organizationName: "" })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="">No linked organization</option>
                  {justiceOrganizations?.map((organization) => (
                    <option key={organization._id} value={organization._id}>
                      {organization.name} · {organization.verificationStatus}
                    </option>
                  ))}
                </select>
                <input
                  value={serviceForm.organizationName}
                  onChange={(event) => updateServiceForm({ organizationName: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Fallback organization name if not linked"
                  disabled={Boolean(serviceForm.organizationId)}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Type
                    </label>
                    <select
                      value={serviceForm.servicePointType}
                      onChange={(event) => updateServiceForm({ servicePointType: event.target.value as ServiceFormState["servicePointType"] })}
                      className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    >
                      <option value="paralegal">Paralegal</option>
                      <option value="legal_aid_provider">Legal aid provider</option>
                      <option value="government_office">Government office</option>
                      <option value="local_government">Local government</option>
                      <option value="labour_service">Labour service</option>
                      <option value="land_service">Land service</option>
                      <option value="protection_service">Protection service</option>
                      <option value="cso">CSO</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Verification
                    </label>
                    <select
                      value={serviceForm.verificationStatus}
                      onChange={(event) => updateServiceForm({ verificationStatus: event.target.value as ServiceFormState["verificationStatus"] })}
                      className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="verified">Verified</option>
                      <option value="expired">Expired</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={serviceForm.region}
                    onChange={(event) => updateServiceForm({ region: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder="Region"
                  />
                  <input
                    value={serviceForm.district}
                    onChange={(event) => updateServiceForm({ district: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder="District"
                  />
                </div>
                <Textarea
                  value={serviceForm.issueCategories}
                  onChange={(event) => updateServiceForm({ issueCategories: event.target.value })}
                  className="min-h-[72px]"
                  placeholder="employment, land, family"
                />
                <Textarea
                  value={serviceForm.serviceTypes}
                  onChange={(event) => updateServiceForm({ serviceTypes: event.target.value })}
                  className="min-h-[72px]"
                  placeholder="legal_information, referral, appointment"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={serviceForm.phone}
                    onChange={(event) => updateServiceForm({ phone: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder="+255..."
                  />
                  <input
                    value={serviceForm.capacity}
                    onChange={(event) => updateServiceForm({ capacity: event.target.value })}
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                    placeholder="Capacity"
                  />
                </div>
                <input
                  value={serviceForm.languages}
                  onChange={(event) => updateServiceForm({ languages: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Swahili, English"
                />
                <input
                  value={serviceForm.openingHours}
                  onChange={(event) => updateServiceForm({ openingHours: event.target.value })}
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                  placeholder="Mon - Fri, 9:00 AM - 5:00 PM"
                />
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
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button disabled={pending} onClick={createServicePoint}>
                    Create service
                  </Button>
                  <Button disabled={pending} variant="outline" onClick={seedServices}>
                    Seed QA services
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm xl:col-span-2">
              <div className="border-b p-5">
                <h2 className="text-xl">Verified service ecosystem</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Review active services, visibility, verification and intake state.
                  Confidential locations must not be made public.
                </p>
              </div>
              <div className="border-b bg-[#fbf7f8] p-5">
                <h3 className="mb-3 text-base">Organization accountability</h3>
                <div className="grid gap-3 lg:grid-cols-2">
                  {justiceOrganizations?.slice(0, 6).map((organization) => (
                    <div key={organization._id} className="rounded-xl border bg-white p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="mb-0 font-bold">{organization.name}</p>
                        <StatusPill value={organization.verificationStatus} urgent={organization.verificationStatus !== "verified"} />
                        <StatusPill value={organization.referralAgreementStatus.replaceAll("_", " ")} urgent={organization.referralAgreementStatus !== "active"} />
                      </div>
                      <p className="mb-1 text-sm capitalize text-neutral-600">
                        {organization.organizationType.replaceAll("_", " ")} · {organization.focalPersonName ?? "No focal person"}
                      </p>
                      <p className="mb-0 text-xs text-neutral-500">
                        SLA: {organization.slaHours ? `${organization.slaHours}h` : "not set"} · Services: {organization.serviceCount} · Referral capable: {organization.activeReferralServiceCount}
                      </p>
                    </div>
                  ))}
                  {justiceOrganizations?.length === 0 && (
                    <p className="mb-0 text-sm text-neutral-500">No organizations created yet.</p>
                  )}
                </div>
              </div>
              <div className="border-b p-5">
                <div className="mb-4 flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
                  <div>
                    <h3 className="mb-1 text-base">Partner referral performance</h3>
                    <p className="mb-0 text-sm text-neutral-500">
                      Last 30 days: SLA compliance, first response speed, overdue open referrals, delivery and onward referrals.
                    </p>
                  </div>
                  {partnerPerformance && (
                    <div className="grid gap-2 text-xs text-neutral-600 sm:grid-cols-5">
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{partnerPerformance.totals.referrals} referrals</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{partnerPerformance.totals.responded} responded</span>
                      <span className="rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-800">{partnerPerformance.totals.overdueOpen} overdue</span>
                      <span className="rounded-full bg-teal-100 px-3 py-1 font-bold text-teal-800">{partnerPerformance.totals.delivered} delivered</span>
                      <span className="rounded-full bg-[#f8eaf0] px-3 py-1 font-bold text-primary">{partnerPerformance.totals.onward} onward</span>
                    </div>
                  )}
                </div>
                {partnerPerformance === undefined && (
                  <p className="mb-0 text-sm text-neutral-500">Loading partner performance...</p>
                )}
                {partnerPerformance?.partners.length === 0 && (
                  <p className="mb-0 text-sm text-neutral-500">No referral performance data for this period yet.</p>
                )}
                <div className="grid gap-3 xl:grid-cols-2">
                  {partnerPerformance?.partners.slice(0, 8).map((partner) => (
                    <div key={partner.organizationId} className="rounded-xl border bg-[#fbfafa] p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="mb-0 font-bold">{partner.organizationName}</p>
                        <StatusPill value={`${partner.slaComplianceRate}% SLA`} urgent={partner.slaComplianceRate < 80 && partner.respondedCount > 0} />
                        {partner.overdueOpenCount > 0 && <StatusPill value={`${partner.overdueOpenCount} overdue`} urgent />}
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">
                        Response: {partner.responseRate}% · Avg response: {partner.averageResponseHours ?? "n/a"}h · SLA: {partner.slaHours}h
                      </p>
                      <p className="mb-2 text-xs text-neutral-500">
                        Delivered: {partner.deliveredCount} · Closed: {partner.closedCount} · Onward: {partner.onwardCount}
                      </p>
                      <p className="mb-0 text-xs text-neutral-500">
                        Services: {partner.serviceNames.join(", ") || "No linked service names"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="divide-y">
                {justiceServices === undefined && (
                  <p className="p-5 text-sm text-neutral-500">Loading services...</p>
                )}
                {justiceServices?.length === 0 && (
                  <div className="p-10 text-center">
                    <Building2 className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                    <p className="mb-1 font-bold">No services yet</p>
                    <p className="mb-0 text-sm text-neutral-500">
                      Add a service manually or seed QA services for mobile testing.
                    </p>
                  </div>
                )}
                {justiceServices?.map((service) => (
                  <div key={service._id} className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="mb-0 text-lg">{service.name}</h3>
                        <StatusPill value={service.verificationStatus} urgent={service.verificationStatus !== "verified"} />
                        <StatusPill value={service.visibility} urgent={service.visibility !== "public"} />
                        {!service.active && <StatusPill value="inactive" urgent />}
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">
                        {service.organizationName ?? "No organisation"} · {service.servicePointType.replaceAll("_", " ")} · {service.district}, {service.region}
                      </p>
                      {service.organization && (
                        <p className="mb-2 text-sm text-neutral-500">
                          Owner status: {service.organization.verificationStatus} · Agreement: {service.organization.referralAgreementStatus} · SLA: {service.organization.slaHours ? `${service.organization.slaHours}h` : "not set"}
                        </p>
                      )}
                      <p className="mb-3 text-sm text-neutral-500">
                        Intake: {service.currentIntakeState.replaceAll("_", " ")} · Capacity: {service.capacity ?? "not set"} · Languages: {service.languages.join(", ") || "not set"}
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
                      {service.verificationStatus !== "verified" && (
                        <Button disabled={pending} onClick={() => setServiceVerified(service._id)}>
                          Verify
                        </Button>
                      )}
                      {service.active ? (
                        <Button disabled={pending} variant="outline" onClick={() => deactivateService(service._id)}>
                          Deactivate
                        </Button>
                      ) : null}
                      <p className="mb-0 rounded-xl bg-[#fbf7f8] p-3 text-xs text-neutral-600">
                        Public app can only show active, verified, public service records.
                      </p>
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
                <h2 className="text-xl">Assignment offer monitor</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Track provider offers, expiry windows, and stalled assignment
                  handoffs.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={assignmentStatus}
                  onChange={(event) =>
                    setAssignmentStatus(event.target.value as typeof assignmentStatus)
                  }
                  className="h-11 rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="offered">Offered</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                  <option value="ended">Ended</option>
                </select>
                <Button
                  disabled={pending}
                  variant="outline"
                  onClick={expireStaleOffersNow}
                >
                  Expire stale offers now
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {assignmentOffers === undefined && (
                <p className="p-5 text-sm text-neutral-500">
                  Loading assignment offers...
                </p>
              )}
              {assignmentOffers?.length === 0 && (
                <div className="p-10 text-center">
                  <UserRoundCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">No assignment offers in this status</p>
                  <p className="mb-0 text-sm text-neutral-500">
                    New provider offers and expired handoffs will appear here.
                  </p>
                </div>
              )}
              {assignmentOffers?.map((item) => {
                const expiresAt = item.history.expiresAt;
                const isStale = item.history.isOverdue;
                return (
                  <div
                    key={item.assignment._id}
                    className="grid gap-4 p-5 lg:grid-cols-[1fr_270px]"
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
                            value={item.case.status.replaceAll("_", " ")}
                            urgent={item.case.priority !== "standard"}
                          />
                        )}
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">
                        Offered to {item.assignee?.name ?? "Unknown provider"} by{" "}
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
                          <p className="mb-1 font-bold text-neutral-800">Availability at offer</p>
                          <p className="mb-0 capitalize">
                            {item.history.availabilityStatus.replaceAll("_", " ")}
                          </p>
                        </div>
                        <div className="rounded-xl border bg-white p-3">
                          <p className="mb-1 font-bold text-neutral-800">Response evidence</p>
                          <p className="mb-0">
                            {item.history.responseHours !== null
                              ? `${item.history.responseHours} hours after offer`
                              : `${item.history.offerAgeHours} hours open`}
                          </p>
                        </div>
                      </div>
                      {item.history.availabilityOverrideReason && (
                        <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                          <span className="font-bold">Availability override:</span>{" "}
                          {item.history.availabilityOverrideReason}
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl border bg-[#fbf7f8] p-4 text-sm">
                      <p className="mb-2 font-bold">Offer timing</p>
                      <p className="mb-1 text-neutral-600">
                        Offered: {formatDate(item.assignment.offeredAt)}
                      </p>
                      <p className={`mb-3 ${isStale ? "font-bold text-orange-700" : "text-neutral-600"}`}>
                        Expires: {formatDate(expiresAt)}
                      </p>
                      {item.assignment.respondedAt && (
                        <p className="mb-1 text-neutral-600">
                          Responded: {formatDate(item.assignment.respondedAt)}
                        </p>
                      )}
                      {item.assignment.endedAt && (
                        <p className="mb-3 text-neutral-600">
                          Ended: {formatDate(item.assignment.endedAt)}
                        </p>
                      )}
                      {item.assignment.reason && (
                        <p className="mb-3 rounded-lg bg-white p-2 text-xs text-neutral-700">
                          <span className="font-bold">Reason:</span>{" "}
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
                        >
                          Open case
                        </Button>
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
                <h2 className="text-xl">Case review and reassignment requests</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Review beneficiary concerns without exposing details directly
                  to the assigned provider.
                </p>
              </div>
              <select
                value={reviewStatus}
                onChange={(event) =>
                  setReviewQueueStatus(event.target.value as typeof reviewStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under review</option>
                <option value="resolved">Resolved</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div className="divide-y">
              {reviewQueue === undefined && (
                <p className="p-5 text-sm text-neutral-500">
                  Loading review requests...
                </p>
              )}
              {reviewQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">No review requests in this queue</p>
                  <p className="mb-0 text-sm text-neutral-500">
                    Beneficiary concerns and reassignment requests will appear
                    here.
                  </p>
                </div>
              )}
              {reviewQueue?.map((item) => (
                <div
                  key={item.review._id}
                  className="grid gap-4 p-5 lg:grid-cols-[1fr_260px]"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.case?.publicId ?? "Case unavailable"}
                      </h3>
                      <StatusPill
                        value={item.review.status.replaceAll("_", " ")}
                        urgent={item.review.reason === "safety_concern"}
                      />
                      <StatusPill
                        value={item.review.reason.replaceAll("_", " ")}
                        urgent={item.review.reason === "safety_concern"}
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      Requested by {item.requester?.name ?? "Beneficiary"} on{" "}
                      {formatDate(item.review.createdAt)}
                    </p>
                    {item.review.note && (
                      <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#f8f2f4] p-3 text-sm text-neutral-700">
                        {item.review.note}
                      </p>
                    )}
                    {item.review.resolutionNote && (
                      <p className="mt-3 whitespace-pre-wrap rounded-xl border p-3 text-sm text-neutral-700">
                        Resolution: {item.review.resolutionNote}
                      </p>
                    )}
                    {["submitted", "under_review"].includes(item.review.status) && (
                      <div className="mt-3">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Staff resolution note
                        </label>
                        <Textarea
                          value={reviewNotesById[item.review._id] ?? ""}
                          onChange={(event) =>
                            setReviewNotesById((current) => ({
                              ...current,
                              [item.review._id]: event.target.value,
                            }))
                          }
                          placeholder="Record what LSF reviewed, the decision, and the safe next step for the beneficiary."
                          className="min-h-[92px]"
                        />
                        <p className="mb-0 mt-2 text-xs text-neutral-500">
                          Keep this beneficiary-safe. Do not include internal
                          disciplinary details or sensitive provider-side notes.
                        </p>
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
                      >
                        Open case
                      </Button>
                    )}
                    {item.case && ["submitted", "under_review"].includes(item.review.status) && (
                      <div className="rounded-xl border bg-[#fbf7f8] p-3">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500">
                          Replacement provider
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          className="mb-2 w-full"
                          onClick={() => setSelectedCaseId(item.case!._id)}
                        >
                          Load matching evidence
                        </Button>
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
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">
                                    Score {provider.score}
                                  </span>
                                </div>
                                <p className="mb-1 capitalize text-neutral-500">
                                  {provider.role.replaceAll("_", " ")}
                                  {provider.district ? ` · ${provider.district}` : ""}
                                  {provider.region ? `, ${provider.region}` : ""}
                                  {` · ${provider.activeLoad} active case${provider.activeLoad === 1 ? "" : "s"}`}
                                </p>
                                <p className="mb-0 text-neutral-600">
                                  {provider.reasons.slice(0, 3).join(" · ")}
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
                          <option value="">Select provider</option>
                          {providers?.map((provider) => (
                            <option key={provider.id} value={provider.id}>
                              {provider.name} ·{" "}
                              {provider.role.replaceAll("_", " ")} ·{" "}
                              {(provider.availabilityStatus ?? "accepting_cases").replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        {requiresAvailabilityOverride(selectedReassignmentProvider) && (
                          <Textarea
                            value={reassignmentOverrideReason}
                            onChange={(event) => setReassignmentOverrideReason(event.target.value)}
                            placeholder="Required: explain why staff is assigning a paused or unavailable provider."
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
                        >
                          Reassign and offer
                        </Button>
                      </div>
                    )}
                    {item.review.status === "submitted" && (
                      <Button
                        disabled={pending}
                        onClick={() =>
                          decideReviewRequest(item.review._id, "under_review")
                        }
                      >
                        Mark under review
                      </Button>
                    )}
                    {["submitted", "under_review"].includes(item.review.status) && (
                      <>
                        <Button
                          disabled={pending}
                          onClick={() =>
                            decideReviewRequest(item.review._id, "resolved")
                          }
                        >
                          Mark resolved
                        </Button>
                        <Button
                          disabled={pending}
                          variant="outline"
                          onClick={() =>
                            decideReviewRequest(item.review._id, "declined")
                          }
                        >
                          Decline request
                        </Button>
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
                <h2 className="text-xl">Document review</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Review private case documents uploaded by beneficiaries and
                  case workers.
                </p>
              </div>
              <select
                value={documentStatus}
                onChange={(event) =>
                  setDocumentStatus(event.target.value as typeof documentStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">Pending review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="divide-y">
              {documentQueue === undefined && (
                <p className="p-5 text-sm text-neutral-500">
                  Loading documents...
                </p>
              )}
              {documentQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <FileText className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">No documents in this queue</p>
                  <p className="mb-0 text-sm text-neutral-500">
                    Uploaded files will appear here after case access is
                    created.
                  </p>
                </div>
              )}
              {documentQueue?.map((item) => (
                <div
                  key={item.document._id}
                  className="grid gap-4 p-5 lg:grid-cols-[1fr_260px]"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">{item.document.name}</h3>
                      <StatusPill
                        value={item.document.status.replaceAll("_", " ")}
                        urgent={item.document.status === "pending_review"}
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {item.case?.publicId ?? "Case unavailable"} ·{" "}
                      {item.document.category.replaceAll("_", " ")} ·{" "}
                      {(item.document.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="mb-0 text-sm text-neutral-500">
                      Uploaded by {item.uploader?.name ?? "Unknown"} on{" "}
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
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open document
                      </a>
                    )}
                    {item.document.status === "pending_review" && (
                      <>
                        <Button
                          disabled={pending}
                          onClick={() =>
                            decideDocument(item.document._id, "accepted")
                          }
                        >
                          Accept document
                        </Button>
                        <Button
                          disabled={pending}
                          variant="outline"
                          onClick={() =>
                            decideDocument(item.document._id, "rejected")
                          }
                        >
                          Reject document
                        </Button>
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
                <h2 className="text-xl">Referral consent evidence</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Review signed consent files attached to service referrals before they become accepted audit evidence.
                </p>
              </div>
              <select
                value={consentEvidenceStatus}
                onChange={(event) =>
                  setConsentEvidenceStatus(event.target.value as typeof consentEvidenceStatus)
                }
                className="h-11 rounded-xl border bg-white px-3 text-sm"
              >
                <option value="pending_review">Pending review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="divide-y">
              {consentEvidenceQueue === undefined && (
                <p className="p-5 text-sm text-neutral-500">
                  Loading consent evidence...
                </p>
              )}
              {consentEvidenceQueue?.length === 0 && (
                <div className="p-10 text-center">
                  <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-primary/40" />
                  <p className="mb-1 font-bold">No consent evidence in this queue</p>
                  <p className="mb-0 text-sm text-neutral-500">
                    Signed referral consent files appear here after staff create referrals.
                  </p>
                </div>
              )}
              {consentEvidenceQueue?.map((item) => (
                <div
                  key={item.consent._id}
                  className="grid gap-4 p-5 lg:grid-cols-[1fr_260px]"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="mb-0 text-lg">
                        {item.consent.evidenceFileName ?? "Signed consent evidence"}
                      </h3>
                      <StatusPill
                        value={(item.consent.reviewStatus ?? "pending_review").replaceAll("_", " ")}
                        urgent={(item.consent.reviewStatus ?? "pending_review") === "pending_review"}
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {item.referral?.publicId ?? "Referral pending link"} ·{" "}
                      {item.case?.publicId ?? "Case unavailable"} ·{" "}
                      {item.destinationService?.name ?? "Destination unavailable"}
                    </p>
                    <p className="mb-2 text-sm text-neutral-500">
                      Recorded by {item.recordedBy?.name ?? "Unknown"} for{" "}
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
                        <span className="font-bold">Review note:</span>{" "}
                        {item.consent.reviewNotes}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-neutral-500">
                      Retention: {(item.consent.retentionStatus ?? "active").replaceAll("_", " ")}
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
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open consent file
                      </a>
                    )}
                    {(item.consent.reviewStatus ?? "pending_review") === "pending_review" && (
                      <>
                        <Button
                          disabled={pending}
                          onClick={() =>
                            decideConsentEvidence(item.consent._id, "accepted")
                          }
                        >
                          Accept consent evidence
                        </Button>
                        <Button
                          disabled={pending}
                          variant="outline"
                          onClick={() =>
                            decideConsentEvidence(item.consent._id, "rejected")
                          }
                        >
                          Reject consent evidence
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          </>
        ) : tab === "requests" ? (
          <section className="grid min-h-[600px] overflow-hidden rounded-2xl border bg-white shadow-sm lg:grid-cols-[390px_1fr]">
            <div
              className={`${detail ? "hidden lg:block" : "block"} border-r border-neutral-200`}
            >
              <div className="border-b p-4">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-500"
                  htmlFor="request-status"
                >
                  Queue
                </label>
                <select
                  id="request-status"
                  value={requestStatus}
                  onChange={(event) =>
                    setRequestStatus(event.target.value as typeof requestStatus)
                  }
                  className="h-11 w-full rounded-xl border bg-white px-3 text-sm"
                >
                  <option value="all">Open requests</option>
                  <option value="submitted">New</option>
                  <option value="under_review">Under review</option>
                  <option value="waiting_for_information">
                    Waiting for information
                  </option>
                </select>
              </div>
              <div className="max-h-[680px] overflow-y-auto">
                {requests === undefined && (
                  <p className="p-5 text-sm text-neutral-500">
                    Loading secure queue...
                  </p>
                )}
                {requests?.length === 0 && (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-teal-600" />
                    <p className="mb-1 font-bold">Queue clear</p>
                    <p className="mb-0 text-sm text-neutral-500">
                      No requests match this filter.
                    </p>
                  </div>
                )}
                {requests?.map((request) => (
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
              className={`${detail ? "block" : "hidden lg:flex"} min-w-0 flex-col`}
            >
              {!detail ? (
                <div className="m-auto max-w-sm p-8 text-center">
                  <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary/40" />
                  <h2 className="mb-2 text-xl">Select a request</h2>
                  <p className="mb-0 text-sm text-neutral-500">
                    Opening a request is recorded in the audit trail. Only use
                    information necessary to coordinate assistance.
                  </p>
                </div>
              ) : (
                <div className="p-4 sm:p-7">
                  <button
                    onClick={() => setDetail(null)}
                    className="mb-5 flex items-center gap-2 text-sm font-bold text-primary lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to queue
                  </button>
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
                      <p className="mb-0 text-sm text-neutral-500">
                        Submitted {formatDate(detail.request.submittedAt)}
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
                      <option value="under_review">Under review</option>
                      <option value="waiting_for_information">
                        Waiting for information
                      </option>
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Info
                      label="Beneficiary"
                      value={detail.beneficiary?.name ?? "Account unavailable"}
                    />
                    <Info
                      label="Safe contact"
                      value={(
                        detail.request.safeContactMethod ?? "Not provided"
                      ).replaceAll("_", " ")}
                    />
                    <Info
                      label="Support language"
                      value={languageLabel(detail.request.preferredLanguage, detail.request.preferredLanguageOther)}
                    />
                    <Info
                      label="Location"
                      value={`${detail.request.district ?? "-"}, ${detail.request.region ?? "-"}`}
                    />
                    <Info
                      label="Urgency"
                      value={(detail.request.urgency ?? "standard").replaceAll(
                        "_",
                        " ",
                      )}
                    />
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#f8f2f4] p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                      What happened
                    </p>
                    <p className="mb-0 whitespace-pre-wrap text-base leading-7">
                      {detail.request.description}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Info
                      label="Help requested"
                      value={detail.request.desiredHelp ?? "Not provided"}
                    />
                    <Info
                      label="Documents available"
                      value={detail.request.hasDocuments ? "Yes" : "No"}
                    />
                  </div>
                  {detail.answers.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg">
                        Additional intake answers
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {detail.answers.map((answer) => (
                          <Info
                            key={answer._id}
                            label={answer.questionKey.replaceAll("_", " ")}
                            value={answer.value}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-7 border-t pt-6">
                    <div className="mb-4">
                      <h3 className="mb-1 text-lg">Create accountable case</h3>
                      <p className="mb-0 text-sm text-neutral-500">
                        Use a factual minimum-necessary summary. Do not copy
                        unrelated sensitive details.
                      </p>
                    </div>
                    <Textarea
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      maxLength={3000}
                      className="min-h-28"
                      aria-label="Case summary"
                    />
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <select
                        value={priority}
                        onChange={(event) =>
                          setPriority(event.target.value as typeof priority)
                        }
                        className="h-11 rounded-xl border bg-white px-3 text-sm sm:w-52"
                      >
                        <option value="standard">Standard priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="safeguarding">Safeguarding</option>
                      </select>
                      <Button
                        disabled={pending}
                        onClick={convertToCase}
                        className="sm:ml-auto"
                      >
                        {pending ? "Working..." : "Create case"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="grid min-h-[600px] overflow-hidden rounded-2xl border bg-white shadow-sm lg:grid-cols-[390px_1fr]">
            <div
              className={`${selectedCaseId ? "hidden lg:block" : "block"} border-r border-neutral-200`}
            >
              <div className="border-b p-5">
                <h2 className="text-xl">Cases in your scope</h2>
                <p className="mb-0 text-sm text-neutral-500">
                  Ordered by latest activity
                </p>
              </div>
              {cases?.map((record) => (
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
                  <p className="mb-0 text-xs text-neutral-400">
                    Updated {formatDate(record.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
            <div
              className={`${selectedCaseId ? "block" : "hidden lg:flex"} min-w-0 flex-col`}
            >
              {!selectedCaseId || !caseDetail ? (
                <div className="m-auto p-8 text-center">
                  <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-primary/40" />
                  <h2 className="mb-2 text-xl">Select a case</h2>
                  <p className="mb-0 text-sm text-neutral-500">
                    Review its accountable timeline and coordinate the next
                    action.
                  </p>
                </div>
              ) : (
                <div className="p-4 sm:p-7">
                  <button
                    onClick={() => setSelectedCaseId(null)}
                    className="mb-5 flex items-center gap-2 text-sm font-bold text-primary lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to cases
                  </button>
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b pb-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h2 className="text-2xl">{caseDetail.case.publicId}</h2>
                        <StatusPill
                          value={caseLabels[caseDetail.case.status]}
                          urgent={caseDetail.case.priority !== "standard"}
                        />
                      </div>
                      <p className="mb-0 text-sm text-neutral-500">
                        Opened {formatDate(caseDetail.case.createdAt)}
                      </p>
                    </div>
                    {nextStatuses[caseDetail.case.status]?.length > 0 && (
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
                        <option value="" disabled>
                          Update status...
                        </option>
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
                  <div className="rounded-2xl bg-[#f8f2f4] p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                      Case summary
                    </p>
                    <p className="mb-0 whitespace-pre-wrap leading-7">
                      {caseDetail.case.summary}
                    </p>
                  </div>
                  {caseDetail.closureReadiness && (
                    <div className={`mt-5 rounded-xl border p-4 ${caseDetail.closureReadiness.canClose ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"}`}>
                      <h3 className="mb-3 flex items-center gap-2 text-base">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Closure readiness
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <ClosureItem label="Outcome recorded" ready={caseDetail.closureReadiness.requirements.outcomeRecorded} />
                        <ClosureItem label="Beneficiary-safe summary" ready={caseDetail.closureReadiness.requirements.beneficiarySafeSummary} />
                        <ClosureItem label="Documents reviewed" ready={caseDetail.closureReadiness.requirements.documentsReviewed} detail={`${caseDetail.closureReadiness.pendingDocumentCount} pending`} />
                        <ClosureItem label="Feedback requested" ready={caseDetail.closureReadiness.requirements.feedbackRequested} />
                      </div>
                      {!caseDetail.closureReadiness.canClose && (
                        <p className="mb-0 mt-3 text-sm font-semibold text-orange-800">
                          Final close is blocked until every closure requirement is complete.
                        </p>
                      )}
                    </div>
                  )}
                  {caseDetail.assignmentHistory.length > 0 && (
                    <div className="mt-5 rounded-xl border bg-white p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-base">
                        <UserRoundCheck className="h-5 w-5 text-primary" />
                        Assignment history
                      </h3>
                      <div className="grid gap-3">
                        {caseDetail.assignmentHistory.map((item) => (
                          <div key={item.assignment._id} className="rounded-xl border bg-[#fbf7f8] p-3">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="font-bold">{item.assigneeName}</span>
                              <StatusPill value={item.assignment.status} urgent={item.history.isOverdue || item.assignment.status === "expired"} />
                              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold capitalize text-neutral-600">
                                {item.history.availabilityStatus.replaceAll("_", " ")}
                              </span>
                            </div>
                            <p className="mb-1 text-sm text-neutral-600">
                              Offered by {item.offeredByName} on {formatDate(item.assignment.offeredAt)}
                            </p>
                            <p className="mb-1 text-xs text-neutral-500">
                              Expires {formatDate(item.history.expiresAt)} · {item.history.responseHours !== null ? `responded after ${item.history.responseHours}h` : `${item.history.offerAgeHours}h open`}
                            </p>
                            {item.assignment.reason && (
                              <p className="mb-1 text-xs text-neutral-600">
                                Reason: {item.assignment.reason}
                              </p>
                            )}
                            {item.history.availabilityOverrideReason && (
                              <p className="mb-0 rounded-lg border border-orange-200 bg-orange-50 p-2 text-xs text-orange-900">
                                Override: {item.history.availabilityOverrideReason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {caseDetail.appointments.length > 0 && (
                    <div className="mt-5 rounded-xl border bg-white p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-base">
                        <Clock3 className="h-5 w-5 text-primary" />
                        Appointment lifecycle
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {caseDetail.appointments.map((appointment) => (
                          <div key={appointment._id} className="rounded-xl border bg-[#fbf7f8] p-3">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <p className="mb-0 font-bold">{formatDate(appointment.startsAt)}</p>
                              <StatusPill value={appointment.status} urgent={appointment.status === "missed" || appointment.status === "cancelled"} />
                            </div>
                            <p className="mb-0 text-sm capitalize text-neutral-600">
                              {appointment.mode.replaceAll("_", " ")}
                              {appointment.location ? ` · ${appointment.location}` : ""}
                            </p>
                            {appointment.statusNote && (
                              <p className="mb-0 mt-2 rounded-lg bg-white p-2 text-sm text-neutral-600">
                                {appointment.statusNote}
                              </p>
                            )}
                            {appointment.statusUpdatedAt && (
                              <p className="mb-0 mt-2 text-xs text-neutral-500">
                                Updated {formatDate(appointment.statusUpdatedAt)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg">
                        <Clock3 className="h-5 w-5 text-primary" />
                        Accountable timeline
                      </h3>
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
                              {eventTitle(event)}
                            </p>
                            {eventDetail(event) && (
                              <p className="mb-1 text-sm text-neutral-600">
                                {eventDetail(event)}
                              </p>
                            )}
                            <p className="mb-0 text-xs text-neutral-500">
                              {formatDate(event.occurredAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg">
                        <UserRoundCheck className="h-5 w-5 text-primary" />
                        Offer assignment
                      </h3>
                      <div className="rounded-xl border p-4">
                        <p className="mb-4 text-sm text-neutral-600">
                          Recommended providers are ranked by location, issue
                          fit, verification, language fit, declared availability,
                          and current accepted caseload. The provider must accept
                          before receiving case access.
                        </p>
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
                                  {provider.role.replaceAll("_", " ")}
                                  {provider.district
                                    ? ` · ${provider.district}`
                                    : ""}
                                  {provider.region
                                    ? `, ${provider.region}`
                                    : ""}
                                </p>
                                <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                                  <span className="rounded-full bg-[#f8f2f4] px-2 py-1 text-primary">
                                    {(provider.availabilityStatus ?? "accepting_cases").replaceAll("_", " ")}
                                  </span>
                                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800">
                                    {provider.remainingCapacity ?? 0}/{provider.weeklyCapacity ?? 0} slots
                                  </span>
                                  {provider.workingHours && (
                                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700">
                                      {provider.workingHours}
                                    </span>
                                  )}
                                </div>
                                <p className="mb-0 text-xs text-neutral-600">
                                  {provider.reasons.slice(0, 3).join(" · ")}
                                </p>
                                {provider.availabilityNotes && (
                                  <p className="mb-0 mt-1 text-xs text-neutral-500">
                                    Note: {provider.availabilityNotes}
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
                          <option value="">Select service provider</option>
                          {providers?.map((provider) => (
                            <option key={provider.id} value={provider.id}>
                              {provider.name} ·{" "}
                              {provider.role.replaceAll("_", " ")} ·{" "}
                              {(provider.availabilityStatus ?? "accepting_cases").replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        {requiresAvailabilityOverride(selectedAssignmentProvider) && (
                          <Textarea
                            value={assignmentOverrideReason}
                            onChange={(event) => setAssignmentOverrideReason(event.target.value)}
                            placeholder="Required: explain why staff is assigning a paused or unavailable provider."
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
                        >
                          Send assignment offer
                        </Button>
                      </div>
                      <div className="mt-5 rounded-xl border p-4">
                        <h3 className="mb-2 flex items-center gap-2 text-base">
                          <ChevronRight className="h-5 w-5 text-primary" />
                          Create service referral
                        </h3>
                        <p className="mb-4 text-sm text-neutral-600">
                          Use this when the beneficiary needs support beyond
                          the current case team. Record the minimum information
                          shared and only use verified, non-confidential
                          destinations.
                        </p>
                        <select
                          value={referralServiceId}
                          onChange={(event) => setReferralServiceId(event.target.value)}
                          className="mb-3 h-11 w-full rounded-xl border bg-white px-3 text-sm"
                        >
                          <option value="">Select referral destination</option>
                          {referralCapableServices.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.name} · {service.district}, {service.region} · {service.currentIntakeState.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        <select
                          value={referralDestinationUserId}
                          onChange={(event) => setReferralDestinationUserId(event.target.value)}
                          className="mb-3 h-11 w-full rounded-xl border bg-white px-3 text-sm"
                        >
                          <option value="">Assign receiving provider account</option>
                          {providers?.map((provider) => (
                            <option key={provider.id} value={provider.id}>
                              {provider.name} · {provider.role.replaceAll("_", " ")} · {(provider.availabilityStatus ?? "accepting_cases").replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        <Textarea
                          value={referralReason}
                          onChange={(event) => setReferralReason(event.target.value)}
                          placeholder="Why is this referral needed? Include only beneficiary-safe operational context."
                          className="mb-3 min-h-[92px] text-sm"
                        />
                        <Textarea
                          value={referralInformationShared}
                          onChange={(event) => setReferralInformationShared(event.target.value)}
                          placeholder="Comma-separated minimum information shared"
                          className="mb-3 min-h-[78px] text-sm"
                        />
                        <div className="mb-3 rounded-xl border border-orange-200 bg-orange-50 p-3">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-900">
                            Consent proof
                          </p>
                          <select
                            value={referralConsentMethod}
                            onChange={(event) => setReferralConsentMethod(event.target.value as typeof referralConsentMethod)}
                            className="mb-3 h-10 w-full rounded-lg border bg-white px-3 text-sm"
                          >
                            <option value="documented_verbal">Documented verbal consent</option>
                            <option value="written">Written consent</option>
                            <option value="sms">SMS consent</option>
                            <option value="email">Email consent</option>
                            <option value="signed_document">Signed document</option>
                          </select>
                          <Textarea
                            value={referralConsentStatement}
                            onChange={(event) => setReferralConsentStatement(event.target.value)}
                            placeholder="Exact consent statement confirmed with the beneficiary"
                            className="mb-3 min-h-[86px] bg-white text-sm"
                          />
                          <Textarea
                            value={referralConsentEvidenceNote}
                            onChange={(event) => setReferralConsentEvidenceNote(event.target.value)}
                            placeholder="Evidence note: who collected it, when, channel used, and where supporting proof is stored."
                            className="mb-3 min-h-[76px] bg-white text-sm"
                          />
                          <label className="block rounded-lg border border-dashed border-orange-300 bg-white p-3 text-xs text-orange-900">
                            <span className="mb-1 block font-bold">Signed consent file</span>
                            <span className="mb-2 block text-neutral-600">
                              Required when method is signed document. PDF, JPG, or PNG up to 10MB.
                            </span>
                            <input
                              type="file"
                              accept=".pdf,image/jpeg,image/png"
                              onChange={(event) => setReferralConsentFile(event.target.files?.[0] ?? null)}
                              className="block w-full text-xs"
                            />
                            {referralConsentFile && (
                              <span className="mt-2 block text-neutral-600">
                                Selected: {referralConsentFile.name}
                              </span>
                            )}
                          </label>
                        </div>
                        <Button
                          disabled={pending || !referralServiceId || referralReason.trim().length < 12 || referralConsentStatement.trim().length < 20}
                          onClick={createCaseReferral}
                          className="w-full"
                        >
                          Create referral
                        </Button>
                      </div>
                      <div className="mt-5 rounded-xl border p-4">
                        <h3 className="mb-2 flex items-center gap-2 text-base">
                          <MessageSquareText className="h-5 w-5 text-primary" />
                          Case communication
                        </h3>
                        <p className="mb-0 text-sm text-neutral-500">
                          Messages remain case-scoped. Staff conversation
                          controls will follow the participant and safeguarding
                          workflow.
                        </p>
                      </div>
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

export default StaffDashboard;
