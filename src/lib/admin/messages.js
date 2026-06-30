"use server";

// lib/admin/messages.js — Server Actions de mensagens de contacto
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/log";

function revalidate() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markMessageRead(id, read = true) {
  const user = await requireAdmin();
  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update({ read: !!read })
    .eq("id", id);
  if (error) return { error: "Erro ao actualizar a mensagem." };

  await logActivity({ adminId: user.id, action: read ? "mark_read" : "mark_unread", entityType: "message", entityId: id });
  revalidate();
  return { ok: true };
}

export async function markMessageReplied(id, replied = true) {
  const user = await requireAdmin();
  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update({ replied: !!replied })
    .eq("id", id);
  if (error) return { error: "Erro ao actualizar a mensagem." };

  await logActivity({ adminId: user.id, action: replied ? "mark_replied" : "mark_unreplied", entityType: "message", entityId: id });
  revalidate();
  return { ok: true };
}

export async function deleteMessage(id) {
  const user = await requireAdmin();
  const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", id);
  if (error) return { error: "Erro ao eliminar a mensagem." };

  await logActivity({ adminId: user.id, action: "delete", entityType: "message", entityId: id });
  revalidate();
  return { ok: true };
}
