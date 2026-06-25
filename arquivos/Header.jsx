"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Ícone hamburger animado → X ────────────────────────────────────────────
function HamburgerIcon({ isOpen }) {
  return (
    <div className="w-5 h-[14px] flex flex-col justify-between" aria-hidden="true">
      <span
        className={`block h-[1.75px] bg-current rounded-full transition-all duration-300 origin-center ${
          isOpen ? "rotate-45 translate-y-[6px]" : ""
        }`}
      />
      <span
        className={`block h-[1.75px] bg-current rounded-full transition-all duration-200 ${
          isOpen ? "opacity-0 scale-x-0" : ""
        }`}
      />
      <span
        className={`block h-[1.75px] bg-current rounded-full transition-all duration-300 origin-center ${
          isOpen ? "-rotate-45 -translate-y-[6px]" : ""
        }`}
      />
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Home",       path: ["/"] },
    { name: "Sobre",      path: ["/about"] },
    { name: "Projectos",  path: ["/projects", "/projects/fullstack", "/projects/backend", "/projects/frontend"] },
    { name: "Contacto",   path: ["/contact"] },
  ];

  // Fecha o drawer ao mudar de rota
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Scroll-awareness: intensifica o fundo ao rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloqueia o scroll do body enquanto o drawer está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Fecha com ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── Barra do header ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/75 backdrop-blur-xl border-b border-yellow-500/15 shadow-lg shadow-black/30 py-3"
            : "bg-black/20 backdrop-blur-md border-b border-yellow-500/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Voltar ao início">
            <div className="relative shrink-0">
              <Image
                src="/assets/logo.jpg"
                alt="PLG Dev"
                width={38}
                height={38}
                className="rounded-full ring-1 ring-yellow-400/20 group-hover:ring-yellow-400/50 transition-all duration-300"
                priority
              />
            </div>
            <span className="font-mono font-bold text-base text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200">
              .dev
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {links.slice(0, -1).map((link) => {
              const isActive = link.path.includes(pathname);
              return (
                <Link
                  key={link.name}
                  href={link.path[0]}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-yellow-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {/* Pill animado que persiste entre links activos */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-yellow-400/8 border border-yellow-400/15"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              );
            })}

            {/* CTA Contacto */}
            <Link
              href="/contact"
              className={`ml-3 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                pathname === "/contact"
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
              }`}
            >
              Contacto
            </Link>
          </nav>

          {/* Botão hamburger — mobile only */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-yellow-400 hover:bg-yellow-400/10 transition-colors duration-200 cursor-pointer"
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        </div>
      </header>

      {/* ── Drawer mobile ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Painel lateral */}
            <motion.nav
              id="mobile-drawer"
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-zinc-950 border-l border-yellow-500/10 flex flex-col md:hidden shadow-2xl"
              aria-label="Menu de navegação"
            >
              {/* Cabeçalho do drawer */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-yellow-500/10">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="font-mono font-bold text-yellow-400 text-base"
                >
                  .dev
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Links com stagger */}
              <div className="flex flex-col flex-1 px-3 py-5 gap-1 overflow-y-auto">
                {links.map((link, i) => {
                  const isActive = link.path.includes(pathname);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.07, duration: 0.28, ease: "easeOut" }}
                    >
                      <Link
                        href={link.path[0]}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                            : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                        }`}
                      >
                        {/* Indicador de estado */}
                        <span
                          className="shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-200"
                          style={{
                            background: isActive ? "#facc15" : "transparent",
                            border: isActive ? "none" : "1.5px solid #4b5563",
                          }}
                        />
                        {link.name}
                        {isActive && (
                          <svg className="ml-auto w-3.5 h-3.5 text-yellow-400/50" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Rodapé do drawer */}
              <div className="px-6 py-4 border-t border-yellow-500/10">
                <p className="text-[11px] text-gray-600 font-mono">© 2026 PLG Dev</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}