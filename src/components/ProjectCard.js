export default function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer h-full flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-yellow-500/10 hover:border-yellow-400/40 hover:-translate-y-1 transition-all duration-300 group"
    >
      {project.type !== "backend" && (
        <div className="overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs uppercase text-yellow-400 font-semibold">
          {project.type}
        </span>

        <h3 className="text-xl font-semibold mt-2">
          {project.title}
        </h3>

        <p className="text-gray-400 text-sm mt-2 flex-1">
          {project.description}
        </p>

        <button className="mt-6 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
          Detalhes
        </button>
      </div>
    </div>
  );
}