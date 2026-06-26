// app/projects/page.js
import { fetchAllProjects, getCategories } from "@/lib/Projects";
import ProjectsPageClient from "@/components/ProjectsPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projetos & Experimentos",
  description:
    "Frontend, backend e fullstack — cada projeto é um problema resolvido com código limpo e experiência cuidada.",
};

export default async function ProjectsPage() {
  let projects = [];
  try {
    projects = await fetchAllProjects();
  } catch (err) {
    console.error("[ProjectsPage] Erro ao buscar projetos:", err);
  }

  const categories = getCategories();

  return (
    <ProjectsPageClient
      initialProjects={projects}
      categories={categories}
    />
  );
}