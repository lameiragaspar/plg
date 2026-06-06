"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { FadeItem } from "@/components/HeroAnimation";
import { getCategories, getAllProjects } from "@/lib/Projects";
import BigCategoryCard from "@/components/BigCategoryCard";

// ── Dados de Stack ────────────────────────────────────────────────────────
const STACK = [
  {
    name: "JavaScript",
    badge: "JS",
    color: "yellow",
    accentClass: "text-yellow-400",
    borderClass: "border-yellow-400/40",
    bgClass: "bg-yellow-400/10",
    years: "3+ anos",
    level: "Avançado",
    concepts: ["Closures", "Event Loop", "Async/Await", "Promises", "Prototypes"],
    description:
      "A base de tudo. Dominar JS significa entender closures, async/await e o event loop — fundamentos que tornam qualquer framework previsível e qualquer bug mais fácil de rastrear.",
    impact:
      "Elimina a dependência de frameworks para resolução de problemas core. Cada linha de React ou Node que escrevo assenta em fundamentos sólidos.",
  },
  {
    name: "React",
    badge: "⚛",
    color: "blue",
    accentClass: "text-blue-400",
    borderClass: "border-blue-400/40",
    bgClass: "bg-blue-400/10",
    years: "2+ anos",
    level: "Avançado",
    concepts: ["Hooks", "Context API", "State Management", "Composition", "Performance"],
    description:
      "Componentes, hooks e estado imutável — React transformou como penso sobre UI. Cada componente é um contrato claro entre dados e visualização.",
    impact:
      "Construção de interfaces complexas de forma modular e reutilizável. Este portfólio inteiro é construído sobre esta base.",
  },
  {
    name: "Next.js",
    badge: "N",
    color: "white",
    accentClass: "text-white",
    borderClass: "border-white/30",
    bgClass: "bg-white/10",
    years: "2+ anos",
    level: "Intermédio",
    concepts: ["App Router", "SSR/SSG", "API Routes", "Middleware", "Image Optimization"],
    description:
      "SSR, rotas de API e App Router. Next.js é onde o frontend encontra o backend — e este portfólio foi construído inteiramente com ele.",
    impact:
      "Permite construir produtos completos com uma única stack. Da renderização no servidor ao deploy, tudo num só lugar.",
  },
  {
    name: "Tailwind CSS",
    badge: "TW",
    color: "cyan",
    accentClass: "text-cyan-400",
    borderClass: "border-cyan-400/40",
    bgClass: "bg-cyan-400/10",
    years: "2+ anos",
    level: "Avançado",
    concepts: ["Utility-First", "Responsive Design", "Dark Mode", "Custom Tokens", "JIT"],
    description:
      "Utility-first CSS que acelera o desenvolvimento sem perder controlo. Design direto no JSX — iteração rápida e consistência visual garantida.",
    impact:
      "Elimina o context switching entre CSS e markup. O que costumava levar horas agora leva minutos.",
  },
  {
    name: "Node.js",
    badge: "No",
    color: "green",
    accentClass: "text-green-400",
    borderClass: "border-green-400/40",
    bgClass: "bg-green-400/10",
    years: "1+ ano",
    level: "Intermédio",
    concepts: ["REST APIs", "Express", "Middleware", "Auth (JWT)", "File System"],
    description:
      "O runtime que leva JavaScript para o servidor. APIs REST, middleware, autenticação — a base para qualquer backend que construo.",
    impact:
      "Uma única linguagem no full stack. Menos contexto a trocar, mais foco em resolver problemas reais.",
  },
];

// ── Hook: scroll reveal por proximidade ao centro do ecrã ────────────────
// Em vez de IntersectionObserver (que dispara na entrada da viewport e causa
// skips), calcula em cada scroll qual item tem o centro mais próximo do centro
// visível — comportamento determinístico e sem bugs nas stacks do meio.
function useActiveOnScroll(count) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const recalculate = () => {
      // Ponto de ancoragem: 35% do ecrã — suficientemente alto para que
      // o último item (Node.js) seja activado antes de sair do viewport
      const anchor = window.innerHeight * 0.35;

      let bestIndex = 0;
      let bestDistance = Infinity;

      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - anchor);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestIndex = i;
        }
      });

      setActiveIndex(bestIndex);
    };

    // Primeiro cálculo imediato ao montar
    recalculate();

    window.addEventListener("scroll", recalculate, { passive: true });
    window.addEventListener("resize", recalculate, { passive: true });
    return () => {
      window.removeEventListener("scroll", recalculate);
      window.removeEventListener("resize", recalculate);
    };
  }, [count]);

  return { activeIndex, refs };
}

// ── Componente: barra de nível ────────────────────────────────────────────
function LevelBar({ level, color }) {
  const pct = level === "Avançado" ? 85 : level === "Intermédio" ? 60 : 35;
  const colorMap = {
    yellow: "bg-yellow-400", blue: "bg-blue-400",
    white: "bg-white",       cyan: "bg-cyan-400", green: "bg-green-400",
    dark: "bg-zinc-700",
  };
  return (
    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorMap[color]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Componente: Stack Section ─────────────────────────────────────────────
function StackSection() {
  const { activeIndex, refs } = useActiveOnScroll(STACK.length);
  const active = STACK[activeIndex];
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const cardWrapRef = useRef(null);
  const lastItemRef = useRef(null);
  const [cardStyle, setCardStyle] = useState({});
  const [cardOpacity, setCardOpacity] = useState(1);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      const list = listRef.current;
      const cardWrap = cardWrapRef.current;
      const lastItem = lastItemRef.current;
      if (!section || !list || !cardWrap || !lastItem) return;

      const TOP_OFFSET = 128; // equivalente a top-32
      const listRect = list.getBoundingClientRect();
      const cardHeight = cardWrap.offsetHeight;

      // O card liberta o fixed quando o centro do último item passa o TOP_OFFSET
      const lastRect = lastItem.getBoundingClientRect();
      const lastCenter = lastRect.top + lastRect.height / 2;
      const lastItemPassed = lastCenter < TOP_OFFSET;

      // Fade out: começa quando o último item passou e o fundo da secção se aproxima
      const sectionRect = section.getBoundingClientRect();
      const fadeZone = 200;
      const distanceToEnd = sectionRect.bottom - (TOP_OFFSET + cardHeight);
      const opacity = lastItemPassed
        ? Math.max(0, Math.min(1, distanceToEnd / fadeZone))
        : 1;
      setCardOpacity(opacity);

      const shouldBeFixed = listRect.top <= TOP_OFFSET && !lastItemPassed;

      if (shouldBeFixed) {
        // Durante o scroll da lista: fixo no ecrã
        setCardStyle({
          position: "fixed",
          top: TOP_OFFSET,
          width: cardWrap.parentElement?.offsetWidth ?? "auto",
        });
      } else if (lastItemPassed) {
        // Passou o fim: ancorado ao fundo da secção
        setCardStyle({
          position: "absolute",
          top: "auto",
          bottom: 0,
          width: "100%",
        });
      } else {
        // Antes de a lista entrar: posição estática
        setCardStyle({ position: "static" });
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 max-w-6xl mx-auto">
      {/* Título */}
      <FadeIn>
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 block">Ferramentas</span>
          <h2 className="text-3xl md:text-4xl font-semibold">Stack tecnológica</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            Cada tecnologia tem um papel — rola para explorar o que aprendi com cada uma.
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

        {/* ── ESQUERDA: lista de techs ─────────────── */}
        <div ref={listRef} className="lg:w-1/2">
          {STACK.map((s, i) => (
            <div
              key={s.name}
              ref={(el) => { refs.current[i] = el; if (i === STACK.length - 1) lastItemRef.current = el; }}
              className="relative py-12 pl-6 border-b border-white/5 last:border-0 cursor-default"
            >
              {/* Barra lateral — indicador visual inequívoco do item activo */}
              <div
                className="absolute left-0 top-12 bottom-12 w-0.5 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex
                    ? (s.color === "yellow" ? "#facc15"
                     : s.color === "blue"   ? "#60a5fa"
                     : s.color === "white"  ? "#ffffff"
                     : s.color === "cyan"   ? "#22d3ee"
                     :                        "#4ade80")
                    : "#27272a"
                }}
              />

              <div className={`flex items-center gap-4 transition-all duration-300 ${
                i === activeIndex ? "opacity-100 translate-x-1" : "opacity-35"
              }`}>
                {/* Badge */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  font-bold text-sm font-mono shrink-0 border
                  transition-all duration-300
                  ${i === activeIndex
                    ? `${s.bgClass} ${s.borderClass} ${s.accentClass}`
                    : "bg-zinc-900 border-zinc-800 text-gray-600"}
                `}>
                  {s.badge}
                </div>

                {/* Nome + Nível */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`font-semibold text-lg transition-colors duration-300 ${
                      i === activeIndex ? s.accentClass : "text-gray-500"
                    }`}>
                      {s.name}
                    </span>
                    <span className={`text-xs shrink-0 transition-colors duration-300 ${
                      i === activeIndex ? "text-gray-400" : "text-gray-700"
                    }`}>{s.years}</span>
                  </div>
                  <LevelBar level={s.level} color={i === activeIndex ? s.color : "dark"} />
                </div>
              </div>

              {/* Mobile: descrição inline (só no active) */}
              <div className={`lg:hidden mt-5 overflow-hidden transition-all duration-500 ${
                i === activeIndex ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <MobileStackDetail stack={s} />
              </div>
            </div>
          ))}
        </div>

        {/* ── DIREITA: painel com posicionamento JS (só desktop) ─── */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div ref={cardWrapRef} style={{ ...cardStyle, opacity: cardOpacity, transition: "opacity 0.4s ease" }}>
            <DesktopStackDetail stack={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopStackDetail({ stack: s }) {
  return (
    <div
      key={s.name}
      className={`rounded-2xl border p-8 bg-zinc-900/60 transition-all duration-400 ${s.borderClass}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg font-mono border ${s.bgClass} ${s.borderClass} ${s.accentClass}`}>
          {s.badge}
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${s.accentClass}`}>{s.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded border ${s.bgClass} ${s.borderClass} ${s.accentClass}`}>
              {s.level}
            </span>
            <span className="text-xs text-gray-600">{s.years}</span>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-gray-300 leading-relaxed text-sm mb-6">{s.description}</p>

      {/* Impacto */}
      <div className={`rounded-xl p-4 mb-6 ${s.bgClass} border ${s.borderClass}`}>
        <p className={`text-xs uppercase tracking-widest mb-1 ${s.accentClass}`}>Impacto no meu desenvolvimento</p>
        <p className="text-gray-300 text-sm leading-relaxed">{s.impact}</p>
      </div>

      {/* Conceitos */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Conceitos dominados</p>
        <div className="flex flex-wrap gap-2">
          {s.concepts.map((c) => (
            <span key={c} className={`text-xs px-3 py-1 rounded-lg border ${s.bgClass} ${s.borderClass} ${s.accentClass}`}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileStackDetail({ stack: s }) {
  return (
    <div className={`rounded-xl border p-4 ${s.bgClass} ${s.borderClass}`}>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">{s.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {s.concepts.map((c) => (
          <span key={c} className={`text-xs px-2 py-0.5 rounded border ${s.borderClass} ${s.accentClass}`}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Componente: Stats rápidas no Hero ─────────────────────────────────────
function HeroStats() {
  const ALL_PROJECTS = getAllProjects();
  const stats = useMemo(() => ({
    projects: ALL_PROJECTS.length,
    techs: new Set(ALL_PROJECTS.flatMap((p) => p.tech ?? [])).size,
  }), []);

  return (
    <div className="flex items-center gap-6 justify-center text-sm text-gray-500">
      <span><span className="text-yellow-400 font-semibold">{stats.projects}</span> projectos</span>
      <span className="w-px h-4 bg-gray-700" />
      <span><span className="text-yellow-400 font-semibold">{stats.techs}</span> tecnologias</span>
      <span className="w-px h-4 bg-gray-700" />
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Disponível
      </span>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
export default function Home() {
  const CATEGORIES = getCategories();
  const ALL_PROJECTS = getAllProjects();

  const countByType = useMemo(() =>
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.key] = ALL_PROJECTS.filter((p) => p.type === cat.key).length;
      return acc;
    }, {}),
  []);

  return (
    <main className="text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-6 mx-auto max-w-5xl min-h-[clamp(540px,calc(100vh-90px),860px)] justify-center pt-20 pb-16 gap-7">

        {/* Fundo: grid sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge de disponibilidade */}
        <FadeItem direction="down" delay={0}>
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/25 bg-green-400/8 text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Disponível para novos projectos
          </div>
        </FadeItem>

        {/* Título */}
        <FadeItem direction="down" delay={0.1}>
          <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight max-w-3xl">
            Transformo ideias em{" "}
            <span className="text-yellow-400">experiências web</span>{" "}
            modernas
          </h1>
        </FadeItem>

        {/* Subtítulo */}
        <FadeItem direction="up" delay={0.2}>
          <p className="relative z-10 text-gray-400 max-w-lg text-base sm:text-lg leading-relaxed">
            Desenvolvedor FullStack focado em construir aplicações rápidas,
            acessíveis e com uma experiência de utilizador que se destaca.
          </p>
        </FadeItem>

        {/* CTAs */}
        <FadeItem direction="up" delay={0.35}>
          <div className="relative z-10 flex flex-wrap gap-3 justify-center">
            <Link
              href="/projects"
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Ver projectos
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-yellow-400/40 text-yellow-400 rounded-xl hover:bg-yellow-400/10 transition-all duration-200"
            >
              Entrar em contacto
            </Link>
          </div>
        </FadeItem>

        {/* Stats rápidas */}
        <FadeItem direction="up" delay={0.5}>
          <div className="relative z-10">
            <HeroStats />
          </div>
        </FadeItem>
      </section>

      {/* ── PROPOSTA DE VALOR ─────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 block">Abordagem</span>
            <h2 className="text-3xl md:text-4xl font-semibold">Mais do que código</h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Performance",
              accent: "text-yellow-400",
              border: "border-yellow-500/20 hover:border-yellow-400/40",
              bg: "hover:bg-yellow-400/5",
              desc: "Aplicações optimizadas para velocidade real. Core Web Vitals, lazy loading e render strategies que fazem diferença na experiência.",
            },
            {
              icon: "🎯",
              title: "UX/UI",
              accent: "text-blue-400",
              border: "border-blue-500/20 hover:border-blue-400/40",
              bg: "hover:bg-blue-400/5",
              desc: "Interfaces que o utilizador entende sem pensar. Hierarquia visual, feedback de estado e acessibilidade integrados desde o início.",
            },
            {
              icon: "🧠",
              title: "Evolução contínua",
              accent: "text-emerald-400",
              border: "border-emerald-500/20 hover:border-emerald-400/40",
              bg: "hover:bg-emerald-400/5",
              desc: "Cada projecto é uma oportunidade de aprender algo novo. Não estou estagnado — estou a construir fundamentos sólidos para escalar.",
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.15}>
              <div className={`group p-7 border rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full ${item.border} ${item.bg}`}>
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className={`text-xl font-semibold mb-3 ${item.accent}`}>{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CATEGORIAS DE PROJECTOS ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-950/60 border-y border-yellow-500/5">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 block">Portfólio</span>
              <h2 className="text-3xl md:text-4xl font-semibold">Projectos por área</h2>
              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
                Três áreas de especialização, cada uma com o seu foco e desafios próprios.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={cat.key} delay={0.1 + i * 0.1}>
                <BigCategoryCard cat={cat} count={countByType[cat.key] ?? 0} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="text-center mt-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-yellow-400/30 text-yellow-400 rounded-xl hover:bg-yellow-400/10 transition text-sm font-medium"
              >
                Ver todos os projectos
                <span>→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STACK COM SCROLL REVEAL ───────────────────────────────────── */}
      <StackSection />

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-yellow-400/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto border-t border-yellow-500/10 pt-20">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">Próximo passo</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Vamos construir algo{" "}
              <span className="text-yellow-400">juntos?</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-gray-400 mb-10 text-base leading-relaxed">
              Estou disponível para novos projectos, colaborações ou oportunidades.
              Basta uma mensagem para começarmos.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Entrar em contacto
              </Link>
              <Link
                href="/about"
                className="px-8 py-3.5 border border-white/10 text-gray-300 rounded-xl hover:border-white/25 hover:text-white transition"
              >
                Sobre mim
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}