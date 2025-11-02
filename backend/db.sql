-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ads table - stores main ad info and final video
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null,
  product_description text not null,
  duration integer not null,
  final_video_url text,
  final_video_duration integer,
  status text default 'processing' check (status in ('processing', 'completed', 'failed')),
  total_cost_estimate decimal(10,4) default 0.00
);

-- Helpful indexes
create index if not exists ads_user_id_idx on public.ads(user_id);
create index if not exists ads_status_idx on public.ads(status);
create index if not exists ads_created_at_idx on public.ads(created_at);

-- Row Level Security (RLS) policies
alter table public.ads enable row level security;

-- Users can only see their own ads
create policy "Users can view own ads" on public.ads
  for select using (auth.uid() = user_id);

create policy "Users can insert own ads" on public.ads
  for insert with check (auth.uid() = user_id);

create policy "Users can update own ads" on public.ads
  for update using (auth.uid() = user_id);

create policy "Users can delete own ads" on public.ads
  for delete using (auth.uid() = user_id);
