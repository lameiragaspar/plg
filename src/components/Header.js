"use client";

import Image from 'next/image'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { name: "Home", path: "/" },
    { name: "Sobre", path: "/about" },
    { name: "Projectos", path: "/projects" },
    { name: "Contacto", path: "/contact" },
  ];

  const baseClass =
    "relative transition duration-300 text-gray-300 hover:text-yellow-400";

  const activeClass =
    "text-yellow-400 after:w-full";

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-yellow-500/10 backdrop-blur-md">
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

        {/* Menu */}
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
        <button className="md:hidden text-yellow-400 cursor-pointer">
          ☰
        </button>
      </div>
    </header>
  )
}