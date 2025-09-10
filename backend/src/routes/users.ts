import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabaseAdmin } from "../supabaseClient.js";
import type { AdminUserAttributes } from "../types/user";

const router = Router();

// Helper to normalize a Supabase user object for responses
function normalizeUser(user: any) {
  const metadata = user.user_metadata || {};
  const appMeta = user.app_metadata || {};
  const role = metadata.role || appMeta.role || "user";
  return {
    id: user.id,
    email: user.email,
    role,
    email_confirmed_at: user.email_confirmed_at,
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    banned: !!metadata.banned,
    banned_until: metadata.banned_until || null,
    deleted_at: user.deleted_at,
  };
}

// GET /users - list all users (admin only)
router.get("/", requireRole(["admin"]), async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    const users = (data?.users || []).map(normalizeUser);

    res.json({ users, total: users.length });
  } catch (err: any) {
    console.error("List users error:", err);
    res.status(500).json({ error: err.message || "Internal server error while fetching users" });
  }
});

// GET /users/:id - get specific user (admin only)
router.get("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
    if (error) throw error;
    if (!data?.user) return res.status(404).json({ error: "User not found" });

    res.json({ user: normalizeUser(data.user) });
  } catch (err: any) {
    console.error("Get user error:", err);
    res.status(500).json({ error: err.message || "Internal server error while fetching user" });
  }
});

// PATCH /users/:id/role - update user role (admin only)
router.patch("/:id/role", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: "Role is required" });

    const validRoles = ["admin", "staff", "paralegal", "stakeholder", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Fetch existing user metadata to preserve other metadata fields
    const { data: fetched, error: fetchErr } = await supabaseAdmin.auth.admin.getUserById(id);
    if (fetchErr) throw fetchErr;
    const existingMetadata = fetched?.user?.user_metadata || {};

    const updatePayload: AdminUserAttributes = {
      user_metadata: { ...existingMetadata, role }
    };

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updatePayload);
    if (error) throw error;

    res.json({ message: "User role updated successfully", user: normalizeUser(data.user) });
  } catch (err: any) {
    console.error("Update user role error:", err);
    res.status(500).json({ error: err.message || "Internal server error while updating user role" });
  }
});

// PATCH /users/:id/ban - ban or unban user (admin only)
router.patch("/:id/ban", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { banned_until } = req.body; // ISO string or null

    const { data: fetched, error: fetchErr } = await supabaseAdmin.auth.admin.getUserById(id);
    if (fetchErr) throw fetchErr;
    if (!fetched?.user) return res.status(404).json({ error: "User not found" });

    const existingMetadata = fetched.user.user_metadata || {};
    const newMetadata = {
      ...existingMetadata,
      banned: !!banned_until,
      banned_until: banned_until ?? null,
    };

    const updatePayload: AdminUserAttributes = { user_metadata: newMetadata };
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updatePayload);
    if (error) throw error;

    res.json({
      message: banned_until ? "User banned successfully" : "User unbanned successfully",
      user: normalizeUser(data.user),
    });
  } catch (err: any) {
    console.error("Ban user error:", err);
    res.status(500).json({ error: err.message || "Internal server error while banning user" });
  }
});

// DELETE /users/:id - delete user (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: err.message || "Internal server error while deleting user" });
  }
});

// POST /users/invite - invite user by email (admin only)
router.post("/invite", requireRole(["admin"]), async (req, res) => {
  try {
    const { email, role = 'stakeholder' } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const validRoles = ["admin", "staff", "paralegal", "stakeholder"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { role },
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
    });

    if (error) throw error;

    res.json({ message: "User invited successfully", user: normalizeUser(data.user) });
  } catch (err: any) {
    console.error("Invite user error:", err);
    res.status(500).json({ error: err.message || "Internal server error while inviting user" });
  }
});

// GET /users/stats - user statistics (admin only)
router.get("/stats", requireRole(["admin"]), async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    const users = data?.users || [];

    const stats = {
      total: users.length,
      confirmed: users.filter(u => u.email_confirmed_at).length,
      unconfirmed: users.filter(u => !u.email_confirmed_at).length,
      banned: users.filter(u => u.user_metadata?.banned).length,
      deleted: users.filter(u => u.deleted_at).length,
      byRole: {
        admin: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'admin').length,
        staff: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'staff').length,
        paralegal: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'paralegal').length,
        stakeholder: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'stakeholder').length,
        user: users.filter(u => !(u.user_metadata?.role || u.app_metadata?.role) || (u.user_metadata?.role || u.app_metadata?.role) === 'user').length,
      }
    };

    res.json({ stats });
  } catch (err: any) {
    console.error("Get user stats error:", err);
    res.status(500).json({ error: err.message || "Internal server error while fetching user statistics" });
  }
});

// PUT /users/:id - update user (admin only)
router.put("/users/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data: existingUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(id);
    if (fetchError) throw fetchError;

    const existingMetadata = existingUser.user?.user_metadata || {};
    const updateData: AdminUserAttributes = {
      ...updates,
      user_metadata: {
        ...existingMetadata,
        ...updates.user_metadata,
        banned: updates.user_metadata?.banned ?? existingMetadata.banned ?? false,
        banned_until: updates.user_metadata?.banned_until ?? existingMetadata.banned_until ?? null,
      }
    };

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);
    if (error) throw error;

    res.json({ message: "User updated successfully", user: normalizeUser(data.user) });
  } catch (err: any) {
    console.error("Update user error:", err);
    res.status(500).json({ error: err.message || "Failed to update user" });
  }
});

export default router;