"use client";

// components/projects/ProjectsBreadcrumb.jsx
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function ProjectsBreadcrumb({ category, accentClass }) {
  return (
    <nav className="text-center mb-8 text-sm font-medium">
      <FadeIn>
        <span className="font-mono text-sm mb-2 block uppercase tracking-widest">
          <Link href="/projects" className="text-gray-500 hover:text-yellow-400 transition cursor-pointer">
            Projetos
          </Link>
          <span className={accentClass}> / {category}</span>
        </span>
      </FadeIn>
    </nav>
  );
}