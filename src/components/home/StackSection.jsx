"use client";

import { useState, useEffect, useRef } from "react";
import FadeIn from "@/components/FadeIn";
import { STACK } from "@/lib/constants/homePageConfig";
import StackListItem from "./StackListItem";
import DesktopStackDetail from "./DesktopStackDetail";

// ── Hook: scroll reveal por proximidade ao centro do ecrã ────────────────
function useActiveOnScroll(count) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const recalculate = () => {
      // Ponto de ancoragem: 35% do ecrã — suficientemente alto para que
      // o último item (Node.js) seja activado antes de sair do viewport
      const anchor = window.innerHeight * 0.35;

      let bestIndex = 0;
      let bestDistance = Infinity;

      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - anchor);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestIndex = i;
        }
      });

      setActiveIndex(bestIndex);
    };

    recalculate();
    window.addEventListener("scroll", recalculate, { passive: true });
    window.addEventListener("resize", recalculate, { passive: true });
    return () => {
      window.removeEventListener("scroll", recalculate);
      window.removeEventListener("resize", recalculate);
    };
  }, [count]);

  return { activeIndex, refs };
}

export default function StackSection() {
  const { activeIndex, refs } = useActiveOnScroll(STACK.length);
  const active = STACK[activeIndex];
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const cardWrapRef = useRef(null);
  const lastItemRef = useRef(null);
  const [cardStyle, setCardStyle] = useState({});
  const [cardOpacity, setCardOpacity] = useState(1);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      const list = listRef.current;
      const cardWrap = cardWrapRef.current;
      const lastItem = lastItemRef.current;
      if (!section || !list || !cardWrap || !lastItem) return;

      const TOP_OFFSET = 128; // equivalente a top-32
      const listRect = list.getBoundingClientRect();
      const cardHeight = cardWrap.offsetHeight;

      // O card liberta o fixed quando o centro do último item passa o TOP_OFFSET
      const lastRect = lastItem.getBoundingClientRect();
      const lastCenter = lastRect.top + lastRect.height / 2;
      const lastItemPassed = lastCenter < TOP_OFFSET;

      // Fade out: começa quando o último item passou e o fundo da secção se aproxima
      const sectionRect = section.getBoundingClientRect();
      const fadeZone = 200;
      const distanceToEnd = sectionRect.bottom - (TOP_OFFSET + cardHeight);
      const opacity = lastItemPassed
        ? Math.max(0, Math.min(1, distanceToEnd / fadeZone))
        : 1;
      setCardOpacity(opacity);

      const shouldBeFixed = listRect.top <= TOP_OFFSET && !lastItemPassed;

      if (shouldBeFixed) {
        // Durante o scroll da lista: fixo no ecrã
        setCardStyle({
          position: "fixed",
          top: TOP_OFFSET,
          width: cardWrap.parentElement?.offsetWidth ?? "auto",
        });
      } else if (lastItemPassed) {
        // Passou o fim: ancorado ao fundo da secção
        setCardStyle({
          position: "absolute",
          top: "auto",
          bottom: 0,
          width: "100%",
        });
      } else {
        // Antes de a lista entrar: posição estática
        setCardStyle({ position: "static" });
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 max-w-6xl mx-auto">
      {/* Título */}
      <FadeIn>
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 block">Ferramentas</span>
          <h2 className="text-3xl md:text-4xl font-semibold">Stack tecnológica</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            Cada tecnologia tem um papel — rola para explorar o que aprendi com cada uma.
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

        {/* ── ESQUERDA: lista de techs ─────────────── */}
        <div ref={listRef} className="lg:w-1/2">
          {STACK.map((s, i) => (
            <StackListItem
              key={s.name}
              stack={s}
              index={i}
              activeIndex={activeIndex}
              itemRef={(el) => {
                refs.current[i] = el;
                if (i === STACK.length - 1) lastItemRef.current = el;
              }}
            />
          ))}
        </div>

        {/* ── DIREITA: painel com posicionamento JS (só desktop) ─── */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div ref={cardWrapRef} style={{ ...cardStyle, opacity: cardOpacity, transition: "opacity 0.4s ease" }}>
            <DesktopStackDetail stack={active} />
          </div>
        </div>
      </div>
    </section>
  );
}