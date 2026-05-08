import { useEffect, useState } from "react";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden"
    >
      {/* FONDO TEXTURA sutil */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(180,165,140,0.18) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(200,185,160,0.12) 0%, transparent 50%)",
        }}
      />

      {/* TEXTO */}
      <div
        className="relative z-20 flex flex-col justify-center px-8 md:px-20 lg:px-28 pt-32 pb-12 md:pt-0 md:pb-0 md:w-1/2 max-w-xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(22px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        {/* Eyebrow */}
        <p
          className="text-xs tracking-[0.22em] uppercase text-black/35 mb-7"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        >
          Ideas · Libros · Pensamiento
        </p>

        {/* Headline */}
        <h1
          className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.35] text-black/85 font-normal"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        >
          Escribo lo que leo,<br />
          <span className="italic text-black/55">pienso lo que veo</span><br />
          y cuestiono lo que aprendo.
        </h1>

        {/* Separador */}
        <div
          className="mt-8 mb-6"
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(0,0,0,0.25)",
            opacity: visible ? 1 : 0,
            transition: "opacity 1.2s ease 0.4s",
          }}
        />

        {/* Subtítulo */}
        <p
          className="text-sm md:text-base text-black/45 leading-relaxed max-w-xs"
          style={{
            fontFamily: "'Gowun Batang', serif",
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.6s",
          }}
        >
          Un espacio de ideas, libros y pensamiento crítico.
        </p>

        {/* CTA sutil */}
        <a
          href="#artículos"
          className="mt-10 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black/40 hover:text-black/70 transition-colors duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.9s, color 0.3s ease",
          }}
        >
          <span>Explorar</span>
          <span className="text-base leading-none">↓</span>
        </a>
      </div>

      {/* IMAGEN — desktop: derecha absoluta, móvil: debajo */}
      <div
        className="
          relative md:absolute md:right-0 md:top-0
          w-full md:w-[52%] lg:w-[48%]
          h-[50vh] md:h-full
          z-10 mt-4 md:mt-0
        "
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1.1s ease 0.2s",
        }}
      >
        <img
          src="/yo.png"
          alt="Foto personal"
          className="w-full h-full object-cover object-center"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, black 50%, transparent 95%), linear-gradient(to bottom, black 80%, transparent 100%)",
            maskImage:
              "linear-gradient(to left, black 50%, transparent 95%), linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        />

        {/* Velo inferior en móvil para fusionar con fondo */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 md:hidden"
          style={{
            background: "linear-gradient(to bottom, transparent, #D9D2C8)",
          }}
        />
      </div>

      {/* Scroll indicator desktop */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-30"
           style={{ opacity: visible ? 0.4 : 0, transition: "opacity 1s ease 1.2s" }}>
        <div style={{
          width: "1px",
          height: "40px",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
          animation: "pulse 2s ease infinite",
        }} />
      </div>
    </section>
  );
}