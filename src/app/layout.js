// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import AnimatedHeader from "@/components/AnimatedHeader";
import AnimatedFooter from "@/components/AnimatedFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "PLG Dev — Portfólio FullStack",
    template: "%s | PLG Dev",
  },
  description:
    "Portfólio de desenvolvimento FullStack — interfaces modernas, APIs robustas e produtos de ponta a ponta. React, Next.js, Node.js e PostgreSQL.",
  keywords: ["fullstack", "developer", "react", "nextjs", "portfolio", "angola"],
  authors: [{ name: "Pedro Lameira Gaspar" }],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://plg-dev.vercel.app",
    siteName: "PLG Dev",
  },
};

export default function RootLayout({ children }) {
  return (
    // ── pt-PT (Português Europeu) — era "pt-br" ──────────────────────────
    <html
      lang="pt-PT"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-black text-white"
        suppressHydrationWarning
      >
        <AnimatedHeader />

        {/*
          Sem <main> wrapper aqui — cada page.js define o seu próprio <main>
          com padding e max-width adequados ao conteúdo da página.
          Ter dois <main> aninhados (layout + page) é HTML inválido.
        */}
        {children}

        <AnimatedFooter />
      </body>
    </html>
  );
}