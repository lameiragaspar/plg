"use client";

import { useMemo } from "react";
import HeroSection from "./home/HeroSection";
import HeroCtas from "./home/HeroCtas";
import ValuePropsSection from "./home/ValuePropsSection";
import ProjectCategoriesSection from "./home/ProjectCategoriesSection";
import StackSection from "./home/StackSection";
import FinalCta from "./home/FinalCta";

export default function HomePageClient({ initialProjects = [], categories = [] }) {
  const countByType = useMemo(() =>
    categories.reduce((acc, cat) => {
      acc[cat.key] = initialProjects.filter((p) => p.type === cat.key).length;
      return acc;
    }, {}),
  [initialProjects, categories]);

  return (
    <main className="text-white overflow-x-hidden">
      <HeroSection initialProjects={initialProjects} />
      <HeroCtas />
      <ValuePropsSection />
      <ProjectCategoriesSection categories={categories} countByType={countByType} />
      <StackSection />
      <FinalCta />
    </main>
  );
}