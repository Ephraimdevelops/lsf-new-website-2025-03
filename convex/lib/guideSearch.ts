type SearchableGuide = {
  titleEn: string; titleSw: string; summaryEn: string; summarySw: string;
  category: string; jurisdiction: string; reviewDueAt: number; status: string;
};

export function searchCurrentGuides<T extends SearchableGuide>(guides: T[], search = '', jurisdiction?: string, now = Date.now()) {
  const stopWords = new Set(['help','understand','rights','right','please','what','how','can','the','and','with','about','need','want','find','legal','information','tell','nisaidie','naomba','haki','zangu','nataka','kuhusu','sheria']);
  const baseTerms = search.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(term => term.length >= 3 && !stopWords.has(term));
  if (search.trim() && !baseTerms.length) return [];
  const tenancyTerms = ['tenant','tenants','tenancy','rent','lease','mpangaji','upangaji'];
  const terms = [...new Set(baseTerms.flatMap(term => tenancyTerms.includes(term) ? tenancyTerms : [term]))];
  return guides.filter(guide => guide.status === 'approved' && guide.reviewDueAt > now)
    .filter(guide => !jurisdiction || guide.jurisdiction === jurisdiction || guide.jurisdiction === 'national')
    .map(guide => {
      const title = `${guide.titleEn} ${guide.titleSw}`.toLowerCase();
      const text = `${guide.summaryEn} ${guide.summarySw} ${guide.category}`.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 3 : text.includes(term) ? 1 : 0), 0);
      return { guide, score };
    }).filter(item => !terms.length || item.score > 0)
    .sort((a, b) => b.score - a.score).slice(0, 10).map(item => item.guide);
}
