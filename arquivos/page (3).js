import ProjectsFullPage from "@/components/ProjectsFullPage";
import { fetchProjectsByType, fetchAllProjects, getCategories } from "@/lib/Projects";

// ── Página ─────────────────────────────────────────────────────────────────
export default async function FullstackProjectsPage() {
  let projects = [];
  let projectsFullstack = [];
  let relatedCategories = [];
  try {
    projectsFullstack = await fetchProjectsByType("fullstack");
    projects = await fetchAllProjects();
    relatedCategories = getCategories();
    if(projects.length > 0) {
      relatedCategories = relatedCategories.filter((c) => c.key !== "fullstack");
    }
  }catch (err) {
    console.error("[FullstackProjectsPage] Erro ao buscar projetos:", err);
  }
  return (
    <ProjectsFullPage
      projects={projects}
      projectsFullstack={projectsFullstack}
      relatedCategories={relatedCategories}
    />
  );
}