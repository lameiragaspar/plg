// app/admin/(panel)/projects/page.js — Listagem de projectos
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { getAllProjectsAdmin } from "@/lib/admin/queries";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import ProjectsTable from "@/components/admin/ProjectsTable";

export const metadata = { title: "Projectos" };

export default async function ProjectsListPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div>
      <PageHeader
        title="Projectos"
        subtitle={`${projects.length} no total`}
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-yellow-300"
          >
            <FiPlus /> Novo projecto
          </Link>
        }
      />

      {projects.length ? (
        <ProjectsTable projects={projects} />
      ) : (
        <EmptyState message="Ainda não há projectos. Crie o primeiro." />
      )}
    </div>
  );
}
