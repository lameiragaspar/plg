"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

const ALL_PROJECTS = getAllProjects();
const CATEGORIES   = getCategories();

const projects          = ALL_PROJECTS.filter((p) => p.type === "fullstack");
const relatedCategories = CATEGORIES.filter((c) => c.key !== "fullstack");

// ── ArchDiagram ────────────────────────────────────────────────────────────
// Aparece no cabeçalho de /fullstack.
// Ilustra a arquitectura UI → API → DB para recrutadores técnicos e não-técnicos.
function ArchDiagram() {
  const nodes = [
    {
      id: "ui",
      label: "UI",
      sub: "Next.js",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/25",
      text: "text-yellow-400",
    },
    {
      id: "api",
      label: "API",
      sub: "Node.js",
      bg: "bg-blue-400/10",
      border: "border-blue-400/25",
      text: "text-blue-400",
    },
    {
      id: "db",
      label: "DB",
      sub: "Postgres",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/25",
      text: "text-emerald-400",
    },
  ];

  const edges = ["REST / HTTP", "SQL / ORM"];

  return (
    <div className="flex items-center justify-center mt-4 select-none flex-wrap gap-y-4">
      {nodes.map((node, i) => (
        <div key={node.id} className="flex items-center">

          {/* Nó */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`
                w-16 h-11 rounded-xl
                ${node.bg} border ${node.border}
                flex items-center justify-center
                ${node.text} font-mono font-bold text-sm tracking-wide
              `}
            >
              {node.label}
            </div>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">
              {node.sub}
            </span>
          </div>

          {/* Conector (só entre nós) */}
          {i < edges.length && (
            <div className="flex flex-col items-center mx-5">
              <span className="text-[9px] text-gray-700 uppercase tracking-wider mb-1.5">
                {edges[i]}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-px bg-gray-700" />
                <div className="w-4 h-px bg-gray-700" />
                <div className="w-4 h-px bg-gray-700" />
                <span className="text-gray-600 text-xs leading-none ml-0.5">›</span>
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

// ── SplitStack ─────────────────────────────────────────────────────────────
// Aparece no modal, divide as tecnologias em front e back.
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
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded border bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
              >
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
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded border bg-blue-400/10 text-blue-400 border-blue-400/20"
              >
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
      headerExtra={<ArchDiagram />}
      renderModalExtra={(project) => <SplitStack project={project} />}
    />
  );
}