// app/api/contact/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name?.trim() || !email?.includes("@") || !message?.trim()) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({ name: name.trim(), email, subject, message: message.trim() });

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}