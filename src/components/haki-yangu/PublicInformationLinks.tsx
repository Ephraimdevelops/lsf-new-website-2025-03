import { useQuery } from 'convex/react';
import { ExternalLink, Globe } from 'lucide-react';
import { api } from '../../../convex/_generated/api';

export default function PublicInformationLinks({ issue }: { issue?: string }) {
  const resources = useQuery(api.justiceServices.listPublicInformationResources, {
    issueCategory: issue?.trim() || undefined,
  });

  return <section className="mt-8 rounded-[24px] border border-teal-100 bg-[#F4FAF9] p-6" aria-labelledby="public-information-title">
    <div className="flex items-start gap-3">
      <Globe className="mt-1 h-6 w-6 shrink-0 text-teal-800" aria-hidden="true" />
      <div>
        <h3 id="public-information-title" className="text-xl font-bold text-[#241820]">Official information and contact websites</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#665963]">These are external information links, separate from LSF-verified services. Check eligibility, location and available support directly with each organisation. Opening a website does not send your Haki Yangu request.</p>
      </div>
    </div>
    {resources === undefined ? <p role="status" className="mt-5 text-sm text-[#665963]">Loading official websites…</p> : <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {resources.map((resource) => <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="group rounded-2xl border border-teal-100 bg-white p-5 transition hover:border-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800" aria-label={`${resource.name}: ${resource.titleEn}. Open official website in a new tab.`}>
        <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wide text-teal-800">{resource.category === 'government' ? 'Government information' : resource.category === 'registry' ? 'Provider register' : 'Legal-aid information'}</span><ExternalLink className="h-4 w-4 shrink-0 text-teal-800" aria-hidden="true" /></div>
        <h4 className="mt-3 text-lg font-bold text-[#241820]">{resource.name}</h4>
        <p className="mt-1 text-sm font-medium text-[#241820]">{resource.titleEn}</p>
        <p className="mt-2 text-sm leading-6 text-[#665963]">{resource.descriptionEn}</p>
        <p className="mt-4 break-all text-xs text-teal-800">{new URL(resource.url).hostname}</p>
        <span className="mt-3 inline-block text-sm font-semibold text-teal-800 underline underline-offset-4">Open official website</span>
      </a>)}
    </div>}
  </section>;
}
