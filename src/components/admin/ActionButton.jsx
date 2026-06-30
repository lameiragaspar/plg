"use client";

// components/admin/ActionButton.jsx
// Botão que invoca uma Server Action (passada por prop), com confirmação
// opcional e estado de loading. Usado para acções rápidas em linhas de tabela
// (eliminar, marcar lido, mudar estado, etc.).
import { useState, useTransition } from "react";

export default function ActionButton({
  onAction,            // async () => { ok?, error? }
  confirm,             // string opcional — texto de confirmação
  title,
  children,
  className = "",
  onDone,              // callback opcional após sucesso
}) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState(null);

  function handleClick() {
    if (confirm && !window.confirm(confirm)) return;
    setErr(null);
    startTransition(async () => {
      const res = await onAction();
      if (res?.error) {
        setErr(res.error);
      } else if (onDone) {
        onDone();
      }
    });
  }

  return (
    <button
      type="button"
      title={err || title}
      disabled={pending}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-40 ${
        err ? "text-red-400" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
