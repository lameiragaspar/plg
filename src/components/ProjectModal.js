import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900 border border-yellow-500/20 max-w-2xl w-full p-8 rounded-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-2">
          {project.title}
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="text-yellow-400 font-semibold">Motivação</h4>
            <p>{project.motivation}</p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-semibold">Aprendizados</h4>
            <p>{project.learnings}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href={project?.github || "#"}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
          >
            Ver código
          </Link>

          {project.deploy && (
            <Link
              href={project?.deploy || "#"}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-3 border border-yellow-400 text-yellow-400 font-semibold rounded-xl hover:bg-yellow-400 hover:text-black transition"
            >
              Ver projeto
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}