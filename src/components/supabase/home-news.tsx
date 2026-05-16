"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Goal,
  MessageCircle,
  Newspaper,
  Search,
  Send,
  Star,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  category: Category | null;
};

const fallbackCategories: Category[] = [
  { id: "copa", name: "Copa do Mundo", slug: "copa-do-mundo" },
  { id: "selecoes", name: "Selecoes", slug: "selecoes" },
  { id: "jogos", name: "Jogos", slug: "jogos" },
  { id: "resultados", name: "Resultados", slug: "resultados" },
  { id: "analises", name: "Analises", slug: "analises" },
  { id: "mercado", name: "Mercado da Bola", slug: "mercado-da-bola" },
];

function dateLabel(value: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("pt-PT", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function PostImage({ post, className }: { post: Post; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className || ""}`}>
      {post.featured_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featured_image_url} alt="" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
      ) : (
        <div className="grid size-full place-items-center bg-[linear-gradient(135deg,#eef2ff,#f8fafc)]">
          <Trophy className="size-10 text-violet-200" />
        </div>
      )}
    </div>
  );
}

function categoryName(post: Post) {
  return post.category?.name || "Copa do Mundo";
}

export function HomeNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hero = useMemo(() => posts[0], [posts]);
  const latest = useMemo(() => posts.slice(0, 5), [posts]);
  const feed = useMemo(() => posts.slice(1, 7), [posts]);
  const trending = useMemo(() => posts.slice(2, 5), [posts]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setError("Faltam as variaveis do Supabase.");
        setLoading(false);
        return;
      }

      const [{ data: postData, error: postError }, { data: categoryData }] = await Promise.all([
        supabase
          .from("news_posts")
          .select("id,title,slug,subtitle,featured_image_url,published_at,category:categories(id,name,slug)")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(10),
        supabase.from("categories").select("id,name,slug").order("name", { ascending: true }),
      ]);

      if (postError) setError(postError.message);
      setPosts((postData || []) as unknown as Post[]);
      if (categoryData?.length) setCategories(categoryData as Category[]);
      setLoading(false);
    }

    void load();
  }, []);

  if (loading) {
    return <div className="h-[720px] rounded-[28px] border border-white bg-white shimmer shadow-sm" />;
  }

  if (error) {
    return <Empty title="Nao consegui carregar as noticias" copy={error} />;
  }

  if (!hero) {
    return <Empty title="Ainda nao existem noticias publicadas" copy="Entra no painel admin, cria a primeira noticia e publica para aparecer aqui." />;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-[0_30px_90px_rgba(60,25,120,0.10)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between lg:px-10">
        <span>{new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</span>
        <div className="flex items-center gap-3">
          <span>World Cup 2026 News</span>
          <Send className="size-3.5" />
          <MessageCircle className="size-3.5" />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-violet-700 text-white">
            <Goal className="size-5" />
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">WORLD CUP NEWS</span>
        </Link>
        <nav className="flex flex-1 flex-wrap gap-2 md:justify-center">
          {["Copa do Mundo", "Selecoes", "Jogos", "Resultados", "Analises"].map((item) => (
            <span key={item} className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
              {item}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="grid size-10 place-items-center rounded-xl border border-slate-100 text-slate-500">
            <Search className="size-4" />
          </button>
          <Link href="/admin" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-200">
            Admin
          </Link>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-violet-50/45 px-5 py-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
          <Flame className="size-4 text-orange-500" />
          Ultimas Noticias
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {latest.slice(0, 4).map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group grid grid-cols-[1fr_96px] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-violet-600">{categoryName(post)}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-slate-950">{post.title}</h3>
                <p className="mt-2 text-[11px] text-slate-400">{dateLabel(post.published_at)}</p>
              </div>
              <PostImage post={post} className="h-full min-h-24" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[180px_1fr_260px] xl:grid-cols-[210px_1fr_300px]">
        <aside className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r lg:p-8">
          <div className="rounded-xl bg-violet-50 px-4 py-3 text-sm font-black text-violet-800">
            <Flame className="mr-2 inline size-4 text-orange-500" />
            Top News
          </div>
          <div className="mt-4 space-y-2">
            {categories.map((category) => (
              <Link key={category.id} href="/news" className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-950">
                {category.name}
                <ArrowRight className="size-3.5 opacity-40" />
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Segue-nos</p>
            <div className="flex gap-2">
              {[Send, MessageCircle, Star].map((Icon, index) => (
                <span key={index} className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-500">
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 border-b border-slate-100 lg:border-b-0 lg:border-r">
          <Link href={`/news/${hero.slug}`} className="group block p-5 transition hover:bg-slate-50/60 lg:p-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">{categoryName(hero)} · {dateLabel(hero.published_at)}</p>
              <span className="rounded-full border border-slate-100 px-3 py-1 text-xs text-slate-400">SEO ready</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">{hero.title}</h1>
            {hero.subtitle && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">{hero.subtitle}</p>}
            <PostImage post={hero} className="mt-6 aspect-[16/9] rounded-2xl" />
          </Link>

          <div className="divide-y divide-slate-100">
            {feed.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="group grid gap-4 p-5 transition hover:bg-slate-50/80 sm:grid-cols-[1fr_190px] lg:p-8">
                <div>
                  <h2 className="text-xl font-black leading-tight text-slate-950">{post.title}</h2>
                  {post.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.subtitle}</p>}
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-violet-600">{categoryName(post)} · {dateLabel(post.published_at)}</p>
                </div>
                <PostImage post={post} className="aspect-[4/3] rounded-xl" />
              </Link>
            ))}
          </div>
        </main>

        <aside className="p-5 lg:p-8">
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Trending News</h2>
          <div className="mt-4 space-y-3">
            {(trending.length ? trending : latest.slice(1, 4)).map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="group relative block overflow-hidden rounded-xl bg-slate-900 shadow-sm">
                <PostImage post={post} className="h-28 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="rounded bg-violet-600 px-2 py-1 text-[10px] font-black uppercase text-white">{categoryName(post)}</span>
                  <h3 className="mt-2 line-clamp-2 text-sm font-black leading-tight text-white">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-7 rounded-2xl bg-[linear-gradient(145deg,#2e1065,#6d28d9)] p-5 text-white shadow-lg shadow-violet-200">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-200">Publicidade</p>
            <h3 className="mt-3 text-2xl font-black leading-tight">Espaco para Adsense e afiliados</h3>
            <p className="mt-3 text-sm leading-6 text-violet-100">Streaming, bilhetes e parceiros para a Copa do Mundo.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="rounded-[28px] border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
      <Newspaper className="mx-auto size-12 text-violet-200" />
      <h1 className="mt-4 text-2xl font-black text-slate-950">{title}</h1>
      <p className="mt-2 text-slate-500">{copy}</p>
    </section>
  );
}
