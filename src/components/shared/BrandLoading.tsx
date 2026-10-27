import { createElement, type HTMLAttributes, type ReactNode, type CSSProperties, useEffect, useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { getLoadingCopy, isLoadingLabel, loadingLabel, loadingTaskForText, type LoadingTask } from '../../../shared/loadingCopy';
import './brand-loading.css';

export function BrandLoadingMark({ small = false }: { small?: boolean }) {
 return <span className={`brand-loading-mark${small ? ' is-small' : ''}`} aria-hidden="true"><span className="brand-loading-orbit"/><span className="brand-loading-seed"/><span className="brand-loading-logo"><img src="/lsf-logo.png" alt="" width="90" height="48"/></span></span>;
}
export default function BrandLoading({ task, text, detail, fullScreen = false, compact = false, className = '' }: { task?: LoadingTask; text?: string; detail?: string; fullScreen?: boolean; compact?: boolean; className?: string }) {
 const { locale } = useLanguage();
 const currentTask = task ?? loadingTaskForText(text ?? '');
 const copy = getLoadingCopy(currentTask, locale);
 const [slow, setSlow] = useState(false);
 useEffect(() => { setSlow(false); const timer = window.setTimeout(() => setSlow(true), 12000); return () => window.clearTimeout(timer); }, [task, text]);
 return <div className={`brand-loading${fullScreen ? ' is-screen' : ''}${compact ? ' is-compact' : ''} ${className}`} role="status" aria-live="polite" aria-atomic="true"><div className="brand-loading-content"><BrandLoadingMark small={compact}/><div className="brand-loading-copy">{fullScreen && <span className="brand-loading-name">HAKI YANGU</span>}<p className="brand-loading-title">{loadingLabel(text, currentTask, locale)}</p>{(!compact || detail) && <p className="brand-loading-detail">{detail ?? copy.detail}</p>}{slow && <p className="brand-loading-slow">{locale === 'sw' ? 'Inachukua muda kuliko kawaida. Angalia muunganisho wako wa intaneti.' : 'This is taking longer than usual. Check your internet connection.'}</p>}</div><span className="brand-loading-dots" aria-hidden="true"><i/><i/><i/></span></div></div>;
}

export function BrandLoadingIcon({className='',size=20}: {className?:string;size?:number|string}) {return <span className={`brand-loading-action ${className}`} style={{'--loading-icon-size':typeof size==='number'?`${size}px`:size} as CSSProperties} aria-hidden="true"><span/></span>;}

export function LoadingText({as='p',children,...props}: HTMLAttributes<HTMLElement> & {as?:'p'|'div'|'span';children?:ReactNode}) { return isLoadingLabel(children) ? <BrandLoading compact text={children} className={props.className}/> : createElement(as,props,children); }
