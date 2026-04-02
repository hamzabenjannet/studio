# Auto-Assistant Frontend (Next.js)

This directory contains the Auto-Assistant web application: a Next.js (App Router) frontend that authenticates against the Auto-Assistant API and provides screens to manage Users, Vehicles, Stock, Work Orders, and Billing.

The UI is designed for a professional garage/workshop workflow and emphasizes fast CRUD operations, filtering/pagination, and a consistent component system.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Data Layer](#data-layer)
8. [Testing](#testing)
9. [Code Quality & Standards](#code-quality--standards)
10. [Deployment](#deployment)
11. [Logging (Roadmap)](#logging-roadmap)
12. [Dynamic Configuration (Roadmap)](#dynamic-configuration-roadmap)
13. [Security](#security)
14. [Observability](#observability)
15. [Contribution Guidelines](#contribution-guidelines)
16. [FAQ / Troubleshooting](#faq--troubleshooting)

## Project Overview

### Purpose

Auto-Assistant Frontend is the browser UI for the Auto-Assistant platform. It provides:

- Authentication (login/signup) and session persistence via JWT stored in the browser
- Management screens for:
  - Users
  - Vehicles
  - Stock items
  - Work orders
  - Billing
- Filtering and pagination patterns aligned with the backend API contracts
- Internationalization (FR/EN) with client-side locale persistence

### Design decisions (high level)

- Next.js App Router for routing/layout composition and modern React features.
- “Service” modules under `src/services/*` to centralize API calls and keep UI components focused on rendering and state.
- Authentication state is handled in a client-side context provider (`AuthContext`) with an HOC (`withAuth`) for page protection.
- UI system is a blend of:
  - Shadcn/Radix primitives for accessible UI building blocks
  - Material UI components (notably DataGrid) where it provides productivity and capability

## Architecture

### Architectural style

This frontend follows a modular UI architecture:

- Pages (routes) live under `src/app/*`
- Reusable UI primitives and layout components live under `src/components/*`
- Domain “entities” definitions and forms live close to their route folders (e.g. `src/app/workOrders/*`)
- Data access is centralized under `src/services/*`

### Folder structure

```text
frontend/
├─ docs/
│  ├─ README.md                 # This document
│  └─ blueprint.md              # Product/UI vision and style guidelines
├─ src/
│  ├─ app/                      # Next.js App Router routes
│  │  ├─ login/                 # Login page
│  │  ├─ signup/                # Signup page
│  │  ├─ users/ vehicles/ ...   # Domain pages + forms + entity definitions
│  │  ├─ dialogs/               # Shared dialogs (edit/delete)
│  │  ├─ layout.tsx             # Root layout (providers, fonts, toaster)
│  │  └─ consts.ts              # Frontend runtime constants (API URL)
│  ├─ components/
│  │  ├─ ui/                    # Shadcn/Radix-based UI primitives
│  │  ├─ providers/             # App-level providers (i18n)
│  │  ├─ header.tsx             # App header
│  │  └─ main-sidebar.tsx       # Navigation sidebar
│  ├─ context/
│  │  └─ AuthContext.tsx        # Auth/session management
│  ├─ hoc/
│  │  └─ withAuth.tsx           # Page protection helper
│  ├─ services/
│  │  ├─ auth/                  # Auth API calls
│  │  ├─ users/ vehicles/ ...   # Domain API calls
│  │  ├─ common.ts              # Shared fetch + filter/pagination helpers
│  │  └─ README.md              # Notes for services (if present)
│  ├─ messages/                 # i18n message dictionaries
│  └─ ai/                       # Genkit integration (optional)
├─ next.config.ts               # Next.js configuration (basePath, images)
├─ tailwind.config.ts           # Tailwind configuration
└─ package.json                 # Scripts, dependencies
```

### Key modules and flows

#### Authentication flow

- Login page calls [`signin`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/services/auth/auth.service.ts) which POSTs to the backend `/login`.
- Tokens are stored in `localStorage`:
  - `access_token`
  - `refresh_token`
  - `expires_in`
- `AuthProvider` then calls backend `/userDetails` to retrieve the user profile and treats it as the authenticated session.
- Protected pages are wrapped by [`withAuth`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/hoc/withAuth.tsx) which triggers `refreshSession()` if needed.

#### Data fetching pattern

The shared helper [`buildFetchElements`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/services/common.ts#L19-L67) builds a standard “fetch list” function using the backend filter/pagination contract (attributes + pagination + wildcard).

## Tech Stack

### Core

- Next.js 15 (React 19), App Router
- TypeScript

### UI

- Tailwind CSS
- Shadcn UI / Radix UI primitives (accessibility-focused components)
- Material UI (MUI) + MUI X DataGrid (tables/grids and advanced UI widgets)

### Forms & Validation

- React Hook Form
- Zod + `@hookform/resolvers`

Note:

- The prompt mentions “Pydantic”; Pydantic is Python-specific and not used here. In this frontend, Zod is the primary schema/validation tool.

### i18n

- `next-intl` with in-app locale switch stored in `localStorage` (`app-locale`)

### AI (optional)

- Genkit + Google GenAI plugin (Gemini model configured in `src/ai/genkit.ts`)

### Other notable dependencies

- Firebase SDK is installed (`firebase`) but is not currently referenced from `src/` (it may be intended for future hosting/auth/analytics features).

## Installation & Setup

### Prerequisites

- Node.js 22+
- npm 9+
- A running backend API (NestJS) reachable from the browser (local or remote)

### Environment variables

This project currently does not ship a `.env.example` file in `frontend/`, but it uses the following environment variables:

```bash
# Public API base URL used by the browser
# Example: http://localhost:3000
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Optional: serve under a sub-path (useful behind reverse proxies)
# Example: /env00/client
NEXT_BASE_PATH=""
NEXT_PUBLIC_BASE_PATH=""

# Optional (only if you enable Genkit / Gemini)
# Common name used by the Genkit Google plugin:
GOOGLE_GENAI_API_KEY=""
```

Notes:

- `NEXT_PUBLIC_API_URL` is used by [`API_URL`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/app/consts.ts#L1-L2) and is bundled into the client, so it must be prefixed with `NEXT_PUBLIC_`.
- `NEXT_BASE_PATH` / `NEXT_PUBLIC_BASE_PATH` are read at build time in [`next.config.ts`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/next.config.ts#L3-L32) to configure `basePath` and `assetPrefix`.

Recommended local file name:

- `.env.local` (Next.js convention for local development)

### Local setup

```bash
cd frontend
npm install
```

Run the dev server (default port is 9002):

```bash
npm run dev
```

Then open:

- `http://localhost:9002`

### Running in “dev mode” for containers

The script binds to `0.0.0.0` (useful in Docker/VMs):

```bash
npm run start:dev
```

### Production build

```bash
npm run build
npm run start
```

### Docker setup (example)

There is no dedicated `Dockerfile` under `frontend/` at the moment. A typical production container build looks like:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
RUN npm run build

EXPOSE 9002
CMD ["npm", "run", "start"]
```

Build/run:

```bash
docker build -t auto-assistant-frontend:local .
docker run --rm -p 9002:9002 \
  -e NEXT_PUBLIC_API_URL="http://host.docker.internal:3000" \
  auto-assistant-frontend:local
```

## Configuration

### Configuration sources

- Build/runtime environment variables via `process.env.*`
- Next.js configuration via `next.config.ts`
- Client-side persisted settings:
  - Locale stored in `localStorage` (`app-locale`)
  - Auth tokens stored in `localStorage` (`access_token`, `refresh_token`, `expires_in`)

### Environments (dev/staging/prod)

Recommended approach:

- Dev: point `NEXT_PUBLIC_API_URL` to your local API
- Staging: point `NEXT_PUBLIC_API_URL` to the staging API host; configure `NEXT_BASE_PATH` if hosted under a sub-path
- Production: use a stable API base URL (HTTPS), lock down CORS on the API, and ensure the frontend is served with correct asset base path settings

## API Documentation

This frontend consumes the Auto-Assistant backend API. The API itself exposes Swagger.

- Swagger UI (backend): `http://localhost:3000/api` (if the API runs on 3000)

### Main backend endpoints used by the UI

Authentication:

- `POST /login`
- `POST /signUp`
- `GET /userDetails`
- `POST /userDetails`

Domain:

- Users: `POST /filterUsers`
- Vehicles: `POST /createVehicle`, `POST /updateVehicle`, `POST /filterVehicles`, `POST /deleteVehicle`
- Stock: `POST /createStock`, `POST /updateStock`, `POST /filterStocks`, `POST /deleteStock`
- Work orders: `POST /createWorkOrder`, `POST /updateWorkOrder`, `POST /filterWorkOrders`, `POST /deleteWorkOrder`
- Billing: `POST /createBilling`, `POST /updateBilling`, `POST /filterBilling`, `POST /deleteBilling`

### Authentication usage

The frontend sends:

```
Authorization: Bearer <access_token>
```

Implementation detail:

- Token handling and session refresh are implemented in [`AuthContext`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/context/AuthContext.tsx).

### Request/response examples

#### Login

Request:

```bash
curl -sS -X POST "http://localhost:3000/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demopass"}'
```

Typical response (shape used by `AuthContext`):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600,
  "message": "ok"
}
```

#### Get current user

Request:

```bash
curl -sS "http://localhost:3000/userDetails" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Response is expected to include at least a stable identifier and email:

```json
{
  "_id": 1,
  "email": "demo@example.com",
  "firstName": "Demo",
  "lastName": "User",
  "role": "admin"
}
```

#### Filter (list) endpoints

The UI uses a common filter contract (`DatasetFilterDto`) constructed in [`common.ts`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/services/common.ts#L5-L18):

```json
{
  "attributes": {
    "status": "ACTIVE"
  },
  "pagination": {
    "perPage": "10",
    "page": "1",
    "sortField": "_id",
    "sortOrder": "desc"
  },
  "wildcard": "true"
}
```

Example request:

```bash
curl -sS -X POST "http://localhost:3000/filterWorkOrders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"attributes":{},"pagination":{"perPage":"10","page":"1","sortField":"_id","sortOrder":"desc"},"wildcard":"true"}'
```

Typical response:

```json
{
  "workOrders": [],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

## Data Layer

This is a frontend application; it does not contain database schemas or migrations.

Instead, the “data layer” is:

- HTTP calls to the backend API through `src/services/*`
- Shared helpers:
  - Filter/pagination DTOs in [`common.ts`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/src/services/common.ts)
  - Fetch wrapper that injects Bearer token from `localStorage`

If you need database schema/migrations details, refer to the backend documentation:

- Backend API docs: `backend/api/docs/README.md`

## Testing

### What exists today

`package.json` defines Jest scripts, but there is currently no `test/` directory nor `test/jest-e2e.json`, and no explicit Jest configuration files committed in `frontend/`. If tests are added, align with Next.js testing best practices:

- Unit tests for utilities, services, and isolated components
- Integration tests for pages (rendering with mocked services)
- E2E tests (Playwright/Cypress) for authentication and core CRUD flows

### Running checks

```bash
npm run lint
npm run typecheck
npm run build
```

### Coverage expectations (recommended)

- Critical UI logic and data transformation: 80%+
- API service modules: 90%+
- Forms and validation: 80%+

## Code Quality & Standards

### Linting

```bash
npm run lint
```

Known issue:

- `npm run lint` currently fails with `Converting circular structure to JSON` coming from `next lint` + the current ESLint 9 setup.
- `npx eslint .` also fails because ESLint 9 expects a flat config file (`eslint.config.js`) and does not read `.eslintrc.json` by default.

Recommended remediation options (pick one and apply consistently in CI):

1. Migrate to ESLint flat config (`eslint.config.*`) and use the ESLint CLI.
2. Downgrade to ESLint 8.x and keep `.eslintrc.json` + `next lint`.

### Type checking

```bash
npm run typecheck
```

### Formatting

This project uses Prettier via Next’s defaults and component generator conventions.

Recommended conventions:

- Prefer explicit types for service responses (avoid `any` in UI state)
- Keep domain logic in services and helpers, not in components
- Use Zod schemas for any non-trivial form or payload validation

### Commit conventions (recommended)

Use Conventional Commits:

- `feat(frontend): ...`
- `fix(frontend): ...`
- `refactor(frontend): ...`
- `chore(frontend): ...`

## Deployment

### Standard Next.js deployment

1. Build:

```bash
npm ci
npm run build
```

2. Run:

```bash
npm run start
```

Ensure `NEXT_PUBLIC_API_URL` points to your deployed API.

### Base path deployments (reverse proxy / sub-path)

If you host the UI at a sub-path (e.g. `https://example.com/autoassistant`), set at build time:

```bash
NEXT_BASE_PATH=/autoassistant npm run build
```

This configures both `basePath` and `assetPrefix` in Next config so `/autoassistant/_next/*` assets resolve correctly.

### Firebase App Hosting

This repo includes [`apphosting.yaml`](file:///Users/hamzabenjannet/Projects/sassisoft/auto-assistant/frontend/apphosting.yaml). If deploying via Firebase App Hosting, ensure:

- Your build command and runtime environment variables are configured in the Firebase hosting backend
- `NEXT_PUBLIC_API_URL` is set to the production API

## Logging (Roadmap)

Target production-grade logging plan:

- Introduce structured logging for client-side events (JSON logs with consistent fields).
- Define log levels:
  - `debug`: dev-only diagnostics
  - `info`: user flow milestones (login success, navigation)
  - `warn`: recoverable issues (temporary API failures)
  - `error`: failures requiring attention (auth failures, API contract mismatch)
- Correlation IDs:
  - Always generate/propagate `x-correlation-id` from the browser to the API.
  - Include correlation ID in all logs and error reports.
- Centralized logging:
  - Forward logs to a service (e.g., ELK/OpenSearch, Datadog, Grafana Loki) via a browser-safe pipeline.
- Request/response tracing:
  - Measure API request durations, retry behavior, and failure rates.
- Performance monitoring:
  - Track Web Vitals (LCP/CLS/INP) and client errors (Sentry or equivalent).

## Dynamic Configuration (Roadmap)

Evolve toward runtime configuration that does not require rebuilds:

- Store configuration in the backend database (e.g., branding, feature flags, limits).
- Provide an admin interface to manage config.
- Implement “hot reload”:
  - Fetch configuration on app boot and periodically refresh.
  - Cache config in memory and in `localStorage` with TTL.
- Feature flags:
  - Server-driven flags (per environment, per user role).
  - Gradual rollout support (percentage-based).

## Security

### Input validation

- Client-side:
  - Use Zod schemas (recommended) + React Hook Form resolver for user inputs.
- Server-side:
  - Validation must be enforced by the backend (NestJS uses `class-validator`).

Note:

- Pydantic is not applicable to this TypeScript codebase; it is a Python library. Zod is the closest equivalent in this project.

### Authentication

- Current implementation uses JWT stored in `localStorage`.
- Recommended hardening:
  - Move tokens to HttpOnly cookies (prevents token theft via XSS).
  - Implement refresh token rotation server-side.

### Authorization

- The UI currently gates access via “logged-in vs not logged-in”.
- For production:
  - Enforce role/permission checks on the backend.
  - Add UI-level guards to hide/disable restricted actions.

### Rate limiting

Client-side:

- Implement exponential backoff for transient failures (429/503).

Server-side (recommended):

- Rate limit `/login` and other sensitive endpoints.

### CORS

- CORS is controlled by the backend.
- In production, restrict allowed origins to the deployed UI origin(s).

### Secrets management

- Never store secrets in `NEXT_PUBLIC_*`.
- Use deployment platform secret storage for:
  - Genkit API keys
  - Any service credentials

### Common web attacks

- XSS:
  - Avoid `dangerouslySetInnerHTML`.
  - Sanitize any HTML content rendered from user input.
  - Prefer HttpOnly cookies over `localStorage` for auth.
- CSRF:
  - If you adopt cookie auth, implement CSRF protection (double-submit tokens or same-site cookies).
- Dependency scanning:
  - Run `npm audit` regularly and/or integrate Dependabot/Snyk.
- HTTPS enforcement:
  - Always serve the UI over HTTPS in production.

## Observability

Recommended additions:

- Health page / diagnostics screen (internal-only) showing:
  - API reachability
  - App version + build hash
- Metrics:
  - Web Vitals
  - API latency and error rate
- Tracing:
  - Correlation ID propagation to backend logs
- Error reporting:
  - Centralized error reporting tool (Sentry/Rollbar)

## Contribution Guidelines

### Branching

- `main`: protected, always deployable
- Feature branches: `feat/<short-name>` or `fix/<short-name>`

### PR requirements (recommended)

- Small, focused PRs
- Include screenshots for UI changes
- Ensure:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

### Code review checklist

- No secrets committed
- API calls are centralized in `src/services/*`
- Components remain mostly presentational
- Validation is enforced (Zod on client + backend validation)

## FAQ / Troubleshooting

### The app runs but cannot login

- Verify `NEXT_PUBLIC_API_URL` points to the backend API.
- Confirm the API is reachable from the browser (check Network tab).
- Ensure the backend `/login` endpoint returns `access_token`.

### I get 401 on every API call

- Confirm `access_token` is stored in `localStorage`.
- Confirm requests include `Authorization: Bearer <token>`.
- Verify backend JWT secret/config matches the environment.

### Assets 404 when deployed behind a sub-path

- Build with `NEXT_BASE_PATH=/your-subpath`.
- Ensure your reverse proxy forwards `/<subpath>/_next/*` correctly.

### `npm run lint` fails with a circular JSON error

- This is a tooling/config mismatch between `next lint` and the installed ESLint 9 version.
- Use the remediation options in [Code Quality & Standards](#code-quality--standards) to restore a working lint step.

### Type errors are not blocking builds

`next.config.ts` currently sets:

- `typescript.ignoreBuildErrors = true`
- `eslint.ignoreDuringBuilds = true`

Run strict checks in CI and locally:

```bash
npm run lint
npm run typecheck
```
