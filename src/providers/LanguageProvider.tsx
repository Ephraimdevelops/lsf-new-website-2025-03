import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Locale } from '../../shared/plainLanguage';
export const LANGUAGE_KEY = 'haki-yangu:locale';
const LanguageContext = createContext<{locale:Locale;setLocale:(locale:Locale)=>void}>({locale:'sw',setLocale:()=>{}});
function initialLocale():Locale { try { return localStorage.getItem(LANGUAGE_KEY)==='en'?'en':'sw'; } catch { return 'sw'; } }
export function LanguageProvider({children}:{children:ReactNode}) {
 const [locale,setLocaleState]=useState<Locale>(initialLocale);
 function setLocale(next:Locale){setLocaleState(next);try{localStorage.setItem(LANGUAGE_KEY,next);}catch{/* Language still works when storage is unavailable. */}}
 useEffect(()=>{ document.documentElement.lang=locale; },[locale]);
 useEffect(()=>{const onStorage=(event:StorageEvent)=>{if(event.key===LANGUAGE_KEY)setLocaleState(event.newValue==='en'?'en':'sw');};window.addEventListener('storage',onStorage);return()=>window.removeEventListener('storage',onStorage);},[]);
 return <LanguageContext.Provider value={{locale,setLocale}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){return useContext(LanguageContext);}
export function LanguageSwitch(){const {locale,setLocale}=useLanguage();return <div role="group" aria-label={locale==='sw'?'Chagua lugha':'Choose language'} className="inline-flex shrink-0 rounded-xl border bg-white p-1 text-sm">{(['sw','en'] as const).map(value=><button key={value} type="button" lang={value} aria-pressed={locale===value} onClick={()=>setLocale(value)} className={`min-h-11 rounded-lg px-2 sm:px-3 font-semibold ${locale===value?'bg-primary text-white':'text-primary'}`}>{value==='sw'?'Kiswahili':'English'}</button>)}</div>;}
