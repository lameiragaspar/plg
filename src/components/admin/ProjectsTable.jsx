"use client";

// components/admin/ProjectsTable.jsx
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import DataTable from "@/components/admin/DataTable";
import ActionButton from "@/components/admin/ActionButton";
import { StatusBadge, TypeBadge } from "@/components/admin/ui";
import { deleteProject, setProjectStatus, toggleFeatured } from "@/lib/admin/projects";

export default function ProjectsTable({ projects }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  const columns = [
    {
      key: "title",
      header: "Projecto",
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{p.title}</span>
          <span className="font-mono text-xs text-gray-600">/{p.slug}</span>
        </div>
      ),
    },
    { key: "type", header: "Tipo", render: (p) => <TypeBadge type={p.type} /> },
    {
      key: "status",
      header: "Estado",
      render: (p) => (
        <select
          defaultValue={p.status}
          onChange={(e) =>
            setProjectStatus(p.id, e.target.value).then(refresh)
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-gray-200 outline-none focus:border-yellow-400/40"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      ),
    },
    {
      key: "featured",
      header: "Destaque",
      render: (p) => (
        <button
          type="button"
          onClick={() => toggleFeatured(p.id, !p.featured).then(refresh)}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            p.featured
              ? "bg-yellow-400/15 text-yellow-400"
              : "bg-zinc-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          {p.featured ? "Sim" : "Não"}
        </button>
      ),
    },
    {
      key: "stats",
      header: "Likes / Views",
      render: (p) => (
        <span className="font-mono text-xs text-gray-400">
          {p.likes_count} · {p.views_count}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acções",
      className: "text-right",
      headerClassName: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/projects`}
            target="_blank"
            title="Ver no site"
            className="rounded-lg p-1.5 text-gray-500 hover:text-yellow-400"
          >
            <FiEye />
          </Link>
          <Link
            href={`/admin/projects/${p.id}`}
            title="Editar"
            className="rounded-lg p-1.5 text-gray-400 hover:text-yellow-400"
          >
            <FiEdit2 />
          </Link>
          <ActionButton
            title="Eliminar"
            confirm={`Eliminar "${p.title}"? Esta acção é irreversível.`}
            onAction={() => deleteProject(p.id)}
            onDone={refresh}
            className="text-gray-500 hover:text-red-400"
          >
            <FiTrash2 />
          </ActionButton>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={projects} />;
}
