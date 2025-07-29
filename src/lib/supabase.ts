import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vegjzxfdpnwqvyhvkwdj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ2p6eGZkcG53cXZ5aHZrd2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODUyODksImV4cCI6MjA2ODA2MTI4OX0.lAkD9yo4-rPdBcnFOy4WvZw9UY7aWtnTcByJfG-is0o';

export const supabase = createClient(supabaseUrl, supabaseKey);
