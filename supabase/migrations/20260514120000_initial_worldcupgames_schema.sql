create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  favorite_team_id uuid,
  points integer not null default 0,
  role text not null default 'user' check (role in ('user', 'editor', 'admin')),
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code text not null unique,
  flag_emoji text,
  fifa_rank integer,
  rating numeric(5,2),
  created_at timestamptz not null default now()
);

alter table public.users
  add constraint users_favorite_team_id_fkey foreign key (favorite_team_id) references public.teams(id) on delete set null;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  featured_image_url text,
  content jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  seo_title text,
  seo_description text,
  og_image_url text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news_post_tags (
  post_id uuid references public.news_posts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  home_team_id uuid not null references public.teams(id) on delete restrict,
  away_team_id uuid not null references public.teams(id) on delete restrict,
  venue text,
  city text,
  kickoff_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished', 'postponed')),
  home_score integer not null default 0,
  away_score integer not null default 0,
  stats jsonb not null default '{}'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  formations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  model_version text not null,
  home_win_probability numeric(5,2) not null,
  draw_probability numeric(5,2) not null,
  away_win_probability numeric(5,2) not null,
  expected_home_goals numeric(4,2),
  expected_away_goals numeric(4,2),
  confidence numeric(5,2),
  key_players jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.standings (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  team_id uuid not null references public.teams(id) on delete cascade,
  played integer not null default 0,
  won integer not null default 0,
  drawn integer not null default 0,
  lost integer not null default 0,
  goals_for integer not null default 0,
  goals_against integer not null default 0,
  points integer not null default 0,
  unique (group_name, team_id)
);

create table public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('streaming', 'sportsbook', 'vpn', 'tickets', 'newsletter')),
  destination_url text not null,
  country_code text,
  cta_label text not null default 'Learn more',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.advertisements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  placement text not null,
  network text not null default 'adsense',
  code text,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  body text,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  post_id uuid references public.news_posts(id) on delete cascade,
  match_id uuid references public.matches(id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible', 'hidden', 'flagged')),
  created_at timestamptz not null default now(),
  check (post_id is not null or match_id is not null)
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  pick text not null check (pick in ('home', 'draw', 'away')),
  created_at timestamptz not null default now(),
  unique (user_id, match_id)
);

create table public.rankings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  season text not null default 'world-cup-2026',
  points integer not null default 0,
  correct_picks integer not null default 0,
  streak integer not null default 0,
  unique (user_id, season)
);

alter table public.users enable row level security;
alter table public.teams enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.news_posts enable row level security;
alter table public.news_post_tags enable row level security;
alter table public.matches enable row level security;
alter table public.predictions enable row level security;
alter table public.standings enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.advertisements enable row level security;
alter table public.notifications enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.rankings enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.teams, public.categories, public.tags, public.matches, public.predictions, public.standings, public.affiliate_links, public.advertisements to anon, authenticated;
grant select on public.news_posts, public.news_post_tags to anon, authenticated;
grant select, insert, update on public.comments, public.votes to authenticated;
grant select, insert, update on public.users, public.notifications, public.rankings to authenticated;

create policy "Public can read published posts" on public.news_posts
  for select using (status = 'published');

create policy "Public read teams" on public.teams for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read tags" on public.tags for select using (true);
create policy "Public read post tags" on public.news_post_tags for select using (true);
create policy "Public read matches" on public.matches for select using (true);
create policy "Public read predictions" on public.predictions for select using (true);
create policy "Public read standings" on public.standings for select using (true);
create policy "Public read active affiliates" on public.affiliate_links for select using (active);
create policy "Public read active ads" on public.advertisements for select using (active);

create policy "Users read own profile" on public.users for select using (auth.uid() = id);
create policy "Users update own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users manage own votes" on public.votes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read rankings" on public.rankings for select using (true);
create policy "Users manage own comments" on public.comments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
