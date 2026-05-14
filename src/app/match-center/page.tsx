import { Activity, Circle, Goal, Square } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { matches } from "@/lib/data";

export const metadata = { title: "Live Match Center" };

export default function MatchCenterPage() {
  const match = matches[0];
  const events = ["12' Brazil shot saved", "28' USA yellow card", "41' Goal Brazil", "57' Goal USA", "62' Substitution USA"];

  return (
    <PageShell className="space-y-8">
      <section className="glass rounded-[28px] p-6 text-center sm:p-8">
        <p className="text-sm text-emerald-300">Live · {match.minute}</p>
        <h1 className="mt-4 text-5xl font-black">{match.home.flag} {match.score} {match.away.flag}</h1>
        <p className="mt-3 text-zinc-400">{match.home.name} vs {match.away.name} · {match.venue}</p>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5 md:grid-cols-2">
          {["Possession", "Shots", "Expected goals", "Player ratings"].map((stat, index) => (
            <div key={stat} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-bold">{stat}</h2>
                <Activity className="size-4 text-blue-300" />
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" style={{ width: `${[54, 63, 48, 71][index]}%` }} />
              </div>
              <p className="mt-3 text-sm text-zinc-400">Live data placeholder ready for provider integration.</p>
            </div>
          ))}
          <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6 md:col-span-2">
            <h2 className="font-bold">Formation and heatmap</h2>
            <div className="mt-5 grid aspect-[16/9] place-items-center rounded-[20px] border border-emerald-300/20 bg-emerald-400/10">
              <p className="text-sm text-emerald-100">Tactical pitch, formations and heatmap layer</p>
            </div>
          </div>
        </div>
        <aside className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
          <h2 className="mb-5 font-bold">Timeline</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event} className="flex gap-3">
                <span className="mt-1">{index === 3 ? <Goal className="size-4 text-emerald-300" /> : index === 1 ? <Square className="size-4 text-amber-300" /> : <Circle className="size-4 text-blue-300" />}</span>
                <p className="text-sm text-zinc-300">{event}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
