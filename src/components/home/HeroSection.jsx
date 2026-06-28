import FadeIn from "@/components/FadeIn";
import { FadeItem } from "@/components/HeroAnimation";
import HeroStats from "@/components/Herostats";

export default function HeroSection({ initialProjects }) {
  return (
    <section className="relative flex flex-col items-center text-center px-6 mx-auto max-w-5xl min-h-[clamp(540px,calc(100vh-90px),860px)] justify-center pt-26 pb-16 gap-7">

      {/* Fundo: grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Badge de disponibilidade
      <FadeItem direction="down" delay={0}>
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/25 bg-green-400/8 text-green-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Disponível para novos projectos
        </div>
      </FadeItem>
      */}

      {/* Título */}
      <FadeItem direction="down" delay={0}>
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight max-w-3xl">
          Transformo ideias em{" "}
          <span className="text-yellow-400">experiências web</span>{" "}
          modernas
        </h1>
      </FadeItem>

      {/* Subtítulo */}
      <FadeItem direction="up" delay={0.2}>
        <p className="relative z-10 text-gray-400 max-w-lg text-base sm:text-lg leading-relaxed">
          Desenvolvedor FullStack focado em construir aplicações rápidas,
          acessíveis e com uma experiência de utilizador que se destaca.
        </p>
      </FadeItem>

      {/* Stats rápidas */}
      <FadeItem direction="up" delay={0.5}>
        <div className="relative z-10">
          <HeroStats projects={initialProjects} />
        </div>
      </FadeItem>
    </section>
  );
}