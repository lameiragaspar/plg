// app/admin/(panel)/messages/page.js — Inbox de mensagens de contacto
import { getAllMessages } from "@/lib/admin/queries";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import MessagesTable from "@/components/admin/MessagesTable";

export const metadata = { title: "Mensagens" };

export default async function MessagesPage() {
  const items = await getAllMessages();
  const unread = items.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Mensagens"
        subtitle={`${items.length} no total · ${unread} por ler`}
      />
      {items.length ? (
        <MessagesTable items={items} />
      ) : (
        <EmptyState message="Ainda não há mensagens de contacto." />
      )}
    </div>
  );
}
