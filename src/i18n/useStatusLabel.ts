import { displayLabel } from '../../shared/plainLanguage';
import { useLanguage } from '@/providers/LanguageProvider';
export function useStatusLabel(){const {locale}=useLanguage();return (value:string|undefined)=>displayLabel(value,locale);}
