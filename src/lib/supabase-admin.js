// lib/supabase-admin.js — SERVER ONLY
// ⚠️  Nunca importar em ficheiros "use client".
//    O pacote "server-only" garante um erro em build-time se isso acontecer.
import "server-only";

import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    global: {
      // Força no-store em todas as queries — impede o Next.js de cachear
      // os resultados do Supabase no Data Cache em produção.
      fetch: (url, options = {}) =>
        fetch(url, { ...options, cache: "no-store" }),
    },
  }
);