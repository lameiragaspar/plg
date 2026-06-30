// components/admin/ui.jsx — primitivas UI partilhadas do painel (Server-safe)
// Sem "use client" — são apenas markup, podem render no servidor.

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const STATUS_STYLES = {
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  draft: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  archived: "bg-zinc-700/30 text-gray-400 border-zinc-600/30",
};

const STATUS_LABEL = {
  published: "Publicado",
  draft: "Rascunho",
  archived: "Arquivado",
};

export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

const TYPE_LABEL = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
};

export function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700/50 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-gray-300">
      {TYPE_LABEL[type] || type}
    </span>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 py-16 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-yellow-500/10 bg-zinc-950 p-5 ${className}`}>
      {children}
    </div>
  );
}
