import { plainError } from '../../shared/plainLanguage';
import { useLanguage } from '@/providers/LanguageProvider';
import { translateCopy } from './useCopy';
export function usePlainError() {
 const {locale}=useLanguage();
 return (error:unknown,fallback?:string)=>{
  const translated=fallback?translateCopy(fallback,locale):undefined;
  // Unknown English/vendor diagnostics must not leak through the Kiswahili UI.
  return plainError(error,locale,locale==='en'||translated!==fallback?translated:undefined);
 };
}
