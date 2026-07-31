import { useState, useEffect } from "react";

const links = ["Inicio", "Artículos", "Libros", "Documentales"];
export default function Navbar() {
  const [active, setActive] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detectar sección activa
      for (const link of [...links].reverse()) {
        const el = document.getElementById(link.toLowerCase());
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActive(link.toLowerCase());
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-5 z-50 w-max"
      style={{
        left: "50%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-12px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <nav
        className="flex items-center gap-0.5 md:gap-1 px-3 md:px-5 py-2 rounded-full border transition-all duration-500"
        style={{
          background: scrolled ? "rgba(217,210,200,0.82)" : "rgba(255,255,255,0.22)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: scrolled ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.35)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)"
            : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {links.map((item) => {
          const isActive = active === item.toLowerCase();
          return (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setActive(item.toLowerCase())}
              className="relative px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm transition-all duration-300 ease-out"
              style={{
                fontFamily: "'Gowun Batang', serif",
                color: isActive ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.45)",
                background: isActive ? "rgba(0,0,0,0.07)" : "transparent",
                letterSpacing: "0.03em",
                transform: isActive ? "scale(1.02)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "rgba(0,0,0,0.7)";
                if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "rgba(0,0,0,0.45)";
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {item}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
