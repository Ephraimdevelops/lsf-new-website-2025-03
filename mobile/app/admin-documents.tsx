import { LoadingText } from '../src/components/BrandLoading';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { api } from '../src/backend/api';
import { AdminScreen } from '../src/admin/AdminScreen';
import { AdminIntro } from '../src/admin/AdminIntro';
import { Row } from '../src/admin/AdminHome';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { SearchFilters } from '../src/components/SearchFilters';
import { useLanguage } from '../src/i18n';
import { colors, type } from '../src/theme';
import { useSensitiveScreenProtection } from '../src/useSensitiveScreenProtection';
export default function AdminDocuments() {
  useSensitiveScreenProtection('admin-documents');
  const access = useQuery(api.users.currentAccess); const allowed = access?.roles.some(role => ['admin', 'staff', 'supervisor'].includes(role));
  const { locale } = useLanguage(); const sw = locale === 'sw'; const [search, setSearch] = useState('');
  const rows = useQuery(api.caseManagement.staffDocumentQueue, allowed ? { status: 'pending_review' } : 'skip');
  const visible = rows?.filter(item => [item.document.name, item.case?.publicId, item.case?.summary].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  const text = { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted };
  return <AdminScreen><CivicPageHeader back compact title={sw ? 'Nyaraka za kukagua' : 'Documents to review'} />{allowed ? <>
    <AdminIntro icon="document-text-outline" eyebrow="LSF" title={sw ? 'Kagua nyaraka' : 'Review documents'} description={sw ? 'Fungua kesi, soma nyaraka na andika uamuzi wako.' : 'Open the case, read the file and record your decision.'} />
    <SearchFilters sw={sw} value={search} onChange={setSearch} placeholder={sw ? 'Tafuta nyaraka au kesi' : 'Find a document or case'} />
    <LoadingText style={text}>{rows === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? `${visible?.length} zimeonyeshwa; hadi nyaraka 100 mpya zinazohitaji ukaguzi.` : `${visible?.length} shown; latest 100 awaiting review.`)}</LoadingText>
    {visible?.map(item => <Row key={item.document._id} title={item.document.name} body={item.case?.publicId ?? (sw ? 'Kesi haipatikani' : 'Case unavailable')} icon="document-text-outline" onPress={() => router.push({ pathname: '/case/[id]', params: { id: item.document.caseId, section: 'documents' } })} />)}{visible?.length === 0 && <Text style={text}>{sw ? 'Hakuna nyaraka zinazolingana.' : 'No matching documents.'}</Text>}
  </> : <LoadingText style={text}>{access === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Ruhusa ya LSF inahitajika.' : 'LSF access is required.')}</LoadingText>}</AdminScreen>;
}
