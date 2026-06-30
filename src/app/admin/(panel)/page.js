// app/admin/(panel)/page.js — Dashboard
import Link from "next/link";
import {
  FiFolder,
  FiEye,
  FiHeart,
  FiStar,
  FiMessageSquare,
  FiEdit3,
  FiPlus,
} from "react-icons/fi";
import { getDashboardStats } from "@/lib/admin/queries";
import { PageHeader, Card } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

function StatCard({ icon: Icon, label, value, hint, href }) {
  const inner = (
    <Card className="transition-colors hover:border-yellow-400/30">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-gray-500">{label}</span>
        <Icon className="text-yellow-400/70" />
      </div>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
    </Card>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do portfólio"
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-yellow-300"
          >
            <FiPlus /> Novo projecto
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiFolder} label="Projectos" value={stats.projectsTotal} hint={`${stats.projectsPublished} publicados · ${stats.projectsDraft} rascunhos`} href="/admin/projects" />
        <StatCard icon={FiHeart} label="Likes totais" value={stats.totalLikes} />
        <StatCard icon={FiEye} label="Views totais" value={stats.totalViews} />
        <StatCard icon={FiStar} label="Feedback novo" value={stats.feedbackUnread} hint="por ler" href="/admin/feedback" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard icon={FiMessageSquare} label="Mensagens novas" value={stats.messagesUnread} hint="por ler" href="/admin/messages" />
        <Card>
          <span className="text-xs uppercase tracking-widest text-gray-500">Acções rápidas</span>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/15 bg-zinc-900 px-3 py-2 text-sm text-gray-300 hover:text-yellow-400">
              <FiPlus /> Criar projecto
            </Link>
            <Link href="/admin/projects" className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/15 bg-zinc-900 px-3 py-2 text-sm text-gray-300 hover:text-yellow-400">
              <FiEdit3 /> Gerir projectos
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
