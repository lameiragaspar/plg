"use client";

import ProjectsLayout from "@/components/ProjectsLayout";
import { getAllProjects, getCategories } from "@/lib/Projects";

// Dados dos projetos
// Quando tiver backend, isto vem de uma fetch/API.
const ALL_PROJECTS = getAllProjects();
const CATEGORIES = getCategories();

const relatedCategories = CATEGORIES.filter((c) => c.key !== "frontend");
const projects = ALL_PROJECTS.filter((p) => p.type === "frontend");


//Página
export default function FrontendProjectsPage() {
  return (
    <ProjectsLayout
      category="Frontend"
      description="Interfaces modernas, animações e experiências focadas no utilizador. Foco total em"
      tagline="performance e acessibilidade."
      projects={projects}
      relatedCategories={relatedCategories}
    />
  );
}