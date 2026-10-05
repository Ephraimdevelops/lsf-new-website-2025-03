import assert from "node:assert/strict";
import test from "node:test";
import { dashboardPath } from "../src/components/auth/dashboardPath.ts";

test("each professional role has a web destination", () => {
  assert.equal(dashboardPath(["admin"]), "/admin");
  for (const role of ["staff", "supervisor"]) {
    assert.equal(dashboardPath([role]), "/dashboard/staff");
  }
  assert.equal(dashboardPath(["safeguarding_officer"]), "/dashboard/safeguarding");
  assert.equal(dashboardPath(["content_editor"]), "/dashboard/editorial");
  for (const role of ["paralegal", "provider_staff"]) {
    assert.equal(dashboardPath([role]), "/dashboard/paralegal");
  }
  for (const role of ["stakeholder", "donor"]) {
    assert.equal(dashboardPath([role]), "/dashboard/stakeholder");
  }
  assert.equal(dashboardPath(["user"]), "/dashboard/user");
});

test("multi-role accounts route to their highest-privilege workspace", () => {
  assert.equal(dashboardPath(["user", "content_editor", "staff"]), "/dashboard/staff");
  assert.equal(dashboardPath(["user", "donor"]), "/dashboard/stakeholder");
});
