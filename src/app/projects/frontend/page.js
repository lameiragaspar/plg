"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import { motion, AnimatePresence } from "framer-motion";

export default function FrontendProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      type: "frontend",
      title: "Landing Page Moderna",
      description: "Interface responsiva com animações suaves.",
      image: "https://via.placeholder.com/400x250",
      motivation: "Criar UI moderna e performática.",
      tech: ["React", "Next.js", "Tailwind"],
      learnings: "Animações e responsividade.",
      github: "#",
      deploy: "#",
    },
    {
      id: 2,
      type: "frontend",
      title: "Dashboard UI",
      description: "Painel com gráficos e dados dinâmicos.",
      image: "https://via.placeholder.com/400x250",
      motivation: "Visualização de dados eficiente.",
      tech: ["React", "Chart.js"],
      learnings: "Manipulação de dados e UI.",
      github: "#",
      deploy: "#",
    },
  ];

  return (
    <main className="min-h-screen text-white px-6 pt-32 pb-20 max-w-6xl mx-auto">

      {/* 🔥 HEADER */}
      <FadeIn>
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos Frontend
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Interfaces modernas focadas em experiência e performance.
          </p>
        </section>
      </FadeIn>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.2}>
            <div
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer h-full flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-400/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm mt-2 flex-1">
                  {project.description}
                </p>

                <button className="mt-6 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                  Detalhes
                </button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-zinc-900 border border-yellow-500/20 max-w-2xl w-full p-8 rounded-2xl relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold mb-4">
                {selectedProject.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 mb-4">
                {selectedProject.motivation}
              </p>

              <p className="text-gray-300">
                {selectedProject.learnings}
              </p>

              <div className="mt-8 flex gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 bg-yellow-400 text-black rounded-xl"
                >
                  Ver código
                </a>

                <a
                  href={selectedProject.deploy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 border border-yellow-400 text-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition"
                >
                  Ver projeto
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}