"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiLogIn } from "react-icons/fi";
import { signInAction } from "@/lib/admin/session";

const inputBase =
  "w-full bg-zinc-900/60 border border-yellow-500/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none focus:border-yellow-400/50 focus:bg-zinc-900 transition-all duration-300 text-sm";

export default function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const [state, formAction, pending] = useActionState(signInAction, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/20 mb-4">
          <FiLock className="text-yellow-400 text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Acesso restrito — PLG Dev</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirect} />

        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="email"
            name="email"
            placeholder="email@exemplo.com"
            autoComplete="email"
            required
            className={inputBase}
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="password"
            name="password"
            placeholder="Palavra-passe"
            autoComplete="current-password"
            required
            className={inputBase}
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-400 text-center">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-yellow-300 disabled:opacity-50"
        >
          <FiLogIn />
          {pending ? "A entrar…" : "Entrar"}
        </button>
      </form>
    </motion.div>
  );
}
