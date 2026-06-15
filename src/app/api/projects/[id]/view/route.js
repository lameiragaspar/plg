import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createHash } from "crypto";

export async function POST(request, { params }) {
  try {
    const { id } = await params; // Next.js 15 — params é uma Promise

    if (!id) {
      return NextResponse.json({ error: "ID em falta." }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabaseAdmin
      .from("project_views")
      .select("id")
      .eq("project_id", id)
      .eq("ip_hash", ipHash)
      .gte("created_at", `${today}T00:00:00Z`)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, counted: false }, { status: 200 });
    }

    const { error } = await supabaseAdmin
      .from("project_views")
      .insert({ project_id: id, ip_hash: ipHash });

    if (error) throw error;

    return NextResponse.json({ ok: true, counted: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/projects/[id]/view]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}