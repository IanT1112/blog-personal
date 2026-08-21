export default function NewsCard({
  article,
  compact = false,
}) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString(
        "es-PE",
        {
          day: "2-digit",
          month: "short",
        }
      )
    : "";

  return (
    <article
      className={
        compact
          ? "flex h-full flex-col"
          : "border-t border-black/10 py-5"
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-black/40">
        <span>
          {article.category || "Actualidad"}
        </span>

        <span>·</span>

        <span>{article.source}</span>

        {date && (
          <>
            <span>·</span>
            <span>{date}</span>
          </>
        )}
      </div>

      <h3
        className={
          compact
            ? "text-lg leading-snug text-black"
            : "text-base leading-snug text-black"
        }
        style={{
          fontFamily: "'Gowun Batang', serif",
        }}
      >
        {article.title}
      </h3>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-5 text-[10px] uppercase tracking-wider text-black/45 transition hover:text-black"
      >
        Leer en {article.source} →
      </a>
    </article>
  );
}