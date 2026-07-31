import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Footer from "./components/Footer";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [books, setBooks]       = useState([]);
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);

useEffect(() => {
  const load = async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const res = await fetch(
      `${url}/rest/v1/posts?select=*&published=eq.true&order=created_at.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );

    const data = await res.json();
    const mapped = data.map((p) => ({ ...p, image: p.image_url }));
    setArticles(mapped.filter((p) => p.category === "article"));
    setBooks(mapped.filter((p) => p.category === "book"));
    setDocs(mapped.filter((p) => p.category === "doc"));
    setLoading(false);
  };

  load();
}, []);

  return (
    <>
      <Navbar />
      <Hero />

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <p
            className="text-xs tracking-widest uppercase text-black/30"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            Cargando...
          </p>
        </div>
      ) : (
        <>
          <Section id="artículos" title="Artículos" items={articles} />
          <Section id="libros" title="Libros" items={books} />
          <Section id="documentales" title="Documentales" items={docs} />
        </>
      )}

      <Footer />
    </>
  );
}
