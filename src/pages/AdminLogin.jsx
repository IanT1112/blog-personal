import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Credenciales incorrectas");
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        {/* Logo / título */}
        <div className="text-center mb-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3"
             style={{ fontFamily: "'Gowun Batang', serif" }}>
            Panel privado
          </p>
          <h1 className="text-2xl text-black/75 font-normal"
              style={{ fontFamily: "'Gowun Batang', serif" }}>
            Ian Enterprise
          </h1>
        </div>

        {/* Línea */}
        <div style={{ width: "40px", height: "1px", background: "rgba(0,0,0,0.15)" }} />

        {/* Inputs */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm
                     border border-black/10 text-sm outline-none text-black/70
                     focus:border-black/25 focus:bg-white/60"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm
                     border border-black/10 text-sm outline-none text-black/70
                     focus:border-black/25 focus:bg-white/60"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        />

        {error && (
          <p className="text-red-400 text-xs tracking-wide">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black/10 hover:bg-black/18
                     text-sm tracking-widest uppercase text-black/55
                     transition-all duration-300 disabled:opacity-40"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </div>
    </div>
  );
}