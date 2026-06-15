import ProjectsFrontPage from "@/components/ProjectsFrontPage";
import {fetchProjectsByType, fetchAllProjects, getCategories } from "@/lib/Projects";


// ── Página ─────────────────────────────────────────────────────────────────
// showTechFilter={true} activa a TechFilterBar dentro de ProjectsLayout.
// Nenhum componente local necessário — o filtro é auto-contido no layout.
export default async function FrontendProjectsPage() {
  let projects = [];
  let projectsFrontend = [];
  let relatedCategories = [];
  try {
    projectsFrontend = await fetchProjectsByType("frontend");
    projects = await fetchAllProjects();
    relatedCategories = getCategories();
    //console.log("Frontend projects:", projects);
    if (projects.length > 0) {
      relatedCategories = relatedCategories.filter((c) => c.key !== "frontend");
    }
  } catch (err) {
    console.error("[FrontendProjectsPage] Erro ao buscar projetos:", err);
  }
  return (
    <ProjectsFrontPage
      projects={projects}
      projectsFrontend={projectsFrontend}
      relatedCategories={relatedCategories}
    />
  );
}