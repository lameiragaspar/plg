"use server";

// lib/admin/projects.js — Server Actions de projectos (CRUD)
// Protegidas por requireAdmin(). Escritas via service role (supabaseAdmin).
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/log";

const VALID_TYPES = ["frontend", "backend", "fullstack"];
const VALID_STATUS = ["draft", "published", "archived"];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function slugify(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Revalida todas as páginas públicas que dependem de projectos.
function revalidatePublicProjectPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/projects");
  revalidatePath("/projects/frontend");
  revalidatePath("/projects/backend");
  revalidatePath("/projects/fullstack");
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

// Extrai e valida o payload do FormData.
function parseProjectForm(formData) {
  const title = (formData.get("title") || "").toString().trim();
  const slugRaw = (formData.get("slug") || "").toString().trim();
  const type = (formData.get("type") || "").toString();
  const status = (formData.get("status") || "draft").toString();

  if (!title) return { error: "O título é obrigatório." };
  if (!VALID_TYPES.includes(type)) return { error: "Tipo inválido." };
  if (!VALID_STATUS.includes(status)) return { error: "Estado inválido." };

  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  if (!slug) return { error: "Slug inválido." };

  // Tecnologias: cada item vem como "techId|role" (role: frontend|backend|main)
  const techEntries = formData.getAll("technologies").map((v) => v.toString());
  const technologies = techEntries
    .map((entry, i) => {
      const [tech_id, role = "main"] = entry.split("|");
      return tech_id ? { tech_id, role, sort_order: i + 1 } : null;
    })
    .filter(Boolean);

  // Endpoints (opcional, só relevante p/ backend/fullstack): JSON serializado.
  let endpoints = [];
  const endpointsRaw = (formData.get("endpoints") || "").toString().trim();
  if (endpointsRaw) {
    try {
      const parsed = JSON.parse(endpointsRaw);
      if (Array.isArray(parsed)) {
        endpoints = parsed
          .filter((e) => e && e.method && e.path)
          .map((e, i) => ({
            method: e.method,
            path: e.path.toString().trim(),
            description: (e.description || "").toString().trim() || null,
            sort_order: i + 1,
          }));
      }
    } catch {
      return { error: "Endpoints em formato inválido." };
    }
  }

  return {
    data: {
      slug,
      title,
      type,
      status,
      description: (formData.get("description") || "").toString().trim() || null,
      motivation: (formData.get("motivation") || "").toString().trim() || null,
      learnings: (formData.get("learnings") || "").toString().trim() || null,
      image_url: (formData.get("image_url") || "").toString().trim() || null,
      github_url: (formData.get("github_url") || "").toString().trim() || null,
      deploy_url: (formData.get("deploy_url") || "").toString().trim() || null,
      featured: formData.get("featured") === "on" || formData.get("featured") === "true",
      technologies,
      endpoints,
    },
  };
}

async function syncRelations(projectId, technologies, endpoints) {
  // Substitui as relações por completo (estratégia delete+insert — simples e
  // suficiente para a escala deste portfólio).
  await supabaseAdmin.from("project_technologies").delete().eq("project_id", projectId);
  await supabaseAdmin.from("endpoints").delete().eq("project_id", projectId);

  if (technologies.length) {
    const rows = technologies.map((t) => ({ ...t, project_id: projectId }));
    const { error } = await supabaseAdmin.from("project_technologies").insert(rows);
    if (error) throw error;
  }

  if (endpoints.length) {
    const rows = endpoints.map((e) => ({ ...e, project_id: projectId }));
    const { error } = await supabaseAdmin.from("endpoints").insert(rows);
    if (error) throw error;
  }
}

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
export async function createProject(_prevState, formData) {
  const user = await requireAdmin();
  const parsed = parseProjectForm(formData);
  if (parsed.error) return { error: parsed.error };

  const { technologies, endpoints, ...projectData } = parsed.data;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert(projectData)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Já existe um projecto com esse slug." };
    return { error: "Erro ao criar o projecto." };
  }

  try {
    await syncRelations(data.id, technologies, endpoints);
  } catch {
    return { error: "Projecto criado, mas falhou a associação de tecnologias/endpoints." };
  }

  await logActivity({
    adminId: user.id,
    action: "create",
    entityType: "project",
    entityId: data.id,
    metadata: { title: projectData.title },
  });

  revalidatePublicProjectPages();
  redirect("/admin/projects");
}

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
export async function updateProject(id, _prevState, formData) {
  const user = await requireAdmin();
  const parsed = parseProjectForm(formData);
  if (parsed.error) return { error: parsed.error };

  const { technologies, endpoints, ...projectData } = parsed.data;

  const { error } = await supabaseAdmin
    .from("projects")
    .update(projectData)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "Já existe um projecto com esse slug." };
    return { error: "Erro ao actualizar o projecto." };
  }

  try {
    await syncRelations(id, technologies, endpoints);
  } catch {
    return { error: "Projecto actualizado, mas falhou a associação de tecnologias/endpoints." };
  }

  await logActivity({
    adminId: user.id,
    action: "update",
    entityType: "project",
    entityId: id,
    metadata: { title: projectData.title },
  });

  revalidatePublicProjectPages();
  redirect("/admin/projects");
}

// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
export async function deleteProject(id) {
  const user = await requireAdmin();

  // Remover dependências primeiro (sem ON DELETE CASCADE garantido no schema).
  await supabaseAdmin.from("project_technologies").delete().eq("project_id", id);
  await supabaseAdmin.from("endpoints").delete().eq("project_id", id);
  await supabaseAdmin.from("project_likes").delete().eq("project_id", id);
  await supabaseAdmin.from("project_views").delete().eq("project_id", id);
  await supabaseAdmin.from("feedback").delete().eq("project_id", id);

  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) return { error: "Erro ao eliminar o projecto." };

  await logActivity({ adminId: user.id, action: "delete", entityType: "project", entityId: id });

  revalidatePublicProjectPages();
  return { ok: true };
}

// -----------------------------------------------------------------------------
// QUICK ACTIONS — mudar estado / featured
// -----------------------------------------------------------------------------
export async function setProjectStatus(id, status) {
  const user = await requireAdmin();
  if (!VALID_STATUS.includes(status)) return { error: "Estado inválido." };

  const { error } = await supabaseAdmin.from("projects").update({ status }).eq("id", id);
  if (error) return { error: "Erro ao mudar o estado." };

  await logActivity({ adminId: user.id, action: "status_change", entityType: "project", entityId: id, metadata: { status } });
  revalidatePublicProjectPages();
  return { ok: true };
}

export async function toggleFeatured(id, featured) {
  const user = await requireAdmin();
  const { error } = await supabaseAdmin.from("projects").update({ featured: !!featured }).eq("id", id);
  if (error) return { error: "Erro ao alterar destaque." };

  await logActivity({ adminId: user.id, action: "toggle_featured", entityType: "project", entityId: id, metadata: { featured } });
  revalidatePublicProjectPages();
  return { ok: true };
}
