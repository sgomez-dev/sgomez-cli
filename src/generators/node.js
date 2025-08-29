import { runCommand } from "../utils/exec.js";
import fs from "fs";

export async function generateNode(options) {
  const { projectName } = options;

  await runCommand("mkdir", [projectName]);
  await runCommand("npm", ["init", "-y"], { cwd: projectName });
  await runCommand("npm", ["install", "express"], { cwd: projectName });

  // Crear archivo server.js básico
  const serverCode = `import express from 'express';
    const app = express();
    const PORT = 3000;

    app.get('/', (req, res) => res.send('Hello World!'));

    app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));
    `;

  fs.writeFileSync(`${projectName}/index.js`, serverCode);

  console.log(`Node.js + Express project ${projectName} created successfully!`);
}