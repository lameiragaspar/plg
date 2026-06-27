// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import AnimatedHeader from "@/components/AnimatedHeader";
import AnimatedFooter from "@/components/AnimatedFooter";
import { Analytics } from "@vercel/analytics/next"

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
  // ── Força o browser a usar o esquema escuro ANTES de qualquer CSS carregar.
  // Sem isto, dispositivos com "Light Mode" activado mostram um flash branco
  // (ou ficam permanentemente brancos) porque o browser aplica os seus próprios
  // estilos base antes de o Tailwind terminar de hidratear.
  colorScheme: "dark",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://plg-dev.vercel.app",
    siteName: "PLG Dev",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-PT"
      // style="color-scheme: dark" — impede que o browser sobrescreva
      // bg-black com o seu fundo padrão do sistema (branco em Light Mode).
      // O className mantém as variáveis de fonte e o antialiasing.
      style={{ colorScheme: "dark" }}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          <meta name="color-scheme"> é lido pelo browser ANTES do CSS.
          Garante que o fundo inicial (antes de qualquer folha de estilo
          carregar) já é preto — elimina o flash branco em dispositivos
          com Light Mode, incluindo em mobile e PWA instaladas.
        */}
        <meta name="color-scheme" content="dark" />
      </head>
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
        <Analytics />
      </body>
    </html>
  );
}