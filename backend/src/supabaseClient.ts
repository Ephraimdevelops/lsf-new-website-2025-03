import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

console.log("SUPABASE_URL:", supabaseUrl ? "✓ Loaded" : "✗ Missing");
console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Loaded" : "✗ Missing");
console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓ Loaded" : "✗ Missing");

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error("Environment variables not loaded properly:");
  console.error("SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "Missing");
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "Present" : "Missing");
  throw new Error("Missing Supabase environment variables. Make sure .env file exists in backend directory.");
}

// Client for regular operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Admin client for privileged operations (uses service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});