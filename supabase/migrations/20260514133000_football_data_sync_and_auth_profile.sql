create schema if not exists app_private;

alter table public.teams
  add column if not exists football_data_id integer unique,
  add column if not exists short_name text,
  add column if not exists tla text,
  add column if not exists crest_url text,
  add column if not exists api_payload jsonb not null default '{}'::jsonb,
  add column if not exists last_synced_at timestamptz;

alter table public.matches
  add column if not exists football_data_id integer unique,
  add column if not exists competition_code text,
  add column if not exists stage text,
  add column if not exists group_name text,
  add column if not exists matchday integer,
  add column if not exists api_status text,
  add column if not exists api_payload jsonb not null default '{}'::jsonb,
  add column if not exists last_synced_at timestamptz;

create table if not exists public.api_sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'football-data.org',
  resource text not null,
  status text not null check (status in ('success', 'failed', 'partial')),
  records_processed integer not null default 0,
  message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.api_sync_runs enable row level security;

grant select on public.api_sync_runs to authenticated;

create policy "Authenticated users can read sync runs" on public.api_sync_runs
  for select to authenticated using (true);

create or replace function app_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, username, display_name, avatar_url)
  values (
    new.id,
    split_part(new.email, '@', 1),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.rankings (user_id)
  values (new.id)
  on conflict (user_id, season) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_worldcup_profile on auth.users;

create trigger on_auth_user_created_create_worldcup_profile
after insert on auth.users
for each row execute function app_private.handle_new_auth_user();
