"use client";

// components/admin/MessagesTable.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiCheck, FiMail, FiCornerUpLeft, FiX } from "react-icons/fi";
import DataTable from "@/components/admin/DataTable";
import ActionButton from "@/components/admin/ActionButton";
import { markMessageRead, markMessageReplied, deleteMessage } from "@/lib/admin/messages";

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MessagesTable({ items }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const [active, setActive] = useState(null);

  function openMessage(m) {
    setActive(m);
    if (!m.read) markMessageRead(m.id, true).then(refresh);
  }

  const columns = [
    {
      key: "from",
      header: "De",
      render: (m) => (
        <button onClick={() => openMessage(m)} className="flex flex-col text-left">
          <span className={`text-sm ${m.read ? "text-gray-400" : "text-white font-medium"}`}>{m.name}</span>
          <span className="text-xs text-gray-600">{m.email}</span>
        </button>
      ),
    },
    {
      key: "subject",
      header: "Assunto",
      render: (m) => (
        <button onClick={() => openMessage(m)} className="text-left text-sm text-gray-300 hover:text-yellow-400">
          {m.subject || <em className="text-gray-600">— sem assunto —</em>}
        </button>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (m) => (
        <div className="flex flex-wrap gap-1">
          {!m.read && <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-xs text-yellow-400">Novo</span>}
          {m.replied && <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Respondido</span>}
          {m.read && !m.replied && <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-gray-400">Lido</span>}
        </div>
      ),
    },
    { key: "created_at", header: "Data", render: (m) => <span className="text-xs text-gray-500">{fmtDate(m.created_at)}</span> },
    {
      key: "actions",
      header: "Acções",
      className: "text-right",
      headerClassName: "text-right",
      render: (m) => (
        <div className="flex items-center justify-end gap-1">
          <ActionButton
            title={m.replied ? "Marcar como não respondido" : "Marcar como respondido"}
            onAction={() => markMessageReplied(m.id, !m.replied)}
            onDone={refresh}
            className={m.replied ? "text-green-400" : "text-gray-400 hover:text-green-400"}
          >
            <FiCornerUpLeft />
          </ActionButton>
          <ActionButton
            title={m.read ? "Marcar como não lido" : "Marcar como lido"}
            onAction={() => markMessageRead(m.id, !m.read)}
            onDone={refresh}
            className={m.read ? "text-gray-600 hover:text-gray-300" : "text-gray-400 hover:text-green-400"}
          >
            {m.read ? <FiMail /> : <FiCheck />}
          </ActionButton>
          <ActionButton
            title="Eliminar"
            confirm="Eliminar esta mensagem?"
            onAction={() => deleteMessage(m.id)}
            onDone={refresh}
            className="text-gray-500 hover:text-red-400"
          >
            <FiTrash2 />
          </ActionButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={items} />

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-yellow-500/15 bg-zinc-950 p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{active.subject || "— sem assunto —"}</h3>
                  <p className="mt-1 text-sm text-gray-400">{active.name} · {active.email}</p>
                  <p className="mt-0.5 text-xs text-gray-600">{fmtDate(active.created_at)}</p>
                </div>
                <button onClick={() => setActive(null)} className="rounded-lg p-1.5 text-gray-500 hover:text-white">
                  <FiX className="text-xl" />
                </button>
              </div>
              <p className="whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-gray-200">
                {active.message}
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject || "")}`}
                  onClick={() => markMessageReplied(active.id, true).then(refresh)}
                  className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
                >
                  <FiCornerUpLeft /> Responder por email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
