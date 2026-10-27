const knownTopics: Record<string, { key: string; sw: string; en: string }> = {
 'Work and employment': { key: 'employment', sw: 'Kazi na ajira', en: 'Work and employment' },
 'Land, renting and housing': { key: 'land', sw: 'Ardhi, upangaji na makazi', en: 'Land, renting and housing' },
 'Family and children': { key: 'family', sw: 'Familia na watoto', en: 'Family and children' },
 'Inheritance and estates': { key: 'inheritance', sw: 'Mirathi', en: 'Inheritance and estates' },
 'Consumer problems and money': { key: 'consumer', sw: 'Walaji na fedha', en: 'Consumer problems and money' },
 'Safety, violence and criminal justice': { key: 'safety', sw: 'Usalama na haki za jinai', en: 'Safety and criminal justice' },
 'Documents and public services': { key: 'documents', sw: 'Nyaraka na huduma za umma', en: 'Documents and public services' },
 'Getting legal help and using justice pathways': { key: 'access_justice', sw: 'Msaada wa sheria na njia za haki', en: 'Legal help and justice pathways' },
 'Zanzibar-specific pathways': { key: 'zanzibar', sw: 'Njia za haki Zanzibar', en: 'Zanzibar pathways' },
};
export function guideTopic(category: string) {
 return knownTopics[category] ?? { key: category, sw: category, en: category };
}
export function availableGuideTopics(guides: { category: string }[]) {
 return [...new Map(guides.map(guide => { const topic=guideTopic(guide.category); return [topic.key,topic]; })).values()];
}
