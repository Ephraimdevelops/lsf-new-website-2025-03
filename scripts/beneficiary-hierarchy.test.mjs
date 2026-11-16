import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const read = path => readFileSync(path, "utf8");
function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? sourceFiles(join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? [join(dir, entry.name)] : []);
}

test("app screens and shared components have no left accent rails", () => {
  for (const path of [...sourceFiles("mobile/app"), ...sourceFiles("mobile/src/components")]) {
    assert.doesNotMatch(read(path), /border(?:Left|Start)(?:Width|Color)/, path);
  }
});

test("beneficiary text roles share one scale", () => {
  for (const page of ["cases", "help", "learn", "profile"]) {
    assert.match(read(`mobile/app/(tabs)/${page}.tsx`), /typography\.sectionTitle/, page);
  }
  for (const page of ["cases", "help", "learn"]) {
    assert.match(read(`mobile/app/(tabs)/${page}.tsx`), /typography\.itemTitle/, page);
  }
  assert.match(read("mobile/src/components/CivicPageHeader.tsx"), /compact && typography\.compactTitle/);
});

test("case tabs retain their original views with standalone icons and explicit counts", () => {
  const cases = read("mobile/app/(tabs)/cases.tsx");
  assert.match(cases, /onPress=\{\(\) => setView\(tab\)\}/);
  assert.match(cases, /"time-outline" : "archive-outline"/);
  assert.match(cases, /style=\{styles\.tabCount\}/);
  assert.match(cases, /sectionLabel: \{ \.\.\.typography\.sectionTitle,/);
  assert.match(cases, /pathname: "\/request\/\[id\]"/);
  assert.match(cases, /pathname: "\/case\/\[id\]"/);
  assert.match(cases, /caseRecord: \{ backgroundColor: "#F7F6FA" \}/);
});

test("case status precedes secondary notes and presence appears only inside Messages", () => {
  const detail = read("mobile/app/case/[id].tsx");
  const header = detail.slice(detail.indexOf("<CivicPageHeader compact back"), detail.indexOf("{isClosureState &&"));
  assert.doesNotMatch(header, /<CasePresence/);
  assert.ok(header.indexOf("Hali ya kesi") < header.indexOf("details.case.publicId"));
  assert.doesNotMatch(header, /Hatua inayofuata|styles\.nextStep/);
  assert.match(detail, /<View style=\{styles.messageArea\}>\s*<CasePresence caseId=\{caseId\}/);
  assert.match(detail, /event: \{ flexDirection: "row", minHeight: 64 \}/);
  const request = read("mobile/app/request/[id].tsx");
  assert.match(request, /t\("Hali ya ombi", "Request status"\)/);
  assert.match(request, /heroStatus: \{ \.\.\.typography.itemTitle/);
  assert.doesNotMatch(request, /Hatua inayofuata|styles\.nextCard|requestNextStep/);
});

test("request detail groups labelled values and uses a compact composer without removing safeguards", () => {
  const request = read("mobile/app/request/[id].tsx");
  const conversation = read("mobile/src/components/RequestConversation.tsx");
  assert.match(request, /requestId=\{requestId\} compact/);
  for (const field of ["request.description", "request.desiredHelp", "request.safeContactMethod", "sourceService.name"]) assert.ok(request.includes(field), field);
  assert.match(request, /onPress=\{confirmWithdraw\}/);
  assert.match(request, /accessibilityState=\{\{ expanded: showProgress \}\}/);
  assert.match(conversation, /compact = false/);
  assert.match(conversation, /compactInput: \{ minHeight: 72, maxHeight: 160 \}/);
  assert.match(conversation, /maxLength=\{3000\}/);
  assert.match(conversation, /if \(lock.current \|\| !state\?\.canSend \|\| !body.trim\(\)\) return/);
  assert.match(conversation, /clientMessageId: pending.current.id/);
  assert.match(conversation, /disabled=\{!body.trim\(\) \|\| busy\}/);
});

test("appointments use clear status and shared typography while retaining booking safeguards", () => {
  const page = read("mobile/app/appointments.tsx");
  assert.match(page, /title=\{locale === "sw" \? "Miadi yangu"/);
  assert.match(page, /pose="contact" size=\{72\}/);
  assert.match(page, /"Hali ya miadi" : "Appointment status"/);
  assert.match(page, /date: \{ \.\.\.typography.itemTitle/);
  assert.match(page, /input: \{ \.\.\.typography.body/);
  assert.doesNotMatch(page, /backgroundColor: colors.charcoal|borderLeftWidth|letterSpacing: -/);
  assert.match(page, /name=\{active \? "radio-button-on" : "radio-button-off"\}/);
  assert.match(page, /submissionLock.current \|\| !isSignedIn \|\| casesLoading/);
  assert.match(page, /requestAppointment\(\{ \.\.\.payload, clientActionId \}\)/);
  assert.match(page, /pathname: "\/appointment\/\[id\]"/);
  assert.match(page, /key=\{userId \?\? "signed-out"\}/);
  assert.match(page, /useState\(Boolean\(params.providerName\)\)/);
  assert.match(page, /isSignedIn && !requestOpen/);
  assert.match(page, /isSignedIn && requestOpen/);
  assert.match(page, /appointmentView === "upcoming" \? appointment.status === "scheduled" : appointment.status !== "scheduled"/);
  assert.match(page, /a.startsAt - b.startsAt : b.startsAt - a.startsAt/);
  assert.match(page, /options=\{openCases.map/);
  assert.doesNotMatch(page, /openCases.slice|false &&/);
});
