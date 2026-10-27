import { useEffect } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useLanguage } from '@/providers/LanguageProvider';
export function LanguagePreferenceSync() {
 const {locale}=useLanguage();const {isAuthenticated}=useConvexAuth();
 const access=useQuery(api.users.currentAccess,isAuthenticated?{}:'skip');
 const save=useMutation(api.notifications.setLanguage);
 useEffect(()=>{if(!access?.user._id)return;let cancelled=false;let timer:ReturnType<typeof setTimeout>|undefined;
 const sync=async()=>{try{await save({locale});}catch{if(!cancelled)timer=setTimeout(()=>void sync(),15000);}};
 void sync();return()=>{cancelled=true;if(timer)clearTimeout(timer);};},[access?.user._id,locale,save]);
 return null;
}
