import test from "node:test";
import assert from "node:assert/strict";
import { getFunctionName } from "convex/server";
import { loadHandlerModule } from "./test-support/convex-handler-harness.mjs";
const { makeSocialTools } = loadHandlerModule(
  "convex/lib/socialPublicTools.ts",
);
const base = {
  region: "Dar es Salaam",
  district: "Kinondoni",
  currentIntakeState: "open",
  serviceTypes: [],
};
test("a reported contact and alternate listings using its number are removed before choosing replacements", async () => {
  const services = [
    { ...base, _id: "old", name: "Old office", phone: "+255600000001" },
    {
      ...base,
      _id: "alias",
      name: "Same number elsewhere",
      phone: "0600000001",
    },
    {
      ...base,
      _id: "next",
      name: "Alternative office",
      phone: "+255600000002",
    },
  ];
  const tool = makeSocialTools(
    {
      runQuery: async (ref) =>
        getFunctionName(ref) === "justiceServices:listPublicServices"
          ? services
          : [],
    },
    {
      ai: {},
      locale: "sw",
      excludedIds: ["service:old", "phone:255600000001"],
    },
  );
  const result = await tool("find_services", { district: "Kinondoni" }, 1000);
  assert.deepEqual(
    result.data.services.map((x) => x.name),
    ["Alternative office"],
  );
  assert.ok(!JSON.stringify(result).includes("0600000001"));
});
test("a regional label alone never becomes a fabricated nearby office", async () => {
  const tool = makeSocialTools(
    {
      runQuery: async () => [
        {
          ...base,
          _id: "profile",
          fullName: "Fictional district contact",
          phone: "+255600000002",
        },
      ],
    },
    { ai: {}, locale: "sw" },
  );
  const result = await tool("find_paralegals", { area: "Magomeni" }, 1000);
  assert.equal(result.data.proximity.estimates[0].distanceEstimateKm, null);
  assert.equal(result.data.paralegals[0].name, "Fictional district contact");
});
test("a disputed LSF contact cannot reappear through the overview profile payload", async () => {
  const tool = makeSocialTools(
    {},
    { ai: {}, locale: "sw", excludedIds: ["lsf:contact"] },
  );
  const result = await tool("about_lsf", { topic: "overview" }, 1000);
  assert.equal(result.data.profile.contact, undefined);
  const contact = await tool("about_lsf", { topic: "contact" }, 1000);
  assert.equal(contact.data.available, false);
});
