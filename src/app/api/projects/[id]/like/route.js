import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request, { params }) {
  try {
    const { id } = await params; // Next.js 15 — params é uma Promise
    const { liked } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID em falta." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("project_likes")
      .upsert(
        { project_id: id, likes: liked ? 1 : 0 },
        { onConflict: "project_id" }
      );

    if (error) {
      const { error: rpcError } = await supabaseAdmin.rpc("adjust_likes", {
        p_project_id: id,
        p_delta: liked ? 1 : -1,
      });
      if (rpcError) throw rpcError;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[/api/projects/[id]/like]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}