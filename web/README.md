<div align="center">

# PinicoFit — Web (Frontend)

Fitness + productivity dashboard built with a **fast Vite + React** stack and a strong focus on **mobile-first UX**, onboarding, and day-to-day goal tracking.

<!-- Badges -->
<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>
<p>
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-state-111111?style=for-the-badge" />
  <img alt="Axios" src="https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge" />
</p>
<p>
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-animations-DB2777?style=for-the-badge" />
  <img alt="Zod" src="https://img.shields.io/badge/Zod-validation-1E293B?style=for-the-badge" />
  <img alt="React Hook Form" src="https://img.shields.io/badge/React_Hook_Form-forms-EC5990?style=for-the-badge" />
  <img alt="date-fns" src="https://img.shields.io/badge/date--fns-dates-0EA5E9?style=for-the-badge" />
</p>

</div>

## Quick Access

[🇺🇸 English](#en-us) • [🇧🇷 Português](#pt-br)

---

## <a id="en-us"></a>🇺🇸 English

### What this frontend does

PinicoFit Web is a **single-page application** that turns daily data (meals, water, sleep, workouts, tasks) into a compact **Goals dashboard** and goal-specific pages where the user logs progress.

Key UX highlights grounded in the codebase:

- **Auth-first navigation** using route guards (`web/src/routes/ProtectedRoute.tsx`) and JWT-based sessions.
- **Local “hydration” gate**: Zustand `persist` stores auth state in `localStorage` and exposes `_hasHydrated` to avoid UI flicker during bootstrap (`web/src/store/authStore.ts`).
- **Fast data access** with TanStack Query and an Axios client that injects the Bearer token and auto-logs out on `401` (`web/src/services/api.ts`).
- **Goals + Streak visual language** including the animated flame with levels (`low | streak | max`) (`web/src/components/AnimatedFlame.tsx`).
- **Theme & presentation controls** in goal-related surfaces (e.g. dark-mode styling for the Goals experience and a theme switcher inside the Workout summary modal).
- **Mobile-first responsiveness** via Tailwind utility classes and helper hooks (e.g. `web/src/hooks/useIsMobile.ts`).

### Architecture overview

High-level layout (real folder names from `web/src/`):

- `pages/`: route-level screens (`Dashboard`, `Goals`, `Meals`, `WaterGoal`, `SleepGoal`, `WorkoutGoal`, `TasksGoal`, `Account`, `Onboarding`, auth pages).
- `routes/`: routing + access control (`ProtectedRoute`, `PublicRoute`, `router` setup).
- `layouts/`: shared layouts (navigation shell, screen scaffolding).
- `components/`: reusable UI building blocks (including animation and loading screens).
- `services/`: infrastructure clients (Axios API client with interceptors).
- `store/`: global state with Zustand (auth/session, user settings, and goal/workout state).
- `hooks/`: small cross-cutting helpers (mobile detection, scroll lock, navigation lock).
- `schemas/`: Zod schemas used for validation and form safety.
- `types/`: app-level TypeScript types (API contracts and view models).
- `utils/` + `constants/`: formatting helpers and shared constants.

### Data flow (how the app stays “snappy”)

- **Bootstrap on protected routes**: after store hydration, the app runs a set of parallel queries (me, workout settings/presets, and daily logs) and hydrates stores accordingly (`web/src/routes/ProtectedRoute.tsx`).
- **GoalsPage consolidation**: the backend exposes a BFF endpoint `GET /goals/daily-summary?date=YYYY-MM-DD` to allow the Goals view to fetch a single payload instead of many (see backend README for details).

### Setup / Installation

#### Prerequisites

- Node.js **18+** recommended
- npm (or your preferred package manager)

#### Install

```bash
cd web
npm install
```

#### Environment

The app uses `VITE_API_URL` (see `web/.env`) to point at the backend:

```bash
# web/.env
VITE_API_URL="http://localhost:3000"
```

#### Run (dev)

```bash
cd web
npm run dev
```

#### Build (prod)

```bash
cd web
npm run build
npm run preview
```

### Notes for recruiters / reviewers

- This codebase emphasizes **pragmatic, type-safe UI**: query caching + persisted session hydration + validated form flows.
- The UX is intentionally “dashboard-like”: goal modules are kept separate, while the Goals screen synthesizes progress into a single, readable contract for the day.

<hr />

## <a id="pt-br"></a>🇧🇷 Português

### O que esse frontend faz

O PinicoFit Web é uma **SPA (Single Page Application)** que transforma dados do dia (alimentação, água, sono, treino e tarefas) em um **painel de metas** e páginas específicas onde o usuário registra o progresso.

Destaques de UX (com base no código atual):

- **Navegação com proteção de rotas** e sessão via JWT (`web/src/routes/ProtectedRoute.tsx`).
- **“Hidratação” do estado local**: o Zustand persiste a sessão no `localStorage` e expõe `_hasHydrated` para evitar “piscadas” na interface durante a inicialização (`web/src/store/authStore.ts`).
- **Busca de dados eficiente** com TanStack Query + Axios com interceptor de token e logout automático em `401` (`web/src/services/api.ts`).
- **Linguagem visual do streak/metas** com a chama animada em três níveis (`low | streak | max`) (`web/src/components/AnimatedFlame.tsx`).
- **Responsividade mobile-first** com Tailwind e hooks utilitários (ex.: `web/src/hooks/useIsMobile.ts`).

### Visão de arquitetura

Estrutura principal (pastas reais em `web/src/`):

- `pages/`: telas por rota (`Dashboard`, `Goals`, `Meals`, `WaterGoal`, `SleepGoal`, `WorkoutGoal`, `TasksGoal`, `Account`, `Onboarding` e autenticação).
- `routes/`: roteamento e controle de acesso (rotas públicas/privadas).
- `layouts/`: estrutura compartilhada (shell de navegação).
- `components/`: componentes reutilizáveis (inclui animações e loading).
- `services/`: clientes/infra (Axios + interceptors).
- `store/`: estado global com Zustand (sessão, preferências do usuário e estado de treino/metas).
- `hooks/`: hooks auxiliares (mobile, scroll lock, navigation lock).
- `schemas/`: schemas Zod para validação e segurança de formulários.
- `types/`: tipos TypeScript (contratos de API e modelos de UI).
- `utils/` + `constants/`: helpers e constantes.

### Fluxo de dados (por que a app é rápida)

- **Bootstrap em rotas protegidas**: após a hidratação do store, a app dispara buscas paralelas (me, settings/presets de treino e logs do dia) e sincroniza o estado (`web/src/routes/ProtectedRoute.tsx`).
- **Consolidação do GoalsPage**: o backend expõe `GET /goals/daily-summary?date=YYYY-MM-DD` para reduzir múltiplas chamadas em uma só resposta.

### Setup / Instalação

#### Pré-requisitos

- Node.js **18+** (recomendado)
- npm

#### Instalar

```bash
cd web
npm install
```

#### Ambiente

Configure `VITE_API_URL` para o backend (ver `web/.env`):

```bash
VITE_API_URL="http://localhost:3000"
```

#### Rodar (dev)

```bash
cd web
npm run dev
```

#### Build (prod)

```bash
cd web
npm run build
npm run preview
```
