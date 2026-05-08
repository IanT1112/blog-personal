export default function Footer() {
  return (
    <footer className="relative w-full py-12 md:py-16 px-8 overflow-hidden">

      {/* Línea superior decorativa */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
        <div style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.2)",
        }} />
        <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.1)" }} />
      </div>

      {/* Contenido */}
      <div className="flex flex-col items-center gap-3 text-center">

        {/* Nombre grande y sutil */}
        <p
          className="text-[11px] tracking-[0.35em] uppercase text-black/25"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        >
          Ian?
        </p>

        {/* Copyright */}
        <p
          className="text-[11px] tracking-[0.18em] text-black/35"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        >
          © {new Date().getFullYear()} · Todos los derechos reservados
        </p>


      </div>
    </footer>
  );
}