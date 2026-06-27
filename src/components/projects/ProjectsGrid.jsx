"use client";

// components/projects/ProjectsGrid.jsx
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsGrid({
  filteredProjects,
  activeTech,
  liked,
  onOpenProject,
  onToggleLike,
  onClearTech,
  search,
}) {
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
          // Empty state quando não há resultados
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-600 text-sm">
              {activeTech
                ? `Nenhum projeto com "${activeTech}" encontrado.`
                : "Nenhum projeto encontrado."}
            </p>
            {activeTech && (
              <button
                onClick={onClearTech}
                className="mt-3 text-xs text-yellow-400/60 hover:text-yellow-400 transition cursor-pointer underline"
              >
                Ver todos
              </button>
            )}
          </div>
        )}
      </motion.section>
    </AnimatePresence>
  );
}