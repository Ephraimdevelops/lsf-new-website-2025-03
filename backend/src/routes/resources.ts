import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /resources - list all resources
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("resources").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ resources: data });
});

// GET /resources/:id - get resource by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("resources").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ resource: data });
});

// POST /resources - create resource (admin only)
router.post("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("resources").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ resource: data });
});

// PUT /resources/:id - update resource (admin only)
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("resources").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ resource: data });
});

// DELETE /resources/:id - delete resource (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 