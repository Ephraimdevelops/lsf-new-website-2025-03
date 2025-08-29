import { Router } from "express";
import { requireRole } from "../middleware/roleAuth.js";
import { supabaseAdmin } from "../supabaseClient.js";

const router = Router();

// GET /users - list all users (admin only)
router.get("/", requireRole(["admin"]), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('List users error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Filter out sensitive information and format user data
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || user.app_metadata?.role || 'user',
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      banned_until: user.banned_until,
      deleted_at: user.deleted_at
    }));

    res.json({ 
      users,
      total: users.length
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ 
      error: "Internal server error while fetching users" 
    });
  }
});

// GET /users/:id - get specific user (admin only)
router.get("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
    
    if (error) {
      console.error('Get user error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out sensitive information
    const user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || data.user.app_metadata?.role || 'user',
      email_confirmed_at: data.user.email_confirmed_at,
      created_at: data.user.created_at,
      last_sign_in_at: data.user.last_sign_in_at,
      banned_until: data.user.banned_until,
      deleted_at: data.user.deleted_at
    };

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: "Internal server error while fetching user" 
    });
  }
});

// PATCH /users/:id/role - update user role (admin only)
router.patch("/:id/role", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    // Validate role
    const validRoles = ['admin', 'staff', 'paralegal', 'stakeholder', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: "Invalid role. Must be one of: admin, staff, paralegal, stakeholder, user" 
      });
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });

    if (error) {
      console.error('Update user role error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: "User role updated successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ 
      error: "Internal server error while updating user role" 
    });
  }
});

// PATCH /users/:id/ban - ban user (admin only)
router.patch("/:id/ban", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { banned_until } = req.body; // ISO string or null to unban
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      banned_until: banned_until || null,
    });

    if (error) {
      console.error('Ban user error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: banned_until ? "User banned successfully" : "User unbanned successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        banned_until: data.user.banned_until
      }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ 
      error: "Internal server error while banning user" 
    });
  }
});

// DELETE /users/:id - delete user (admin only)
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (error) {
      console.error('Delete user error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: "Internal server error while deleting user" 
    });
  }
});

// POST /users/:id/invite - invite user (admin only)
router.post("/:id/invite", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = 'stakeholder' } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Validate role
    const validRoles = ['admin', 'staff', 'paralegal', 'stakeholder'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: "Invalid role. Must be one of: admin, staff, paralegal, stakeholder" 
      });
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { role },
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
    });

    if (error) {
      console.error('Invite user error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: "User invited successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ 
      error: "Internal server error while inviting user" 
    });
  }
});

// GET /users/stats - get user statistics (admin only)
router.get("/stats", requireRole(["admin"]), async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Get user stats error:', error);
      return res.status(500).json({ error: error.message });
    }

    const users = data.users;
    const stats = {
      total: users.length,
      confirmed: users.filter(u => u.email_confirmed_at).length,
      unconfirmed: users.filter(u => !u.email_confirmed_at).length,
      banned: users.filter(u => u.banned_until).length,
      deleted: users.filter(u => u.deleted_at).length,
      byRole: {
        admin: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'admin').length,
        staff: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'staff').length,
        paralegal: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'paralegal').length,
        stakeholder: users.filter(u => (u.user_metadata?.role || u.app_metadata?.role) === 'stakeholder').length,
        user: users.filter(u => !(u.user_metadata?.role || u.app_metadata?.role) || (u.user_metadata?.role || u.app_metadata?.role) === 'user').length,
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      error: "Internal server error while fetching user statistics" 
    });
  }
});

export default router; 