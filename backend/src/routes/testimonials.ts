import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabase } from "../supabaseClient.js";

const router = Router();

// GET /testimonials - list all testimonials
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("testimonials").select("*").order("order", { ascending: true });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ testimonials: data });
});

// GET /testimonials/:id - get testimonial by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).single();
  if (error) {
    return res.status(404).json({ error: error.message });
  }
  res.json({ testimonial: data });
});

// POST /testimonials - create testimonial (admin only)
router.post("/", requireRole(["admin"]), async (req, res) => {
  const { data, error } = await supabase.from("testimonials").insert([req.body]).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ testimonial: data });
});

// PUT /testimonials/:id - update testimonial (admin only)
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("testimonials").update(req.body).eq("id", id).select().single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ testimonial: data });
});

// DELETE /testimonials/:id - delete testimonial (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).send();
});

export default router; 