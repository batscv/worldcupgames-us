import { Share2, Trophy } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { teams } from "@/lib/data";

export const metadata = { title: "World Cup Simulator" };

export default function SimulatorPage() {
  return (
    <PageShell className="space-y-8">
      <section className="glass rounded-[28px] p-6 sm:p-8">
        <h1 className="text-4xl font-black sm:text-6xl">World Cup simulator</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">Predict matches, generate a bracket, simulate progression and share a polished tournament path.</p>
      </section>
      <section className="overflow-x-auto rounded-[24px] border border-white/10 bg-white/[0.055] p-5">
        <div className="grid min-w-[900px] grid-cols-4 gap-5">
          {["Round of 16", "Quarterfinals", "Semifinals", "Final"].map((round, roundIndex) => (
            <div key={round} className="space-y-4">
              <h2 className="text-sm font-bold text-zinc-300">{round}</h2>
              {Array.from({ length: Math.max(1, 4 - roundIndex) }).map((_, index) => {
                const team = teams[(index + roundIndex) % teams.length];
                return (
                  <div key={`${round}-${index}`} className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{team.flag} {team.name}</span>
                      {roundIndex === 3 ? <Trophy className="size-4 text-amber-300" /> : <span className="text-sm text-zinc-500">AI</span>}
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${64 - roundIndex * 8}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
      <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b1020]">
        <Share2 className="size-4" />
        Share simulation
      </button>
    </PageShell>
  );
}
