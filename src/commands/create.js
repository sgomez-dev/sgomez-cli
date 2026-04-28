import chalk from "chalk";
import logger from "../utils/logger.js";
import { runCommand } from "../utils/exec.js";
import fs from "fs";

import { generateReact } from "../generators/react.js";
import { generateNextJs } from "../generators/nextjs.js";
import { generateVue } from "../generators/vue.js";
import { generateNuxt } from "../generators/nuxt.js";
import { generateSvelteKit } from "../generators/sveltekit.js";
import { generateAstro } from "../generators/astro.js";
import { generateRemix } from "../generators/remix.js";
import { generateAngular } from "../generators/angular.js";
import { generateNode } from "../generators/node.js";
import { generateNestJs } from "../generators/nestjs.js";
import { generateHono } from "../generators/hono.js";
import { generateFastAPI } from "../generators/fastapi.js";
import { generateDjango } from "../generators/django.js";
import { generateGo } from "../generators/go.js";
import { getDockerTemplate } from "../templates/docker.js";
import { getCITemplate } from "../templates/ci.js";
import { postCreate } from "../utils/post-create.js";

const FRONTEND_MAP = {
  react: { name: "React (Vite)", fn: generateReact },
  next: { name: "Next.js", fn: generateNextJs },
  vue: { name: "Vue 3 (Vite)", fn: generateVue },
  nuxt: { name: "Nuxt 3", fn: generateNuxt },
  svelte: { name: "SvelteKit", fn: generateSvelteKit },
  astro: { name: "Astro", fn: generateAstro },
  remix: { name: "Remix", fn: generateRemix },
  angular: { name: "Angular", fn: generateAngular },
};

const BACKEND_MAP = {
  express: { name: "Node.js + Express", fn: generateNode },
  nest: { name: "NestJS", fn: generateNestJs },
  hono: { name: "Hono (Bun)", fn: generateHono },
  fastapi: { name: "FastAPI (Python)", fn: generateFastAPI },
  django: { name: "Django", fn: generateDjango },
  go: { name: "Go", fn: generateGo },
};

export async function runCreate(name, opts) {
  logger.banner();
  logger.info(`Quick creating project: ${chalk.bold.cyan(name)}`);
  console.log();

  const language = opts.ts ? "TypeScript" : "JavaScript";
  const tools = [];
  if (opts.tailwind) tools.push("TailwindCSS");

  // Detect frontend
  let frontend = null;
  for (const [key, val] of Object.entries(FRONTEND_MAP)) {
    if (opts[key]) {
      frontend = val;
      break;
    }
  }

  // Detect backend
  let backend = null;
  for (const [key, val] of Object.entries(BACKEND_MAP)) {
    if (opts[key]) {
      backend = val;
      break;
    }
  }

  if (!frontend && !backend) {
    logger.error("Specify at least one framework flag. Examples:");
    logger.dim("sgomez create my-app --react --ts --tailwind");
    logger.dim("sgomez create my-api --express");
    logger.dim("sgomez create my-app --next --hono --ts --tailwind --docker --ci");
    console.log();
    logger.info("Run sgomez create --help for all options.");
    process.exit(1);
  }

  const isFullstack = frontend && backend;

  try {
    if (isFullstack) {
      logger.info(
        `Fullstack: ${chalk.green(frontend.name)} + ${chalk.blue(backend.name)}`
      );
      await runCommand("mkdir", ["-p", name]);

      await frontend.fn({
        projectName: `${name}/frontend`,
        framework: frontend.name,
        language,
        tools,
        license: "MIT",
      });

      await backend.fn({
        projectName: `${name}/backend`,
        backendLang: backend.name,
        license: "MIT",
      });
    } else if (frontend) {
      logger.info(`Frontend: ${chalk.green(frontend.name)}`);
      await frontend.fn({
        projectName: name,
        framework: frontend.name,
        language,
        tools,
        license: "MIT",
      });
    } else {
      logger.info(`Backend: ${chalk.blue(backend.name)}`);
      await backend.fn({
        projectName: name,
        backendLang: backend.name,
        license: "MIT",
      });
    }

    // Optional Docker
    if (opts.docker) {
      const stack = backend
        ? detectDockerStack(backend.name)
        : "Static (Nginx)";
      const targetDir = isFullstack ? `${name}/backend` : name;
      const templates = getDockerTemplate(stack);
      fs.writeFileSync(`${targetDir}/Dockerfile`, templates.dockerfile);
      fs.writeFileSync(`${targetDir}/docker-compose.yml`, templates.compose);
      fs.writeFileSync(`${targetDir}/.dockerignore`, templates.dockerignore);
      logger.success("Added Docker files");
    }

    // Optional CI
    if (opts.ci) {
      fs.mkdirSync(`${name}/.github/workflows`, { recursive: true });
      const ciTemplate = getCITemplate("GitHub Actions", {});
      fs.writeFileSync(`${name}/.github/workflows/ci.yml`, ciTemplate);
      logger.success("Added GitHub Actions CI");
    }

    // Post-creation (non-interactive — only do git if --git flag)
    await postCreate(name, { interactive: false, git: opts.git || false });

    console.log();
    logger.box(
      "Project Ready!",
      `${chalk.gray("$")} cd ${name}\n${chalk.gray("$")} npm install && npm run dev`,
      "green"
    );
  } catch (error) {
    logger.error(`Failed: ${error.message}`);
    if (process.env.DEBUG) console.error(error);
    process.exit(1);
  }
}

function detectDockerStack(backendName) {
  if (backendName.includes("Python") || backendName.includes("Django"))
    return "Python";
  if (backendName.includes("Go")) return "Go";
  if (backendName.includes("Bun") || backendName.includes("Hono")) return "Bun";
  return "Node.js";
}
