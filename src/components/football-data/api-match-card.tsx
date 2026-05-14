import { CalendarClock } from "lucide-react";
import type { FootballDataMatch } from "@/lib/football-data";
import { formatApiDate, formatApiScore, readableStage, readableStatus } from "@/lib/football-data";
import { ApiTeamMark } from "./api-team-mark";

export function ApiMatchCard({ match }: { match: FootballDataMatch }) {
  return (
    <article className="card-glow rounded-[20px] border border-white/10 bg-white/[0.055] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
          {readableStatus(match.status)}
        </span>
        <span className="text-xs capitalize text-zinc-500">{readableStage(match.stage)}</span>
      </div>

      <div className="space-y-4">
        <ApiTeamMark team={match.homeTeam} />
        <ApiTeamMark team={match.awayTeam} />
      </div>

      <div className="my-5 rounded-2xl bg-black/22 p-4 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{match.group || match.competition?.code || "WC"}</p>
        <p className="mt-2 text-3xl font-black">{formatApiScore(match)}</p>
      </div>

      <p className="flex items-center gap-2 text-xs leading-5 text-zinc-400">
        <CalendarClock className="size-4 text-blue-300" />
        {formatApiDate(match.utcDate)}
      </p>
    </article>
  );
}
