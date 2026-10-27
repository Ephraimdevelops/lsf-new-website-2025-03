import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
import { useWorkMode } from '../work/WorkMode';
const links = [
  { key: 'home', route: '/workspace', icon: 'home-outline', en: 'Today', sw: 'Leo' },
  { key: 'cases', route: '/paralegal-assignments?view=active', icon: 'folder-open-outline', en: 'Cases', sw: 'Kesi' },
  { key: 'referrals', route: '/provider-referrals', icon: 'paper-plane-outline', en: 'Referrals', sw: 'Rufaa' },
  { key: 'tools', route: '/provider-tools', icon: 'grid-outline', en: 'Tools', sw: 'Zana' },
  { key: 'profile', route: '/my-organisation', icon: 'business-outline', en: 'Our service', sw: 'Huduma yetu' },
] as const;
export function ProviderNavigation({ current }: { current?: string }) {
  const { locale } = useLanguage(); const { setMode } = useWorkMode();
  return <View style={styles.nav}>{links.map(link => <Pressable key={link.key} accessibilityRole="button" accessibilityLabel={locale === 'sw' ? link.sw : link.en} accessibilityState={{ selected: link.key === current }} style={styles.item} onPress={() => { setMode('work'); router.replace(link.route as Href); }}><Ionicons name={link.icon} size={22} color={current === link.key ? colors.burgundy : colors.inkMuted} /><Text style={[styles.label, current === link.key && styles.active]}>{locale === 'sw' ? link.sw : link.en}</Text></Pressable>)}</View>;
}
const styles = StyleSheet.create({ nav: { flexDirection: 'row', paddingBottom: 4 }, item: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 4 }, label: { fontFamily: type.medium, fontSize: 10, color: colors.inkMuted }, active: { fontFamily: type.semibold, color: colors.burgundy } });
