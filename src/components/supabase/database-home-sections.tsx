"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Database, FileText, Radio, Shield, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase";

type DbTeam = {
  id: string;
  name: string;
  short_name: string | null;
  tla: string | null;
  crest_url: string | null;
};

type DbMatch = {
  id: string;
  slug: string;
  kickoff_at: string | null;
  status: string;
  api_status: string | null;
  stage: string | null;
  group_name: string | null;
  api_payload: {
    score?: {
      fullTime?: {
        home?: number | null;
        away?: number | null;
      };
    };
  } | null;
  home_team: DbTeam | null;
  away_team: DbTeam | null;
};

type DbNewsPost = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  published_at: string | null;
};

type DbStanding = {
  id: string;
  group_name: string;
  points: number;
  goals_for: number;
  goals_against: number;
  team: DbTeam | null;
};

type DbAffiliate = {
  id: string;
  name: string;
  category: string;
  cta_label: string;
  destination_url: string;
};

type HomeState = {
  matches: DbMatch[];
  posts: DbNewsPost[];
  standings: DbStanding[];
  affiliates: DbAffiliate[];
  ads: number;
  loading: boolean;
  error: string | null;
};

const initialState: HomeState = {
  matches: [],
  posts: [],
  standings: [],
  affiliates: [],
  ads: 0,
  loading: true,
  error: null,
};

function teamLabel(team: DbTeam | null) {
  return team?.short_name || team?.name || "TBD";
}

function scoreLabel(match: DbMatch) {
  const home = match.api_payload?.score?.fullTime?.home;
  const away = match.api_payload?.score?.fullTime?.away;
  return home === null || home === undefined || away === null || away === undefined ? "— - —" : `${home} - ${away}`;
}

function dateLabel(value: string | null) {
  if (!value) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function DatabaseHomeSections() {
  const [state, setState] = useState<HomeState>(initialState);

  const stats = useMemo(
    () => [
      ["DB matches", state.matches.length.toString(), Radio],
      ["Published posts", state.posts.length.toString(), FileText],
      ["Standings rows", state.standings.length.toString(), Trophy],
      ["Active offers", state.affiliates.length.toString(), Shield],
    ],
    [state.affiliates.length, state.matches.length, state.posts.length, state.standings.length],
  );

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      if (!supabase) {
        setState({
          ...initialState,
          loading: false,
          error: "Supabase environment variables are not configured.",
        });
        return;
      }

      const [matchesResult, postsResult, standingsResult, affiliatesResult, adsResult] = await Promise.all([
        supabase
          .from("matches")
          .select(
            "id, slug, kickoff_at, status, api_status, stage, group_name, api_payload, home_team:teams!matches_home_team_id_fkey(id,name,short_name,tla,crest_url), away_team:teams!matches_away_team_id_fkey(id,name,short_name,tla,crest_url)",
          )
          .order("kickoff_at", { ascending: true })
          .limit(8),
        supabase
          .from("news_posts")
          .select("id,title,slug,subtitle,published_at")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(6),
        supabase
          .from("standings")
          .select("id,group_name,points,goals_for,goals_against,team:teams(id,name,short_name,tla,crest_url)")
          .order("group_name", { ascending: true })
          .order("points", { ascending: false })
          .limit(12),
        supabase
          .from("affiliate_links")
          .select("id,name,category,cta_label,destination_url")
          .eq("active", true)
          .limit(4),
        supabase.from("advertisements").select("id", { count: "exact", head: true }).eq("active", true),
      ]);

      const error =
        matchesResult.error?.message ||
        postsResult.error?.message ||
        standingsResult.error?.message ||
        affiliatesResult.error?.message ||
        adsResult.error?.message ||
        null;

      setState({
        matches: (matchesResult.data || []) as unknown as DbMatch[],
        posts: (postsResult.data || []) as DbNewsPost[],
        standings: (standingsResult.data || []) as unknown as DbStanding[],
        affiliates: (affiliatesResult.data || []) as DbAffiliate[],
        ads: adsResult.count || 0,
        loading: false,
        error,
      });
    }

    void load();
  }, []);

  return (
    <div className="space-y-10">
      {state.error ? (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          {state.error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
            <Icon className="mb-4 size-5 text-blue-300" />
            <p className="text-3xl font-black">{state.loading ? "…" : (value as string)}</p>
            <p className="mt-1 text-sm text-zinc-400">{label as string}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Matches from Supabase</h2>
            <span className="flex items-center gap-2 text-sm text-zinc-400">
              <Database className="size-4 text-emerald-300" />
              public.matches
            </span>
          </div>
          {state.matches.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {state.matches.map((match) => (
                <article key={match.id} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                      {match.api_status || match.status}
                    </span>
                    <span className="text-xs text-zinc-500">{match.group_name || match.stage || "WC"}</span>
                  </div>
                  <TeamLine team={match.home_team} />
                  <TeamLine team={match.away_team} />
                  <div className="my-5 rounded-2xl bg-black/20 p-4 text-center">
                    <p className="text-3xl font-black">{scoreLabel(match)}</p>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-zinc-400">
                    <CalendarClock className="size-4 text-blue-300" />
                    {dateLabel(match.kickoff_at)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No matches in database" copy="Run the football-data sync to populate public.matches." />
          )}
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
          <h3 className="font-bold">Standings from Supabase</h3>
          <div className="mt-5 space-y-2">
            {state.standings.length ? (
              state.standings.map((row, index) => (
                <div key={row.id} className="grid grid-cols-[32px_1fr_52px] items-center rounded-2xl bg-white/5 px-3 py-3 text-sm">
                  <span className="text-zinc-500">{index + 1}</span>
                  <span className="truncate font-semibold">{teamLabel(row.team)}</span>
                  <span className="text-right font-bold">{row.points}</span>
                </div>
              ))
            ) : (
              <EmptyState title="No standings" copy="public.standings is empty." compact />
            )}
          </div>
        </div>
      </section>

      <section id="database-news" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Published news from Supabase</h2>
          {state.posts.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {state.posts.map((post) => (
                <article key={post.id} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
                  <p className="text-xs text-zinc-500">{post.published_at ? dateLabel(post.published_at) : "No date"}</p>
                  <h3 className="mt-3 text-lg font-bold">{post.title}</h3>
                  {post.subtitle && <p className="mt-2 text-sm leading-6 text-zinc-400">{post.subtitle}</p>}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No published posts" copy="Only rows from public.news_posts with status published will appear here." />
          )}
        </div>

        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
          <h2 className="font-bold">Monetization from Supabase</h2>
          <p className="mt-2 text-sm text-zinc-400">Active ads: {state.ads}</p>
          <div className="mt-5 grid gap-3">
            {state.affiliates.length ? (
              state.affiliates.map((item) => (
                <a key={item.id} href={item.destination_url} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.category}</p>
                </a>
              ))
            ) : (
              <EmptyState title="No active offers" copy="public.affiliate_links is empty." compact />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamLine({ team }: { team: DbTeam | null }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="grid size-10 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        {team?.crest_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.crest_url} alt="" className="size-7 object-contain" loading="lazy" />
        ) : (
          <Shield className="size-4 text-zinc-500" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{teamLabel(team)}</span>
        <span className="block text-xs text-zinc-500">{team?.tla || "TBD"}</span>
      </span>
    </div>
  );
}

function EmptyState({ title, copy, compact = false }: { title: string; copy: string; compact?: boolean }) {
  return (
    <div className={`rounded-[20px] border border-dashed border-white/15 bg-black/15 text-center ${compact ? "p-4" : "p-8"}`}>
      <p className="font-semibold text-zinc-200">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{copy}</p>
    </div>
  );
}
