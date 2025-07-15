import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// POST /analytics/view - record a website view
router.post("/view", async (req, res) => {
  const { page } = req.body;
  const { data, error } = await supabase.from("analytics_views").insert([{ page, timestamp: new Date().toISOString() }]);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ success: true });
});

// POST /analytics/download - record a download event
router.post("/download", async (req, res) => {
  const { resourceId } = req.body;
  const { data, error } = await supabase.from("analytics_downloads").insert([{ resource_id: resourceId, timestamp: new Date().toISOString() }]);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ success: true });
});

// GET /analytics/summary - fetch analytics summary (views, downloads)
router.get("/summary", async (req, res) => {
  // Total views
  const { count: viewCount, error: viewError } = await supabase.from("analytics_views").select("*", { count: "exact", head: true });
  // Total downloads
  const { count: downloadCount, error: downloadError } = await supabase.from("analytics_downloads").select("*", { count: "exact", head: true });
  if (viewError || downloadError) {
    return res.status(500).json({ error: viewError?.message || downloadError?.message });
  }
  res.json({ totalViews: viewCount, totalDownloads: downloadCount });
});

export default router; 