import { HomeNews } from "@/components/supabase/home-news";
import { ResultsStrip } from "@/components/supabase/results-strip";
import { PageShell } from "@/components/site-shell";

export default function Home() {
  return (
    <PageShell className="space-y-10">
      <HomeNews />
      <ResultsStrip />
    </PageShell>
  );
}
