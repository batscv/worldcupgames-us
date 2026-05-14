import Link from "next/link";
import { CirclePlay, Mail, Sparkles } from "lucide-react";
import { WorldCupFeed } from "@/components/football-data/world-cup-feed";
import { DatabaseHomeSections } from "@/components/supabase/database-home-sections";
import { Badge, PageShell } from "@/components/site-shell";

export default function Home() {
  return (
    <PageShell className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1428] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="stadium-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-10 size-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge>Supabase-powered World Cup platform</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              World Cup data, cleanly from your database.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              The public experience now renders from Supabase tables. Empty tables show empty states instead of fake scores, fake rankings or placeholder monetization data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                ["Open Match Center", "/match-center"],
                ["Database News", "#database-news"],
                ["Simulate Tournament", "/simulator"],
                ["Admin Dashboard", "/admin"],
              ].map(([label, href], index) => (
                <Link
                  key={label}
                  href={href}
                  className={
                    index === 0
                      ? "rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b1020] transition hover:scale-105"
                      : "rounded-full border border-white/10 bg-white/7 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[360px]">
            <div className="animate-float absolute left-1/2 top-2 grid size-56 -translate-x-1/2 place-items-center rounded-full border border-amber-200/30 bg-amber-300/10 text-8xl shadow-[0_0_90px_rgba(245,158,11,0.25)]">
              🏆
            </div>
            <div className="absolute bottom-0 left-0 right-0 rounded-[24px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-emerald-300">Database-first mode</p>
              <p className="mt-2 text-2xl font-black">No hardcoded match data</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Populate Supabase via sync or CMS, and the homepage updates from those rows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DatabaseHomeSections />

      <WorldCupFeed />

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
          <CirclePlay className="mb-5 size-8 text-emerald-300" />
          <h3 className="text-xl font-bold">Where to Watch</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Ready for broadcaster rows and affiliate records from Supabase.</p>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
          <Sparkles className="mb-5 size-8 text-blue-300" />
          <h3 className="text-xl font-bold">AI prediction engine</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Prediction modules now wait for real `public.predictions` rows.</p>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
          <Mail className="mb-5 size-8 text-amber-300" />
          <h3 className="text-xl font-bold">Newsletter monetization</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Sponsored units appear only when configured in the database.</p>
        </div>
      </section>
    </PageShell>
  );
}
