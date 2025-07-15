import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /publications - list all publications
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("publications").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ publications: data });
});

// GET /publications/:id - get publication by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("publications").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ publication: data });
});

// POST /publications - create publication (admin only)
router.post("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("publications").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ publication: data });
});

// PUT /publications/:id - update publication (admin only)
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("publications").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ publication: data });
});

// DELETE /publications/:id - delete publication (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("publications").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 