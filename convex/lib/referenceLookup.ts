// Route explicit evidence lookups before generation. This is intent detection,
// never a substitute for current source, location or eligibility verification.
export function namedContactQuery(text: string) {
  if (
    !/\b(?:namba|simu|mawasiliano|ofisi|phone|contact|hotline|address|location|directions|nafikaje)\b/i.test(
      text,
    )
  )
    return undefined;
  const names = [
    "WiLDAF",
    "TAWLA",
    "LHRC",
    "WLAC",
    "ZLSC",
    "WoteSawa",
    "KIWOHEDE",
    "ZLS",
    "TLS",
    "CMA",
    "RITA",
  ];
  const found = names.filter((name) =>
    new RegExp("\\b" + name + "\\b", "i").test(text),
  );
  return found.length === 1 ? found[0] : undefined;
}
export function registrationQuestion(text: string) {
  return (
    /\b(?:cheti|usajili|registrar|registration|birth certificate|death certificate|marriage certificate)\b/i.test(
      text,
    ) &&
    /\b(?:what|how|where|can|should|need|nini|nifanye|nawezaje|wapi|nahitaji|sina)\b/i.test(
      text,
    )
  );
}

export function isLsfReportQuestion(text:string){return /\bLSF\b|legal services facility/i.test(text)&&/\b(?:report|annual|history|strategy|statistics|beneficiaries|people|women|children|reach|reached|assisted|helped|impact|budget|expenditure|income|financial|202[0-9]|takwimu|wanufaika|wanawake|watoto|mikoa|wilaya|ripoti|mwaka|historia|mkakati|bajeti|mapato|matumizi)\b/i.test(text);}
