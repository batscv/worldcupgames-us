"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Team = {
  name: string;
  short_name: string | null;
  tla: string | null;
  crest_url: string | null;
};

type Match = {
  id: string;
  kickoff_at: string | null;
  api_status: string | null;
  status: string;
  api_payload: {
    score?: { fullTime?: { home?: number | null; away?: number | null } };
  } | null;
  home_team: Team | null;
  away_team: Team | null;
};

function teamLabel(team: Team | null) {
  return team?.short_name || team?.name || "TBD";
}

function scoreLabel(match: Match) {
  const home = match.api_payload?.score?.fullTime?.home;
  const away = match.api_payload?.score?.fullTime?.away;
  return home === null || home === undefined || away === null || away === undefined ? "-- - --" : `${home} - ${away}`;
}

function dateLabel(value: string | null) {
  if (!value) return "TBD";
  return new Intl.DateTimeFormat("pt-PT", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ResultsStrip() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) return;

      const { data } = await supabase
        .from("matches")
        .select(
          "id,kickoff_at,status,api_status,api_payload,home_team:teams!matches_home_team_id_fkey(name,short_name,tla,crest_url),away_team:teams!matches_away_team_id_fkey(name,short_name,tla,crest_url)",
        )
        .order("kickoff_at", { ascending: true })
        .limit(8);

      setMatches((data || []) as unknown as Match[]);
    }

    void load();
  }, []);

  return (
    <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_70px_rgba(60,25,120,0.08)] lg:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">Football-data API</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Resultados e calendario</h2>
        </div>
        <span className="hidden rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 sm:inline">Ligado ao Supabase</span>
      </div>
      {matches.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {matches.map((match) => (
            <article key={match.id} className="rounded-2xl border border-slate-100 bg-[#fcfbff] p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-100">
                  {match.api_status || match.status}
                </span>
                <span className="text-sm font-black text-slate-950">{scoreLabel(match)}</span>
              </div>
              <TeamLine team={match.home_team} />
              <TeamLine team={match.away_team} />
              <p className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                <CalendarClock className="size-4 text-violet-500" />
                {dateLabel(match.kickoff_at)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-8 text-center text-slate-500">
          Ainda nao existem jogos na base. Executa o sync do football-data.
        </div>
      )}
    </section>
  );
}

function TeamLine({ team }: { team: Team | null }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="grid size-9 place-items-center overflow-hidden rounded-full border border-slate-100 bg-white">
        {team?.crest_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.crest_url} alt="" className="size-6 object-contain" loading="lazy" />
        ) : (
          <Shield className="size-4 text-slate-300" />
        )}
      </span>
      <span>
        <span className="block text-sm font-black text-slate-950">{teamLabel(team)}</span>
        <span className="block text-xs text-slate-500">{team?.tla || "TBD"}</span>
      </span>
    </div>
  );
}
