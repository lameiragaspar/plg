"use server";

// lib/admin/session.js — Server Actions de sessão (login / logout)
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { logActivity } from "@/lib/admin/log";

/**
 * Login com email + password. Usado pelo formulário em /admin/login via
 * useActionState. Devolve { error } em caso de falha; redirecciona em sucesso.
 */
export async function signInAction(_prevState, formData) {
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString();
  const redirectTo = (formData.get("redirect") || "/admin").toString();

  if (!email || !password) {
    return { error: "Preencha o email e a palavra-passe." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciais inválidas." };
  }

  await logActivity({
    adminId: data.user?.id,
    action: "login",
    entityType: "session",
  });

  // Redireccionar apenas para caminhos internos (evita open-redirect).
  const safePath = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safePath);
}

/**
 * Logout. Termina a sessão e volta ao login.
 */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  if (user) {
    await logActivity({ adminId: user.id, action: "logout", entityType: "session" });
  }

  redirect("/admin/login");
}
