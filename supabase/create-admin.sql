-- Enable email/password auth
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the user directly (replace with actual password hash)
INSERT INTO auth.users (
  instance_id,
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  uuid_generate_v4(),
  'dpsd18108@aegean.gr',
  -- This is a placeholder, Supabase will handle the actual password
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated'
);

-- Make sure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'user'
);

-- Set admin role for the user
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'dpsd18108@aegean.gr'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
