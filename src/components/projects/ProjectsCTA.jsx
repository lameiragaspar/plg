"use client";

// components/projects/ProjectsCTA.jsx
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function ProjectsCTA({ ctaCfg }) {
  return (
    <section className="py-20 px-4 text-center mt-20 border-t border-yellow-500/10">
      <FadeIn>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
          {ctaCfg.heading}
        </h2>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">{ctaCfg.sub}</p>
      </FadeIn>
      <FadeIn delay={0.4}>
        <Link
          href="/contact"
          className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition w-full sm:w-auto text-center"
        >
          {ctaCfg.cta}
        </Link>
      </FadeIn>
    </section>
  );
}