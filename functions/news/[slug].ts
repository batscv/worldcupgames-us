import { createClient } from "@supabase/supabase-js";

type PagesContext = {
  request: Request;
  env: {
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  };
  params: {
    slug: string;
  };
};

type Post = {
  title: string;
  slug: string;
  subtitle: string | null;
  featured_image_url: string | null;
  content: unknown;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  published_at: string | null;
  category: { name: string; slug: string } | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paragraphs(content: unknown) {
  if (!Array.isArray(content)) return "";
  return content
    .map((block) => {
      if (!block || typeof block !== "object" || !("text" in block)) return "";
      const text = String((block as { text?: unknown }).text || "").trim();
      return text ? `<p>${escapeHtml(text)}</p>` : "";
    })
    .join("");
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export async function onRequestGet({ env, params }: PagesContext) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return new Response("Missing Supabase environment variables.", { status: 500 });
  }

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("news_posts")
    .select("title,slug,subtitle,featured_image_url,content,seo_title,seo_description,og_image_url,published_at,category:categories(name,slug)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .maybeSingle<Post>();

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const title = data.seo_title || data.title;
  const description = data.seo_description || data.subtitle || "";
  const url = new URL(`/news/${data.slug}`, "https://worldcupgames.us").toString();
  const image = data.og_image_url || data.featured_image_url || "";
  const imageMeta = image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : "";
  const heroImage = data.featured_image_url ? `<img src="${escapeHtml(data.featured_image_url)}" alt="" />` : "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: data.title,
    description,
    image: image ? [image] : undefined,
    datePublished: data.published_at,
    dateModified: data.published_at,
    author: { "@type": "Organization", name: "WorldCupGames.us" },
    publisher: { "@type": "Organization", name: "WorldCupGames.us" },
    mainEntityOfPage: url,
    articleSection: data.category?.name || "Copa do Mundo",
  };

  return new Response(
    `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | WorldCupGames.us</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(url)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  ${imageMeta}
  <script type="application/ld+json">${jsonLd(articleSchema)}</script>
  <style>
    body{margin:0;background:radial-gradient(circle at 12% 8%,rgba(124,58,237,.10),transparent 26%),#fbf8ff;color:#101828;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    header,main{max-width:1040px;margin:0 auto;padding:24px}
    a{color:inherit}
    header{font-weight:900}
    article{background:#fff;border:1px solid #ede9fe;border-radius:28px;overflow:hidden;box-shadow:0 30px 90px rgba(60,25,120,.10)}
    img{width:100%;max-height:560px;object-fit:cover;display:block;background:#eef2f7}
    .content{padding:clamp(24px,5vw,56px)}
    .date{text-transform:uppercase;letter-spacing:.16em;color:#6d28d9;font-size:12px;font-weight:900}
    h1{font-size:clamp(34px,6vw,64px);line-height:1;margin:14px 0;color:#101828}
    .subtitle{font-size:20px;line-height:1.65;color:#475467}
    p{font-size:18px;line-height:1.8;color:#344054}
    .tag{display:inline-block;margin-top:18px;border:1px solid #ede9fe;background:#f5f3ff;border-radius:999px;padding:8px 12px;color:#6d28d9;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}
  </style>
</head>
<body>
  <header><a href="/">WorldCupGames.us</a></header>
  <main>
    <article>
      ${heroImage}
      <div class="content">
        <div class="date">${data.published_at ? escapeHtml(new Date(data.published_at).toDateString()) : "News"}</div>
        <h1>${escapeHtml(data.title)}</h1>
        ${data.subtitle ? `<div class="subtitle">${escapeHtml(data.subtitle)}</div>` : ""}
        <div class="tag">${escapeHtml(data.category?.name || "Copa do Mundo")}</div>
        ${paragraphs(data.content)}
      </div>
    </article>
  </main>
</body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    },
  );
}
