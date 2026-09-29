import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate } from "react-router-dom";
import { BarChart3, CalendarDays, CheckCircle2, ShieldCheck, TrendingUp } from "lucide-react";
import { api } from "../../convex/_generated/api";
import Layout from "../components/layout/Layout";
import Container from "@/components/shared/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SnapshotValues = {
  periodDays?: number;
  requestsSubmitted?: number | null;
  casesCreated?: number | null;
  openCases?: number;
  resolvedCases?: number | null;
  assignmentAcceptanceRate?: number;
  averageAssignmentResponseHours?: number;
  appointmentsKeptRate?: number;
  referralAcceptanceRate?: number;
  averageReferralResponseHours?: number;
  referralCompletionCount?: number | null;
  feedbackAverageRating?: number;
  feedbackCount?: number | null;
};

function formatDate(value: number) {
  return new Date(value).toLocaleDateString("en-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function metricValue(value: number | null | undefined, suffix = "") {
  if (value === null) return "Suppressed";
  if (value === undefined) return "Pending";
  return `${value.toLocaleString()}${suffix}`;
}

const StakeholderDashboard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const snapshots = useQuery(api.reporting.listSnapshots, { status: "approved" });

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Verifying access...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const latest = snapshots?.[0];
  const values = (latest?.values ?? {}) as SnapshotValues;
  const cards = [
    { label: "Requests submitted", value: metricValue(values.requestsSubmitted), icon: BarChart3 },
    { label: "Cases created", value: metricValue(values.casesCreated), icon: CheckCircle2 },
    { label: "Open cases", value: metricValue(values.openCases), icon: TrendingUp },
    { label: "Resolved cases", value: metricValue(values.resolvedCases), icon: CheckCircle2 },
    { label: "Assignment acceptance", value: metricValue(values.assignmentAcceptanceRate, "%"), icon: TrendingUp },
    { label: "Referral acceptance", value: metricValue(values.referralAcceptanceRate, "%"), icon: TrendingUp },
    { label: "Appointments kept", value: metricValue(values.appointmentsKeptRate, "%"), icon: CalendarDays },
    { label: "Feedback responses", value: metricValue(values.feedbackCount), icon: BarChart3 },
  ];

  return (
    <Layout>
      <section className="border-b bg-white py-8">
        <Container>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">Donor-safe reporting</p>
              <h1 className="mb-2 text-3xl font-bold text-neutral-900">Haki Yangu Impact Snapshot</h1>
              <p className="mb-0 max-w-3xl text-sm leading-6 text-neutral-600">
                Approved aggregate metrics only. This dashboard does not expose beneficiary names,
                case descriptions, message text, document names, phone numbers, emails, or exact locations.
              </p>
            </div>
            {latest && (
              <div className="rounded-xl border bg-[#fbf7f8] px-4 py-3 text-sm text-neutral-700">
                {formatDate(latest.periodStart)} - {formatDate(latest.periodEnd)}
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-[#f8f5f6] py-8">
        <Container>
          {snapshots === undefined ? (
            <div className="rounded-2xl border bg-white p-8 text-sm text-neutral-500">Loading approved reporting snapshots...</div>
          ) : !latest ? (
            <div className="rounded-2xl border bg-white p-8 text-center">
              <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-primary/50" />
              <h2 className="mb-2 text-xl font-bold text-neutral-900">No approved snapshot yet</h2>
              <p className="mx-auto mb-0 max-w-xl text-sm leading-6 text-neutral-600">
                LSF staff or supervisors must generate and approve a donor-safe reporting snapshot
                before stakeholder or donor accounts can view platform metrics.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((item) => (
                  <Card key={item.label} className="border bg-white shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="mb-1 text-2xl font-bold text-neutral-900">{item.value}</p>
                      <p className="mb-0 text-sm text-neutral-500">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Card className="border bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Quality and Privacy Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-6 text-neutral-600">{latest.publicSummary}</p>
                    <div className="flex flex-wrap gap-2">
                      {latest.qualityFlags.length ? latest.qualityFlags.map((flag) => (
                        <span key={flag} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          {flag.replaceAll("_", " ")}
                        </span>
                      )) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          No quality flags
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Operational Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-neutral-600">
                    <p>Average assignment response: {metricValue(values.averageAssignmentResponseHours, "h")}</p>
                    <p>Average referral response: {metricValue(values.averageReferralResponseHours, "h")}</p>
                    <p>Referral completions: {metricValue(values.referralCompletionCount)}</p>
                    <p>Average feedback rating: {metricValue(values.feedbackAverageRating)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
};

export default StakeholderDashboard;
