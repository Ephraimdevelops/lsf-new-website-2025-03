// Updated src/routes/auth.ts - Auto-confirm users in development

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { supabase, supabaseAdmin } from "../supabaseClient.js";

const router = Router();

// Simple rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: "Too many signup attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /auth/signup
router.post("/signup", signupLimiter, async (req, res) => {
  try {
    const { email, password, role = 'stakeholder' } = req.body;
    
    console.log('Signup attempt:', { email, role });
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Please provide a valid email address" 
      });
    }

    // Basic password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long" 
      });
    }

    // Role validation
    const validRoles = ['admin', 'staff', 'paralegal', 'stakeholder'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      });
    }

    // Create user with admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Always auto-confirm for development
      user_metadata: { role }
    });

    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('User created successfully:', data.user?.id);

    res.status(201).json({ 
      message: "Account created and confirmed successfully",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.user_metadata?.role,
        email_confirmed: true
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: "Internal server error during signup" 
    });
  }
});

// POST /auth/login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    if (!data.session || !data.user) {
      return res.status(401).json({ 
        error: "Login failed. Please try again" 
      });
    }

    const userRole = data.user.user_metadata?.role || 'stakeholder';
    console.log('Login successful for:', email, 'Role:', userRole);

    res.json({ 
      message: "Login successful",
      session: data.session, 
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userRole,
        access_token: data.session.access_token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: "Internal server error during login" 
    });
  }
});

// GET /auth/me
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Get user error:', error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (!data.user) {
      return res.status(401).json({ error: "User not found" });
    }

    const userRole = data.user.user_metadata?.role || 'stakeholder';

    res.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userRole,
        created_at: data.user.created_at,
        email_confirmed_at: data.user.email_confirmed_at
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
});

// POST /auth/logout
router.post("/logout", async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: "Internal server error during logout" 
    });
  }
});

export default router;