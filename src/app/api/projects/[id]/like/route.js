// app/api/projects/[id]/like/route.js
import { NextResponse }    from "next/server";
import { supabaseAdmin }   from "@/lib/supabase-admin";
import { createHash }      from "crypto";

export async function POST(request, { params }) {
  try {
    const { id }    = await params;
    const { liked } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID em falta." }, { status: 400 });
    }

    // Hash anónimo do IP para deduplicação RGPD-compliant
    const forwarded = request.headers.get("x-forwarded-for");
    const ip        = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash    = createHash("sha256").update(ip).digest("hex");

    if (liked) {
      // Tenta inserir — ignora conflito se já existir (idempotente)
      const { error } = await supabaseAdmin
        .from("project_likes")
        .insert({ project_id: id, ip_hash: ipHash })
        .select()
        .maybeSingle();

      // Código 23505 = unique_violation — já tinha like, não é erro real
      if (error && error.code !== "23505") throw error;

      // Actualiza contador denormalizado
      if (!error) {
        await supabaseAdmin.rpc("adjust_likes", {
          p_project_id: id,
          p_delta:      1,
        });
      }
    } else {
      // Remove o like deste visitante
      const { error } = await supabaseAdmin
        .from("project_likes")
        .delete()
        .eq("project_id", id)
        .eq("ip_hash",    ipHash);

      if (error) throw error;

      // Decrementa contador (mín. 0)
      await supabaseAdmin.rpc("adjust_likes", {
        p_project_id: id,
        p_delta:      -1,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[/api/projects/[id]/like]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}