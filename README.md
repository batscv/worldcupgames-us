# WorldCupGames.us

Premium AI-powered FIFA World Cup 2026 platform built with Next.js 15, React, TypeScript, Tailwind CSS, Shadcn-style UI primitives, Framer Motion, Lucide icons and Supabase-ready data modeling.

## Features

- Public homepage with hero, live matches, AI probabilities, news, standings, rankings, affiliates and newsletter.
- SEO news pages at `/news/[slug]` with metadata, reading time, tags, related articles, social sharing and ad slots.
- Prediction pages at `/predictions/[slug]` with circular probability charts, confidence meter, fan voting and affiliate CTA.
- Watch guide pages at `/watch/[slug]` for streaming, broadcaster, VPN and kickoff-time SEO traffic.
- Match center, tournament simulator, login/user entry and Vercel/Supabase-style admin CMS.
- Sitemap, robots, OpenGraph metadata and Supabase migration with RLS policies.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Cloudflare Pages

Use these settings:

```txt
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Node version: 22
```

The project is configured with `output: "export"` so Cloudflare publishes the static `out` folder instead of uploading `.next` build cache files.

## Supabase

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Apply the schema in `supabase/migrations/20260514120000_initial_worldcupgames_schema.sql` to create users, teams, news posts, matches, predictions, standings, affiliate links, ads, notifications, comments, votes, rankings, categories and tags.

## Verification

```bash
npm run lint
npm run build
```
