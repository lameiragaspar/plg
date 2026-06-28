export default function MobileStackDetail({ stack: s }) {
  return (
    <div className={`rounded-xl border p-4 ${s.bgClass} ${s.borderClass}`}>
      <p className="text-gray-300 text-sm leading-relaxed mb-3">{s.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {s.concepts.map((c) => (
          <span key={c} className={`text-xs px-2 py-0.5 rounded border ${s.borderClass} ${s.accentClass}`}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}