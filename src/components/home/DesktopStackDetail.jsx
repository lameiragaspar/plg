export default function DesktopStackDetail({ stack: s }) {
  return (
    <div
      key={s.name}
      className={`rounded-2xl border p-8 bg-zinc-900/60 transition-all duration-400 ${s.borderClass}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg font-mono border ${s.bgClass} ${s.borderClass} ${s.accentClass}`}>
          {s.badge}
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${s.accentClass}`}>{s.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded border ${s.bgClass} ${s.borderClass} ${s.accentClass}`}>
              {s.level}
            </span>
            <span className="text-xs text-gray-600">{s.years}</span>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-gray-300 leading-relaxed text-sm mb-6">{s.description}</p>

      {/* Impacto */}
      <div className={`rounded-xl p-4 mb-6 ${s.bgClass} border ${s.borderClass}`}>
        <p className={`text-xs uppercase tracking-widest mb-1 ${s.accentClass}`}>Impacto no meu desenvolvimento</p>
        <p className="text-gray-300 text-sm leading-relaxed">{s.impact}</p>
      </div>

      {/* Conceitos */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Conceitos dominados</p>
        <div className="flex flex-wrap gap-2">
          {s.concepts.map((c) => (
            <span key={c} className={`text-xs px-3 py-1 rounded-lg border ${s.bgClass} ${s.borderClass} ${s.accentClass}`}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}