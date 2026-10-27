export type Point = { latitude: number; longitude: number };
export function validPoint(point: Partial<Point> | null | undefined): point is Point {
  return !!point && Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
    && Math.abs(point.latitude!) <= 90 && Math.abs(point.longitude!) <= 180;
}
export function distanceKm(a: Point, b: Point) {
  const radians = (n: number) => n * Math.PI / 180;
  const dLat = radians(b.latitude - a.latitude), dLon = radians(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function requireNearbyInput(origin?: Point, radiusKm?: number) {
  if (origin && !validPoint(origin)) throw new Error('Invalid search coordinates.');
  if (radiusKm !== undefined && (!origin || !Number.isFinite(radiusKm) || radiusKm < 1 || radiusKm > 200)) throw new Error('Choose a radius between 1 and 200 km with a search location.');
}
