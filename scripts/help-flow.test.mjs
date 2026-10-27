import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { buildSync } from "esbuild";

const require = createRequire(import.meta.url);
function load(path) {
  const output = buildSync({ entryPoints: [path], bundle: true, platform: "node", format: "cjs", write: false }).outputFiles[0].text;
  const module = { exports: {} };
  new Function("module", "exports", "require", output)(module, module.exports, require);
  return module.exports;
}
const { districtOptions, regionOptions } = load("mobile/src/regionOptions.ts");
const { helpIssues, resolveHelpIssue } = load("mobile/src/helpIssues.ts");
const read = path => readFileSync(path, "utf8");

test("offline region and district selectors work without a single published service", () => {
  assert.equal(regionOptions.length, 31);
  for (const region of regionOptions) assert.ok(districtOptions(region.value).length > 0, region.value);
  assert.deepEqual(districtOptions("Dar es Salaam").map(item => item.value), ["Ilala", "Kigamboni", "Kinondoni", "Temeke", "Ubungo"]);
  assert.deepEqual(districtOptions("Kaskazini Pemba").map(item => item.value), ["Micheweni", "Wete"]);
  assert.deepEqual(districtOptions(""), []);
});

test("location options preserve newer directory places and a restored selection, without duplicates or other regions", () => {
  const options = districtOptions("dar es salaam", [{ region: "Dar es Salaam", district: "Ilala" }, { region: "Dar es Salaam", district: "New published district" }, { region: "Arusha", district: "Arumeru" }], "Restored district");
  assert.equal(options.filter(item => item.value === "Ilala").length, 1);
  assert.ok(options.some(item => item.value === "New published district"));
  assert.ok(options.some(item => item.value === "Restored district"));
  assert.ok(!options.some(item => item.value === "Arumeru"));
});

test("bilingual labels map to stable broad categories and distinct intake details", () => {
  for (const issue of helpIssues) {
    assert.equal(resolveHelpIssue(issue.sw.toUpperCase()).id, issue.id);
    assert.equal(resolveHelpIssue(issue.en).id, issue.id);
  }
  assert.equal(resolveHelpIssue("Matunzo ya mtoto").key, "family");
  assert.equal(resolveHelpIssue("Upangaji na nyumba").key, "land");
  assert.notEqual(resolveHelpIssue("Ndoa na kutengana").id, resolveHelpIssue("Matunzo ya mtoto").id);
  assert.equal(resolveHelpIssue("employment").key, "employment");
  assert.equal(resolveHelpIssue("Sijalipwa mshahara").key, "employment");
  assert.equal(resolveHelpIssue("Mgogoro wa ardhi").key, "land");
  assert.equal(resolveHelpIssue("Ajira").key, "employment");
  assert.equal(resolveHelpIssue("Familia").key, "family");
  assert.equal(resolveHelpIssue("Familia").id, undefined);
  assert.equal(resolveHelpIssue("arbitrary unknown sentence"), undefined);
});

test("UI sends provider/outcome filters to both endpoints and rejects late matching responses", () => {
  const finder = read("mobile/app/find-services.tsx");
  assert.equal((finder.match(/providerType: providerType === "all" \? undefined : providerType/g) ?? []).length, 2);
  assert.equal((finder.match(/serviceType: selectedGoal\?\.serviceType \|\| undefined/g) ?? []).length, 2);
  assert.match(finder, /if \(generation !== matchGeneration.current\) return/);
  assert.match(finder, /matchGeneration.current \+= 1/);
  assert.match(finder, /issueDetail: typedIssue\?\.id \?\? \(issueDetail \|\| undefined\)/);
  for (const page of ["find-services", "intake", "nearby-help"]) assert.match(read(`mobile/app/${page}.tsx`), /districtOptions\(/);
  assert.match(read("mobile/app/intake.tsx"), /helpIssues as issueOptions/);
});
