import { useRef, useState, useEffect } from "react";
import Carousel from "./Carousel";

export default function Section({ id, title, items }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className="py-24 md:py-32 px-2 md:px-4 w-full flex flex-col items-center"
    >
      {/* Header de sección */}
      <div
        className="w-full max-w-6xl text-center mb-14 md:mb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Línea decorativa */}
        <div className="flex items-center justify-center gap-5 mb-6">
          <div style={{ width: "50px", height: "1px", background: "rgba(0,0,0,0.18)" }} />
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-black/35"
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            {id}
          </p>
          <div style={{ width: "50px", height: "1px", background: "rgba(0,0,0,0.18)" }} />
        </div>

        <h2
          className="text-3xl md:text-4xl text-black/80 font-normal"
          style={{ fontFamily: "'Gowun Batang', serif" }}
        >
          {title}
        </h2>
      </div>

      {/* Carousel o mensaje vacío */}
      <div
        className="w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
        }}
      >
        {items.length > 0 ? (
          <Carousel items={items} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12">
            <div style={{ width: "30px", height: "1px", background: "rgba(0,0,0,0.12)" }} />
            <p
              className="text-xs tracking-[0.25em] uppercase text-black/25"
              style={{ fontFamily: "'Gowun Batang', serif" }}
            >
              Contenido en proceso
            </p>
            <div style={{ width: "30px", height: "1px", background: "rgba(0,0,0,0.12)" }} />
          </div>
        )}
      </div>
    </section>
  );
}