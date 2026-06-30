# PLG Dev — Portfólio FullStack

Portfolio pessoal construído com Next.js 16 (App Router), React 19 e Tailwind CSS v4. Inclui um backend real com Supabase — likes, views e mensagens de contacto são persistidos numa base de dados PostgreSQL.

Live: [plgdev.vercel.app](https://plg-dev.vercel.app)

---

## Stack

 Camada      |   Tecnologia 

 Framework       Next.js 16.2 (App Router) 
 UI              React 19, Tailwind CSS 4, Framer Motion 12 
 Base de dados   Supabase (PostgreSQL) 
 Deploy          Vercel 
 Analytics       Vercel Analytics 

---

## Estrutura

```
app/
├── page.js                  # Home — Server Component
├── about/page.js
├── contact/page.js
├── projects/
│   ├── page.js              # Listagem geral
│   ├── frontend/page.js
│   ├── backend/page.js
│   └── fullstack/page.js
└── api/
    ├── projects/route.js
    ├── projects/[id]/like/route.js
    ├── projects/[id]/view/route.js
    ├── feedback/route.js
    └── contact/route.js

components/
├── home/                    # Secções da homepage
├── projects/                # Cards, modal, grid, filtros
└── [shared]                 # Header, Footer, FadeIn, etc.

lib/
├── Projects.js              # Data layer (server-only)
├── supabase-admin.js        # Cliente com service key
├── supabase-server.js       # Cliente SSR (sessão via cookies) — auth admin
├── supabase.js              # Cliente público
├── admin/                   # Lógica do painel admin (server-only)
│   ├── auth.js              # requireAdmin() / getAdminUser()
│   ├── session.js           # Server Actions de login/logout
│   ├── queries.js           # Leituras do painel (vê drafts)
│   ├── projects.js          # Server Actions CRUD de projectos
│   ├── feedback.js          # Server Actions de feedback
│   ├── messages.js          # Server Actions de mensagens
│   └── log.js               # Auditoria (admin_activity_log)
└── constants/               # Config estática (categories, stack, etc.)

middleware.js                # Protege /admin/* (redirect p/ login)
```

---

## Painel de Administração (`/admin`)

Área privada para gerir o conteúdo do portfólio, protegida por autenticação
Supabase (email + password) e Row Level Security.

```
app/admin/
├── login/page.js            # Formulário de login (fora do shell)
└── (panel)/                 # Grupo protegido — AdminShell com sidebar
    ├── layout.js            # requireAdmin() + AdminSidebar
    ├── page.js              # Dashboard (contagens agregadas)
    ├── projects/            # CRUD de projectos (list / new / [id])
    ├── feedback/page.js     # Inbox de feedback
    └── messages/page.js     # Inbox de mensagens de contacto
```

**Funcionalidades:**
- **Autenticação** via `@supabase/ssr` com sessão em cookies; `middleware.js`
  intercepta `/admin/*` e a função `requireAdmin()` protege Server Components e
  Server Actions (defesa em profundidade).
- **CRUD de projectos** com formulário único (criação/edição), gestão de
  tecnologias por papel (front/back) e editor de endpoints.
- **Acções rápidas**: mudar estado (rascunho/publicado/arquivado), destaque,
  marcar feedback/mensagens como lido/respondido, eliminar.
- **Auditoria**: cada acção fica registada em `admin_activity_log`.
- `revalidatePath` actualiza as páginas públicas após cada alteração.

### Autenticação — onde ficam os admins

> **Não existe (nem deve existir) uma tabela de utilizadores no schema `public`.**

A autenticação usa o **Supabase Auth**, que gere a tabela interna `auth.users`
(schema `auth`, mantido pelo próprio Supabase — fora do SQL da aplicação). O
schema da aplicação já depende dela:

```sql
CONSTRAINT admin_activity_log_admin_id_fkey
  FOREIGN KEY (admin_id) REFERENCES auth.users(id)
```

Vantagens face a criar uma tabela `users` própria:

- **Senha sempre cifrada** — o Supabase faz *hash* com **bcrypt** automaticamente;
  a palavra-passe nunca é guardada nem trafegada em texto simples.
- **Sessões seguras** — JWT + *refresh token* geridos em cookies httpOnly via
  `@supabase/ssr`, renovados pelo `middleware.js`.
- **Sem reinventar segurança** — *reset* de senha, *rate-limiting* e confirmação
  de email já vêm resolvidos.

O login (`signInWithPassword`) valida as credenciais contra `auth.users`; criar
uma tabela própria com coluna de senha seria um anti-padrão de segurança.

### Setup do admin — passo a passo

**1. Aplicar a migração SQL.**
No dashboard do Supabase: *SQL Editor → New query*, colar o conteúdo de
`supabase/migrations/20260630_admin_panel.sql` e executar (*Run*). Cria enums,
`is_read`, trigger `updated_at`, `admin_activity_log`, índices, RLS e corrige
`project_technologies.role`.

**2. Cadastrar o utilizador administrador — pelo Dashboard (recomendado).**

1. No dashboard do Supabase, abrir **Authentication** (menu lateral).
2. Separador **Users → botão *Add user* → *Create new user***.
3. Preencher **Email** e **Password** (use uma palavra-passe forte).
4. Activar **Auto Confirm User** — assim o utilizador fica confirmado de
   imediato, sem precisar de email de confirmação.
5. Clicar **Create user**.

Pronto — o Supabase guarda o utilizador em `auth.users` com a senha já cifrada
(bcrypt). Não é necessário (nem possível) criar o admin via SQL Editor.

> ℹ️ **Nota:** `auth.admin_create_user(...)` **não** existe no SQL Editor — é
> apenas uma operação da Admin API (servidor). Por isso, o cadastro faz-se
> sempre pelo Dashboard (ou programaticamente via Admin API com a service key).
> Nunca inserir directamente em `auth.users` à mão — a senha tem de passar pelo
> *hashing* do Supabase.

**3. Confirmar as variáveis de ambiente** em `.env.local` (e na Vercel):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e
`SUPABASE_SECRET_KEY`.

**4. Aceder a `/admin/login`** com o email e palavra-passe criados. Após o
login, o `middleware.js` mantém a sessão e liberta o acesso a `/admin/*`.

> **Adicionar mais admins:** basta repetir o passo 2 — qualquer utilizador em
> `auth.users` tem acesso ao painel. Se quiser restringir a emails específicos,
> pode reforçar `requireAdmin()` em `src/lib/admin/auth.js` com uma *allowlist*
> de emails (ver nota no próprio ficheiro).

---

## Funcionalidades

- **Likes** com optimistic UI — toggle persistido no Supabase com deduplicação por visitor hash
- **Views** contabilizadas uma vez por IP/dia via hash SHA-256
- **Formulário de contacto** com validação e persistência na DB
- **Feedback por página** de projectos com rating e menção opcional a projecto
- **Dark mode forçado** — sem flash em dispositivos com Light Mode activo
- **Animações** com Framer Motion e IntersectionObserver para count-up
- Filtros por tecnologia e pesquisa em tempo real nas páginas de projectos

---

## Desenvolvimento local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# preencher NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e SUPABASE_SECRET_KEY

# Iniciar o servidor de desenvolvimento
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Base de dados

O schema está documentado em `DB.md`. As tabelas principais são `projects`, `technologies`, `project_technologies`, `project_likes`, `project_views`, `feedback` e `contact_messages`.

As RPCs `adjust_likes` e `adjust_views` garantem actualizações atómicas dos contadores desnormalizados em `projects`.

---

## Deploy

O projecto está configurado para Vercel com `force-dynamic` nas rotas de dados. As variáveis de ambiente são definidas no dashboard da Vercel.

```bash-
npm run build   # verifica erros antes de fazer push
```