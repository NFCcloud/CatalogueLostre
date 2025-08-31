-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create profiles policies
create policy "Public profiles are viewable by everyone"
on profiles for select using (true);

create policy "Users can update their own profile"
on profiles for update using (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert admin user (Run this in SQL editor after creating user through Supabase Auth)
-- Replace USER_ID with the actual UUID of your admin user
update profiles 
set role = 'admin' 
where id = 'USER_ID';
