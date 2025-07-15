import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /programs - list all programs
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("programs").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ programs: data });
});

// GET /programs/:id - get program by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("programs").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ program: data });
});

// POST /programs - create program (admin only)
router.post("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("programs").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ program: data });
});

// PUT /programs/:id - update program (admin only)
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("programs").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ program: data });
});

// DELETE /programs/:id - delete program (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 