// Fonte única de dados estáticos da HomePage

export const STACK = [
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

export const VALUE_PROPS = [
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
];