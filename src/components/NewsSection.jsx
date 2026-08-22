import { useEffect, useState } from "react";
import { getLatestNews } from "../lib/news";
import NewsCard from "./NewsCard";

export default function NewsSection({ mode = "desktop" }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      const data = await getLatestNews();
      setNews(data);
      setLoading(false);
    }

    loadNews();
  }, []);

  if (mode === "mobile") {
    return (
      <section className="mx-auto max-w-4xl py-14">
        <div className="mb-7">
          <span className="text-[10px] uppercase tracking-[0.35em] text-black/40">
            Ianconia Briefing
          </span>

          <h2
            className="mt-3 text-2xl text-black"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            Lo que importa ahora
          </h2>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Tecnología, IA, negocios y economía.
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-black/40">
            Cargando...
          </p>
        ) : (
          <div
            className="
                -mx-1
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                px-1
                pb-5
                scrollbar-hide
            "
            >
            {news.map((article) => (
              <div
                key={article.id}
                className="
                min-w-[88%]
                snap-center
                rounded-2xl
                border
                border-black/10
                bg-white
                p-5
                sm:min-w-[60%]
                md:min-w-[45%]
                "
              >
                <NewsCard
                  article={article}
                  compact
                />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
  <section className="flex h-full min-h-0 flex-col py-10">
    <div className="mb-8 shrink-0">
      <span className="text-[10px] uppercase tracking-[0.35em] text-black/40">
        Ianconia Briefing
      </span>

      <h2
        className="mt-3 text-2xl text-black"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        Lo que importa ahora
      </h2>

      <p className="mt-3 text-sm leading-6 text-black/50">
        Tecnología, IA, negocios, economía y mercados.
      </p>
    </div>

    {loading ? (
      <p className="text-xs text-black/40">
        Cargando...
      </p>
    ) : (
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          pr-3

          [scrollbar-width:thin]
          [scrollbar-color:rgba(0,0,0,0.18)_transparent]

          [&::-webkit-scrollbar]:w-[5px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-black/15
          [&::-webkit-scrollbar-thumb:hover]:bg-black/25
        "
      >
        {news.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    )}
  </section>
);
}