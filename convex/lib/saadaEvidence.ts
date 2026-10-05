export function noSourceResponse(locale: "sw" | "en" | undefined, kind: "legal" | "services" | "paralegals", matches = 0) {
  const en = locale === "en";
  if (kind === "services" && matches > 0) return en
    ? "These are current verified public directory records. Open Find Help to check the latest details and contact options. No referral has been sent."
    : "Hizi ni taarifa za sasa za huduma za umma zilizothibitishwa. Fungua Tafuta Msaada kuona maelezo na njia za mawasiliano. Hakuna rufaa iliyotumwa.";
  if (kind === "paralegals" && matches > 0) return en
    ? "I found a verified public paralegal profile below. Check their details before contacting them. No case or referral has been shared."
    : "Nimepata wasifu wa msaidizi wa kisheria aliyethibitishwa hapa chini. Angalia maelezo yake kabla ya kuwasiliana. Hakuna kesi au rufaa iliyoshirikiwa.";
  if (kind !== "legal") return en
    ? "I could not find a current verified public match for those details. Try another district in Find Help or submit a help request for LSF to review. No referral has been sent."
    : "Sijapata huduma ya umma iliyothibitishwa kwa maelezo hayo kwa sasa. Jaribu wilaya nyingine kwenye Tafuta Msaada au tuma ombi ili LSF ilikague. Hakuna rufaa iliyotumwa.";
  return en
    ? "I cannot verify a legal answer from a current approved source for this question. I do not want to guess. You can use Find Help to look for a verified service or submit a help request for human review."
    : "Siwezi kuthibitisha jibu la kisheria kwa chanzo cha sasa kilichoidhinishwa kuhusu swali hili. Sitabuni jibu. Unaweza kutumia Tafuta Msaada kutafuta huduma iliyothibitishwa au kutuma ombi la msaada ili likaguliwe na mtu.";
}
