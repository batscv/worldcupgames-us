"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  featured_image_url: string | null;
  content: unknown;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
};

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  subtitle: string;
  featured_image_url: string;
  body: string;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
};

const emptyForm: FormState = {
  id: null,
  title: "",
  slug: "",
  subtitle: "",
  featured_image_url: "",
  body: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function bodyFromContent(content: unknown) {
  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (block && typeof block === "object" && "text" in block) {
          return String((block as { text?: unknown }).text || "");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

export function NewsAdmin() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("news_posts")
      .select("id,title,slug,subtitle,featured_image_url,content,status,seo_title,seo_description,published_at")
      .order("updated_at", { ascending: false });

    if (error) setMessage(error.message);
    setPosts((data || []) as Post[]);
  }

  useEffect(() => {
    async function init() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      setLoggedIn(Boolean(data.session));
      if (data.session) await loadPosts();
    }

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function login(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setLoggedIn(true);
      await loadPosts();
    }
    setLoading(false);
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setLoggedIn(false);
    setPosts([]);
  }

  function edit(post: Post) {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || "",
      featured_image_url: post.featured_image_url || "",
      body: bodyFromContent(post.content),
      status: post.status === "published" ? "published" : "draft",
      seo_title: post.seo_title || post.title,
      seo_description: post.seo_description || post.subtitle || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);

    const slug = form.slug || slugify(form.title);
    const payload = {
      title: form.title,
      slug,
      subtitle: form.subtitle || null,
      featured_image_url: form.featured_image_url || null,
      content: form.body
        .split(/\n{2,}/)
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({ type: "paragraph", text })),
      status: form.status,
      seo_title: form.seo_title || form.title,
      seo_description: form.seo_description || form.subtitle || null,
      published_at: form.status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const result = form.id
      ? await supabase.from("news_posts").update(payload).eq("id", form.id)
      : await supabase.from("news_posts").insert(payload);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("News saved.");
      setForm(emptyForm);
      await loadPosts();
    }

    setLoading(false);
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!confirm("Delete this news post?")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) setMessage(error.message);
    await loadPosts();
  }

  if (!supabase) {
    return <AdminShell><Panel title="Missing Supabase config">Configure Supabase environment variables first.</Panel></AdminShell>;
  }

  if (!loggedIn) {
    return (
      <AdminShell>
        <form onSubmit={login} className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">Admin login</h1>
          <p className="mt-2 text-sm text-slate-500">Use a Supabase Auth user with role admin/editor in `public.users`.</p>
          <input className="mt-6 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="mt-3 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          <button disabled={loading} className="mt-5 h-12 w-full rounded-xl bg-slate-950 font-bold text-white disabled:opacity-50">
            Login
          </button>
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">News CMS</p>
          <h1 className="text-4xl font-black text-slate-950">Manage news</h1>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
          <LogOut className="size-4" />
          Logout
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={save} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            {form.id ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
            {form.id ? "Edit news" : "New news"}
          </h2>
          <Field label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value, slug: form.slug || slugify(value), seo_title: form.seo_title || value })} />
          <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: slugify(value) })} />
          <Field label="Subtitle" value={form.subtitle} onChange={(value) => setForm({ ...form, subtitle: value, seo_description: form.seo_description || value })} />
          <Field label="Featured image URL" value={form.featured_image_url} onChange={(value) => setForm({ ...form, featured_image_url: value })} />
          <label className="mt-4 block text-sm font-semibold text-slate-700">Content</label>
          <textarea className="mt-2 min-h-44 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Field label="SEO title" value={form.seo_title} onChange={(value) => setForm({ ...form, seo_title: value })} />
          <Field label="SEO description" value={form.seo_description} onChange={(value) => setForm({ ...form, seo_description: value })} />
          <label className="mt-4 block text-sm font-semibold text-slate-700">Status</label>
          <select className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
          <div className="mt-5 flex gap-3">
            <button disabled={loading} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 font-bold text-white disabled:opacity-50">
              <Save className="size-4" />
              Save
            </button>
            <button type="button" onClick={() => setForm(emptyForm)} className="h-12 rounded-xl border border-slate-200 px-4 font-semibold">
              Clear
            </button>
          </div>
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">All news</h2>
          <div className="mt-5 space-y-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{post.status}</p>
                  <h3 className="mt-1 font-bold text-slate-950">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">/news/{post.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => edit(post)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">
                    <Edit3 className="size-4" />
                    Edit
                  </button>
                  <button onClick={() => remove(post.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600">
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {!posts.length && <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No news yet.</p>}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">{children}</main>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
      <h1 className="text-2xl font-black text-slate-950">{title}</h1>
      <div className="mt-2">{children}</div>
    </section>
  );
}
