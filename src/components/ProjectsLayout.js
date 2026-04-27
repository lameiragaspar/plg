"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import CategoryCard from "@/components/CategoryCard";

/**
 * ProjectsLayout — componente base reutilizável para páginas de categoria.
 *
 * Props obrigatórias:
 * @param {string}   category          - Nome da categoria atual. Ex: "Frontend"
 * @param {string}   description       - Subtítulo descritivo da página.
 * @param {Array}    projects          - Lista de projetos a exibir.
 * @param {Array}    relatedCategories - Links para outras categorias. Ver formato abaixo.
 *
 * Props de personalização visual (opcionais):
 * @param {string}   accentClass       - Classe Tailwind para a cor de destaque. Default: "text-yellow-400"
 * @param {string}   tagline           - Frase em destaque no título (aparece colorida). Ex: "performance e acessibilidade"
 *
 * Props de extensão de conteúdo (opcionais):
 * @param {ReactNode} headerExtra      - Conteúdo extra abaixo do título/descrição (ex: badges de tech).
 * @param {Function}  renderCardExtra  - Função(project) → ReactNode. Renderiza algo extra sobre cada card.
 *                                       Ex: botão de like, EndpointViewer.
 * @param {ReactNode} sectionExtra     - Secção adicional antes do "Explorar Outras Áreas".
 *                                       Ideal para componentes únicos de cada categoria.
 *
 * Formato de relatedCategories:
 * [{ title: "Backend", link: "/projects/backend" }, ...]
 *
 * Formato de projects:
 * [{
 *   id, title, description, image, tech, likes,
 *   github, deploy (opcional),
 *   // campos extras aceites pelo ProjectCard/ProjectModal
 * }]
 */

export default function ProjectsLayout({
  // Obrigatórias
  category,
  description,
  projects = [],
  relatedCategories = [],

  // Personalização visual
  accentClass = "text-yellow-400",
  tagline = "",

  // Extensão de conteúdo
  headerExtra = null,
  renderCardExtra = null,
  sectionExtra = null,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [liked, setLiked] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Filtra projetos pelo campo de busca (título)
  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return projects;
    return projects.filter((p) => p.title.toLowerCase().includes(q));
  }, [search, projects]);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fecha o dropdown ao clicar fora
  const handleBlur = () => {
    // Pequeno delay para permitir o clique no item do dropdown
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <main className="min-h-screen text-white px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">

      {/* ── NAVEGAÇÃO (breadcrumb) ── */}
      <nav className="text-center mb-8 text-sm font-medium">
        <FadeIn>
          <span className="font-mono text-sm mb-2 block uppercase tracking-widest">
            <Link
              href="/projects"
              className="text-gray-500 hover:text-yellow-400 transition cursor-pointer"
            >
              Projetos
            </Link>
            <span className={accentClass}> / {category}</span>
          </span>
        </FadeIn>
      </nav>

      {/* ── CABEÇALHO ── */}
      <section className="text-center mb-16">
        <FadeIn delay={0.2}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Projetos {category}
          </h1>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-gray-400 max-w-xl mx-auto">
            {description}{" "}
            {tagline && (
              <span className="text-white">{tagline}</span>
            )}
          </p>
        </FadeIn>

        {/* Conteúdo extra de cabeçalho (badges de stack, métricas, etc.) */}
        {headerExtra && (
          <FadeIn delay={0.6}>
            <div className="mt-6">{headerExtra}</div>
          </FadeIn>
        )}
      </section>

      {/* ── BUSCA ── */}
      <section className="mb-12 max-w-2xl mx-auto">
        <FadeIn direction="left" delay={0.4}>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
              🔍
            </div>
            <input
              type="text"
              placeholder={`Buscar em ${category}... (ex: ${projects[0]?.title ?? "projeto"})`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={handleBlur}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-yellow-500/10 focus:border-yellow-400/50 focus:bg-zinc-900 outline-none transition-all duration-300 shadow-2xl"
            />

            {/* Dropdown de sugestões */}
            {showDropdown && search && filteredProjects.length > 0 && (
              <div className="absolute w-full mt-2 bg-zinc-900 border border-yellow-500/10 rounded-lg max-h-48 overflow-auto z-10 shadow-xl">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => {
                      setSearch(p.title);
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer text-sm transition"
                  >
                    {p.title}
                  </div>
                ))}
              </div>
            )}

            {/* Sem resultados */}
            {showDropdown && search && filteredProjects.length === 0 && (
              <div className="absolute w-full mt-2 bg-zinc-900 border border-yellow-500/10 rounded-lg z-10 shadow-xl px-4 py-3 text-sm text-gray-500">
                Nenhum projeto encontrado.
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* ── GRID DE PROJETOS ── */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.15}>
            <div className="relative group">
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />

              {/* Botão de like (sempre presente) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(project.id);
                }}
                className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                  liked[project.id]
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-black/40 border-yellow-500/20 text-gray-400 hover:border-yellow-400/50"
                }`}
              >
                {liked[project.id] ? "❤️" : "🤍"}{" "}
                {liked[project.id] ? project.likes + 1 : project.likes}
              </button>

              {renderCardExtra && (
                <div className="mt-3">
                  {renderCardExtra(project)}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </section>

      {/*
       * Secção extra opcional — exclusiva de cada categoria.
       * Renderiza antes do bloco "Explorar Outras Áreas".
       * Ex: tabela de endpoints no /backend, divisão front/back no /fullstack.
       */}
      {sectionExtra && (
        <section className="mt-20">
          {sectionExtra}
        </section>
      )}

      {/* ── EXPLORAR OUTRAS ÁREAS ── */}
      {relatedCategories.length > 0 && (
        <section className="mt-20 border-t border-yellow-500/10 pt-10">
          <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs mb-10">
            Explorar Outras Áreas
          </h3>
          <FadeIn direction="left">
            <div
              className={`grid gap-6 max-w-4xl mx-auto ${
                relatedCategories.length === 1
                  ? "md:grid-cols-1"
                  : relatedCategories.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
              }`}
            >
              {relatedCategories.map((cat) => (
                <CategoryCard key={cat.title} title={cat.title} link={cat.link} />
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* ── FEEDBACK ── */}
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-black/40 border border-yellow-500/10 rounded-lg mb-4 outline-none focus:border-yellow-400/50 transition-all resize-none text-white placeholder-gray-600"
              rows="3"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-lg transition-all cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-gray-600 hover:text-yellow-400/50"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  // Futuramente: POST /api/feedback
                  setComment("");
                  setRating(0);
                }}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition cursor-pointer disabled:opacity-40"
                disabled={!comment.trim() || rating === 0}
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CONVITE / CTA ── */}
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

      {/* ── MODAL ── */}
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