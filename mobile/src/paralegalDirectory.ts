type DirectoryPerson = { fullName: string; region: string; district: string; ward?: string; specializations?: string[]; languages?: string[]; availabilityStatus?: string };

export function matchesParalegal(item: DirectoryPerson, query: string, region: string, acceptingOnly: boolean) {
  const needle = query.trim().toLocaleLowerCase();
  return (!region || item.region === region)
    && (!acceptingOnly || item.availabilityStatus === "accepting_cases")
    && (!needle || [item.fullName, item.region, item.district, item.ward, ...(item.specializations ?? []), ...(item.languages ?? [])].filter(Boolean).join(" ").toLocaleLowerCase().includes(needle));
}

export function paralegalAvailabilityLabel(status: string | undefined, locale: "sw" | "en") {
  const labels: Record<string, { sw: string; en: string }> = {
    accepting_cases: { sw: "Anapokea maombi mapya", en: "Accepting new requests" },
    limited: { sw: "Upatikanaji mdogo", en: "Limited availability" },
    paused: { sw: "Amesitisha kwa muda", en: "Temporarily paused" },
    unavailable: { sw: "Hayupo kwa sasa", en: "Unavailable now" },
  };
  return labels[status ?? ""]?.[locale] ?? (locale === "sw" ? "Thibitisha upatikanaji" : "Check availability");
}
