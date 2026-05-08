import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Carousel({ items }) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const animate = (dir, newIndex) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex(newIndex);
      setAnimating(false);
      setDirection(null);
    }, 300);
  };

  const next = () => animate("left", (index + 1) % items.length);
  const prev = () => animate("right", (index - 1 + items.length) % items.length);

  const count = Math.min(visibleCount, items.length);
  const visible = Array.from({ length: count }).map((_, i) =>
    items[(index + i) % items.length]
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center gap-2 md:gap-5 px-2 md:px-8 select-none">

      {/* Botón Izquierda */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-black/15 bg-white/40 backdrop-blur-sm
                   flex items-center justify-center text-xl text-black/50
                   hover:bg-white/70 hover:text-black/80 hover:border-black/30
                   transition-all duration-300 ease-out hover:scale-105 active:scale-95 z-10"
      >
        ‹
      </button>

      {/* Cards */}
      <div className="flex gap-3 md:gap-5 overflow-hidden">
        {visible.map((item, i) => (
          <div
            key={`${index}-${i}`}
            onClick={() => navigate(`/post/${item.id}`)}
            className="group relative flex-shrink-0 overflow-hidden rounded-2xl shadow-sm cursor-pointer"
            style={{
              width: visibleCount === 1 ? "min(72vw, 280px)" : visibleCount === 2 ? "min(38vw, 240px)" : "min(22vw, 220px)",
              height: visibleCount === 1 ? "360px" : "400px",
              opacity: animating ? 0.6 : 1,
              transform: animating
                ? `translateX(${direction === "left" ? "-12px" : "12px"})`
                : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 z-10">
              <p className="text-white/90 text-sm font-medium leading-snug tracking-wide"
                 style={{ fontFamily: "'Gowun Batang', serif" }}>
                {item.title}
              </p>
            </div>
            <div
              className="absolute inset-0 flex flex-col justify-end px-5 py-5 z-20
                         opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 60%, transparent 100%)" }}
            >
              <p className="text-white/95 text-sm leading-relaxed mb-1"
                 style={{ fontFamily: "'Gowun Batang', serif" }}>
                {item.title}
              </p>
              {item.desc && (
                <p className="text-white/65 text-xs leading-relaxed mt-1">{item.desc}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-px bg-white/40" />
                <span className="text-white/40 text-[10px] tracking-widest uppercase"
                      style={{ fontFamily: "'Gowun Batang', serif" }}>
                  Leer
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón Derecha */}
      <button
        onClick={next}
        aria-label="Siguiente"
        className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-black/15 bg-white/40 backdrop-blur-sm
                   flex items-center justify-center text-xl text-black/50
                   hover:bg-white/70 hover:text-black/80 hover:border-black/30
                   transition-all duration-300 ease-out hover:scale-105 active:scale-95 z-10"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="transition-all duration-300"
            style={{
              width: i === index ? "20px" : "6px",
              height: "6px",
              borderRadius: "999px",
              background: i === index ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}