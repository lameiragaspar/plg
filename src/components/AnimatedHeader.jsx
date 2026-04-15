"use client";

import { motion } from "framer-motion";
import Header from "./Header";

export default function AnimatedHeader() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Header />
    </motion.header>
  );
}