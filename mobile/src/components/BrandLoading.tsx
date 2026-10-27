import { useLoadingLocale } from '../i18n';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, Text, type TextProps, View } from 'react-native';
import { getLoadingCopy, isLoadingLabel, loadingLabel, loadingTaskForText, type LoadingTask } from '../../../shared/loadingCopy';

export function BrandLoadingMark({ small = false, light = false }: {small?:boolean;light?:boolean}) {
 const turn = useRef(new Animated.Value(0)).current;
 useEffect(() => {
  let active = true;
  let animation: Animated.CompositeAnimation | undefined;
  const update = (reduced: boolean) => {
   animation?.stop(); turn.setValue(0);
   if (!reduced && active) { animation = Animated.loop(Animated.timing(turn,{toValue:1,duration:2800,easing:Easing.linear,useNativeDriver:true,isInteraction:false})); animation.start(); }
  };
  void AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(active)update(value);}).catch(()=>{});
  const listener = AccessibilityInfo.addEventListener('reduceMotionChanged',update);
  return () => {active=false;animation?.stop();listener.remove();};
 }, [turn]);
 const diameter=small?32:136;
 return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.mark,{width:diameter,height:diameter},small&&styles.smallMark]}><Animated.View style={[styles.orbit,light&&{borderTopColor:'#fff'}, {transform:[{rotate:turn.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']})}]}]}/><View style={[styles.seed,small&&{inset:5,borderWidth:3}]}/>{!small&&<View style={styles.logoDisc}><Image source={require('../../assets/lsf-official.png')} resizeMode="contain" style={styles.logo}/></View>}</View>;
}
export function BrandLoading({ task, text, detail, locale: preferredLocale, fullScreen=false, compact=false }: {task?:LoadingTask;text?:string;detail?:string;locale?:'sw'|'en';fullScreen?:boolean;compact?:boolean}) {
 const savedLocale=useLoadingLocale();
 const locale=preferredLocale??savedLocale;
 const currentTask=task??loadingTaskForText(text??'');
 const copy=getLoadingCopy(currentTask,locale);
 const [slow,setSlow]=useState(false);
 useEffect(()=>{setSlow(false);const timer=setTimeout(()=>setSlow(true),12000);return()=>clearTimeout(timer);},[task,text]);
 return <View accessibilityRole="progressbar" accessibilityLiveRegion="polite" accessibilityValue={{text:loadingLabel(text,currentTask,locale)}} style={[styles.container,fullScreen&&styles.screen,compact&&styles.compact]}><BrandLoadingMark small={compact}/><View style={[styles.copy,compact&&styles.compactCopy]}>{fullScreen&&<Text style={styles.brand}>HAKI YANGU</Text>}<Text style={[styles.title,compact&&styles.compactTitle]}>{loadingLabel(text,currentTask,locale)}</Text>{(!compact||detail)&&<Text style={styles.detail}>{detail??copy.detail}</Text>}{slow&&<Text style={styles.slow}>{locale==='sw'?'Inachukua muda kuliko kawaida. Angalia muunganisho wako wa intaneti.':'This is taking longer than usual. Check your internet connection.'}</Text>}</View>{!compact&&<View accessible={false} style={styles.dots}>{['#883559','#a5b876','#d3a2b8'].map(color=><View key={color} style={[styles.dot,{backgroundColor:color}]}/>)}</View>}</View>;
}
const styles=StyleSheet.create({
 container:{alignItems:'center',justifyContent:'center',padding:28,gap:22,minHeight:190},screen:{flex:1,backgroundColor:'#fbfaf8',padding:28},compact:{flexDirection:'row',justifyContent:'flex-start',minHeight:80,padding:16,gap:14},copy:{gap:10,maxWidth:390,alignItems:'center'},compactCopy:{flex:1,alignItems:'flex-start',gap:5},brand:{color:'#887c83',fontSize:11,letterSpacing:2,fontWeight:'700'},title:{color:'#2b2638',fontSize:21,fontWeight:'700',textAlign:'center'},compactTitle:{fontSize:14,textAlign:'left'},detail:{fontSize:14,lineHeight:22,color:'#6d6370',textAlign:'center'},slow:{color:'#883559',fontSize:13,lineHeight:20,textAlign:'center'},mark:{alignItems:'center',justifyContent:'center',backgroundColor:'#f3f1ed',borderRadius:80},smallMark:{backgroundColor:'transparent'},orbit:{position:'absolute',inset:0,borderRadius:80,borderWidth:2,borderColor:'#e9dfdf',borderTopWidth:3,borderTopColor:'#883559',borderRightColor:'transparent'},seed:{position:'absolute',inset:12,borderRadius:80,borderWidth:8,borderColor:'#e4edcc'},logoDisc:{width:102,height:102,borderRadius:60,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#eee6e8'},logo:{width:80,height:48},dots:{flexDirection:'row',gap:7},dot:{width:6,height:6,borderRadius:3}
});

export function LoadingText({children,...props}: TextProps) { return isLoadingLabel(children) ? <BrandLoading compact text={children}/> : <Text {...props}>{children}</Text>; }
