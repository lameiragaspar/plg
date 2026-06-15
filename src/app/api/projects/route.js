/**
 * app/api/projects/route.js
 *
 * GET /api/projects           → todos os projetos publicados
 * GET /api/projects?type=backend  → filtrado por tipo
 *
 * Usado pelas páginas "use client" que não podem chamar
 * fetchAllProjects() directamente (função async do servidor).
 */

import { NextResponse } from "next/server";
import { fetchAllProjects, fetchProjectsByType } from "@/lib/Projects";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "frontend" | "backend" | "fullstack" | null

    const projects = type
      ? await fetchProjectsByType(type)
      : await fetchAllProjects();

    return NextResponse.json(projects, { status: 200 });
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json({ error: "Erro ao carregar projetos." }, { status: 500 });
  }
}