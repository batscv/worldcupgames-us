import Link from "next/link";
import { Search, Sparkles, Trophy, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  ["News", "/news"],
  ["Results", "/match-center"],
  ["Simulator", "/simulator"],
  ["Admin", "/admin"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white">
            <Trophy className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-slate-950">WorldCupGames.us</span>
            <span className="hidden text-xs text-slate-500 sm:block">World Cup news and results</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <button className="hidden h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-950 sm:flex">
            <Search className="size-4" />
            Search
          </button>
          <Link href="/login" className="grid size-10 place-items-center rounded-full bg-slate-950 text-white transition hover:scale-105" aria-label="Login">
            <UserRound className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 text-sm text-slate-500 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-950">WorldCupGames.us</p>
          <p>News, fixtures and results for World Cup 2026.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["Supabase CMS", "SEO news", "Football-data API"].map((item) => (
            <span key={item} className="rounded-full border border-slate-200 px-3 py-1">{item}</span>
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
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
      <Sparkles className="size-3.5 text-blue-600" />
      {children}
    </span>
  );
}
