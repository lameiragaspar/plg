"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

const ALL_PROJECTS     = getAllProjects();
const CATEGORIES       = getCategories();

const projects         = ALL_PROJECTS.filter((p) => p.type === "fullstack");
const relatedCategories = CATEGORIES.filter((c) => c.key !== "fullstack");

// ── ArchDiagram ────────────────────────────────────────────────────────────
// Diagrama estático UI → API → DB com a paleta do site.
// Aparece como secção extra após o grid de projectos, exclusivo de /fullstack.
function ArchDiagram() {
  const layers = [
    {
      label: "UI",
      sublabel: "React / Next.js",
      accentClass: "text-yellow-400",
      borderClass: "border-yellow-400/25",
      bg: "bg-yellow-400/8",
    },
    {
      label: "API",
      sublabel: "Node / Express",
      accentClass: "text-blue-400",
      borderClass: "border-blue-400/25",
      bg: "bg-blue-400/8",
    },
    {
      label: "DB",
      sublabel: "PostgreSQL / Mongo",
      accentClass: "text-emerald-400",
      borderClass: "border-emerald-400/25",
      bg: "bg-emerald-400/8",
    },
  ];

  return (
    <div className="border-t border-yellow-500/10 pt-16">
      <p className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs mb-10">
        Arquitectura típica
      </p>

      {/* Desktop: horizontal — Mobile: vertical */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-0 max-w-2xl mx-auto">
        {layers.map((layer, i) => (
          <div key={layer.label} className="flex flex-col sm:flex-row items-center">

            {/* Bloco */}
            <div
              className={`
                flex flex-col items-center gap-1
                px-8 py-5 rounded-2xl border
                ${layer.bg} ${layer.borderClass}
                min-w-[110px] sm:min-w-[130px]
              `}
            >
              <span className={`text-lg font-bold font-mono ${layer.accentClass}`}>
                {layer.label}
              </span>
              <span className="text-[10px] text-gray-500 text-center leading-snug">
                {layer.sublabel}
              </span>
            </div>

            {/* Seta entre blocos (não aparece após o último) */}
            {i < layers.length - 1 && (
              <>
                {/* Mobile: seta vertical */}
                <div className="flex sm:hidden flex-col items-center py-2 text-gray-700">
                  <span className="w-px h-5 bg-gray-700" />
                  <span className="text-xs leading-none">↓</span>
                </div>

                {/* Desktop: seta horizontal */}
                <div className="hidden sm:flex items-center gap-1 px-2 text-gray-700">
                  <span className="w-6 h-px bg-gray-700" />
                  <span className="text-xs leading-none">→</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-8 font-mono">
        Do browser ao banco de dados — integração de ponta a ponta.
      </p>
    </div>
  );
}

// ── SplitStack ─────────────────────────────────────────────────────────────
// Slot de conteúdo extra no modal, exclusivo de /fullstack.
// Divide as tecnologias do projecto em front e back.
function SplitStack({ project }) {
  const frontTech = project.frontTech ?? project.tech?.slice(0, 2) ?? [];
  const backTech  = project.backTech ?? project.tech?.slice(2) ?? [];

  if (!frontTech.length && !backTech.length) return null;

  return (
    <div>
      <h4 className="text-emerald-400 font-mono text-[11px] uppercase tracking-widest mb-3">
        Stack completa
      </h4>
      <div className="grid grid-cols-2 gap-3">
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
      sectionExtra={<ArchDiagram />}
      renderModalExtra={(project) => <SplitStack project={project} />}
    />
  );
}