import Link from "next/link";
import { Search, Sparkles, Trophy, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  ["Noticias", "/news"],
  ["Resultados", "/match-center"],
  ["Simulador", "/simulator"],
  ["Admin", "/admin"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-[#fbf8ff]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-violet-700 text-white shadow-lg shadow-violet-200">
            <Trophy className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-black tracking-tight text-slate-950">WorldCupGames.us</span>
            <span className="hidden text-xs text-slate-500 sm:block">Noticias, resultados e Copa 2026</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-violet-700">
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <button className="hidden h-10 items-center gap-2 rounded-full border border-violet-100 bg-white px-3 text-sm text-slate-500 shadow-sm transition hover:border-violet-200 hover:text-slate-950 sm:flex">
            <Search className="size-4" />
            Buscar
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
    <footer className="border-t border-violet-100 bg-white/80 px-4 py-10 text-sm text-slate-500 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-black text-slate-950">WorldCupGames.us</p>
          <p>Portal editorial de futebol, Copa do Mundo 2026 e resultados oficiais.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["CMS Supabase", "SEO News", "Football-data API"].map((item) => (
            <span key={item} className="rounded-full border border-violet-100 bg-white px-3 py-1">{item}</span>
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
    <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
      <Sparkles className="size-3.5 text-violet-600" />
      {children}
    </span>
  );
}
