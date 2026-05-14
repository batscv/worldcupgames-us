import Link from "next/link";
import { Search, Sparkles, Trophy, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  ["News", "/news/world-cup-2026-ai-power-rankings"],
  ["Predictions", "/predictions/united-states-vs-brazil"],
  ["Watch", "/watch/united-states-vs-brazil-live"],
  ["Match Center", "/match-center"],
  ["Simulator", "/simulator"],
  ["Admin", "/admin"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1020]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-white text-[#0b1020] shadow-[0_0_32px_rgba(59,130,246,0.35)]">
            <Trophy className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight">WorldCupGames.us</span>
            <span className="hidden text-xs text-zinc-400 sm:block">AI World Cup Command Center</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <button className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm text-zinc-400 transition hover:border-white/20 hover:text-white sm:flex">
            <Search className="size-4" />
            Search
          </button>
          <Link href="/login" className="grid size-10 place-items-center rounded-full bg-white text-[#0b1020] transition hover:scale-105" aria-label="Login">
            <UserRound className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-sm text-zinc-400 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">WorldCupGames.us</p>
          <p>Predictions, watch guides, live match intelligence and fan competitions for World Cup 2026.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["AdSense ready", "Affiliate slots", "Dynamic metadata", "Schema markup"].map((item) => (
            <span key={item} className="rounded-full border border-white/10 px-3 py-1">{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative z-10 min-h-screen">
      <SiteHeader />
      <main className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-3 py-1 text-xs font-medium text-zinc-200">
      <Sparkles className="size-3.5 text-blue-300" />
      {children}
    </span>
  );
}
