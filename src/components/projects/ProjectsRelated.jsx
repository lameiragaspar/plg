"use client";

// components/projects/ProjectsRelated.jsx
import FadeIn from "@/components/FadeIn";
import BigCategoryCard from "@/components/BigCategoryCard";

export default function ProjectsRelated({ categories, countByType }) {
  return (
    <section className="mt-20 border-t border-yellow-500/10 pt-10">
      <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs mb-10">
        Explorar Outras Áreas
      </h3>
      <FadeIn direction="left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <FadeIn key={cat.key} delay={0.1 + i * 0.1}>
              <BigCategoryCard cat={cat} count={countByType[cat.key] ?? 0} />
            </FadeIn>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}