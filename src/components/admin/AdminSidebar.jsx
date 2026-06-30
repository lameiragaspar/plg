"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiFolder,
  FiMessageSquare,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import { signOutAction } from "@/lib/admin/session";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { href: "/admin/projects", label: "Projectos", icon: FiFolder },
  { href: "/admin/feedback", label: "Feedback", icon: FiStar },
  { href: "/admin/messages", label: "Mensagens", icon: FiMessageSquare },
];

function NavLinks({ pathname, onNavigate, badges }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const badge = badges?.[href];
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
              active
                ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                : "text-gray-400 hover:text-white hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="text-lg" />
              {label}
            </span>
            {badge ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1.5 text-[11px] font-bold text-black">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ email, badges }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar mobile */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-yellow-500/10 bg-black/90 px-4 py-3 backdrop-blur">
        <span className="font-bold text-yellow-400">PLG Admin</span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-gray-300 hover:bg-zinc-900"
        >
          <FiMenu className="text-xl" />
        </button>
      </div>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-yellow-500/10 bg-zinc-950 p-4">
        <SidebarContent pathname={pathname} email={email} badges={badges} />
      </aside>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-yellow-500/10 bg-zinc-950 p-4 md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-yellow-400">PLG Admin</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-lg p-2 text-gray-300 hover:bg-zinc-900"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <SidebarContent
                pathname={pathname}
                email={email}
                badges={badges}
                onNavigate={() => setOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ pathname, email, badges, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="hidden md:block mb-6 px-1">
        <span className="text-lg font-bold text-yellow-400">PLG Admin</span>
        <p className="mt-0.5 text-xs text-gray-600">Painel de gestão</p>
      </div>

      <NavLinks pathname={pathname} onNavigate={onNavigate} badges={badges} />

      <div className="mt-auto pt-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 transition-all hover:text-white hover:bg-zinc-900"
        >
          <FiExternalLink className="text-lg" />
          Ver site
        </Link>

        <div className="rounded-xl border border-yellow-500/10 bg-zinc-900/50 p-3">
          <p className="truncate text-xs text-gray-500" title={email}>
            {email}
          </p>
          <form action={signOutAction} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-gray-300 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <FiLogOut /> Terminar sessão
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
