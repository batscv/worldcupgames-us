"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarClock, RefreshCcw, Trophy } from "lucide-react";
import type { FootballDataMatch, FootballDataMatchesResponse } from "@/lib/football-data";
import { formatApiDate, formatApiScore, readableStage, readableStatus, teamName } from "@/lib/football-data";
import { ApiTeamMark } from "./api-team-mark";

export function ApiMatchCenter() {
  const [data, setData] = useState<FootballDataMatchesResponse>({ matches: [] });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedMatch = useMemo(() => {
    if (!data.matches?.length) return null;
    return data.matches.find((match) => match.id === selectedId) || data.matches[0];
  }, [data.matches, selectedId]);

  async function loadMatches() {
    setLoading(true);
    try {
      const response = await fetch("/api/football-data/competitions/WC/matches", {
        headers: { Accept: "application/json" },
      });
      const payload = (await response.json()) as FootballDataMatchesResponse;
      setData(payload);
      setSelectedId((current) => current || payload.matches?.[0]?.id || null);
    } catch {
      setData({
        error: "Football-data.org match center feed is unavailable. Add FOOTBALL_DATA_API_TOKEN in Cloudflare Pages.",
        matches: [],
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMatches();
  }, []);

  return (
    <div className="space-y-8">
      <section className="glass rounded-[28px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-300">Football-data.org live source</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">World Cup match center</h1>
            <p className="mt-3 text-zinc-400">Dates, status and results come directly from the API response.</p>
          </div>
          <button
            onClick={loadMatches}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#0b1020]"
          >
            <RefreshCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </section>

      {data.error || data.message ? (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          {data.error || data.message}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-[20px] border border-white/10 bg-white/[0.055] p-4">
          <h2 className="mb-4 font-bold">Fixtures</h2>
          <div className="max-h-[720px] space-y-2 overflow-y-auto pr-1">
            {(data.matches || []).slice(0, 40).map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedId(match.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  selectedMatch?.id === match.id
                    ? "border-blue-300/50 bg-blue-400/10"
                    : "border-white/10 bg-black/15 hover:bg-white/8"
                }`}
              >
                <p className="text-xs text-zinc-500">{formatApiDate(match.utcDate)}</p>
                <p className="mt-2 truncate text-sm font-semibold">
                  {teamName(match.homeTeam)} vs {teamName(match.awayTeam)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {readableStatus(match.status)} · {formatApiScore(match)}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {selectedMatch ? <MatchDetail match={selectedMatch} /> : <div className="min-h-[520px] rounded-[24px] shimmer" />}
      </section>
    </div>
  );
}

function MatchDetail({ match }: { match: FootballDataMatch }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-white/10 bg-white/[0.055] p-6 text-center">
        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <ApiTeamMark team={match.homeTeam} align="right" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{readableStatus(match.status)}</p>
            <p className="mt-3 text-5xl font-black">{formatApiScore(match)}</p>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-400">
              <CalendarClock className="size-4 text-blue-300" />
              {formatApiDate(match.utcDate)}
            </p>
          </div>
          <ApiTeamMark team={match.awayTeam} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Competition", match.competition?.name || "FIFA World Cup", Trophy],
          ["Stage", readableStage(match.stage), Activity],
          ["Group", match.group || "TBD", Activity],
          ["Matchday", match.matchday?.toString() || "TBD", Activity],
        ].map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
            <Icon className="mb-4 size-5 text-blue-300" />
            <p className="text-sm text-zinc-400">{label as string}</p>
            <p className="mt-2 text-xl font-black capitalize">{value as string}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
        <h2 className="font-bold">Raw API result mapping</h2>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <Info label="Full-time home" value={String(match.score?.fullTime?.home ?? "null")} />
          <Info label="Full-time away" value={String(match.score?.fullTime?.away ?? "null")} />
          <Info label="Half-time home" value={String(match.score?.halfTime?.home ?? "null")} />
          <Info label="Half-time away" value={String(match.score?.halfTime?.away ?? "null")} />
          <Info label="Winner" value={String(match.score?.winner ?? "null")} />
          <Info label="Last updated" value={match.lastUpdated || "TBD"} />
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
