import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, PageShell } from "@/components/site-shell";
import { matches } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return matches.map((match) => ({ slug: `${match.slug}-live` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = matches.find((item) => `${item.slug}-live` === slug);
  if (!match) return {};
  return {
    title: `Where to Watch ${match.home.name} vs ${match.away.name} Live`,
    description: `Official broadcasters, streaming platforms, kickoff time and affiliate options for ${match.home.name} vs ${match.away.name}.`,
  };
}

export default async function WatchPage({ params }: Props) {
  const { slug } = await params;
  const match = matches.find((item) => `${item.slug}-live` === slug);
  if (!match) notFound();

  return (
    <PageShell className="space-y-8">
      <section className="glass rounded-[28px] p-6 sm:p-8">
        <Badge>Where to watch · SEO streaming guide</Badge>
        <h1 className="mt-5 text-4xl font-black sm:text-6xl">Where to watch {match.home.name} vs {match.away.name} live</h1>
        <p className="mt-4 text-lg text-zinc-300">{match.time} · {match.venue}, {match.city}</p>
      </section>
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {match.broadcasters.map((name) => (
          <div key={name} className="card-glow rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Streaming partner</p>
            <h2 className="mt-4 text-2xl font-black">{name}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">Availability by country, trial status, device support and affiliate tracking slot.</p>
            <button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#0b1020]">Check availability</button>
          </div>
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-3">
        {["Official broadcasters by country", "VPN affiliate section", "Kickoff time converter"].map((title) => (
          <div key={title} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">Built for long-tail SEO pages such as live stream, TV channel, free trial and match start time queries.</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
