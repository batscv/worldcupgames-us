import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Radio, Share2, Star, TrendingUp } from "lucide-react";
import { articles, matches, rankings } from "@/lib/data";
import { MotionShell } from "./motion-shell";

export function MatchCard({ match = matches[0] }: { match?: (typeof matches)[number] }) {
  const [home, draw, away] = match.probabilities;
  return (
    <MotionShell>
      <div className="card-glow glass rounded-[20px] p-5 transition duration-300 hover:-translate-y-1">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            {match.status} · {match.minute}
          </span>
          <Radio className="size-4 text-blue-300" />
        </div>
        <div className="space-y-4">
          {[match.home, match.away].map((team) => (
            <div key={team.code} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-2xl">{team.flag}</span>
                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-xs text-zinc-400">Form {team.form}</p>
                </div>
              </div>
              <span className="text-xl font-bold">{team.rating}</span>
            </div>
          ))}
        </div>
        <div className="my-5 rounded-2xl bg-black/22 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{match.venue}</p>
          <p className="mt-2 text-3xl font-black">{match.score}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <Probability label="Home" value={home} />
          <Probability label="Draw" value={draw} />
          <Probability label="Away" value={away} />
        </div>
        <Link href={`/predictions/${match.slug}`} className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0b1020] transition hover:scale-[1.02]">
          Open AI prediction
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </MotionShell>
  );
}

function Probability({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}%</p>
    </div>
  );
}

export function ArticleCard({ article = articles[0] }: { article?: (typeof articles)[number] }) {
  return (
    <MotionShell>
      <Link href={`/news/${article.slug}`} className="group block overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.055]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={article.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs backdrop-blur">{article.category}</span>
        </div>
        <div className="p-5">
          <p className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
            <CalendarDays className="size-3.5" />
            {article.date} · {article.author}
          </p>
          <h3 className="text-lg font-bold leading-tight group-hover:text-blue-200">{article.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{article.subtitle}</p>
        </div>
      </Link>
    </MotionShell>
  );
}

export function AffiliateStrip() {
  return (
    <section className="glass rounded-[20px] p-5 sm:p-7">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-amber-300">Affiliate marketplace</p>
          <h2 className="mt-2 text-2xl font-bold">Stream, bet responsibly, book tickets and unlock tournament tools.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Native placements for streaming trials, VPN guides, sportsbook offers, ticket partners, newsletters and sponsor banners.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {["Streaming", "Sportsbook", "VPN", "Tickets"].map((item) => (
            <button key={item} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 font-semibold transition hover:border-blue-300/50 hover:bg-blue-400/10">
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RankingsCard() {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">Prediction rankings</h3>
        <TrendingUp className="size-4 text-emerald-300" />
      </div>
      <div className="space-y-3">
        {rankings.map((user, index) => (
          <div key={user.name} className="flex items-center justify-between rounded-2xl bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-white/10 text-sm">{index + 1}</span>
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.streak} match streak</p>
              </div>
            </div>
            <p className="flex items-center gap-1 text-sm font-bold text-amber-200">
              <Star className="size-3.5" />
              {user.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialShare() {
  return (
    <div className="flex gap-2">
      {["X", "FB", "WA"].map((label) => (
        <button key={label} className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-sm transition hover:bg-white/10">
          {label}
        </button>
      ))}
      <button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
        <Share2 className="size-4" />
      </button>
    </div>
  );
}
