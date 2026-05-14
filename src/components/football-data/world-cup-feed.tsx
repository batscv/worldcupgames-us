"use client";

import { useEffect, useMemo, useState } from "react";
import { DatabaseZap, RefreshCcw, Search, ShieldCheck } from "lucide-react";
import type { FootballDataMatchesResponse } from "@/lib/football-data";
import { ApiMatchCard } from "./api-match-card";

const emptyResponse: FootballDataMatchesResponse = {
  matches: [],
};

export function WorldCupFeed() {
  const [data, setData] = useState<FootballDataMatchesResponse>(emptyResponse);
  const [status, setStatus] = useState("TIMED");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const matches = useMemo(() => {
    const source = data.matches || [];
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return source.slice(0, 12);
    }

    return source
      .filter((match) => {
        const text = [
          match.homeTeam?.name,
          match.homeTeam?.shortName,
          match.homeTeam?.tla,
          match.awayTeam?.name,
          match.awayTeam?.shortName,
          match.awayTeam?.tla,
          match.group,
          match.stage,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(normalizedQuery);
      })
      .slice(0, 12);
  }, [data.matches, query]);

  async function loadMatches(nextStatus = status) {
    setLoading(true);

    try {
      const search = new URLSearchParams();
      if (nextStatus !== "ALL") {
        search.set("status", nextStatus);
      }

      const response = await fetch(`/api/football-data/competitions/WC/matches?${search.toString()}`, {
        headers: { Accept: "application/json" },
      });
      const payload = (await response.json()) as FootballDataMatchesResponse;
      setData(payload);
      setRefreshedAt(new Date());
    } catch {
      setData({
        error: "Football-data.org feed is unavailable. Check the Cloudflare Pages environment variable.",
        matches: [],
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMatches(status);
    // loadMatches intentionally reads current status through the explicit argument.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-[24px] border border-white/10 bg-white/[0.055] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <DatabaseZap className="size-4" />
            Football-data.org API feed
          </p>
          <h2 className="mt-2 text-2xl font-bold">World Cup 2026 fixtures and results</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Dates, status, team crests and scores are rendered directly from the football-data.org response.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4">
            <Search className="size-4 text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search team or group"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:w-44"
            />
          </label>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              void loadMatches(event.target.value);
            }}
            className="h-11 rounded-full border border-white/10 bg-[#0b1020] px-4 text-sm outline-none"
          >
            <option value="TIMED">Upcoming</option>
            <option value="LIVE">Live</option>
            <option value="FINISHED">Finished</option>
            <option value="ALL">All</option>
          </select>
          <button
            onClick={() => loadMatches(status)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#0b1020] transition hover:scale-[1.02]"
          >
            <RefreshCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {data.error || data.message ? (
        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          {data.error || data.message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading && !matches.length
          ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-72 rounded-[20px] shimmer" />)
          : matches.map((match) => <ApiMatchCard key={match.id} match={match} />)}
      </div>

      {!loading && !matches.length ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-zinc-400">
          No matches returned for this filter.
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
          <ShieldCheck className="size-3.5 text-emerald-300" />
          Token secured by Cloudflare Function
        </span>
        {data.resultSet?.count !== undefined && <span>{data.resultSet.count} matches from API</span>}
        {data.resultSet?.first && data.resultSet?.last && (
          <span>
            Range {data.resultSet.first} to {data.resultSet.last}
          </span>
        )}
        {refreshedAt && <span>Synced {refreshedAt.toLocaleTimeString()}</span>}
      </div>
    </section>
  );
}
