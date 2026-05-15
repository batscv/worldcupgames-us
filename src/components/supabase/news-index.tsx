"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  featured_image_url: string | null;
  published_at: string | null;
};

export function NewsIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("news_posts")
        .select("id,title,slug,subtitle,featured_image_url,published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      setPosts((data || []) as Post[]);
      setLoading(false);
    }

    void load();
  }, []);

  return (
    <section>
      <h1 className="text-4xl font-black text-slate-950">News</h1>
      <p className="mt-3 text-slate-500">All articles published through the CMS.</p>
      {loading ? <div className="mt-8 h-80 rounded-3xl shimmer" /> : null}
      {!loading && !posts.length ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Newspaper className="mx-auto size-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-950">No news published yet.</p>
        </div>
      ) : null}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/${post.slug}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative h-48 bg-slate-100">
              {post.featured_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.featured_image_url} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
              ) : (
                <div className="grid size-full place-items-center">
                  <Newspaper className="size-10 text-slate-300" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-black text-slate-950">{post.title}</h2>
              {post.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.subtitle}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
