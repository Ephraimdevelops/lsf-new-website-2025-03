import assert from "node:assert/strict";
import test from "node:test";
import { dashboardPath } from "../src/components/auth/dashboardPath.ts";

test("each professional role has a web destination", () => {
  assert.equal(dashboardPath(["admin"]), "/admin");
  assert.equal(dashboardPath(["staff"]), "/dashboard/staff");
  assert.equal(dashboardPath(["supervisor"]), "/dashboard/supervisor");
  assert.equal(dashboardPath(["safeguarding_officer"]), "/dashboard/safeguarding");
  assert.equal(dashboardPath(["content_editor"]), "/dashboard/editorial");
  assert.equal(dashboardPath(["paralegal"]), "/dashboard/paralegal");
  assert.equal(dashboardPath(["provider_staff"]), "/dashboard/provider");
  for (const role of ["stakeholder", "donor"]) {
    assert.equal(dashboardPath([role]), "/dashboard/stakeholder");
  }
  assert.equal(dashboardPath(["user"]), "/dashboard/user");
});

test("multi-role accounts route to their highest-privilege workspace", () => {
  assert.equal(dashboardPath(["user", "content_editor", "staff"]), "/dashboard/staff");
  assert.equal(dashboardPath(["user", "staff", "supervisor"]), "/dashboard/supervisor");
  assert.equal(dashboardPath(["admin", "supervisor"]), "/admin");
  assert.equal(dashboardPath(["user", "donor"]), "/dashboard/stakeholder");
});
