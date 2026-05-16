import { NewsIndex } from "@/components/supabase/news-index";
import { PageShell } from "@/components/site-shell";

export const metadata = {
  title: "Noticias de Futebol",
  description: "Ultimas noticias da Copa do Mundo, selecoes, jogos, resultados e analises.",
};

export default function NewsPage() {
  return (
    <PageShell>
      <NewsIndex />
    </PageShell>
  );
}
