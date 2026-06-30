// app/admin/(panel)/projects/new/page.js — Criar projecto
import { getAllTechnologies } from "@/lib/admin/queries";
import { createProject } from "@/lib/admin/projects";
import { PageHeader, Card } from "@/components/admin/ui";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = { title: "Novo projecto" };

export default async function NewProjectPage() {
  const technologies = await getAllTechnologies();

  return (
    <div>
      <PageHeader title="Novo projecto" subtitle="Criar uma nova entrada no portfólio" />
      <Card>
        <ProjectForm technologies={technologies} action={createProject} />
      </Card>
    </div>
  );
}
