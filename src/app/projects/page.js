// app/projects/page.js
// ─────────────────────────────────────────────────────────────────────────────
// SERVER COMPONENT — sem "use client".
//
// Responsabilidade única: buscar os dados no Supabase (pode usar async/await
// livremente) e passar para o Client Component como props serializáveis.
// Nunca importa hooks, event handlers ou browser APIs aqui.
// ─────────────────────────────────────────────────────────────────────────────

import {fetchAllProjects, getCategories } from "@/lib/Projects";
import ProjectsPageClient from "@/components/ProjectsPage";

export const metadata = {
  title: "Projetos & Experimentos | PLG Dev",
  description:
    "Frontend, backend e fullstack — cada projeto é um problema resolvido com código limpo e experiência cuidada.",
};

export default async function ProjectsPage() {
  // O await funciona aqui porque este ficheiro é um Server Component.
  // O resultado é um array simples e serializável — seguro para passar como prop.
  let projects = [];
  try {
    projects = await fetchAllProjects();
  } catch (err) {
    // Em produção não queremos que um erro de DB derrube a página inteira.
    // O Client Component recebe um array vazio e mostra o empty state.
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