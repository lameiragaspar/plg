"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";

// Componentes
import CategoryCard from "@/components/CategoryCard";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";

export default function FrontendProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [liked, setLiked] = useState({});
  const [rating, setRating] = useState(0);

  const projects = [
    {
      id: 1,
      type: "frontend",
      title: "Landing Moderna",
      description: "Interface com foco em conversão e performance otimizada.",
      image: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
      tech: ["Next.js", "Tailwind"],
      likes: 120,
      github: "#",
      deploy: "#",
    },
    {
      id: 2,
      type: "frontend",
      title: "Dashboard UI",
      description: "Painel interativo com visualização de dados e gráficos.",
      image: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
      tech: ["React", "Chart.js"],
      likes: 85,
      github: "#",
      deploy: "#",
    },
    {
        id: 3,
        type: "frontend",
        title: "E-shop Minimalista",
        description: "Experiência de compra fluida com foco em acessibilidade e design clean.",
        image: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
        tech: ["Next.js", "Framer Motion"],
        likes: 215,
        github: "#",
        deploy: "#",
      },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen text-white px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">
      
      {/* NAVEGAÇÃO */}
      <nav className="text-center mb-8 text-sm font-medium">
        <FadeIn>
          <span className="text-yellow-400 font-mono text-sm mb-2 block uppercase tracking-widest"> <Link href="/projects" className="text-gray-500 hover:text-yellow-400 transition cursor-pointer">
            Projetos
          </Link> / Frontend</span>
        </FadeIn>
      </nav>

      {/* INTRO - PADRONIZADO */}
      <section className="text-center mb-16">
        <FadeIn delay={0.2}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos Frontend
          </h1>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-gray-400 max-w-xl mx-auto">
            Interfaces modernas, animações e experiências focadas no usuário. Foco total em 
            <span className="text-white"> performance e acessibilidade</span>
          </p>
        </FadeIn>
      </section>

      {/* FILTRO */}
      <section className="mb-12 max-w-2xl mx-auto">
        <FadeIn 
        direction="left"
        delay={0.4}>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-400 transition-colors">
            🔍
            </div>
            <input
              type="text"
              placeholder="O que procuras? (ex: Landing, Dashboard...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-yellow-500/10 focus:border-yellow-400/50 focus:bg-zinc-900 outline-none transition-all duration-300 shadow-2xl"
            />
            {showDropdown && search && (
              <div className="absolute w-full mt-2 bg-zinc-900 border border-yellow-500/10 rounded-lg max-h-48 overflow-auto z-10 shadow-xl">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { setSearch(p.title); setShowDropdown(false); }}
                    className="px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer text-sm transition"
                  >
                    {p.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* GRID COM FADEIN NO SCROLL */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.2}>
            <div className="relative group">
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
              <button
                onClick={(e) => { e.stopPropagation(); toggleLike(project.id); }}
                className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                  liked[project.id]
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-black/40 border-yellow-500/20 text-gray-400 hover:border-yellow-400/50"
                }`}
              >
                {liked[project.id] ? "❤️" : "🤍"} {liked[project.id] ? project.likes + 1 : project.likes}
              </button>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* EXPLORAR OUTRAS ÁREAS */}
      <section className="mt-20 border-t border-yellow-500/10 pt-10">
        <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs mb-10">Explorar Outras Áreas</h3>
        <FadeIn direction="left">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <CategoryCard title="Backend" link="/projects/backend" />
            <CategoryCard title="Fullstack" link="/projects/fullstack" />
          </div>
        </FadeIn>
      </section>

      {/* FEEDBACK & COMENTÁRIOS */}
      <section className="mt-24 max-w-3xl mx-auto">
        <FadeIn delay={0.2}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Feedback</h2>
            <p className="text-gray-500">A tua opinião ajuda a evoluir o código.</p>
         </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-yellow-500/10 mb-8">
            <textarea
              placeholder="Deixa o teu comentário..."
              className="w-full p-4 bg-black/40 border border-yellow-500/10 rounded-lg mb-4 outline-none focus:border-yellow-400/50 transition-all resize-none"
              rows="3"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-lg transition-all cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400/50"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition cursor-pointer">
                Enviar Avaliação
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* SEÇÃO CONVITE - ESTILO SOLICITADO */}
      <section className="py-20 px-6 text-center mt-20 border-t border-yellow-500/10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
             Vamos tirar essa ideia do papel?
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Disponível para colaborar em produtos digitais modernos.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Link
            href="/contact"
            className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition inline-block cursor-pointer"
          >
            Entrar em contacto
          </Link>
        </FadeIn>
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