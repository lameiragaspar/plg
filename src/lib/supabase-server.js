// lib/supabase-server.js — SERVER ONLY
// Cliente Supabase com persistência de sessão via cookies (@supabase/ssr).
// Usado para autenticação do painel /admin — lê/escreve a sessão do admin
// nos cookies do request, ao contrário de supabase-admin.js (service role,
// sem sessão).
import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cria um cliente Supabase ligado aos cookies do request actual.
 * Deve ser chamado dentro de Server Components, Route Handlers ou Server Actions.
 *
 * Usa a PUBLISHABLE/ANON key — o fluxo de auth (signIn/signOut/getUser) corre
 * sempre com a chave pública; os privilégios vêm da sessão do utilizador.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component sem capacidade de escrever
            // cookies — ignorado em segurança, o middleware trata da renovação.
          }
        },
      },
    }
  );
}
