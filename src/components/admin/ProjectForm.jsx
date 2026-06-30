"use client";

// components/admin/ProjectForm.jsx
// Formulário único de criação e edição de projectos. Recebe:
//   • technologies: lista completa de techs disponíveis
//   • initial: projecto a editar (ou null para criação)
//   • action: Server Action ligada (createProject ou updateProject.bind(id))
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";

const TYPES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
];
const STATUS = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
];
const ROLES = [
  { value: "frontend", label: "Front" },
  { value: "backend", label: "Back" },
  { value: "main", label: "Geral" },
];
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const inputBase =
  "w-full bg-zinc-900/60 border border-yellow-500/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-yellow-400/50 focus:bg-zinc-900 transition-all duration-300 text-sm";
const labelBase = "text-xs uppercase tracking-widest text-gray-500 font-mono mb-1.5 block";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-yellow-300 disabled:opacity-50"
    >
      <FiSave />
      {pending ? "A guardar…" : "Guardar"}
    </button>
  );
}

export default function ProjectForm({ technologies = [], initial = null, action }) {
  const [state, formAction] = useActionState(action, {});

  // Tech seleccionadas: Map techId → role
  const initialTechMap = useMemo(() => {
    const m = {};
    (initial?.project_technologies ?? []).forEach((pt) => {
      m[pt.tech_id] = pt.role || "main";
    });
    return m;
  }, [initial]);

  const [selectedTechs, setSelectedTechs] = useState(initialTechMap);
  const [type, setType] = useState(initial?.type || "frontend");
  const [endpoints, setEndpoints] = useState(
    (initial?.endpoints ?? [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((e) => ({ method: e.method, path: e.path, description: e.description || "" }))
  );

  const showEndpoints = type === "backend" || type === "fullstack";

  function toggleTech(id) {
    setSelectedTechs((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = "main";
      return next;
    });
  }

  function setTechRole(id, role) {
    setSelectedTechs((prev) => ({ ...prev, [id]: role }));
  }

  function addEndpoint() {
    setEndpoints((prev) => [...prev, { method: "GET", path: "", description: "" }]);
  }
  function updateEndpoint(i, field, value) {
    setEndpoints((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }
  function removeEndpoint(i) {
    setEndpoints((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Hidden inputs gerados a partir do estado */}
      {Object.entries(selectedTechs).map(([id, role]) => (
        <input key={id} type="hidden" name="technologies" value={`${id}|${role}`} />
      ))}
      <input
        type="hidden"
        name="endpoints"
        value={JSON.stringify(showEndpoints ? endpoints.filter((e) => e.path.trim()) : [])}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelBase}>Título *</label>
          <input name="title" defaultValue={initial?.title || ""} required className={inputBase} placeholder="Nome do projecto" />
        </div>
        <div>
          <label className={labelBase}>Slug</label>
          <input name="slug" defaultValue={initial?.slug || ""} className={inputBase} placeholder="auto a partir do título" />
        </div>
      </div>

      <div>
        <label className={labelBase}>Descrição</label>
        <textarea name="description" defaultValue={initial?.description || ""} rows={2} className={inputBase} placeholder="Resumo curto" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className={labelBase}>Tipo *</label>
          <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={inputBase}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelBase}>Estado *</label>
          <select name="status" defaultValue={initial?.status || "draft"} className={inputBase}>
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="featured" defaultChecked={initial?.featured || false} className="h-4 w-4 accent-yellow-400" />
            Destaque
          </label>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelBase}>Motivação</label>
          <textarea name="motivation" defaultValue={initial?.motivation || ""} rows={3} className={inputBase} />
        </div>
        <div>
          <label className={labelBase}>Aprendizagens</label>
          <textarea name="learnings" defaultValue={initial?.learnings || ""} rows={3} className={inputBase} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className={labelBase}>Imagem (URL)</label>
          <input name="image_url" defaultValue={initial?.image_url || ""} className={inputBase} placeholder="https://…" />
        </div>
        <div>
          <label className={labelBase}>GitHub (URL)</label>
          <input name="github_url" defaultValue={initial?.github_url || ""} className={inputBase} placeholder="https://github.com/…" />
        </div>
        <div>
          <label className={labelBase}>Deploy (URL)</label>
          <input name="deploy_url" defaultValue={initial?.deploy_url || ""} className={inputBase} placeholder="https://…" />
        </div>
      </div>

      {/* Tecnologias */}
      <div>
        <label className={labelBase}>Tecnologias</label>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => {
            const active = !!selectedTechs[tech.id];
            return (
              <div key={tech.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={`rounded-l-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400"
                      : "border-zinc-800 bg-zinc-900 text-gray-400 hover:text-white rounded-r-lg"
                  }`}
                >
                  {tech.name}
                </button>
                {active && (
                  <select
                    value={selectedTechs[tech.id]}
                    onChange={(e) => setTechRole(tech.id, e.target.value)}
                    className="rounded-r-lg border border-l-0 border-yellow-400/40 bg-zinc-900 py-1.5 pl-1 pr-1 text-xs text-yellow-400 outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Endpoints (só backend/fullstack) */}
      <AnimatePresence>
        {showEndpoints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelBase} mb-0`}>Endpoints</label>
              <button type="button" onClick={addEndpoint} className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300">
                <FiPlus /> Adicionar
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {endpoints.map((ep, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
                  <select value={ep.method} onChange={(e) => updateEndpoint(i, "method", e.target.value)} className="rounded-lg bg-zinc-900 px-2 py-1.5 text-xs text-white outline-none border border-zinc-800">
                    {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input value={ep.path} onChange={(e) => updateEndpoint(i, "path", e.target.value)} placeholder="/api/v1/recurso" className="flex-1 min-w-[140px] rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white outline-none border border-zinc-800 font-mono" />
                  <input value={ep.description} onChange={(e) => updateEndpoint(i, "description", e.target.value)} placeholder="Descrição" className="flex-1 min-w-[140px] rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-gray-300 outline-none border border-zinc-800" />
                  <button type="button" onClick={() => removeEndpoint(i)} className="rounded-lg p-1.5 text-gray-500 hover:text-red-400">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              {!endpoints.length && <p className="text-xs text-gray-600">Sem endpoints. Adicione se for uma API.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex items-center gap-3 border-t border-zinc-900 pt-5">
        <SubmitButton />
        <Link href="/admin/projects" className="text-sm text-gray-500 hover:text-white">Cancelar</Link>
      </div>
    </form>
  );
}
