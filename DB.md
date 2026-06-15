-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  type USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::project_status,
  motivation text,
  learnings text,
  image_url text,
  github_url text,
  deploy_url text,
  featured boolean NOT NULL DEFAULT false,
  likes_count integer NOT NULL DEFAULT 0,
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.technologies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category USER-DEFINED NOT NULL DEFAULT 'framework'::tech_category,
  icon_url text,
  color_hex text,
  CONSTRAINT technologies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.project_technologies (
  project_id uuid NOT NULL,
  tech_id uuid NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'main'::tech_role,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT project_technologies_pkey PRIMARY KEY (project_id, tech_id),
  CONSTRAINT project_technologies_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT project_technologies_tech_id_fkey FOREIGN KEY (tech_id) REFERENCES public.technologies(id)
);
CREATE TABLE public.endpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  method USER-DEFINED NOT NULL,
  path text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT endpoints_pkey PRIMARY KEY (id),
  CONSTRAINT endpoints_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  ip_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_likes_pkey PRIMARY KEY (id),
  CONSTRAINT project_likes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  ip_hash text NOT NULL,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_views_pkey PRIMARY KEY (id),
  CONSTRAINT project_views_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  ip_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  page text,
  CONSTRAINT feedback_pkey PRIMARY KEY (id),
  CONSTRAINT feedback_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  replied boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);