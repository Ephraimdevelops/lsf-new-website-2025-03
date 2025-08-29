import { Router } from "express";
import rateLimit from "express-rate-limit";
import { supabase, supabaseAdmin } from "../supabaseClient.js";

const router = Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many login attempts, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for signup attempts
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 signup attempts per hour
  message: {
    error: "Too many signup attempts, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /auth/signup
router.post("/signup", signupLimiter, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ 
        error: "Email, password, and role are required." 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Please provide a valid email address." 
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long." 
      });
    }

    // Validate role
    const validRoles = ['admin', 'staff', 'paralegal', 'stakeholder'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: "Invalid role. Must be one of: admin, staff, paralegal, stakeholder" 
      });
    }

    // Supabase sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
      },
    });

    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (data.user && !data.session) {
      // Email confirmation required
      return res.status(200).json({ 
        message: "Please check your email to confirm your account.",
        user: data.user 
      });
    }

    res.json({ 
      message: "Account created successfully",
      user: data.user 
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
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required." 
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data.session || !data.user) {
      return res.status(400).json({ 
        error: "Login failed. Please try again." 
      });
    }

    // Get user role
    const userRole = data.user.user_metadata?.role || data.user.app_metadata?.role || 'user';

    res.json({ 
      session: data.session, 
      user: data.user,
      role: userRole
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: "Internal server error during login" 
    });
  }
});

// GET /auth/me (get current user info)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Get user error:', error);
      return res.status(401).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Get user role
    const userRole = data.user.user_metadata?.role || data.user.app_metadata?.role || 'user';

    res.json({ 
      user: data.user,
      role: userRole
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
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const { error } = await supabase.auth.admin.signOut(token);
    
    if (error) {
      console.error('Logout error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: "Internal server error during logout" 
    });
  }
});

// POST /auth/refresh (refresh token)
router.post("/refresh", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ 
        error: "Refresh token is required." 
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      console.error('Refresh error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ 
      error: "Internal server error during token refresh" 
    });
  }
});

export default router; 