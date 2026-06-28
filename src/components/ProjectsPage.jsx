"use client";
// app/projects/ProjectsPageClient.jsx
// ─────────────────────────────────────────────────────────────────────────────
// CLIENT COMPONENT — recebe os dados já resolvidos via props.
// Nenhum await de topo de módulo, nenhuma Promise crua aqui.
//
// Props:
//   initialProjects  Project[]   — array serializado vindo do Server Component
//   categories       Category[]  — lista estática de categorias
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import BigCategoryCard from "@/components/BigCategoryCard";
import EmptyState from "@/components/projects/EmptyState";
import { useLikes } from "@/hooks/Uselikes";
import AvisoLikeBrowser from "@/components/projects/AvisoLikeBrowser";

const FILTER_OPTIONS = ["todos", "frontend", "backend", "fullstack"];

// ── Utilitário: estatísticas derivadas ────────────────────────────────────
function computeStats(projects) {
  const allTech = new Set(projects.flatMap((p) => p.tech ?? []));
  const totalLikes = projects.reduce((sum, p) => sum + (p.likes ?? 0), 0);
  return { total: projects.length, techs: allTech.size, likes: totalLikes };
}

// ── Hook: count-up animado com IntersectionObserver ───────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Reinicia se o target mudar (ex: dados recarregados)
    hasRun.current = false;
    setValue(0);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            setValue(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

// ── StatItem ──────────────────────────────────────────────────────────────
function StatItem({ eyebrow, label, target }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="group text-center px-8 py-5 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/30 transition-all duration-300 min-w-[190px] cursor-default">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600 font-mono mb-2 select-none">
        {eyebrow}
      </p>
      <p className="text-3xl font-bold text-yellow-400 tabular-nums group-hover:text-yellow-300 transition-colors duration-300 select-none">
        {value}
      </p>
      <p className="text-xs text-gray-500 tracking-wide mt-1 select-none">{label}</p>
    </div>
  );
}

function StatsBar({ stats }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-16">
      <StatItem eyebrow="portfólio"  label="projectos publicados"  target={stats.total} />
      <StatItem eyebrow="stack"      label="tecnologias no total"  target={stats.techs} />
      <StatItem eyebrow="comunidade" label="likes recebidos"       target={stats.likes} />
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────
export default function ProjectsPageClient({ initialProjects = [], categories = [] }) {
  const [projects, setProjects]               = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter]       = useState("todos");
  const { liked, toggleLike, mostrarAviso, fecharAviso } = useLikes(setProjects);

  const stats = useMemo(() => computeStats(projects), [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "todos") return projects;
    return projects.filter((p) => p.type === activeFilter);
  }, [activeFilter, projects]);

  const countByType = useMemo(() =>
    categories.reduce((acc, cat) => {
      acc[cat.key] = projects.filter((p) => p.type === cat.key).length;
      return acc;
    }, {}),
  [categories, projects]);

  // ── Abrir modal + registar view ───────────────────────────────────────
  const openProject = (project) => {
    setSelectedProject(project);
    fetch(`/api/projects/${project.id}/view`, { method: "POST" }).catch(() => {});
  };

  // ── Mensagem do empty state contextual ao filtro activo ───────────────
  const mensagemVazia = activeFilter === "todos"
    ? "Nenhum projeto disponível de momento."
    : `Nenhum projeto de ${activeFilter} de momento.`;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen text-white px-4 sm:px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">

      {/* INTRO */}
      <section className="text-center mb-10">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Projetos &amp; Experimentos
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-gray-400 max-w-xl mx-auto px-2">
            Desde APIs robustas até interfaces modernas —{" "}
            cada projeto é um problema resolvido.
          </p>
        </FadeIn>
      </section>

      {/* STATS ANIMADAS */}
      <FadeIn>
        <StatsBar stats={stats} />
      </FadeIn>

      {/* CATEGORIAS */}
      <section className="mb-20">
        <FadeIn delay={0.1}>
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 text-center">
            Explorar por área
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeIn key={cat.key} delay={0.1 + i * 0.1}>
              <BigCategoryCard cat={cat} count={countByType[cat.key] ?? 0} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* DESTAQUES COM FILTRO */}
      <section className="border-t border-yellow-500/10 pt-12">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold">Destaques Recentes</h2>

            <div className="min-w-0">
              {/* Mobile: select nativo */}
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="sm:hidden w-full px-4 py-2 rounded-full border border-yellow-500/20 bg-zinc-900 text-gray-400 text-sm outline-none cursor-pointer"
              >
                {FILTER_OPTIONS.map((f) => (
                  <option key={f} value={f} className="capitalize">{f}</option>
                ))}
              </select>

              {/* Desktop: pills */}
              <div className="hidden sm:flex gap-2 flex-wrap">
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer capitalize ${
                      activeFilter === f
                        ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                        : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.08, 0.4) }}
                  className="relative group min-w-0"
                >
                  <ProjectCard
                    project={project}
                    onClick={() => openProject(project)}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(project.id); }}
                    aria-label={liked[project.id] ? "Remover like" : "Dar like"}
                    className={`absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded-md border transition-all cursor-pointer ${
                      liked[project.id]
                        ? "bg-yellow-400 text-black border-yellow-400"
                        : "bg-black/40 border-yellow-500/20 text-gray-400 hover:border-yellow-400/50"
                    }`}
                  >
                    {liked[project.id] ? "❤️" : "🤍"}{" "} {project.likes ?? 0}
                  </button>
                </motion.div>
              ))
            ) : (
              // Empty state animado — variante corresponde ao filtro activo
              // "todos" → animação de pasta/search (geral)
              // "frontend" | "backend" | "fullstack" → animação específica
              <EmptyState
                tipo="geral"
                mensagem={mensagemVazia}
                onClearFilter={activeFilter !== "todos" ? () => setActiveFilter("todos") : null}
                labelBotao="Ver todos"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center mt-20 border-t border-yellow-500/10">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
            Tens um projecto em mente?
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Frontend, backend ou fullstack — escolhe a área e vê o que já foi construído.
          </p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <Link
            href="/contact"
            className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition inline-block cursor-pointer"
          >
            Entrar em contacto
          </Link>
        </FadeIn>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
      <AvisoLikeBrowser visivel={mostrarAviso} onFechar={fecharAviso} />
    </main>
  );
}