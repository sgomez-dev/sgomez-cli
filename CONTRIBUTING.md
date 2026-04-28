# Contributing to sgomez-cli

Thanks for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/sgomez-dev/sgomez-cli.git
cd sgomez-cli
npm install
npm link          # makes `sgomez` available globally
sgomez doctor     # verify your setup
```

## Running Tests

```bash
npm test          # run all tests once
npm run test:watch # watch mode
```

## Project Structure

```
src/
├── commands/      # CLI entry points (init, create, add, doctor)
├── generators/    # One file per framework (react.js, vue.js, etc.)
├── templates/     # Pure functions that return file content strings
├── prompts/       # Inquirer prompt logic
└── utils/         # Shared helpers (exec, logger, detect, version)
```

## Adding a New Framework Generator

1. Create `src/generators/your-framework.js` exporting an async function
2. Add it to the prompt choices in `src/prompts/frontend.js` or `backend.js`
3. Import and register it in both `src/commands/init.js` and `src/commands/create.js`
4. Add a `--flag` to the create command in `bin/index.js`
5. Run `npm test` to make sure nothing broke

## Adding a New Template (sgomez add feature)

1. Create `src/templates/your-feature.js` exporting a pure function
2. Import it in `src/commands/add.js`
3. Add the feature to the `FEATURES` map and create a handler function
4. Write tests in `tests/templates.test.js`

## Guidelines

- Keep generators as self-contained functions
- Templates must be **pure functions** (input -> string output, no side effects)
- Use `logger.spinner()` for any operation that takes more than 1 second
- Use `tools?.includes()` (optional chaining) when checking tool arrays
- Run `npm test` before submitting a PR

## Commit Messages

Use conventional commits:

```
feat: add Nuxt 3 generator
fix: angular tailwind path resolution
docs: update README with new frameworks
test: add edge case tests for component templates
```

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm test`
4. Open a PR with a clear description
