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
  title: ".dev - Portfólio de Programação",
  description: "Portfólio de programação focado em frontend, backend e fullstack. Projetos modernos, limpos e com código aberto. Explore minhas criações e colaborações.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white" suppressHydrationWarning>
        
        {/* Header global */}
        <AnimatedHeader />

        {/* Conteúdo */}
        <main className="min-h-full flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
          {children}
        </main>

        {/* Footer global */}
        <AnimatedFooter />
      </body>
    </html>
  );
}
