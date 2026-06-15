"use client";

// hooks/useLikes.js
//
// Lógica centralizada de likes — usada em ProjectsPageClient e ProjectsLayout.
//
// Duas camadas:
//   1. localStorage  → estado visual persistente entre visitas
//   2. Supabase RPC  → integridade real no BD (UNIQUE por ip_hash)
//
// O ip_hash é gerado no cliente a partir de um valor aleatório fixo por browser
// (guardado também no localStorage). Não é um IP real — é um identificador
// anónimo e não rastreável que serve apenas para deduplicação no BD.

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const LS_LIKED_KEY  = "plg_liked_projects"; // IDs dos projectos com like
const LS_HASH_KEY   = "plg_visitor_hash";   // Identificador anónimo do browser

// Gera ou recupera o hash do visitante
function getVisitorHash() {
  try {
    const existing = localStorage.getItem(LS_HASH_KEY);
    if (existing) return existing;

    // Gera um token aleatório de 32 chars — não é um IP, é só um ID anónimo
    const hash = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(LS_HASH_KEY, hash);
    return hash;
  } catch {
    // Se localStorage não estiver disponível (SSR, modo privado bloqueado)
    return "anonymous";
  }
}

// Lê os IDs com like do localStorage
function readLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(LS_LIKED_KEY) || "[]");
  } catch {
    return [];
  }
}

// Escreve os IDs com like no localStorage
function writeLikedIds(ids) {
  try {
    localStorage.setItem(LS_LIKED_KEY, JSON.stringify(ids));
  } catch {}
}

// ── Hook principal ────────────────────────────────────────────────────────
//
// @param {function} setProjects  setState do array de projectos (para actualizar
//                                o contador de likes localmente de forma optimista)
//
// Retorna:
//   liked       { [projectId]: boolean }  — estado actual dos likes
//   toggleLike  (projectId) => void       — função a passar ao botão
//
export function useLikes(setProjects) {
  const [liked, setLiked] = useState({});

  // Inicializar a partir do localStorage (só no cliente, após mount)
  useEffect(() => {
    const ids = readLikedIds();
    if (ids.length === 0) return;
    const initial = ids.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setLiked(initial);
  }, []);

  const toggleLike = useCallback(async (projectId) => {
    const isCurrentlyLiked = !!liked[projectId];
    const delta = isCurrentlyLiked ? -1 : 1;
    const visitorHash = getVisitorHash();

    // 1. Actualização optimista — UI responde imediatamente
    setLiked((prev) => ({ ...prev, [projectId]: !isCurrentlyLiked }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, likes: Math.max(0, (p.likes ?? 0) + delta) } : p
      )
    );

    // 2. Persistir no localStorage
    const ids = readLikedIds();
    const updated = isCurrentlyLiked
      ? ids.filter((id) => id !== projectId)
      : [...ids, projectId];
    writeLikedIds(updated);

    // 3. Persistir no Supabase
    try {
      const { error } = await supabase.rpc("toggle_project_like", {
        p_project_id: projectId,
        p_ip_hash:    visitorHash,
        p_liked:      !isCurrentlyLiked,
      });
      if (error) throw error;
    } catch {
      // Rollback silencioso se o Supabase falhar
      setLiked((prev) => ({ ...prev, [projectId]: isCurrentlyLiked }));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, likes: Math.max(0, (p.likes ?? 0) - delta) } : p
        )
      );
      writeLikedIds(ids); // Reverte o localStorage também
    }
  }, [liked, setProjects]);

  return { liked, toggleLike };
}