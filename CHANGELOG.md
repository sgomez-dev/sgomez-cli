# Changelog

## [2.0.1] - 2026-04-29

### Fixed

- **Next.js generator** hanging indefinitely — added `--yes` flag to `create-next-app`
- **Astro generator** hanging on interactive prompts — added `--yes` flag to `create-astro`
- **SvelteKit generator** hanging on `sv create` prompts — added `--yes` flag
- **Remix generator** hanging on template selection — added `--yes` flag to `create-remix`
- **Nuxt generator** hanging on template/package manager prompts — added `--template minimal --packageManager npm`
- **NestJS generator** added `--strict` flag for deterministic output

## [2.0.0] - 2026-04-28

### Added

- **7 new framework generators**: Vue 3, Nuxt 3, SvelteKit, Astro, Remix, FastAPI, Hono (Bun)
- **`sgomez create`** — non-interactive quick mode with flags (`--react --ts --tailwind`)
- **`sgomez add`** command with 11 features:
  - `docker` — Dockerfile + docker-compose + .dockerignore (5 stack presets)
  - `ci` — GitHub Actions or GitLab CI workflows
  - `lint` — ESLint + Prettier + EditorConfig
  - `component` — React TSX/JSX, Vue 3, Svelte scaffold
  - `api` — Full CRUD endpoints for Express, Hono, FastAPI, Go
  - `auth` — JWT or session middleware (Express, Hono, FastAPI)
  - `db` — Prisma, Drizzle, Mongoose, SQLAlchemy setup
  - `test` — Vitest, Jest, Playwright, pytest configs
  - `env` — .env + .env.example + Zod validation
  - `gitignore` — multi-stack smart .gitignore
  - `readme` — auto-generate README.md
- **`sgomez doctor`** — system health check (13 dev tools)
- **Commander.js** subcommand architecture
- **Gradient ASCII banner** and boxed output (gradient-string + boxen)
- **Post-creation hooks**: git init + open in editor (VS Code, Cursor, WebStorm, Zed)
- **Project auto-detection** (detect framework, language, package manager)
- **Unit tests** with Vitest (73 test cases across 3 test files)
- **GitHub Actions CI** for the CLI itself
- **npm publish workflow** with provenance

### Changed

- Bumped to v2.0.0
- Complete README rewrite (English, badges, full command reference)
- Updated all prompts (TypeScript default first, input validation)
- License updated to MIT

## [1.1.0] - 2025-08-30

### Added

- React (Vite), Next.js, Angular generators
- Node.js + Express, NestJS, Django, Go generators
- TailwindCSS v4 and Framer Motion support
- Fullstack monorepo structure
- Interactive CLI with inquirer

## [1.0.0] - 2025-08-28

- Initial release
