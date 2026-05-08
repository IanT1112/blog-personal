import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Verificar sesión activa
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs tracking-widest uppercase text-black/30"
           style={{ fontFamily: "'Gowun Batang', serif" }}>
          Cargando...
        </p>
      </div>
    );
  }

  return session
    ? <AdminPanel onLogout={handleLogout} />
    : <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />;
}