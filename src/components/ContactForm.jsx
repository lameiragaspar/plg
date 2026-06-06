"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

// ── Constantes ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  "Projecto freelance",
  "Colaboração",
  "Oportunidade de trabalho",
  "Feedback ao portfólio",
  "Outro",
];

const MAX_CHARS = 500;

const inputBase =
  "w-full bg-zinc-900/60 border border-yellow-500/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-yellow-400/50 focus:bg-zinc-900 transition-all duration-300 text-sm";

// ── Field wrapper ──────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-gray-500 font-mono">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ContactForm ────────────────────────────────────────────────────────────
/**
 * Melhorias vs original:
 * - Assunto: pills clicáveis em vez de <select> (mais táctil, mais visual)
 * - Atalho de teclado: Ctrl/Cmd + Enter submete o formulário
 * - Shake: animação de sacudidela no erro de validação (feedback háptico-visual)
 * - Erros: cada campo limpa o seu erro ao começar a editar (menos ruído)
 * - Contador de mensagem: barra de progresso + número (não só número)
 * - Estado de sucesso: ícone de check com spring animation (mais polido)
 */
export default function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const controls            = useAnimationControls();

  // Setter unificado — aceita SyntheticEvent (inputs) ou string (pills)
  const set = useCallback((key) => (valueOrEvent) => {
    const v = valueOrEvent?.target ? valueOrEvent.target.value : valueOrEvent;
    setForm((prev) => ({ ...prev, [key]: v }));
    // Limpa o erro do campo assim que o utilizador edita
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validate = (f) => {
    const e = {};
    if (!f.name.trim())                             e.name    = "Nome obrigatório.";
    if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email inválido.";
    if (!f.subject)                                 e.subject = "Escolhe um assunto.";
    if (f.message.trim().length < 20)               e.message = "Mensagem demasiado curta (mín. 20 caracteres).";
    return e;
  };

  const handleSubmit = useCallback(async () => {
    if (status === "sending") return;

    const e = validate(form);
    if (Object.keys(e).length) {
      setErrors(e);
      // Shake — feedback imediato de erro
      controls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45, ease: "easeInOut" },
      });
      return;
    }

    setErrors({});
    setStatus("sending");

    // ── Substituir por fetch("/api/contact", { method: "POST", body: ... })
    //    quando o backend estiver pronto.
    await new Promise((r) => setTimeout(r, 1400));

    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
  }, [form, status, controls]);

  // Atalho Ctrl / Cmd + Enter
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit]);

  // ── Estado de sucesso ────────────────────────────────────────────────────
  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 text-center gap-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center text-2xl text-green-400"
        >
          ✓
        </motion.div>
        <h3 className="text-2xl font-bold text-white">Mensagem enviada!</h3>
        <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
          Obrigado pelo contacto. Responderei em menos de 24h.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors underline underline-offset-4 cursor-pointer"
        >
          Enviar outra mensagem
        </button>
      </motion.div>
    );
  }

  // ── Contagem de caracteres ────────────────────────────────────────────────
  const charPct   = form.message.length / MAX_CHARS;
  const charColor = charPct > 0.9
    ? "text-yellow-400"
    : charPct > 0.7
    ? "text-yellow-400/60"
    : "text-gray-600";

  // ── Formulário ────────────────────────────────────────────────────────────
  return (
    <motion.div animate={controls} className="space-y-5">

      {/* Nome + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nome" error={errors.name}>
          <input
            type="text"
            placeholder="O teu nome"
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
            className={inputBase}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            className={inputBase}
          />
        </Field>
      </div>

      {/* Assunto — pills (substitui o <select>) */}
      <Field label="Assunto" error={errors.subject}>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("subject")(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                form.subject === s
                  ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                  : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      {/* Mensagem com contador visual */}
      <Field label="Mensagem" error={errors.message}>
        <div className="relative">
          <textarea
            placeholder="Descreve o teu projecto, ideia ou pergunta..."
            value={form.message}
            onChange={set("message")}
            maxLength={MAX_CHARS}
            rows={5}
            className={`${inputBase} resize-none pb-8`}
          />
          {/* Barra de progresso + número */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="w-14 h-1 rounded-full bg-zinc-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  charPct > 0.9 ? "bg-yellow-400" : "bg-yellow-400/40"
                }`}
                style={{ width: `${Math.min(charPct * 100, 100)}%` }}
              />
            </div>
            <span className={`text-[10px] font-mono transition-colors duration-200 ${charColor}`}>
              {form.message.length}/{MAX_CHARS}
            </span>
          </div>
        </div>
      </Field>

      {/* Botão + hint de atalho */}
      <div className="space-y-2">
        <button
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="w-full py-3.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "sending" ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
              />
              A enviar...
            </>
          ) : (
            "Enviar mensagem →"
          )}
        </button>
        <p className="text-[10px] text-gray-600 text-center">
          ⌘ Enter para enviar · Os dados são usados apenas para responder ao teu contacto.
        </p>
      </div>

    </motion.div>
  );
}