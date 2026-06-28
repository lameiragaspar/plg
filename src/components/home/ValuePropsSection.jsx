import FadeIn from "@/components/FadeIn";
import { VALUE_PROPS } from "../../lib/constants/homePageConfig";

export default function ValuePropsSection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <FadeIn>
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3 block">Abordagem</span>
          <h2 className="text-3xl md:text-4xl font-semibold">Mais do que código</h2>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-6">
        {VALUE_PROPS.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.15}>
            <div className={`group p-7 border rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full ${item.border} ${item.bg}`}>
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className={`text-xl font-semibold mb-3 ${item.accent}`}>{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}