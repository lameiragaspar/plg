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
├── supabase.js              # Cliente público
└── constants/               # Config estática (categories, stack, etc.)
```

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