// Match only recorded public areas. Never guess a nearby place from a misspelling.
type PublicArea={region:string;district:string;ward?:string};
export function normalizeDirectoryArea(value:string){
 const area=value.toLowerCase().normalize('NFKC').replace(/[’']/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()
  .replace(/^(?:wilaya ya|kata ya|mkoa wa|district of|ward of|region of)\s+/,'').replace(/\s+(?:district|ward|region|mc|dc|tc|cc)$/,'');
 return /^(?:dar|dsm|dar es salaam)$/.test(area)?'dar es salaam':area;
}
export function matchesParalegalArea(person:PublicArea,region?:string,district?:string){
 const recorded=[person.region,person.district,person.ward].filter((x):x is string=>!!x).map(normalizeDirectoryArea);
 return [region,district].every(query=>!query?.trim()||recorded.includes(normalizeDirectoryArea(query)));
}
