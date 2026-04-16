"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);

  const featuredProjects = [
    {
      id: 1,
      type: "fullstack",
      title: "E-commerce Pro",
      description: "Plataforma completa com checkout e inventário.",
      image: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
      motivation: "Necessidade de um sistema escalável para lojistas.",
      tech: ["Next.js", "Node", "Prisma"],
      learnings: "Gerenciamento de estados complexos e webhooks.",
      github: "#",
      deploy: "#",
    },
    {
      id: 2,
      type: "backend",
      title: "API de Logística",
      description: "Sistema de rastreio em tempo real.",
      image: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
      motivation: "Otimizar rotas de entrega.",
      tech: ["Node.js", "Redis", "Docker"],
      learnings: "Cache e filas.",
      github: "#",
    },
  ];

  return (
    <main className="min-h-screen text-white px-6 py-40 max-w-6xl mx-auto">

      {/* 🔥 HERO */}
      <FadeIn>
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos & Experimentos
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explora minhas criações, desde APIs robustas até interfaces modernas.
          </p>
        </section>
      </FadeIn>

      {/* 🧭 CATEGORIAS */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        <CategoryCard title="Frontend" link="/projects/frontend" />
        <CategoryCard title="Backend" link="/projects/backend" />
        <CategoryCard title="Fullstack" link="/projects/fullstack" />
      </div>

      {/* ⭐ DESTAQUES */}
      <FadeIn>
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
          Destaques Recentes
        </h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.2}>
            <ProjectCard
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          </FadeIn>
        ))}
      </div>

      {/* 🧩 MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

//////////////////////////////////////////////////////

function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer h-full flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-400/40 hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs uppercase text-yellow-400 font-semibold">
          {project.type}
        </span>

        <h3 className="text-xl font-semibold mt-2">
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
  );
}

//////////////////////////////////////////////////////

function ProjectModal({ project, onClose }) {
  return (
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
        transition={{ duration: 0.3 }}
        className="bg-zinc-900 border border-yellow-500/20 max-w-2xl w-full p-8 rounded-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-2">
          {project.title}
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="text-yellow-400 font-semibold">Motivação</h4>
            <p>{project.motivation}</p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-semibold">Aprendizados</h4>
            <p>{project.learnings}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href={project.github}
            target="_blank"
            className="flex-1 text-center py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
          >
            Ver código
          </a>

          {project.deploy && (
            <a
              href={project.deploy}
              target="_blank"
              className="flex-1 text-center py-3 border border-yellow-400 text-yellow-400 font-semibold rounded-xl hover:bg-yellow-400 hover:text-black transition"
            >
              Ver projeto
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

//////////////////////////////////////////////////////

function CategoryCard({ title, link }) {
  return (
    <a
      href={link}
      className="p-8 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/40 hover:bg-yellow-400/5 transition text-center group"
    >
      <h3 className="text-xl font-semibold group-hover:scale-105 transition">
        {title}
      </h3>
      <span className="text-sm text-gray-500">
        Ver todos →
      </span>
    </a>
  );
}