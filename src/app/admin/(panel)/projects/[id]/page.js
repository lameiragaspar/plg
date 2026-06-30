// app/admin/(panel)/projects/[id]/page.js — Editar projecto
import { notFound } from "next/navigation";
import { getProjectByIdAdmin, getAllTechnologies } from "@/lib/admin/queries";
import { updateProject } from "@/lib/admin/projects";
import { PageHeader, Card } from "@/components/admin/ui";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = { title: "Editar projecto" };

export default async function EditProjectPage({ params }) {
  const { id } = await params;

  let project;
  try {
    [project] = await Promise.all([getProjectByIdAdmin(id)]);
  } catch {
    notFound();
  }
  if (!project) notFound();

  const technologies = await getAllTechnologies();

  // Liga o id à Server Action (assinatura: updateProject(id, prevState, formData)).
  const action = updateProject.bind(null, id);

  return (
    <div>
      <PageHeader title="Editar projecto" subtitle={project.title} />
      <Card>
        <ProjectForm technologies={technologies} initial={project} action={action} />
      </Card>
    </div>
  );
}
