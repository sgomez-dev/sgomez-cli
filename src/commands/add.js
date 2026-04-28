import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";
import { detectProject } from "../utils/detect.js";
import { getDockerTemplate } from "../templates/docker.js";
import { getCITemplate } from "../templates/ci.js";
import { getLintTemplate } from "../templates/lint.js";
import { getComponentTemplate } from "../templates/component.js";
import { getGitignoreTemplate } from "../templates/gitignore.js";
import { getApiTemplate } from "../templates/api.js";
import { getAuthTemplate } from "../templates/auth.js";
import { getDbTemplate } from "../templates/db.js";
import { getTestTemplate } from "../templates/test.js";
import { getEnvTemplate } from "../templates/env.js";
import { getReadmeTemplate } from "../templates/readme.js";

const FEATURES = {
  docker: {
    label: "Docker",
    description: "Dockerfile + docker-compose.yml + .dockerignore",
  },
  ci: {
    label: "CI/CD",
    description: "GitHub Actions or GitLab CI workflow",
  },
  lint: {
    label: "Lint & Format",
    description: "ESLint + Prettier + EditorConfig",
  },
  component: {
    label: "Component",
    description: "Scaffold a React/Vue/Svelte component",
  },
  api: {
    label: "API Endpoint",
    description: "CRUD route for Express/Hono/FastAPI/Go",
  },
  auth: {
    label: "Authentication",
    description: "JWT or session auth middleware",
  },
  db: {
    label: "Database",
    description: "Prisma, Drizzle, SQLAlchemy, or Mongoose setup",
  },
  test: {
    label: "Testing",
    description: "Vitest, Jest, Playwright, or pytest config",
  },
  env: {
    label: "Environment",
    description: ".env + .env.example + validation (Zod)",
  },
  gitignore: {
    label: ".gitignore",
    description: "Smart multi-stack .gitignore",
  },
  readme: {
    label: "README",
    description: "Auto-generate README.md for this project",
  },
};

export async function runAdd(feature, name) {
  logger.banner();

  const project = detectProject();

  if (!feature) {
    const { selectedFeature } = await inquirer.prompt({
      type: "list",
      name: "selectedFeature",
      message: "What would you like to add?",
      choices: Object.entries(FEATURES).map(([key, val]) => ({
        name: `${val.label.padEnd(16)} ${chalk.gray(val.description)}`,
        value: key,
      })),
    });
    feature = selectedFeature;
  }

  const handlers = {
    docker: () => addDocker(project),
    ci: () => addCI(project),
    lint: () => addLint(project),
    component: () => addComponent(project, name),
    api: () => addApi(project, name),
    auth: () => addAuth(project),
    db: () => addDb(project),
    test: () => addTest(project),
    env: () => addEnv(project),
    gitignore: () => addGitignore(project),
    readme: () => addReadme(project),
  };

  if (!handlers[feature]) {
    logger.error(
      `Unknown feature: ${feature}\nAvailable: ${Object.keys(FEATURES).join(", ")}`
    );
    process.exit(1);
  }

  await handlers[feature]();
}

async function addDocker(project) {
  const { stack } = await inquirer.prompt({
    type: "list",
    name: "stack",
    message: "Select your stack:",
    choices: ["Node.js", "Python", "Go", "Bun", "Static (Nginx)"],
  });

  const templates = getDockerTemplate(stack, project);

  writeFile("Dockerfile", templates.dockerfile);
  writeFile("docker-compose.yml", templates.compose);
  writeFile(".dockerignore", templates.dockerignore);

  logger.box(
    "Docker Ready",
    `${chalk.gray("$")} docker compose up --build`,
    "cyan"
  );
}

async function addCI(project) {
  const { provider } = await inquirer.prompt({
    type: "list",
    name: "provider",
    message: "Select CI/CD provider:",
    choices: ["GitHub Actions", "GitLab CI"],
  });

  const template = getCITemplate(provider, project);

  if (provider === "GitHub Actions") {
    fs.mkdirSync(".github/workflows", { recursive: true });
    writeFile(".github/workflows/ci.yml", template);
  } else {
    writeFile(".gitlab-ci.yml", template);
  }
}

async function addLint(project) {
  const templates = getLintTemplate(project);

  writeFile(".eslintrc.json", templates.eslint);
  writeFile(".prettierrc", templates.prettier);
  writeFile(".editorconfig", templates.editorconfig);

  logger.box(
    "Lint Setup",
    `Install dependencies:\n${chalk.gray("$")} npm install -D ${templates.devDeps.join(" ")}`,
    "yellow"
  );
}

async function addComponent(project, name) {
  if (!name) {
    const answer = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Component name:",
      validate: (v) => (v.length > 0 ? true : "Name is required"),
    });
    name = answer.name;
  }

  const { framework } = await inquirer.prompt({
    type: "list",
    name: "framework",
    message: "Select framework:",
    choices: ["React (TSX)", "React (JSX)", "Vue 3", "Svelte"],
  });

  const template = getComponentTemplate(framework, name);
  const dir = path.join("src", "components");
  fs.mkdirSync(dir, { recursive: true });

  writeFile(path.join(dir, template.filename), template.content);

  if (template.styles) {
    writeFile(path.join(dir, template.stylesFilename), template.styles);
  }
}

async function addApi(project, name) {
  if (!name) {
    const answer = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Endpoint name (e.g., users, products):",
      validate: (v) => (v.length > 0 ? true : "Name is required"),
    });
    name = answer.name;
  }

  const { framework } = await inquirer.prompt({
    type: "list",
    name: "framework",
    message: "Select backend framework:",
    choices: ["Express", "Hono", "FastAPI", "Go (net/http)"],
  });

  const template = getApiTemplate(framework, name);
  fs.mkdirSync(template.dir, { recursive: true });
  writeFile(path.join(template.dir, template.filename), template.content);
}

async function addAuth(project) {
  const { strategy } = await inquirer.prompt({
    type: "list",
    name: "strategy",
    message: "Select auth strategy:",
    choices: [
      "JWT (Express)",
      "JWT (Hono)",
      "JWT (FastAPI)",
      "Session (Express)",
    ],
  });

  const template = getAuthTemplate(strategy);
  fs.mkdirSync(template.dir, { recursive: true });
  writeFile(path.join(template.dir, template.filename), template.content);

  if (template.deps.length > 0) {
    logger.box(
      "Auth Ready",
      `Install dependencies:\n${chalk.gray("$")} npm install ${template.deps.join(" ")}`,
      "green"
    );
  }
}

async function addDb(project) {
  const { orm } = await inquirer.prompt({
    type: "list",
    name: "orm",
    message: "Select ORM / database:",
    choices: [
      "Prisma (PostgreSQL)",
      "Drizzle (PostgreSQL)",
      "Mongoose (MongoDB)",
      "SQLAlchemy (Python)",
    ],
  });

  const template = getDbTemplate(orm);

  for (const file of template.files) {
    const dir = path.dirname(file.path);
    fs.mkdirSync(dir, { recursive: true });
    writeFile(file.path, file.content);
  }

  // Append to .env
  if (template.envLine) {
    appendToEnv(template.envLine);
  }

  const depsStr = template.deps.join(" ");
  const devDepsStr = template.devDeps ? template.devDeps.join(" ") : "";

  let installCmd = `${chalk.gray("$")} npm install ${depsStr}`;
  if (devDepsStr) installCmd += `\n${chalk.gray("$")} npm install -D ${devDepsStr}`;
  if (template.postInstall)
    installCmd += `\n${chalk.gray("$")} ${template.postInstall}`;

  logger.box("Database Ready", `Install dependencies:\n${installCmd}`, "blue");
}

async function addTest(project) {
  const { runner } = await inquirer.prompt({
    type: "list",
    name: "runner",
    message: "Select test runner:",
    choices: ["Vitest", "Jest", "Playwright", "pytest"],
  });

  const template = getTestTemplate(runner);

  if (template.configFile) {
    writeFile(template.configFile, template.configContent);
  }

  if (template.exampleFile) {
    const dir = path.dirname(template.exampleFile);
    fs.mkdirSync(dir, { recursive: true });
    writeFile(template.exampleFile, template.exampleContent);
  }

  const allDeps = [...(template.deps || []), ...(template.devDeps || [])];
  let msg = `Install:\n${chalk.gray("$")} npm install -D ${allDeps.join(" ")}`;

  if (template.scripts) {
    msg += `\n\nAdd to package.json scripts:`;
    for (const [key, val] of Object.entries(template.scripts)) {
      msg += `\n  "${key}": "${val}"`;
    }
  }

  if (template.postInstall) {
    msg += `\n\n${chalk.gray("$")} ${template.postInstall}`;
  }

  logger.box("Testing Ready", msg, "magenta");
}

async function addEnv(project) {
  const { stack } = await inquirer.prompt({
    type: "list",
    name: "stack",
    message: "Select your stack:",
    choices: ["node", "python", "go", "frontend"],
  });

  const template = getEnvTemplate(stack);

  writeFile(".env", template.env);
  writeFile(".env.example", template.envExample);

  if (stack === "node" || stack === "frontend") {
    const { addValidation } = await inquirer.prompt({
      type: "confirm",
      name: "addValidation",
      message: "Add Zod env validation?",
      default: true,
    });

    if (addValidation) {
      fs.mkdirSync("src", { recursive: true });
      writeFile("src/env.js", template.validation);
      logger.info(`Install zod: ${chalk.gray("npm install zod")}`);
    }
  }

  logger.success("Environment files created");
  logger.warn("Remember to add .env to .gitignore!");
}

async function addGitignore(project) {
  const { stack } = await inquirer.prompt({
    type: "checkbox",
    name: "stack",
    message: "Select technologies:",
    choices: [
      "Node.js",
      "Python",
      "Go",
      "Rust",
      "macOS",
      "Windows",
      "Linux",
      "JetBrains",
      "VS Code",
      "Environment files",
    ],
  });

  const template = getGitignoreTemplate(stack);
  writeFile(".gitignore", template);
}

async function addReadme(project) {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Project name:",
    default: path.basename(process.cwd()),
  });

  const { description } = await inquirer.prompt({
    type: "input",
    name: "description",
    message: "Short description:",
    default: "A modern web application.",
  });

  const template = getReadmeTemplate(project, { name, description });
  writeFile("README.md", template);
}

// -- Helpers --

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (dir !== ".") fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  logger.success(`Created ${filePath}`);
}

function appendToEnv(line) {
  const envPath = ".env";
  if (fs.existsSync(envPath)) {
    const existing = fs.readFileSync(envPath, "utf-8");
    if (!existing.includes(line)) {
      fs.appendFileSync(envPath, `\n${line}\n`);
      logger.success("Updated .env");
    }
  } else {
    fs.writeFileSync(envPath, `${line}\n`);
    logger.success("Created .env");
  }
}
