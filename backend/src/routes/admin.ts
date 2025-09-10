import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabaseAdmin } from "../supabaseClient.js";

const router = Router();

// Middleware to require admin role for all routes in this file
router.use(requireRole(["admin"]));

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [
      { count: usersCount },
      { count: newsCount },
      { count: programsCount },
      { count: publicationsCount }
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("news").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("programs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("publications").select("*", { count: "exact", head: true })
    ]);

    res.json({
      stats: {
        users: usersCount,
        news: newsCount,
        programs: programsCount,
        publications: publicationsCount
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin statistics" });
  }
});

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user role
router.put("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "staff", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Update profiles table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ role })
      .eq("id", id);

    if (profileError) throw profileError;

    // Update auth metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { role },
      app_metadata: { role }
    });

    if (authError) throw authError;

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Get system settings
router.get("/settings", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json({ settings: data || {} });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Update system settings
router.put("/settings", async (req, res) => {
  const settings = req.body;

  try {
    const { error } = await supabaseAdmin
      .from("settings")
      .upsert(settings);

    if (error) throw error;

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
