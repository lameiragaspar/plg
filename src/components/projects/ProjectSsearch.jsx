"use client";

// components/projects/ProjectsSearch.jsx
import FadeIn from "@/components/FadeIn";

export default function ProjectsSearch({
  category,
  search,
  onSearch,
  showDropdown,
  onFocus,
  onBlur,
  onClear,
  onSelectSuggestion,
  filteredProjects,
}) {
  return (
    <section className="mb-12 max-w-2xl mx-auto">
      <FadeIn direction="left" delay={0.4}>
        <div className="relative min-w-0">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={`Buscar em ${category}...`}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full min-w-0 pl-11 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-yellow-500/10 focus:border-yellow-400/50 focus:bg-zinc-900 outline-none transition-all duration-300"
          />
          {/* Botão limpar */}
          {search && (
            <button
              onMouseDown={onClear}
              className="absolute inset-y-0 right-4 flex items-center text-gray-600 hover:text-gray-300 transition cursor-pointer"
              aria-label="Limpar busca"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          )}
          {showDropdown && search && (
            <div className="absolute w-full mt-2 bg-zinc-900 border border-yellow-500/10 rounded-lg max-h-48 overflow-auto z-10 shadow-xl">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => onSelectSuggestion(p.title)}
                    className="px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer text-sm transition"
                  >
                    {p.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nenhum projeto encontrado.
                </div>
              )}
            </div>
          )}
        </div>
      </FadeIn>
    </section>
  );
}