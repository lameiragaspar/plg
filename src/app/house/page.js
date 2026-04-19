"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { FadeItem } from "@/components/HeroAnimation";

export default function Home() {
  return (
    <main className="text-white overflow-x-hidden">

      {/*INTRO <section className="min-h-screen flex flex-col justify-center items-center text-center px-6"> */}
      <section
        className="
          flex flex-col items-center text-center px-6 mx-auto max-w-7xl

          min-h-[clamp(500px,calc(100vh-90px),800px)]

          justify-center
          pt-20 md:pt-24
          pb-12 md:pb-16
          gap-6
        "
      >
        <FadeItem direction="down" delay={0}>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Transformo ideias em experiências web{" "}
            <span className="text-yellow-400">modernas</span>
          </h1>
        </FadeItem>

        <FadeItem direction="up" delay={0.2}>
          <p className="text-gray-400 max-w-xl text-lg">
            Desenvolvedor FullStack em evolução, focado em criar aplicações rápidas,
            funcionais e com boa experiência para o usuário.
          </p>
        </FadeItem>

        <FadeItem direction="up" delay={0.4}>
          <div className="flex gap-4 mt-2">
            <Link
              href="/projects"
              className="px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition"
            >
              Ver projetos
            </Link>

            <Link
              href="/contact"
              className="px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition"
            >
              Contacto
            </Link>
          </div>
        </FadeItem>
      </section>

      {/* VALOR */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-10">
            Mais do que código
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {["Performance", "UX/UI", "Evolução"].map((item, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <div className="p-6 border border-yellow-500/10 rounded-xl hover:border-yellow-400/40 transition hover:-translate-y-1 transition">
                <h3 className="text-xl font-medium mb-3 text-yellow-400">
                  {item === "Performance" && "⚡"}
                  {item === "UX/UI" && "🎯"}
                  {item === "Evolução" && "🧠"} {item}
                </h3>
                <p className="text-gray-400">
                  {item === "Performance" &&
                    "Aplicações rápidas e otimizadas."}
                  {item === "UX/UI" &&
                    "Interfaces modernas e intuitivas."}
                  {item === "Evolução" &&
                    "Sempre aprendendo novas tecnologias."}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/*PROJECTOS */}
      <section className="py-20 px-6 bg-black/40">
        <div className="max-w-6xl mx-auto">

          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              Projectos em destaque
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">

            {["Frontend", "Backend"].map((item, i) => (
              <FadeIn key={item} delay={i * 0.2}>
                <div className="p-6 border border-yellow-500/10 rounded-xl hover:border-yellow-400/40 transition hover:-translate-y-1 transition">
                  <h3 className="text-xl font-medium mb-2">
                    Projecto {item}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Pequena descrição do projecto e o que ele resolve.
                  </p>
                  <Link
                    href={`/projects/${item.toLowerCase()}`}
                    className="text-yellow-400 hover:underline"
                  >
                    Ver mais →
                  </Link>
                </div>
              </FadeIn>
            ))}

          </div>

          <FadeIn delay={0.4}>
            <div className="text-center mt-10">
              <Link
                href="/projects"
                className="px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition"
              >
                Ver todos os projectos
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/*STACK */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-10">
            Stack
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Tecnologias modernas focadas em performance e escalabilidade.
          </p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-4">
          {["JavaScript", "React", "Next.js", "Tailwind", "Node.js"].map(
            (tech, i) => (
              <FadeIn key={tech} delay={i * 0.1}>
                <span className="px-4 py-2 border border-yellow-500/20 rounded-lg text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition">
                  {tech}
                </span>
              </FadeIn>
            )
          )}
        </div>
      </section>

      {/* CTA FINAL  */}
      <section className="py-20 px-6 text-center bg-black/40">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Vamos construir algo juntos?
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 mb-8">
            Estou disponível para novos projectos e oportunidades.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Link
            href="/contact"
            className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition"
          >
            Entrar em contacto
          </Link>
        </FadeIn>
      </section>

    </main>
  );
}