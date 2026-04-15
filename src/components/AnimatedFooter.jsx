"use client";
import { motion } from "framer-motion";
import Footer from "./Footer";

export default function AnimatedFooter() {
  return (
    <motion.footer 
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Footer />
    </motion.footer>
  );
}