import Link from "next/link";
import { FadeItem } from "@/components/HeroAnimation";

export default function HeroCtas() {
  return (
    <FadeItem direction="up" delay={0.35}>
      <div className="relative z-10 flex flex-wrap gap-3 justify-center">
        <Link
          href="/projects"
          className="px-6 py-3 sm:min-w-[180px] text-center bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Ver projectos
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 sm:min-w-[180px] text-center border border-yellow-400/40 text-yellow-400 rounded-xl hover:bg-yellow-400/10 transition-all duration-200"
        >
          Entrar em contacto
        </Link>
      </div>
    </FadeItem>
  );
}