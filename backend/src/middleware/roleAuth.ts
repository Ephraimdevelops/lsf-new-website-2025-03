import type { NextFunction, Request, Response } from "express";
import { supabase } from "../supabaseClient.js";

export function requireRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const userRole = data.user.user_metadata?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    // Attach user info to request for downstream handlers
    (req as any).user = data.user;
    next();
  };
} 