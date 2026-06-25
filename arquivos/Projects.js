/**
 * lib/Projects.js
 *
 * Fonte de dados dos projetos — Supabase em vez de dados estáticos.
 *
 * Duas camadas:
 *   fetchProjects()    → async, chama o Supabase (usar em Server Components ou API routes)
 *   getCategories()    → síncrona, dados estáticos (categorias não mudam)
 *
 * As páginas que eram "use client" e chamavam getAllProjects() no topo
 * passam a receber os projetos via prop (vindos do Server Component pai)
 * ou via a API Route /api/projects.
 */

import { supabase } from "@/lib/supabase";

// =============================================================================
// Tipos de retorno (equivalente ao shape antigo, compatível com os componentes)
// =============================================================================
//
// {
//   id:          string  (UUID)
//   slug:        string
//   type:        "frontend" | "backend" | "fullstack"
//   title:       string
//   description: string
//   motivation:  string | null
//   learnings:   string | null
//   image:       string | null   ← image_url mapeado para "image" (compatível)
//   github:      string | null   ← github_url mapeado para "github"
//   deploy:      string | null   ← deploy_url mapeado para "deploy"
//   featured:    boolean
//   likes:       number          ← likes_count mapeado para "likes"
//   views:       number
//   tech:        string[]        ← nomes das tecnologias ordenados
//   frontTech:   string[]        ← techs com role "frontend"
//   backTech:    string[]        ← techs com role "backend"
//   endpoints:   { method, path, description }[]
// }

// =============================================================================
// Query principal — projetos publicados com tecnologias e endpoints
// =============================================================================
async function queryProjects(filters = {}) {
  let query = supabase
    .from("projects")
    .select(`
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
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.featured) query = query.eq("featured", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapProject);
}

// =============================================================================
// Mapper — converte o shape do Supabase para o shape que os componentes esperam
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

    // tech[] — todos os nomes, por sort_order (compatível com ProjectCard, ProjectModal)
    tech: allTechs.map((pt) => pt.technologies.name),

    // frontTech / backTech — split para SplitStack no modal fullstack
    frontTech: allTechs
      .filter((pt) => pt.role === "frontend")
      .map((pt) => pt.technologies.name),
    backTech: allTechs
      .filter((pt) => pt.role === "backend")
      .map((pt) => pt.technologies.name),

    // endpoints — ordenados, compatível com EndpointViewer
    endpoints: (row.endpoints ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(({ method, path, description }) => ({ method, path, description })),
  };
}

// =============================================================================
// API pública
// =============================================================================

/**
 * Todos os projetos publicados.
 * Usar em Server Components: const projects = await fetchAllProjects()
 */
export async function fetchAllProjects() {
  return queryProjects();
}

/**
 * Projetos por tipo.
 * Usar nas páginas /frontend, /backend, /fullstack.
 */
export async function fetchProjectsByType(type) {
  return queryProjects({ type });
}

/**
 * Apenas projetos em destaque (featured = true).
 * Útil para a home page se quiseres uma secção "Featured".
 */
export async function fetchFeaturedProjects() {
  return queryProjects({ featured: true });
}

/**
 * Categorias — dados estáticos, não mudam com frequência.
 * Mantida síncrona: não precisa de DB.
 */
export function getCategories() {
  return [
    {
      key:         "frontend",
      title:       "Frontend",
      link:        "/projects/frontend",
      description: "Interfaces, animações e experiências visuais.",
      icon:        "🖥",
      accent:      "yellow",
      accentClass: "text-yellow-400",
      borderClass: "border-yellow-400/30",
      hoverBg:     "hover:bg-yellow-400/5",
    },
    {
      key:         "backend",
      title:       "Backend",
      link:        "/projects/backend",
      description: "APIs, lógica de negócio e infraestrutura.",
      icon:        "⚙️",
      accent:      "blue",
      accentClass: "text-blue-400",
      borderClass: "border-blue-400/30",
      hoverBg:     "hover:bg-blue-400/5",
    },
    {
      key:         "fullstack",
      title:       "Fullstack",
      link:        "/projects/fullstack",
      description: "Produtos completos do front ao banco de dados.",
      icon:        "⚡",
      accent:      "emerald",
      accentClass: "text-emerald-400",
      borderClass: "border-emerald-400/30",
      hoverBg:     "hover:bg-emerald-400/5",
    },
  ];
}

/**
 * Estatísticas reais para a página /about.
 * Conta projectos publicados e tecnologias únicas no DB.
 */

export async function fetchAboutStats() {
  // ── Contagem de projectos publicados ────────────────────────────────────
  const { count: totalProjectos, error: erroProjectos } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  if (erroProjectos) throw erroProjectos;

  // ── Techs únicas em uso em projectos publicados ─────────────────────────
  // INNER JOIN garante que só contamos techs de projectos com status=published.
  // A tabela `technologies` pode ter entradas que não estão ligadas a nenhum
  // projecto publicado — essa lógica antiga contava essas entradas "fantasma".
  const { data: techsEmUso, error: erroTechs } = await supabase
    .from("project_technologies")
    .select("tech_id, projects!inner(status)")
    .eq("projects.status", "published");

  if (erroTechs) throw erroTechs;

  // Set elimina duplicados: o mesmo tech_id aparece várias vezes se for
  // usado em mais de um projecto, mas queremos contar cada tech uma vez.
  const techsUnicas = new Set(
    (techsEmUso ?? []).map((relacao) => relacao.tech_id)
  );

  return {
    projects: totalProjectos ?? 0,
    techs:    techsUnicas.size,
  };
}

/**
 * getAllProjects — mantida para compatibilidade temporária durante migração.
 * @deprecated  Usar fetchAllProjects() (async) nas novas páginas.
 */
export async function getAllProjects() {
  return fetchAllProjects();
}