// Stable detail IDs preserve the beneficiary's answer while broad keys drive service matching.
export const helpIssues = [
  { key: "land", id: "land", icon: "map-outline", sw: "Ardhi na mipaka", en: "Land and boundaries", swBody: "Umiliki, mauzo au migogoro ya mipaka.", enBody: "Ownership, sales, or boundary disputes." },
  { key: "family", id: "maintenance", icon: "heart-outline", sw: "Matunzo ya mtoto", en: "Child maintenance", swBody: "Mahitaji ya mtoto na wajibu wa wazazi.", enBody: "A child's needs and parental responsibilities." },
  { key: "family", id: "marriage", icon: "people-outline", sw: "Ndoa na kutengana", en: "Marriage and separation", swBody: "Talaka, mali ya ndoa au mahusiano ya familia.", enBody: "Divorce, matrimonial property, or family matters." },
  { key: "family", id: "inheritance", icon: "document-text-outline", sw: "Urithi na mali", en: "Inheritance and property", swBody: "Mirathi, wosia au mali ya marehemu.", enBody: "Estates, wills, or a deceased person's property." },
  { key: "safety", id: "safety", icon: "shield-checkmark-outline", sw: "Ukatili na usalama", en: "Violence and safety", swBody: "Vitisho, ukatili wa kijinsia au ulinzi.", enBody: "Threats, gender-based violence, or protection." },
  { key: "employment", id: "employment", icon: "briefcase-outline", sw: "Kazi na ajira", en: "Employment and work", swBody: "Mshahara, mkataba au kufukuzwa kazi.", enBody: "Pay, contracts, or dismissal." },
  { key: "land", id: "housing", icon: "home-outline", sw: "Upangaji na nyumba", en: "Tenancy and housing", swBody: "Kodi, mwenye nyumba au kufukuzwa.", enBody: "Rent, landlords, or eviction." },
  { key: "consumer", id: "debt", icon: "wallet-outline", sw: "Madeni na fedha", en: "Debt and money", swBody: "Mikopo, malipo au fedha unazodai.", enBody: "Loans, payments, or money owed." },
  { key: "consumer", id: "consumer", icon: "cart-outline", sw: "Bidhaa na huduma", en: "Products and services", swBody: "Bidhaa mbovu, huduma au marejesho.", enBody: "Faulty products, services, or refunds." },
  { key: "other", id: "criminal", icon: "scale-outline", sw: "Polisi na kesi za jinai", en: "Police and criminal matters", swBody: "Kukamatwa, dhamana au kuelewa kesi.", enBody: "Arrest, bail, or understanding a case." },
  { key: "other", id: "civil", icon: "documents-outline", sw: "Mikataba na madai", en: "Contracts and civil claims", swBody: "Makubaliano, fidia au mgogoro mwingine.", enBody: "Agreements, compensation, or another dispute." },
  { key: "other", id: "other", icon: "ellipsis-horizontal", sw: "Jambo jingine / sina uhakika", en: "Something else / not sure", swBody: "Eleza hali yako kwa maneno yako.", enBody: "Describe your situation in your own words." },
] as const;

const normalise = (value: string) => value.trim().toLowerCase();
const aliases: Record<string, (typeof helpIssues)[number]["id"]> = {
  "sijalipwa mshahara": "employment", "unpaid salary": "employment", "ajira": "employment", "work": "employment",
  "mgogoro wa ardhi": "land", "ardhi": "land",
  "usalama": "safety", "mlaji": "consumer", "nyumba": "housing", "housing": "housing", "nyingine": "other",
};
export function resolveHelpIssue(value: string) {
  const text = normalise(value);
  if (text === "family" || text === "familia") return { key: "family" as const, id: undefined };
  return helpIssues.find(issue => [issue.id, issue.key, issue.sw, issue.en].some(label => normalise(label) === text))
    ?? helpIssues.find(issue => issue.id === aliases[text]);
}
