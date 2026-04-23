import Link from "next/link";

export default function CategoryCard({ title, link }) {
  return (
    <Link
      href={link}
      className="p-8 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/40 hover:bg-yellow-400/5 transition text-center group"
    >
      <h3 className="text-xl font-semibold group-hover:scale-105 transition">
        {title}
      </h3>
      <span className="text-sm text-gray-500">
        Ver todos →
      </span>
    </Link>
  );
}