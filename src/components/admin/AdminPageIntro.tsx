import { useCopy } from "@/i18n/useCopy";
import type { ComponentProps } from 'react';
import ParalegalIllustration from '@/components/paralegal/ParalegalIllustration';
export default function AdminPageIntro({ title, body, pose = 'review' }: { title: string; body: string; pose?: ComponentProps<typeof ParalegalIllustration>['pose'] }) {
  const c = useCopy();
  return <header className="flex items-center gap-4 py-3"><div className="min-w-0 flex-1"><p className="workspace-eyebrow">LSF · {c("Your work tools")}</p><h1 className="text-3xl font-semibold leading-tight">{c(title)}</h1><p className="mt-2 max-w-2xl text-base leading-6 text-neutral-600">{c(body)}</p></div><ParalegalIllustration pose={pose} size={88} /></header>;
}
