"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// ── Sistema de cores por tipo ──────────────────────────────────────────────
// Ponto central: qualquer mudança aqui propaga-se automaticamente a todas
// as páginas que usem <ProjectModal /> — /frontend, /backend, /fullstack.
const TYPE_CONFIG = {
  frontend: {
    label:        "Frontend",
    accentClass:  "text-yellow-400",
    dotClass:     "bg-yellow-400",
    borderClass:  "border-yellow-400/20",
    badgeBg:      "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    sectionLabel: "text-yellow-400",
    btnPrimary:   "bg-yellow-400 text-black hover:bg-yellow-300",
    btnOutline:   "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black",
  },
  backend: {
    label:        "Backend",
    accentClass:  "text-blue-400",
    dotClass:     "bg-blue-400",
    borderClass:  "border-blue-400/20",
    badgeBg:      "bg-blue-400/10 text-blue-400 border-blue-400/20",
    sectionLabel: "text-blue-400",
    btnPrimary:   "bg-blue-400 text-black hover:bg-blue-300",
    btnOutline:   "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black",
  },
  fullstack: {
    label:        "Fullstack",
    accentClass:  "text-emerald-400",
    dotClass:     "bg-emerald-400",
    borderClass:  "border-emerald-400/20",
    badgeBg:      "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    sectionLabel: "text-emerald-400",
    btnPrimary:   "bg-emerald-400 text-black hover:bg-emerald-300",
    btnOutline:   "border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black",
  },
};

// ── Ícones SVG inline (zero dependência extra) ────────────────────────────
function IconGithub() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
/**
 * ProjectModal  —  componente único reutilizável para todas as categorias.
 *
 * Props:
 * @param {Object}    project     — Dados do projeto (type, title, tech, image, …)
 * @param {Function}  onClose     — Callback para fechar o modal
 * @param {ReactNode} modalExtra  — Slot de conteúdo por categoria:
 *                                   /backend  → <EndpointViewer />
 *                                   /fullstack → <SplitStack />
 *                                   /frontend  → null  (ou qualquer coisa)
 */
export default function ProjectModal({ project, onClose, modalExtra = null }) {
  const cfg = TYPE_CONFIG[project?.type] ?? TYPE_CONFIG.frontend;

  // — Fechar com ESC --------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // — Bloquear scroll do body enquanto o modal está aberto ------------------
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const hasGithub = project.github && project.github !== "#";
  const hasDeploy = project.deploy && project.deploy !== "#";
  const showFooter = hasGithub || hasDeploy;

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ scale: 0.94, opacity: 0, y: 28 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.94, opacity: 0, y: 28 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className={`
          bg-zinc-900 border ${cfg.borderClass}
          max-w-2xl w-full rounded-2xl
          relative max-h-[90vh]
          flex flex-col overflow-hidden
          shadow-2xl shadow-black/60
        `}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
            <span className={`text-xs font-mono uppercase tracking-[0.18em] ${cfg.accentClass}`}>
              {cfg.label}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          >
            <IconClose />
          </button>
        </div>

        {/* ── BODY (scrollável) ────────────────────────────────────────────── */}
        <div
          className="
            flex-1 overflow-y-auto px-6 py-6 space-y-5
            [scrollbar-width:thin]
            [scrollbar-color:rgba(255,255,255,0.1)_transparent]
          "
        >

          {/* Imagem — frontend & fullstack */}
          {project.type !== "backend" && project.image && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-xl"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            </motion.div>
          )}

          {/* Título + descrição curta */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              {project.title}
            </h2>
            {project.description && (
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Tech badges — cor herdada do tipo */}
          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono ${cfg.badgeBg}`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Motivação + Aprendizados */}
          {(project.motivation || project.learnings) && (
            <div className="space-y-3">
              {project.motivation && (
                <div className="bg-zinc-950/50 rounded-xl p-4 border border-white/[0.05]">
                  <h4 className={`text-[11px] font-mono uppercase tracking-widest ${cfg.sectionLabel} mb-2`}>
                    Motivação
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {project.motivation}
                  </p>
                </div>
              )}
              {project.learnings && (
                <div className="bg-zinc-950/50 rounded-xl p-4 border border-white/[0.05]">
                  <h4 className={`text-[11px] font-mono uppercase tracking-widest ${cfg.sectionLabel} mb-2`}>
                    Aprendizados
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {project.learnings}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── SLOT DE CONTEÚDO POR CATEGORIA ───────────────────────────── */}
          {/* /backend  → <EndpointViewer />                                  */}
          {/* /fullstack → <SplitStack />                                     */}
          {/* /frontend  → null (ou outro componente a implementar)           */}
          {modalExtra && (
            <div className="border-t border-white/[0.06] pt-5">
              {modalExtra}
            </div>
          )}
        </div>

        {/* ── FOOTER — botões de acção ─────────────────────────────────────── */}
        {showFooter && (
          <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3 shrink-0 bg-zinc-950/30">
            {hasGithub && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3 rounded-xl font-semibold text-sm
                  transition duration-200 cursor-pointer
                  ${cfg.btnPrimary}
                `}
              >
                <IconGithub />
                Ver código
              </Link>
            )}
            {hasDeploy && (
              <Link
                href={project.deploy}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3 rounded-xl font-semibold text-sm border
                  transition duration-200 cursor-pointer
                  ${cfg.btnOutline}
                `}
              >
                <IconExternalLink />
                Ver projeto
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}