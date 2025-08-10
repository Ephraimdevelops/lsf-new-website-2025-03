import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the backend root directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;  // Using service role key for admin operations

// Debug logging (remove in production)
console.log("Loading environment variables...");
console.log("SUPABASE_URL:", supabaseUrl ? "✓ Loaded" : "✗ Missing");
console.log("SUPABASE_KEY:", supabaseKey ? "✓ Loaded" : "✗ Missing");

if (!supabaseUrl || !supabaseKey) {
  console.error("Environment variables not loaded properly:");
  console.error("SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_KEY:", supabaseKey ? "Present" : "Missing");
  throw new Error("Missing Supabase environment variables. Make sure .env file exists in backend directory.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});