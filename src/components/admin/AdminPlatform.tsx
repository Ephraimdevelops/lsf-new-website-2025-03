import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import { useLanguage } from '@/providers/LanguageProvider';
import AdminOverview from './AdminOverview';

export default function AdminPlatform(_props: { openTab: (tab: string) => void; navigate: (path: string) => void }) {
  const { greeting, greetingSw } = usePersonalGreeting();
  const { locale } = useLanguage();
  const requests = useQuery(api.legalHelp.staffQueue, {});
  const accessRequests = usePaginatedQuery(api.accessRequests.adminQueuePage, {}, { initialNumItems: 5 });
  const support = useQuery(api.paralegals.staffSupportQueue, { status: 'submitted' });
  const reviews = useQuery(api.caseManagement.staffReviewRequests, { status: 'submitted' });
  const documents = useQuery(api.caseManagement.staffDocumentQueue, { status: 'pending_review' });
  const applications = usePaginatedQuery(api.formSubmissions.paralegalReviewQueuePage, { status: 'pending' }, { initialNumItems: 3 });
  const capped = (rows: unknown[] | undefined) => rows === undefined ? undefined : `${rows.length}${rows.length === 100 ? '+' : ''}`;
  return <AdminOverview greeting={locale === 'sw' ? greetingSw : greeting} data={{
    requests: requests?.length,
    access: accessRequests.status === 'LoadingFirstPage' ? undefined : `${accessRequests.results.length}${accessRequests.status === 'CanLoadMore' ? '+' : ''}`,
    support: capped(support), reviews: capped(reviews), documents: capped(documents),
    applications: applications.status === 'LoadingFirstPage' ? undefined : `${applications.results.length}${applications.status === 'CanLoadMore' ? '+' : ''}`,
    people: accessRequests.status === 'LoadingFirstPage' ? undefined : accessRequests.results.map(item => ({id:item._id,name:item.applicant?.name ?? (locale === 'sw' ? 'Anayeomba kujiunga' : 'Applicant'),role:item.requestedRole,organisation:item.organizationName})),
  }} />;
}
