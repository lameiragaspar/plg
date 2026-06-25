"use client";

import { useState, useEffect, useRef } from "react";

const TEXTO = "Disponível para projectos";

/**
 * DisponivelBadge
 * Badge animado com efeito de máquina de escrever.
 *
 * Correcções vs original:
 * - Bug: `i < texto.length - 1` saltava o último caractere → corrigido com slice
 * - Dot piscante substituído por ping (padrão "online" reconhecível)
 * - Cursor | 
 */
export default function DisponivelBadge() {
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(TEXTO.slice(0, i));
      if (i >= TEXTO.length) clearInterval(intervalRef.current);
    }, 60);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5">
      {/* Status dot — animação ping */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>

      {/* Texto typewriter + cursor */}
      <span className="text-xs text-green-400 font-mono flex items-center">
        {displayedText}
        <span className="ml-px w-px h-3 bg-green-400 inline-block animate-pulse" />
      </span>
    </div>
  );
}