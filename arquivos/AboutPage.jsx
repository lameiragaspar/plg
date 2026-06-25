"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { FadeItem } from "@/components/HeroAnimation";

// ── Dados ──────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2022",
    title: "O início",
    desc: "Primeiros passos com HTML, CSS e JavaScript. A curiosidade virou obsessão.",
    accent: "yellow",
  },
  {
    year: "2023",
    title: "React & ecosistema moderno",
    desc: "Mergulhei no React, aprendi Tailwind e comecei a construir interfaces reais.",
    accent: "yellow",
  },
  {
    year: "2024",
    title: "FullStack — a virada",
    desc: "Node.js, APIs REST, bases de dados. Comecei a ligar o frontend ao backend.",
    accent: "yellow",
  },
  {
    year: "2025",
    title: "Next.js & projetos sérios",
    desc: "Portfolio profissional, App Router, Server Components e deploy em produção.",
    accent: "yellow",
  },
  {
    year: "Agora",
    title: "Em evolução constante",
    desc: "TypeScript, autenticação, bases de dados relacionais e arquitectura de software.",
    accent: "yellow",
    isCurrent: true,
  },
];

const TECH_STACK = {
  Frontend: {
    color: "yellow",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
  },
  Backend: {
    color: "blue",
    items: ["Node.js", "Express", "REST APIs", "JWT / Auth", "PostgreSQL"],
  },
  Ferramentas: {
    color: "emerald",
    items: ["Git & GitHub", "Vercel", "VS Code", "Postman", "Figma"],
  },
};

const FOCUS_NOW = [
  {
    icon: "⚙️",
    title: "TypeScript",
    desc: "Tipar o código para escalar com segurança.",
    tag: "Aprendendo",
    tagColor: "blue",
  },
  {
    icon: "🗄️",
    title: "Bases de dados",
    desc: "PostgreSQL, relações, migrations e queries optimizadas.",
    tag: "Em progresso",
    tagColor: "emerald",
  },
  {
    icon: "🔐",
    title: "Auth & Segurança",
    desc: "JWT, sessions, OAuth e boas práticas de segurança.",
    tag: "Explorando",
    tagColor: "yellow",
  },
];

function buildStats(initialStats) {
  const yearStart = 2022;
  const yearsLearning = new Date().getFullYear() - yearStart;

  return [
    { value: `${yearsLearning}+`, label: "Anos a aprender" },
    { value: `${initialStats.projects}`,  label: "Projectos publicados" },
    { value: `${initialStats.techs}`,     label: "Tecnologias únicas" },
    { value: "∞",                         label: "Bugs corrigidos" },
  ];
}

const colorMap = {
  yellow: {
    border: "border-yellow-500/20",
    hoverBorder: "hover:border-yellow-400/50",
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    dot: "bg-yellow-400",
    tag: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  },
  blue: {
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-400/50",
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
    tag: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  },
  emerald: {
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400/50",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
    tag: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
};

// ── Componentes internos ───────────────────────────────────────────────────

function AvatarBlock() {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Avatar placeholder — substituir pelo teu src quando tiveres foto */}
      <div className="relative">
        <div className="w-28 h-28 rounded-2xl bg-zinc-800 border border-yellow-500/20 flex items-center justify-center text-5xl select-none">
          <Image
            src="/assets/picture.jpeg"
            alt="Pedro Lameira"
            width={112}
            height={112}
            className="rounded-2xl"
          />
        </div>
        {/* Indicador "disponível"  */}
        <span className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-emerald-400 text-[11px] font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </span>
      </div>

      {/* Nome + role */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pedro Lameira
        </h1>
        <p className="text-gray-400 mt-1 text-sm font-mono tracking-wider uppercase">
          FullStack Developer
        </p>
      </div>

      {/* Links rápidos */}
      <div className="flex gap-3">
        <Link
          href="https://github.com/lameiragaspar"
          target="_blank"
          className="px-4 py-2 rounded-lg border border-yellow-500/20 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-400 transition text-sm font-mono"
        >
          GitHub ↗
        </Link>
        <Link
          href="/contact"
          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition text-sm"
        >
          Contactar
        </Link>
      </div>
    </div>
  );
}

function StatPills({STATS}) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-10">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center px-6 py-4 rounded-xl border border-yellow-500/10 hover:border-yellow-400/30 bg-zinc-900/50 transition min-w-[110px]"
        >
          <span className="text-2xl font-bold text-yellow-400 tabular-nums">{s.value}</span>
          <span className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider text-center">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="relative">
      {/* Linha vertical */}
      <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-yellow-400/40 via-yellow-400/10 to-transparent hidden sm:block" />

      <div className="space-y-6 sm:pl-16">
        {TIMELINE.map((item, i) => (
          <FadeIn key={item.year} delay={i * 0.1}>
            <div
              className={`relative cursor-pointer group`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {/* Ponto na linha — só sm+ */}
              <div
                className={`absolute -left-[46px] top-3 w-3 h-3 rounded-full border-2 border-black hidden sm:block transition-all duration-300 ${
                  item.isCurrent
                    ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] scale-110"
                    : "bg-zinc-600 group-hover:bg-yellow-400/60"
                }`}
              />

              <div
                className={`p-5 rounded-xl border transition-all duration-300 ${
                  item.isCurrent
                    ? "border-yellow-500/30 bg-yellow-400/5"
                    : "border-yellow-500/10 hover:border-yellow-400/30 bg-zinc-900/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          item.isCurrent
                            ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 animate-pulse"
                            : "text-gray-500 border-gray-700 bg-zinc-900"
                        }`}
                      >
                        {item.year}
                      </span>
                      <h3
                        className={`font-semibold text-base ${
                          item.isCurrent ? "text-yellow-400" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                      
                    </div>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function TechStack() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Object.entries(TECH_STACK).map(([area, { color, items }], i) => {
        const c = colorMap[color];
        return (
          <FadeIn key={area} delay={i * 0.15}>
            <div className={`p-5 rounded-xl border ${c.border} bg-zinc-900/40`}>
              <h3 className={`text-xs uppercase tracking-widest font-semibold mb-4 ${c.text}`}>
                {area}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((tech) => (
                  <span
                    key={tech}
                    className={`text-xs px-2.5 py-1 rounded-lg border ${c.tag}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}

function FocusNow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {FOCUS_NOW.map((item, i) => {
        const c = colorMap[item.tagColor];
        return (
          <FadeIn key={item.title} delay={i * 0.15}>
            <div
              className={`flex flex-col h-full p-5 rounded-xl border border-yellow-500/10 hover:border-yellow-400/30 bg-zinc-900/40 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${c.tag}`}>
                  {item.tag}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{item.desc}</p>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function About({ initialStats = { projects: 0, techs: 0 } }) {
  const STATS = buildStats(initialStats);
  return (
    <main className="min-h-screen text-white px-4 sm:px-6 pt-28 md:pt-36 pb-24 max-w-4xl mx-auto">

      {/* ── HERO ── */}
      <section className="text-center mb-20">
        <FadeItem direction="down" delay={0}>
          <AvatarBlock />
        </FadeItem>
        <FadeItem direction="up" delay={0.3}>
          <StatPills 
            STATS={STATS}
          />
        </FadeItem>
      </section>

      {/* ── JORNADA ── */}
      <section className="mb-20">
        <FadeIn>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Jornada</h2>
            <div className="flex-1 h-px bg-yellow-500/10" />
          </div>
        </FadeIn>
        <Timeline />
      </section>

      {/* ── STACK ── */}
      <section className="mb-20">
        <FadeIn>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Stack técnica</h2>
            <div className="flex-1 h-px bg-yellow-500/10" />
          </div>
        </FadeIn>
        <TechStack />
      </section>

      {/* ── AGORA ── */}
      <section className="mb-20">
        <FadeIn>
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Em foco agora</h2>
            <div className="flex-1 h-px bg-yellow-500/10" />
          </div>
          <p className="text-gray-500 text-sm mb-10">
            O que estou a estudar e a construir neste momento.
          </p>
        </FadeIn>
        <FocusNow />
      </section>

      {/* ── ABORDAGEM ── */}
      <section className="mb-20">
        <FadeIn>
          <div className="p-8 rounded-2xl border border-yellow-500/10 bg-zinc-900/40">
            <h2 className="text-xl font-bold mb-6 text-yellow-400">A minha abordagem</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-gray-400 text-sm leading-relaxed">
              <div className="space-y-3">
                <p>
                  <span className="text-white font-medium">Aprendo fazendo.</span>{" "}
                  Cada projecto é um laboratório. Prefiro construir algo imperfeito
                  e iterar do que esperar pela perfeição.
                </p>
                <p>
                  <span className="text-white font-medium">Código limpo importa.</span>{" "}
                  Legibilidade e manutenção são tão importantes quanto funcionar.
                  Escrevo para humanos, não só para máquinas.
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  <span className="text-white font-medium">UX em primeiro lugar.</span>{" "}
                  Antes de escrever uma linha, penso em quem vai usar. A melhor
                  feature é aquela que o utilizador nem nota porque funciona perfeitamente.
                </p>
                <p>
                  <span className="text-white font-medium">Mentalidade de crescimento.</span>{" "}
                  Não tenho medo de estar errado. O erro é a etapa antes de perceber.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-yellow-500/10 pt-16 text-center">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-4 font-mono">
            Próximo passo
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Vamos construir algo juntos?
          </h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Disponível para projectos freelance, colaborações ou simplesmente
            trocar ideias sobre tecnologia.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition w-full sm:w-auto text-center"
            >
              Entrar em contacto
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 border border-yellow-500/20 text-gray-400 rounded-xl hover:border-yellow-400/50 hover:text-white transition w-full sm:w-auto text-center"
            >
              Ver projectos →
            </Link>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}