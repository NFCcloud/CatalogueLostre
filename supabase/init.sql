-- Create menu_items table
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  price decimal(10,2) not null check (price >= 0),
  category text not null,
  image_url text,
  is_active boolean default true,
  sort_order bigint default extract(epoch from now()),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table menu_items enable row level security;

-- Policies for menu_items table
create policy "Public can view menu items"
on menu_items for select
to authenticated, anon
using (true);

create policy "Authenticated users can manage menu items"
on menu_items for all
to authenticated
using (true)
with check (true);

-- Storage bucket policies
create policy "menu_images_policy"
on storage.objects for all using (
  -- Restrict to menu-images bucket
  bucket_id = 'menu-images'
  -- Allow common image formats
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
  -- Restrict to menu-images folder
  AND LOWER((storage.foldername(name))[1]) = 'menu-images'
  -- Allow both anonymous and authenticated access
  AND (auth.role() IN ('anon', 'authenticated'))
  -- Limit file size to 5MB
  AND octet_length(content) < 5242880
);

-- Create categories enum
create type menu_category as enum (
  'Ορεκτικά',
  'Σαλάτες',
  'Κυρίως Πιάτα',
  'Επιδόρπια',
  'Ποτά'
);

-- Add category validation
alter table menu_items
add constraint valid_category check (
  category = any(enum_range(null::menu_category)::text[])
);
