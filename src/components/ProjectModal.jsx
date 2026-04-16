"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiX } from "react-icons/fi";

export default function ProjectModal({ project, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay Escuro com Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Conteúdo do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>

            <h3 className="text-3xl font-bold text-white mb-2">
              {project.title}
            </h3>

            {/* Badges de Tecnologias */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="space-y-6 text-zinc-300">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Motivação</h4>
                <p className="leading-relaxed">{project.motivation}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Aprendizados</h4>
                <p className="leading-relaxed">{project.learnings}</p>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center gap-4">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-zinc-950 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                <FiGithub size={20} />
                Ver Código no GitHub
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3 text-zinc-300 font-medium hover:text-white transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}