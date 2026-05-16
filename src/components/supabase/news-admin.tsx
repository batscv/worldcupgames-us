"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Edit3,
  FileText,
  Globe2,
  ImageIcon,
  LogOut,
  Plus,
  Save,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Tag = {
  id?: string;
  name: string;
  slug: string;
};

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
  og_image_url: string | null;
  category_id: string | null;
  published_at: string | null;
  updated_at: string | null;
  category: Category | null;
  news_post_tags: { tags: Tag | null }[] | null;
};

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  subtitle: string;
  featured_image_url: string;
  body: string;
  status: "draft" | "published" | "scheduled";
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  category_id: string;
  tags: string;
  published_at: string | null;
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
  og_image_url: "",
  category_id: "",
  tags: "",
  published_at: null,
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

function tagList(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((name) => ({ name, slug: slugify(name) }))
    .filter((tag, index, self) => tag.slug && self.findIndex((item) => item.slug === tag.slug) === index);
}

export function NewsAdmin() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");

  const metrics = useMemo(() => {
    const published = posts.filter((post) => post.status === "published").length;
    const drafts = posts.filter((post) => post.status === "draft").length;
    return [
      { label: "Noticias", value: posts.length, icon: FileText },
      { label: "Publicadas", value: published, icon: Globe2 },
      { label: "Rascunhos", value: drafts, icon: Edit3 },
      { label: "Categorias", value: categories.length, icon: Tags },
    ];
  }, [categories.length, posts]);

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesQuery = !needle || `${post.title} ${post.slug} ${post.category?.name || ""}`.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [posts, query, statusFilter]);

  async function loadPosts() {
    if (!supabase) return;
    const [{ data: postData, error: postError }, { data: categoryData, error: categoryError }] = await Promise.all([
      supabase
        .from("news_posts")
        .select("id,title,slug,subtitle,featured_image_url,content,status,seo_title,seo_description,og_image_url,category_id,published_at,updated_at,category:categories(id,name,slug),news_post_tags(tags(name,slug))")
        .order("updated_at", { ascending: false }),
      supabase.from("categories").select("id,name,slug").order("name", { ascending: true }),
    ]);

    if (postError) setMessage(postError.message);
    if (categoryError) setMessage(categoryError.message);
    setPosts((postData || []) as unknown as Post[]);
    setCategories((categoryData || []) as Category[]);
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
    const tags = (post.news_post_tags || [])
      .map((item) => item.tags?.name)
      .filter(Boolean)
      .join(", ");

    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || "",
      featured_image_url: post.featured_image_url || "",
      body: bodyFromContent(post.content),
      status: post.status === "published" || post.status === "scheduled" ? post.status : "draft",
      seo_title: post.seo_title || post.title,
      seo_description: post.seo_description || post.subtitle || "",
      og_image_url: post.og_image_url || post.featured_image_url || "",
      category_id: post.category_id || "",
      tags,
      published_at: post.published_at,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function syncTags(postId: string, tagsValue: string) {
    if (!supabase) return;
    const tags = tagList(tagsValue);
    await supabase.from("news_post_tags").delete().eq("post_id", postId);
    if (!tags.length) return;

    const tagRows: { post_id: string; tag_id: string }[] = [];
    for (const tag of tags) {
      const { data, error } = await supabase
        .from("tags")
        .upsert(tag, { onConflict: "slug" })
        .select("id")
        .single();
      if (!error && data?.id) tagRows.push({ post_id: postId, tag_id: data.id as string });
    }

    if (tagRows.length) await supabase.from("news_post_tags").insert(tagRows);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);

    const slug = form.slug || slugify(form.title);
    const isPublished = form.status === "published";
    const publishedAt = isPublished ? form.published_at || new Date().toISOString() : null;
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
      og_image_url: form.og_image_url || form.featured_image_url || null,
      category_id: form.category_id || null,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    };

    const result = form.id
      ? await supabase.from("news_posts").update(payload).eq("id", form.id).select("id").single()
      : await supabase.from("news_posts").insert(payload).select("id").single();

    if (result.error) {
      setMessage(result.error.message);
    } else {
      await syncTags(result.data.id as string, form.tags);
      setMessage("Noticia guardada com sucesso.");
      setForm(emptyForm);
      await loadPosts();
    }

    setLoading(false);
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!confirm("Apagar esta noticia?")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) setMessage(error.message);
    await loadPosts();
  }

  if (!supabase) {
    return <AdminShell><Panel title="Falta configurar Supabase">Configura as variaveis de ambiente do Supabase primeiro.</Panel></AdminShell>;
  }

  if (!loggedIn) {
    return (
      <AdminShell>
        <form onSubmit={login} className="mx-auto max-w-md rounded-[28px] border border-violet-100 bg-white p-6 shadow-[0_30px_90px_rgba(60,25,120,0.10)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">WorldCupGames CMS</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Admin login</h1>
          <p className="mt-2 text-sm text-slate-500">Usa um usuario Supabase com role admin/editor em public.users.</p>
          <input className="mt-6 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-500" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="mt-3 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          <button disabled={loading} className="mt-5 h-12 w-full rounded-xl bg-violet-700 font-bold text-white shadow-lg shadow-violet-200 disabled:opacity-50">
            Entrar
          </button>
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-700">Painel editorial</p>
          <h1 className="text-4xl font-black text-slate-950">Gerir noticias</h1>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          <LogOut className="size-4" />
          Sair
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">{label}</span>
              <Icon className="size-4 text-violet-600" />
            </div>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <form onSubmit={save} className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_70px_rgba(60,25,120,0.08)]">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            {form.id ? <Edit3 className="size-5 text-violet-600" /> : <Plus className="size-5 text-violet-600" />}
            {form.id ? "Editar noticia" : "Nova noticia"}
          </h2>

          <Field label="Titulo" value={form.title} onChange={(value) => setForm({ ...form, title: value, slug: form.slug || slugify(value), seo_title: form.seo_title || value })} />
          <Field label="Slug SEO" value={form.slug} onChange={(value) => setForm({ ...form, slug: slugify(value) })} />
          <Field label="Subtitulo / resumo" value={form.subtitle} onChange={(value) => setForm({ ...form, subtitle: value, seo_description: form.seo_description || value })} />

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Categoria</span>
            <select className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-violet-500" value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}>
              <option value="">Selecionar categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <Field label="Imagem principal URL" value={form.featured_image_url} onChange={(value) => setForm({ ...form, featured_image_url: value, og_image_url: form.og_image_url || value })} icon={<ImageIcon className="size-4" />} />
          <Field label="Tags separadas por virgula" value={form.tags} onChange={(value) => setForm({ ...form, tags: value })} icon={<Tags className="size-4" />} />

          <label className="mt-4 block text-sm font-semibold text-slate-700">Conteudo</label>
          <textarea className="mt-2 min-h-52 w-full rounded-xl border border-slate-200 px-4 py-3 leading-7 outline-none focus:border-violet-500" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Escreve a noticia. Separa paragrafos com uma linha vazia." />

          <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
            <h3 className="flex items-center gap-2 font-black text-slate-950">
              <BarChart3 className="size-4 text-violet-600" />
              Ferramentas SEO
            </h3>
            <Field label="SEO title" value={form.seo_title} onChange={(value) => setForm({ ...form, seo_title: value })} />
            <CharCount value={form.seo_title} max={60} />
            <Field label="SEO description" value={form.seo_description} onChange={(value) => setForm({ ...form, seo_description: value })} />
            <CharCount value={form.seo_description} max={160} />
            <Field label="OpenGraph image URL" value={form.og_image_url} onChange={(value) => setForm({ ...form, og_image_url: value })} />
            <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-400">worldcupgames.us/news/{form.slug || "slug-da-noticia"}</p>
              <p className="mt-1 text-base font-semibold text-[#1a0dab]">{form.seo_title || form.title || "Titulo SEO da noticia"}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{form.seo_description || form.subtitle || "Descricao SEO que aparece nos motores de busca."}</p>
            </div>
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">Estado</label>
          <select className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="scheduled">Agendado</option>
          </select>

          {message && <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{message}</p>}
          <div className="mt-5 flex gap-3">
            <button disabled={loading} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 font-bold text-white shadow-lg shadow-violet-200 disabled:opacity-50">
              <Save className="size-4" />
              Guardar
            </button>
            <button type="button" onClick={() => setForm(emptyForm)} className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold">
              Limpar
            </button>
          </div>
        </form>

        <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_70px_rgba(60,25,120,0.08)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-black text-slate-950">Todas as noticias</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-500">
                <Search className="size-4" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar" className="h-full bg-transparent outline-none" />
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                <option value="all">Todos</option>
                <option value="published">Publicadas</option>
                <option value="draft">Rascunhos</option>
                <option value="scheduled">Agendadas</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {filteredPosts.map((post) => (
              <article key={post.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fcfbff] p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">{post.status} · {post.category?.name || "Sem categoria"}</p>
                  <h3 className="mt-1 truncate font-black text-slate-950">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">/news/{post.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => edit(post)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                    <Edit3 className="size-4" />
                    Editar
                  </button>
                  <button onClick={() => remove(post.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600">
                    <Trash2 className="size-4" />
                    Apagar
                  </button>
                </div>
              </article>
            ))}
            {!filteredPosts.length && <p className="rounded-2xl border border-dashed border-violet-200 p-6 text-center text-slate-500">Nenhuma noticia encontrada.</p>}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Field({ label, value, onChange, icon }: { label: string; value: string; onChange: (value: string) => void; icon?: React.ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon}
        {label}
      </span>
      <input className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-violet-500" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const good = value.length > 0 && value.length <= max;
  return <p className={`mt-1 text-xs ${good ? "text-emerald-600" : "text-slate-400"}`}>{value.length}/{max} caracteres recomendados</p>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#fbf8ff] p-4 text-slate-950 sm:p-6 lg:p-8">{children}</main>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-xl rounded-[28px] border border-violet-100 bg-white p-6 text-slate-600 shadow-sm">
      <h1 className="text-2xl font-black text-slate-950">{title}</h1>
      <div className="mt-2">{children}</div>
    </section>
  );
}
