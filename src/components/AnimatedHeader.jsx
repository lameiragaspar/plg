"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "./Header";

/**
 * AnimatedHeader
 *
 * Usa motion.div (e não motion.header) porque o próprio <Header>
 * já renderiza um elemento <header> — evita aninhamento inválido de HTML.
 *
 * Oculto nas rotas /admin — o painel tem o seu próprio shell (AdminSidebar).
 */
export default function AnimatedHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />
    </motion.div>
  );
}