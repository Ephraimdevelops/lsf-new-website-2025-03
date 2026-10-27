import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useState, type ReactNode } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function SearchFilterBar({ value, onChange, placeholder, children, label = 'Choose', title = 'Choose what you need', count = 0, summary, onReset, onSubmit, actionLabel = 'Search', sw: explicitSw, showFilters = true }: {
  value: string; onChange: (value: string) => void; placeholder: string; children?: ReactNode;
  label?: string; title?: string; count?: number; summary?: string; onReset?: () => void;
  onSubmit?: () => void; actionLabel?: string; sw?: boolean; showFilters?: boolean;
}) {
  const { locale } = useLanguage();
  const c = useCopy();
  const sw = explicitSw ?? locale === "sw";
  const [open, setOpen] = useState(false);
  return <div className="work-filter-bar">
    <form role="search" onSubmit={event => { event.preventDefault(); onSubmit?.(); }} className="flex min-h-14 items-center gap-1 rounded-2xl border border-[#E8E2E5] bg-white p-1 pl-3 text-[#191719] shadow-sm focus-within:border-primary">
      {value ? <button type="button" aria-label={sw ? 'Futa utafutaji' : 'Clear search'} onClick={() => onChange('')} className="flex min-h-12 w-8 shrink-0 items-center justify-center rounded-xl hover:bg-[#F8EAF0] focus-visible:outline-primary"><X className="h-4 w-4" /></button> : <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#238C8C]" />}
      <input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} className="min-h-12 min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-[#686168] [&::-webkit-search-cancel-button]:appearance-none" />
      {showFilters && children && <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><button type="button" aria-label={title} className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#F8EAF0] px-3 text-sm font-semibold text-primary hover:bg-[#F3E6EF] focus-visible:outline-primary"><SlidersHorizontal aria-hidden="true" className="h-4 w-4" /><span>{label}{count > 0 ? ` · ${count}` : ''}</span></button></PopoverTrigger><PopoverContent align="end" className="max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border-[#E8E2E5] p-5"><h2 className="mb-4 text-lg font-bold">{title}</h2><div className="space-y-4">{children}</div><div className="mt-5 flex items-center justify-between gap-2">{onReset && <button type="button" className="min-h-12 px-2 text-sm font-semibold text-primary underline" onClick={onReset}>{sw ? 'Futa machaguo' : 'Clear choices'}</button>}<button type="button" className="ml-auto min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-white" onClick={() => setOpen(false)}>{sw ? 'Onyesha matokeo' : 'Show results'}</button></div></PopoverContent></Popover>}
      {onSubmit && <button type="submit" aria-label={c(actionLabel)} className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-xl bg-primary px-3 text-sm font-semibold text-white hover:bg-primary/90"><Search aria-hidden="true" className="h-4 w-4 sm:hidden" /><span className="hidden sm:inline">{c(actionLabel)}</span></button>}
    </form>
    {!!summary && <p className="mt-2 text-sm text-[#686168]">{summary}</p>}
  </div>;
}
