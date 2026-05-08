import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminSetup() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSetPassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      {done ? (
        <p style={{ fontFamily: "'Gowun Batang', serif" }}
           className="text-black/60 tracking-widest text-sm uppercase">
          Contraseña creada ✅ — <a href="/admin" className="underline">Ir al panel</a>
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6 max-w-sm w-full">
          <p className="text-xs tracking-[0.25em] uppercase text-black/35"
             style={{ fontFamily: "'Gowun Batang', serif" }}>
            Crear contraseña
          </p>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm
                       border border-black/10 text-sm outline-none text-black/70
                       focus:border-black/25 focus:bg-white/60"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleSetPassword}
            className="w-full py-3 rounded-xl bg-black/10 hover:bg-black/15
                       text-sm tracking-widest uppercase text-black/60
                       transition-all duration-300"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}