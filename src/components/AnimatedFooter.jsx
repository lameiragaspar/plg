"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

// AnimatedFooter.jsx
// Oculto nas rotas /admin — o painel não usa o footer público.
export default function AnimatedFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Footer />
    </motion.div>
  );
}