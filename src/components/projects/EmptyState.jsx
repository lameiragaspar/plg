"use client";

// components/projects/EmptyState.jsx
//
// Componente único para todos os empty states das páginas de projetos.
//
// USO — ProjectsGrid.jsx (páginas /frontend, /backend, /fullstack):
//   import EmptyState from "@/components/projects/EmptyState";
//   <EmptyState
//     tipo={category.toLowerCase()}   // "frontend" | "backend" | "fullstack"
//     mensagem="Nenhum projeto com "React" encontrado."
//     onClearFilter={() => setActiveTech(null)}
//     labelBotao="Ver todos"
//   />
//
// USO — ProjectsPage.jsx (página /projects, filtro geral):
//   <EmptyState
//     tipo="geral"
//     mensagem="Nenhum projeto disponível de momento."
//     onClearFilter={() => setActiveFilter("todos")}
//     labelBotao="Ver todos"
//   />
//
// Props:
//   tipo           "frontend" | "backend" | "fullstack" | "geral"
//   mensagem       string   — texto descritivo abaixo da animação
//   onClearFilter  fn|null  — se passado, mostra botão de reset
//   labelBotao     string   — label do botão (default "Ver todos")
//

import { motion } from "framer-motion";

// ─── Paleta de cores por tipo ──────────────────────────────────────────────
const TIPO_COR = {
  frontend:  { acento: "#f5c518", borda: "#3a3318", bg: "#1a1800", textoLabel: "text-yellow-400",  botao: "text-yellow-400/60 hover:text-yellow-400" },
  backend:   { acento: "#3d8cff", borda: "#1a2d3d", bg: "#0d1a24", textoLabel: "text-blue-400",    botao: "text-blue-400/60   hover:text-blue-400"   },
  fullstack: { acento: "#3ecf8e", borda: "#1a3d2d", bg: "#0d2418", textoLabel: "text-emerald-400", botao: "text-emerald-400/60 hover:text-emerald-400"},
  geral:     { acento: "#888888", borda: "#2a2a2a", bg: "#1a1a1a", textoLabel: "text-gray-500",    botao: "text-yellow-400/60 hover:text-yellow-400"  },
};

// ─── Animação: browser (Frontend) ─────────────────────────────────────────
function BrowserAnim({ cor }) {
  // Linhas do "skeleton" de conteúdo dentro da janela do browser.
  // Cada linha tem um delay diferente para criar efeito de onda.
  const linhas = [
    { largura: "60%", delay: 0,    cor: cor.borda, destaque: true  },
    { largura: "80%", delay: 0.3,  cor: cor.borda, destaque: false },
    { largura: "65%", delay: 0.6,  cor: cor.borda, destaque: false },
    { largura: "75%", delay: 0.9,  cor: cor.borda, destaque: false },
    { largura: "98%", delay: 1.2,  cor: cor.borda, destaque: false },
    { largura: "60%", delay: 1.2,  cor: cor.borda, destaque: false },
    { largura: "80%", delay: 1.2,  cor: cor.borda, destaque: false },
    { largura: "65%", delay: 1.2,  cor: cor.borda, destaque: false },
  ];

  return (
    <div
      style={{
        width: 360,
        height: 220,
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Barra de topo com dots macOS */}
      <div style={{ height: 22, background: "#1e1e1e", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", padding: "0 8px", gap: 5 }}>
        <DotTerminal cor="#ff5f57" />
        <DotTerminal cor="#febc2e" />
        <DotTerminal cor="#28c840" />
      </div>

      {/* Corpo com linhas skeleton */}
      <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
        {linhas.map((linha, i) => (
          <motion.div
            key={i}
            style={{
              height: 12,
              borderRadius: 3,
              width: linha.largura,
              background: linha.destaque ? cor.acento + "55" : "#2a2a2a",
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.4, delay: linha.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Cursor piscante */}
    </div>
  );
}

// ─── Animação: terminal CLI (Backend) ─────────────────────────────────────
function TerminalAnim() {
  // Linhas do terminal aparecem sequencialmente com delay crescente,
  // simulando o output real de um comando.
  const linhas = [
    { conteudo: <><span style={{ color: "#4493f8" }}>$</span><span style={{ color: "#8b949e" }}> ls --projects</span></>, delay: 0.2  },
    { conteudo: <span style={{ color: "#3fb950" }}>→ 0 results</span>,                                                   delay: 0.8  },
    { conteudo: <><span style={{ color: "#4493f8" }}>$</span><span style={{ color: "#e3b341" }}> api --status</span></>, delay: 1.4  },
    { conteudo: (
        <motion.span
          style={{ color: "#4493f8", fontFamily: "monospace" }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
        >▋</motion.span>
      ), delay: 2.0 },
  ];

  return (
    <div style={{ 
      width: 360,
      height: 220, 
      background: "#0d1117", 
      border: "1px solid #21262d", 
      borderRadius: 8, 
      overflow: "hidden" }}>
      <div style={{ height: 22, background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", padding: "0 8px", gap: 5 }}>
        <DotTerminal cor="#ff5f57" />
        <DotTerminal cor="#febc2e" />
        <DotTerminal cor="#28c840" />
      </div>
      <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 12, fontFamily: "monospace" }}>
        {linhas.map((linha, i) => (
          <motion.div
            key={i}
            style={{ fontSize: 18, display: "flex", gap: 6, alignItems: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: linha.delay }}
          >
            {linha.conteudo}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Animação: painéis UI ↔ API (Fullstack) ───────────────────────────────
// PainelCodigo definido FORA de FullstackAnim para evitar que o React
// recrie o componente em cada render e remonte todos os filhos animados.
function PainelCodigo({ titulo, corBorda, corBg, corDestaque, alinhamento }) {
  return (
    <div style={{ width: 76*2, height: 180, borderRadius: 6, overflow: "hidden", border: `1px solid ${corBorda}`, background: corBg }}>
      <div style={{ height: 18, borderBottom: `1px solid ${corBorda}`, display: "flex", alignItems: "center", padding: "0 6px", gap: 3 }}>
        <DotTerminal cor="#ff5f57" tamanho={5} />
        <DotTerminal cor="#febc2e" tamanho={5} />
        <DotTerminal cor="#28c840" tamanho={5} />
        <span style={{ fontSize: 8, color: corDestaque + "99", marginLeft: 4, fontFamily: "monospace" }}>{titulo}</span>
      </div>
      <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
        {[54, 44, 38, 50, 42, 36, 48, 40, 52, 46, 34, 48].map((w, i) => (
          <motion.div
            key={i}
            style={{ height: 5, borderRadius: 2, width: w, background: i % 2 === 0 ? corDestaque + "55" : corBorda }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, delay: (alinhamento === "esq" ? 0 : 0.5) + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function FullstackAnim() {
  // Dois pacotes circulam entre os painéis:
  //   amarelo: request  (UI → API)
  //   azul:    response (API → UI)
  // O segundo começa com delay de 0.9s para não sobrepor o primeiro.
  //
  // Wrapper externo com 360x220 — mesma "moldura" das animações de
  // frontend/backend — para manter a proporção visual entre os 4 tipos.
  // O conteúdo original (painéis + canal) é centrado e escalado dentro dela.
  return (
    <div style={{ width: 360, height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 200, height: 100, display: "flex", alignItems: "center", transform: "scale(1.5)" }}>
        <PainelCodigo titulo="UI"  corBorda="#3a3318" corBg="#1a1800" corDestaque="#f5c518" alinhamento="esq" />

        {/* Canal de comunicação com dois pacotes */}
        <div style={{ width: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 15, position: "relative" }}>
          {/* Linha superior: request */}
          <div style={{ position: "relative", width: 50, height: 1, background: "#2a2a2a" }}>
            <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", fontSize: 7, color: "#665800", fontFamily: "monospace", whiteSpace: "nowrap" }}>req</span>
            <motion.div
              style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5c518", position: "absolute", top: -3.5, left: -4 }}
              animate={{ left: ["-4px", "46px"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, delay: 0.9, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
            />
          </div>

          {/* Linha inferior: response */}
          <div style={{ position: "relative", width: 50, height: 1, background: "#2a2a2a" }}>
            <span style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", fontSize: 7, color: "#1a4060", fontFamily: "monospace", whiteSpace: "nowrap" }}>res</span>
            <motion.div
              style={{ width: 8, height: 8, borderRadius: "50%", background: "#3d8cff", position: "absolute", top: -3.5, left: 36 }}
              animate={{ left: ["46px", "-4px"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, delay: 0.9, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
            />
          </div>
        </div>

        <PainelCodigo titulo="API" corBorda="#1a2d3d" corBg="#0d1a24" corDestaque="#3d8cff" alinhamento="dir" />
      </div>
    </div>
  );
}

// ─── Animação: pasta com lupa (Geral) ─────────────────────────────────────
function FolderAnim() {
  // A lupa percorre a pasta em movimento orgânico contínuo,
  // simulando uma busca ativa sem resultados.
  //
  // Wrapper externo com 360x220 — mesma "moldura" das animações de
  // frontend/backend — para manter a proporção visual entre os 4 tipos.
  // O conteúdo original (pasta + lupa) é centrado e escalado dentro dela.
  return (
    <div style={{ width: 360, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 120, height: 90, transform: "scale(2.2)" }}>
        {/* Aba da pasta */}
        <div style={{
          width: 44, height: 14,
          background: "#1e1e1e", border: "1px solid #2a2a2a",
          borderRadius: "6px 6px 0 0", borderBottom: "none",
          position: "absolute", top: 6, left: 10,
        }} />

        {/* Corpo da pasta */}
        <div style={{
          width: 100, height: 70,
          background: "#1e1e1e", border: "1px solid #2a2a2a",
          borderRadius: "0 8px 8px 8px",
          position: "absolute", bottom: 0, left: 10,
        }}>
          {/* Linhas de ficheiro dentro da pasta */}
          <div style={{ position: "absolute", bottom: 14, left: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[64, 48, 56].map((w, i) => (
              <motion.div
                key={i}
                style={{ height: 4, borderRadius: 2, width: w, background: "#2a2a2a" }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.2, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>

        {/* Lupa varrendo */}
        <motion.div
          style={{ position: "absolute", right: 0, top: 0 }}
          animate={{
            x:      [0, -12, -4, -18, 0],
            y:      [0,   6, 20,  12, 0],
            rotate: [-5,   0,  5,  -3, -5],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="9"  stroke="#555" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="5"  stroke="#333" strokeWidth="1"   />
            <line   x1="21" y1="21" x2="30" y2="30" stroke="#555" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Utilitário: dot do terminal (reutilizado em todas as animações) ────────
function DotTerminal({ cor, tamanho = 7 }) {
  return (
    <span style={{
      display: "inline-block",
      width: tamanho,
      height: tamanho,
      borderRadius: "50%",
      background: cor,
      opacity: 0.7,
      flexShrink: 0,
    }} />
  );
}

// ─── Mapa: tipo → componente de animação ──────────────────────────────────
// Centraliza a lógica de selecção — EmptyState não precisa de switch/if.
function AnimacaoPorTipo({ tipo, cor }) {
  switch (tipo) {
    case "frontend":  return <BrowserAnim  cor={cor} />;
    case "backend":   return <TerminalAnim              />;
    case "fullstack": return <FullstackAnim             />;
    default:          return <FolderAnim                />;   // "geral" e fallback
  }
}

// ─── Componente principal exportado ───────────────────────────────────────
export default function EmptyState({
  tipo          = "geral",
  mensagem      = "Nenhum projeto encontrado.",
  onClearFilter = null,
  labelBotao    = "Ver todos",
}) {
  const cor = TIPO_COR[tipo] ?? TIPO_COR.geral;

  return (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center py-20 gap-7"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animação ilustrativa específica do tipo */}
      <AnimacaoPorTipo tipo={tipo} cor={cor} />

      {/* Texto e botão de reset */}
      <div className="text-center flex flex-col items-center gap-3">
        {<p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          {mensagem}
        </p>
        }
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className={`text-xs transition-colors duration-200 cursor-pointer underline underline-offset-2 ${cor.botao}`}
          >
            {labelBotao}
          </button>
        )}
      </div>
    </motion.div>
  );
}