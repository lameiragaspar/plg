"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ContactCard
 *
 * Props:
 * @param {Object} item - { label, value, href, icon, description }
 *
 * Comportamento:
 * - Email  → copia o endereço para o clipboard (sem abrir o cliente de mail)
 *            mostra confirmação inline por 2.2s
 * - Outros → abre o link em nova aba normalmente
 * 
 */

function CardIcon({ type }) {
  if (type === "github") return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-300 group-hover:fill-yellow-400 transition-colors duration-300">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
  if (type === "linkedin") return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-300 group-hover:fill-yellow-400 transition-colors duration-300">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  return <span className="text-lg leading-none">✉️</span>;
}
export default function ContactCard({ item }) {
  const [copied, setCopied] = useState(false);
  const isEmail = item.href.startsWith("mailto:");

  const handleClick = async (e) => {
    if (!isEmail) return; // deixa o <a> tratar da navegação
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(item.value);
    } catch {
      // Fallback: se clipboard API não estiver disponível, abre mailto
      window.location.href = item.href;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <a
      href={item.href}
      target={isEmail ? "_self" : "_blank"}
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative flex items-start gap-4 p-5 rounded-2xl border border-yellow-500/10 bg-zinc-900/40 hover:border-yellow-400/30 hover:bg-zinc-900/70 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none"
    >
      {/* Ícone em caixa */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-zinc-800/80 border border-yellow-500/10 flex items-center justify-center group-hover:border-yellow-400/20 transition-colors duration-300">
        <CardIcon type={item.iconType} />
      </div>

      {/* Conteúdo textual */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
            {item.label}
          </p>
          {/* Confirmação de cópia — aparece inline a seguir ao label */}
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="text-[10px] text-green-400 font-mono"
              >
                copiado ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="text-white text-sm font-medium truncate group-hover:text-yellow-400 transition-colors duration-300">
          {item.value}
        </p>
        <p className="text-gray-600 text-xs mt-0.5">{item.description}</p>
      </div>

      {/* Ícone de acção — copiar (email) ou seta (links externos) */}
      <div className="shrink-0 mt-1 text-gray-600 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all duration-300">
        {isEmail ? (
          // ⎘ = símbolo universal de "copiar"
          <span className="text-base leading-none" aria-label="Copiar email">⎘</span>
        ) : (
          <span className="text-sm leading-none">→</span>
        )}
      </div>
    </a>
  );
}