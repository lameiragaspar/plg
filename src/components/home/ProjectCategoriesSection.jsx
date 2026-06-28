import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import BigCategoryCard from "@/components/BigCategoryCard";

export default function ProjectCategoriesSection({ categories, countByType }) {
  return (
    <section className="py-24 px-6 bg-zinc-950/60 border-y border-yellow-500/5">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 block">Portfólio</span>
            <h2 className="text-3xl md:text-4xl font-semibold">Projectos por área</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
              Três áreas de especialização, cada uma com o seu foco e desafios próprios.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeIn key={cat.key} delay={0.1 + i * 0.1}>
              <BigCategoryCard cat={cat} count={countByType[cat.key] ?? 0} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border border-yellow-400/30 text-yellow-400 rounded-xl hover:bg-yellow-400/10 transition text-sm font-medium"
            >
              Ver todos os projectos
              <span>→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}