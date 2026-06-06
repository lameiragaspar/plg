"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ContactCard from "@/components/ContactCard";
import ContactForm from "@/components/ContactForm";
import DisponivelBadge from "@/components/DisponivelBadge";

// ── Dados de contacto ──────────────────────────────────────────────────────
// Mantidos aqui (página) e passados como props — a fonte de verdade fica
// num só sítio; os componentes são agnósticos ao conteúdo.
const CONTACT_LINKS = [
  {
    label: "Email",
    value: "pedrolameira20@email.com",
    href: "mailto:pedrolameira20@email.com",
    iconType: "email",
    description: "Resposta em menos de 24h",
  },
  {
    label: "GitHub",
    value: "github.com/lameiragaspar",
    href: "https://github.com/lameiragaspar",
    iconType: "github",
    description: "Código e contribuições",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/pedro-lameiraGaspar",
    href: "https://www.linkedin.com/in/pedro-lameira-gaspar-b53056274/",
    iconType: "linkedin",
    description: "Perfil profissional",
  },
];

function WorkingHoursBar() {
  const [nowPct, setNowPct] = useState(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      // Hora em Luanda (WAT = UTC+1)
      const luandaMs = d.getTime() + (d.getTimezoneOffset() + 60) * 60000;
      const luanda   = new Date(luandaMs);
      const minutes  = luanda.getHours() * 60 + luanda.getMinutes();
      setNowPct(minutes / (24 * 60));                        // 0–1 ao longo do dia
      setIsWorking(minutes >= 9 * 60 && minutes < 18 * 60); // 09h–18h
    };
    update();
    const id = setInterval(update, 60000); // actualiza por minuto
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-2 rounded-full bg-zinc-800 overflow-visible">
      {/* Faixa de horário de trabalho: 09h–18h = 37.5%–75% */}
      <div
        className="absolute inset-y-0 rounded-full bg-yellow-400/25"
        style={{ left: "37.5%", width: "37.5%" }}
      />
      {/* Dot "agora" */}
      {nowPct !== null && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 transition-all duration-500 ${
            isWorking ? "bg-green-400" : "bg-gray-500"
          }`}
          style={{ left: `${nowPct * 100}%` }}
          title={isWorking ? "Dentro do horário" : "Fora do horário"}
        />
      )}
    </div>
  );
}

// ── Hora local em Luanda (WAT — UTC+1) ────────────────────────────────────
// Componente local à página — não tem utilidade fora deste contexto.
function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("pt-PT", {
          timeZone: "Africa/Luanda",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Evita hydration mismatch — renderiza vazio no servidor
  if (!time) return null;

  return (
    <div className="text-right shrink-0">
      <p className="text-yellow-400 font-mono text-sm tabular-nums">{time}</p>
      <p className="text-gray-600 text-[10px] mt-0.5">agora</p>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <main className="min-h-screen text-white px-4 sm:px-6 pt-32 md:pt-40 pb-20 max-w-6xl mx-auto">

      {/* CABEÇALHO */}
      <section className="text-center mb-16">
        <FadeIn delay={0.1}>
          <DisponivelBadge />
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 mb-4">
            Vamos trabalhar juntos?
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-gray-400 max-w-lg mx-auto">
            Seja um projecto freelance, uma colaboração ou apenas uma conversa —{" "}
            <span className="text-white">estou a um clique de distância.</span>
          </p>
        </FadeIn>
      </section>

      {/* CONTEÚDO PRINCIPAL
          Layout:
          - Mobile  → stack vertical (1 coluna)
          - Desktop → formulário (3/5) + sidebar (2/5)

          Correcção vs original: o grid era lg:grid-cols-2 mas o formulário
          tinha className="lg:col-span-3" (impossível em 2 colunas).
          FadeIn também não reencaminha className, por isso o col-span
          nunca foi aplicado. Agora a estrutura está correcta.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">

        {/* FORMULÁRIO — 3/5 */}
        <div className="lg:col-span-3">
          <FadeIn delay={0.2}>
            <div className="bg-zinc-900/50 border border-yellow-500/10 rounded-2xl p-6 sm:p-8">
              {/* Cabeçalho do card — título + hint do atalho */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Enviar mensagem</h2>
                <span className="text-[10px] text-gray-600 font-mono hidden sm:block tracking-wider">
                  ⌘ Enter para enviar
                </span>
              </div>
              <ContactForm />
            </div>
          </FadeIn>
        </div>

        {/* SIDEBAR — 2/5 */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Contacto directo */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-3">
              Contacto directo
            </p>
            <div className="space-y-2">
              {CONTACT_LINKS.map((item, i) => (
                // FadeIn com stagger leve — sem delay excessivo (o original usava 0.3*i)
                <FadeIn key={item.label} delay={0.15 + i * 0.1} direction="left">
                  <ContactCard item={item} />
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Localização + hora em tempo real */}
          <FadeIn delay={0.45}>
            <div className="p-5 rounded-2xl border border-yellow-500/10 bg-zinc-900/40">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-3">
                Localização
              </p>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white text-sm font-medium">📍 Luanda, Angola</p>
                  
                </div>
                {/* Hora local em Luanda — actualiza a cada segundo */}
                <LocalTime />
              </div>

              {/* Tempo de resposta */}
              <div className="mt-4 pt-4 border-t border-yellow-500/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                    Horário
                  </p>
                  <span className="text-xs text-yellow-400 font-mono">09h – 18h</span>
                </div>
                <WorkingHoursBar />
              </div>
            </div>
          </FadeIn>

        </div>
      </div>

      {/* CTA — volta ao portfólio */}
      <section className="mt-24 text-center border-t border-yellow-500/10 pt-12">
        <FadeIn>
          <p className="text-gray-500 text-sm mb-4">Ainda a explorar o meu trabalho?</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-yellow-400/30 text-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all duration-300 text-sm font-medium"
          >
            Ver projectos →
          </Link>
        </FadeIn>
      </section>

    </main>
  );
}