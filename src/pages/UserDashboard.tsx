import type React from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Navigate, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  LogOut,
  MessageCircle,
  Scale,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import Layout from "../components/layout/Layout";
import Container from "@/components/shared/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatDate(value?: number) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleDateString("en-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function humanStatus(value?: string) {
  return value ? value.replaceAll("_", " ") : "pending";
}

function latestTimestamp(record: { updatedAt?: number; createdAt?: number; submittedAt?: number }) {
  return record.updatedAt ?? record.submittedAt ?? record.createdAt ?? 0;
}

const UserDashboard = () => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const access = useQuery(api.users.currentAccess);
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn ? {} : "skip");
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const appointments = useQuery(api.caseManagement.myAppointments, isSignedIn ? {} : "skip");
  const documents = useQuery(api.caseManagement.myDocuments, isSignedIn ? {} : "skip");

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Verifying access...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const roles = access?.roles ?? [];
  if (roles.includes("admin")) return <Navigate to="/admin" replace />;
  if (roles.includes("paralegal") || roles.includes("provider_staff")) return <Navigate to="/dashboard/paralegal" replace />;
  if (roles.includes("staff") || roles.includes("supervisor") || roles.includes("safeguarding_officer")) return <Navigate to="/dashboard/staff" replace />;
  if (roles.includes("stakeholder") || roles.includes("donor")) return <Navigate to="/dashboard/stakeholder" replace />;

  const userName = access?.user?.name || clerkUser?.firstName || "User";
  const userInitials = userName.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
  const userImage = access?.user?.imageUrl || clerkUser?.imageUrl;
  const activeCases = cases?.filter((record) => !["closed", "closed_unresolved", "resolved"].includes(record.status)).length ?? 0;
  const submittedRequests = requests?.filter((record) => record.status !== "draft").length ?? 0;
  const upcomingAppointments = appointments?.filter((record) => record.status === "scheduled" && record.startsAt >= Date.now()) ?? [];
  const latestCase = cases?.[0];
  const latestRequest = requests?.filter((record) => record.status !== "draft")[0];
  const recentItems = [
    ...(cases ?? []).slice(0, 3).map((record) => ({
      key: `case-${record._id}`,
      title: record.publicId,
      subtitle: record.summary,
      status: record.status,
      when: latestTimestamp(record),
    })),
    ...(requests ?? []).filter((record) => record.status !== "draft").slice(0, 3).map((record) => ({
      key: `request-${record._id}`,
      title: record.publicId,
      subtitle: `${record.region ?? "Tanzania"}${record.district ? ` · ${record.district}` : ""}`,
      status: record.status,
      when: latestTimestamp(record),
    })),
  ].sort((a, b) => b.when - a.when).slice(0, 5);

  const loadingPrivateData = [requests, cases, appointments, documents].some((value) => value === undefined);

  return (
    <Layout>
      <section className="border-b bg-white py-8">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-neutral-200">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary">My Haki Yangu workspace</p>
                <h1 className="mb-1 text-2xl font-bold text-neutral-900">{userName}</h1>
                <p className="mb-0 text-sm text-neutral-500">Cases, requests, appointments, and documents from your secure account.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => signOut({ redirectUrl: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 py-8">
        <Container>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <MetricCard title="Active cases" value={activeCases} description="Cases still in progress" icon={<Scale className="h-5 w-5" />} />
            <MetricCard title="Submitted requests" value={submittedRequests} description="Requests sent to LSF" icon={<MessageCircle className="h-5 w-5" />} />
            <MetricCard title="Upcoming appointments" value={upcomingAppointments.length} description="Scheduled meetings" icon={<CalendarDays className="h-5 w-5" />} />
            <MetricCard title="Case documents" value={documents?.length ?? 0} description="Documents in your cases" icon={<FileText className="h-5 w-5" />} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-neutral-100 shadow-sm">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="text-base">Current legal-help status</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {loadingPrivateData ? (
                    <p className="text-sm text-neutral-500">Loading your protected records...</p>
                  ) : latestCase ? (
                    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Latest case</p>
                          <h2 className="mb-0 text-xl font-bold text-neutral-900">{latestCase.publicId}</h2>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-primary shadow-sm">
                          {humanStatus(latestCase.status)}
                        </span>
                      </div>
                      <p className="mb-4 text-sm leading-6 text-neutral-700">{latestCase.summary}</p>
                      <Link className="mb-4 inline-block font-semibold text-primary underline" to={`/dashboard/user/cases/${latestCase._id}`}>Open case workspace</Link>
                      <nav aria-label="My cases" className="mb-4 flex flex-wrap gap-3">{cases?.filter(item => item._id !== latestCase._id).map(item => <Link className="text-sm text-primary underline" key={item._id} to={`/dashboard/user/cases/${item._id}`}>{item.publicId}</Link>)}</nav>
                      <div className="grid gap-3 text-sm md:grid-cols-3">
                        <Info label="Priority" value={humanStatus(latestCase.priority)} />
                        <Info label="Updated" value={formatDate(latestCase.updatedAt)} />
                        <Info label="Documents" value={`${documents?.filter((doc) => doc.caseId === latestCase._id).length ?? 0}`} />
                      </div>
                    </div>
                  ) : latestRequest ? (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-blue-700">Latest request</p>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="mb-0 text-xl font-bold text-neutral-900">{latestRequest.publicId}</h2>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-blue-700 shadow-sm">
                          {humanStatus(latestRequest.status)}
                        </span>
                      </div>
                      <p className="mb-0 text-sm text-neutral-700">LSF will review the request and create a case when it is accepted for support.</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6">
                      <AlertCircle className="mb-3 h-6 w-6 text-primary" />
                      <h2 className="mb-2 text-lg font-bold text-neutral-900">No private case yet</h2>
                      <p className="mb-4 text-sm leading-6 text-neutral-600">
                        Start a legal-help request when you are ready. Your private records will appear here after sign-in.
                      </p>
                      <Link to="/legal-help">
                        <Button>
                          Start legal-help request
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-neutral-100 shadow-sm">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="text-base">Recent account activity</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-neutral-100 p-0">
                  {loadingPrivateData ? (
                    <p className="p-5 text-sm text-neutral-500">Loading activity...</p>
                  ) : recentItems.length ? (
                    recentItems.map((item) => (
                      <div key={item.key} className="flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="mb-1 font-bold text-neutral-900">{item.title}</p>
                          <p className="mb-0 text-sm text-neutral-500">{item.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold capitalize text-neutral-700">{humanStatus(item.status)}</span>
                          <span className="text-xs text-neutral-400">{formatDate(item.when)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-5 text-sm text-neutral-500">No case or request activity yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-primary/10 bg-white shadow-sm">
                <CardContent className="p-5">
                  <ShieldCheck className="mb-3 h-6 w-6 text-primary" />
                  <h3 className="mb-2 font-bold text-neutral-900">Privacy-first access</h3>
                  <p className="mb-0 text-sm leading-6 text-neutral-600">
                    This web dashboard reads only records linked to your account. Case details, documents, and appointment records stay scoped by Convex access rules.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-neutral-100 bg-white shadow-sm">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="text-base">Next actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                  <ActionLink to="/legal-help" icon={<Scale className="h-4 w-4" />} title="Request legal help" />
                  <ActionLink to="/sara" icon={<MessageCircle className="h-4 w-4" />} title="Ask Saada for guidance" />
                  <ActionLink to="/resources" icon={<BookOpen className="h-4 w-4" />} title="Read legal guides" />
                  <ActionLink to="/contact" icon={<MessageCircle className="h-4 w-4" />} title="Contact LSF" />
                </CardContent>
              </Card>

              <Card className="border-neutral-100 bg-white shadow-sm">
                <CardHeader className="border-b border-neutral-100">
                  <CardTitle className="text-base">Upcoming appointments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                  {loadingPrivateData ? (
                    <p className="text-sm text-neutral-500">Loading appointments...</p>
                  ) : upcomingAppointments.length ? (
                    upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment._id} className="rounded-xl border border-neutral-100 p-3">
                        <p className="mb-1 text-sm font-bold text-neutral-900">{formatDate(appointment.startsAt)}</p>
                        <p className="mb-0 text-xs capitalize text-neutral-500">
                          {appointment.mode.replaceAll("_", " ")} · {appointment.location ?? "Location to be confirmed"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">No upcoming appointments.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

function MetricCard({ title, value, description, icon }: { title: string; value: number; description: string; icon: React.ReactNode }) {
  return (
    <Card className="border-neutral-100 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
        <p className="mb-1 text-2xl font-bold text-neutral-900">{value.toLocaleString()}</p>
        <p className="mb-1 text-sm font-bold text-neutral-800">{title}</p>
        <p className="mb-0 text-xs text-neutral-500">{description}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mb-0 font-bold capitalize text-neutral-900">{value}</p>
    </div>
  );
}

function ActionLink({ to, icon, title }: { to: string; icon: React.ReactNode; title: string }) {
  return (
    <Link to={to} className="flex items-center justify-between rounded-xl border border-neutral-100 px-3 py-3 text-sm font-bold text-neutral-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
      <span className="flex items-center gap-2">{icon}{title}</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default UserDashboard;
