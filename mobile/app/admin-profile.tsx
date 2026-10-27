import { LoadingText } from '../src/components/BrandLoading';
import { displayLabel } from "../../shared/plainLanguage";
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { api } from '../src/backend/api';
import { AdminScreen } from '../src/admin/AdminScreen';
import { PersonalIntro } from '../src/components/PersonalIntro';
import { LogOutButton } from '../src/components/LogOutButton';
import { Row } from '../src/admin/AdminHome';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { useLanguage } from '../src/i18n';
import { colors, type } from '../src/theme';
export function WorkAccount({ supervisor = false, staff = false, safeguarding = false, editor = false, stakeholder = false }: { supervisor?: boolean; staff?: boolean; safeguarding?: boolean; editor?: boolean; stakeholder?: boolean }) {
  const access = useQuery(api.users.currentAccess); const { locale } = useLanguage(); const sw = locale === 'sw';
  return <AdminScreen><CivicPageHeader back compact title={sw ? 'Akaunti ya kazi' : 'Work account'} />{access?.roles.some(role => role === 'admin' || supervisor && role === 'supervisor' || staff && role === 'staff' || safeguarding && role === 'safeguarding_officer' || editor && role === 'content_editor' || stakeholder && ['donor','stakeholder'].includes(role)) ? <>
    <PersonalIntro profile body={sw ? 'Dhibiti akaunti, arifa na faragha yako.' : 'Manage your account, notifications and privacy.'} />
    <LogOutButton />
    <Text style={styles.text}>{access.user.email}</Text><Text style={styles.text}>{access.roles.map(role => displayLabel(role, sw ? 'sw' : 'en')).join(' · ')}</Text>
    <Row title={sw ? 'Wasifu na mipangilio' : 'Profile and settings'} body={sw ? 'Lugha, akaunti na kutoka' : 'Language, account and sign out'} icon="person-outline" onPress={() => router.push('/(tabs)/profile')} />
    <Row title={sw ? 'Mipangilio ya arifa' : 'Notification settings'} body={sw ? 'Chagua taarifa utakazopokea' : 'Choose the updates you receive'} icon="notifications-outline" onPress={() => router.push('/notification-settings')} />
    <Row title={sw ? 'Faragha na usalama' : 'Privacy and security'} body={sw ? 'Ulinzi wa akaunti yako' : 'Your account protection'} icon="lock-closed-outline" onPress={() => router.push('/privacy-security')} />
    {!staff && !safeguarding && !editor && !stakeholder && <Row title={sw ? 'Historia ya maamuzi' : 'Decision history'} body={sw ? 'Nani alibadili nini na lini' : 'Who changed what and when'} icon="time-outline" onPress={() => router.push('/audit-log')} />}
  </> : <LoadingText style={styles.text}>{access === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Ruhusa ya kazi inahitajika.' : 'Work approval is required.')}</LoadingText>}</AdminScreen>;
}
const styles = StyleSheet.create({ text: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted, marginBottom: 8 } });

export default function AdminProfile() { return <WorkAccount />; }
