delete from public.api_sync_runs
where resource = 'bootstrap';

delete from public.advertisements
where code in (
  'adsense-homepage-native',
  'adsense-article-mid',
  'direct-match-center-sponsor'
);

delete from public.affiliate_links
where destination_url like 'https://example.com/%';

delete from public.tags
where slug in (
  'ai-model',
  'world-cup-2026',
  'streaming',
  'predictions',
  'match-preview',
  'live-scores'
);

delete from public.categories
where slug in (
  'predictions',
  'watch-guides',
  'tactics',
  'news'
);
