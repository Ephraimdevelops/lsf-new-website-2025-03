import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /opportunities - list all opportunities
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("opportunities").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ opportunities: data });
});

// GET /opportunities/:id - get opportunity by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ opportunity: data });
});

// POST /opportunities - create opportunity (admin only)
router.post("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("opportunities").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ opportunity: data });
});

// PUT /opportunities/:id - update opportunity (admin only)
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("opportunities").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ opportunity: data });
});

// DELETE /opportunities/:id - delete opportunity (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("opportunities").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 