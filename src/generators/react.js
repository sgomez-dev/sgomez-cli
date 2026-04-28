import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateReact(options) {
  const { projectName, language, tools } = options;

  const isTS = language === "TypeScript";
  const templateFlag = isTS ? "react-ts" : "react";

  const spinner = logger.spinner("Creating React (Vite) project...");
  await runCommand("npm", [
    "create",
    "vite@latest",
    projectName,
    "--",
    "--template",
    templateFlag,
  ]);
  spinner.succeed("React (Vite) project created");

  if (tools?.includes("TailwindCSS")) {
    const tailwindSpinner = logger.spinner("Setting up TailwindCSS...");
    await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
      cwd: projectName,
    });

    const cssPath = path.join(projectName, "src", "index.css");
    fs.writeFileSync(cssPath, `@import "tailwindcss";\n`);

    const ext = isTS ? "ts" : "js";
    const viteConfigPath = path.join(projectName, `vite.config.${ext}`);
    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
`;
    fs.writeFileSync(viteConfigPath, viteConfigContent);
    tailwindSpinner.succeed("TailwindCSS configured");
  }

  if (tools?.includes("Framer Motion")) {
    const motionSpinner = logger.spinner("Installing Framer Motion...");
    await runCommand("npm", ["install", "framer-motion"], {
      cwd: projectName,
    });
    motionSpinner.succeed("Framer Motion installed");
  }

  logger.success(`React (Vite) project '${projectName}' created successfully.`);
}
