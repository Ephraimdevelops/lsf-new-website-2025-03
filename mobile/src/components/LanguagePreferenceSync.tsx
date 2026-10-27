import { useEffect } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../backend/api';
import { useLanguage } from '../i18n';
export function LanguagePreferenceSync() {
 const {locale,hydrated}=useLanguage();const {isAuthenticated}=useConvexAuth();
 const access=useQuery(api.users.currentAccess,isAuthenticated?{}:'skip');
 const save=useMutation(api.notifications.setLanguage);
 useEffect(()=>{if(!hydrated||!access?.user._id)return;let cancelled=false;let timer:ReturnType<typeof setTimeout>|undefined;
 const sync=async()=>{try{await save({locale});}catch{if(!cancelled)timer=setTimeout(()=>void sync(),15000);}};
 void sync();return()=>{cancelled=true;if(timer)clearTimeout(timer);};},[access?.user._id,hydrated,locale,save]);
 return null;
}
