import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateHono(options) {
  const { projectName } = options;

  const spinner = logger.spinner("Setting up Hono + Bun project...");

  fs.mkdirSync(path.join(projectName, "src"), { recursive: true });

  const pkgContent = {
    name: projectName,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "bun run --hot src/index.ts",
      start: "bun run src/index.ts",
    },
    dependencies: {
      hono: "latest",
    },
    devDependencies: {
      "@types/bun": "latest",
    },
  };

  fs.writeFileSync(
    path.join(projectName, "package.json"),
    JSON.stringify(pkgContent, null, 2)
  );

  const indexContent = `import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.json({ message: "Hello from ${projectName}!" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
`;

  const tsconfigContent = {
    compilerOptions: {
      strict: true,
      jsx: "react-jsx",
      jsxImportSource: "hono/jsx",
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "bundler",
      types: ["bun"],
    },
  };

  const readmeContent = `# ${projectName}

A Hono + Bun project created with **SGOMEZ CLI**.

## Setup

\`\`\`bash
bun install
bun run dev
\`\`\`

Open http://localhost:3000

## Scripts

- \`bun run dev\` — Start dev server with hot reload
- \`bun run start\` — Start production server
`;

  const gitignoreContent = `node_modules/
.env
.env.*
!.env.example
*.log
.DS_Store
`;

  fs.writeFileSync(path.join(projectName, "src", "index.ts"), indexContent);
  fs.writeFileSync(
    path.join(projectName, "tsconfig.json"),
    JSON.stringify(tsconfigContent, null, 2)
  );
  fs.writeFileSync(path.join(projectName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(projectName, ".gitignore"), gitignoreContent);

  spinner.succeed("Hono project scaffolded");

  // Install dependencies
  const installSpinner = logger.spinner("Installing dependencies...");
  try {
    await runCommand("bun", ["install"], { cwd: projectName });
    installSpinner.succeed("Dependencies installed with Bun");
  } catch {
    try {
      await runCommand("npm", ["install"], { cwd: projectName });
      installSpinner.succeed("Dependencies installed with npm (Bun not found)");
    } catch (err) {
      installSpinner.fail("Could not install dependencies");
      logger.warn("Run 'bun install' or 'npm install' manually in the project.");
    }
  }

  logger.success(`Hono + Bun project '${projectName}' created successfully.`);
}
