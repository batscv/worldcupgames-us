"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Search } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  category: { name: string; slug: string } | null;
};

export function NewsIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((post) => `${post.title} ${post.subtitle || ""} ${post.category?.name || ""}`.toLowerCase().includes(needle));
  }, [posts, query]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("news_posts")
        .select("id,title,slug,subtitle,featured_image_url,published_at,category:categories(name,slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      setPosts((data || []) as unknown as Post[]);
      setLoading(false);
    }

    void load();
  }, []);

  return (
    <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_30px_90px_rgba(60,25,120,0.10)] lg:p-8">
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">WorldCupGames.us</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Noticias de futebol</h1>
          <p className="mt-3 max-w-2xl text-slate-500">Copa do Mundo, selecoes, jogos, resultados, analises e mercado da bola.</p>
        </div>
        <label className="flex h-12 min-w-72 items-center gap-2 rounded-2xl border border-slate-100 bg-[#fcfbff] px-4 text-sm text-slate-500">
          <Search className="size-4" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar noticias" className="h-full flex-1 bg-transparent outline-none" />
        </label>
      </div>

      {loading ? <div className="mt-8 h-80 rounded-3xl shimmer" /> : null}
      {!loading && !posts.length ? (
        <div className="mt-8 rounded-3xl border border-dashed border-violet-200 bg-violet-50/60 p-10 text-center">
          <Newspaper className="mx-auto size-12 text-violet-200" />
          <p className="mt-4 font-semibold text-slate-950">Ainda nao ha noticias publicadas.</p>
        </div>
      ) : null}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.id} href={`/news/${post.slug}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-[#fcfbff] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative h-48 bg-slate-100">
              {post.featured_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.featured_image_url} alt="" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              ) : (
                <div className="grid size-full place-items-center">
                  <Newspaper className="size-10 text-violet-200" />
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-violet-600">{post.category?.name || "Copa do Mundo"}</p>
              <h2 className="mt-2 text-xl font-black leading-tight text-slate-950">{post.title}</h2>
              {post.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.subtitle}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
