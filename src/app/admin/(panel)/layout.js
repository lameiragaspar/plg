// app/admin/(panel)/layout.js — AdminShell
// Validação redundante de sessão (defesa em profundidade, além do middleware)
// + barra lateral. Todas as páginas deste grupo herdam este shell.
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardStats } from "@/lib/admin/queries";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Painel", template: "%s | PLG Admin" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }) {
  const user = await requireAdmin();

  // Badges de não lidos na sidebar (best-effort).
  let badges = {};
  try {
    const stats = await getDashboardStats();
    badges = {
      "/admin/feedback": stats.feedbackUnread || 0,
      "/admin/messages": stats.messagesUnread || 0,
    };
  } catch {
    badges = {};
  }

  return (
    <div className="flex min-h-screen flex-col bg-black md:flex-row">
      <AdminSidebar email={user.email} badges={badges} />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
