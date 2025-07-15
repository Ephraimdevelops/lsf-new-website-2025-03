import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// POST /paralegal-forms - submit a paralegal form
router.post("/", async (req, res) => {
  const { data, error } = await supabase.from("paralegal_forms").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ submission: data });
});

// GET /paralegal-forms - list all submissions (admin only)
router.get("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("paralegal_forms").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ submissions: data });
});

// GET /paralegal-forms/:id - get submission by id (admin only)
router.get("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("paralegal_forms").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ submission: data });
});

export default router; 