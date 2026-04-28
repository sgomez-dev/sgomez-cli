<p align="center">
  <br />
  <img src="https://img.shields.io/npm/v/sgomez-cli?style=flat-square&color=cb3837" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="node version" />
  <img src="https://img.shields.io/npm/l/sgomez-cli?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/actions/workflow/status/sgomez-dev/sgomez-cli/ci.yml?style=flat-square&label=tests" alt="tests" />
  <br /><br />
</p>

# sgomez-cli

**The ultimate developer toolkit.** One CLI to scaffold projects, add Docker & CI/CD, generate components & API endpoints, set up databases & auth, configure testing — and check your system. **14 frameworks. 11 add-on features. Zero config.**

```
  ███████  ██████   ██████  ███    ███ ███████ ███████
  ██      ██       ██    ██ ████  ████ ██         ███
  ███████ ██   ███ ██    ██ ██ ████ ██ █████     ███
       ██ ██    ██ ██    ██ ██  ██  ██ ██       ███
  ███████  ██████   ██████  ██      ██ ███████ ███████
```

---

## Why sgomez-cli?

Other CLIs do one thing. This one covers your **entire workflow** — from day 0 to production.

```bash
sgomez init                          # scaffold a fullstack project
sgomez add docker                    # containerize it
sgomez add ci                        # add CI/CD pipeline
sgomez add db                        # set up database (Prisma/Drizzle/Mongoose/SQLAlchemy)
sgomez add auth                      # add JWT/session authentication
sgomez add test                      # configure testing (Vitest/Jest/Playwright/pytest)
sgomez add component UserCard        # generate a typed component
sgomez add api users                 # scaffold CRUD endpoint
sgomez doctor                        # check system health
```

Or skip the prompts entirely:

```bash
sgomez create my-app --next --ts --tailwind --docker --ci --git
```

---

## Install

```bash
npm install -g sgomez-cli
```

Or from source:

```bash
git clone https://github.com/sgomez-dev/sgomez-cli.git
cd sgomez-cli && npm install && npm link
```

---

## Commands

### `sgomez init` — Interactive Project Scaffolding

Choose frontend, backend, or both. Fullstack creates a monorepo.

**Frontend (8 frameworks):**

| Framework | Language | Add-ons |
|---|---|---|
| React (Vite) | JS / TS | TailwindCSS, Framer Motion |
| Next.js | JS / TS | TailwindCSS, Framer Motion |
| Vue 3 (Vite) | JS / TS | TailwindCSS, Pinia, Vue Router |
| Nuxt 3 | TS | TailwindCSS, Pinia |
| SvelteKit | JS / TS | TailwindCSS |
| Astro | JS / TS | TailwindCSS, React/Vue/Svelte integrations |
| Remix | JS / TS | TailwindCSS |
| Angular | TS | TailwindCSS |

**Backend (6 frameworks):**

| Framework | Language | Includes |
|---|---|---|
| Node.js + Express | JS | Express server, ready to go |
| NestJS | TS | Full NestJS with CLI |
| Hono (Bun) | TS | Hono + Bun, hot reload, CORS, logger |
| FastAPI | Python | FastAPI + Uvicorn, CORS, auto-docs |
| Django | Python | Django + virtual env |
| Go | Go | net/http server + unit tests |

Fullstack monorepo:
```
my-app/
├── frontend/    # your chosen frontend
├── backend/     # your chosen backend
└── README.md
```

After creation: **auto git init** + option to **open in VS Code, Cursor, WebStorm, or Zed**.

---

### `sgomez create <name>` — Quick Mode (No Prompts)

For power users who know what they want:

```bash
# React + TypeScript + Tailwind
sgomez create my-app --react --ts --tailwind

# Fullstack: Next.js + Hono, with Docker and CI
sgomez create my-saas --next --hono --ts --tailwind --docker --ci --git

# Python backend
sgomez create my-api --fastapi

# Go microservice with Docker
sgomez create order-service --go --docker --ci
```

**All flags:** `--react` `--next` `--vue` `--nuxt` `--svelte` `--astro` `--remix` `--angular` `--express` `--nest` `--hono` `--fastapi` `--django` `--go` `--ts` `--tailwind` `--docker` `--ci` `--git`

---

### `sgomez add [feature]` — Add to Existing Projects

Run in any project directory. 11 features available:

| Feature | What it does |
|---|---|
| **docker** | Multi-stage Dockerfile + docker-compose (Node, Python, Go, Bun, Nginx) + PostgreSQL & Redis |
| **ci** | GitHub Actions or GitLab CI — matrix testing, linting, type-check, Docker builds |
| **lint** | ESLint + Prettier + EditorConfig (auto-detects TypeScript) |
| **component** | React TSX/JSX, Vue 3, or Svelte component with types and scoped styles |
| **api** | Full CRUD endpoint (list/get/create/update/delete) for Express, Hono, FastAPI, or Go |
| **auth** | JWT middleware (Express, Hono, FastAPI) or session auth (Express) |
| **db** | Prisma, Drizzle, Mongoose, or SQLAlchemy — schema, connection, models |
| **test** | Vitest, Jest, Playwright, or pytest — config + example tests |
| **env** | `.env` + `.env.example` + optional Zod validation |
| **gitignore** | Multi-stack smart `.gitignore` (Node, Python, Go, Rust, IDEs, OS files) |
| **readme** | Auto-generate README.md based on detected project type |

```bash
sgomez add                # interactive menu
sgomez add docker         # straight to Docker
sgomez add component Nav  # generate Nav component
sgomez add api products   # generate products CRUD
```

---

### `sgomez doctor` — System Health Check

```bash
sgomez doctor
```

```
  ✓ Node.js            v22.4.0
  ✓ npm                10.8.1
  ✓ pnpm               9.1.0
  ○ Bun                not installed
  ○ Deno               not installed
  ✓ Git                git version 2.45.2
  ✓ Python 3           Python 3.13.0
  ✓ Go                 go version go1.23.0
  ○ Rust (cargo)       not installed
  ✓ Docker             Docker version 27.0.3
  ✓ Docker Compose     Docker Compose version v5.1.2

  Summary: 8 installed · 3 missing

  ╭──────────────╮
  │  All Good!   │
  ╰──────────────╯
```

---

## Daily Workflow Examples

**Morning — start a new microservice:**
```bash
sgomez create order-service --hono --ts --docker --ci --git
cd order-service && bun run dev
```

**Need a database? Add Drizzle:**
```bash
sgomez add db        # → Drizzle (PostgreSQL)
sgomez add env       # → .env with DATABASE_URL
```

**Need auth?**
```bash
sgomez add auth      # → JWT (Hono)
```

**Scaffold a new endpoint while coding:**
```bash
sgomez add api orders
# → src/routes/orders.ts with full CRUD
```

**Quick component:**
```bash
sgomez add component OrderCard    # → React TSX with props interface
```

**Before deploying:**
```bash
sgomez add docker
sgomez add ci
git push
```

---

## Project Structure

```
sgomez-cli/
├── bin/index.js              # CLI entry (Commander.js)
├── src/
│   ├── commands/
│   │   ├── init.js           # Interactive scaffolding
│   │   ├── create.js         # Quick non-interactive mode
│   │   ├── add.js            # Add features to existing projects
│   │   └── doctor.js         # System health check
│   ├── generators/           # 14 framework generators
│   ├── templates/            # 11 add-on templates
│   ├── prompts/              # Interactive prompts
│   └── utils/                # Logger, exec, detect, post-create
├── tests/                    # Vitest unit tests
├── .github/workflows/        # CI + npm publish
├── CHANGELOG.md
└── package.json
```

---

## Prerequisites

- **Required:** [Node.js](https://nodejs.org/) >= 18
- **Optional:** Python >= 3.8, Go >= 1.20, Bun >= 1.0, Docker

Run `sgomez doctor` to check.

---

## Roadmap

- [ ] `sgomez deploy` — one-command deploy to Vercel, Railway, Fly.io
- [ ] Plugin system for community generators
- [ ] `sgomez update` — safe dependency updates
- [ ] Monorepo tooling (Turborepo, Nx)
- [ ] Supabase & Firebase integrations
- [ ] T3 Stack preset

---

## Contributing

```bash
git clone https://github.com/sgomez-dev/sgomez-cli.git
cd sgomez-cli
npm install
npm test        # 73 tests
npm link        # use locally
sgomez doctor   # verify setup
```

---

## License

[MIT](LICENSE)

---

<p align="center">
  Built by <a href="https://github.com/sgomez-dev">sgomez-dev</a>
</p>
