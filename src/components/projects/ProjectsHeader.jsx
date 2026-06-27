"use client";

// components/projects/ProjectsHeader.jsx
import FadeIn from "@/components/FadeIn";
import TechFilterBar from "@/components/projects/TechFilterbar";

export default function ProjectsHeader({
  category,
  description,
  tagline,
  headerExtra,
  showTechFilter,
  allTechs,
  activeTech,
  onTechSelect,
}) {
  return (
    <section className="text-center mb-16">
      <FadeIn delay={0.2}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{category}</h1>
      </FadeIn>
      <FadeIn delay={0.4}>
        <p className="text-gray-400 max-w-xl mx-auto px-2">
          {description}
          {tagline && <span className="text-white"> {tagline}</span>}
        </p>
      </FadeIn>

      {/* Slot para UI extra por página (TerminalStatsBar, etc.) */}
      {headerExtra && (
        <FadeIn delay={0.6}>
          <div className="mt-8">{headerExtra}</div>
        </FadeIn>
      )}

      {/* Tech Filter — só aparece em /frontend */}
      {showTechFilter && allTechs.length > 0 && (
        <FadeIn delay={0.7}>
          <TechFilterBar
            techs={allTechs}
            active={activeTech}
            onSelect={onTechSelect}
          />
        </FadeIn>
      )}
    </section>
  );
}