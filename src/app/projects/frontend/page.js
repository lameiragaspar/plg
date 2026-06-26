// app/projects/frontend/page.js
import ProjectsFrontPage from "@/components/ProjectsFrontPage";
import { fetchProjectsByType, fetchAllProjects, getCategories } from "@/lib/Projects";

export const dynamic = "force-dynamic";

export default async function FrontendProjectsPage() {
  let projects = [];
  let projectsFrontend = [];
  let relatedCategories = [];
  try {
    [projectsFrontend, projects] = await Promise.all([
      fetchProjectsByType("frontend"),
      fetchAllProjects(),
    ]);
    relatedCategories = getCategories().filter((c) => c.key !== "frontend");
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