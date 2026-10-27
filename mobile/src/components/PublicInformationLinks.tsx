import { BrandLoading } from './BrandLoading';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { Link, type Href } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '../backend/api';
import { useLanguage } from '../i18n';
import { colors, radius, spacing, type } from '../theme';
import { ProviderThumbnail } from './ProviderThumbnail';

export function PublicInformationLinks({ issue }: { issue?: string }) {
  const { locale } = useLanguage();
  const sw = locale === 'sw';
  const [error, setError] = useState<{ id: string; url: string } | null>(null);
  const resources = useQuery(api.justiceServices.listPublicInformationResources, {
    issueCategory: issue?.trim() || undefined,
  });

  async function openResource(id: string, url: string) {
    setError(null);
    try {
      await Linking.openURL(url);
    } catch {
      setError({ id, url });
    }
  }

  return <View style={styles.section}>
    <View style={styles.headingRow}><View style={styles.icon}><Ionicons name="globe-outline" size={23} color={colors.teal} /></View><Text accessibilityRole="header" style={styles.heading}>{sw ? 'Tovuti rasmi za taarifa na mawasiliano' : 'Official information and contact websites'}</Text></View>
    <Text style={styles.body}>{sw ? 'Viungo hivi vya nje ni tofauti na huduma zilizothibitishwa na LSF. Thibitisha vigezo, eneo na upatikanaji wa msaada moja kwa moja. Kufungua tovuti hakutumi ombi lako la Haki Yangu.' : 'These external links are separate from LSF-verified services. Confirm eligibility, location and available support directly. Opening a website does not send your Haki Yangu request.'}</Text>
    {resources === undefined ? <BrandLoading compact text={sw ? 'Inapakia tovuti rasmi…' : 'Loading official websites…'}/> : resources.map((resource) => <View key={resource.id} style={styles.card}>
      <View style={styles.cardHeader}><ProviderThumbnail kind={resource.category === 'government' || resource.category === 'registry' ? 'government_office' : 'legal_aid_provider'} name={resource.name} size={64} /><View style={{ flex: 1, gap: 4 }}><Text style={styles.category}>{resource.category === 'government' ? (sw ? 'TAARIFA ZA SERIKALI' : 'GOVERNMENT INFORMATION') : resource.category === 'registry' ? (sw ? 'USAJILI WA WATOA MSAADA' : 'PROVIDER REGISTER') : (sw ? 'TAARIFA ZA MSAADA WA KISHERIA' : 'LEGAL-AID INFORMATION')}</Text><Text style={styles.name}>{resource.name}</Text><Text style={styles.title}>{sw ? resource.titleSw : resource.titleEn}</Text></View></View>
      <Text style={styles.body}>{sw ? resource.descriptionSw : resource.descriptionEn}</Text>
      <Link href={resource.url as Href} target="_blank" rel="noopener noreferrer" asChild onPress={(event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          void openResource(resource.id, resource.url);
        }
      }}><Pressable accessibilityRole="link" accessibilityLabel={`${resource.name}: ${sw ? 'Fungua tovuti rasmi' : 'Open official website'}`} style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}>
        <Text style={styles.linkText}>{sw ? 'Fungua tovuti rasmi' : 'Open official website'}</Text><Ionicons name="arrow-forward" size={18} color={colors.teal} />
      </Pressable></Link>
      {error?.id === resource.id && <View><Text accessibilityRole="alert" style={styles.error}>{sw ? 'Tovuti haijafunguka. Jaribu tena au nakili kiungo hiki kwenye kivinjari.' : 'The website could not open. Try again or copy this link into your browser.'}</Text><Text selectable style={styles.url}>{error.url}</Text></View>}
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl, gap: spacing.md },
  headingRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  heading: { flex: 1, fontFamily: type.bold, color: colors.ink, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  card: { borderRadius: 8, padding: 16, gap: 12, backgroundColor: '#F3F5F4' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  category: { fontFamily: type.medium, color: colors.teal, fontSize: 11, lineHeight: 17, letterSpacing: 0 },
  name: { fontFamily: type.semibold, color: colors.ink, fontSize: 18, lineHeight: 25 },
  title: { fontFamily: type.medium, color: colors.ink, fontSize: 13, lineHeight: 19 },
  link: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.xs },
  linkText: { fontFamily: type.bold, color: colors.teal, fontSize: 14 },
  error: { fontFamily: type.regular, color: colors.burgundy, fontSize: 13, lineHeight: 20 },
  url: { fontFamily: type.regular, color: colors.teal, fontSize: 12, lineHeight: 18, marginTop: spacing.xs },
});
