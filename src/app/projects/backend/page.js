"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

const ALL_PROJECTS = getAllProjects();
const CATEGORIES   = getCategories();

const projects = ALL_PROJECTS.filter((p) => p.type === "backend");
const relatedCategories = CATEGORIES.filter((c) => c.key !== "backend");

// ── Componente exclusivo desta página ─────────────────────────────────────
// EndpointViewer: aparece no modal, lista as rotas da API do projeto.
// Só faz sentido em /backend — daí ser local a esta página.
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
            <span className={`shrink-0 px-2 py-0.5 rounded border font-bold text-[10px] ${methodColor[ep.method] ?? "text-gray-400"}`}>
              {ep.method}
            </span>
            <span className="text-gray-300 truncate">{ep.path}</span>
            {ep.description && (
              <span className="text-gray-600 truncate hidden sm:block">{ep.description}</span>
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
      // Injeta o EndpointViewer no modal de cada projecto que tenha endpoints
      renderModalExtra={(project) =>
        project.endpoints?.length ? (
          <EndpointViewer endpoints={project.endpoints} />
        ) : null
      }
    />
  );
}