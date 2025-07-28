import { Router } from "express";

import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// Public: Register a new paralegal (status = 'pending')
router.post("/", async (req, res) => {
  const { data, error } = await supabase.from("paralegals").insert([{ ...req.body, status: 'pending' }]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ paralegal: data });
});

// Public: List all approved paralegals
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("paralegals").select("*").eq("status", "approved");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ paralegals: data });
});

// Admin: List all paralegals (any status)
router.get("/all", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("paralegals").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ paralegals: data });
});

// Get paralegal by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("paralegals").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ paralegal: data });
});

// Admin: Update paralegal
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("paralegals").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ paralegal: data });
});

// Admin: Approve/reject paralegal
router.patch("/:id/status", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const { data, error } = await supabase.from("paralegals").update({ status }).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ paralegal: data });
});

// Admin: Delete paralegal
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("paralegals").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 