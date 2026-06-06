"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

const ALL_PROJECTS = getAllProjects();
const CATEGORIES   = getCategories();

const projects          = ALL_PROJECTS.filter((p) => p.type === "backend");
const relatedCategories = CATEGORIES.filter((c) => c.key !== "backend");

// ── TerminalStats ──────────────────────────────────────────────────────────
// Aparece no cabeçalho de /backend como um painel de monitorização estilo CLI.
// Computa os dados reais a partir dos projectos — sem backend ainda.
function TerminalStats({ projects }) {
  const totalEndpoints = projects.reduce((sum, p) => sum + (p.endpoints?.length ?? 0), 0);
  const techSet        = [...new Set(projects.flatMap((p) => p.tech ?? []))];

  const rows = [
    { label: "projects",  value: projects.length,              color: "text-blue-400"  },
    { label: "endpoints", value: totalEndpoints || "—",        color: "text-blue-400"  },
    { label: "stack",     value: techSet.slice(0, 3).join(", ") || "—", color: "text-gray-400" },
  ];

  return (
    <div className="inline-block mx-auto mt-2 text-left">
      <div className="bg-zinc-950 border border-blue-500/15 rounded-xl overflow-hidden font-mono text-xs min-w-[220px]">

        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-blue-500/10 bg-zinc-900/50">
          <span className="w-2 h-2 rounded-full bg-red-500/50 shrink-0" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/50 shrink-0" />
          <span className="w-2 h-2 rounded-full bg-green-500/50 shrink-0" />
          <span className="ml-2 text-gray-600 tracking-tight select-none">
            ~/api-status --live
          </span>
        </div>

        {/* Status + rows */}
        <div className="px-4 py-3 space-y-2">
          {/* Status ONLINE */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">status</span>
            <span className="text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              ONLINE
            </span>
          </div>

          {/* Linhas de dados */}
          {rows.map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between gap-6">
              <span className="text-gray-600">{label}</span>
              <span className={`${color} font-medium truncate text-right max-w-[150px]`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Prompt line */}
        <div className="px-4 pb-3 flex items-center gap-1 text-gray-700">
          <span className="text-blue-400/50">$</span>
          <span className="w-1.5 h-3.5 bg-blue-400/30 animate-pulse inline-block rounded-sm" />
        </div>
      </div>
    </div>
  );
}

// ── EndpointViewer ─────────────────────────────────────────────────────────
// Aparece no modal de cada projecto que tenha endpoints definidos.
function EndpointViewer({ endpoints = [] }) {
  if (!endpoints.length) return null;

  const methodColor = {
    GET:    "text-green-400  bg-green-400/10  border-green-400/20",
    POST:   "text-blue-400   bg-blue-400/10   border-blue-400/20",
    PUT:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    PATCH:  "text-orange-400 bg-orange-400/10 border-orange-400/20",
    DELETE: "text-red-400    bg-red-400/10    border-red-400/20",
  };

  return (
    <div>
      <h4 className="text-blue-400 font-semibold mb-3">Endpoints</h4>
      <div className="space-y-2">
        {endpoints.map((ep, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-zinc-950/60 rounded-lg px-3 py-2 font-mono text-xs"
          >
            <span
              className={`shrink-0 px-2 py-0.5 rounded border font-bold text-[10px] ${
                methodColor[ep.method] ?? "text-gray-400"
              }`}
            >
              {ep.method}
            </span>
            <span className="text-gray-300 truncate">{ep.path}</span>
            {ep.description && (
              <span className="text-gray-600 truncate hidden sm:block">
                {ep.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function BackendProjectsPage() {
  return (
    <ProjectsLayout
      category="Backend"
      description="APIs, lógica de negócio e infraestrutura. Foco em"
      tagline="performance, segurança e escalabilidade."
      accentClass="text-blue-400"
      projects={projects}
      relatedCategories={relatedCategories}
      headerExtra={<TerminalStats projects={projects} />}
      renderModalExtra={(project) =>
        project.endpoints?.length ? (
          <EndpointViewer endpoints={project.endpoints} />
        ) : null
      }
    />
  );
}