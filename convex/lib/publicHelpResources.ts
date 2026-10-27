// Publisher-owned information links checked against primary sources on 5 October 2026.
// These are never provider records, recommendations, appointments or referral destinations.
export const PUBLIC_HELP_RESOURCES = [
  {
    id: "cma",
    name: "CMA",
    category: "government",
    titleEn: "Commission for Mediation and Arbitration",
    titleSw: "Tume ya Usuluhishi na Uamuzi",
    descriptionEn: "Official information and FAQs about employment disputes. Check the applicable procedure with CMA.",
    descriptionSw: "Taarifa rasmi na maswali kuhusu migogoro ya ajira. Thibitisha utaratibu unaohusika na CMA.",
    url: "https://www.cma.go.tz/faqs",
    issues: ["employment"],
  },
  {
    id: "tawla",
    name: "TAWLA",
    category: "legal_aid",
    titleEn: "Tanzania Women Lawyers Association",
    titleSw: "Chama cha Wanawake Wanasheria Tanzania",
    descriptionEn: "Published legal-aid information for women and children. Contact TAWLA to confirm eligibility and available support.",
    descriptionSw: "Taarifa za msaada wa kisheria kwa wanawake na watoto. Wasiliana na TAWLA kuthibitisha vigezo na msaada unaopatikana.",
    url: "https://www.tawla.or.tz/portfolio/legal-aid-services/",
    issues: ["family", "land", "safety"],
  },
  {
    id: "fcc",
    name: "FCC",
    category: "government",
    titleEn: "Fair Competition Commission",
    titleSw: "Tume ya Ushindani",
    descriptionEn: "The Commission's consumer information page. Check whether your complaint falls within its responsibilities.",
    descriptionSw: "Ukurasa wa Tume wenye taarifa za walaji. Thibitisha kama malalamiko yako yanahusu majukumu yake.",
    url: "https://www.fcc.go.tz/consumer",
    issues: ["consumer"],
  },
  {
    id: "rita",
    name: "RITA",
    category: "government",
    titleEn: "Registration, Insolvency and Trusteeship Agency",
    titleSw: "Wakala wa Usajili Ufilisi na Udhamini",
    descriptionEn: "Official eRITA service information. Check document requirements and fees on RITA's website.",
    descriptionSw: "Taarifa rasmi za huduma za eRITA. Angalia nyaraka na ada kwenye tovuti ya RITA.",
    url: "https://www.rita.go.tz/erita.php",
    issues: ["identity", "documents", "other"],
  },
  {
    id: "lhrc",
    name: "LHRC",
    category: "legal_aid",
    titleEn: "Legal and Human Rights Centre",
    titleSw: "Kituo cha Sheria na Haki za Binadamu",
    descriptionEn: "The Centre's published legal-aid clinic contacts. Confirm the right office and current intake directly.",
    descriptionSw: "Mawasiliano ya vituo vya msaada wa kisheria yaliyochapishwa na Kituo. Thibitisha ofisi na upokeaji wa maombi moja kwa moja.",
    url: "https://legalaid.humanrights.or.tz/en/contact",
    issues: [],
  },
  {
    id: "nalis",
    name: "NaLIS",
    category: "registry",
    titleEn: "National Legal Information System",
    titleSw: "Mfumo wa Kitaifa wa Taarifa za Kisheria",
    descriptionEn: "Official provider registration notice and status list. Registration does not confirm available case support.",
    descriptionSw: "Tangazo rasmi na orodha ya hali za usajili wa watoa msaada. Usajili hauthibitishi upatikanaji wa msaada wa kesi.",
    url: "https://nalis.sheria.go.tz/en/lap-notice",
    issues: [],
  },
] as const;

// Published business contact rechecked on the publisher's contact page, 16 October 2026.
// This is not provider verification, current intake confirmation, or a referral agreement.
const PUBLIC_HELP_CONTACT_POINTS = [{
  resourceId: "lhrc", name: "Kinondoni Legal Aid Clinic", region: "Dar es Salaam", district: "Kinondoni",
  address: "Isere St., House No. 660", phone: "+255 717 143 784",
}] as const;

export function publicHelpResourcesForIssue(issue?: string) {
  const selected = issue?.trim().toLowerCase();
  return PUBLIC_HELP_RESOURCES.filter((resource) =>
    !selected || resource.issues.length === 0 || (resource.issues as readonly string[]).includes(selected)
  ).map((resource) => ({ ...resource, contactPoints: PUBLIC_HELP_CONTACT_POINTS.filter(point => point.resourceId === resource.id), checkedOn: resource.id === "lhrc" ? "2026-10-16" : "2026-10-05", kind: "publisher_information_link" as const }));
}
