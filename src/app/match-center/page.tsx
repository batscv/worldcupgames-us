import { ApiMatchCenter } from "@/components/football-data/api-match-center";
import { PageShell } from "@/components/site-shell";

export const metadata = { title: "Live Match Center" };

export default function MatchCenterPage() {
  return (
    <PageShell>
      <ApiMatchCenter />
    </PageShell>
  );
}
