const COLOR_MAP = {
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  white: "bg-white",
  cyan: "bg-cyan-400",
  green: "bg-green-400",
  dark: "bg-zinc-700",
};

const LEVEL_PCT = {
  Avançado: 85,
  Intermédio: 60,
};

export default function LevelBar({ level, color }) {
  const pct = LEVEL_PCT[level] ?? 35;
  return (
    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${COLOR_MAP[color]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}