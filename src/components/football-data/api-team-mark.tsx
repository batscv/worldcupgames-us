import { Shield } from "lucide-react";
import type { FootballDataTeam } from "@/lib/football-data";
import { teamName } from "@/lib/football-data";

export function ApiTeamMark({ team, align = "left" }: { team?: FootballDataTeam; align?: "left" | "right" }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        {team?.crest ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.crest} alt={`${teamName(team)} flag`} className="size-7 object-contain" loading="lazy" />
        ) : (
          <Shield className="size-5 text-zinc-500" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-white">{teamName(team)}</span>
        <span className="block text-xs text-zinc-500">{team?.tla || "TBD"}</span>
      </span>
    </div>
  );
}
