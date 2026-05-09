import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

const categories = [
  { value: "article", label: "Articulo" },
  { value: "book",    label: "Libro" },
  { value: "doc",     label: "Documental" },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token || SUPABASE_KEY;
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const uploadImage = async (file) => {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token || SUPABASE_KEY;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${fileName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!res.ok) throw new Error("Error subiendo imagen");
  return `${SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
};

// Componente reutilizable para subir imagen
function ImageUploader({ label, hint, preview, onFile, aspectRatio }) {
  const ref = useRef();
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs tracking-[0.2em] uppercase text-black/35"
         style={{ fontFamily: "'Gowun Batang', serif" }}>{label}</p>
      <div
        onClick={() => ref.current.click()}
        className="relative w-full overflow-hidden rounded-2xl cursor-pointer border border-black/10 hover:border-black/25 transition-all duration-300"
        style={{ background: "rgba(255,255,255,0.3)", aspectRatio }}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
            <span className="text-2xl text-black/20">+</span>
            <p className="text-xs text-black/25 tracking-widest uppercase text-center"
               style={{ fontFamily: "'Gowun Batang', serif" }}>{hint}</p>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white/80 text-xs tracking-widest uppercase"
               style={{ fontFamily: "'Gowun Batang', serif" }}>Cambiar</p>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp"
        onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f); }}
        className="hidden" />
      <p className="text-[10px] text-black/25 text-center"
         style={{ fontFamily: "'Gowun Batang', serif" }}>JPG, PNG o WEBP</p>
    </div>
  );
}

// Formulario
function PostForm({ initial, onSuccess }) {
  const [title, setTitle]               = useState(initial?.title || "");
  const [desc, setDesc]                 = useState(initial?.desc || "");
  const [content, setContent]           = useState(initial?.content || "");
  const [category, setCategory]         = useState(initial?.category || "article");
  const [image, setImage]               = useState(null);
  const [preview, setPreview]           = useState(initial?.image_url || null);
  const [imageReading, setImageReading] = useState(null);
  const [previewReading, setPreviewReading] = useState(initial?.image_reading_url || null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);

  const isEditing = !!initial;

  const handleSubmit = async () => {
    if (!title || !desc || !content || (!image && !isEditing)) {
      setError("Completa todos los campos y sube la imagen de portada.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const h = await getHeaders();
      let image_url = initial?.image_url;
      let image_reading_url = initial?.image_reading_url || null;

      if (image) image_url = await uploadImage(image);
      if (imageReading) image_reading_url = await uploadImage(imageReading);

      const body = JSON.stringify({
        title, desc, content, category,
        image_url, image_reading_url,
        published: true,
      });

      if (isEditing) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${initial.id}`,
          { method: "PATCH", headers: { ...h, Prefer: "return=minimal" }, body });
        if (!res.ok) throw new Error("Error al actualizar");
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`,
          { method: "POST", headers: { ...h, Prefer: "return=minimal" }, body });
        if (!res.ok) throw new Error("Error al publicar");
        setTitle(""); setDesc(""); setContent("");
        setCategory("article");
        setImage(null); setPreview(null);
        setImageReading(null); setPreviewReading(null);
      }

      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSuccess?.(); }, 1500);
    } catch (err) {
      setError(err.message || "Error inesperado.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

      {/* Columna izquierda - texto */}
      <div className="flex flex-col gap-6 flex-1">

        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className="px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: "'Gowun Batang', serif",
                background: category === cat.value ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.04)",
                color: category === cat.value ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.35)",
                border: category === cat.value ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        <input type="text" placeholder="Titulo" value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-black/10 text-sm outline-none text-black/70 focus:border-black/25 focus:bg-white/60"
          style={{ fontFamily: "'Gowun Batang', serif" }} />

        <input type="text" placeholder="Descripcion corta (aparece en la card)"
          value={desc} onChange={(e) => setDesc(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-black/10 text-sm outline-none text-black/70 focus:border-black/25 focus:bg-white/60"
          style={{ fontFamily: "'Gowun Batang', serif" }} />

        <textarea placeholder="Escribe tu contenido aqui..." value={content}
          onChange={(e) => setContent(e.target.value)} rows={12}
          className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-black/10 text-sm outline-none text-black/70 focus:border-black/25 focus:bg-white/60 resize-none leading-relaxed"
          style={{ fontFamily: "'Gowun Batang', serif" }} />

        {error   && <p className="text-red-400 text-xs tracking-wide">{error}</p>}
        {success && <p className="text-green-600 text-xs tracking-widest uppercase">
          {isEditing ? "Actualizado" : "Publicado"} correctamente
        </p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-3 rounded-xl bg-black/10 hover:bg-black/15 text-sm tracking-widest uppercase text-black/55 transition-all duration-300 disabled:opacity-40"
          style={{ fontFamily: "'Gowun Batang', serif" }}>
          {loading
            ? (isEditing ? "Guardando..." : "Publicando...")
            : (isEditing ? "Guardar cambios" : "Publicar")}
        </button>
      </div>

      {/* Columna derecha - imagenes */}
      <div className="flex flex-col gap-8 lg:w-80">

        {/* Imagen portada - vertical para card */}
        <ImageUploader
          label="Portada (card)"
          hint="Imagen vertical para el carrusel"
          preview={preview}
          aspectRatio="3/4"
          onFile={(f) => { setImage(f); setPreview(URL.createObjectURL(f)); }}
        />

        {/* Separador */}
        <div style={{ height: "1px", background: "rgba(0,0,0,0.08)" }} />

        {/* Imagen lectura - horizontal para articulo */}
        <ImageUploader
          label="Imagen de lectura (opcional)"
          hint="Imagen horizontal para la pagina de articulo"
          preview={previewReading}
          aspectRatio="16/9"
          onFile={(f) => { setImageReading(f); setPreviewReading(URL.createObjectURL(f)); }}
        />
      </div>
    </div>
  );
}

// Lista de posts
function PostList({ onEdit }) {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [notifying, setNotifying] = useState(null);
  const [notifyMsg, setNotifyMsg] = useState({});

  const loadPosts = async () => {
    setLoading(true);
    const h = await getHeaders();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`, { headers: h });
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const handleNotify = async (post) => {
    setNotifying(post.id);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || SUPABASE_KEY;
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/notify-subscribers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: post.title,
            desc: post.desc,
            category: post.category,
            post_id: post.id,
          }),
        }
      );
      const result = await res.json();
      setNotifyMsg({ [post.id]: result.message || "Enviado" });
      setTimeout(() => setNotifyMsg({}), 3000);
    } catch {
      setNotifyMsg({ [post.id]: "Error al notificar" });
      setTimeout(() => setNotifyMsg({}), 3000);
    }
    setNotifying(null);
  };

  const handleDelete = async (post) => {
    setDeleting(post.id);

    try {
      const fileName = post.image_url?.split("/images/")[1];
      if (fileName) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token || SUPABASE_KEY;
        await fetch(`${SUPABASE_URL}/storage/v1/object/images/${fileName}`, {
          method: "DELETE",
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn("No se pudo borrar imagen:", err);
    }

    try {
      const h = await getHeaders();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`, {
        method: "DELETE",
        headers: h,
      });
      if (res.ok || res.status === 204) {
        setPosts(p => p.filter(x => x.id !== post.id));
      }
    } catch (err) {
      console.error("Error borrando post:", err);
    }

    setDeleting(null);
    setConfirm(null);
  };

  const categoryLabel = (c) =>
    c === "article" ? "Articulo" : c === "book" ? "Libro" : "Documental";

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-xs tracking-widest uppercase text-black/30"
         style={{ fontFamily: "'Gowun Batang', serif" }}>Cargando...</p>
    </div>
  );

  if (posts.length === 0) return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div style={{ width: "30px", height: "1px", background: "rgba(0,0,0,0.12)" }} />
      <p className="text-xs tracking-widest uppercase text-black/25"
         style={{ fontFamily: "'Gowun Batang', serif" }}>Sin publicaciones aun</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div key={post.id}
          className="flex items-center gap-4 p-4 rounded-2xl border border-black/8 bg-white/25 backdrop-blur-sm hover:bg-white/40 transition-all duration-300">

          <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-black/75 truncate"
               style={{ fontFamily: "'Gowun Batang', serif" }}>{post.title}</p>
            <p className="text-[10px] tracking-widest uppercase text-black/30 mt-1"
               style={{ fontFamily: "'Gowun Batang', serif" }}>
              {categoryLabel(post.category)} · {new Date(post.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
              {post.image_reading_url && " · Con imagen de lectura"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Botón notificar */}
            <button onClick={() => handleNotify(post)} disabled={notifying === post.id}
              className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-black/35 border border-black/8 hover:bg-white/60 hover:text-black/55 transition-all duration-300 disabled:opacity-40"
              style={{ fontFamily: "'Gowun Batang', serif" }}
              title="Notificar a suscriptores">
              {notifying === post.id ? "..." : notifyMsg[post.id] ? notifyMsg[post.id] : "Notificar"}
            </button>

            <button onClick={() => onEdit(post)}
              className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-black/45 border border-black/10 hover:bg-white/60 hover:text-black/70 transition-all duration-300"
              style={{ fontFamily: "'Gowun Batang', serif" }}>
              Editar
            </button>

            {confirm === post.id ? (
              <div className="flex items-center gap-1">
                <button onClick={() => handleDelete(post)} disabled={deleting === post.id}
                  className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-red-400 border border-red-300/40 hover:bg-red-50/40 transition-all duration-300 disabled:opacity-40"
                  style={{ fontFamily: "'Gowun Batang', serif" }}>
                  {deleting === post.id ? "..." : "Si, eliminar"}
                </button>
                <button onClick={() => setConfirm(null)}
                  className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-black/30 border border-black/8 hover:bg-white/60 transition-all duration-300"
                  style={{ fontFamily: "'Gowun Batang', serif" }}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirm(post.id)}
                className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-black/30 border border-black/8 hover:border-red-300/50 hover:text-red-400 transition-all duration-300"
                style={{ fontFamily: "'Gowun Batang', serif" }}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Panel principal
export default function AdminPanel({ onLogout }) {
  const [tab, setTab]         = useState("new");
  const [editing, setEditing] = useState(null);

  const handleEdit = (post) => {
    setEditing(post);
    setTab("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    if (editing) setEditing(null);
  };

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-32 py-16">

      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-1"
             style={{ fontFamily: "'Gowun Batang', serif" }}>Panel privado</p>
          <h1 className="text-2xl text-black/75 font-normal"
              style={{ fontFamily: "'Gowun Batang', serif" }}>ian?</h1>
        </div>
        <button onClick={onLogout}
          className="text-xs tracking-widest uppercase text-black/30 hover:text-black/60 transition-colors duration-300"
          style={{ fontFamily: "'Gowun Batang', serif" }}>
          Salir
        </button>
      </div>

      <div className="flex gap-2 mb-12">
        {[
          { key: "new",  label: editing ? "Editando post" : "Nueva publicacion" },
          { key: "list", label: "Mis publicaciones" },
        ].map((t) => (
          <button key={t.key}
            onClick={() => { setTab(t.key); if (t.key === "list") setEditing(null); }}
            className="px-5 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              fontFamily: "'Gowun Batang', serif",
              background: tab === t.key ? "rgba(0,0,0,0.10)" : "transparent",
              color: tab === t.key ? "rgba(0,0,0,0.70)" : "rgba(0,0,0,0.30)",
              border: tab === t.key ? "1px solid rgba(0,0,0,0.12)" : "1px solid transparent",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "new"
        ? <PostForm key={editing?.id || "new"} initial={editing} onSuccess={handleSuccess} />
        : <PostList onEdit={handleEdit} />
      }
    </div>
  );
}