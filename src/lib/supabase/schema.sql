-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.giveaways enable row level security;
alter table public.entries enable row level security;
alter table public.prizes enable row level security;

-- Create enum types
create type public.user_role as enum ('admin', 'moderator');
create type public.giveaway_status as enum ('pending', 'active', 'completed', 'cancelled');

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade,
  twitch_id text unique,
  twitch_login text unique,
  display_name text,
  role user_role default 'moderator',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Giveaways table
create table public.giveaways (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  prize text not null,
  requirements text,
  status giveaway_status default 'pending',
  duration_minutes integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Entries table
create table public.entries (
  id uuid default gen_random_uuid() primary key,
  giveaway_id uuid references public.giveaways(id) on delete cascade,
  twitch_username text not null,
  twitch_id text,
  is_winner boolean default false,
  entered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prizes table (for tracking inventory)
create table public.prizes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  description text,
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Users policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Giveaways policies
create policy "Anyone can view active giveaways"
  on public.giveaways for select
  using (status = 'active');

create policy "Users can view all their giveaways"
  on public.giveaways for select
  using (auth.uid() = user_id);

create policy "Users can create giveaways"
  on public.giveaways for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own giveaways"
  on public.giveaways for update
  using (auth.uid() = user_id);

create policy "Users can delete their own giveaways"
  on public.giveaways for delete
  using (auth.uid() = user_id);

-- Entries policies
create policy "Anyone can view entries for active giveaways"
  on public.entries for select
  using (
    exists (
      select 1 from public.giveaways
      where id = entries.giveaway_id
      and status = 'active'
    )
  );

create policy "Users can view entries for their giveaways"
  on public.entries for select
  using (
    exists (
      select 1 from public.giveaways
      where id = entries.giveaway_id
      and user_id = auth.uid()
    )
  );

create policy "Anyone can create entries for active giveaways"
  on public.entries for insert
  with check (
    exists (
      select 1 from public.giveaways
      where id = entries.giveaway_id
      and status = 'active'
    )
  );

-- Prizes policies
create policy "Users can view their own prizes"
  on public.prizes for select
  using (auth.uid() = user_id);

create policy "Users can create prizes"
  on public.prizes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prizes"
  on public.prizes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own prizes"
  on public.prizes for delete
  using (auth.uid() = user_id);

-- Functions

-- Function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = user_id
    and role = 'admin'
  );
$$ language sql security definer;

-- Function to check if user is moderator or admin
create or replace function public.is_moderator_or_admin(user_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = user_id
    and role in ('moderator', 'admin')
  );
$$ language sql security definer;

-- Triggers

-- Update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_giveaways_updated_at
  before update on public.giveaways
  for each row
  execute function public.handle_updated_at();

create trigger handle_prizes_updated_at
  before update on public.prizes
  for each row
  execute function public.handle_updated_at(); 