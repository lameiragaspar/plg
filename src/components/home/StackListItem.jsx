import LevelBar from "./LevelBar";
import MobileStackDetail from "./MobileStackDetail";

// Cor da barra lateral por nome de cor semântico
const ACCENT_COLOR = {
  yellow: "#facc15",
  blue: "#60a5fa",
  white: "#ffffff",
  cyan: "#22d3ee",
  green: "#4ade80",
};

export default function StackListItem({ stack: s, index, activeIndex, itemRef }) {
  const isActive = index === activeIndex;
  const sidebarColor = isActive ? (ACCENT_COLOR[s.color] ?? "#facc15") : "#27272a";

  return (
    <div
      ref={itemRef}
      className="relative py-12 pl-6 border-b border-white/5 last:border-0 cursor-default"
    >
      {/* Barra lateral — indicador visual inequívoco do item activo */}
      <div
        className="absolute left-0 top-12 bottom-12 w-0.5 rounded-full transition-all duration-300"
        style={{ background: sidebarColor }}
      />

      <div className={`flex items-center gap-4 transition-all duration-300 ${
        isActive ? "opacity-100 translate-x-1" : "opacity-35"
      }`}>
        {/* Badge */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          font-bold text-sm font-mono shrink-0 border
          transition-all duration-300
          ${isActive
            ? `${s.bgClass} ${s.borderClass} ${s.accentClass}`
            : "bg-zinc-900 border-zinc-800 text-gray-600"}
        `}>
          {s.badge}
        </div>

        {/* Nome + Nível */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`font-semibold text-lg transition-colors duration-300 ${
              isActive ? s.accentClass : "text-gray-500"
            }`}>
              {s.name}
            </span>
            <span className={`text-xs shrink-0 transition-colors duration-300 ${
              isActive ? "text-gray-400" : "text-gray-700"
            }`}>{s.years}</span>
          </div>
          <LevelBar level={s.level} color={isActive ? s.color : "dark"} />
        </div>
      </div>

      {/* Mobile: descrição inline (só no active) */}
      <div className={`lg:hidden mt-5 overflow-hidden transition-all duration-500 ${
        isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <MobileStackDetail stack={s} />
      </div>
    </div>
  );
}