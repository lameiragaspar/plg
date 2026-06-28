"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

import ProjectModal from "./projects/ProjectModal";
import AvisoLikeBrowser from "./projects/AvisoLikeBrowser";
import ProjectsBreadcrumb from "./projects/Projectsbreadcrumb";
import ProjectsHeader     from "./projects/ProjectsHeader";
import ProjectsSearch     from "./projects/ProjectSsearch";
import ProjectsGrid       from "./projects/ProjectsGrid";
import ProjectsRelated    from "./projects/ProjectsRelated";
import ProjectsFeedback   from "./projects/ProjectsFeedback";
import ProjectsCTA        from "./projects/ProjectsCTA";
import Toast              from "./projects/Toast";

import { useLikes } from "@/hooks/Uselikes";
import { getCategories} from "@/lib/constants/categories";
import { FEEDBACK_CONFIG, CTA_CONFIG } from "@/lib/constants/projectsLayoutConfig";

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

  const [projects, setProjects]                       = useState(initialProjects);
  const [projectsByTypeState, setProjectsByTypeState] = useState(projectsByType);
  const [selectedProject, setSelectedProject]         = useState(null);
  const [search, setSearch]                           = useState("");
  const [showDropdown, setShowDropdown]               = useState(false);

  // useLikes recebe dois setters separados:
  //   setProjects             → lista geral (todos os projetos da categoria)
  //   setProjectsByTypeState  → lista do grid (só os do tipo desta página)
  //
  // Cada setter opera exclusivamente sobre o seu próprio estado —
  // o React entrega a cada updater o `prev` correcto da sua lista.
  // Isto elimina o bug anterior onde um único wrapper passava o mesmo
  // updater a dois estados distintos, podendo sobrescrever um com o outro.
  const { liked, toggleLike, mostrarAviso, fecharAviso } = useLikes(
    setProjects,
    setProjectsByTypeState
  );

  const [rating, setRating]                   = useState(0);
  const [comment, setComment]                 = useState("");
  const [activeTech, setActiveTech]           = useState(null);
  const [submitState, setSubmitState]         = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [mentionedProject, setMentionedProject] = useState(null);

  const fbCfg  = FEEDBACK_CONFIG[category] ?? FEEDBACK_CONFIG.default;
  const ctaCfg = CTA_CONFIG[category]      ?? CTA_CONFIG.default;

  const handleFeedbackSubmit = async () => {
    if (!comment.trim() || rating === 0) return;
    setSubmitState("loading");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page:       category,
          rating,
          comment:    comment.trim(),
          project_id: mentionedProject ?? null,
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

  const allTechs = useMemo(() => {
    const set = new Set(projectsByTypeState.flatMap((p) => p.tech ?? []));
    return [...set].sort();
  }, [projectsByTypeState]);

  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = projectsByTypeState;
    if (q)          result = result.filter((p) => p.title.toLowerCase().includes(q));
    if (activeTech) result = result.filter((p) => p.tech?.includes(activeTech));
    return result;
  }, [search, projectsByTypeState, activeTech]);

  const openProject = async (project) => {
    setSelectedProject(project);
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

      <ProjectsBreadcrumb category={category} accentClass={accentClass} />

      <ProjectsHeader
        category={category}
        description={description}
        tagline={tagline}
        headerExtra={headerExtra}
        showTechFilter={showTechFilter}
        allTechs={allTechs}
        activeTech={activeTech}
        onTechSelect={setActiveTech}
      />

      <ProjectsSearch
        category={category}
        search={search}
        onSearch={setSearch}
        showDropdown={showDropdown}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onClear={() => { setSearch(""); setShowDropdown(false); }}
        onSelectSuggestion={(title) => { setSearch(title); setShowDropdown(false); }}
        filteredProjects={filteredProjects}
      />

      {/* PATCH — category passado para o grid para seleccionar a animação correcta */}
      <ProjectsGrid
        filteredProjects={filteredProjects}
        activeTech={activeTech}
        search={search}
        liked={liked}
        onOpenProject={openProject}
        onToggleLike={toggleLike}
        onClearTech={() => setActiveTech(null)}
        category={category}
      />

      {/* SECÇÃO EXTRA (ex: ArchDiagram em /fullstack) */}
      {sectionExtra && <section className="mt-20">{sectionExtra}</section>}

      {/* EXPLORAR OUTRAS ÁREAS */}
      {relatedCategories.length > 0 && (
        <ProjectsRelated categories={CATEGORIES} countByType={countByType} />
      )}

      <ProjectsFeedback
        fbCfg={fbCfg}
        projectsByTypeState={projectsByTypeState}
        mentionedProject={mentionedProject}
        onMentionProject={setMentionedProject}
        comment={comment}
        onCommentChange={setComment}
        rating={rating}
        onRatingChange={setRating}
        onSubmit={handleFeedbackSubmit}
        submitState={submitState}
      />

      <ProjectsCTA ctaCfg={ctaCfg} />

      {/* TOAST — feedback de envio
          A condição de visibilidade está AQUI, não dentro do Toast.
          Assim o AnimatePresence detecta a saída do filho e executa
          a animação `exit` antes de o remover do DOM.
          "idle" e "loading" não têm config — o Toast não é montado. */}
      <AnimatePresence mode="wait">
        {(submitState === "success" || submitState === "error") && (
          <Toast estadoEnvio={submitState} />
        )}
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