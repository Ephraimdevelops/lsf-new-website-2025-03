import { useLanguage } from '@/providers/LanguageProvider';
export function useDateFormat(){const {locale}=useLanguage();return (value:number|undefined)=>value?new Date(value).toLocaleString(locale==='sw'?'sw-TZ':'en-TZ',{timeZone:'Africa/Dar_es_Salaam',dateStyle:'medium',timeStyle:'short'}):(locale==='sw'?'Haijawekwa':'Not set');}
