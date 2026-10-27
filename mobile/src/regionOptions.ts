import catalogue from "./data/tanzania-districts.json";

// NBS 2022 district names are offline; newer published service locations supplement them.
export function districtOptions(region: string, records: readonly { region: string; district: string }[] = [], selected = "") {
  const name = Object.keys(catalogue.districtsByRegion).find(value => value.toLowerCase() === region.trim().toLowerCase());
  if (!name) return [];
  const official = (catalogue.districtsByRegion as Record<string, string[]>)[name];
  const names = [...official, ...records.filter(record => record.region.trim().toLowerCase() === name.toLowerCase()).map(record => record.district.trim()), selected.trim()].filter(Boolean);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b)).map(value => ({ value, label: value }));
}

export const regionOptions = ["Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pwani", "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Kaskazini Pemba", "Kaskazini Unguja", "Kusini Pemba", "Kusini Unguja", "Mjini Magharibi"].map(value => ({ value, label: value }));
