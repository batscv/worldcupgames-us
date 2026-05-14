"use client";

import { useEffect, useMemo, useState } from "react";
import { DatabaseZap, RefreshCcw, ShieldCheck } from "lucide-react";

type ApiMatch = {
  id: number;
  utcDate: string;
  status: string;
  competition?: {
    name?: string;
    code?: string;
  };
  homeTeam?: {
    name?: string;
    shortName?: string;
    tla?: string;
  };
  awayTeam?: {
    name?: string;
    shortName?: string;
    tla?: string;
  };
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
};

type ApiResponse = {
  matches?: ApiMatch[];
  resultSet?: {
    count?: number;
  };
  error?: string;
  message?: string;
};

const fallbackMatches: ApiMatch[] = [
  {
    id: 1,
    utcDate: "2026-06-18T20:00:00Z",
    status: "SCHEDULED",
    competition: { name: "FIFA World Cup", code: "WC" },
    homeTeam: { shortName: "United States", tla: "USA" },
    awayTeam: { shortName: "Brazil", tla: "BRA" },
  },
  {
    id: 2,
    utcDate: "2026-06-21T19:00:00Z",
    status: "SCHEDULED",
    competition: { name: "FIFA World Cup", code: "WC" },
    homeTeam: { shortName: "France", tla: "FRA" },
    awayTeam: { shortName: "Argentina", tla: "ARG" },
  },
];

export function LiveApiPanel() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const matches = useMemo(() => {
    return data?.matches?.length ? data.matches.slice(0, 4) : fallbackMatches;
  }, [data]);

  async function loadMatches() {
    setLoading(true);
    try {
      const response = await fetch("/api/football-data/matches?competitions=WC", {
        headers: { Accept: "application/json" },
      });
      const payload = (await response.json()) as ApiResponse;
      setData(payload);
      setRefreshedAt(new Date());
    } catch {
      setData({ error: "Football Data API is unavailable in local static preview." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMatches();
  }, []);

  return (
    <section className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <DatabaseZap className="size-4" />
            Football-data.org live API
          </p>
          <h2 className="mt-2 text-2xl font-bold">Connected match feed</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Server-side proxy keeps the API token private while the frontend reads live football data.
          </p>
        </div>
        <button
          onClick={loadMatches}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 text-sm font-semibold transition hover:bg-white/12"
        >
          <RefreshCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {matches.map((match) => (
          <article key={match.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-semibold text-blue-200">
                {match.competition?.code || "WC"}
              </span>
              <span className="text-xs text-zinc-500">{match.status}</span>
            </div>
            <p className="text-sm font-semibold">{match.homeTeam?.shortName || match.homeTeam?.name}</p>
            <p className="mt-1 text-sm font-semibold">{match.awayTeam?.shortName || match.awayTeam?.name}</p>
            <p className="mt-4 text-xs text-zinc-500">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(match.utcDate))}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
          <ShieldCheck className="size-3.5 text-emerald-300" />
          Token protected by Cloudflare env
        </span>
        {refreshedAt && <span>Last sync {refreshedAt.toLocaleTimeString()}</span>}
        {data?.error && <span className="text-amber-300">{data.error}</span>}
        {data?.message && <span className="text-amber-300">{data.message}</span>}
      </div>
    </section>
  );
}
