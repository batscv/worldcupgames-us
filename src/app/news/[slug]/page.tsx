import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard, SocialShare } from "@/components/cards";
import { Badge, PageShell } from "@/components/site-shell";
import { articles } from "@/lib/data";
import { readingTime } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.subtitle,
    openGraph: { title: article.title, description: article.subtitle, images: [article.image], type: "article" },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== article.slug);

  return (
    <PageShell>
      <article className="mx-auto max-w-4xl">
        <Badge>{article.category} · {readingTime(article.content)} min read</Badge>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">{article.title}</h1>
        <p className="mt-5 text-xl leading-8 text-zinc-300">{article.subtitle}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-400">
          <p>{article.author} · {article.date}</p>
          <SocialShare />
        </div>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[24px] border border-white/10">
          <Image src={article.image} alt="" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="my-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-5 text-center text-sm text-zinc-400">
          Google AdSense responsive article placement
        </div>
        <div className="space-y-6 text-lg leading-9 text-zinc-200">
          {[article.content, "The editorial system supports reusable content blocks, affiliate callouts, sponsor modules, OpenGraph images, schema markup, tags, categories, author profiles and internal linking. Each article can be optimized around high-intent World Cup search clusters without sacrificing a premium reading experience.", "For live tournament publishing, the CMS can schedule previews, push injury updates, refresh prediction modules and attach match cards directly inside long-form articles."].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">#{tag}</span>)}
        </div>
      </article>
      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-bold">Related articles</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {related.map((item) => <ArticleCard key={item.slug} article={item} />)}
        </div>
      </section>
    </PageShell>
  );
}
