"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AvisoLikeBrowser({ visivel, onFechar }) {
  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(380px,calc(100vw-2rem))]"
        >
          <div className="bg-zinc-900 border border-yellow-400/20 rounded-2xl px-5 py-4 shadow-2xl shadow-black/50">

            <div className="flex items-start gap-3">
              {/* Ícone */}
              <span className="text-xl shrink-0 mt-0.5">❤️</span>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-snug">
                  Obrigado pelo like!
                </p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Como não há login, o teu like fica guardado neste browser.
                  Se limpares a memória ou usares outro dispositivo, não persiste.
                </p>
              </div>

              {/* Botão fechar */}
              <button
                onClick={onFechar}
                aria-label="Fechar aviso"
                className="shrink-0 text-gray-600 hover:text-white transition cursor-pointer mt-0.5"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 1l10 10M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Barra de progresso — fecha automaticamente em 15s */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 15, ease: "linear" }}
              onAnimationComplete={onFechar}
              className="h-0.5 bg-yellow-400/40 rounded-full mt-3 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}