import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Footer from "./components/Footer";
import NewsSection from "./components/NewsSection";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [books, setBooks] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const mapped = data.map((p) => ({
        ...p,
        image: p.image_url,
      }));

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

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="mx-auto w-full max-w-4xl xl:mx-0">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <p
                  className="text-xs uppercase tracking-widest text-black/30"
                  style={{ fontFamily: "'Gowun Batang', serif" }}
                >
                  Cargando...
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                <Section
                  id="artículos"
                  title="Artículos"
                  items={articles}
                />

                <Section
                  id="libros"
                  title="Libros"
                  items={books}
                />

                <Section
                  id="documentales"
                  title="Documentales"
                  items={docs}
                />
              </div>
            )}
          </main>

          <aside className="hidden border-l border-black/10 pl-7 xl:block">
            <NewsSection mode="desktop" />
          </aside>
        </div>

        <div className="xl:hidden">
          <NewsSection mode="mobile" />
        </div>
      </div>

      <Footer />
    </>
  );
}