import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../supabaseClient.js";

export function requireRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // Validate token and retrieve user using the service-role client
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = userData.user;

    try {
      // Prefer server-controlled profiles table for authoritative role
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // Non-not-found errors should surface
        console.error('Profile lookup error:', profileError);
      }

      const userRole = profile?.role || user.user_metadata?.role || user.app_metadata?.role || (user as any).role;

      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      // Attach user info to request for downstream handlers
      (req as any).user = user;
      next();
    } catch (err) {
      console.error('Role check error:', err);
      return res.status(500).json({ error: 'Internal server error during role check' });
    }
  };
}