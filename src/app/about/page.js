// app/about/page.js  — Server Component
import { fetchAboutStats } from "@/lib/Projects";
import About from "@/components/AboutPage";

export const metadata = {
  title: "Sobre | PLG Dev",
  description:
    "Desenvolvedor FullStack baseado em Luanda. Conheça a jornada, stack técnica e abordagem de Pedro Lameira Gaspar.",
};

export default async function AboutPage() {
  let stats = { projects: 0, techs: 0 };
  try {
    stats = await fetchAboutStats();
  } catch (err) {
    console.error("[AboutPage] Erro ao buscar stats:", err);
  }

  return <About initialStats={stats} />;
}