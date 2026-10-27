export const adminGroups = [
  { key: 'all', en: 'All tools', sw: 'Zana zote' },
  { key: 'cases', en: 'Cases', sw: 'Kesi' },
  { key: 'people', en: 'People', sw: 'Watu' },
  { key: 'knowledge', en: 'Guides and learning', sw: 'Miongozo na mafunzo' },
  { key: 'insight', en: 'Reports & history', sw: 'Taarifa na historia' },
] as const;
export const adminTools = [
  { key: 'requests', group: 'cases', en: 'Requests and cases', sw: 'Maombi na kesi', detail: 'Read a request, open a case and find the right helper.', detailSw: 'Soma ombi, fungua kesi na tafuta mtoa msaada.', mobile: '/operations', web: '/dashboard/staff?tab=requests', icon: 'folder-open-outline', pose: 'direction' },
  { key: 'reviews', group: 'cases', en: 'Case reviews', sw: 'Mapitio ya kesi', detail: 'Review concerns, unanswered assignments and case quality.', detailSw: 'Kagua malalamiko, kesi zinazosubiri jibu na ubora wa huduma.', mobile: '/supervision', web: '/dashboard/staff?tab=reviews', icon: 'checkmark-circle-outline', pose: 'review' },
  { key: 'documents', group: 'cases', en: 'Case documents', sw: 'Nyaraka za kesi', detail: 'Read uploaded files and explain your review decision.', detailSw: 'Soma nyaraka na eleza uamuzi wako.', mobile: '/admin-documents', web: '/dashboard/staff?tab=documents', icon: 'document-text-outline', pose: 'documents' },
  { key: 'matching', group: 'cases', en: 'Helper matching', sw: 'Kuchagua mtoa msaada', detail: 'Check why a helper was suggested.', detailSw: 'Kagua sababu za kupendekeza mtoa msaada.', mobile: '/matching-review', web: '/dashboard/staff?tab=matching', icon: 'people-outline', pose: 'direction' },
  { key: 'referrals', group: 'cases', en: 'Referrals', sw: 'Rufaa', detail: 'Check consent and follow support between teams.', detailSw: 'Kagua ridhaa na msaada kati ya timu.', mobile: '/referral-oversight', web: '/dashboard/staff?tab=referrals', icon: 'git-branch-outline', pose: 'contact' },
  { key: 'safety', group: 'cases', en: 'Safety concerns', sw: 'Masuala ya usalama', detail: 'Review urgent and protected concerns.', detailSw: 'Kagua masuala ya dharura na ulinzi.', mobile: '/safeguarding', web: '/dashboard/safeguarding', icon: 'shield-checkmark-outline', pose: 'safety' },
  { key: 'access', group: 'people', en: 'People and access', sw: 'Watu na ruhusa', detail: 'Review work access and role changes.', detailSw: 'Kagua ruhusa za kazi na majukumu.', mobile: '/access-management', web: '/admin?tab=access', icon: 'people-outline', pose: 'review' },
  { key: 'applications', group: 'people', en: 'Paralegal applications', sw: "Maombi ya msaidizi wa kisheria", detail: 'Check identity, training and submitted documents.', detailSw: 'Kagua utambulisho, mafunzo na nyaraka.', mobile: '/paralegal-review-queue', web: '/dashboard/paralegal-reviews', icon: 'ribbon-outline', pose: 'review' },
  { key: 'support', group: 'people', en: 'Help the team', sw: 'Saidia timu', detail: 'Reply to paralegals who need guidance or support.', detailSw: 'Jibu wasaidizi wa kisheria wanaohitaji msaada.', mobile: '/admin-support', web: '/admin?tab=support', icon: 'heart-outline', pose: 'contact' },
  { key: 'directory', group: 'people', en: 'Organisations and services', sw: 'Taasisi na huduma', detail: 'Keep help locations and contact details correct.', detailSw: 'Sahihisha maeneo ya msaada na mawasiliano.', mobile: '/directory-management', web: '/dashboard/staff?tab=services', icon: 'business-outline', pose: 'location' },
  { key: 'sources', group: 'knowledge', en: 'Haki Yangu AI sources', sw: 'Vyanzo vya Haki Yangu AI', detail: 'Review sources before Haki Yangu AI uses them.', detailSw: 'Kagua vyanzo kabla ya kutumiwa na Haki Yangu AI.', mobile: '/saada-governance', web: '/sara/train', icon: 'library-outline', pose: 'documents' },
  { key: 'answers', group: 'knowledge', en: 'Haki Yangu AI answer checks', sw: 'Ukaguzi wa majibu ya Haki Yangu AI', detail: 'Test answers and inspect their sources.', detailSw: 'Pima majibu na kagua vyanzo vyake.', mobile: '/saada-evaluations', web: '/dashboard/saada-evaluations', icon: 'chatbubble-outline', pose: 'review' },
  { key: 'guides', group: 'knowledge', en: 'Rights guides', sw: 'Miongozo ya haki', detail: 'Write and review clear legal guidance.', detailSw: 'Andika na kagua mwongozo rahisi wa haki.', mobile: '/editorial-workspace', web: '/dashboard/editorial', icon: 'book-outline', pose: 'documents' },
  { key: 'training', group: 'knowledge', en: 'Paralegal training', sw: "Mafunzo ya msaidizi wa kisheria", detail: 'Prepare lessons and review each new version.', detailSw: 'Andaa masomo na kagua kila toleo jipya.', mobile: '/training-management', web: '/dashboard/training-management', icon: 'school-outline', pose: 'documents' },
  { key: 'reports', group: 'insight', en: 'Impact reports', sw: 'Taarifa za matokeo', detail: 'Check summary figures before sharing them.', detailSw: 'Kagua takwimu kabla ya kuzishiriki.', mobile: '/reporting', web: '/dashboard/reporting', icon: 'bar-chart-outline', pose: 'direction' },
  { key: 'audit', group: 'insight', en: 'Decision history', sw: 'Historia ya maamuzi', detail: 'See who changed what and when.', detailSw: 'Ona nani alibadili nini na lini.', mobile: '/audit-log', web: '/admin?tab=audit', icon: 'time-outline', pose: 'review' },
] as const;
export function matchesAdminTool(tool: typeof adminTools[number], search: string, group: string) {
  return (group === 'all' || tool.group === group) && [tool.en, tool.sw, tool.detail, tool.detailSw].join(' ').toLowerCase().includes(search.trim().toLowerCase());
}
