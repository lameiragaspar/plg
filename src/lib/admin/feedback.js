"use server";

// lib/admin/feedback.js — Server Actions de feedback
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/log";

function revalidate() {
  revalidatePath("/admin/feedback");
  revalidatePath("/admin");
}

export async function markFeedbackRead(id, isRead = true) {
  const user = await requireAdmin();
  const { error } = await supabaseAdmin
    .from("feedback")
    .update({ is_read: !!isRead })
    .eq("id", id);
  if (error) return { error: "Erro ao actualizar o feedback." };

  await logActivity({ adminId: user.id, action: isRead ? "mark_read" : "mark_unread", entityType: "feedback", entityId: id });
  revalidate();
  return { ok: true };
}

export async function deleteFeedback(id) {
  const user = await requireAdmin();
  const { error } = await supabaseAdmin.from("feedback").delete().eq("id", id);
  if (error) return { error: "Erro ao eliminar o feedback." };

  await logActivity({ adminId: user.id, action: "delete", entityType: "feedback", entityId: id });
  revalidate();
  return { ok: true };
}
