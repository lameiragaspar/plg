"use client";

import { motion } from "framer-motion";
import Header from "./Header";

/**
 * AnimatedHeader
 *
 * Usa motion.div (e não motion.header) porque o próprio <Header>
 * já renderiza um elemento <header> — evita aninhamento inválido de HTML.
 */
export default function AnimatedHeader() {
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