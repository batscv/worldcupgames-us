import Link from "next/link";
import { ArrowRight, CirclePlay, Flame, Mail, Radar, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { AffiliateStrip, ArticleCard, MatchCard, RankingsCard } from "@/components/cards";
import { WorldCupFeed } from "@/components/football-data/world-cup-feed";
import { Badge, PageShell } from "@/components/site-shell";
import { articles, matches, standings } from "@/lib/data";

export default function Home() {
  return (
    <PageShell className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d1428] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="stadium-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-10 size-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge>FIFA World Cup 2026 · AI prediction layer</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              World Cup coverage built like a live trading desk.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Premium predictions, live match intelligence, streaming guides, SEO news publishing, brackets, fantasy leagues and monetized football experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                ["View Predictions", "/predictions/united-states-vs-brazil"],
                ["Watch Matches", "/watch/united-states-vs-brazil-live"],
                ["Explore News", "/news/world-cup-2026-ai-power-rankings"],
                ["Simulate Tournament", "/simulator"],
              ].map(([label, href], index) => (
                <Link
                  key={label}
                  href={href}
                  className={index === 0 ? "rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b1020] transition hover:scale-105" : "rounded-full border border-white/10 bg-white/7 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[460px]">
            <div className="animate-float absolute left-1/2 top-4 grid size-56 -translate-x-1/2 place-items-center rounded-full border border-amber-200/30 bg-amber-300/10 text-8xl shadow-[0_0_90px_rgba(245,158,11,0.25)]">
              🏆
            </div>
            <div className="absolute bottom-0 left-0 w-full">
              <MatchCard match={matches[0]} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Live users", "2.8M", Flame],
          ["Prediction accuracy", "72.4%", Sparkles],
          ["Articles indexed", "18.7K", Radar],
          ["Affiliate RPM", "$42.10", ShieldCheck],
        ].map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
            <Icon className="mb-4 size-5 text-blue-300" />
            <p className="text-3xl font-black">{value as string}</p>
            <p className="mt-1 text-sm text-zinc-400">{label as string}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">AI probability cards</h2>
            <Link href="/match-center" className="flex items-center gap-2 text-sm text-blue-200">Match center <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {matches.map((match) => <MatchCard key={match.slug} match={match} />)}
          </div>
        </div>
        <RankingsCard />
      </section>

      <AffiliateStrip />

      <WorldCupFeed />

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Trending football news</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
          <h3 className="flex items-center gap-2 font-bold"><Trophy className="size-5 text-amber-300" /> Tournament standings</h3>
          <div className="mt-5 space-y-2">
            {standings.map((row, index) => (
              <div key={row.team} className="grid grid-cols-[32px_1fr_50px_50px] items-center rounded-2xl bg-white/5 px-3 py-3 text-sm">
                <span className="text-zinc-500">{index + 1}</span>
                <span className="font-semibold">{row.team}</span>
                <span className="text-zinc-400">GD {row.gd}</span>
                <span className="text-right font-bold">{row.pts}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-4 text-sm text-zinc-400">
            Sponsor banner slot · 728x90 / native responsive
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
          <CirclePlay className="mb-5 size-8 text-emerald-300" />
          <h3 className="text-xl font-bold">Where to Watch</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Broadcaster pages built for high-intent streaming, VPN and ticket search traffic.</p>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
          <Sparkles className="mb-5 size-8 text-blue-300" />
          <h3 className="text-xl font-bold">AI prediction engine</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Confidence meters, fan votes, recent form, key players and animated win probabilities.</p>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
          <Mail className="mb-5 size-8 text-amber-300" />
          <h3 className="text-xl font-bold">Newsletter monetization</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Daily picks, watch alerts, sponsored editions and fantasy leaderboard recaps.</p>
        </div>
      </section>

      <section className="glass rounded-[20px] p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Get daily World Cup edges before kickoff.</h2>
            <p className="mt-2 text-sm text-zinc-400">Predictions, watch links, injury notes and odds movement in one clean briefing.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input className="h-12 rounded-full border border-white/10 bg-black/20 px-5 text-sm outline-none placeholder:text-zinc-500 focus:border-blue-300/60" placeholder="you@example.com" />
            <button className="h-12 rounded-full bg-blue-500 px-6 text-sm font-bold transition hover:bg-blue-400">Subscribe</button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
