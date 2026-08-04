import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  FlaskConical,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import {
  AdminFormField,
  AdminFormSection,
  inputClass,
} from "@/components/admin/AdminFormField";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminGalleryField } from "@/components/admin/AdminGalleryField";
import { AdminCtaHrefField } from "@/components/admin/AdminCtaHrefField";
import { BlogPostPreview } from "@/components/blog/BlogPostPreview";
import { BlogRichTextEditor } from "@/components/blog/BlogRichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  autoBlogSeo,
  BLOG_SECTION_TYPES,
  BLOG_STATUS_LABELS,
  blogSectionHint,
  MAX_FEATURED_BLOG_POSTS,
  slugifyBlog,
} from "@/lib/blog";
import { buildBlogEditorTestData, isLocalAdminDev } from "@/lib/blogTestData";
import {
  resolvePendingUploadUrl,
  resolvePendingUploadUrls,
} from "@/lib/pendingUploads";
import {
  buildSocialEmbedFromUrl,
  resolveBlogEmbed,
} from "@/lib/blogEmbed";
import {
  blogIssueJumpTargets,
  issuesForSection,
  validateBlogEditor,
} from "@/lib/blogValidation";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostSection,
  BlogSectionType,
  BlogTag,
  Development,
} from "@shared/api";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  hero_image_url: string;
  author_id: string;
  category_id: string;
  status: string;
  published_at: string;
  scheduled_at: string;
  is_featured: boolean;
  display_order: number;
  auto_seo: boolean;
  tag_ids: number[];
  sections: BlogPostSection[];
};

const emptySection = (type: BlogSectionType = "text"): BlogPostSection => ({
  section_type: type,
  title: "",
  body: "",
  image_url: "",
  meta_json: type === "gallery" ? { images: [] } : {},
  display_order: 0,
  is_active: 1,
});

function toLocalInput(value?: string | null): string {
  if (!value) return "";
  const d = value.replace(" ", "T").slice(0, 16);
  return d;
}

export default function AdminBlogPostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nuevo";
  const navigate = useNavigate();

  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [projects, setProjects] = useState<Development[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  /** Once the admin edits the slug, stop syncing it from the title. */
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [previewOpen, setPreviewOpen] = useState(false);
  const showDevTools = isLocalAdminDev();
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    excerpt: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    hero_image_url: "",
    author_id: "",
    category_id: "",
    status: "draft",
    published_at: "",
    scheduled_at: "",
    is_featured: false,
    display_order: 0,
    auto_seo: true,
    tag_ids: [],
    sections: [emptySection("text")],
  });

  const loadFeatured = useCallback(() => {
    adminAxios
      .get("/api/admin/blog-posts.php?featured=1")
      .then((res) => setFeaturedPosts(res.data.posts ?? []))
      .catch(() => setFeaturedPosts([]));
  }, []);

  useEffect(() => {
    Promise.all([
      adminAxios.get("/api/admin/blog-authors.php"),
      adminAxios.get("/api/admin/blog-categories.php"),
      adminAxios.get("/api/admin/blog-tags.php"),
      adminAxios.get("/api/admin/developments.php"),
    ]).then(([a, c, t, d]) => {
      setAuthors(a.data.authors ?? []);
      setCategories(c.data.categories ?? []);
      setTags(t.data.tags ?? []);
      setProjects(d.data.developments ?? []);
    });
    loadFeatured();
  }, [loadFeatured]);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    adminAxios
      .get(`/api/admin/blog-posts.php?id=${id}`)
      .then((res) => {
        const p = res.data.post as BlogPost;
        setForm({
          title: p.title ?? "",
          slug: p.slug ?? "",
          excerpt: p.excerpt ?? "",
          meta_title: p.meta_title ?? "",
          meta_description: p.meta_description ?? "",
          meta_keywords: p.meta_keywords ?? "",
          hero_image_url: p.hero_image_url ?? "",
          author_id: p.author_id ? String(p.author_id) : "",
          category_id: p.category_id ? String(p.category_id) : "",
          status: p.status ?? "draft",
          published_at: toLocalInput(p.published_at),
          scheduled_at: toLocalInput(p.scheduled_at),
          is_featured: !!p.is_featured,
          display_order: p.display_order ?? 0,
          auto_seo: true,
          tag_ids: p.tag_ids ?? [],
          sections:
            p.sections && p.sections.length > 0
              ? p.sections.map((s) => {
                  let meta: Record<string, unknown> = {};
                  if (typeof s.meta_json === "string") {
                    try {
                      meta = JSON.parse(s.meta_json || "{}") as Record<
                        string,
                        unknown
                      >;
                    } catch {
                      meta = {};
                    }
                  } else if (s.meta_json && typeof s.meta_json === "object") {
                    meta = s.meta_json as Record<string, unknown>;
                  }
                  return { ...s, meta_json: meta };
                })
              : [emptySection("text")],
        });
      })
      .catch((err) => setMsg({ type: "err", text: getAdminApiError(err) }))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const applyAutoSeo = useCallback(() => {
    const tagNames = tags
      .filter((t) => form.tag_ids.includes(t.id))
      .map((t) => t.name);
    const seo = autoBlogSeo({
      title: form.title,
      excerpt: form.excerpt,
      tags: tagNames,
    });
    setForm((prev) => ({
      ...prev,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      meta_keywords: seo.meta_keywords,
    }));
  }, [form.title, form.excerpt, form.tag_ids, tags]);

  // Slug always follows title until the admin edits it manually
  useEffect(() => {
    if (slugTouched || !form.title.trim()) return;
    const t = setTimeout(() => {
      setForm((prev) => {
        if (slugTouched) return prev;
        const next = slugifyBlog(prev.title);
        return prev.slug === next ? prev : { ...prev, slug: next };
      });
    }, 200);
    return () => clearTimeout(t);
  }, [form.title, slugTouched]);

  // Live SEO while auto is on (updates as title / extract / tags change)
  useEffect(() => {
    if (!form.auto_seo || !form.title.trim()) return;
    const t = setTimeout(() => applyAutoSeo(), 250);
    return () => clearTimeout(t);
  }, [form.auto_seo, form.title, form.excerpt, form.tag_ids, applyAutoSeo]);

  const updateSection = (index: number, patch: Partial<BlogPostSection>) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], ...patch };
      return { ...prev, sections };
    });
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.sections];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return {
        ...prev,
        sections: next.map((s, i) => ({ ...s, display_order: i })),
      };
    });
  };

  const save = async () => {
    const check = validateBlogEditor(form);
    if (!check.ok) {
      setMsg({
        type: "err",
        text: check.summary ?? "Completa los campos obligatorios.",
      });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      // Upload deferred local files only when the article is saved.
      const hero_image_url = await resolvePendingUploadUrl(
        form.hero_image_url,
        "blog",
      );
      const sections: BlogPostSection[] = [];
      for (let i = 0; i < form.sections.length; i++) {
        const s = form.sections[i];
        const image_url = await resolvePendingUploadUrl(s.image_url, "blog");
        const prevMeta =
          s.meta_json && typeof s.meta_json === "object" && !Array.isArray(s.meta_json)
            ? (s.meta_json as Record<string, unknown>)
            : {};
        const meta: Record<string, unknown> = { ...prevMeta };
        if (
          s.section_type === "gallery" &&
          Array.isArray(meta.images)
        ) {
          meta.images = await resolvePendingUploadUrls(
            meta.images as string[],
            "blog",
          );
        }
        sections.push({
          ...s,
          image_url,
          meta_json: meta,
          display_order: i,
        });
      }

      const resolvedForm = { ...form, hero_image_url, sections };
      setForm(resolvedForm);

      const payload = {
        ...(isNew ? {} : { id: Number(id) }),
        title: resolvedForm.title,
        slug: resolvedForm.slug,
        excerpt: resolvedForm.excerpt || null,
        meta_title: resolvedForm.meta_title || null,
        meta_description: resolvedForm.meta_description || null,
        meta_keywords: resolvedForm.meta_keywords || null,
        hero_image_url: resolvedForm.hero_image_url || null,
        author_id: resolvedForm.author_id
          ? Number(resolvedForm.author_id)
          : null,
        category_id: resolvedForm.category_id
          ? Number(resolvedForm.category_id)
          : null,
        status: resolvedForm.status,
        published_at:
          resolvedForm.status === "draft"
            ? null
            : resolvedForm.published_at || null,
        scheduled_at:
          resolvedForm.status === "scheduled"
            ? resolvedForm.scheduled_at || null
            : null,
        is_featured: resolvedForm.is_featured ? 1 : 0,
        display_order: resolvedForm.display_order,
        auto_seo: resolvedForm.auto_seo,
        tag_ids: resolvedForm.tag_ids,
        sections: resolvedForm.sections.map((s, i) => ({
          ...s,
          display_order: i,
          meta_json: s.meta_json ?? {},
        })),
      };

      const res = isNew
        ? await adminAxios.post("/api/admin/blog-posts.php", payload)
        : await adminAxios.put("/api/admin/blog-posts.php", payload);
      setMsg({ type: "ok", text: "Artículo guardado." });
      if (res.data.featured_demoted > 0) {
        setMsg({
          type: "ok",
          text: `Artículo guardado. Se desmarcaron ${res.data.featured_demoted} destacado(s) antiguo(s) (máx. ${res.data.featured_max ?? MAX_FEATURED_BLOG_POSTS}).`,
        });
      }
      setPreviewOpen(false);
      loadFeatured();
      if (isNew && res.data.id) {
        navigate(`/admin/blog/${res.data.id}`, { replace: true });
      }
    } catch (err) {
      setMsg({ type: "err", text: getAdminApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const selectedAuthor =
    authors.find((a) => String(a.id) === form.author_id) ?? null;
  const selectedCategory =
    categories.find((c) => String(c.id) === form.category_id) ?? null;
  const selectedTags = tags.filter((t) => form.tag_ids.includes(t.id));

  const currentPostId = !isNew && id ? Number(id) : 0;
  const otherFeatured = [...featuredPosts]
    .filter((p) => p.id !== currentPostId)
    .sort((a, b) => {
      const ta = a.published_at || a.updated_at || "";
      const tb = b.published_at || b.updated_at || "";
      return ta.localeCompare(tb) || a.id - b.id;
    });
  const featuredSlotsUsed = otherFeatured.length + (form.is_featured ? 1 : 0);
  const wouldDisplace =
    form.is_featured && otherFeatured.length >= MAX_FEATURED_BLOG_POSTS;
  const displaceTargets = wouldDisplace
    ? otherFeatured.slice(
        0,
        otherFeatured.length - (MAX_FEATURED_BLOG_POSTS - 1),
      )
    : [];

  const validation = useMemo(() => validateBlogEditor(form), [form]);
  const canPreviewOrSave = validation.ok && !saving;
  const validationHint =
    validation.summary ??
    (saving ? "Guardando…" : "Completa los campos obligatorios");
  const missingTargets = useMemo(
    () => blogIssueJumpTargets(validation.issues),
    [validation.issues],
  );

  const goToMissing = (anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-cu-orange", "ring-offset-2");
    window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-cu-orange", "ring-offset-2");
    }, 1600);
    const focusable = el.querySelector<HTMLElement>(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled]), [contenteditable='true']",
    );
    focusable?.focus({ preventScroll: true });
  };

  const openPreview = () => {
    if (!validation.ok) {
      setMsg({
        type: "err",
        text:
          validation.summary ??
          "Completa el artículo antes de previsualizar.",
      });
      return;
    }
    setMsg(null);
    setPreviewOpen(true);
  };

  const fillTestData = () => {
    const data = buildBlogEditorTestData({
      authors,
      categories,
      tags,
      flow: "published",
    });
    setSlugTouched(true);
    setForm(data);
    setMsg({
      type: "ok",
      text: "Datos de prueba cargados. Cambia el estado en el formulario si quieres otro flujo.",
    });
  };

  if (loading) {
    return <p className="text-cu-concrete">Cargando artículo…</p>;
  }

  return (
    <div className="cu-admin-page space-y-6 max-w-4xl min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/blog"
            className="inline-flex items-center gap-1 text-sm text-cu-concrete hover:text-cu-orange mb-2"
          >
            <ArrowLeft size={14} /> Volver al blog
          </Link>
          <h1 className="font-montserrat font-bold text-2xl text-cu-black">
            {isNew ? "Nuevo artículo" : "Editar artículo"}
          </h1>
          <p className="text-xs text-cu-concrete mt-1">
            Gestionar:{" "}
            <Link
              to="/admin/blog/autores"
              className="text-cu-orange hover:underline font-semibold"
            >
              Autores
            </Link>
            {" · "}
            <Link
              to="/admin/blog/categorias"
              className="text-cu-orange hover:underline font-semibold"
            >
              Categorías
            </Link>
            {" · "}
            <Link
              to="/admin/blog/etiquetas"
              className="text-cu-orange hover:underline font-semibold"
            >
              Etiquetas
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {showDevTools && (
            <button
              type="button"
              onClick={fillTestData}
              className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-amber-500/60 text-amber-900 bg-amber-50 text-xs font-semibold rounded-sm hover:bg-amber-100"
              title="Solo visible en desarrollo local"
            >
              <FlaskConical size={14} /> Datos de prueba
            </button>
          )}
          <button
            type="button"
            onClick={openPreview}
            disabled={!canPreviewOrSave}
            title={
              !validation.ok
                ? validationHint
                : "Revisa el artículo y luego guárdalo desde la vista previa"
            }
            className="inline-flex items-center gap-2 px-5 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm hover:bg-cu-orange-80 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Eye size={16} /> Vista previa y guardar
          </button>
        </div>
      </div>

      {msg && (
        <p
          className={`text-sm px-4 py-2 rounded-sm border ${
            msg.type === "ok"
              ? "text-green-800 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {msg.text}
        </p>
      )}

      {!validation.ok && (
        <p className="text-sm px-4 py-2 rounded-sm border text-amber-900 bg-amber-50 border-amber-200">
          Completa los campos obligatorios para abrir la vista previa
          {validation.issues.length > 1
            ? ` (${validation.issues.length} pendientes).`
            : "."}{" "}
          {validation.summary}
        </p>
      )}

      {validation.ok && (
        <p className="text-sm px-4 py-2 rounded-sm border text-cu-concrete bg-cu-warm-white/60 border-cu-stone/25">
          Para guardar, abre <span className="font-semibold text-cu-black">Vista previa</span>{" "}
          y confirma con <span className="font-semibold text-cu-black">Guardar artículo</span>.
          Así revisas el resultado antes de publicarlo.
        </p>
      )}

      <div className="bg-white border border-cu-stone/30 rounded-sm p-6 space-y-8 shadow-sm min-w-0 overflow-visible">
        <AdminFormSection title="Contenido principal">
          <div id="blog-field-title" className="rounded-sm transition-shadow">
            <AdminFormField id="title" label="Título" required value={form.title}>
              <input
                id="title"
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </AdminFormField>
          </div>
          <AdminFormField
            id="slug"
            label="Slug URL"
            hint="Se genera del título automáticamente. Puedes editarlo. Si ya existe, al guardar se añade -2, -3… para evitar duplicados. Ruta: /blog/tu-slug"
            value={form.slug}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="slug"
                className={`${inputClass} flex-1`}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                onBlur={() => {
                  if (!form.slug.trim()) {
                    setSlugTouched(false);
                    setForm((prev) => ({
                      ...prev,
                      slug: slugifyBlog(prev.title),
                    }));
                    return;
                  }
                  setForm((prev) => ({
                    ...prev,
                    slug: slugifyBlog(prev.slug),
                  }));
                }}
              />
              {slugTouched && (
                <button
                  type="button"
                  className="shrink-0 px-3 py-2 text-xs font-montserrat font-semibold text-cu-orange border border-cu-orange/40 rounded-sm hover:bg-cu-orange/5"
                  onClick={() => {
                    setSlugTouched(false);
                    setForm((prev) => ({
                      ...prev,
                      slug: slugifyBlog(prev.title),
                    }));
                  }}
                >
                  Regenerar del título
                </button>
              )}
            </div>
          </AdminFormField>
          <AdminFormField
            id="excerpt"
            label="Extracto"
            maxLength={400}
            value={form.excerpt}
          >
            <textarea
              id="excerpt"
              rows={3}
              maxLength={400}
              className={inputClass}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </AdminFormField>
          <AdminImageField
            id="hero"
            label="Imagen destacada"
            folder="blog"
            uploadOnSelect={false}
            value={form.hero_image_url}
            onChange={(url) => setForm({ ...form, hero_image_url: url })}
          />
        </AdminFormSection>

        <AdminFormSection title="Publicación">
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminFormField id="status" label="Estado" value={form.status}>
              <select
                id="status"
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {Object.entries(BLOG_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <div id="blog-field-author_id" className="rounded-sm transition-shadow">
              <AdminFormField
                id="author"
                label="Autor"
                required
                value={form.author_id}
              >
                <select
                  id="author"
                  className={inputClass}
                  required
                  value={form.author_id}
                  onChange={(e) =>
                    setForm({ ...form, author_id: e.target.value })
                  }
                >
                  <option value="">— Selecciona un autor —</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </AdminFormField>
            </div>
            <AdminFormField
              id="category"
              label="Categoría"
              value={form.category_id}
            >
              <select
                id="category"
                className={inputClass}
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">— Sin categoría —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </AdminFormField>
            {form.status === "scheduled" && (
              <div
                id="blog-field-scheduled_at"
                className="rounded-sm transition-shadow"
              >
                <AdminFormField
                  id="scheduled_at"
                  label="Publicar el"
                  hint="Fecha y hora local del servidor."
                  value={form.scheduled_at}
                >
                  <input
                    id="scheduled_at"
                    type="datetime-local"
                    className={inputClass}
                    value={form.scheduled_at}
                    onChange={(e) =>
                      setForm({ ...form, scheduled_at: e.target.value })
                    }
                  />
                </AdminFormField>
              </div>
            )}
            {form.status === "published" && (
              <AdminFormField
                id="published_at"
                label="Fecha de publicación"
                value={form.published_at}
              >
                <input
                  id="published_at"
                  type="datetime-local"
                  className={inputClass}
                  value={form.published_at}
                  onChange={(e) =>
                    setForm({ ...form, published_at: e.target.value })
                  }
                />
              </AdminFormField>
            )}
          </div>
          <aside className="rounded-sm border border-cu-stone/30 bg-white px-4 py-4 space-y-3 min-w-0 shadow-sm">
            <label className="flex items-start gap-3 text-sm font-montserrat cursor-pointer min-w-0">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({ ...form, is_featured: e.target.checked })
                }
                className="accent-cu-orange mt-1 shrink-0"
              />
              <span className="min-w-0 flex-1 space-y-1">
                <span className="font-semibold text-cu-black block">
                  Artículo destacado
                </span>
                <span className="block text-sm text-cu-concrete font-josefin font-normal leading-relaxed">
                  Si lo activas y el artículo está publicado, aparece en el bloque
                  de blog del inicio y se prioriza en /blog. Sin ningún destacado,
                  esa sección del home no se muestra.
                </span>
                <span className="block text-sm font-montserrat text-cu-black">
                  Cupo usado:{" "}
                  {Math.min(featuredSlotsUsed, MAX_FEATURED_BLOG_POSTS)}/
                  {MAX_FEATURED_BLOG_POSTS}
                </span>
              </span>
            </label>

            <div className="text-sm text-cu-concrete font-josefin leading-relaxed border-t border-cu-stone/20 pt-3 space-y-2 min-w-0">
              <p>
                <span className="font-montserrat font-semibold text-cu-black">
                  Estrategia:{" "}
                </span>
                si ya hay {MAX_FEATURED_BLOG_POSTS} y marcas este, al guardar
                sustituye al más antiguo (por fecha de publicación). El home
                siempre muestra lo más reciente entre los destacados.
              </p>
              {otherFeatured.length > 0 ? (
                <p>
                  <span className="font-montserrat font-semibold text-cu-black">
                    Ahora destacados:{" "}
                  </span>
                  {otherFeatured.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 ? " · " : ""}
                      <Link
                        to={`/admin/blog/${p.id}`}
                        className="text-cu-orange hover:underline font-montserrat font-semibold"
                      >
                        {p.title}
                      </Link>
                    </span>
                  ))}
                  {form.is_featured && currentPostId > 0
                    ? " · (este artículo)"
                    : ""}
                </p>
              ) : (
                <p>Aún no hay otros artículos destacados.</p>
              )}
              {wouldDisplace && displaceTargets.length > 0 && (
                <p className="text-amber-950 bg-amber-50 border border-amber-300 rounded-sm px-3 py-2">
                  Al guardar se quitará el destacado de{" "}
                  {displaceTargets.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 ? ", " : ""}
                      <strong>«{p.title}»</strong>
                    </span>
                  ))}{" "}
                  (el más antiguo) para hacer espacio a este.
                </p>
              )}
              <p>
                Los proyectos destacados del home son otra lista (desarrollos),
                no del blog.
              </p>
            </div>
          </aside>
          <div>
            <p className="text-sm font-montserrat font-medium text-cu-black mb-1">
              Etiquetas
            </p>
            <p className="text-xs text-cu-concrete mb-2 font-josefin leading-relaxed">
              Temas opcionales para filtrar el blog y reforzar SEO. Un artículo
              puede tener varias; la categoría define el tema principal.
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => {
                const on = form.tag_ids.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        tag_ids: on
                          ? prev.tag_ids.filter((x) => x !== t.id)
                          : [...prev.tag_ids, t.id],
                      }))
                    }
                    className={`px-3 py-1 text-xs font-semibold rounded-sm border ${
                      on
                        ? "bg-cu-orange text-white border-cu-orange"
                        : "bg-white text-cu-concrete border-cu-stone/30"
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
              {tags.length === 0 && (
                <p className="text-xs text-cu-concrete">
                  No hay etiquetas.{" "}
                  <Link
                    to="/admin/blog/etiquetas"
                    className="text-cu-orange hover:underline"
                  >
                    Crear
                  </Link>
                </p>
              )}
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="SEO"
          description="Activo por defecto: meta title, description y keywords se rellenan solos mientras escribes el título y el extracto. Desmárcalo solo si quieres editarlos a mano."
        >
          <label className="flex items-start gap-3 text-sm font-montserrat cursor-pointer mb-3 min-w-0">
            <input
              type="checkbox"
              checked={form.auto_seo}
              onChange={(e) => {
                const on = e.target.checked;
                if (!on) {
                  setForm({ ...form, auto_seo: false });
                  return;
                }
                const tagNames = tags
                  .filter((t) => form.tag_ids.includes(t.id))
                  .map((t) => t.name);
                const seo = autoBlogSeo({
                  title: form.title,
                  excerpt: form.excerpt,
                  tags: tagNames,
                });
                setForm({
                  ...form,
                  auto_seo: true,
                  meta_title: seo.meta_title,
                  meta_description: seo.meta_description,
                  meta_keywords: seo.meta_keywords,
                });
              }}
              className="accent-cu-orange mt-0.5 shrink-0"
            />
            <span className="min-w-0 flex-1 leading-snug">
              Generar meta title, description y keywords automáticamente
            </span>
          </label>
          <AdminFormField
            id="meta_title"
            label="Meta title"
            maxLength={200}
            value={form.meta_title}
            hint={form.auto_seo ? "Se actualiza solo desde el título." : undefined}
          >
            <input
              id="meta_title"
              className={inputClass}
              maxLength={200}
              value={form.meta_title}
              readOnly={form.auto_seo}
              onChange={(e) =>
                setForm({
                  ...form,
                  meta_title: e.target.value,
                  auto_seo: false,
                })
              }
            />
          </AdminFormField>
          <AdminFormField
            id="meta_description"
            label="Meta description"
            maxLength={320}
            value={form.meta_description}
            hint={
              form.auto_seo
                ? "Se actualiza solo desde el extracto (o el título si no hay extracto)."
                : undefined
            }
          >
            <textarea
              id="meta_description"
              rows={2}
              maxLength={320}
              className={inputClass}
              value={form.meta_description}
              readOnly={form.auto_seo}
              onChange={(e) =>
                setForm({
                  ...form,
                  meta_description: e.target.value,
                  auto_seo: false,
                })
              }
            />
          </AdminFormField>
          <AdminFormField
            id="meta_keywords"
            label="Keywords"
            maxLength={320}
            value={form.meta_keywords}
            hint={
              form.auto_seo
                ? "Incluye marca + etiquetas seleccionadas."
                : undefined
            }
          >
            <input
              id="meta_keywords"
              className={inputClass}
              maxLength={320}
              value={form.meta_keywords}
              readOnly={form.auto_seo}
              onChange={(e) =>
                setForm({
                  ...form,
                  meta_keywords: e.target.value,
                  auto_seo: false,
                })
              }
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Secciones del artículo">
          <div id="blog-sections" className="rounded-sm transition-shadow">
          <p className="text-sm text-cu-concrete -mt-2 mb-4">
            Arma el artículo por bloques. Cada tipo tiene un propósito distinto
            (texto, media, cita o botón). Completa lo obligatorio de cada bloque
            para poder previsualizar y guardar.
          </p>
          <div className="space-y-4">
            {form.sections.map((section, index) => {
              const sectionIssues = issuesForSection(validation.issues, index);
              const incomplete = sectionIssues.length > 0;
              return (
              <div
                key={index}
                id={`blog-section-${index}`}
                className={`rounded-sm p-4 space-y-3 transition-shadow ${
                  incomplete
                    ? "border border-amber-400/80 bg-amber-50/40"
                    : "border border-cu-stone/25 bg-cu-warm-white/40"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-cu-stone" />
                    <select
                      className={inputClass}
                      value={section.section_type}
                      onChange={(e) =>
                        updateSection(index, {
                          section_type: e.target.value as BlogSectionType,
                        })
                      }
                    >
                      {BLOG_SECTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-cu-concrete hover:text-cu-black"
                      onClick={() => moveSection(index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-xs text-cu-concrete hover:text-cu-black"
                      onClick={() => moveSection(index, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600 font-semibold inline-flex items-center gap-1"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          sections: prev.sections.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={12} /> Quitar
                    </button>
                  </div>
                </div>

                <p className="text-xs text-cu-concrete font-josefin leading-relaxed -mt-1">
                  {blogSectionHint(section.section_type)}
                </p>

                {incomplete && (
                  <ul className="text-[11px] text-amber-900 space-y-0.5">
                    {sectionIssues.map((issue) => (
                      <li key={`${issue.field}-${issue.message}`}>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                )}

                {(section.section_type === "heading" ||
                  section.section_type === "cta" ||
                  section.section_type === "quote") && (
                  <input
                    className={inputClass}
                    placeholder={
                      section.section_type === "cta"
                        ? "Texto del botón (ej. Agenda una visita)"
                        : section.section_type === "quote"
                          ? "Autor o atribución (opcional)"
                          : "Título del encabezado"
                    }
                    value={section.title ?? ""}
                    onChange={(e) =>
                      updateSection(index, { title: e.target.value })
                    }
                  />
                )}

                {section.section_type === "text" && (
                  <BlogRichTextEditor
                    value={section.body ?? ""}
                    onChange={(html) => updateSection(index, { body: html })}
                    placeholder="Escribe el texto… Selecciona palabras para negrita, cursiva, enlaces…"
                  />
                )}

                {(section.section_type === "quote" ||
                  section.section_type === "heading" ||
                  section.section_type === "cta") && (
                  <textarea
                    className={inputClass}
                    rows={section.section_type === "heading" ? 2 : 3}
                    placeholder={
                      section.section_type === "cta"
                        ? "Mensaje corto encima del botón (opcional)"
                        : section.section_type === "quote"
                          ? "Texto de la cita"
                          : "Texto de apoyo debajo del encabezado (opcional)"
                    }
                    value={section.body ?? ""}
                    onChange={(e) =>
                      updateSection(index, { body: e.target.value })
                    }
                  />
                )}

                {section.section_type === "image" && (
                  <>
                    <AdminImageField
                      id={`sec-img-${index}`}
                      label="Imagen"
                      hint="Imagen a lo ancho del artículo. Obligatoria en este bloque."
                      folder="blog"
                      uploadOnSelect={false}
                      value={section.image_url ?? ""}
                      onChange={(url) =>
                        updateSection(index, { image_url: url })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Pie de foto (opcional)"
                      value={section.title ?? ""}
                      onChange={(e) =>
                        updateSection(index, { title: e.target.value })
                      }
                    />
                  </>
                )}

                {section.section_type === "cta" && (
                  <AdminImageField
                    id={`sec-cta-img-${index}`}
                    label="Imagen opcional"
                    hint="No es obligatoria. Si la agregas, aparece encima del botón para reforzar el llamado (proyecto, equipo, etc.)."
                    folder="blog"
                    uploadOnSelect={false}
                    value={section.image_url ?? ""}
                    onChange={(url) => updateSection(index, { image_url: url })}
                  />
                )}

                {section.section_type === "gallery" && (
                  <AdminGalleryField
                    id={`sec-gallery-${index}`}
                    images={
                      Array.isArray(
                        (section.meta_json as { images?: string[] })?.images,
                      )
                        ? ((section.meta_json as { images: string[] }).images ??
                          [])
                        : []
                    }
                    onChange={(images) =>
                      updateSection(index, {
                        meta_json: { images },
                      })
                    }
                    folder="blog"
                  />
                )}

                {section.section_type === "youtube" && (
                  <input
                    className={inputClass}
                    placeholder="URL o ID de YouTube"
                    value={String(
                      (section.meta_json as { youtube?: string })?.youtube ??
                        "",
                    )}
                    onChange={(e) =>
                      updateSection(index, {
                        meta_json: { youtube: e.target.value },
                      })
                    }
                  />
                )}

                {section.section_type === "embed" && (
                  <div className="space-y-2 min-w-0">
                    {(() => {
                      const meta = (section.meta_json ?? {}) as {
                        url?: string;
                        html?: string;
                        provider?: string;
                      };
                      const htmlVal = String(meta.html ?? "").trim();
                      const urlVal = String(
                        meta.url ??
                          (!htmlVal.startsWith("<") ? htmlVal : "") ??
                          section.body ??
                          "",
                      );
                      const built = resolveBlogEmbed({
                        url: meta.url,
                        html: meta.html,
                        body: section.body,
                      });
                      const unrecognized =
                        Boolean(urlVal.trim()) &&
                        !urlVal.trim().startsWith("<") &&
                        !built?.iframeSrc;

                      return (
                        <>
                          <input
                            className={inputClass}
                            placeholder="Pega la URL del post (Instagram, X, TikTok, Facebook, LinkedIn, YouTube…)"
                            value={urlVal}
                            onChange={(e) => {
                              const value = e.target.value;
                              const builtEmbed = value.trim().startsWith("<")
                                ? null
                                : buildSocialEmbedFromUrl(value);
                              updateSection(index, {
                                body: value,
                                meta_json: builtEmbed
                                  ? {
                                      url: value.trim(),
                                      html: builtEmbed.html,
                                      provider: builtEmbed.provider,
                                    }
                                  : value.trim().startsWith("<")
                                    ? { html: value }
                                    : {
                                        url: value.trim(),
                                        html: value,
                                      },
                              });
                            }}
                          />
                          <p className="text-[11px] text-cu-concrete font-josefin leading-relaxed">
                            Solo el enlace del post; el embed se genera
                            automáticamente. También puedes pegar HTML de embed
                            si lo necesitas.
                          </p>
                          {built?.iframeSrc && (
                            <p className="text-[11px] text-cu-concrete">
                              Detectado:{" "}
                              <span className="font-montserrat font-semibold text-cu-black">
                                {built.label}
                              </span>
                            </p>
                          )}
                          {unrecognized && (
                            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded-sm">
                              URL no reconocida. Usa un enlace de Instagram, X,
                              TikTok, Facebook, LinkedIn, YouTube o Vimeo, o
                              pega el HTML del embed.
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {section.section_type === "cta" && (
                  <AdminCtaHrefField
                    value={String(
                      (section.meta_json as { href?: string })?.href ?? "",
                    )}
                    projects={projects}
                    onChange={(href) =>
                      updateSection(index, {
                        meta_json: {
                          ...(typeof section.meta_json === "object" &&
                          section.meta_json
                            ? section.meta_json
                            : {}),
                          href,
                        },
                      })
                    }
                  />
                )}
              </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                sections: [...prev.sections, emptySection("text")],
              }))
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-cu-orange"
          >
            <Plus size={16} /> Agregar sección
          </button>
          </div>
        </AdminFormSection>
      </div>

      <div className="sticky bottom-0 z-10 -mx-1 px-1 py-3 bg-gradient-to-t from-cu-warm-white via-cu-warm-white to-transparent">
        <div className="rounded-sm border border-cu-stone/25 bg-white shadow-sm p-4 space-y-3">
          {!validation.ok ? (
            <div className="space-y-2">
              <p className="text-sm font-montserrat font-semibold text-cu-black">
                Falta completar ({missingTargets.length})
              </p>
              <p className="text-xs text-cu-concrete font-josefin">
                Pulsa un botón para ir al campo o sección pendiente.
              </p>
              <div className="flex flex-wrap gap-2">
                {missingTargets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => goToMissing(target.id)}
                    title={target.message}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-montserrat font-semibold rounded-sm border border-amber-400/70 bg-amber-50 text-amber-950 hover:bg-amber-100"
                  >
                    {target.label}
                    {target.count > 1 ? ` · ${target.count}` : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-cu-concrete font-josefin">
              Todo listo. Abre la vista previa y guarda desde ahí.
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center justify-end">
            <button
              type="button"
              onClick={openPreview}
              disabled={!canPreviewOrSave}
              title={
                !validation.ok
                  ? validationHint
                  : "Revisa el artículo y luego guárdalo desde la vista previa"
              }
              className="inline-flex items-center gap-2 px-5 py-2 bg-cu-black text-white text-sm font-semibold rounded-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              <Eye size={16} /> Vista previa y guardar
            </button>
          </div>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[calc(100vw-1.5rem)] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-cu-stone/15 pr-12">
            <DialogTitle className="font-montserrat">
              Vista previa del artículo
            </DialogTitle>
            <DialogDescription className="text-sm text-cu-concrete">
              Revisa cómo se verá en el sitio. Si todo está bien, guarda desde
              aquí.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[75dvh] overflow-y-auto bg-cu-warm-white/40">
            <BlogPostPreview
              title={form.title}
              excerpt={form.excerpt}
              slug={form.slug}
              heroImageUrl={form.hero_image_url}
              author={selectedAuthor}
              category={selectedCategory}
              tags={selectedTags}
              sections={form.sections}
              publishedAt={
                form.status === "published"
                  ? form.published_at || new Date().toISOString()
                  : form.scheduled_at || form.published_at
              }
            />
          </div>
          <div className="flex flex-col gap-2 px-5 py-3 border-t border-cu-stone/15 bg-white">
            {msg?.type === "err" && previewOpen && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
                {msg.text}
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold rounded-sm border border-cu-stone/30 disabled:opacity-50"
              >
                Seguir editando
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold rounded-sm bg-cu-orange text-white disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Guardar artículo"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
