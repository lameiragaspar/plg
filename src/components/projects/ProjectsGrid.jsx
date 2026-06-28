"use client";

// components/projects/ProjectsGrid.jsx
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/projects/ProjectCard";
import EmptyState from "@/components/projects/EmptyState";

export default function ProjectsGrid({
  filteredProjects,
  activeTech,
  liked,
  onOpenProject,
  onToggleLike,
  onClearTech,
  search,
  category = "geral",   // "Frontend" | "Backend" | "Fullstack" — vem de ProjectsLayout
}) {
  // Normaliza para lowercase para corresponder às chaves do EmptyState
  const tipoEmptyState = category.toLowerCase();

  // Mensagem contextual: muda quando há filtro activo
  const mensagemVazia = activeTech
    ? `Nenhum projeto com "${activeTech}" encontrado.`
    : `Nenhum projeto ${category !== "geral" ? `de ${category} ` : ""}encontrado.`;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={`${activeTech ?? "all"}-${search}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.1} className="h-full">
              <div className="relative group min-w-0 h-full">
                <ProjectCard
                  project={project}
                  onClick={() => onOpenProject(project)}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLike(project.id); }}
                  className={`absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                    liked[project.id]
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-black/40 border-yellow-500/20 text-gray-400 hover:border-yellow-400/50"
                  }`}
                >
                  {liked[project.id] ? "❤️" : "🤍"} {project.likes ?? 0}
                </button>
              </div>
            </FadeIn>
          ))
        ) : (
          <EmptyState
            tipo={tipoEmptyState}
            mensagem={mensagemVazia}
            onClearFilter={activeTech ? onClearTech : null}
            labelBotao="Ver todos"
          />
        )}
      </motion.section>
    </AnimatePresence>
  );
}