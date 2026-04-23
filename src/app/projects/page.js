"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import { AnimatePresence } from "framer-motion";

// Importação dos novos componentes
import CategoryCard from "@/components/CategoryCard";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";

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
    <main className="min-h-screen text-white px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">

      {/* INTRO */}
      <section className="text-center mb-16">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos & Experimentos
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explora minhas criações, desde APIs robustas até interfaces modernas.
          </p>
        </FadeIn>
      </section>

      {/* CATEGORIAS */}
      <section className="mb-20 border-t border-yellow-500/10 pt-10">
        <FadeIn direction="left">
          <div className="grid md:grid-cols-3 gap-6">
            <CategoryCard title="Frontend" link="/projects/frontend" />
            <CategoryCard title="Backend" link="/projects/backend" />
            <CategoryCard title="Fullstack" link="/projects/fullstack" />
          </div>
        </FadeIn>
      </section>

      {/* DESTAQUES */}
      <section className="border-t border-yellow-500/10 pt-12">
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
      </section>

      {/* MODAL */}
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