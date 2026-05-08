import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef(null);

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${url}/rest/v1/posts?id=eq.${id}&select=*`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      const data = await res.json();
      if (data && data[0]) {
        setPost(data[0]);
        setTimeout(() => setVisible(true), 80);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#share-menu")) setShowActions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleShare = async () => {
    setShowActions(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `${post.title}\n\n${post.desc}\n\n— ian?`,
          url: window.location.href,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareMsg("¡Link copiado!");
      } catch {
        setShareMsg("Copia el link manualmente");
      }
      setTimeout(() => setShareMsg(""), 2500);
    }
  };

  const handleDownloadImage = async () => {
    setShowActions(false);
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#D9D2C8",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${post.title.slice(0, 30)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setShareMsg("¡Imagen descargada!");
      setTimeout(() => setShareMsg(""), 2500);
    } catch {
      setShareMsg("Error al generar imagen");
      setTimeout(() => setShareMsg(""), 2500);
    }
    setGenerating(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#D9D2C8" }}>
      <p style={{ fontFamily: "'Gowun Batang', serif", letterSpacing: "0.25em" }}
         className="text-xs uppercase text-black/30">Cargando...</p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#D9D2C8" }}>
      <p style={{ fontFamily: "'Gowun Batang', serif" }} className="text-black/40">
        Artículo no encontrado.
      </p>
    </div>
  );

  const date = new Date(post.created_at).toLocaleDateString("es-PE", {
    year: "numeric", month: "long", day: "numeric"
  });
  const words = post.content?.split(" ").length || 0;
  const readTime = Math.max(1, Math.ceil(words / 200));
  const paragraphs = post.content?.split("\n").filter(p => p.trim()) || [];
  const categoryLabel = post.category === "article" ? "Artículo" : post.category === "book" ? "Libro" : "Documental";

  return (
    <div style={{ background: "#D9D2C8", minHeight: "100vh" }}>

      {/* Barra de progreso */}
      <div className="fixed top-0 left-0 z-50 h-[2px]"
           style={{ width: `${scrollProgress}%`, background: "rgba(0,0,0,0.35)", transition: "width 0.1s ease" }} />

      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-40 flex items-center gap-2 text-xs tracking-widest uppercase text-black/35 hover:text-black/65 transition-colors duration-300"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        <span>←</span><span>Volver</span>
      </button>

      {/* IMAGEN HERO */}
      <div className="relative w-full overflow-hidden"
           style={{ height: "70vh", opacity: visible ? 1 : 0, transition: "opacity 1s ease" }}>
        <img
          src={post.image_reading_url || post.image_url} alt={post.title}
          className="w-full h-full object-cover"
          style={{ transform: visible ? "scale(1)" : "scale(1.04)", transition: "transform 1.4s ease" }}
        />
        <div className="absolute inset-0"
             style={{ background: "linear-gradient(to bottom, rgba(217,210,200,0) 30%, rgba(217,210,200,0.6) 70%, rgba(217,210,200,1) 100%)" }} />
        <div className="absolute top-8 right-8">
          <span className="text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full"
                style={{ fontFamily: "'Gowun Batang', serif", background: "rgba(217,210,200,0.7)", backdropFilter: "blur(8px)", color: "rgba(0,0,0,0.45)", border: "1px solid rgba(0,0,0,0.08)" }}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 px-6 md:px-0"
           style={{ maxWidth: "680px", margin: "-64px auto 0", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s" }}>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] tracking-[0.22em] uppercase text-black/35" style={{ fontFamily: "'Gowun Batang', serif" }}>{date}</span>
          <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(0,0,0,0.25)" }} />
          <span className="text-[10px] tracking-[0.22em] uppercase text-black/35" style={{ fontFamily: "'Gowun Batang', serif" }}>{readTime} min de lectura</span>
        </div>

        {/* Título + botón compartir */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.25] text-black/85"
              style={{ fontFamily: "'Gowun Batang', serif" }}>
            {post.title}
          </h1>

          <div id="share-menu" className="relative flex-shrink-0 mt-2">
            <button
              onClick={() => setShowActions(v => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-black/12
                         bg-white/30 backdrop-blur-sm text-black/40
                         hover:bg-white/60 hover:text-black/65 hover:border-black/25
                         transition-all duration-300 hover:scale-110 active:scale-95"
              title="Compartir"
            >
              <MessageIcon />
            </button>

            {showActions && (
              <div className="absolute right-0 top-11 z-50 flex flex-col gap-1 p-2 rounded-2xl"
                   style={{ background: "rgba(217,210,200,0.92)", backdropFilter: "blur(16px)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", minWidth: "180px" }}>

                <button onClick={handleShare}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-black/60 hover:bg-white/50 hover:text-black/80 transition-all duration-200">
                  <ShareIcon />
                  <span className="text-xs tracking-wide" style={{ fontFamily: "'Gowun Batang', serif" }}>Compartir link</span>
                </button>

                <button onClick={handleDownloadImage} disabled={generating}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-black/60 hover:bg-white/50 hover:text-black/80 transition-all duration-200 disabled:opacity-40">
                  <DownloadIcon />
                  <span className="text-xs tracking-wide" style={{ fontFamily: "'Gowun Batang', serif" }}>
                    {generating ? "Generando..." : "Descargar para Stories"}
                  </span>
                </button>
              </div>
            )}

            {shareMsg && (
              <div className="absolute right-0 top-11 px-3 py-1.5 rounded-lg text-[10px] tracking-wide whitespace-nowrap z-50"
                   style={{ fontFamily: "'Gowun Batang', serif", background: "rgba(0,0,0,0.75)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
                {shareMsg}
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-lg md:text-xl text-black/50 leading-relaxed mb-10 italic"
           style={{ fontFamily: "'Gowun Batang', serif" }}>
          {post.desc}
        </p>

        {/* Separador */}
        <div className="flex items-center gap-4 mb-12">
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.12)" }} />
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(0,0,0,0.2)" }} />
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.12)" }} />
        </div>

        {/* CUERPO */}
        <div className="pb-24">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base md:text-lg leading-[1.9] text-black/70 mb-7"
               style={{ fontFamily: "'Gowun Batang', serif" }}>
              {i === 0 ? (
                <>
                  <span style={{ float: "left", fontSize: "4.2em", lineHeight: "0.75", marginRight: "6px", marginTop: "6px", fontFamily: "'Gowun Batang', serif", color: "rgba(0,0,0,0.6)" }}>
                    {para[0]}
                  </span>
                  {para.slice(1)}
                </>
              ) : para}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-black/10 pt-10 pb-24 flex flex-col items-center gap-4">
          <div style={{ width: "30px", height: "1px", background: "rgba(0,0,0,0.15)" }} />
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/25"
             style={{ fontFamily: "'Gowun Batang', serif" }}>
            ian? · {new Date().getFullYear()}
          </p>
          <button onClick={() => navigate(-1)}
                  className="mt-4 text-xs tracking-widest uppercase text-black/35 hover:text-black/60 transition-colors duration-300"
                  style={{ fontFamily: "'Gowun Batang', serif" }}>
            ← Regresar
          </button>
        </div>
      </div>

      {/* TARJETA INVISIBLE para generar imagen Stories */}
      <div style={{ position: "fixed", top: "-9999px", left: "-9999px", width: "1080px", height: "1920px" }}>
        <div ref={cardRef}
             style={{ width: "1080px", height: "1920px", background: "#D9D2C8", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <img src={post.image_url} alt=""
               style={{ position: "absolute", inset: 0, width: "100%", height: "65%", objectFit: "cover" }}
               crossOrigin="anonymous" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(217,210,200,0) 35%, rgba(217,210,200,1) 65%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "80px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <span style={{ fontFamily: "'Gowun Batang', serif", fontSize: "28px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)" }}>
              {categoryLabel}
            </span>
            <h2 style={{ fontFamily: "'Gowun Batang', serif", fontSize: "72px", lineHeight: 1.2, color: "rgba(0,0,0,0.85)", fontWeight: "normal", margin: 0 }}>
              {post.title}
            </h2>
            <p style={{ fontFamily: "'Gowun Batang', serif", fontSize: "36px", color: "rgba(0,0,0,0.45)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
              {post.desc}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "20px" }}>
              <div style={{ width: "60px", height: "1px", background: "rgba(0,0,0,0.2)" }} />
              <span style={{ fontFamily: "'Gowun Batang', serif", fontSize: "26px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)" }}>
                ian?
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}