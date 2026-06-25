-- =============================================================================
-- 1. LIMPEZA DOS DADOS EXISTENTES (Garante consistência na reinserção)
-- =============================================================================
TRUNCATE TABLE public.project_technologies CASCADE;
TRUNCATE TABLE public.endpoints CASCADE;
TRUNCATE TABLE public.project_likes CASCADE;
TRUNCATE TABLE public.project_views CASCADE;
TRUNCATE TABLE public.feedback CASCADE;
TRUNCATE TABLE public.contact_messages CASCADE;
TRUNCATE TABLE public.projects CASCADE;
TRUNCATE TABLE public.technologies CASCADE;

-- =============================================================================
-- 2. INSERÇÃO DAS TECNOLOGIAS SOLICITADAS (Com IDs UUID estáticos e fixos)
-- =============================================================================
INSERT INTO public.technologies (id, name, category, color_hex) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'HTML', 'language'::public.tech_category, '#E34F26'),
  ('a2222222-2222-2222-2222-222222222222', 'CSS', 'language'::public.tech_category, '#1572B6'),
  ('a3333333-3333-3333-3333-333333333333', 'JS', 'language'::public.tech_category, '#F7DF1E'),
  ('a4444444-4444-4444-4444-444444444444', 'TypeScript', 'language'::public.tech_category, '#3178C6'),
  ('a5555555-5555-5555-5555-555555555555', 'React', 'framework'::public.tech_category, '#61DAFB'),
  ('a6666666-6666-6666-6666-666666666666', 'Next', 'framework'::public.tech_category, '#000000'),
  ('a7777777-7777-7777-7777-777777777777', 'Tailwind CSS', 'framework'::public.tech_category, '#06B6D4'),
  ('a8888888-8888-8888-8888-888888888888', 'Express', 'framework'::public.tech_category, '#000000'),
  ('a9999999-9999-9999-9999-999999999999', 'REST APIs', 'concept'::public.tech_category, '#009688'),
  ('b1111111-1111-1111-1111-111111111111', 'JWT / Auth', 'concept'::public.tech_category, '#4E342E'),
  ('b2222222-2222-2222-2222-222222222222', 'PostgreSQL', 'database'::public.tech_category, '#4169E1'),
  ('b3333333-3333-3333-3333-333333333333', 'Git & GitHub', 'tool'::public.tech_category, '#F05032'),
  ('b4444444-4444-4444-4444-444444444444', 'Vercel', 'tool'::public.tech_category, '#000000'),
  ('b5555555-5555-5555-5555-555555555555', 'VS Code', 'tool'::public.tech_category, '#007ACC'),
  ('b6666666-6666-6666-6666-666666666666', 'Postman', 'tool'::public.tech_category, '#FF6C37'),
  ('b7777777-7777-7777-7777-777777777777', 'Figma', 'tool'::public.tech_category, '#F24E1E');

-- NOTE: Caso as categorias do ENUM ('language', 'concept', 'database', 'tool') 
-- sejam diferentes na sua base de dados, altere os casts acima ou remova-os.

-- =============================================================================
-- 3. INSERÇÃO DOS PROJETOS (1: Front, 2: Back, 3: Full)
-- =============================================================================
INSERT INTO public.projects (id, slug, title, description, type, status, featured, likes_count, views_count) VALUES
  (
    '00000000-0000-0000-0000-000000000001', 
    'portfolio-frontend', 
    'Meu Portfolio Pessoal', 
    'Interface moderna construída para exibição de projetos e habilidades.', 
    'frontend'::public.project_type, 
    'published'::public.project_status, 
    true, 
    12, 
    145
  ),
  (
    '00000000-0000-0000-0000-000000000002', 
    'api-gerenciador-tarefas', 
    'Task Manager API', 
    'API robusta para controle de fluxos de trabalho e autenticação de usuários.', 
    'backend'::public.project_type, 
    'published'::public.project_status, 
    false, 
    5, 
    62
  ),
  (
    '00000000-0000-0000-0000-000000000003', 
    'plataforma-e-commerce', 
    'E-Commerce Completo', 
    'Aplicação fullstack ponta a ponta com carrinho de compras integrado e painel administrativo.', 
    'fullstack'::public.project_type, 
    'published'::public.project_status, 
    true, 
    34, 
    412
  );

-- =============================================================================
-- 4. VÍNCULO DE TECNOLOGIAS AOS PROJETOS (Tabela Pivot)
-- =============================================================================
-- Projeto 1 (Frontend): React, Next, Tailwind CSS, Figma
INSERT INTO public.project_technologies (project_id, tech_id, role, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'a5555555-5555-5555-5555-555555555555', 'main', 1),
  ('00000000-0000-0000-0000-000000000001', 'a6666666-6666-6666-6666-666666666666', 'main', 2),
  ('00000000-0000-0000-0000-000000000001', 'a7777777-7777-7777-7777-777777777777', 'main', 3),
  ('00000000-0000-0000-0000-000000000001', 'b7777777-7777-7777-7777-777777777777', 'auxiliary', 4);

-- Projeto 2 (Backend): Express, TypeScript, REST APIs, PostgreSQL
INSERT INTO public.project_technologies (project_id, tech_id, role, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000002', 'a8888888-8888-8888-8888-888888888888', 'main', 1),
  ('00000000-0000-0000-0000-000000000002', 'a4444444-4444-4444-4444-444444444444', 'main', 2),
  ('00000000-0000-0000-0000-000000000002', 'a9999999-9999-9999-9999-999999999999', 'main', 3),
  ('00000000-0000-0000-0000-000000000002', 'b2222222-2222-2222-2222-222222222222', 'main', 4);

-- Projeto 3 (Fullstack): Next, TypeScript, Express, PostgreSQL, JWT / Auth
INSERT INTO public.project_technologies (project_id, tech_id, role, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000003', 'a6666666-6666-6666-6666-666666666666', 'main', 1),
  ('00000000-0000-0000-0000-000000000003', 'a4444444-4444-4444-4444-444444444444', 'main', 2),
  ('00000000-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 'main', 3),
  ('00000000-0000-0000-0000-000000000003', 'b1111111-1111-1111-1111-111111111111', 'main', 4);

-- =============================================================================
-- 5. INSERÇÃO DE DADOS COERENTES CORELATOS (Endpoints & Feedback)
-- =============================================================================
-- Endpoints fictícios para a API (Projeto 2)
INSERT INTO public.endpoints (project_id, method, path, description, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000002', 'GET'::public.http_method, '/api/v1/tasks', 'Retorna a lista de tarefas filtradas', 1),
  ('00000000-0000-0000-0000-000000000002', 'POST'::public.http_method, '/api/v1/tasks', 'Cria uma nova tarefa no escopo', 2);

-- Feedbacks estruturados para validação das restrições (Projeto 3)
INSERT INTO public.feedback (project_id, rating, comment, ip_hash, page) VALUES
  ('00000000-0000-0000-0000-000000000003', 5, 'Excelente fluidez no checkout! Parabéns.', 'hash_demo_1', 'checkout_page');