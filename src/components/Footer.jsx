export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden px-6 py-10 md:px-8 md:py-14">
      {/* Línea superior decorativa */}
      <div className="mb-8 flex items-center justify-center gap-5">
        <div className="h-px flex-1 bg-black/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <div
        className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        <div className="space-y-1.5">
          <p className="text-sm tracking-[0.12em] text-black/60">
            Desarrollado por <span className="text-black/90">Ian Tapia</span>
          </p>
          <p className="text-[10px] tracking-[0.16em] text-black/35">
            © {new Date().getFullYear()} · Todos los derechos reservados
          </p>
        </div>

        <a
          href="https://iantapia.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visitar el portafolio de Ian Tapia"
          className="group inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-xs tracking-[0.12em] text-black/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2"
        >
          Ver portafolio
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </a>
      </div>
    </footer>
  );
}
