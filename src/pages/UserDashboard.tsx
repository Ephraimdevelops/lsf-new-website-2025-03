import BrandLoading from '@/components/shared/BrandLoading';
import { useState } from "react";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import { WorkAction, WorkDashboard, WorkList, WorkPanel, WorkState } from "@/components/dashboard/WorkArea";
import { displayLabel } from "../../shared/plainLanguage";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { requestNextStep } from "../../mobile/src/requestProgress";
import type React from "react";
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import PersonalAvatar from '@/components/dashboard/PersonalAvatar';
import { useAuth } from "@clerk/clerk-react";
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
import { dashboardPath } from "@/components/auth/dashboardPath";
import { ProviderInviteInbox } from "@/components/auth/ProviderInvitations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatDate(value: number | undefined, locale: 'sw' | 'en') {
  if (!value) return locale === 'sw' ? 'Haijapangwa' : 'Not scheduled';
  return new Date(value).toLocaleDateString((locale === "sw" ? "sw-TZ" : "en-TZ"), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}



function latestTimestamp(record: { updatedAt?: number; createdAt?: number; submittedAt?: number }) {
  return record.updatedAt ?? record.submittedAt ?? record.createdAt ?? 0;
}

const UserDashboard = () => {
  const [activitySearch, setActivitySearch] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [activityLimit, setActivityLimit] = useState(8);
  const c = useCopy();
  const { locale } = useLanguage();
  const { greeting: greetingEn, greetingSw } = usePersonalGreeting();
  const greeting = locale === "sw" ? greetingSw : greetingEn;
  const { isSignedIn, isLoaded } = useAuth();
  const access = useQuery(api.users.currentAccess);
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn ? {} : "skip");
  const allCases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const appointments = useQuery(api.caseManagement.myAppointments, isSignedIn ? { context: "personal" } : "skip");
  const cases = access === undefined ? undefined : allCases?.filter(item => item.beneficiaryId === access.user._id);
  const documents = useQuery(api.caseManagement.myDocuments, isSignedIn ? { context: "personal" } : "skip");
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn ? {} : "skip");

  if (!isLoaded) {
    return <BrandLoading compact text={c("Verifying access...")}/>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const roles = access?.roles ?? [];
  const destination = dashboardPath(roles);
  if (access && !roles.some(role => ["paralegal", "provider_staff"].includes(role)) && destination !== "/dashboard/user") return <Navigate to={destination} replace />;

  const activeCases = cases?.filter((record) => !["closed", "closed_unresolved", "resolved"].includes(record.status)).length ?? 0;
  const submittedRequests = requests?.filter((record) => record.status !== "draft").length ?? 0;
  const upcomingAppointments = appointments?.filter((record) => record.status === "scheduled" && record.startsAt >= Date.now()) ?? [];
  const latestCase = cases?.filter(item => !["closed", "closed_unresolved", "resolved"].includes(item.status)).sort((a, b) => latestTimestamp(b) - latestTimestamp(a))[0] ?? cases?.[0];
  const openRequests = requests?.filter(record => ["submitted", "under_review", "waiting_for_information"].includes(record.status)).sort((a, b) => Number(b.status === "waiting_for_information") - Number(a.status === "waiting_for_information") || latestTimestamp(b) - latestTimestamp(a));
  const latestRequest = openRequests?.[0] ?? requests?.find(record => record.status !== "draft");
  const recentItems = [
    ...(cases ?? []).map((record) => ({
      key: `case-${record._id}`,
      title: record.publicId,
      subtitle: record.summary,
      status: record.status,
      when: latestTimestamp(record),
    })),
    ...(requests ?? []).filter((record) => record.status !== "draft").map((record) => ({
      key: `request-${record._id}`,
      title: record.publicId,
      subtitle: `${record.region ?? "Tanzania"}${record.district ? ` · ${record.district}` : ""}`,
      status: record.status,
      when: latestTimestamp(record),
    })),
  ].sort((a, b) => b.when - a.when);

  const loadingPrivateData = [requests, cases, appointments, documents].some((value) => value === undefined);

  const sw = locale === 'sw';
  const t = (swahili: string, english: string) => sw ? swahili : english;
  const visibleActivity = recentItems.filter(item => (activityType === 'all' || item.key.startsWith(activityType)) && `${item.title} ${item.subtitle} ${displayLabel(item.status,locale)}`.toLowerCase().includes(activitySearch.trim().toLowerCase()));
  const needsReply = openRequests?.find(item => item.status === 'waiting_for_information');
  const nextRequest = needsReply ?? (!latestCase ? latestRequest : undefined);
  return <Layout><main className="work-page"><ProviderInviteInbox hideWhenEmpty />
    <WorkDashboard eyebrow={greeting} title={c("My Haki Yangu workspace")} description={t('Fuatilia maombi yako na ujue hatua inayofuata.','Follow your requests and see what happens next.')} action={<WorkAction to={needsReply ? `/dashboard/user/requests/${needsReply._id}` : '/request-help'}>{needsReply ? c("Reply to LSF") : c("Request help")}</WorkAction>}
      metrics={[
        {label:c("Submitted requests"),value:requests===undefined?undefined:submittedRequests,icon:MessageCircle},
        {label:c("Active cases"),value:cases===undefined?undefined:activeCases,icon:Scale},
        {label:c("Upcoming appointments"),value:appointments===undefined?undefined:upcomingAppointments.length,icon:CalendarDays},
      ]}
      aside={<><WorkPanel title={c("Upcoming appointments")}><WorkList loading={appointments===undefined} emptyTitle={c("No upcoming appointments.")} items={upcomingAppointments.sort((a,b)=>a.startsAt-b.startsAt).slice(0,3).map(item=>({key:item._id,title:formatDate(item.startsAt,locale),description:`${displayLabel(item.mode,locale)} · ${item.location ?? c("Location to be confirmed")}`,href:`/dashboard/user/cases/${item.caseId}`,icon:CalendarDays}))}/></WorkPanel>
        <WorkPanel title={t('Njia za haraka','Quick actions')}><div className="work-quiet-links">{[['/find-help',c("Find nearby help")],['/dashboard/user/documents',c("My case documents")],['/dashboard/user/saved-help',c("Saved help and visit plans")],['/sara',c("Ask Haki Yangu AI for guidance")],['/know-your-rights',c("Know your rights")]].map(([href,label])=><Link key={href} to={href}>{label}<ArrowRight size={16}/></Link>)}</div></WorkPanel>
        <WorkPanel title={c("Your information, your choices")}><p className="work-note">{c("Your requests and case records stay linked to your account. Choose a safe way to receive updates in your notification settings.")}</p></WorkPanel></>}
    >
      <WorkPanel title={c("Current legal-help status")} description={needsReply ? t('LSF inasubiri jibu lako.','LSF is waiting for your reply.') : t('Fungua ombi au kesi ili kuona taarifa zake.','Open a request or case to see its details.')}>
        {loadingPrivateData ? <WorkState loading title={c("Loading your protected records...")}/> : nextRequest ? <WorkList items={[{key:nextRequest._id,title:nextRequest.publicId,description:requestNextStep(nextRequest.status,locale),status:displayLabel(nextRequest.status,locale),href:`/dashboard/user/requests/${nextRequest._id}`,action:needsReply?c("Reply to LSF"):c("View request progress"),attention:!!needsReply,icon:MessageCircle}]}/> : latestCase ? <><WorkList items={[{key:latestCase._id,title:latestCase.publicId,description:latestCase.summary,status:displayLabel(latestCase.status,locale),meta:`${c("Updated")} · ${formatDate(latestCase.updatedAt,locale)}`,href:`/dashboard/user/cases/${latestCase._id}`,action:c("Open case workspace"),icon:Scale}]}/><div className="work-case-facts"><span>{c("Priority")}<strong>{displayLabel(latestCase.priority,locale)}</strong></span><span>{c("Documents")}<strong>{documents?.filter(doc=>doc.caseId===latestCase._id).length??0}</strong></span></div></> : <WorkState title={c("No private case yet")} description={c("Start a legal-help request when you are ready. Your private records will appear here after sign-in.")} action={<WorkAction to="/request-help">{c("Start legal-help request")}</WorkAction>}/>}</WorkPanel>
      <WorkPanel title={t('Maombi na kesi zangu','My requests and cases')} description={t('Taarifa zilizobadilika karibuni zinaonekana kwanza.','Recently updated records appear first.')}><div className="work-list-controls"><div className="work-tabs" role="group" aria-label={t('Aina ya taarifa','Record type')}>{[['all',t('Zote','All')],['request',t('Maombi','Requests')],['case',t('Kesi','Cases')]].map(([value,label])=><button key={value} onClick={()=>{setActivityType(value);setActivityLimit(8);}} aria-current={activityType===value?'page':undefined}>{label}</button>)}</div><SearchFilterBar value={activitySearch} onChange={value=>{setActivitySearch(value);setActivityLimit(8);}} placeholder={t('Tafuta ombi au kesi','Find a request or case')}/></div><WorkList loading={loadingPrivateData} emptyTitle={c("No case or request activity yet.")} items={visibleActivity.slice(0,activityLimit).map(item=>({key:item.key,title:item.title,description:item.subtitle,status:displayLabel(item.status,locale),meta:formatDate(item.when,locale),href:item.key.startsWith('request-')?`/dashboard/user/requests/${item.key.slice(8)}`:`/dashboard/user/cases/${item.key.slice(5)}`,icon:item.key.startsWith('request-')?MessageCircle:Scale}))}/>{visibleActivity.length>activityLimit&&<div className="work-list-more"><button className="work-action is-secondary" onClick={()=>setActivityLimit(limit=>limit+8)}>{t('Onyesha zaidi','Show more')}</button></div>}</WorkPanel>
    </WorkDashboard>
  </main></Layout>;
};

export default UserDashboard;
