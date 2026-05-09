import { useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Newsletter() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // 1. Guardar email en Supabase
      const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 409 || res.status === 422) {
        setStatus("duplicate");
        return;
      }

      if (!res.ok && res.status !== 201) {
        setStatus("error");
        return;
      }

      // 2. Enviar email de bienvenida
      await fetch(`${SUPABASE_URL}/functions/v1/welcome-subscriber`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setStatus("success");
      setEmail("");

    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative mt-10 w-full max-w-sm">
      {status === "success" ? (
        <div className="flex flex-col items-start gap-3">
          <div
            className="flex flex-col gap-3 w-full"
            style={{
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase text-black/50"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              ✓ Suscrito correctamente
            </p>

            {/* Mensaje de spam */}
            <p
              className="text-[10px] text-black/30 leading-relaxed italic"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              Revisa tu bandeja de entrada — o tu carpeta de spam si no lo ves de inmediato.
              Puedes marcarlo como "No es spam" para recibirlo siempre.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col gap-3"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Label */}
          <p
            className="text-[10px] tracking-[0.25em] uppercase text-black/35"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            Recibe nuevas publicaciones
          </p>

          {/* Input + botón */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 px-3 py-2 rounded-xl text-xs outline-none text-black/60"
              style={{
                fontFamily: "'Gowun Batang', serif",
                background: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase text-black/50 transition-all duration-300 disabled:opacity-40"
              style={{
                fontFamily: "'Gowun Batang', serif",
                background: "rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              {status === "loading" ? "..." : "Suscribir"}
            </button>
          </div>

          {/* Mensajes */}
          {status === "error" && (
            <p className="text-[10px] text-red-400 tracking-wide"
               style={{ fontFamily: "'Gowun Batang', serif" }}>
              Ingresa un email válido.
            </p>
          )}
          {status === "duplicate" && (
            <p className="text-[10px] text-black/35 tracking-wide italic"
               style={{ fontFamily: "'Gowun Batang', serif" }}>
              Este email ya está suscrito.
            </p>
          )}
        </div>
      )}
    </div>
  );
}