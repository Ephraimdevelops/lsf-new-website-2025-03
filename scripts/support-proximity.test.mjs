import test from "node:test";
import assert from "node:assert/strict";
import { loadHandlerModule } from "./test-support/convex-handler-harness.mjs";
const { rankSupport, areaReference } = loadHandlerModule(
  "convex/lib/supportProximity.ts",
);
const base = { region: "Dar es Salaam", district: "Kinondoni" };
test("Magomeni search can compare recorded Morocco and Kawe areas instead of region labels alone", () => {
  const result = rankSupport(
    [
      { ...base, ward: "Kawe", name: "Kawe fixture" },
      { ...base, ward: "Morocco", name: "Morocco fixture" },
    ],
    { area: "Magomeni" },
  );
  assert.equal(result.items[0].record.name, "Morocco fixture");
  assert.ok(
    result.items[0].distanceEstimateKm < result.items[1].distanceEstimateKm,
  );
  assert.equal(
    result.items[0].distanceBasis,
    "area_reference_to_area_reference",
  );
  assert.match(result.note, /not the user/);
});
test("district-only listings never receive fabricated coordinates or distance", () => {
  const result = rankSupport([{ ...base, name: "Unknown position" }], {
    area: "Magomeni",
  });
  assert.equal(result.items[0].distanceEstimateKm, null);
  assert.equal(result.items[0].distanceBasis, "unknown");
  assert.equal(areaReference("Magomeni Kawe"), undefined);
});
test("known nearby public offices may cross district boundaries while unknown distant districts are excluded", () => {
  const result = rankSupport(
    [
      {
        ...base,
        district: "Ilala",
        name: "Public office",
        latitude: -6.805,
        longitude: 39.26,
      },
      { region: "Mwanza", district: "Ilemela", name: "No coordinates" },
    ],
    { area: "Magomeni" },
  );
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].record.district, "Ilala");
  assert.equal(
    result.items[0].distanceBasis,
    "area_reference_to_public_office",
  );
});
