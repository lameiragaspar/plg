"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import BigCategoryCard from "@/components/BigCategoryCard";
import { getCategories } from "@/lib/Projects";
import AvisoLikeBrowser from "@/components/AvisoLikeBrowser";

import { useLikes } from "@/hooks/Uselikes";
// ── Toast de feedback ─────────────────────────────────────────────────────
function Toast({ state }) {
  if (state === "idle" || state === "loading") return null;

  const config = {
    success: {
      icon: "✓",
      message: "Feedback enviado — obrigado!",
      classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
    },
    error: {
      icon: "✕",
      message: "Não foi possível enviar. Tenta novamente.",
      classes: "border-red-400/40 bg-red-400/10 text-red-400",
    },
  }[state];

  if (!config) return null;

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: 8,  scale: 0.97  }}
      transition={{ duration: 0.25 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-sm whitespace-nowrap ${config.classes}`}
    >
      <span className="text-base">{config.icon}</span>
      {config.message}
    </motion.div>
  );
}
// ── Tech Filter Bar ────────────────────────────────────────────────────────
// Renderizado apenas em /frontend (showTechFilter={true}).
// Isola estado e lógica — ProjectsLayout só expõe a prop booleana.
function TechFilterBar({ techs, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8">
      <button
        onClick={() => onSelect(null)}
        className={`text-xs px-3 py-1.5 rounded-full border transition duration-200 cursor-pointer ${
          !active
            ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
            : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
        }`}
      >
        Todos
      </button>
      {techs.map((tech) => (
        <button
          key={tech}
          onClick={() => onSelect(active === tech ? null : tech)}
          className={`text-xs px-3 py-1.5 rounded-full border transition duration-200 cursor-pointer ${
            active === tech
              ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
              : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
          }`}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}

// ── CTA por categoria ──────────────────────────────────────────────────────
const CTA_CONFIG = {
  Frontend:{ 
    heading: "Tens uma ideia de interface?",
    sub: "Transformo designs e conceitos em interfaces modernas, rápidas e acessíveis.", 
    cta: "Falar sobre o projecto"
  },
  Backend:{
    heading: "Precisas de uma API sólida?",    
    sub: "Construo sistemas robustos, seguros e preparados para escalar.",               
    cta: "Discutir a arquitectura"  
  },
  Fullstack:{
    heading: "Queres um produto completo?",    
    sub: "Do design ao banco de dados — entrego soluções de ponta a ponta.",             
    cta: "Arrancar o projecto"      
  },
  default:{
    heading: "Vamos tirar essa ideia do papel?", 
    sub: "Disponível para colaborar em produtos digitais modernos.",                   
    cta: "Entrar em contacto"
  },
};

// ── Feedback por categoria ─────────────────────────────────────────────────
const FEEDBACK_CONFIG = {
  Frontend: {
    heading: "O design funcionou?",         
    sub: "A tua opinião sobre usabilidade e estética ajuda a melhorar cada interface.", 
    placeholder: "O layout está intuitivo? A navegação faz sentido? Diz-me tudo..."       
  },
  Backend: {
    heading: "A documentação está clara?",  
    sub: "Feedback sobre clareza das APIs e organização do código.",                    
    placeholder: "Os endpoints fazem sentido? Faltou alguma rota? Conta-me..."            
  },
  Fullstack: { 
    heading: "A arquitectura faz sentido?", 
    sub: "A tua visão sobre a integração front-back ajuda a construir produtos melhores.", 
    placeholder: "A stack escolhida faz sentido para o problema? O que melhorarias?" 
  },
  default: { 
    heading: "Feedback",                    
    sub: "A tua opinião ajuda a evoluir o código.",                                     
    placeholder: "Deixa o teu comentário..."                                              
  },
};

// ── Layout principal ───────────────────────────────────────────────────────
export default function ProjectsLayout({
  category,
  description,
  projects: initialProjects = [],
  projectsByType = [],
  relatedCategories = [],
  accentClass    = "text-yellow-400",
  tagline        = "",
  headerExtra    = null,
  renderModalExtra = null,
  sectionExtra   = null,
  showTechFilter = false,
}) {
  const CATEGORIES = relatedCategories.length > 0 ? relatedCategories : getCategories();

  const [projects, setProjects] = useState(initialProjects);
  const [projectsByTypeState, setProjectsByTypeState] = useState(projectsByType);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch]                   = useState("");
  const [showDropdown, setShowDropdown]       = useState(false);

  // useLikes só sabe falar com UM setState. Como esta página mantém duas
  // listas separadas (projects = total da categoria, projectsByTypeState =
  // lista filtrada exibida no grid), aplicamos o mesmo updater nas duas para
  // que o like/unlike apareça imediatamente no grid em vez de só após refresh.
  const setProjetosEmAmbasAsListas = useCallback((updater) => {
    setProjects(updater);
    setProjectsByTypeState(updater);
  }, []);

  const { liked, toggleLike, mostrarAviso, fecharAviso } = useLikes(setProjetosEmAmbasAsListas);
  const [rating, setRating]                   = useState(0);
  const [comment, setComment]                 = useState("");

  // — Estado interno do filtro por tech (só activo quando showTechFilter=true) —
  const [activeTech, setActiveTech] = useState(null);
  const [submitState, setSubmitState] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [mentionedProject, setMentionedProject] = useState(null); // projecto mencionado no feedback (opcional)

  const fbCfg  = FEEDBACK_CONFIG[category] ?? FEEDBACK_CONFIG.default;
  const ctaCfg = CTA_CONFIG[category] ?? CTA_CONFIG.default;

  const handleFeedbackSubmit = async () => {
    if (!comment.trim() || rating === 0) return;
    setSubmitState("loading");
    try {
      // Quando o backend estiver pronto, esta rota já recebe tudo o que precisa:
      // source (página de origem), rating, comment e timestamp.
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page:       category,                   // "Frontend" | "Backend" | "Fullstack"
          rating,
          comment:    comment.trim(),
          project_id: mentionedProject ?? null,   // opcional
          timestamp:  new Date().toISOString(),
        }),
      });
      setSubmitState("success");
      setComment("");
      setRating(0);
      setMentionedProject(null);
    } catch {
      setSubmitState("error");
    } finally {
      setTimeout(() => setSubmitState("idle"), 3500);
    }
  };

  // Todas as techs únicas dos projectos desta categoria, ordenadas
  const allTechs = useMemo(() => {
    const set = new Set(projectsByTypeState.flatMap((p) => p.tech ?? []));
    return [...set].sort();
  }, [projectsByTypeState]);

  // Filtragem composta: texto de busca + tech seleccionada
  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = projectsByTypeState;
    if (q) result = result.filter((p) => p.title.toLowerCase().includes(q));
    if (activeTech) result = result.filter((p) => p.tech?.includes(activeTech));
    return result;
  }, [search, projectsByTypeState, activeTech]);

  const openProject = async (project) => {
    setSelectedProject(project);
    
    // Regista view em background (sem bloquear a UI)
    fetch(`/api/projects/${project.id}/view`, { method: "POST" }).catch(() => {});
  };
  const countByType = useMemo(() =>
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.key] = projects.filter((p) => p.type === cat.key).length;
      return acc;
    }, {}),
  [projects, CATEGORIES]);

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

        {/* Slot para UI extra por página (TerminalStatsBar, etc.) */}
        {headerExtra && (
          <FadeIn delay={0.6}>
            <div className="mt-8">{headerExtra}</div>
          </FadeIn>
        )}

        {/* Tech Filter — só aparece em /frontend */}
        {showTechFilter && allTechs.length > 0 && (
          <FadeIn delay={0.7}>
            <TechFilterBar
              techs={allTechs}
              active={activeTech}
              onSelect={setActiveTech}
            />
          </FadeIn>
        )}
      </section>

      {/* BUSCA */}
      <section className="mb-12 max-w-2xl mx-auto">
        <FadeIn direction="left" delay={0.4}>
          <div className="relative min-w-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Buscar em ${category}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="w-full min-w-0 pl-11 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-yellow-500/10 focus:border-yellow-400/50 focus:bg-zinc-900 outline-none transition-all duration-300"
            />
            {/* Botão limpar */}
            {search && (
              <button
                onMouseDown={() => { setSearch(""); setShowDropdown(false); }}
                className="absolute inset-y-0 right-4 flex items-center text-gray-600 hover:text-gray-300 transition cursor-pointer"
                aria-label="Limpar busca"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            )}
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

      {/* GRID DE PROJETOS */}
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
                    onClick={() => openProject(project)}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(project.id); }}
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
                  onClick={() => setActiveTech(null)}
                  className="mt-3 text-xs text-yellow-400/60 hover:text-yellow-400 transition cursor-pointer underline"
                >
                  Ver todos
                </button>
              )}
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* SECÇÃO EXTRA (ex: ArchDiagram em /fullstack) */}
      {sectionExtra && <section className="mt-20">{sectionExtra}</section>}

      {/* EXPLORAR OUTRAS ÁREAS */}
      {relatedCategories.length > 0 && (
        <section className="mt-20 border-t border-yellow-500/10 pt-10">
          <h3 className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs mb-10">
            Explorar Outras Áreas
          </h3>
          <FadeIn direction="left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            <h2 className="text-3xl font-bold mb-2">{fbCfg.heading}</h2>
            <p className="text-gray-500">{fbCfg.sub}</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-yellow-500/10">

            {/* Menção opcional a um projecto */}
            {projectsByTypeState.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  Mencionar um projecto (opcional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {projectsByTypeState.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setMentionedProject(mentionedProject === p.id ? null : p.id)}
                      disabled={submitState === "loading" || submitState === "success"}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer disabled:pointer-events-none ${
                        mentionedProject === p.id
                          ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                          : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
                      }`}
                    >
                      {mentionedProject === p.id ? "✓ " : ""}{p.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              placeholder={fbCfg.placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitState === "loading" || submitState === "success"}
              className="w-full p-4 bg-black/40 border border-yellow-500/10 rounded-lg mb-4 outline-none focus:border-yellow-400/50 transition-all resize-none text-white placeholder-gray-600 disabled:opacity-50"
              rows="3"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    disabled={submitState === "loading" || submitState === "success"}
                    className={`text-2xl sm:text-lg transition-all cursor-pointer disabled:pointer-events-none ${
                      star <= rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400/50"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                onClick={handleFeedbackSubmit}
                disabled={!comment.trim() || rating === 0 || submitState === "loading" || submitState === "success"}
                className="w-full sm:w-auto px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-w-[148px]"
              >
                {submitState === "loading" && "A enviar..."}
                {submitState === "success" && "✓ Obrigado!"}
                {submitState === "error"   && "Erro — tenta de novo"}
                {submitState === "idle"    && "Enviar avaliação"}
              </button>
            </div>
            {submitState === "error" && (
              <p className="text-red-400 text-xs mt-3 text-right">
                Não foi possível enviar. Tenta novamente.
              </p>
            )}
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center mt-20 border-t border-yellow-500/10">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
            {ctaCfg.heading}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">{ctaCfg.sub}</p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <Link
            href="/contact"
            className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition inline-block cursor-pointer"
          >
            {ctaCfg.cta}
          </Link>
        </FadeIn>
      </section>

      {/* TOAST — feedback de envio */}
      <AnimatePresence mode="wait">
        <Toast state={submitState} />
      </AnimatePresence>

      {/* MODAL — único componente para todas as categorias */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            modalExtra={renderModalExtra ? renderModalExtra(selectedProject) : null}
          />
        )}
      </AnimatePresence>
      <AvisoLikeBrowser visivel={mostrarAviso} onFechar={fecharAviso} />
    </main>
  );
}