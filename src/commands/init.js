import chalk from "chalk";
import { askFrontend } from "../prompts/frontend.js";
import { askBackend } from "../prompts/backend.js";
import { askCommon } from "../prompts/common.js";

import { generateReact } from "../generators/react.js";
import { generateNextJs } from "../generators/nextjs.js";
import { generateAngular } from "../generators/angular.js";
import { generateVue } from "../generators/vue.js";
import { generateNuxt } from "../generators/nuxt.js";
import { generateSvelteKit } from "../generators/sveltekit.js";
import { generateAstro } from "../generators/astro.js";
import { generateRemix } from "../generators/remix.js";
import { generateNode } from "../generators/node.js";
import { generateNestJs } from "../generators/nestjs.js";
import { generateDjango } from "../generators/django.js";
import { generateGo } from "../generators/go.js";
import { generateFastAPI } from "../generators/fastapi.js";
import { generateHono } from "../generators/hono.js";

import logger from "../utils/logger.js";
import { runCommand } from "../utils/exec.js";
import { postCreate } from "../utils/post-create.js";
import fs from "fs";

const FRONTEND_GENERATORS = {
  "React (Vite)": generateReact,
  "Next.js": generateNextJs,
  "Vue 3 (Vite)": generateVue,
  "Nuxt 3": generateNuxt,
  SvelteKit: generateSvelteKit,
  Astro: generateAstro,
  Remix: generateRemix,
  Angular: generateAngular,
};

const BACKEND_GENERATORS = {
  "Node.js + Express": generateNode,
  NestJS: generateNestJs,
  "Hono (Bun)": generateHono,
  "FastAPI (Python)": generateFastAPI,
  Django: generateDjango,
  Go: generateGo,
};

export async function runInit() {
  try {
    logger.banner();

    const frontendOptions = await askFrontend();
    const backendOptions = await askBackend();
    const commonOptions = await askCommon();

    const hasFrontend = frontendOptions && frontendOptions.framework;
    const hasBackend = backendOptions && backendOptions.backendLang;
    const isFullstack = hasFrontend && hasBackend;

    if (!hasFrontend && !hasBackend) {
      logger.error(
        "You must select at least a frontend or a backend framework."
      );
      process.exit(1);
    }

    const { projectName } = commonOptions;

    if (isFullstack) {
      logger.info("Creating fullstack project structure...");
      await runCommand("mkdir", ["-p", projectName]);

      const mainReadmeContent = `# ${projectName}

A fullstack project created with **SGOMEZ CLI**.

## Project Structure

\`\`\`
${projectName}/
├── frontend/    # ${frontendOptions.framework}
├── backend/     # ${backendOptions.backendLang}
└── README.md
\`\`\`

## Getting Started

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Backend
\`\`\`bash
cd backend
# Follow backend-specific instructions in backend/README.md
\`\`\`
`;
      fs.writeFileSync(`${projectName}/README.md`, mainReadmeContent);
    }

    // Generate frontend
    if (hasFrontend) {
      const frontendProjectName = isFullstack
        ? `${projectName}/frontend`
        : projectName;
      const frontendConfig = {
        ...frontendOptions,
        ...commonOptions,
        projectName: frontendProjectName,
      };

      const generator = FRONTEND_GENERATORS[frontendOptions.framework];
      if (generator) await generator(frontendConfig);
    }

    // Generate backend
    if (hasBackend) {
      const backendProjectName = isFullstack
        ? `${projectName}/backend`
        : projectName;
      const backendConfig = {
        ...backendOptions,
        ...commonOptions,
        projectName: backendProjectName,
      };

      const generator = BACKEND_GENERATORS[backendOptions.backendLang];
      if (generator) await generator(backendConfig);
    }

    // Post-creation hooks (interactive mode)
    await postCreate(projectName, { interactive: true });

    // Final message
    if (isFullstack) {
      logger.box(
        `${projectName} — Fullstack Project Created!`,
        `${chalk.cyan(projectName)}/
  ├── ${chalk.green("frontend/")}  ${chalk.gray(frontendOptions.framework)}
  └── ${chalk.blue("backend/")}   ${chalk.gray(backendOptions.backendLang)}

${chalk.bold("Next steps:")}
  ${chalk.gray("$")} cd ${projectName}
  ${chalk.gray("$")} cd frontend && npm install && npm run dev
  ${chalk.gray("$")} cd ../backend — see backend/README.md`,
        "green"
      );
    } else {
      logger.box(
        `${projectName} — Project Created!`,
        `${chalk.bold("Next steps:")}\n  ${chalk.gray("$")} cd ${projectName}\n  ${chalk.gray("$")} npm install && npm run dev`,
        "green"
      );
    }
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    if (process.env.DEBUG) console.error(error);
    process.exit(1);
  }
}
