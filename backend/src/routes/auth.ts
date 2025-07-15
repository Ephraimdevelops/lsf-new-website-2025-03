import { Router } from "express";
import { supabase } from "../supabaseClient.js";

const router = Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required." });
  }
  // Supabase sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
    },
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ user: data.user });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ session: data.session, user: data.user });
});

// GET /auth/me (get current user info)
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  res.json({ user: data.user });
});

export default router; 