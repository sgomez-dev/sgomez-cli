import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateNode(options) {
  const { projectName } = options;

  const spinner = logger.spinner("Creating Node.js + Express project...");

  fs.mkdirSync(path.join(projectName, "src"), { recursive: true });

  // Initialize package.json
  await runCommand("npm", ["init", "-y"], { cwd: projectName });

  // Set type: module in package.json
  const pkgPath = path.join(projectName, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.type = "module";
  pkg.scripts = {
    dev: "node --watch src/server.js",
    start: "node src/server.js",
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // Install Express
  await runCommand("npm", ["install", "express", "cors"], { cwd: projectName });

  const serverCode = `import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from ${projectName}!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`;

  const readmeContent = `# ${projectName}

A Node.js + Express project created with **SGOMEZ CLI**.

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Scripts

- \`npm run dev\` — Start with file watching (Node 22+)
- \`npm start\` — Start production server

## Endpoints

- \`GET /\` — Hello endpoint
- \`GET /health\` — Health check
`;

  const gitignoreContent = `node_modules/
.env
.env.*
!.env.example
*.log
dist/
.DS_Store
`;

  fs.writeFileSync(path.join(projectName, "src", "server.js"), serverCode);
  fs.writeFileSync(path.join(projectName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(projectName, ".gitignore"), gitignoreContent);

  spinner.succeed("Node.js + Express project created");
  logger.success(`Project '${projectName}' created successfully.`);
}
