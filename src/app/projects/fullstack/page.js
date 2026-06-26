// app/projects/fullstack/page.js
import ProjectsFullPage from "@/components/ProjectsFullPage";
import { fetchProjectsByType, fetchAllProjects, getCategories } from "@/lib/Projects";

export const dynamic = "force-dynamic";

export default async function FullstackProjectsPage() {
  let projects = [];
  let projectsFullstack = [];
  let relatedCategories = [];
  try {
    [projectsFullstack, projects] = await Promise.all([
      fetchProjectsByType("fullstack"),
      fetchAllProjects(),
    ]);
    relatedCategories = getCategories().filter((c) => c.key !== "fullstack");
  } catch (err) {
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