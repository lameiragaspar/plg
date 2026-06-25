// hooks/Uselikes.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const CHAVE_LIKES_LOCAL  = "plg_liked_projects";
const CHAVE_HASH_VISITOR = "plg_visitor_hash";
const CHAVE_AVISO_VISTO  = "plg_like_aviso_visto"; // one-shot: nunca mostra duas vezes

// Gera ou recupera o identificador anónimo deste browser
function obterHashVisitante() {
  try {
    const existente = localStorage.getItem(CHAVE_HASH_VISITOR);
    if (existente) return existente;

    const novoHash = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    localStorage.setItem(CHAVE_HASH_VISITOR, novoHash);
    return novoHash;
  } catch {
    return "anonymous";
  }
}

function lerLikesLocais() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_LIKES_LOCAL) || "[]");
  } catch {
    return [];
  }
}

function guardarLikesLocais(ids) {
  try {
    localStorage.setItem(CHAVE_LIKES_LOCAL, JSON.stringify(ids));
  } catch {}
}

function avisoJaFoiVisto() {
  try {
    return localStorage.getItem(CHAVE_AVISO_VISTO) === "1";
  } catch {
    return false;
  }
}

function marcarAvisoComoVisto() {
  try {
    localStorage.setItem(CHAVE_AVISO_VISTO, "1");
  } catch {}
}

// ── Hook principal ────────────────────────────────────────────────────────
//
// Retorna:
//   liked           { [projectoId]: boolean }
//   toggleLike      (projectoId) => void
//   mostrarAviso    boolean  — true apenas na 1ª curtida de toda a sessão
//   fecharAviso     () => void
//
export function useLikes(setProjectos) {
  const [liked, setLiked]             = useState({});
  const [mostrarAviso, setMostrarAviso] = useState(false);
  // Guarda os IDs com uma requisição de like/unlike em curso.
  // Não é estado (não precisa re-render) — só serve para bloquear cliques repetidos.
  const pendentesRef = useRef(new Set());

  useEffect(() => {
    const ids = lerLikesLocais();
    if (ids.length === 0) return;

    const estadoInicial = ids.reduce(
      (acumulador, id) => ({ ...acumulador, [id]: true }),
      {}
    );
    setLiked(estadoInicial);
  }, []);

  const fecharAviso = useCallback(() => {
    setMostrarAviso(false);
    marcarAvisoComoVisto();
  }, []);

  const toggleLike = useCallback(
    async (projectoId) => {
      // Bloqueia duplo-clique / cliques repetidos enquanto a requisição anterior
      // para este mesmo projeto ainda não terminou.
      if (pendentesRef.current.has(projectoId)) return;
      pendentesRef.current.add(projectoId);

      const estavaCurtido  = !!liked[projectoId];
      const deltaOtimista  = estavaCurtido ? -1 : 1;
      const visitorHash    = obterHashVisitante();

      // Mostra aviso informativo na primeira curtida ever (one-shot)
      if (!estavaCurtido && !avisoJaFoiVisto()) {
        setMostrarAviso(true);
      }

      // 1. Actualização optimista — UI responde imediatamente
      setLiked((prev) => ({ ...prev, [projectoId]: !estavaCurtido }));
      setProjectos((prev) =>
        prev.map((p) =>
          p.id === projectoId
            ? { ...p, likes: Math.max(0, (p.likes ?? 0) + deltaOtimista) }
            : p
        )
      );

      try {
        // 2. Chamada à API — envia o hash do browser para deduplicação
        const resposta = await fetch(`/api/projects/${projectoId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorHash }),
        });

        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const { liked: novoEstado, totalLikes } = await resposta.json();

        // 3. Reconcilia com o valor real do servidor
        setLiked((prev) => ({ ...prev, [projectoId]: novoEstado }));
        setProjectos((prev) =>
          prev.map((p) =>
            p.id === projectoId ? { ...p, likes: totalLikes } : p
          )
        );

        // 4. Persiste só após confirmação do servidor
        const idsActuais       = lerLikesLocais();
        const idsActualizados  = novoEstado
          ? [...new Set([...idsActuais, projectoId])]
          : idsActuais.filter((id) => id !== projectoId);
        guardarLikesLocais(idsActualizados);

      } catch (erro) {
        // Rollback completo se a API falhar
        console.error("[useLikes] Falha ao registar like:", erro);
        setLiked((prev) => ({ ...prev, [projectoId]: estavaCurtido }));
        setProjectos((prev) =>
          prev.map((p) =>
            p.id === projectoId
              ? { ...p, likes: Math.max(0, (p.likes ?? 0) - deltaOtimista) }
              : p
          )
        );
      } finally {
        // Libera o lock — só agora um novo clique neste projeto é aceite
        pendentesRef.current.delete(projectoId);
      }
    },
    [liked, setProjectos]
  );

  return { liked, toggleLike, mostrarAviso, fecharAviso };
}