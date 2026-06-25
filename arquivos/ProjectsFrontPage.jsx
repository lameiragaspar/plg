"use client";

import ProjectsLayout from "@/components/ProjectsLayout";

//const ALL_PROJECTS = await fetchAllProjects();
//const CATEGORIES = getCategories();

//const projects = ALL_PROJECTS; // apenas os 10 primeiros projetos frontend
//console.log("Frontend projects:", projects);
//const relatedCategories = CATEGORIES.filter((c) => c.key !== "frontend");

// ── Página ─────────────────────────────────────────────────────────────────
// showTechFilter={true} activa a TechFilterBar dentro de ProjectsLayout.
// Nenhum componente local necessário — o filtro é auto-contido no layout.
export default function ProjectsFrontPage({ projects = [], projectsFrontend = [], relatedCategories = [] }) {
  return (
    <ProjectsLayout
      category="Frontend"
      description="Interfaces modernas, animações e experiências focadas no utilizador. Foco total em"
      tagline="performance e acessibilidade."
      accentClass="text-yellow-400"
      projects={projects}
      projectsByType={projectsFrontend}
      relatedCategories={relatedCategories}
      showTechFilter={true}
    />
  );
}