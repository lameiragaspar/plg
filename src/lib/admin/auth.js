// lib/admin/auth.js — SERVER ONLY
// Camada de protecção redundante (defesa em profundidade). Mesmo que o
// middleware falhe ou seja contornado, qualquer Server Component / Server Action
// que dependa de privilégios de admin DEVE chamar requireAdmin() primeiro.
import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
 * Garante que existe um admin autenticado. Caso contrário, redirecciona para
 * o login. Devolve o objecto `user` quando autorizado.
 *
 * Uso:
 *   const user = await requireAdmin();
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
