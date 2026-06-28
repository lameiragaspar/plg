-- =============================================================================
-- PLG Dev — Seed Master Consolidado (Versão 100% Corrigida)
-- Execução: tecnologias → projetos → project_technologies → endpoints
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. LIMPEZA SEGURA DOS DADOS EXISTENTES (Respeitando chaves estrangeiras)
-- -----------------------------------------------------------------------------
TRUNCATE TABLE public.project_technologies CASCADE;
TRUNCATE TABLE public.endpoints CASCADE;
TRUNCATE TABLE public.project_likes CASCADE;
TRUNCATE TABLE public.project_views CASCADE;
TRUNCATE TABLE public.feedback CASCADE;
TRUNCATE TABLE public.contact_messages CASCADE;
TRUNCATE TABLE public.projects CASCADE;
TRUNCATE TABLE public.technologies CASCADE;

-- -----------------------------------------------------------------------------
-- 1. INSERÇÃO DE TODAS AS TECNOLOGIAS ÚNICAS (Nomenclatura Alinhada ao Frontend)
-- -----------------------------------------------------------------------------
INSERT INTO public.technologies (id, name, category, color_hex) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'HTML', 'language'::public.tech_category, '#E34F26'),
  ('b0000002-0000-0000-0000-000000000002', 'CSS', 'language'::public.tech_category, '#1572B6'),
  ('b0000003-0000-0000-0000-000000000003', 'JS', 'language'::public.tech_category, '#F7DF1E'),
  ('b0000004-0000-0000-0000-000000000004', 'TypeScript', 'language'::public.tech_category, '#3178C6'),
  ('b0000005-0000-0000-0000-000000000005', 'React', 'framework'::public.tech_category, '#61DAFB'),
  ('b0000006-0000-0000-0000-000000000006', 'Next', 'framework'::public.tech_category, '#000000'),
  ('b0000007-0000-0000-0000-000000000007', 'Tailwind CSS', 'framework'::public.tech_category, '#06B6D4'),
  ('b0000008-0000-0000-0000-000000000008', 'Express', 'framework'::public.tech_category, '#000000'),
  ('b0000009-0000-0000-0000-000000000009', 'REST APIs', 'concept'::public.tech_category, '#009688'),
  ('b0000010-0000-0000-0000-000000000010', 'JWT / Auth', 'concept'::public.tech_category, '#4E342E'),
  ('b0000011-0000-0000-0000-000000000011', 'PostgreSQL', 'database'::public.tech_category, '#4169E1'),
  ('b0000012-0000-0000-0000-000000000012', 'Git & GitHub', 'tool'::public.tech_category, '#F05032'),
  ('b0000013-0000-0000-0000-000000000013', 'Vercel', 'tool'::public.tech_category, '#000000'),
  ('b0000014-0000-0000-0000-000000000014', 'VS Code', 'tool'::public.tech_category, '#007ACC'),
  ('b0000015-0000-0000-0000-000000000015', 'Postman', 'tool'::public.tech_category, '#FF6C37'),
  ('b0000016-0000-0000-0000-000000000016', 'Figma', 'tool'::public.tech_category, '#F24E1E')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. INSERÇÃO DOS PROJETOS (IDs Estáticos e Ordenados por Tipo: 1, 2, 3)
-- -----------------------------------------------------------------------------
INSERT INTO public.projects (
  id, slug, title, description, type, status, motivation, learnings, image_url, github_url, deploy_url, featured
) VALUES
  (
    -- Projeto 1: Frontend
    '00000000-0000-0000-0000-000000000001', 
    'landing-moderna', 
    'Meu Portfolio & Landing Pessoal', 
    'Interface ultra-rápida e moderna construída com foco em conversão, SEO e performance otimizada.', 
    'frontend'::public.project_type, 
    'published'::public.project_status, 
    'Criar uma landing page de altíssima conversão e performance sem carregar frameworks desnecessários ou pesados.', 
    'Otimização profunda de Core Web Vitals, manipulação avançada de layouts responsivos e estratégias eficientes de Call To Action (CTA).', 
    'https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg', 
    'https://github.com/pedro/portfolio-frontend', 
    'https://landing-moderna.vercel.app', 
    true
  ),
  (
    -- Projeto 2: Backend
    '00000000-0000-0000-0000-000000000002', 
    'api-logistica', 
    'Task Manager & API de Logística', 
    'API robusta estruturada em microsserviços para controlo de fluxos de entregas e rastreio em tempo real com uso de cache.', 
    'backend'::public.project_type, 
    'published'::public.project_status, 
    'Otimizar rotas críticas de distribuição e entregas para múltiplos transportadores simultâneos de forma assíncrona.', 
    'Construção de arquitetura escalável com Express, gestão inteligente de cache e persistência otimizada com queries complexas no PostgreSQL.', 
    NULL, 
    'https://github.com/pedro/api-logistica', 
    NULL, 
    false
  ),
  (
    -- Projeto 3: Fullstack
    '00000000-0000-0000-0000-000000000003', 
    'ecommerce-pro', 
    'Plataforma E-Commerce Pro', 
    'Aplicação fullstack ponta a ponta com fluxo de checkout completo, controlo de inventário em tempo real e painel admin integrado.', 
    'fullstack'::public.project_type, 
    'published'::public.project_status, 
    'Desenvolver um ecossistema completo e escalável para lojistas independentes gerenciarem produtos e vendas sem atritos.', 
    'Gestão completa de estados globais complexos no cliente frontend, modelagem de banco relacional integrado e segurança rigorosa em fluxos de webhooks de pagamento.', 
    'https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2023/02/example-javascript-code.jpg', 
    'https://github.com/pedro/ecommerce-pro', 
    'https://ecommerce-pro.vercel.app', 
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. RELACIONAMENTO PROJETO X TECNOLOGIAS (IDs de projetos corrigidos e mapeados)
-- -----------------------------------------------------------------------------
-- Projeto 1 (Frontend): React, Next, Tailwind CSS, Figma
INSERT INTO public.project_technologies (project_id, tech_id, role, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'b0000005-0000-0000-0000-000000000005', 'main'::public.tech_role, 1), 
  ('00000000-0000-0000-0000-000000000001', 'b0000006-0000-0000-0000-000000000006', 'main'::public.tech_role, 2), 
  ('00000000-0000-0000-0000-000000000001', 'b0000007-0000-0000-0000-000000000007', 'main'::public.tech_role, 3), 
  ('00000000-0000-0000-0000-000000000001', 'b0000016-0000-0000-0000-000000000016', 'main'::public.tech_role, 4);

-- Projeto 2 (Backend): Express, TypeScript, REST APIs, PostgreSQL  <-- CORRIGIDO AQUI (Final 02 em vez de 11)
INSERT INTO public.project_technologies (project_id, tech_id, role, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000002', 'b0000008-0000-0000-0000-000000000008', 'main'::public.tech_role, 1), 
  ('00000000-0000-0000-0000-000000000002', 'b0000004-0000-0000-0000-000000000004', 'main'::public.tech_role, 2), 
  ('00000000-0000-0000-0000-000000000002', 'b0000009-0000-0000-0000-000000000009', 'main'::public.tech_role, 3), 
  ('00000000-0000-0000-0000-000000000002', 'b0000011-0000-0000-0000-000000000011', 'main'::public.tech_role, 4);

-- Projeto 3 (Fullstack): Next, TypeScript, Express, PostgreSQL, JWT / Auth
INSERT INTO public.project_technologies (project_id, tech_id, role, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000003', 'b0000006-0000-0000-0000-000000000006', 'main'::public.tech_role, 1), 
  ('00000000-0000-0000-0000-000000000003', 'b0000004-0000-0000-0000-000000000004', 'main'::public.tech_role, 2), 
  ('00000000-0000-0000-0000-000000000003', 'b0000008-0000-0000-0000-000000000008', 'main'::public.tech_role, 3), 
  ('00000000-0000-0000-0000-000000000003', 'b0000011-0000-0000-0000-000000000011', 'main'::public.tech_role, 4), 
  ('00000000-0000-0000-0000-000000000003', 'b0000010-0000-0000-0000-000000000010', 'main'::public.tech_role, 5)
ON CONFLICT (project_id, tech_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. ENDPOINTS DA API (Exclusivo do Projeto Backend / Linha de Logística)
-- -----------------------------------------------------------------------------
INSERT INTO public.endpoints (project_id, method, path, description, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000002', 'GET'::public.http_method, '/api/v1/orders', 'Retorna uma lista paginada de encomendas ativas para rastreio.', 1),
  ('00000000-0000-0000-0000-000000000002', 'POST'::public.http_method, '/api/v1/orders', 'Cria e despacha um novo registro de encomenda no fluxo logístico.', 2),
  ('00000000-0000-0000-0000-000000000002', 'GET'::public.http_method, '/api/v1/orders/:id', 'Obtém o histórico de status detalhado de uma encomenda específica.', 3),
  ('00000000-0000-0000-0000-000000000002', 'DELETE'::public.http_method, '/api/v1/orders/:id', 'Cancela ou remove logicamente uma encomenda do fluxo principal.', 4);

-- -----------------------------------------------------------------------------
-- 5. DADOS COERENTES DE COMPLEMENTO (Feedbacks iniciais estruturados)
-- -----------------------------------------------------------------------------
INSERT INTO public.feedback (project_id, rating, comment, ip_hash, page) VALUES
  ('00000000-0000-0000-0000-000000000003', 5, 'O sistema de checkout em tempo real funcionou sem nenhuma latência.', 'hash_inicial_1', 'checkout'),
  ('00000000-0000-0000-0000-000000000001', 5, 'A animação e o tempo de resposta visual da landing page ficaram excelentes.', 'hash_inicial_2', 'home_portfolio');