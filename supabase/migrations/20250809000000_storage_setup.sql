-- Create buckets for different content types
insert into storage.buckets (id, name, public)
values 
  -- Main content buckets
  ('hero-slides', 'hero-slides', true),
  ('news', 'news', true),
  ('publications', 'publications', true),
  ('success-stories', 'success-stories', true),
  ('resources', 'resources', true),
  ('team', 'team', true),
  ('board', 'board', true),
  -- Additional content buckets
  ('partners', 'partners', true),           -- For partner logos
  ('programs', 'programs', true),           -- For program images
  ('gallery', 'gallery', true),             -- For general gallery images
  ('testimonials', 'testimonials', true),   -- For testimonial images
  ('documents', 'documents', true),         -- For downloadable documents
  ('approach', 'approach', true),           -- For approach-related images
  ('blog', 'blog', true)                    -- For blog post images
on conflict (id) do nothing;

-- Drop existing policies if they exist
drop policy if exists "Allow admin full access" on storage.objects;
drop policy if exists "Allow public read access" on storage.objects;

-- Set up storage policies for authenticated users (admin role)
create policy "Allow admin full access"
  on storage.objects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Set up public read access for all buckets
create policy "Allow public read access"
  on storage.objects
  for select
  using ( bucket_id in (
    'hero-slides', 'news', 'publications', 'success-stories', 
    'resources', 'team', 'board', 'partners', 'programs', 
    'gallery', 'testimonials', 'documents', 'approach', 'blog'
  ));
