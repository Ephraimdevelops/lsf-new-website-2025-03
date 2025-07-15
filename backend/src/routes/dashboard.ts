import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// Admin dashboard (admin only)
router.get("/admin", requireRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!", user: (req as any).user });
});

// Staff dashboard (staff only)
router.get("/staff", requireRole(["staff"]), async (req, res) => {
  const user = (req as any).user;
  const { data, error } = await supabase
    .from("staff_tasks")
    .select("*")
    .eq("staff_id", user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ user, tasks: data });
});

// Paralegal dashboard (paralegal only)
router.get("/paralegal", requireRole(["paralegal"]), async (req, res) => {
  const user = (req as any).user;
  const { data, error } = await supabase
    .from("paralegal_cases")
    .select("*")
    .eq("paralegal_id", user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ user, cases: data });
});

// Stakeholder dashboard (stakeholder only)
router.get("/stakeholder", requireRole(["stakeholder"]), async (req, res) => {
  const user = (req as any).user;
  const { data, error } = await supabase
    .from("stakeholder_projects")
    .select("*")
    .eq("stakeholder_id", user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ user, projects: data });
});

export default router; 