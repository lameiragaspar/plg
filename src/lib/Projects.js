/**
 * lib/Projects.js — SERVER ONLY
 *
 * ⚠️  Nunca importar em ficheiros "use client" ou em componentes client.
 *    O pacote "server-only" garante um erro em build-time se isso acontecer.
 *
 * Para dados estáticos (categorias) em Client Components, usar:
 *    import { getCategories } from "@/lib/categories"
 */
import "server-only";

import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { getCategories } from "@/lib/constants/categories";

// Re-exporta getCategories para não quebrar imports existentes nos Server Components
export { getCategories };

// =============================================================================
// Query principal
// =============================================================================
async function queryProjects(filters = {}) {
  let query = supabase
    .from("projects")
    .select(
      `
      id,
      slug,
      type,
      title,
      description,
      motivation,
      learnings,
      image_url,
      github_url,
      deploy_url,
      featured,
      likes_count,
      views_count,
      project_technologies (
        role,
        sort_order,
        technologies ( name )
      ),
      endpoints (
        method,
        path,
        description,
        sort_order
      )
    `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.featured) query = query.eq("featured", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapProject);
}

// =============================================================================
// Mapper
// =============================================================================
function mapProject(row) {
  const allTechs = (row.project_technologies ?? [])
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    id:          row.id,
    slug:        row.slug,
    type:        row.type,
    title:       row.title,
    description: row.description,
    motivation:  row.motivation ?? null,
    learnings:   row.learnings  ?? null,
    image:       row.image_url  ?? null,
    github:      row.github_url ?? null,
    deploy:      row.deploy_url ?? null,
    featured:    row.featured,
    likes:       row.likes_count,
    views:       row.views_count,
    tech: allTechs.map((pt) => pt.technologies.name),
    frontTech: allTechs
      .filter((pt) => pt.role === "frontend")
      .map((pt) => pt.technologies.name),
    backTech: allTechs
      .filter((pt) => pt.role === "backend")
      .map((pt) => pt.technologies.name),
    endpoints: (row.endpoints ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ method, path, description }) => ({ method, path, description })),
  };
}

// =============================================================================
// API pública
// =============================================================================
export async function fetchAllProjects() {
  return queryProjects();
}

export async function fetchProjectsByType(type) {
  return queryProjects({ type });
}

export async function fetchFeaturedProjects() {
  return queryProjects({ featured: true });
}

export async function fetchAboutStats() {
  const { count: totalProjectos, error: erroProjectos } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  if (erroProjectos) throw erroProjectos;

  const { data: techsEmUso, error: erroTechs } = await supabase
    .from("project_technologies")
    .select("tech_id, projects!inner(status)")
    .eq("projects.status", "published");

  if (erroTechs) throw erroTechs;

  const techsUnicas = new Set(
    (techsEmUso ?? []).map((relacao) => relacao.tech_id)
  );

  return {
    projects: totalProjectos ?? 0,
    techs:    techsUnicas.size,
  };
}

/** @deprecated Usar fetchAllProjects() */
export async function getAllProjects() {
  return fetchAllProjects();
}