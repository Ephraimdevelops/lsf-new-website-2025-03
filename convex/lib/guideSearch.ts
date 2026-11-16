type SearchableGuide = {
  titleEn: string; titleSw: string; summaryEn: string; summarySw: string;
  category: string; jurisdiction: string; reviewDueAt: number; status: string;
};

export function searchCurrentGuides<T extends SearchableGuide>(guides: T[], search = '', jurisdiction?: string, now = Date.now()) {
  const stopWords = new Set(['i','my','me','we','us','she','he','it','they','them','his','her','our','prepare','preparing','request','factual','short','brief','details','name','currently','saved','chat','memory','remember','live','langu','jina','sasa','yangu','hapa','niko','act','law','laws','guide','guidance','support','assistance','get','for','have','will','are','you','your','from','this','that','our','provide','available','msaada','nini','jinsi','kupata','where','who','office','offices','contact','lsf','them','their','please','ofisi','mawasiliano','wapi','help','understand','rights','right','please','what','how','can','the','and','with','about','need','want','find','legal','information','tell','nisaidie','naomba','haki','zangu','nataka','kuhusu','sheria']);
  const baseTerms = search.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(term => term.length >= 3 && !stopWords.has(term));
  if (search.trim() && !baseTerms.length) return [];
  const tenancyTerms = ['tenant','tenants','tenancy','rent','lease','mpangaji','upangaji'];
  const terms = [...new Set(baseTerms.flatMap(term => tenancyTerms.includes(term) ? tenancyTerms : [term]))];
  const employment=/\b(?:employment|employer|wages|salary|dismissal|ajira|mwajiri|mshahara|sijalipwa)\b/i.test(search);
  return guides.filter(guide => guide.status === 'approved' && guide.reviewDueAt > now)
    .filter(guide=>!employment||/employment|labour|ajira|mwajiri|mshahara/i.test(`${guide.titleEn} ${guide.titleSw} ${guide.category}`))
    .filter(guide => !jurisdiction || guide.jurisdiction === jurisdiction || guide.jurisdiction === 'national')
    .map(guide => {
      const tokens=(value:string)=>new Set(value.toLowerCase().split(/[^\p{L}\p{N}]+/u));
      const title=tokens(`${guide.titleEn} ${guide.titleSw} ${guide.category}`);
      const text=tokens(`${guide.summaryEn} ${guide.summarySw}`);
      const primary=terms.filter(term=>title.has(term)).length;
      const secondary=terms.filter(term=>text.has(term)).length;
      // A generic word in the body is not sufficient legal evidence. Match a
      // title/category term or at least two meaningful body terms, by whole word.
      return { guide, score:primary*3+secondary, relevant:primary>0||secondary>=2 };
    }).filter(item => !terms.length || item.relevant)
    .sort((a, b) => b.score - a.score).slice(0, 10).map(item => item.guide);
}
