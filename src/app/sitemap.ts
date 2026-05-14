import type { MetadataRoute } from "next";
import { articles, matches } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://worldcupgames.us";
  const staticRoutes = ["", "/match-center", "/simulator", "/login", "/admin"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...articles.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...matches.flatMap((match) => [
      {
        url: `${base}/predictions/${match.slug}`,
        lastModified: new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.9,
      },
      {
        url: `${base}/watch/${match.slug}-live`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.85,
      },
    ]),
  ];
}
