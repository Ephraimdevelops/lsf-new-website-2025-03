import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
const links = [
 {route:'/workspace',en:'Today',sw:'Leo',icon:'home-outline'},
 {route:'/supervision',en:'Reviews',sw:'Mapitio',icon:'shield-checkmark-outline'},
 {route:'/operations',en:'Cases',sw:'Kesi',icon:'folder-open-outline'},
 {route:'/supervisor-tools',en:'Tools',sw:'Zana',icon:'grid-outline'},
 {route:'/supervisor-profile',en:'Account',sw:'Akaunti',icon:'person-outline'},
] as const;
export function SupervisorNavigation(){const path=usePathname();const active=path==='/workspace'?'/workspace':/^\/(supervision|safeguarding-review)/.test(path)?'/supervision':/^\/(operations|case\/|case-matching|closure-review)/.test(path)?'/operations':path==='/supervisor-profile'?'/supervisor-profile':'/supervisor-tools';const sw=useLanguage().locale==='sw';return <View style={styles.nav}>{links.map(link=><Pressable key={link.route} accessibilityRole="button" accessibilityLabel={sw?link.sw:link.en} accessibilityState={{selected:active===link.route}} style={styles.item} onPress={()=>router.replace(link.route as Href)}><Ionicons name={link.icon} size={22} color={active===link.route?colors.burgundy:colors.inkMuted}/><Text style={[styles.label,active===link.route&&styles.active]}>{sw?link.sw:link.en}</Text></Pressable>)}</View>}
const styles=StyleSheet.create({nav:{flexDirection:'row'},item:{flex:1,minHeight:56,alignItems:'center',justifyContent:'center',gap:4},label:{fontFamily:type.medium,fontSize:11,color:colors.inkMuted},active:{fontFamily:type.semibold,color:colors.burgundy}});
