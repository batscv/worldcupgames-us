import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateStrip } from "@/components/cards";
import { Badge, PageShell } from "@/components/site-shell";
import { matches } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return matches.map((match) => ({ slug: match.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = matches.find((item) => item.slug === slug);
  if (!match) return {};
  return {
    title: `${match.home.name} vs ${match.away.name} Prediction`,
    description: `AI probabilities, expected score, recent form and fan vote for ${match.home.name} vs ${match.away.name}.`,
  };
}

export default async function PredictionPage({ params }: Props) {
  const { slug } = await params;
  const match = matches.find((item) => item.slug === slug);
  if (!match) notFound();
  const [home, draw, away] = match.probabilities;

  return (
    <PageShell className="space-y-8">
      <section className="glass rounded-[28px] p-6 sm:p-8">
        <Badge>AI prediction · {match.confidence}% confidence</Badge>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <h1 className="text-4xl font-black sm:text-6xl">{match.home.name} vs {match.away.name}</h1>
            <p className="mt-4 text-zinc-300">{match.time} · {match.venue}, {match.city}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Circle value={home} label={`${match.home.flag} ${match.home.code}`} />
              <Circle value={draw} label="Draw" muted />
              <Circle value={away} label={`${match.away.flag} ${match.away.code}`} />
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Expected score</p>
            <p className="mt-4 text-6xl font-black">{match.expectedScore}</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" style={{ width: `${match.confidence}%` }} />
            </div>
            <p className="mt-3 text-sm text-zinc-400">Model confidence meter</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["Recent performance", `${match.home.form} · ${match.away.form}`, "Momentum, rest days and opponent-adjusted strength."],
          ["Key players", "Captain creators · set-piece targets · transition runners", "Player impact cards can be bound to live roster data."],
          ["Fan voting", "58% lean Brazil · 27K votes", "Authenticated users can save predictions and earn ranking points."],
        ].map(([title, value, copy]) => (
          <div key={title} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-4 text-2xl font-black">{value}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{copy}</p>
          </div>
        ))}
      </section>

      <AffiliateStrip />
    </PageShell>
  );
}

function Circle({ value, label, muted = false }: { value: number; label: string; muted?: boolean }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5 text-center">
      <div className="mx-auto grid size-32 place-items-center rounded-full" style={{ background: `conic-gradient(${muted ? "#a1a1aa" : "#3b82f6"} ${value * 3.6}deg, rgba(255,255,255,0.09) 0deg)` }}>
        <div className="grid size-24 place-items-center rounded-full bg-[#0b1020]">
          <span className="text-3xl font-black">{value}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-zinc-200">{label}</p>
    </div>
  );
}
