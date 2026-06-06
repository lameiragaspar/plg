"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import BigCategoryCard from "@/components/BigCategoryCard";
import { getAllProjects, getCategories } from "@/lib/Projects";

export default function ProjectsLayout({
  category,
  description,
  projects = [],
  relatedCategories = [],
  accentClass = "text-yellow-400",
  tagline = "",
  headerExtra = null,
  renderModalExtra = null,
  sectionExtra = null,
  // Nova prop: activa a barra de filtro por tecnologia (usado em /frontend)
  showTechFilter = false,
}) {
  const ALL_PROJECTS = getAllProjects();
  const CATEGORIES = relatedCategories.length > 0 ? relatedCategories : getCategories();

  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch]                   = useState("");
  const [showDropdown, setShowDropdown]       = useState(false);
  const [liked, setLiked]                     = useState({});
  const [rating, setRating]                   = useState(0);
  const [comment, setComment]                 = useState("");
  // Estado do filtro por tech — só usado quando showTechFilter=true
  const [activeTech, setActiveTech]           = useState(null);

  // Tecnologias únicas com contagem, ordenadas por frequência
  const availableTechsWithCount = useMemo(() => {
    if (!showTechFilter) return [];
    const map = {};
    projects.forEach((p) => p.tech?.forEach((t) => { map[t] = (map[t] ?? 0) + 1; }));
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [showTechFilter, projects]);

  // Filtro combinado: texto de busca + tech activa
  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = projects;
    if (q) result = result.filter((p) => p.title.toLowerCase().includes(q));
    if (activeTech) result = result.filter((p) => p.tech?.includes(activeTech));
    return result;
  }, [search, activeTech, projects]);

  const toggleLike = (id) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const countByType = useMemo(() =>
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.key] = ALL_PROJECTS.filter((p) => p.type === cat.key).length;
      return acc;
    }, {}),
  []);

  return (
    <main className="min-h-screen text-white px-4 sm:px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">

      {/* BREADCRUMB */}
      <nav className="text-center mb-8 text-sm font-medium">
        <FadeIn>
          <span className="font-mono text-sm mb-2 block uppercase tracking-widest">
            <Link href="/projects" className="text-gray-500 hover:text-yellow-400 transition cursor-pointer">
              Projetos
            </Link>
            <span className={accentClass}> / {category}</span>
          </span>
        </FadeIn>
      </nav>

      {/* CABEÇALHO */}
      <section className="text-center mb-16">
        <FadeIn delay={0.2}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{category}</h1>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="text-gray-400 max-w-xl mx-auto px-2">
            {description}
            {tagline && <span className="text-white"> {tagline}</span>}
          </p>
        </FadeIn>

        {/* Extra visual por categoria — TerminalStats (backend) ou ArchDiagram (fullstack) */}
        {headerExtra && (
          <FadeIn delay={0.6}>
            <div className="mt-8">{headerExtra}</div>
          </FadeIn>
        )}

        {/* Tech Filter Bar — exclusivo de /frontend */}
        {showTechFilter && availableTechsWithCount.length > 0 && (
          <FadeIn delay={0.6}>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-3">
                Filtrar por tecnologia
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {/* Pill "Todos" */}
                <button
                  onClick={() => setActiveTech(null)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    !activeTech
                      ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                      : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
                  }`}
                >
                  Todos
                  <span className={`ml-1.5 text-[10px] ${!activeTech ? "opacity-60" : "opacity-40"}`}>
                    {projects.length}
                  </span>
                </button>

                {/* Pills por tech */}
                {availableTechsWithCount.map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => setActiveTech(activeTech === name ? null : name)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      activeTech === name
                        ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                        : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
                    }`}
                  >
                    {name}
                    <span className={`ml-1.5 text-[10px] ${activeTech === name ? "opacity-60" : "opacity-40"}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Contador + limpar filtro */}
              <AnimatePresence>
                {activeTech && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-xs text-gray-600"
                  >
                    {filteredProjects.length} projecto{filteredProjects.length !== 1 ? "s" : ""} com{" "}
                    <span className="text-yellow-400">{activeTech}</span>
                    <button
                      onClick={() => setActiveTech(null)}
                      className="ml-2 text-gray-600 hover:text-yellow-400 transition cursor-pointer"
                    >
                      ✕ limpar
                    </button>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        )}
      </section>

      {/* BUSCA */}
      <section className="mb-12 max-w-2xl mx-auto">
        <FadeIn direction="left" delay={0.4}>
          <div className="relative min-w-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
              🔍
            </div>
            <input
              type="text"
              placeholder={`Buscar em ${category}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="w-full min-w-0 pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-yellow-500/10 focus:border-yellow-400/50 focus:bg-zinc-900 outline-none transition-all duration-300 shadow-2xl"
            />
            {showDropdown && search && (
              <div className="absolute w-full mt-2 bg-zinc-900 border border-yellow-500/10 rounded-lg max-h-48 overflow-auto z-10 shadow-xl">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onMouseDown={() => { setSearch(p.title); setShowDropdown(false); }}
                      className="px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer text-sm transition"
                    >
                      {p.title}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Nenhum projeto encontrado.
                  </div>
                )}
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* GRID DE PROJETOS
          1 coluna  → < 640px  (mobile)
          2 colunas → 640–1024px (sm → md)
          3 colunas → > 1024px (lg)
      */}
      <section>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTech ?? "all"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.07 }}
                  className="relative group min-w-0"
                >
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(project.id); }}
                    className={`absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                      liked[project.id]
                        ? "bg-yellow-400 text-black border-yellow-400"
                        : "bg-black/40 border-yellow-500/20 text-gray-400 hover:border-yellow-400/50"
                    }`}
                  >
                    {liked[project.id] ? "❤️" : "🤍"}{" "}
                    {liked[project.id] ? project.likes + 1 : project.likes}
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 col-span-full text-center py-16"
              >
                Nenhum projecto encontrado
                {activeTech && <> com <span className="text-yellow-400">{activeTech}</span></>}.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* SECÇÃO EXTRA */}
      {sectionExtra && <section className="mt-20">{sectionExtra}</section>}

      {/* EXPLORAR OUTRAS ÁREAS */}
      {relatedCategories.length > 0 && (
        <section className="mt-20 border-t border-yellow-500/10 pt-10">
          <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs mb-10">
            Explorar Outras Áreas
          </h3>
          <FadeIn direction="left">
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto`}>
              {CATEGORIES.map((cat, i) => (
                <FadeIn key={cat.key} delay={0.1 + i * 0.1}>
                  <BigCategoryCard cat={cat} count={countByType[cat.key] ?? 0} />
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* FEEDBACK */}
      <section className="mt-24 max-w-3xl mx-auto">
        <FadeIn delay={0.2}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Feedback</h2>
            <p className="text-gray-500">A tua opinião ajuda a evoluir o código.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-yellow-500/10">
            <textarea
              placeholder="Deixa o teu comentário..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-black/40 border border-yellow-500/10 rounded-lg mb-4 outline-none focus:border-yellow-400/50 transition-all resize-none text-white placeholder-gray-600"
              rows="3"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl sm:text-lg transition-all cursor-pointer ${
                      star <= rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400/50"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setComment(""); setRating(0); }}
                disabled={!comment.trim() || rating === 0}
                className="w-full sm:w-auto px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center mt-20 border-t border-yellow-500/10">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
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
            modalExtra={renderModalExtra ? renderModalExtra(selectedProject) : null}
          />
        )}
      </AnimatePresence>
    </main>
  );
}