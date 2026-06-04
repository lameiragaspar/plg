"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

const ALL_PROJECTS = getAllProjects();
const CATEGORIES   = getCategories();

const projects          = ALL_PROJECTS.filter((p) => p.type === "fullstack");
const relatedCategories = CATEGORIES.filter((c) => c.key !== "fullstack");

// ── Componente exclusivo desta página ─────────────────────────────────────
// SplitStack: aparece no modal, divide as tecnologias em front e back.
// Só faz sentido em /fullstack.
function SplitStack({ project }) {
  const frontTech = project.frontTech ?? project.tech?.slice(0, 2) ?? [];
  const backTech  = project.backTech  ?? project.tech?.slice(2)    ?? [];

  if (!frontTech.length && !backTech.length) return null;

  return (
    <div>
      <h4 className="text-emerald-400 font-semibold mb-3">Stack completa</h4>
      <div className="grid grid-cols-2 gap-3">

        {/* Front */}
        <div className="bg-zinc-950/60 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Frontend</p>
          <div className="flex flex-wrap gap-1.5">
            {frontTech.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded border bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="bg-zinc-950/60 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Backend</p>
          <div className="flex flex-wrap gap-1.5">
            {backTech.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded border bg-blue-400/10 text-blue-400 border-blue-400/20">
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function FullstackProjectsPage() {
  return (
    <ProjectsLayout
      category="Fullstack"
      description="Produtos completos do front ao banco de dados. Foco em"
      tagline="arquitectura sólida e experiência de ponta a ponta."
      accentClass="text-emerald-400"
      projects={projects}
      relatedCategories={relatedCategories}
      renderModalExtra={(project) => <SplitStack project={project} />}
    />
  );
}