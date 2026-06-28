import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function FinalCta() {
  return (
    <section className="relative py-28 px-6 text-center overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto border-t border-yellow-500/10 pt-20">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">Próximo passo</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Vamos construir algo{" "}
            <span className="text-yellow-400">juntos?</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-gray-400 mb-10 text-base leading-relaxed">
            Estou disponível para novos projectos, colaborações ou oportunidades.
            Basta uma mensagem para começarmos.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition w-full sm:w-auto text-center"
            >
              Entrar em contacto
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-yellow-500/20 text-gray-400 rounded-xl hover:border-yellow-400/50 hover:text-white transition w-full sm:w-auto text-center"
            >
              Sobre mim
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}