<div align="center">

<h1>🔥 PinicoFit</h1>
<p><strong>A full-stack fitness & productivity ecosystem — track goals, build streaks, and own your day.</strong></p>

<!-- Ecosystem badges -->
<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-db-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>
<p>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-animations-DB2777?style=for-the-badge" />
</p>
<p>
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-state-111111?style=for-the-badge" />
  <img alt="Zod" src="https://img.shields.io/badge/Zod-validation-1E293B?style=for-the-badge" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

</div>

---

## Quick Access

[🇺🇸 English](#en-us) • [🇧🇷 Português](#pt-br)

---

## <a id="en-us"></a>🇺🇸 English

### What is PinicoFit?

PinicoFit is a **mobile-first fitness and productivity platform** that transforms daily habits into measurable streaks. Users log water intake, nutrition, sleep, workouts, and focus tasks — and the system evaluates each day as a "contract": either you kept it, or you didn't.

The platform is structured as a **monorepo** with two independently deployable services:

| Directory | Role | Core Stack |
|-----------|------|------------|
| [`/web`](./web/) | Client SPA — UI, routing, state, animations | React 19, Vite, Tailwind, Zustand, TanStack Query |
| [`/server`](./server/) | REST API — auth, business logic, database | NestJS 11, Prisma, PostgreSQL, JWT |

---

### Repository Structure

```
pinico-fit/
├── web/                        # Frontend (React + Vite)
│   └── src/
│       ├── pages/              # Route-level screens (Dashboard, Goals, Meals, etc.)
│       ├── components/         # Reusable UI (AnimatedFlame, modals, inputs)
│       ├── routes/             # ProtectedRoute + PublicRoute guards
│       ├── layouts/            # Navigation shell and screen scaffolding
│       ├── store/              # Zustand stores (auth, settings, workout state)
│       ├── services/           # Axios client with JWT injection + 401 auto-logout
│       ├── hooks/              # useIsMobile, useScrollLock, useNavigationLock
│       ├── schemas/            # Zod validation schemas
│       └── types/              # TypeScript contracts (API + view models)
│
├── server/                     # Backend (NestJS + Prisma)
│   └── src/
│       ├── auth/               # Sign-in, JWT generation and guard
│       ├── users/              # Profile, preferences, goal toggles and tolerances
│       ├── meals/ foods/ recipes/  # Full nutrition domain
│       ├── water/              # Water logging and weekly history
│       ├── sleep/              # Sleep and nap logging with history
│       ├── workouts/           # Settings, presets, daily workout, logs
│       ├── tasks/              # Daily and dated task management
│       ├── streak/             # Cross-domain contract evaluation
│       ├── goals-aggregator/   # BFF endpoint — single payload for Goals dashboard
│       └── health/             # Uptime probe endpoint
│
└── README.md                   # ← You are here
```

---

### Key Features

#### 🎯 Goals Dashboard & Daily Contract
The centerpiece of the UX. Every tracked domain (water, nutrition, sleep, workout, tasks) is evaluated against the user's personal thresholds at the end of the day. The result is a binary "contract kept / broken" that feeds into the streak engine. Tolerance sliders let users define exactly how strict their own contract is — 80% of water goal still counts, or it doesn't. That's their call.

#### ⚡ BFF Aggregator — One Request, Full Context
The Goals page requires data from six separate domains simultaneously. Rather than firing parallel client-side requests, the backend exposes a dedicated aggregator endpoint:

```
GET /goals/daily-summary?date=YYYY-MM-DD
```

This endpoint internally runs `Promise.all()` across all relevant services and returns a single normalized payload. The frontend consumes it with a single TanStack Query call, keeping the Goals screen fast even on mobile connections.

#### 🔐 Auth-First Architecture
- JWT Bearer tokens issued on sign-in and verified on every protected route via `AuthGuard`
- Zustand `persist` keeps the session in `localStorage` with a `_hasHydrated` flag to prevent UI flicker during bootstrap
- Axios interceptors inject the token on every request and trigger automatic logout on `401`
- All data reads and writes are scoped to `req.user.sub` to prevent cross-user data leakage

---

### System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Browser (React SPA)                  │
│                                                          │
│  Zustand (auth/session/settings)                         │
│       │                                                  │
│  TanStack Query ──── Axios (Bearer token injected)       │
│       │                     │                            │
│       │            401 → auto-logout                     │
└───────┼─────────────────────┼────────────────────────────┘
        │                     │
        ▼                     ▼
┌──────────────────────────────────────────────────────────┐
│                  NestJS REST API (/server)                │
│                                                          │
│  AuthGuard (JWT)  →  Controllers  →  Services            │
│                                           │              │
│  goals-aggregator (BFF)                   │              │
│  ├── /water        ─────────┐             │              │
│  ├── /meals        ─────────┤             │              │
│  ├── /sleep        ─────────┤  Promise    │              │
│  ├── /workouts     ─────────┤  .all()     ▼              │
│  ├── /tasks        ─────────┤         Prisma ORM         │
│  └── /streak       ─────────┘             │              │
│                                           ▼              │
│                                    PostgreSQL             │
└──────────────────────────────────────────────────────────┘
```

The frontend never talks directly to the database — all business logic lives in the NestJS service layer. The BFF aggregator pattern means the Goals dashboard makes **one** network round-trip regardless of how many domains are tracked.

---

### Getting Started

#### Prerequisites

- **Node.js 18+**
- **PostgreSQL** (local instance or hosted)
- npm (or your preferred package manager)

#### 1. Clone the repository

```bash
git clone https://github.com/romeupeniche/pinicofit.git
cd pinicofit
```

#### 2. Configure the backend environment

```bash
cd server
cp .env.example .env   # or create manually
```

```bash
# server/.env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
APP_URL="http://localhost:5173"

# Optional — email verification and monthly reports
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your@email.com"
SMTP_PASS="your-password"
MAIL_FROM="PinicoFit <no-reply@example.com>"
```

#### 3. Set up the database

```bash
# still in /server
npx prisma generate
npx prisma migrate deploy
```

#### 4. Configure the frontend environment

```bash
cd ../web
```

```bash
# web/.env
VITE_API_URL="http://localhost:3000"
```

#### 5. Install dependencies (both services)

```bash
# From the root:
npm install --prefix server
npm install --prefix web
```

#### 6. Run both services

Open two terminal sessions:

```bash
# Terminal 1 — backend
cd server
npm run dev
# API available at http://localhost:3000
```

```bash
# Terminal 2 — frontend
cd web
npm run dev
# App available at http://localhost:5173
```

#### 7. Health check

```bash
curl http://localhost:3000/health
# → { "status": "ok", "timestamp": "..." }
```

---

### API Reference (Summary)

| Domain | Endpoint | Method |
|--------|----------|--------|
| Auth | `/auth/signin` | POST |
| User | `/users/me` | GET |
| User | `/users/:id` | PATCH |
| Meals | `/meals/log?date=...` | GET / POST |
| Water | `/water/today` · `/water/log` · `/water/history` | GET / POST |
| Sleep | `/sleep/today?date=...` · `/sleep/log` | GET / POST |
| Workouts | `/workouts/today?date=...` · `/workouts/log` | GET / POST |
| Tasks | `/tasks/today?date=...` | GET / CRUD |
| Streak | `/streak/me?date=...` | GET |
| **Aggregator** | **`/goals/daily-summary?date=...`** | **GET** |

Full endpoint inventory: audit `server/src/**/**.controller.ts`.

---

### Running Tests

```bash
cd server
npm test
```

---

<hr />

## <a id="pt-br"></a>🇧🇷 Português

### O que é o PinicoFit?

O PinicoFit é uma **plataforma mobile-first de fitness e produtividade** que transforma hábitos diários em sequências mensuráveis. O usuário registra consumo de água, alimentação, sono, treino e tarefas — e o sistema avalia cada dia como um "contrato": ou foi cumprido, ou não.

A plataforma é organizada como um **monorepo** com dois serviços independentes:

| Diretório | Função | Stack principal |
|-----------|--------|-----------------|
| [`/web`](./web/) | SPA cliente — UI, roteamento, estado, animações | React 19, Vite, Tailwind, Zustand, TanStack Query |
| [`/server`](./server/) | API REST — auth, lógica de negócio, banco de dados | NestJS 11, Prisma, PostgreSQL, JWT |

---

### Estrutura do Repositório

```
pinico-fit/
├── web/                        # Frontend (React + Vite)
│   └── src/
│       ├── pages/              # Telas por rota (Dashboard, Goals, Meals…)
│       ├── components/         # UI reutilizável (AnimatedFlame, modais, inputs)
│       ├── routes/             # Rotas protegidas e públicas
│       ├── layouts/            # Shell de navegação
│       ├── store/              # Zustand (auth, configurações, estado de treino)
│       ├── services/           # Axios com injeção de JWT + logout automático no 401
│       ├── hooks/              # useIsMobile, useScrollLock, useNavigationLock
│       ├── schemas/            # Schemas Zod para validação
│       └── types/              # Contratos TypeScript (API + modelos de UI)
│
├── server/                     # Backend (NestJS + Prisma)
│   └── src/
│       ├── auth/               # Login e guard JWT
│       ├── users/              # Perfil, preferências, metas e tolerâncias
│       ├── meals/ foods/ recipes/  # Domínio de alimentação
│       ├── water/              # Logs de água e histórico
│       ├── sleep/              # Sono e cochilos
│       ├── workouts/           # Settings, presets, treino e logs
│       ├── tasks/              # Tarefas diárias e por data
│       ├── streak/             # Avaliação do contrato do dia
│       ├── goals-aggregator/   # BFF — payload único para o GoalsPage
│       └── health/             # Endpoint de saúde
│
└── README.md                   # ← Você está aqui
```

---

### Funcionalidades Principais

#### 🎯 Painel de Metas & Contrato Diário
O coração da experiência. Cada domínio rastreado (água, alimentação, sono, treino, tarefas) é avaliado contra os limites definidos pelo próprio usuário ao final do dia. O resultado é binário: "contrato cumprido / quebrado", alimentando o sistema de streak. Sliders de tolerância permitem que o usuário defina o nível de exigência — 80% da meta de água conta, ou não. A decisão é dele.

#### ⚡ BFF Aggregator — Uma Requisição, Contexto Completo
O GoalsPage precisa de dados de seis domínios simultaneamente. Em vez de disparar múltiplas requisições paralelas do lado do cliente, o backend expõe um endpoint consolidador:

```
GET /goals/daily-summary?date=YYYY-MM-DD
```

Internamente, ele executa `Promise.all()` sobre todos os serviços relevantes e retorna um único payload normalizado. O frontend consome via uma única chamada TanStack Query, mantendo o GoalsPage rápido mesmo em conexões móveis.

#### 🔐 Arquitetura Auth-First
- Tokens JWT Bearer emitidos no login e verificados em cada rota protegida pelo `AuthGuard`
- Zustand `persist` mantém a sessão no `localStorage` com flag `_hasHydrated` para evitar "piscadas" na UI durante a inicialização
- Interceptors do Axios injetam o token em toda requisição e acionam logout automático no `401`
- Todas leituras e gravações são escopadas por `req.user.sub` para garantir isolamento de dados

---

### Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────┐
│                   Navegador (React SPA)                  │
│                                                          │
│  Zustand (auth / sessão / configurações)                 │
│       │                                                  │
│  TanStack Query ──── Axios (token injetado)              │
│       │                     │                            │
│       │            401 → logout automático               │
└───────┼─────────────────────┼────────────────────────────┘
        │                     │
        ▼                     ▼
┌──────────────────────────────────────────────────────────┐
│                  API NestJS (/server)                    │
│                                                          │
│  AuthGuard (JWT)  →  Controllers  →  Services            │
│                                           │              │
│  goals-aggregator (BFF)                   │              │
│  ├── /water        ─────────┐             │              │
│  ├── /meals        ─────────┤             │              │
│  ├── /sleep        ─────────┤  Promise    │              │
│  ├── /workouts     ─────────┤  .all()     ▼              │
│  ├── /tasks        ─────────┤         Prisma ORM         │
│  └── /streak       ─────────┘             │              │
│                                           ▼              │
│                                    PostgreSQL             │
└──────────────────────────────────────────────────────────┘
```

---

### Como Rodar o Projeto

#### Pré-requisitos

- **Node.js 18+**
- **PostgreSQL** (local ou hospedado)
- npm

#### 1. Clonar o repositório

```bash
git clone https://github.com/romeupeniche/pinicofit.git
cd pinicofit
```

#### 2. Configurar o ambiente do backend

```bash
cd server
```

```bash
# server/.env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
APP_URL="http://localhost:5173"
```

#### 3. Configurar o banco de dados

```bash
npx prisma generate
npx prisma migrate deploy
```

#### 4. Configurar o ambiente do frontend

```bash
cd ../web
```

```bash
# web/.env
VITE_API_URL="http://localhost:3000"
```

#### 5. Instalar dependências

```bash
npm install --prefix server
npm install --prefix web
```

#### 6. Rodar os dois serviços

```bash
# Terminal 1 — backend
cd server && npm run dev
# API disponível em http://localhost:3000
```

```bash
# Terminal 2 — frontend
cd web && npm run dev
# App disponível em http://localhost:5173
```

#### 7. Verificar saúde da API

```bash
curl http://localhost:3000/health
# → { "status": "ok", "timestamp": "..." }
```

---

### Referência de API (Resumo)

| Domínio | Endpoint | Método |
|---------|----------|--------|
| Auth | `/auth/signin` | POST |
| Usuário | `/users/me` | GET |
| Usuário | `/users/:id` | PATCH |
| Refeições | `/meals/log?date=...` | GET / POST |
| Água | `/water/today` · `/water/log` · `/water/history` | GET / POST |
| Sono | `/sleep/today?date=...` · `/sleep/log` | GET / POST |
| Treino | `/workouts/today?date=...` · `/workouts/log` | GET / POST |
| Tarefas | `/tasks/today?date=...` | GET / CRUD |
| Streak | `/streak/me?date=...` | GET |
| **Aggregator** | **`/goals/daily-summary?date=...`** | **GET** |

Inventário completo: consulte `server/src/**/**.controller.ts`.

---

### Testes

```bash
cd server
npm test
```

---

<div align="center">
  <sub>Built with focus and consistency — one streak at a time. 🔥</sub>
</div>