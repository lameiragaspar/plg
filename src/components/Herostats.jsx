"use client";

import { useEffect, useRef, useState, useMemo } from "react";

// ── useCountUp ─────────────────────────────────────────────────────────────
// Só dispara quando o elemento entra no viewport (IntersectionObserver).
// Devolve { value, ref } — atribui `ref` ao wrapper do item.
function useCountUp(target, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  // Reinicia se o target mudar (ex: dados recarregados)
  useEffect(() => {
    hasRun.current = false;
    setValue(0);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        setTimeout(() => {
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutCubic — arranca rápido, trava suavemente no final
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(target);
          };
          requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, delay]);

  return { value, ref };
}

// ── StatItem ───────────────────────────────────────────────────────────────
// Um único elemento de stat: eyebrow label / número animado / label descritivo.
function StatItem({ target, eyebrow, label, delay = 0 }) {
  const { value, ref } = useCountUp(target, 900, delay);

  return (
    <div
      ref={ref}
      className="group flex flex-col items-center px-8 sm:px-10 py-2 cursor-default"
    >
      {/* Eyebrow — categoria da métrica */}
      <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-mono mb-2 select-none">
        {eyebrow}
      </span>

      {/* Número animado — fonte grande, peso bold, tabular-nums para não tremer */}
      <span className="text-[2.6rem] leading-none font-bold text-yellow-400 tabular-nums tracking-tight group-hover:text-yellow-300 transition-colors duration-300 select-none">
        {value}
      </span>

      {/* Label descritivo — primeira palavra em destaque */}
      <span className="text-[0.72rem] text-zinc-500 mt-2 text-center leading-snug select-none">
        {label}
      </span>
    </div>
  );
}

// ── Separador de três pontos ───────────────────────────────────────────────
// Substitui o border-l / border-r anterior — mais leve, mais intencional.
function DotSeparator() {
  return (
    <div className="hidden sm:flex flex-col items-center gap-[5px] px-1 opacity-30 select-none" aria-hidden>
      <span className="w-[3px] h-[3px] rounded-full bg-yellow-400" />
      <span className="w-[3px] h-[3px] rounded-full bg-yellow-400" />
      <span className="w-[3px] h-[3px] rounded-full bg-yellow-400" />
    </div>
  );
}

// ── HeroStats ──────────────────────────────────────────────────────────────
// Props:
//   projects  Project[]  — lista completa de projectos (vinda do servidor)
//
// Derivações feitas aqui em vez de no componente pai para manter as
// responsabilidades localizadas. `useMemo` evita recálculo em cada render.
export default function HeroStats({ projects }) {
  const stats = useMemo(() => ({
    projects: projects.length,
    techs:    new Set(projects.flatMap((p) => p.tech ?? [])).size,
    areas:    new Set(projects.map((p) => p.type)).size,
  }), [projects]);

  return (
    <div
      className="inline-flex items-center justify-center flex-wrap"
      role="list"
      aria-label="Estatísticas do portfólio"
    >
      <div role="listitem">
        <StatItem
          target={stats.projects}
          eyebrow="portfólio"
          label="projectos publicados"
          delay={0}
        />
      </div>

      <DotSeparator />

      <div role="listitem">
        <StatItem
          target={stats.techs}
          eyebrow="stack"
          label="tecnologias dominadas"
          delay={120}
        />
      </div>

      <DotSeparator />

      <div role="listitem">
        <StatItem
          target={stats.areas}
          eyebrow="especialização"
          label="áreas cobertas"
          delay={240}
        />
      </div>
    </div>
  );
}