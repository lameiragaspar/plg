-- =============================================================================
-- PLG Dev — Migração: Painel de Administração (/admin)
-- =============================================================================
-- Idempotente sempre que possível. Executar no SQL Editor do Supabase.
-- Cobre: enums defensivos, campos de controlo, trigger updated_at, auditoria,
-- índices, RLS e correcção de dados em project_technologies.role.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ENUM project_status — garantir os 3 estados de forma defensiva
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e
                 JOIN pg_type t ON t.oid = e.enumtypid
                 WHERE t.typname = 'project_status' AND e.enumlabel = 'draft') THEN
    ALTER TYPE public.project_status ADD VALUE 'draft';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e
                 JOIN pg_type t ON t.oid = e.enumtypid
                 WHERE t.typname = 'project_status' AND e.enumlabel = 'published') THEN
    ALTER TYPE public.project_status ADD VALUE 'published';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e
                 JOIN pg_type t ON t.oid = e.enumtypid
                 WHERE t.typname = 'project_status' AND e.enumlabel = 'archived') THEN
    ALTER TYPE public.project_status ADD VALUE 'archived';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. CAMPOS DE CONTROLO E LEITURA
-- -----------------------------------------------------------------------------
-- feedback.is_read  (o schema já o define, mas garantimos idempotência)
ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false;

-- projects.updated_at  (idem)
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Trigger de auto-update do updated_at em projects
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. AUDITORIA — admin_activity_log
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   uuid,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_activity_log_pkey PRIMARY KEY (id),
  CONSTRAINT admin_activity_log_admin_id_fkey
    FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 4. ÍNDICES — colunas mais filtradas pelo painel
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_status        ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_type          ON public.projects (type);
CREATE INDEX IF NOT EXISTS idx_projects_featured      ON public.projects (featured);
CREATE INDEX IF NOT EXISTS idx_feedback_is_read       ON public.feedback (is_read);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at    ON public.feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read          ON public.contact_messages (read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at    ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_created_at    ON public.admin_activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proj_tech_project      ON public.project_technologies (project_id);

-- -----------------------------------------------------------------------------
-- 5. CORRECÇÃO DE DADOS — project_technologies.role
-- -----------------------------------------------------------------------------
-- O seed usa 'main' para todas as relações, o que impede o filtro frontTech /
-- backTech na UI. Reclassificamos com base no tipo do projecto e no nome da tech.
-- (Mantém-se 'main' apenas quando não há informação suficiente.)
DO $$
BEGIN
  -- Só corre se o enum tech_role tiver os valores frontend/backend.
  IF EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
             WHERE t.typname = 'tech_role' AND e.enumlabel = 'frontend')
  AND EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
             WHERE t.typname = 'tech_role' AND e.enumlabel = 'backend') THEN

    -- Tecnologias tipicamente frontend
    UPDATE public.project_technologies pt
    SET role = 'frontend'::public.tech_role
    FROM public.technologies te
    WHERE pt.tech_id = te.id
      AND pt.role = 'main'::public.tech_role
      AND te.name IN ('HTML','CSS','JS','React','Next','Tailwind CSS','Figma','TypeScript');

    -- Tecnologias tipicamente backend
    UPDATE public.project_technologies pt
    SET role = 'backend'::public.tech_role
    FROM public.technologies te
    WHERE pt.tech_id = te.id
      AND pt.role = 'main'::public.tech_role
      AND te.name IN ('Express','REST APIs','JWT / Auth','PostgreSQL');
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 6. RLS — Row Level Security
-- -----------------------------------------------------------------------------
-- Estratégia:
--   • A service role (usada em supabase-admin e nas Server Actions com sessão
--     de admin) ignora SEMPRE o RLS — continua a poder ler/escrever tudo.
--   • A anon key (browser) só pode LER projectos publicados e tecnologias.
--   • Escritas públicas (likes/views/feedback/contact) mantêm-se via service
--     role nas rotas /api existentes, por isso NÃO abrimos INSERT ao anon aqui.
-- -----------------------------------------------------------------------------

-- Activar RLS
ALTER TABLE public.projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endpoints            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log   ENABLE ROW LEVEL SECURITY;

-- Leitura pública de projectos publicados
DROP POLICY IF EXISTS "public read published projects" ON public.projects;
CREATE POLICY "public read published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published'::public.project_status);

-- Leitura pública de tecnologias
DROP POLICY IF EXISTS "public read technologies" ON public.technologies;
CREATE POLICY "public read technologies"
  ON public.technologies FOR SELECT
  TO anon, authenticated
  USING (true);

-- Leitura pública das relações projecto-tecnologia (filtradas por projecto publicado)
DROP POLICY IF EXISTS "public read project_technologies" ON public.project_technologies;
CREATE POLICY "public read project_technologies"
  ON public.project_technologies FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_technologies.project_id
        AND p.status = 'published'::public.project_status
    )
  );

-- Leitura pública de endpoints (de projectos publicados)
DROP POLICY IF EXISTS "public read endpoints" ON public.endpoints;
CREATE POLICY "public read endpoints"
  ON public.endpoints FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = endpoints.project_id
        AND p.status = 'published'::public.project_status
    )
  );

-- NOTA: project_likes, project_views, feedback, contact_messages e
-- admin_activity_log ficam SEM políticas para anon — logo, inacessíveis pela
-- anon key. Todo o acesso continua a ser feito pela service role (que ignora
-- RLS) nas rotas /api e nas Server Actions do painel admin.

-- =============================================================================
-- FIM DA MIGRAÇÃO
-- =============================================================================
