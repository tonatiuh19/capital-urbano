import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderOpen, Plus, Search, Tags, UserRound } from "lucide-react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { AdminPreviewCard } from "@/components/admin/AdminPreviewCard";
import { inputClass } from "@/components/admin/AdminFormField";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BLOG_STATUS_LABELS } from "@/lib/blog";
import type { BlogAuthor, BlogCategory, BlogPost } from "@shared/api";

type PendingAction =
  | { type: "hide"; post: BlogPost }
  | { type: "delete"; post: BlogPost }
  | null;

export default function AdminBlogPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);

  const loadMeta = useCallback(() => {
    Promise.all([
      adminAxios.get("/api/admin/blog-authors.php"),
      adminAxios.get("/api/admin/blog-categories.php"),
    ]).then(([a, c]) => {
      setAuthors(a.data.authors ?? []);
      setCategories(c.data.categories ?? []);
    });
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setMsg(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (categoryId) params.set("category_id", categoryId);
    if (authorId) params.set("author_id", authorId);
    adminAxios
      .get(`/api/admin/blog-posts.php?${params.toString()}`)
      .then((res) => setPosts(res.data.posts ?? []))
      .catch((err) =>
        setMsg({ type: "err", text: getAdminApiError(err, "Error al cargar") }),
      )
      .finally(() => setLoading(false));
  }, [q, status, categoryId, authorId]);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmPending = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending.type === "hide") {
        await adminAxios.delete(
          `/api/admin/blog-posts.php?id=${pending.post.id}`,
        );
        setMsg({
          type: "ok",
          text: "Artículo ocultado (archivado). Ya no aparece en el blog público.",
        });
      } else {
        await adminAxios.delete(
          `/api/admin/blog-posts.php?id=${pending.post.id}&hard=1`,
        );
        setMsg({ type: "ok", text: "Artículo eliminado permanentemente." });
      }
      setPending(null);
      load();
    } catch (err) {
      setMsg({ type: "err", text: getAdminApiError(err) });
    } finally {
      setBusy(false);
    }
  };

  const filtersActive = useMemo(
    () => Boolean(q || status || categoryId || authorId),
    [q, status, categoryId, authorId],
  );

  const dialogCopy =
    pending?.type === "hide"
      ? {
          title: "¿Ocultar este artículo?",
          description: `“${pending.post.title}” pasará a Archivado y dejará de mostrarse en el blog público. Puedes volver a publicarlo después desde el editor.`,
          action: "Ocultar del blog",
          destructive: false,
        }
      : pending?.type === "delete"
        ? {
            title: "¿Eliminar permanentemente?",
            description: `“${pending.post.title}” se borrará del todo (contenido, secciones e imagen asociada en la base). Esta acción no se puede deshacer.`,
            action: "Eliminar definitivamente",
            destructive: true,
          }
        : null;

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-cu-black">
            Blog
          </h1>
          <p className="text-sm text-cu-concrete mt-1">
            Artículos, programación y contenido por secciones.{" "}
            <Link
              to="/admin/blog/autores"
              className="text-cu-orange font-semibold hover:underline"
            >
              Autores
            </Link>
            {" · "}
            <Link
              to="/admin/blog/categorias"
              className="text-cu-orange font-semibold hover:underline"
            >
              Categorías
            </Link>
            {" · "}
            <Link
              to="/admin/blog/etiquetas"
              className="text-cu-orange font-semibold hover:underline"
            >
              Etiquetas
            </Link>
          </p>
          <p className="text-xs text-cu-concrete mt-2 max-w-2xl">
            <span className="font-semibold text-cu-black">Ocultar</span> = estado
            Archivado (sale del sitio, se puede republicar).{" "}
            <span className="font-semibold text-cu-black">Eliminar</span> = borrado
            permanente.
          </p>
        </div>
        <Link
          to="/admin/blog/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm"
        >
          <Plus size={16} /> Nuevo artículo
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          to="/admin/blog/autores"
          className="flex items-start gap-3 p-4 bg-white border border-cu-stone/25 rounded-sm hover:border-cu-orange/50 transition-colors"
        >
          <UserRound className="text-cu-orange shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-montserrat font-semibold text-sm text-cu-black">
              Autores
            </p>
            <p className="text-xs text-cu-concrete mt-0.5">
              Crear, editar y eliminar firmas
            </p>
          </div>
        </Link>
        <Link
          to="/admin/blog/categorias"
          className="flex items-start gap-3 p-4 bg-white border border-cu-stone/25 rounded-sm hover:border-cu-orange/50 transition-colors"
        >
          <FolderOpen className="text-cu-orange shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-montserrat font-semibold text-sm text-cu-black">
              Categorías
            </p>
            <p className="text-xs text-cu-concrete mt-0.5">
              Organizar artículos por tema
            </p>
          </div>
        </Link>
        <Link
          to="/admin/blog/etiquetas"
          className="flex items-start gap-3 p-4 bg-white border border-cu-stone/25 rounded-sm hover:border-cu-orange/50 transition-colors"
        >
          <Tags className="text-cu-orange shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-montserrat font-semibold text-sm text-cu-black">
              Etiquetas
            </p>
            <p className="text-xs text-cu-concrete mt-0.5">
              Tags para filtrar y SEO
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-white border border-cu-stone/30 rounded-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cu-stone"
          />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Buscar título, excerpt, slug, keywords…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {Object.entries(BLOG_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
              {k === "archived" ? " (oculto en el sitio)" : ""}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="">Todos los autores</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {filtersActive && (
          <button
            type="button"
            className="text-sm text-cu-orange font-semibold"
            onClick={() => {
              setQ("");
              setStatus("");
              setCategoryId("");
              setAuthorId("");
            }}
          >
            Limpiar filtros
          </button>
        )}
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

      {loading ? (
        <p className="text-cu-concrete text-sm">Cargando…</p>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-cu-stone/30 rounded-sm p-10 text-center bg-cu-warm-white/50">
          <p className="text-cu-concrete text-sm mb-4">
            {filtersActive
              ? "Sin resultados con esos filtros."
              : "Aún no hay artículos."}
          </p>
          {!filtersActive && (
            <Link
              to="/admin/blog/nuevo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm"
            >
              <Plus size={16} /> Crear primer artículo
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((p) => {
            const canHide = p.status === "published" || p.status === "scheduled";
            const badges: { label: string; className?: string }[] = [
              {
                label: BLOG_STATUS_LABELS[p.status] ?? p.status,
                className:
                  p.status === "published"
                    ? "bg-green-700 text-white"
                    : p.status === "scheduled"
                      ? "bg-amber-600 text-white"
                      : p.status === "archived"
                        ? "bg-cu-stone text-white"
                        : "bg-cu-black/70 text-white",
              },
            ];
            if (p.is_featured) {
              badges.push({
                label: "Destacado",
                className: "bg-cu-orange text-white",
              });
            }
            return (
              <AdminPreviewCard
                key={p.id}
                title={p.title}
                subtitle={p.category?.name ?? p.slug}
                description={p.excerpt ?? undefined}
                imageUrl={p.hero_image_url ?? undefined}
                badges={badges}
                inactive={p.status === "archived"}
                meta={[
                  p.author?.name ? `Autor: ${p.author.name}` : "Sin autor",
                  p.scheduled_at
                    ? `Prog: ${p.scheduled_at}`
                    : p.published_at
                      ? `Pub: ${p.published_at}`
                      : "Sin fecha",
                ]}
                onEdit={() => navigate(`/admin/blog/${p.id}`)}
                onHide={
                  canHide ? () => setPending({ type: "hide", post: p }) : undefined
                }
                onDelete={() => setPending({ type: "delete", post: p })}
              />
            );
          })}
        </div>
      )}

      <AlertDialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open && !busy) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogCopy?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogCopy?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                void confirmPending();
              }}
              className={
                dialogCopy?.destructive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : undefined
              }
            >
              {busy ? "Procesando…" : dialogCopy?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
