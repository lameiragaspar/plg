"use client";

// components/projects/ProjectsFeedback.jsx
import FadeIn from "@/components/FadeIn";

export default function ProjectsFeedback({
  fbCfg,
  projectsByTypeState,
  mentionedProject,
  onMentionProject,
  comment,
  onCommentChange,
  rating,
  onRatingChange,
  onSubmit,
  submitState,
}) {
  return (
    <section className="mt-24 max-w-3xl mx-auto">
      <FadeIn delay={0.2}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{fbCfg.heading}</h2>
          <p className="text-gray-500">{fbCfg.sub}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.4}>
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-yellow-500/10">

          {/* Menção opcional a um projecto */}
          {projectsByTypeState.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                Mencionar um projecto (opcional)
              </p>
              <div className="flex flex-wrap gap-2">
                {projectsByTypeState.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onMentionProject(mentionedProject === p.id ? null : p.id)}
                    disabled={submitState === "loading" || submitState === "success"}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer disabled:pointer-events-none ${
                      mentionedProject === p.id
                        ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                        : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
                    }`}
                  >
                    {mentionedProject === p.id ? "✓ " : ""}{p.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            placeholder={fbCfg.placeholder}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            disabled={submitState === "loading" || submitState === "success"}
            className="w-full p-4 bg-black/40 border border-yellow-500/10 rounded-lg mb-4 outline-none focus:border-yellow-400/50 transition-all resize-none text-white placeholder-gray-600 disabled:opacity-50"
            rows="3"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRatingChange(star)}
                  disabled={submitState === "loading" || submitState === "success"}
                  className={`text-2xl sm:text-lg transition-all cursor-pointer disabled:pointer-events-none ${
                    star <= rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400/50"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              onClick={onSubmit}
              disabled={!comment.trim() || rating === 0 || submitState === "loading" || submitState === "success"}
              className="w-full sm:w-auto px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-w-[148px]"
            >
              {submitState === "loading" && "A enviar..."}
              {submitState === "success" && "✓ Obrigado!"}
              {submitState === "error"   && "Erro — tenta de novo"}
              {submitState === "idle"    && "Enviar avaliação"}
            </button>
          </div>
          {submitState === "error" && (
            <p className="text-red-400 text-xs mt-3 text-right">
              Não foi possível enviar. Tenta novamente.
            </p>
          )}
        </div>
      </FadeIn>
    </section>
  );
}