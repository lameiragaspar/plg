"use client";

// components/projects/TechFilterBar.jsx
// Renderizado apenas em /frontend (showTechFilter={true}).
// Isola estado e lógica — ProjectsLayout só expõe a prop booleana.

export default function TechFilterBar({ techs, active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8">
      <button
        onClick={() => onSelect(null)}
        className={`text-xs px-3 py-1.5 rounded-full border transition duration-200 cursor-pointer ${
          !active
            ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
            : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
        }`}
      >
        Todos
      </button>
      {techs.map((tech) => (
        <button
          key={tech}
          onClick={() => onSelect(active === tech ? null : tech)}
          className={`text-xs px-3 py-1.5 rounded-full border transition duration-200 cursor-pointer ${
            active === tech
              ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
              : "border-yellow-500/20 text-gray-400 hover:border-yellow-400/40 hover:text-white"
          }`}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}