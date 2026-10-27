import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const select = read("mobile/src/intake/IntakeSelect.tsx");
const finder = read("mobile/app/find-services.tsx");
const intake = read("mobile/app/intake.tsx");
const filters = read("mobile/src/components/SearchFilters.tsx");

test("small selection sheets avoid search and generic Choose prompts", () => {
  assert.match(select, /const searchable = options\.length > 8 \|\| allowCustom/);
  assert.match(select, /chosen \|\| placeholder \|\| label/);
  assert.match(select, /accessibilityState=\{\{ disabled, expanded: open \}\}/);
  assert.match(select, /item\.value === value \? <Ionicons name="checkmark"/);
  assert.match(select, /search\.trim\(\)\.slice\(0, 100\)/);
});

test("Find Help shows provider types on the page and limits its location sheet to region and district", () => {
  assert.match(finder, /styles\.issueGrid\}>\{issueOptions\.filter/);
  assert.match(finder, /setIssueCategory\(issue\.key\)/);
  assert.doesNotMatch(finder, /void runMatch\(issue\.key\)/);
  assert.match(finder, /setIssueDetail\(issue\.id\)/);
  const locationSheet = finder.slice(finder.indexOf("<SearchFilters"), finder.indexOf("</SearchFilters>"));
  assert.equal((locationSheet.match(/<IntakeSelect /g) ?? []).length, 2);
  assert.doesNotMatch(locationSheet, /providerType|helpGoals|moreFilters|openOnly|ward/);
  assert.match(finder.slice(finder.indexOf("const searchControls"), finder.indexOf("<SearchFilters")), /value=\{providerType\}/);
  assert.match(finder, /"Aina ya msaada"/);
  assert.match(finder, /setProviderType\(provider\); clearMatches\(\)/);
  assert.doesNotMatch(finder, /setProviderType\([^)]*\); setStage/);
  assert.match(finder, /\.\.\.regionOptions/);
  assert.match(finder, /setRegion\(value\); setDistrict\(""\); clearMatches\(\)/);
  assert.match(finder, /const clearLocation = \(\) => \{ setRegion\(""\); setDistrict\(""\); clearMatches\(\); \}/);
  assert.match(finder, /disabled=\{!region\}/);
  assert.match(finder, /onSubmit=\{\(\) => void runMatch\(\)\}/);
});

test("intake distinguishes event location and clears dependent district", () => {
  assert.match(intake, /Mkoa wa tukio/);
  assert.match(intake, /updateDraft\(\{ region, district: "" \}\)/);
  assert.match(intake, /placeholder=\{!draft\.region \?/);
  assert.match(intake, /disabled=\{!draft\.region\}/);
});

test("dates use a bounded calendar with an optional unknown date", () => {
  assert.match(select, /<DateTimePicker value=\{pending\} mode="date"/);
  assert.match(select, /maximumDate=\{new Date\(\)\}/);
  assert.match(select, /type: "date"/);
  assert.match(select, /getFullYear\(\)/);
  assert.doesNotMatch(select, /toISOString\(\)/);
  assert.match(select, /Sikumbuki tarehe/);
  assert.doesNotMatch(select.slice(select.indexOf("export function IntakeDate")), /<IntakeSelect/);
});

test("filter action applies a guided search and uses explicit labels", () => {
  assert.match(filters, /setOpen\(false\); onSubmit\?\.\(\)/);
  assert.match(filters, /onSubmit \? \(sw \? "Tafuta msaada"/);
  assert.match(filters, /Onyesha matokeo/);
  assert.doesNotMatch(filters, /"Choose"|"Chagua"/);
});
