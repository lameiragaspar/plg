// app/admin/(panel)/feedback/page.js — Inbox de feedback
import { getAllFeedback } from "@/lib/admin/queries";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import FeedbackTable from "@/components/admin/FeedbackTable";

export const metadata = { title: "Feedback" };

export default async function FeedbackPage() {
  const items = await getAllFeedback();
  const unread = items.filter((f) => !f.is_read).length;

  return (
    <div>
      <PageHeader
        title="Feedback"
        subtitle={`${items.length} no total · ${unread} por ler`}
      />
      {items.length ? (
        <FeedbackTable items={items} />
      ) : (
        <EmptyState message="Ainda não há feedback." />
      )}
    </div>
  );
}
