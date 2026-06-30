// lib/admin/auth.js — SERVER ONLY
// Camada de protecção redundante (defesa em profundidade). Mesmo que o
// middleware falhe ou seja contornado, qualquer Server Component / Server Action
// que dependa de privilégios de admin DEVE chamar requireAdmin() primeiro.
import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Allowlist OPCIONAL de emails de admin. Por defeito (vazia), qualquer
// utilizador autenticado em auth.users tem acesso ao painel. Para restringir,
// definir a env ADMIN_EMAILS com emails separados por vírgula, ex.:
//   ADMIN_EMAILS="admin@exemplo.com,outro@exemplo.com"
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAllowed(user) {
  if (!user) return false;
  if (ADMIN_EMAILS.length === 0) return true; // sem allowlist → todos os autenticados
  return ADMIN_EMAILS.includes((user.email || "").toLowerCase());
}

/**
 * Devolve o utilizador autenticado ou null. Não redirecciona.
 * Útil para lógica condicional (ex.: mostrar/ocultar UI).
 */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/**
 * Garante que existe um admin autenticado e autorizado. Caso contrário,
 * redirecciona para o login. Devolve o objecto `user` quando autorizado.
 *
 * Uso:
 *   const user = await requireAdmin();
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!isAllowed(user)) {
    redirect("/admin/login");
  }
  return user;
}
