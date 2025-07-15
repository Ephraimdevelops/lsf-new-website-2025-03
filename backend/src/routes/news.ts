import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /news - list all news
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("news").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ news: data });
});

// GET /news/:id - get news by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ news: data });
});

// POST /news - create news (admin only)
router.post("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("news").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ news: data });
});

// PUT /news/:id - update news (admin only)
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("news").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ news: data });
});

// DELETE /news/:id - delete news (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 