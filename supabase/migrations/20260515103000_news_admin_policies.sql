create policy "Editors can read all posts" on public.news_posts
  for select to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = (select auth.uid())
      and users.role in ('admin', 'editor')
    )
  );

create policy "Editors can insert posts" on public.news_posts
  for insert to authenticated
  with check (
    exists (
      select 1 from public.users
      where users.id = (select auth.uid())
      and users.role in ('admin', 'editor')
    )
  );

create policy "Editors can update posts" on public.news_posts
  for update to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = (select auth.uid())
      and users.role in ('admin', 'editor')
    )
  )
  with check (
    exists (
      select 1 from public.users
      where users.id = (select auth.uid())
      and users.role in ('admin', 'editor')
    )
  );

create policy "Editors can delete posts" on public.news_posts
  for delete to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = (select auth.uid())
      and users.role in ('admin', 'editor')
    )
  );
