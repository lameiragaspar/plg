"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

const ALL_PROJECTS = getAllProjects();
const CATEGORIES   = getCategories();

const projects          = ALL_PROJECTS.filter((p) => p.type === "frontend");
const relatedCategories = CATEGORIES.filter((c) => c.key !== "frontend");

// ── Página ─────────────────────────────────────────────────────────────────
// showTechFilter activa a Tech Filter Bar no cabeçalho.
// O layout deriva as techs e contagens directamente dos `projects`.
export default function FrontendProjectsPage() {
  return (
    <ProjectsLayout
      category="Frontend"
      description="Interfaces modernas, animações e experiências focadas no utilizador. Foco total em"
      tagline="performance e acessibilidade."
      accentClass="text-yellow-400"
      projects={projects}
      relatedCategories={relatedCategories}
      showTechFilter={true}
    />
  );
}