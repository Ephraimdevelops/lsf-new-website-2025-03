import { useLanguage } from '@/providers/LanguageProvider';
import catalogue from './uiCopy.json';
import english from './uiEnglish.json';
export function translateCopy(text: string, locale: 'sw' | 'en') {
 if (locale === 'en') { const replacement = Object.prototype.hasOwnProperty.call(english, text.trim()) ? (english as Record<string,string>)[text.trim()] : undefined; return replacement ? text.replace(text.trim(), replacement) : text; }
 const key = text.trim();
 const translated = Object.prototype.hasOwnProperty.call(catalogue, key) ? (catalogue as Record<string,string>)[key] : undefined;
 return translated ? text.replace(key, translated) : text;
}
export function useCopy() { const { locale } = useLanguage(); return (text: string) => translateCopy(text, locale); }
