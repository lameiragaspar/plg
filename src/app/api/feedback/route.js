// app/api/feedback/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { page, rating, comment, project_id, timestamp } = body;

    // Validação básica
    if (!comment?.trim() || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("feedback")
      .insert({
        page,                           // "Frontend" | "Backend" | "Fullstack"
        rating,
        comment: comment.trim(),
        project_id: project_id ?? null, // opcional — menção a um projecto
        created_at: timestamp ?? new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/feedback]", err);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}