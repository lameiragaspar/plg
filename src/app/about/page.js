"use client";

import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen text-white px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">

      {/* 🔥 INTRO */}
      <section className="text-center mb-16">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre mim
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 max-w-xl mx-auto">
            Desenvolvedor FullStack em evolução, focado em construir aplicações modernas,
            rápidas e com boa experiência para o usuário.
          </p>
        </FadeIn>
      </section>

      {/* 📖 JORNADA */}
      <section className="border-t border-yellow-500/10 pt-12 mb-20 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">
            Minha jornada
          </h2>
        </FadeIn>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <FadeIn delay={0.2}>
            <p>
              Comecei na programação com curiosidade e rapidamente percebi que
              queria transformar isso em algo sério. Desde então, venho estudando
              e praticando constantemente, criando projetos próprios para aplicar
              o que aprendo.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p>
              Hoje, meu foco está em evoluir como desenvolvedor FullStack,
              entendendo profundamente tanto o frontend quanto o backend e como
              ambos se conectam em aplicações reais.
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p>
              Este portfólio é parte desse processo: um espaço onde experimento,
              aplico conhecimento e evoluo continuamente.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 🎯 FOCO */}
      <section className="border-t border-yellow-500/10 pt-12 mb-20">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-10">
            No que estou focado agora
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">

          {[
            {
              title: "⚙️ Backend",
              desc: "Construção de APIs, bases de dados e lógica de aplicações.",
            },
            {
              title: "🌐 FullStack",
              desc: "Integração completa entre frontend e backend.",
            },
            {
              title: "🚀 Projectos reais",
              desc: "Aplicação prática de conhecimentos em projectos reais.",
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <div className="h-full flex flex-col p-6 border border-yellow-500/10 rounded-xl hover:border-yellow-400/40 hover:-translate-y-1 transition">
                <h3 className="text-yellow-400 mb-2 font-medium">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </FadeIn>
          ))}

        </div>
      </section>

      {/* 💡 DIFERENCIAL */}
      <section className="border-t border-yellow-500/10 pt-12 mb-20 text-center max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">
            O que me diferencia
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400">
            Estou em constante evolução e não tenho medo de aprender coisas novas.
            Cada projecto é uma oportunidade de melhorar, testar ideias e crescer
            como desenvolvedor.
          </p>
        </FadeIn>
      </section>

      {/* 📩 CTA */}
      <section className="border-t border-yellow-500/10 pt-12 text-center">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">
            Vamos construir algo juntos?
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 mb-8">
            Estou disponível para novos projectos, colaborações ou oportunidades.
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