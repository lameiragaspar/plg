"use client";

import { motion } from "framer-motion";

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  className = "",
  style,
}) {
  const directions = {
    up:    { y: 40, opacity: 0 },
    down:  { y: -40, opacity: 0 },
    left:  { x: 40, opacity: 0 },
    right: { x: -40, opacity: 0 },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial={directions[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}