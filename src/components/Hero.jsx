import { useEffect, useState } from "react";
import Newsletter from "./Newsletter";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen overflow-hidden"
    >
      {/* FONDO TEXTURA sutil */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(180,165,140,0.18) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(200,185,160,0.12) 0%, transparent 50%)",
        }}
      />

      {/* IMAGEN — desktop: columna derecha, móvil: fondo semitransparente */}
      <div
        className="absolute right-0 top-0 h-full z-10"
        style={{
          width: "50%",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.1s ease 0.2s",
        }}
      >
        <img
          src="/yo.png"
          alt="Foto personal"
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center 60%",
            WebkitMaskImage:
              "linear-gradient(to left, black 40%, transparent 100%)",
            maskImage:
              "linear-gradient(to left, black 40%, transparent 100%)",
          }}
        />
      </div>

      {/* En móvil: imagen como fondo */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          opacity: visible ? 0.18 : 0,
          transition: "opacity 1.1s ease 0.2s",
        }}
      >
        <img
          src="/yo.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 10%" }}
        />
      </div>

      {/* CONTENIDO CENTRADO VERTICALMENTE */}
      <div className="relative z-20 min-h-screen flex items-center">
        {/* TEXTO — ocupa mitad izquierda en desktop, centrado en móvil */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left px-8 md:px-16 lg:px-24"
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
            className="text-3xl md:text-4xl lg:text-[2.7rem] leading-[1.38] text-black/85 font-normal"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            Escribo lo que leo,<br />
            <span className="italic text-black/50">pienso lo que veo</span><br />
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

          {/* CTA */}
          <a
            href="#articles"
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black/40 hover:text-black/70"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease 0.9s, color 0.3s ease",
            }}
          >
            <span>Explorar</span>
            <span className="text-base leading-none">↓</span>
          </a>

          {/* Newsletter */}
          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 1.1s" }}>
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hidden md:flex absolute bottom-8 left-1/4 -translate-x-1/2 flex-col items-center gap-2 z-30"
        style={{ opacity: visible ? 0.4 : 0, transition: "opacity 1s ease 1.2s" }}
      >
        <div style={{
          width: "1px",
          height: "40px",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
        }} />
      </div>
    </section>
  );
}