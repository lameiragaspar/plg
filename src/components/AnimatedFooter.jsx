"use client";
import { motion } from "framer-motion";
import Footer from "./Footer";

// AnimatedFooter.jsx
export default function AnimatedFooter() {
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