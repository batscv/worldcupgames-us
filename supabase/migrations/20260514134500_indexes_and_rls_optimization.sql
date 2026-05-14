create index if not exists idx_users_favorite_team_id on public.users(favorite_team_id);
create index if not exists idx_matches_home_team_id on public.matches(home_team_id);
create index if not exists idx_matches_away_team_id on public.matches(away_team_id);
create index if not exists idx_matches_kickoff_at on public.matches(kickoff_at);
create index if not exists idx_matches_competition_status on public.matches(competition_code, api_status);
create index if not exists idx_news_posts_category_id on public.news_posts(category_id);
create index if not exists idx_news_posts_author_id on public.news_posts(author_id);
create index if not exists idx_news_posts_status_published_at on public.news_posts(status, published_at desc);
create index if not exists idx_news_post_tags_tag_id on public.news_post_tags(tag_id);
create index if not exists idx_predictions_match_id on public.predictions(match_id);
create index if not exists idx_standings_team_id on public.standings(team_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_comments_user_id on public.comments(user_id);
create index if not exists idx_comments_post_id on public.comments(post_id);
create index if not exists idx_comments_match_id on public.comments(match_id);
create index if not exists idx_votes_match_id on public.votes(match_id);

drop policy if exists "Users read own profile" on public.users;
drop policy if exists "Users update own profile" on public.users;
drop policy if exists "Users read own notifications" on public.notifications;
drop policy if exists "Users manage own votes" on public.votes;
drop policy if exists "Users manage own comments" on public.comments;

create policy "Users read own profile" on public.users
  for select using ((select auth.uid()) = id);

create policy "Users update own profile" on public.users
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Users read own notifications" on public.notifications
  for select using ((select auth.uid()) = user_id);

create policy "Users manage own votes" on public.votes
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users manage own comments" on public.comments
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on schema app_private from public;
revoke execute on function app_private.handle_new_auth_user() from public, anon, authenticated;
