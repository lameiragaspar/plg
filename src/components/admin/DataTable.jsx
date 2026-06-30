"use client";

// components/admin/DataTable.jsx
// Tabela genérica e reutilizável. No desktop renderiza <table>; em mobile
// degrada para uma lista de cartões. As colunas definem como renderizar cada
// célula via render(row).
//
// columns: [{ key, header, render?(row), className?, headerClassName? }]
// rows: array de objectos (precisam de `id` único)
import { motion } from "framer-motion";

export default function DataTable({ columns, rows, getRowKey }) {
  const keyOf = getRowKey || ((r) => r.id);

  if (!rows?.length) return null;

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-yellow-500/10 md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-medium ${c.headerClassName || ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {rows.map((row) => (
              <tr key={keyOf(row)} className="bg-black transition-colors hover:bg-zinc-950">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle text-gray-300 ${c.className || ""}`}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — cartões */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <motion.div
            key={keyOf(row)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-yellow-500/10 bg-zinc-950 p-4"
          >
            {columns.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-3 py-1.5">
                <span className="text-xs uppercase tracking-wider text-gray-600">{c.header}</span>
                <span className="text-right text-sm text-gray-300">
                  {c.render ? c.render(row) : row[c.key]}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </>
  );
}
