"use client";

function FrontendTop({ project }) {
  return (
    <div className="overflow-hidden shrink-0">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
      />
    </div>
  );
}

function BackendTop({ project }) {
  const lines = project.tech?.slice(0, 3) ?? [];
  // Truncado para não forçar overflow em telas pequenas
  const slug = (project.title ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 24);

  return (
    <div className="h-48 bg-zinc-950 border-b border-blue-500/10 flex flex-col p-4 font-mono relative overflow-hidden shrink-0">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,#fff 2px,#fff 3px)",
          backgroundSize: "100% 3px",
        }}
      />
      <div className="flex items-center gap-1.5 mb-3 shrink-0 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60 shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 shrink-0" />
        <span className="ml-2 text-gray-600 text-xs truncate min-w-0">
          ~/api/{slug}
        </span>
      </div>
      <div className="flex-1 space-y-1.5 text-xs overflow-hidden">
        <p>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-blue-300">server</span>{" "}
          <span className="text-gray-500">=</span>{" "}
          <span className="text-yellow-400">express</span>
          <span className="text-gray-500">()</span>
        </p>
        {lines.map((t, i) => (
          <p key={t} className="text-gray-600 truncate">
            <span className="text-green-400/70">{"// "}</span>
            <span style={{ opacity: 1 - i * 0.15 }}>{t}</span>
          </p>
        ))}
        {project.endpoints?.length > 0 && (
          <p className="mt-2">
            <span className="text-green-400">✓</span>{" "}
            <span className="text-gray-400">{project.endpoints.length} endpoints</span>
          </p>
        )}
        
      </div>
      <span className="absolute bottom-4 left-4 text-blue-400 text-sm animate-pulse">▋</span>
    </div>
  );
}

function FullstackTop({ project }) {
  const slug = (project.title ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 20);

  return (
    <div className="h-48 bg-zinc-950 flex shrink-0 overflow-hidden relative">
      {/* Scanline */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,#fff 2px,#fff 3px)",
          backgroundSize: "100% 3px",
        }}
      />

      {/* Painel FRONT — tom amarelo */}
      <div className="flex-1 min-w-0 flex flex-col p-3 font-mono text-xs border-r border-emerald-500/10 relative z-10 overflow-hidden">
        {/* Barra do terminal */}
        <div className="flex items-center gap-1 mb-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500/50" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/50" />
          <span className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="ml-1.5 text-[10px] text-yellow-400/40 truncate">~/page.js</span>
        </div>
        {/* Trecho de código front */}
        <div className="space-y-1 overflow-hidden">
          <p className="text-gray-600 truncate">
            <span className="text-purple-400/80">export default</span>
          </p>
          <p className="text-gray-600 truncate">
            <span className="text-yellow-300/70">function</span>
            <span className="text-white/50"> Page</span>
            <span className="text-gray-600">()</span>
            <span className="text-gray-600"> {"{"}</span>
          </p>
          <p className="text-gray-600 pl-2 truncate">
            <span className="text-yellow-300/70">return </span>
            <span className="text-emerald-400/60">{"<div>"}</span>
          </p>
          <p className="text-gray-600 pl-4 truncate">
            <span className="text-emerald-400/40">{"<h1>"}</span>
            <span className="text-gray-500/60">{slug}</span>
            <span className="text-emerald-400/40">{"</h1>"}</span>
          </p>
          <p className="text-gray-600 pl-2 truncate">
            <span className="text-emerald-400/60">{"</div>"}</span>
          </p>
          <p className="text-gray-600 truncate">{"}"}</p>
        </div>
        <span className="absolute bottom-3 left-3 text-yellow-400/60 animate-pulse text-sm">▋</span>
      </div>

      {/* Painel BACK — tom azul */}
      <div className="flex-1 min-w-0 flex flex-col p-3 font-mono text-xs relative z-10 overflow-hidden">
        <div className="flex items-center gap-1 mb-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500/50" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/50" />
          <span className="w-2 h-2 rounded-full bg-green-500/50" />
          <span className="ml-1.5 text-[10px] text-blue-400/40 truncate">~/server.js</span>
        </div>
        {/* Trecho de código back */}
        <div className="space-y-1 overflow-hidden">
          <p className="text-gray-600 truncate">
            <span className="text-purple-400/80">const</span>
            <span className="text-blue-300/60"> app</span>
            <span className="text-gray-500"> = </span>
            <span className="text-yellow-400/60">express</span>
            <span className="text-gray-600">()</span>
          </p>
          <p className="text-gray-600 truncate">
            <span className="text-green-400/50">{"// "}</span>
            <span className="text-gray-600/60">route handler</span>
          </p>
          <p className="text-gray-600 truncate">
            <span className="text-blue-300/60">app</span>
            <span className="text-gray-500">.</span>
            <span className="text-yellow-400/60">get</span>
            <span className="text-gray-600">{"("}</span>
            <span className="text-emerald-400/60">'/api'</span>
          </p>
          <p className="text-gray-600 pl-2 truncate">
            <span className="text-gray-500">(req, res)</span>
            <span className="text-purple-400/80"> ={">"}</span>
          </p>
          <p className="text-gray-600 pl-4 truncate">
            <span className="text-blue-300/60">res</span>
            <span className="text-gray-500">.</span>
            <span className="text-yellow-400/60">json</span>
            <span className="text-gray-600">({"{"}...{"}"}))</span>
          </p>
        </div>
        <span className="absolute bottom-3 right-3 text-blue-400/60 animate-pulse text-sm">▋</span>
      </div>
    </div>
  );
}

const badgeStyles = {
  frontend:  "text-yellow-400",
  backend:   "text-blue-400",
  fullstack: "text-emerald-400",
};
const buttonStyles = {
  frontend:  "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black",
  backend:   "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black",
  fullstack: "border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black",
};
const tagStyles = {
  frontend:  "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  backend:   "bg-blue-400/10 text-blue-400 border-blue-400/20",
  fullstack: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

export default function ProjectCard({ project, onClick }) {
  const type = project.type ?? "frontend";

  return (
    // min-w-0 + w-full: garante que o card encolhe correctamente em qualquer largura
    <div
      onClick={onClick}
      className="cursor-pointer min-w-0 w-full h-full flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-400/30 hover:-translate-y-1 transition-all duration-300 group"
    >
      {type === "backend"   && <BackendTop   project={project} />}
      {type === "fullstack" && <FullstackTop project={project} />}
      {type === "frontend"  && <FrontendTop  project={project} />}

      <div className="p-6 flex flex-col flex-1 min-w-0">
        <span className={`text-xs uppercase font-semibold tracking-widest ${badgeStyles[type]}`}>
          {type}
        </span>
        <h3 className="text-xl font-semibold mt-2 leading-snug">{project.title}</h3>
        <p className="text-gray-400 text-sm mt-2 flex-1 leading-relaxed">{project.description}</p>

        {/* Tech badges — todos os tipos, fullstack mostra todos juntos */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          { (() => {
            const maxTechs = project.tech?.length >= 4 ? 3 : 4; // Se tiver mais de 4, mostra só 3 + "..."
            return project.tech?.slice(0, maxTechs).map((t) => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded border ${tagStyles[type]}`}>
                {t}
              </span>
            ));
          })()}
          {project.tech?.length >= 4 && (
            <span className={`text-xs px-2 py-0.5 rounded border ${tagStyles[type]}`}>
              +{project.tech.length - 3}
            </span>
          )}      
        </div>

        <button className={`mt-6 py-2 rounded-lg transition text-sm font-medium border ${buttonStyles[type]}`}>
          + detalhes
        </button>
      </div>
    </div>
  );
}