"use client";

// components/admin/FeedbackTable.jsx
import { useRouter } from "next/navigation";
import { FiTrash2, FiCheck, FiMail } from "react-icons/fi";
import DataTable from "@/components/admin/DataTable";
import ActionButton from "@/components/admin/ActionButton";
import { markFeedbackRead, deleteFeedback } from "@/lib/admin/feedback";

function Stars({ n }) {
  return (
    <span className="text-yellow-400" title={`${n}/5`}>
      {"★".repeat(n)}
      <span className="text-zinc-700">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FeedbackTable({ items }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  const columns = [
    {
      key: "comment",
      header: "Comentário",
      render: (f) => (
        <div className="flex flex-col gap-1 max-w-md">
          <span className={`text-sm ${f.is_read ? "text-gray-400" : "text-white font-medium"}`}>
            {f.comment || <em className="text-gray-600">— sem comentário —</em>}
          </span>
          <span className="text-xs text-gray-600">
            {f.page || "—"}{f.projects?.title ? ` · ${f.projects.title}` : ""}
          </span>
        </div>
      ),
    },
    { key: "rating", header: "Rating", render: (f) => <Stars n={f.rating} /> },
    {
      key: "is_read",
      header: "Estado",
      render: (f) =>
        f.is_read ? (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-gray-400">Lido</span>
        ) : (
          <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-xs text-yellow-400">Novo</span>
        ),
    },
    { key: "created_at", header: "Data", render: (f) => <span className="text-xs text-gray-500">{fmtDate(f.created_at)}</span> },
    {
      key: "actions",
      header: "Acções",
      className: "text-right",
      headerClassName: "text-right",
      render: (f) => (
        <div className="flex items-center justify-end gap-1">
          <ActionButton
            title={f.is_read ? "Marcar como não lido" : "Marcar como lido"}
            onAction={() => markFeedbackRead(f.id, !f.is_read)}
            onDone={refresh}
            className={f.is_read ? "text-gray-600 hover:text-gray-300" : "text-gray-400 hover:text-green-400"}
          >
            {f.is_read ? <FiMail /> : <FiCheck />}
          </ActionButton>
          <ActionButton
            title="Eliminar"
            confirm="Eliminar este feedback?"
            onAction={() => deleteFeedback(f.id)}
            onDone={refresh}
            className="text-gray-500 hover:text-red-400"
          >
            <FiTrash2 />
          </ActionButton>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={items} />;
}
