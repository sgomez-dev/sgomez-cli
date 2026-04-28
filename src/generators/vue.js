import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateVue(options) {
  const { projectName, language, tools } = options;
  const isTS = language === "TypeScript";

  const templateFlag = isTS ? "vue-ts" : "vue";

  const spinner = logger.spinner("Creating Vue 3 (Vite) project...");
  await runCommand("npm", [
    "create",
    "vite@latest",
    projectName,
    "--",
    "--template",
    templateFlag,
  ]);
  spinner.succeed("Vue 3 project created");

  if (tools?.includes("TailwindCSS")) {
    const tailwindSpinner = logger.spinner("Setting up TailwindCSS...");
    await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/vite"], {
      cwd: projectName,
    });

    fs.writeFileSync(
      path.join(projectName, "src", "style.css"),
      `@import "tailwindcss";\n`
    );

    const ext = isTS ? "ts" : "js";
    const viteConfigContent = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
`;
    fs.writeFileSync(
      path.join(projectName, `vite.config.${ext}`),
      viteConfigContent
    );
    tailwindSpinner.succeed("TailwindCSS configured");
  }

  if (tools?.includes("Pinia")) {
    const piniaSpinner = logger.spinner("Installing Pinia...");
    await runCommand("npm", ["install", "pinia"], { cwd: projectName });
    piniaSpinner.succeed("Pinia installed");
  }

  if (tools?.includes("Vue Router")) {
    const routerSpinner = logger.spinner("Installing Vue Router...");
    await runCommand("npm", ["install", "vue-router@4"], { cwd: projectName });
    routerSpinner.succeed("Vue Router installed");
  }

  logger.success(`Vue 3 project '${projectName}' created successfully.`);
}
