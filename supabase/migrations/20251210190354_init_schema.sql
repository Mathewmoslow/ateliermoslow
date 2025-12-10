-- Initial schema for Atelier Moslow
-- Tables: profiles, projects, documents
-- RLS: user-owned rows only

-- Enable uuid generation
create extension if not exists "pgcrypto";

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Profiles (one per auth user)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  voice_profile jsonb,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (id = auth.uid());

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (id = auth.uid());

create policy "Profiles are deletable by owner"
  on public.profiles for delete
  using (id = auth.uid());

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc', now()) not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null
);

create index projects_user_id_idx on public.projects(user_id);

create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

alter table public.projects enable row level security;

create policy "Projects are viewable by owner"
  on public.projects for select
  using (user_id = auth.uid());

create policy "Projects are insertable by owner"
  on public.projects for insert
  with check (user_id = auth.uid());

create policy "Projects are updatable by owner"
  on public.projects for update
  using (user_id = auth.uid());

create policy "Projects are deletable by owner"
  on public.projects for delete
  using (user_id = auth.uid());

-- Documents
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content jsonb default '{}'::jsonb,
  plaintext text,
  summary text,
  word_count integer default 0,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc', now()) not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null
);

create index documents_user_id_idx on public.documents(user_id);
create index documents_project_id_idx on public.documents(project_id);

create trigger documents_set_updated_at
before update on public.documents
for each row execute procedure public.set_updated_at();

alter table public.documents enable row level security;

create policy "Documents are viewable by owner"
  on public.documents for select
  using (user_id = auth.uid());

create policy "Documents are insertable by owner"
  on public.documents for insert
  with check (user_id = auth.uid());

create policy "Documents are updatable by owner"
  on public.documents for update
  using (user_id = auth.uid());

create policy "Documents are deletable by owner"
  on public.documents for delete
  using (user_id = auth.uid());

-- Optional: ensure project ownership matches user_id on insert/update
create or replace function public.enforce_project_ownership()
returns trigger as $$
declare
  project_owner uuid;
begin
  if new.project_id is null then
    return new;
  end if;

  select user_id into project_owner from public.projects where id = new.project_id;
  if project_owner is null or project_owner <> new.user_id then
    raise exception 'Project does not belong to user';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger documents_project_owner_check
before insert or update on public.documents
for each row execute procedure public.enforce_project_ownership();
