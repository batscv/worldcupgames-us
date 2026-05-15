"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  featured_image_url: string | null;
  published_at: string | null;
};

function dateLabel(value: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function HomeNews() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hero = useMemo(() => posts[0], [posts]);
  const rest = useMemo(() => posts.slice(1), [posts]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase environment variables are missing.");
        setLoading(false);
        return;
      }

      const { data, error: loadError } = await supabase
        .from("news_posts")
        .select("id,title,slug,subtitle,featured_image_url,published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(9);

      if (loadError) setError(loadError.message);
      setPosts((data || []) as Post[]);
      setLoading(false);
    }

    void load();
  }, []);

  if (loading) {
    return <div className="h-[420px] rounded-3xl shimmer" />;
  }

  if (error) {
    return <Empty title="Could not load news" copy={error} />;
  }

  if (!hero) {
    return <Empty title="No published news yet" copy="Create and publish a news post in the admin panel." />;
  }

  return (
    <section className="space-y-8">
      <Link
        href={`/news/${hero.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="relative min-h-[320px] bg-slate-100">
          {hero.featured_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.featured_image_url} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-slate-100">
              <Newspaper className="size-16 text-slate-300" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Latest news</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">{hero.title}</h1>
          {hero.subtitle && <p className="mt-4 text-lg leading-8 text-slate-600">{hero.subtitle}</p>}
          <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-slate-950">
            Read article
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-950">Latest articles</h2>
          <Link href="/news" className="text-sm font-semibold text-blue-700">View all</Link>
        </div>
        {rest.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {rest.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative h-40 bg-slate-100">
                  {post.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.featured_image_url} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                  ) : (
                    <div className="grid size-full place-items-center">
                      <Newspaper className="size-8 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-500">{dateLabel(post.published_at)}</p>
                  <h3 className="mt-2 line-clamp-2 font-bold text-slate-950">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <Newspaper className="mx-auto size-12 text-slate-300" />
      <h1 className="mt-4 text-2xl font-black text-slate-950">{title}</h1>
      <p className="mt-2 text-slate-500">{copy}</p>
    </section>
  );
}
