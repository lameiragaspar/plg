"use client";

// components/projects/Toast.jsx
//
// CORRECÇÃO BUG 4:
// O componente já não retorna `null` internamente.
// Antes, quando o estado voltava a "idle", o Toast desaparecia do DOM
// imediatamente — o AnimatePresence nunca chegava a executar a animação
// de saída porque o filho já não existia quando tentava animá-lo.
//
// Agora o Toast recebe sempre um `config` válido e renderiza sempre um
// `motion.div` real. A decisão de mostrar ou esconder é feita no nível
// do AnimatePresence (ver uso em ProjectsLayout), que monta/desmonta o
// componente depois de a animação `exit` terminar.
//
import { motion } from "framer-motion";
import { TOAST_CONFIG } from "@/lib/constants/projectsLayoutConfig";

export default function Toast({ estadoEnvio }) {
  const config = TOAST_CONFIG[estadoEnvio];

  // Nunca deve ser chamado sem config — a guarda está no AnimatePresence.
  // Esta verificação é apenas uma salvaguarda defensiva.
  if (!config) return null;

  return (
    <motion.div
      key={estadoEnvio}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: 8,  scale: 0.97  }}
      transition={{ duration: 0.25 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-sm whitespace-nowrap ${config.classes}`}
    >
      <span className="text-base">{config.icon}</span>
      {config.message}
    </motion.div>
  );
}