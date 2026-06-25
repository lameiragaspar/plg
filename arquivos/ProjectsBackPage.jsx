"use client";

import ProjectsLayout from "@/components/ProjectsLayout";

// ── TerminalStatsBar ───────────────────────────────────────────────────────
// Painel CLI que mostra métricas reais dos projectos (nº de APIs e endpoints).
// Local a esta página porque só faz sentido no contexto /backend.
function TerminalStatsBar({ projects }) {
  const totalEndpoints = projects.reduce(
    (sum, p) => sum + (p.endpoints?.length ?? 0), 0
  );
  const totalTechs = new Set(projects.flatMap((p) => p.tech ?? [])).size;

  const lines = [
    { cmd: "projects --list",    result: `${projects.length} APIs registadas`, color: "text-green-400" },
    { cmd: "endpoints --count",  result: `${totalEndpoints} rotas mapeadas`,  color: "text-blue-400"  },
    { cmd: "stack --summary",    result: `${totalTechs} tecnologias em uso`,   color: "text-yellow-400"},
  ];

  return (
    <div className="font-mono text-sm bg-zinc-950 border border-blue-400/20 rounded-xl max-w-md mx-auto overflow-hidden text-left">
      {/* Barra do terminal */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-blue-400/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-gray-600 text-xs">~/api/status</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400/60">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" />
          online
        </span>
      </div>

      {/* Linhas de comando */}
      <div className="px-4 py-4 space-y-3">
        {lines.map(({ cmd, result, color }, i) => (
          <div key={i}>
            <p className="text-xs">
              <span className="text-blue-400">$ </span>
              <span className="text-gray-400">{cmd}</span>
            </p>
            <p className={`text-xs pl-3 mt-0.5 ${color}`}>→ {result}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EndpointViewer ─────────────────────────────────────────────────────────
// Slot de conteúdo extra no modal, exclusivo de /backend.
// Listagem de rotas da API de cada projecto.
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
      <h4 className="text-blue-400 font-mono text-[11px] uppercase tracking-widest mb-3">
        Endpoints
      </h4>
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
              <span className="text-gray-600 truncate hidden sm:block ml-auto">
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
export default function BackendProjectsPage({projects = [], projectsBackend = [], relatedCategories = []}) {
  return (
    <ProjectsLayout
      category="Backend"
      description="APIs, lógica de negócio e infraestrutura. Foco em"
      tagline="performance, segurança e escalabilidade."
      accentClass="text-blue-400"
      projects={projects}
      projectsByType={projectsBackend}
      relatedCategories={relatedCategories}
      headerExtra={<TerminalStatsBar projects={projects} />}
      renderModalExtra={(project) =>
        project.endpoints?.length ? (
          <EndpointViewer endpoints={project.endpoints} />
        ) : null
      }
    />
  );
}