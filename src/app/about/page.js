"use client";

import FadeIn from "@/components/FadeIn";

export default function About() {
  return (
    <main className="text-white">

      {/* 👤 INTRO */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6 max-w-3xl mx-auto relative">

        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre mim
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 text-lg">
            Sou um Desenvolvedor FullStack em constante evolução, apaixonado por
            tecnologia e pela construção de aplicações modernas, rápidas e úteis.
          </p>
        </FadeIn>

        {/*SCROLL INDICATOR */}
        <FadeIn delay={0.6}>
          <div className="absolute bottom-10 flex flex-col items-center text-gray-500 animate-bounce">
            <span className="text-sm">Scroll</span>
            <span className="text-xl">↓</span>
          </div>
        </FadeIn>
      </section>

      {/*HISTÓRIA */}
      <section className="py-20 max-w-4xl mx-auto px-6 border-t border-yellow-500/10">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">
            Minha jornada
          </h2>
        </FadeIn>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <FadeIn delay={0.2}>
            <p>
              Comecei na programação com curiosidade e rapidamente percebi que
              queria transformar isso em algo sério. Desde então, tenho estudado
              e praticado constantemente, desenvolvendo projetos próprios para
              aplicar o que aprendo.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p>
              Atualmente estou focado em evoluir tanto no frontend quanto no
              backend, construindo aplicações completas e entendendo melhor como
              tudo se conecta — desde a interface até a lógica por trás.
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p>
              Este portfólio é parte desse processo: um espaço onde aplico,
              experimento e evoluo como desenvolvedor.
            </p>
          </FadeIn>
        </div>
      </section>

      {/*FOCO */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-10">
            No que estou focado agora
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">

          {[
            { title: "⚙️ Backend", desc: "APIs, bases de dados e lógica." },
            { title: "🌐 FullStack", desc: "Integração completa." },
            { title: "🚀 Projectos", desc: "Aplicações reais." },
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

      {/*DIFERENCIAL */}
      <section className="py-20 max-w-4xl mx-auto text-center px-6">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">
            O que me diferencia
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estou em constante evolução e não tenho medo de aprender coisas novas.
            Cada projeto é uma oportunidade de melhorar, testar ideias e crescer
            como desenvolvedor.
          </p>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6 border-t border-yellow-500/10">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">
            Vamos conectar?
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-gray-400 mb-8">
            Estou aberto a oportunidades, colaborações ou apenas trocar ideias.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <a
            href="/contact"
            className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition"
          >
            Entrar em contacto
          </a>
        </FadeIn>
      </section>

    </main>
  );
}