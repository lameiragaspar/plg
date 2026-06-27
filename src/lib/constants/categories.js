// lib/categories.js
// Dados estáticos das categorias — seguro para importar em Client Components.
// Sem dependências de servidor, sem env vars, sem supabase.

export function getCategories() {
  return [
    {
      key:         "frontend",
      title:       "Frontend",
      link:        "/projects/frontend",
      description: "Interfaces, animações e experiências visuais.",
      icon:        "🖥",
      accent:      "yellow",
      accentClass: "text-yellow-400",
      borderClass: "border-yellow-400/30",
      hoverBg:     "hover:bg-yellow-400/5",
    },
    {
      key:         "backend",
      title:       "Backend",
      link:        "/projects/backend",
      description: "APIs, lógica de negócio e infraestrutura.",
      icon:        "⚙️",
      accent:      "blue",
      accentClass: "text-blue-400",
      borderClass: "border-blue-400/30",
      hoverBg:     "hover:bg-blue-400/5",
    },
    {
      key:         "fullstack",
      title:       "Fullstack",
      link:        "/projects/fullstack",
      description: "Produtos completos do front ao banco de dados.",
      icon:        "⚡",
      accent:      "emerald",
      accentClass: "text-emerald-400",
      borderClass: "border-emerald-400/30",
      hoverBg:     "hover:bg-emerald-400/5",
    },
  ];
}