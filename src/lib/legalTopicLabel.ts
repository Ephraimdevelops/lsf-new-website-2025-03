const topics: Record<string, { sw: string; en: string }> = {
  'Work and employment': { sw: 'Kazi na ajira', en: 'Work and pay' },
  'Land, renting and housing': { sw: 'Ardhi na makazi', en: 'Land and housing' },
  'Family and children': { sw: 'Familia na watoto', en: 'Family and children' },
  'Inheritance and estates': { sw: 'Mirathi', en: 'Inheritance' },
  'Consumer problems and money': { sw: 'Bidhaa na fedha', en: 'Goods and money' },
  'Safety, violence and criminal justice': { sw: 'Usalama na uhalifu', en: 'Safety and crime' },
  'Documents and public services': { sw: 'Nyaraka na huduma', en: 'Documents and services' },
  'Getting legal help and using justice pathways': { sw: 'Kupata msaada wa sheria', en: 'Getting legal help' },
  'Zanzibar-specific pathways': { sw: 'Haki Zanzibar', en: 'Rights in Zanzibar' },
};

export function legalTopicLabel(category: string, locale: 'sw' | 'en') {
  return topics[category]?.[locale] ?? category;
}
