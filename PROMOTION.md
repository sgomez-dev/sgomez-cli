# sgomez-cli — Promotion Campaign

A multi-platform launch strategy for Reddit, LinkedIn, and Product Hunt.

---

## 1. Product Hunt

### Tagline (60 chars max)
`The only CLI you need — scaffold, add Docker, CI, auth & more`

### Description (260 chars)
One CLI to rule your dev workflow. 14 frameworks (React, Next, Vue, Svelte, Astro, Remix, Go, FastAPI...), Docker & CI generation, database setup, auth middleware, component scaffolding — all from your terminal. Open source. Zero config.

### First Comment (maker comment)

> Hey Product Hunt!
>
> I built **sgomez-cli** because I was tired of:
>
> - Running 5 different `npx create-*` commands every week
> - Copy-pasting the same Dockerfile, GitHub Actions, and ESLint config into every project
> - Googling "Prisma setup" for the 100th time
>
> So I made one CLI that handles everything — from day 0 to production.
>
> **What it does:**
>
> - `sgomez init` — interactive scaffolding with 14 frameworks (React, Next.js, Vue 3, Nuxt 3, SvelteKit, Astro, Remix, Angular, Express, NestJS, Hono, FastAPI, Django, Go)
> - `sgomez create my-app --next --ts --tailwind --docker --ci --git` — one-liner for power users
> - `sgomez add docker` — generates multi-stage Dockerfile + docker-compose with PostgreSQL & Redis
> - `sgomez add auth` — JWT or session middleware for Express, Hono, or FastAPI
> - `sgomez add db` — Prisma, Drizzle, Mongoose, or SQLAlchemy in seconds
> - `sgomez add test` — Vitest, Jest, Playwright, or pytest configs
> - `sgomez add component UserCard` — typed React/Vue/Svelte component
> - `sgomez add api users` — full CRUD endpoint
> - `sgomez doctor` — checks what dev tools you have installed
>
> It's **fully open source (MIT)**, built with Node.js, and has 73 unit tests passing.
>
> I'm a solo developer and built this to save myself time. If it saves you 10 minutes a week, it was worth it.
>
> Would love your feedback — what frameworks or features should I add next?

### Topics
`Developer Tools` `Productivity` `Open Source` `CLI` `Web Development`

### Media suggestions
- Terminal recording showing `sgomez init` creating a fullstack project (use [asciinema](https://asciinema.org/) or [vhs](https://github.com/charmbracelet/vhs))
- Screenshot of `sgomez doctor` output with the gradient banner
- Screenshot of `sgomez add` interactive menu

---

## 2. Reddit

### Target subreddits

| Subreddit | Members | Strategy |
|---|---|---|
| r/webdev | 2.5M+ | Main launch post |
| r/javascript | 2.1M+ | JS-focused angle |
| r/reactjs | 400K+ | React-specific angle |
| r/node | 250K+ | Backend tooling angle |
| r/Python | 1.5M+ | FastAPI/Django angle |
| r/golang | 250K+ | Go angle |
| r/commandline | 300K+ | CLI tool showcase |
| r/opensource | 100K+ | Open source project |
| r/sideproject | 80K+ | Indie dev story |

---

### Post for r/webdev (main post)

**Title:**
`I built a CLI that replaces 10 tools I used daily — scaffolding, Docker, CI/CD, auth, databases, all in one`

**Body:**

I got tired of the same setup routine every time I started a project:

1. Google "create next app with tailwind typescript"
2. Copy a Dockerfile from my last project
3. Copy a GitHub Actions workflow from another project
4. Set up Prisma for the 50th time
5. Write the same JWT middleware again

So I built **sgomez-cli** — one tool that handles all of that.

**What it does:**

```bash
# Scaffold a fullstack project (14 frameworks)
sgomez init

# Or skip the prompts
sgomez create my-app --next --hono --ts --tailwind --docker --ci --git

# Add stuff to any existing project
sgomez add docker        # Dockerfile + docker-compose
sgomez add ci            # GitHub Actions
sgomez add db            # Prisma / Drizzle / Mongoose / SQLAlchemy
sgomez add auth          # JWT / session middleware
sgomez add test          # Vitest / Jest / Playwright / pytest
sgomez add component Nav # typed React/Vue/Svelte component
sgomez add api users     # full CRUD endpoint
sgomez add lint          # ESLint + Prettier
sgomez add env           # .env + validation

# Check what tools you have
sgomez doctor
```

**Supported frameworks:** React (Vite), Next.js, Vue 3, Nuxt 3, SvelteKit, Astro, Remix, Angular, Express, NestJS, Hono (Bun), FastAPI, Django, Go.

**What makes it different from create-react-app / create-next-app:**
- It's not just scaffolding — it's a daily-use toolkit
- One CLI for all frameworks, not one per ecosystem
- `sgomez add` works on *existing* projects, not just new ones
- Generates production configs (multi-stage Docker, matrix CI, typed auth middleware)
- Fullstack monorepo support out of the box

It's open source (MIT), has 73 tests passing, and works on macOS, Linux, and Windows.

GitHub: [github.com/sgomez-dev/sgomez-cli](https://github.com/sgomez-dev/sgomez-cli)

Install: `npm install -g sgomez-cli`

Would love feedback. What would you add?

---

### Post for r/javascript / r/node

**Title:**
`sgomez-cli — one CLI to scaffold 14 frameworks, generate Docker/CI/auth/DB configs, and more (open source)`

**Body:**

Quick show-and-tell. I built a CLI that I use every day:

```bash
# Start a new project (interactive)
sgomez init

# Or one-liner
sgomez create my-saas --next --hono --ts --tailwind --docker --ci --git

# Add things to existing projects
sgomez add docker       # multi-stage Dockerfile + compose
sgomez add db           # Prisma, Drizzle, or Mongoose setup
sgomez add auth         # JWT middleware
sgomez add api users    # full CRUD route
sgomez add test         # Vitest config + example tests
```

14 frameworks supported: React, Next.js, Vue 3, Nuxt 3, SvelteKit, Astro, Remix, Angular, Express, NestJS, Hono (Bun), FastAPI, Django, Go.

Tech stack: Node.js, Commander.js, Inquirer, chalk, gradient-string, boxen. 73 unit tests with Vitest.

GitHub: [github.com/sgomez-dev/sgomez-cli](https://github.com/sgomez-dev/sgomez-cli)

Built this because I was repeating the same setup steps across every project. Open source, MIT licensed.

---

### Post for r/reactjs

**Title:**
`Built a CLI that scaffolds React/Next/Remix projects AND adds Docker, CI, auth, Prisma, components — all interactively`

**Body:**

If you work with React ecosystem projects, you might find this useful.

`sgomez-cli` is a terminal tool that:

- **Scaffolds** React (Vite), Next.js, or Remix projects with TypeScript + Tailwind in one command
- **Generates typed components**: `sgomez add component UserCard` creates a `.tsx` file with a props interface
- **Adds Prisma or Drizzle**: `sgomez add db` sets up schema + client + .env
- **Adds JWT auth**: `sgomez add auth` generates middleware for Express or Hono
- **Adds Docker + CI**: production-ready configs in seconds

```bash
sgomez create my-app --next --ts --tailwind --docker --ci --git
```

One command, fullstack project ready with Docker, GitHub Actions, and git initialized.

Also supports Vue, Svelte, Astro, FastAPI, Django, Go — so if you work across stacks, it's one tool for everything.

[GitHub](https://github.com/sgomez-dev/sgomez-cli) | `npm i -g sgomez-cli`

---

### Post for r/Python

**Title:**
`Built a CLI tool that scaffolds FastAPI/Django projects with virtual env, and adds auth/DB/Docker/CI configs instantly`

**Body:**

I work across JS and Python stacks, so I built a CLI that handles both.

For Python devs specifically:

```bash
# Scaffold a FastAPI project (creates venv, installs deps, CORS configured)
sgomez create my-api --fastapi

# Or Django
sgomez create my-app --django

# Add things to any existing Python project
sgomez add docker       # Python Dockerfile + compose with PostgreSQL
sgomez add auth         # FastAPI JWT middleware with python-jose
sgomez add db           # SQLAlchemy models + connection
sgomez add test         # pytest config + example tests
sgomez add ci           # GitHub Actions for Python
sgomez add env          # .env with DATABASE_URL, JWT_SECRET, etc.
sgomez add api orders   # FastAPI CRUD router with Pydantic models
```

It also supports JS/TS frameworks (React, Next, Vue, Svelte, Express, Hono, etc.) if you do fullstack.

Open source: [github.com/sgomez-dev/sgomez-cli](https://github.com/sgomez-dev/sgomez-cli)

---

### Post for r/sideproject

**Title:**
`I built a dev CLI that I actually use every day — 14 frameworks, Docker, CI, auth, databases, all from one tool`

**Body:**

Hey everyone. I'm a developer and I kept noticing I was doing the same 10-step setup ritual every time I started a project. So I built a CLI to automate all of it.

**sgomez-cli** does:
- Project scaffolding (React, Next.js, Vue, Nuxt, Svelte, Astro, Express, FastAPI, Go... 14 total)
- Docker generation (multi-stage builds, compose with PostgreSQL/Redis)
- CI/CD setup (GitHub Actions, GitLab CI)
- Database setup (Prisma, Drizzle, Mongoose, SQLAlchemy)
- Auth middleware (JWT, sessions)
- Component & API endpoint generation
- System health checks

It has a non-interactive mode for scripting: `sgomez create my-app --next --ts --tailwind --docker --ci --git`

**Stats:**
- 53 files
- 73 unit tests
- 14 framework generators
- 11 add-on features
- MIT licensed

What started as a personal tool turned into something I think other devs could use. Would love feedback.

GitHub: [github.com/sgomez-dev/sgomez-cli](https://github.com/sgomez-dev/sgomez-cli)

---

## 3. LinkedIn

### Post 1 — Launch announcement

I just open-sourced a developer tool I've been building: **sgomez-cli**.

It's a command-line toolkit that replaces the 10+ setup steps I was repeating on every new project:

Instead of this:
- npx create-next-app...
- Copy Dockerfile from last project...
- Copy GitHub Actions from another project...
- Set up Prisma again...
- Write JWT middleware again...

I just run:
```
sgomez create my-app --next --ts --tailwind --docker --ci --git
```

One command. Fullstack project. Production configs. Git initialized.

It supports **14 frameworks** (React, Next.js, Vue 3, Nuxt 3, SvelteKit, Astro, Remix, Angular, Express, NestJS, Hono, FastAPI, Django, Go) and has **11 add-on features** you can use on existing projects — Docker, CI/CD, authentication, databases, testing, components, API endpoints, and more.

The tool auto-detects your project type, generates typed components, creates multi-stage Dockerfiles, and even sets up Zod environment validation.

I'm a developer who values shipping fast without sacrificing quality. This tool embodies that philosophy.

Open source (MIT) with 73 unit tests: https://github.com/sgomez-dev/sgomez-cli

Install: `npm install -g sgomez-cli`

#opensource #webdevelopment #devtools #cli #react #nextjs #python #golang #docker #developer

---

### Post 2 — Problem/solution format (post 3-4 days after launch)

The biggest time sink in software development isn't writing code.

It's **setting up projects**.

Every new project: scaffolding, Docker, CI/CD, linting, database config, auth middleware, environment variables...

I tracked it once — I spent 45 minutes setting up a new microservice before writing a single line of business logic.

So I built a tool to get that down to 30 seconds:

```
sgomez create order-service --hono --ts --docker --ci --git
```

That one command generates:
- A Hono + TypeScript server with hot reload
- Multi-stage Dockerfile + docker-compose
- GitHub Actions CI pipeline
- Initialized git repo with first commit

Then during development:
- `sgomez add db` — database schema in 5 seconds
- `sgomez add auth` — JWT middleware ready
- `sgomez add api orders` — full CRUD endpoint generated

14 frameworks. 11 features. One CLI.

The tool is open source and I use it daily. If you spend more than 5 minutes setting up projects, give it a try.

GitHub: https://github.com/sgomez-dev/sgomez-cli

#productivity #softwaredevelopment #devtools #engineering

---

### Post 3 — Technical deep dive (post 1 week after launch)

How I structured a CLI tool that supports 14 frameworks and 11 add-on features — without becoming a maintenance nightmare.

When I started building sgomez-cli, the biggest risk was complexity. How do you support React, Next.js, Vue, Svelte, Astro, Express, FastAPI, Django, Go — and keep it maintainable?

The answer: **strict separation**.

```
src/
├── commands/      → 4 entry points (init, create, add, doctor)
├── generators/    → 14 framework generators (one file each)
├── templates/     → 11 add-on templates (docker, auth, db, etc.)
├── prompts/       → User interaction logic
└── utils/         → Shared helpers (exec, detect, logger)
```

Each generator is a self-contained function. Each template is a pure function that returns strings. Adding a new framework means adding one file — nothing else changes.

The `detect.js` utility reads package.json, checks for tsconfig, lock files, and framework-specific dependencies. This powers the `sgomez add` command — it knows what stack you're using before asking.

Testing was straightforward because templates are pure functions:
```
getDockerTemplate("Node.js") → { dockerfile, compose, dockerignore }
getAuthTemplate("JWT (Express)") → { content, deps }
getComponentTemplate("React (TSX)", "Button") → { filename, content }
```

73 tests. All run in 150ms. No mocks needed.

Sometimes the best architecture is the boring one.

GitHub: https://github.com/sgomez-dev/sgomez-cli

#softwarearchitecture #cleancode #opensource #nodejs

---

## 4. Posting Schedule

| Day | Platform | Post |
|---|---|---|
| Day 1 (Tuesday) | Product Hunt | Launch |
| Day 1 | Reddit r/webdev | Main post |
| Day 1 | Reddit r/sideproject | Side project post |
| Day 1 | LinkedIn | Post 1 (launch) |
| Day 2 | Reddit r/javascript | JS-focused post |
| Day 2 | Reddit r/node | Node/backend post |
| Day 3 | Reddit r/reactjs | React-specific post |
| Day 3 | Reddit r/Python | Python-specific post |
| Day 4 | LinkedIn | Post 2 (problem/solution) |
| Day 5 | Reddit r/golang | Go-specific post |
| Day 5 | Reddit r/commandline | CLI showcase |
| Day 5 | Reddit r/opensource | OSS post |
| Day 8 | LinkedIn | Post 3 (technical deep dive) |

### Tips

- **Product Hunt**: Launch on Tuesday or Wednesday. Engage with every comment. Have 3-5 people ready to upvote and leave genuine comments in the first hour.
- **Reddit**: Don't cross-post. Write unique content for each subreddit. Engage in comments. Don't be salesy — be a developer sharing a tool.
- **LinkedIn**: Use line breaks aggressively. First line must hook. Include code blocks (they stand out in feeds). Post between 8-10 AM your audience's timezone.
- **All platforms**: Reply to every comment within the first 24 hours. Ask questions back ("What framework do you use? Should I add X?"). Genuine engagement > marketing speak.

---

## 5. Before You Launch

- [ ] Record a terminal demo with [vhs](https://github.com/charmbracelet/vhs) or [asciinema](https://asciinema.org/)
- [ ] `npm publish` the package so `npm install -g sgomez-cli` works
- [ ] Add the demo GIF/video to the GitHub README
- [ ] Star the repo from a few accounts for social proof
- [ ] Prepare to answer "how is this different from X?" (Yeoman, create-t3-app, etc.)
- [ ] Have a Product Hunt ship page ready before launch day

---

*Good luck, Santiago. Ship it.*
