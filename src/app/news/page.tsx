import { NewsIndex } from "@/components/supabase/news-index";
import { PageShell } from "@/components/site-shell";

export const metadata = {
  title: "News",
  description: "Latest World Cup news published from the CMS.",
};

export default function NewsPage() {
  return (
    <PageShell>
      <NewsIndex />
    </PageShell>
  );
}
