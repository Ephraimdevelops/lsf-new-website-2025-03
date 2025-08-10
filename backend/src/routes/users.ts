import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase as supabaseAdminClient } from "../supabaseClient";

const router = Router();

// GET /users - list all users (admin only)
router.get("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabaseAdminClient.auth.admin.listUsers();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ users: data.users });
});

// PATCH /users/:id/role - update user role (admin only)
router.patch("/:id/role", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }
  const { data, error } = await supabaseAdminClient.auth.admin.updateUserById(id, {
    user_metadata: { role },
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ user: data.user });
});

export default router; 