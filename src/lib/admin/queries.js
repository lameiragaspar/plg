// lib/admin/queries.js — SERVER ONLY
// Leituras para o painel admin. Usa a service role (supabaseAdmin) → vê TUDO,
// incluindo drafts e archived, e tabelas protegidas por RLS.
import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

// -----------------------------------------------------------------------------
// Dashboard — contagens agregadas
// -----------------------------------------------------------------------------
export async function getDashboardStats() {
  const [
    projectsTotal,
    projectsPublished,
    projectsDraft,
    feedbackUnread,
    messagesUnread,
    likesAgg,
  ] = await Promise.all([
    supabaseAdmin.from("projects").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabaseAdmin.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabaseAdmin.from("feedback").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabaseAdmin.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    supabaseAdmin.from("projects").select("likes_count, views_count"),
  ]);

  const totals = (likesAgg.data ?? []).reduce(
    (acc, p) => {
      acc.likes += p.likes_count ?? 0;
      acc.views += p.views_count ?? 0;
      return acc;
    },
    { likes: 0, views: 0 }
  );

  return {
    projectsTotal: projectsTotal.count ?? 0,
    projectsPublished: projectsPublished.count ?? 0,
    projectsDraft: projectsDraft.count ?? 0,
    feedbackUnread: feedbackUnread.count ?? 0,
    messagesUnread: messagesUnread.count ?? 0,
    totalLikes: totals.likes,
    totalViews: totals.views,
  };
}

// -----------------------------------------------------------------------------
// Projectos — listagem completa (todos os estados)
// -----------------------------------------------------------------------------
export async function getAllProjectsAdmin() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("id, slug, title, type, status, featured, likes_count, views_count, updated_at, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Projecto único + relações (para edição)
export async function getProjectByIdAdmin(id) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(
      `
      *,
      project_technologies ( tech_id, role, sort_order ),
      endpoints ( id, method, path, description, sort_order )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// -----------------------------------------------------------------------------
// Tecnologias — para o multi-select do formulário
// -----------------------------------------------------------------------------
export async function getAllTechnologies() {
  const { data, error } = await supabaseAdmin
    .from("technologies")
    .select("id, name, category, color_hex")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// -----------------------------------------------------------------------------
// Feedback — inbox
// -----------------------------------------------------------------------------
export async function getAllFeedback() {
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .select("id, project_id, rating, comment, page, is_read, created_at, projects ( title )")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// -----------------------------------------------------------------------------
// Mensagens de contacto — inbox
// -----------------------------------------------------------------------------
export async function getAllMessages() {
  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("id, name, email, subject, message, read, replied, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
