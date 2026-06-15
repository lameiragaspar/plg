import ProjectsLayout from "@/components/ProjectsLayout";
import ProjectsBackPage from "@/components/ProjectsBackPage";
import {fetchProjectsByType, fetchAllProjects, getCategories } from "@/lib/Projects";


// ── Página ─────────────────────────────────────────────────────────────────
export default async function BackendProjectsPage() {
  let projects = [];
  let projectsBackend = [];
  let relatedCategories = [];
  try {
    projectsBackend = await fetchProjectsByType("backend");
    projects = await fetchAllProjects();
    relatedCategories = getCategories();
    if(projects.length > 0) {
      relatedCategories = relatedCategories.filter((c) => c.key !== "backend");
    }
  }catch (err) {
    console.error("[BackendProjectsPage] Erro ao buscar projetos:", err);
  }
  return (
    <ProjectsBackPage
      projects={projects}
      projectsBackend={projectsBackend}
      relatedCategories={relatedCategories}
    />
  );
}