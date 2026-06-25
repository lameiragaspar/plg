import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createHash } from "crypto";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID em falta." }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ipBruto = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash = createHash("sha256").update(ipBruto).digest("hex");

    const hoje = new Date().toISOString().split("T")[0];

    const { data: viewExistente } = await supabaseAdmin
      .from("project_views")
      .select("id")
      .eq("project_id", id)
      .eq("ip_hash", ipHash)
      .gte("created_at", `${hoje}T00:00:00Z`)
      .maybeSingle();

    if (viewExistente) {
      return NextResponse.json({ ok: true, counted: false }, { status: 200 });
    }

    const { error: erroInsert } = await supabaseAdmin
      .from("project_views")
      .insert({ project_id: id, ip_hash: ipHash });

    if (erroInsert) throw erroInsert;

    // ← LINHA NOVA: actualiza o contador desnormalizado em projects
    await supabaseAdmin.rpc("adjust_views", {
      p_project_id: id,
      p_delta: 1,
    });

    return NextResponse.json({ ok: true, counted: true }, { status: 201 });
  } catch (erro) {
    console.error("[/api/projects/[id]/view]", erro);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}