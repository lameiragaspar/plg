import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const REGEX_HASH_VALIDO = /^[a-f0-9]{32}$/;

export async function POST(request, { params }) {
  const { id } = await params;

  try {
    const { visitorHash } = await request.json();

    if (!id || !visitorHash) {
      return NextResponse.json({ error: "Dados em falta." }, { status: 400 });
    }

    if (!REGEX_HASH_VALIDO.test(visitorHash)) {
      return NextResponse.json({ error: "Hash inválido." }, { status: 400 });
    }

    // 1. Verifica se este visitante já curtiu este projeto
    const { data: likeExistente, error: erroSelectLike } = await supabaseAdmin
      .from("project_likes")
      .select("id")
      .eq("project_id", id)
      .eq("ip_hash", visitorHash)
      .maybeSingle();

    if (erroSelectLike) {
      console.error("[/like] erro ao verificar like existente:", erroSelectLike);
      return NextResponse.json({ error: "Erro ao verificar like." }, { status: 500 });
    }

    const novoEstado = !likeExistente; // true = vai curtir, false = vai remover
    const delta = novoEstado ? 1 : -1;

    // 2. Toggle na tabela de likes
    if (likeExistente) {
      const { error: erroDelete } = await supabaseAdmin
        .from("project_likes")
        .delete()
        .eq("id", likeExistente.id);

      if (erroDelete) {
        console.error("[/like] erro ao remover like:", erroDelete);
        return NextResponse.json({ error: "Erro ao remover like." }, { status: 500 });
      }
    } else {
      const { error: erroInsert } = await supabaseAdmin
        .from("project_likes")
        .insert({ project_id: id, ip_hash: visitorHash });

      if (erroInsert) {
        console.error("[/like] erro ao inserir like:", erroInsert);
        return NextResponse.json({ error: "Erro ao registar like." }, { status: 500 });
      }
    }

    // 3. Ajusta o contador de forma atómica e já recebe o valor real de volta
    const { data: novoTotal, error: erroAdjust } = await supabaseAdmin.rpc(
      "adjust_likes",
      { p_project_id: id, p_delta: delta }
    );

    if (erroAdjust) {
      console.error("[/like] erro no adjust_likes:", erroAdjust);
      return NextResponse.json({ error: "Erro ao actualizar contador." }, { status: 500 });
    }

    return NextResponse.json(
      { ok: true, liked: novoEstado, totalLikes: novoTotal ?? 0 },
      { status: 200 }
    );
  } catch (erro) {
    console.error("[/api/projects/[id]/like]", erro);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}