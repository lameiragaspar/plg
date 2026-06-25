// app/page.js  — Server Component
// Substitui o antigo wrapper (app/page.js → Home/page.js).
// Busca os dados no servidor e passa-os ao Client Component.
import { fetchAllProjects, getCategories } from "@/lib/Projects";
import HomePageClient from "@/components/HomePageClient";

export default async function Home() {
  let projects = [];
  try {
    projects = await fetchAllProjects();
    //console.log("[Home] Projetos buscados com sucesso:", projects);
  } catch (err) {
    // Em produção, um erro de DB não derruba a página — mostra empty state.
    console.error("[Home] Erro ao buscar projetos:", err);
  }

  const categories = getCategories();

  return (
    <HomePageClient
      initialProjects={projects}
      categories={categories}
    />
  );
}