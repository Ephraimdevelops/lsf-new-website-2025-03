import dotenv from 'dotenv';
import { supabaseAdmin } from '../src/supabaseClient.js';

// Load .env if present (for local runs)
dotenv.config();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@lsf.org';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'lsfadmin';
const ADMIN_ROLE = 'admin';

async function main() {
  try {
    console.log('Looking for existing user with email:', ADMIN_EMAIL);

    // List users and find by email
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existing = listData.users.find(u => u.email === ADMIN_EMAIL);

    if (existing) {
      console.log('User already exists. Ensuring role and profile are set. id=', existing.id);

      // Update user metadata with admin role
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        user_metadata: { ...(existing.user_metadata || {}), role: ADMIN_ROLE },
        app_metadata: { ...(existing.app_metadata || {}), role: ADMIN_ROLE }
      });
      if (updateError) throw updateError;

      // Upsert profiles table
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({ id: existing.id, role: ADMIN_ROLE }, { onConflict: 'id' });
      if (profileError) throw profileError;

      console.log('Existing user updated and profile upserted.');
      return;
    }

    // Create new user
    console.log('Creating new admin user...');
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: ADMIN_ROLE },
      app_metadata: { role: ADMIN_ROLE }
    });

    if (error) throw error;

    const userId = data.user?.id;
    console.log('Created user id=', userId);

    if (userId) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({ id: userId, role: ADMIN_ROLE }, { onConflict: 'id' });
      if (profileError) throw profileError;
      console.log('Profile created/updated for admin user.');
    }

    console.log('Admin seeding complete.');
  } catch (err: any) {
    console.error('Error seeding admin user:', err.message || err);
    process.exit(1);
  }
}

main();
