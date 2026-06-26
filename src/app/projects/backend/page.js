// app/projects/backend/page.js
import ProjectsBackPage from "@/components/ProjectsBackPage";
import { fetchProjectsByType, fetchAllProjects, getCategories } from "@/lib/Projects";

export const dynamic = "force-dynamic";

export default async function BackendProjectsPage() {
  let projects = [];
  let projectsBackend = [];
  let relatedCategories = [];
  try {
    [projectsBackend, projects] = await Promise.all([
      fetchProjectsByType("backend"),
      fetchAllProjects(),
    ]);
    relatedCategories = getCategories().filter((c) => c.key !== "backend");
  } catch (err) {
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