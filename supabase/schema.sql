-- Pottery Studio Tracker schema
-- Run this in your Supabase SQL editor

create table pieces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  stage text not null default 'forming' check (stage in ('forming','drying','bisque_fired','glazing','glaze_fired','complete')),
  forming_method text,
  clay_body text,
  height_cm numeric,
  width_cm numeric,
  depth_cm numeric,
  weight_grams numeric,
  firing_type text,
  bisque_temp_c numeric,
  glaze_temp_c numeric,
  cone text,
  surface_layers jsonb not null default '[]',
  tags text[] not null default '{}',
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table piece_photos (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid references pieces(id) on delete cascade,
  url text not null,
  caption text,
  stage_at_capture text,
  created_at timestamptz not null default now()
);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  default_clay_body text,
  default_forming_method text,
  default_firing_type text,
  default_cone text,
  favorite_clay_bodies jsonb not null default '[]',
  favorite_surface_products jsonb not null default '[]',
  default_surface_layers jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row level security
alter table pieces enable row level security;
alter table piece_photos enable row level security;
alter table user_preferences enable row level security;

create policy "Users own their pieces" on pieces for all using (auth.uid() = user_id);
create policy "Users own their photos via piece" on piece_photos for all
  using (exists (select 1 from pieces where pieces.id = piece_photos.piece_id and pieces.user_id = auth.uid()));
create policy "Users own their preferences" on user_preferences for all using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger pieces_updated_at before update on pieces for each row execute function update_updated_at();
create trigger prefs_updated_at before update on user_preferences for each row execute function update_updated_at();
