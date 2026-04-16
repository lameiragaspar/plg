"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Sobre", path: "/about" },
    { name: "Projectos", path: "/projects" },
    { name: "Contacto", path: "/contact" },
  ];

  // Bloquear scroll quando menu aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e, KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const baseClass =
    "relative transition duration-300 text-gray-300 hover:text-yellow-400";

  const activeClass = "text-yellow-400 after:w-full";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-yellow-500/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <Image
              src="/assets/logo.jpg"
              alt="logo"
              width={45}
              height={45}
              className="rounded-full transition-transform duration-300 group-hover:scale-110"
              priority
            />
            <span className="text-lg font-semibold tracking-wide text-yellow-400 group-hover:text-yellow-300 transition">
              PLG Dev
            </span>
          </div>

          {/* Desktop */}
          <nav className="hidden md:flex gap-8">
            {links.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`${baseClass} ${
                    isActive ? activeClass : "after:w-0"
                  } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-yellow-400 after:transition-all after:duration-300`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Botão Mobile */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-yellow-400 text-2xl z-[60]"
          >
            ☰
          </button>
        </div>
      </header>

      {/* FULLSCREEN MENU */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Botão fechar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-3xl text-yellow-400"
        >
          ✕
        </button>

        {/* Links */}
        <nav className="flex flex-col items-center gap-8">
          {links.map((link, index) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-medium transition-all duration-300 ${
                  isActive
                    ? "text-yellow-400 scale-110"
                    : "text-gray-300 hover:text-yellow-400 hover:scale-110"
                }`}
                style={{
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}