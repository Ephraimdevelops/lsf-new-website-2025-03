import { LoadingText } from '../src/components/BrandLoading';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BrandLoading } from '../src/components/BrandLoading';
import { useLanguage } from '../src/i18n';
import { loadingCopy, type LoadingTask } from '../../shared/loadingCopy';

export default function LoadingPreview() {
 const { locale, setLocale } = useLanguage();
 const [task,setTask]=useState<LoadingTask>('account');
 const [compact,setCompact]=useState(false);
 if(!__DEV__) return <Redirect href="/"/>;
 const tasks=Object.keys(loadingCopy) as LoadingTask[];
 return <View style={{flex:1,backgroundColor:'#fbfaf8'}}><View style={{padding:24,paddingTop:48,gap:14}}><LoadingText style={{color:'#6d6370',fontSize:12}}>{locale==='sw'?'Mfano wa kusubiri':'Loading preview'}</LoadingText><View style={{flexDirection:'row',flexWrap:'wrap',gap:16}}><Pressable accessibilityRole="button" onPress={()=>setTask(tasks[(tasks.indexOf(task)+1)%tasks.length])}><Text style={{color:'#883559'}}>↻ {task}</Text></Pressable><Pressable accessibilityRole="button" onPress={()=>setCompact(!compact)}><Text style={{color:'#883559'}}>{compact?'Full screen':'Compact'}</Text></Pressable><Pressable accessibilityRole="button" onPress={()=>void setLocale(locale==='sw'?'en':'sw')}><Text style={{color:'#883559'}}>{locale==='sw'?'English':'Kiswahili'}</Text></Pressable></View></View><BrandLoading task={task} compact={compact} fullScreen={!compact}/></View>;
}
