"use client";

import ProjectsLayout from "@/components/ProjectsLayout";

// Dados dos projetos
// Quando tiver backend, isto vem de uma fetch/API.
const projects = [
  {
    id: 1,
    type: "frontend",
    title: "Landing Moderna",
    description: "Interface com foco em conversão e performance otimizada.",
    image:
      "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
    tech: ["Next.js", "Tailwind"],
    likes: 120,
    github: "#",
    deploy: "https://landing-moderna.vercel.app",
  },
  {
    id: 2,
    type: "frontend",
    title: "Dashboard UI",
    description: "Painel interativo com visualização de dados e gráficos.",
    image:
      "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
    tech: ["React", "Chart.js"],
    likes: 85,
    github: "#",
    deploy: "#",
  },
  {
    id: 3,
    type: "frontend",
    title: "E-shop Minimalista",
    description:
      "Experiência de compra fluida com foco em acessibilidade e design clean.",
    image:
      "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg",
    tech: ["Next.js", "Framer Motion"],
    likes: 215,
    github: "#",
    deploy: "https://eshop-minimal.vercel.app",
  },
];

//Página
export default function FrontendProjectsPage() {
  return (
    <ProjectsLayout
      category="Frontend"
      description="Interfaces modernas, animações e experiências focadas no utilizador. Foco total em"
      tagline="performance e acessibilidade."
      projects={projects}
      relatedCategories={[
        { title: "Backend", link: "/projects/backend" },
        { title: "Fullstack", link: "/projects/fullstack" },
      ]}
      
    />
  );
}