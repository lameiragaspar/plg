"use client";

import Link from "next/link";

/**
 * BigCategoryCard
 *
 * Props:
 * @param {Object} cat   - { key, title, link, description, icon, accent,
 *                          accentClass, borderClass, hoverBg }
 * @param {number} count - Número de projectos nesta categoria
 */
export default function BigCategoryCard({ cat, count }) {
  return (
    <Link href={cat.link} className="block h-full">
      <div
        className={`
          group relative flex flex-col justify-between
          p-8 rounded-2xl border bg-zinc-900/60
          ${cat.borderClass}
          hover:-translate-y-1 transition-all duration-300
          cursor-pointer overflow-hidden h-full min-h-[180px]
          ${cat.hoverBg}
        `}
      >
        {/* Glow — desktop only (pointer: fine) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at top left, ${
              cat.accent === "yellow" ? "rgba(250,204,21,0.06)" :
              cat.accent === "blue"   ? "rgba(96,165,250,0.06)" :
                                        "rgba(52,211,153,0.06)"
            } 0%, transparent 70%)`,
          }}
        />
 
        {/* Linha 1: ícone + número */}
        <div className="relative z-10 flex items-start justify-between">
          <span className="text-3xl">{cat.icon}</span>
          {/* Número: em mobile sempre a 30% opacidade, no hover sobe para 60% */}
          <p className={`text-5xl font-bold select-none leading-none ${cat.accentClass} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}>
            {String(count).padStart(2, "0")}
          </p>
        </div>
 
        {/* Linha 2: título + descrição */}
        <div className="relative z-10 flex-1 mt-3">
          <h3 className={`text-2xl font-bold ${cat.accentClass}`}>
            {cat.title}
          </h3>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            {cat.description}
          </p>
        </div>
 
        {/* Rodapé: "Ver todos →" sempre visível em mobile, anima no hover em desktop */}
        <div className="relative z-10 flex items-center justify-end mt-6">
          {/*
            Mobile (pointer: coarse): sempre visível com opacidade reduzida.
            Desktop (pointer: fine):  só aparece no hover com opacidade total + deslize.
          */}
          <span className={`
            text-sm font-medium ${cat.accentClass}
            opacity-50 group-hover:opacity-100
            translate-x-0 group-hover:translate-x-1
            transition-all duration-300
            [@media(pointer:fine)]:opacity-0
            [@media(pointer:fine)]:group-hover:opacity-100
            [@media(pointer:fine)]:-translate-x-2
            [@media(pointer:fine)]:group-hover:translate-x-0
          `}>
            Ver todos →
          </span>
        </div>
      </div>
    </Link>
  );
}