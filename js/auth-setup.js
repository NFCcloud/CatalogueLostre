// Admin credentials
export const ADMIN_EMAIL = 'dpsd18108@aegean.gr';
export const ADMIN_PASSWORD = 'admin';  // Make sure to change this in production

// Supabase setup function
import { supabase } from './supabase-config.js';

export async function setupAdminUser() {
  try {
    // Check if admin already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .single();

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signUpError) throw signUpError;

    // Set admin role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (updateError) throw updateError;

    console.log('Admin user created successfully');
    return user;

  } catch (error) {
    console.error('Error setting up admin:', error);
    throw error;
  }
}
