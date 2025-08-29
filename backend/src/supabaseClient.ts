// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;  // Changed from SUPABASE_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL:", supabaseUrl ? "✓ Loaded" : "✗ Missing");
console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Loaded" : "✗ Missing");
console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓ Loaded" : "✗ Missing");

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});