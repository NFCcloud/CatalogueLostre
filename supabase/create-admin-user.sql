-- First, enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to create a user with a custom password
CREATE OR REPLACE FUNCTION create_user_with_password(
  email_address text,
  raw_password text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Create the user in auth.users
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
    email_address,
    crypt(raw_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  )
  RETURNING id INTO user_id;

  -- Create profile for the user
  INSERT INTO public.profiles (id, role)
  VALUES (user_id, 'admin');

  RETURN user_id;
END;
$$;

-- Create the admin user
SELECT create_user_with_password('dpsd18108@aegean.gr', 'admin');

-- Verify the user was created
SELECT * FROM auth.users WHERE email = 'dpsd18108@aegean.gr';
SELECT * FROM public.profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'dpsd18108@aegean.gr');
