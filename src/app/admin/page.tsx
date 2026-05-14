import { adminNav } from "@/lib/data";

export const metadata = { title: "Admin CMS" };

export default function AdminPage() {
  return (
    <div className="relative z-10 min-h-screen bg-[#080d18] text-white">
      <div className="grid min-h-screen lg:grid-cols-[88px_1fr]">
        <aside className="hidden border-r border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl lg:block">
          <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-white text-[#0b1020] font-black">W</div>
          <nav className="space-y-2">
            {adminNav.map(({ label, icon: Icon }) => (
              <button key={label} title={label} className="grid size-12 place-items-center rounded-2xl text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <Icon className="size-5" />
              </button>
            ))}
          </nav>
        </aside>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-blue-300">CMS command center</p>
              <h1 className="text-4xl font-black">WorldCupGames.us Admin</h1>
            </div>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b1020]">Publish update</button>
          </div>
          <section className="grid gap-4 md:grid-cols-4">
            {[
              ["Revenue today", "$128,420"],
              ["Live sessions", "2.8M"],
              ["Articles queued", "146"],
              ["Prediction votes", "9.4M"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
                <p className="text-sm text-zinc-400">{label}</p>
                <p className="mt-3 text-3xl font-black">{value}</p>
                <div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-emerald-300" /></div>
              </div>
            ))}
          </section>
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
              <h2 className="mb-5 font-bold">Publishing pipeline</h2>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                {["SEO title", "News post", "Prediction", "Affiliate slot", "Homepage module"].map((row, index) => (
                  <div key={row} className="grid grid-cols-[1fr_140px_110px] items-center border-b border-white/10 px-4 py-4 text-sm last:border-b-0 hover:bg-white/[0.04]">
                    <span className="font-semibold">{row}</span>
                    <span className="text-zinc-400">{["Ready", "Draft", "Scheduled", "Active", "Testing"][index]}</span>
                    <button className="rounded-full border border-white/10 px-3 py-1 text-xs">Edit</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-bold">Section editor</h2>
              <div className="mt-5 space-y-3">
                {["Hero", "Live matches", "Trending news", "Sponsor banners", "Newsletter"].map((item) => (
                  <label key={item} className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-sm">
                    {item}
                    <input type="checkbox" defaultChecked className="size-4 accent-blue-500" />
                  </label>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
