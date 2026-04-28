#!/usr/bin/env node
import { Command } from "commander";
import { runInit } from "../src/commands/init.js";
import { runAdd } from "../src/commands/add.js";
import { runDoctor } from "../src/commands/doctor.js";
import { runCreate } from "../src/commands/create.js";
import { VERSION } from "../src/utils/version.js";
import logger from "../src/utils/logger.js";

const program = new Command();

program
  .name("sgomez")
  .description("The Ultimate Developer Toolkit")
  .version(VERSION)
  .action(() => {
    logger.banner();
    program.outputHelp();
  });

program
  .command("init")
  .description("Interactive project scaffolding (14 frameworks)")
  .action(runInit);

program
  .command("create")
  .description("Quick project creation with flags (non-interactive)")
  .argument("<name>", "Project name")
  .option("--react", "React (Vite)")
  .option("--next", "Next.js")
  .option("--vue", "Vue 3 (Vite)")
  .option("--nuxt", "Nuxt 3")
  .option("--svelte", "SvelteKit")
  .option("--astro", "Astro")
  .option("--remix", "Remix")
  .option("--angular", "Angular")
  .option("--express", "Node.js + Express")
  .option("--nest", "NestJS")
  .option("--hono", "Hono (Bun)")
  .option("--fastapi", "FastAPI (Python)")
  .option("--django", "Django")
  .option("--go", "Go")
  .option("--ts", "Use TypeScript")
  .option("--tailwind", "Add TailwindCSS")
  .option("--docker", "Add Dockerfile")
  .option("--ci", "Add GitHub Actions CI")
  .option("--git", "Initialize git repo")
  .action(runCreate);

program
  .command("add")
  .description("Add features to an existing project")
  .argument(
    "[feature]",
    "Feature: docker | ci | lint | component | api | gitignore | auth | db | test | env | readme"
  )
  .argument("[name]", "Name (for component/api)")
  .action(runAdd);

program
  .command("doctor")
  .description("Check your system for installed dev tools")
  .action(runDoctor);

program.parse();
