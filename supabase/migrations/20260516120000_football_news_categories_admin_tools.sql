insert into public.categories (name, slug, description)
values
  ('Copa do Mundo', 'copa-do-mundo', 'Noticias principais da Copa do Mundo 2026'),
  ('Selecoes', 'selecoes', 'Noticias sobre selecoes nacionais'),
  ('Jogos', 'jogos', 'Previews, calendario e cobertura dos jogos'),
  ('Resultados', 'resultados', 'Resultados, marcadores e resumo dos jogos'),
  ('Analises', 'analises', 'Analise tatica e leitura dos jogos'),
  ('Mercado da Bola', 'mercado-da-bola', 'Movimentos e rumores relevantes para selecoes e jogadores')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

grant select, insert, update, delete on public.categories, public.tags, public.news_post_tags to authenticated;

create policy "Editors can manage categories" on public.categories
  for all to authenticated
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

create policy "Editors can manage tags" on public.tags
  for all to authenticated
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

create policy "Editors can manage post tags" on public.news_post_tags
  for all to authenticated
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
