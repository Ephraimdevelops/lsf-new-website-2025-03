import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
const links = [
 {route:'/workspace',en:'Today',sw:'Leo',icon:'home-outline'},
 {route:'/operations',en:'Requests',sw:'Maombi',icon:'document-text-outline'},
 {route:'/supervision?view=cases',en:'Cases',sw:'Kesi',icon:'folder-open-outline'},
 {route:'/staff-tools',en:'Tools',sw:'Zana',icon:'grid-outline'},
 {route:'/staff-profile',en:'Account',sw:'Akaunti',icon:'person-outline'},
] as const;
export function StaffNavigation(){const path=usePathname();const active=path==='/workspace'?'/workspace':/^\/(operations|operations-request)/.test(path)?'/operations':/^\/(case\/|supervision|case-matching|closure-review)/.test(path)?'/supervision?view=cases':path==='/staff-profile'?'/staff-profile':'/staff-tools';const sw=useLanguage().locale==='sw';return <View style={styles.nav}>{links.map(link=><Pressable key={link.route} accessibilityRole="button" accessibilityLabel={sw?link.sw:link.en} accessibilityState={{selected:active===link.route}} style={styles.item} onPress={()=>router.replace(link.route as Href)}><Ionicons name={link.icon} size={22} color={active===link.route?colors.burgundy:colors.inkMuted}/><Text style={[styles.label,active===link.route&&styles.active]}>{sw?link.sw:link.en}</Text></Pressable>)}</View>}
const styles=StyleSheet.create({nav:{flexDirection:'row'},item:{flex:1,minHeight:56,alignItems:'center',justifyContent:'center',gap:4},label:{fontFamily:type.medium,fontSize:11,color:colors.inkMuted},active:{fontFamily:type.semibold,color:colors.burgundy}});
