import { PageShell } from "@/components/site-shell";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-md rounded-[24px] border border-white/10 bg-white/[0.055] p-6">
        <h1 className="text-3xl font-black">Join WorldCupGames.us</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Register or login to save predictions, follow teams, earn points and create fantasy leagues.</p>
        <form className="mt-6 space-y-4">
          <input className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none focus:border-blue-300/60" placeholder="Email" type="email" />
          <input className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none focus:border-blue-300/60" placeholder="Password" type="password" />
          <button className="h-12 w-full rounded-2xl bg-white font-bold text-[#0b1020]">Continue</button>
        </form>
      </section>
    </PageShell>
  );
}
