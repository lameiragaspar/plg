// lib/admin/log.js — SERVER ONLY
// Helper de auditoria — regista acções do painel admin em admin_activity_log.
// Usa a service role (supabaseAdmin) para contornar RLS. Nunca lança erro para
// o caller: o log é best-effort e não deve bloquear a acção principal.
import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * @param {object} params
 * @param {string} params.adminId     - id do utilizador (auth.users)
 * @param {string} params.action      - ex.: "create", "update", "delete", "mark_read"
 * @param {string} params.entityType  - ex.: "project", "feedback", "message"
 * @param {string} [params.entityId]  - uuid da entidade afectada
 * @param {object} [params.metadata]  - dados extra (jsonb)
 */
export async function logActivity({ adminId, action, entityType, entityId = null, metadata = null }) {
  try {
    if (!adminId) return;
    await supabaseAdmin.from("admin_activity_log").insert({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
    });
  } catch (err) {
    // Best-effort — não propaga.
    console.error("[logActivity]", err);
  }
}
