import { distanceKm, validPoint } from "./geography";
import {
  matchesParalegalArea,
  normalizeDirectoryArea,
} from "./paralegalSearch";
// Public map reference points checked 2026-11-17. These describe areas, not
// a beneficiary position, a paralegal's location, or a verified office entrance.
// © OpenStreetMap contributors (ODbL); retain the reference URLs in results.
export const PUBLIC_AREA_REFERENCES = [
  {
    name: "Magomeni",
    aliases: ["Magomeni"],
    region: "Dar es Salaam",
    district: "Kinondoni",
    latitude: -6.803578,
    longitude: 39.26046,
    sourceUrl: "https://www.openstreetmap.org/relation/5466597",
  },
  {
    name: "Morocco",
    aliases: ["Morocco", "Morroco"],
    region: "Dar es Salaam",
    district: "Kinondoni",
    latitude: -6.77818,
    longitude: 39.2640184,
    sourceUrl: "https://www.openstreetmap.org/node/282890749",
  },
  {
    name: "Kawe",
    aliases: ["Kawe"],
    region: "Dar es Salaam",
    district: "Kinondoni",
    latitude: -6.7366328,
    longitude: 39.2222411,
    sourceUrl: "https://www.openstreetmap.org/relation/5997194",
  },
] as const;
export function areaReference(text?: string) {
  if (!text) return undefined;
  const query = normalizeDirectoryArea(text);
  const matches = PUBLIC_AREA_REFERENCES.filter((place) =>
    place.aliases.some((alias) =>
      new RegExp("(?:^|\\s)" + alias.toLowerCase() + "(?:$|\\s)").test(query),
    ),
  );
  return matches.length === 1 ? matches[0] : undefined;
}
type Candidate = {
  region: string;
  district: string;
  ward?: string;
  meetingPoint?: { latitude?: number; longitude?: number } | null;
  latitude?: number;
  longitude?: number;
  physicalLocation?: string;
};
export function rankSupport<T extends Candidate>(
  rows: T[],
  filters: { region?: string; district?: string; area?: string },
  limit = 3,
) {
  const origin = areaReference(filters.area ?? filters.district);
  const candidates = rows.flatMap((record) => {
    if (!origin)
      return matchesParalegalArea(record, filters.region, filters.district)
        ? [
            {
              record,
              distanceEstimateKm: null as number | null,
              distanceBasis: "unknown" as string,
              referenceUrls: [] as string[],
            },
          ]
        : [];
    if (
      filters.region &&
      normalizeDirectoryArea(filters.region) !==
        normalizeDirectoryArea(origin.region)
    )
      return [];
    const targetArea = areaReference(record.ward ?? record.physicalLocation);
    const point = validPoint(record.meetingPoint)
      ? record.meetingPoint
      : validPoint(record)
        ? record
        : targetArea;
    const estimate = point
      ? Math.round(distanceKm(origin, point) * 10) / 10
      : null;
    // Include known nearby public points across district boundaries. Unknown
    // positions remain district-level contacts, never a fabricated nearest match.
    if (estimate !== null && estimate > 25) return [];
    if (
      estimate === null &&
      !matchesParalegalArea(record, origin.region, origin.district)
    )
      return [];
    return [
      {
        record,
        distanceEstimateKm: estimate,
        distanceBasis:
          estimate === null
            ? "unknown"
            : point === targetArea
              ? "area_reference_to_area_reference"
              : "area_reference_to_public_office",
        referenceUrls: [
          origin.sourceUrl,
          ...(point === targetArea && targetArea ? [targetArea.sourceUrl] : []),
        ],
      },
    ];
  });
  return {
    origin: origin
      ? {
          name: origin.name,
          region: origin.region,
          district: origin.district,
          sourceUrl: origin.sourceUrl,
          positionType: "public_area_reference",
        }
      : null,
    items: candidates
      .sort(
        (a, b) =>
          (a.distanceEstimateKm ?? Infinity) -
          (b.distanceEstimateKm ?? Infinity),
      )
      .slice(0, limit),
    note: "Distances are approximate straight-line estimates from a public area reference, not the user’s exact position, road distance, travel time or proof of the nearest person. Unknown positions cannot be ranked by distance. Area-to-area estimates do not establish a person’s office location.",
  };
}

export function proximityInformation(result: ReturnType<typeof rankSupport>) {
  return {
    origin: result.origin,
    estimates: result.items.map(({ record, ...rest }) => ({
      name:
        (record as any).fullName ?? (record as any).name ?? "Published contact",
      ...rest,
    })),
    note: result.note,
  };
}
