import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateNuxt(options) {
  const { projectName, tools } = options;

  const spinner = logger.spinner("Creating Nuxt 3 project...");
  await runCommand("npx", [
    "nuxi@latest",
    "init",
    projectName,
    "--no-install",
    "--gitInit",
    "false",
  ]);
  spinner.succeed("Nuxt 3 project created");

  const installSpinner = logger.spinner("Installing dependencies...");
  await runCommand("npm", ["install"], { cwd: projectName });
  installSpinner.succeed("Dependencies installed");

  if (tools?.includes("TailwindCSS")) {
    const tailwindSpinner = logger.spinner("Setting up TailwindCSS...");
    await runCommand("npx", ["nuxi", "module", "add", "@nuxtjs/tailwindcss"], {
      cwd: projectName,
    });
    tailwindSpinner.succeed("TailwindCSS configured");
  }

  if (tools?.includes("Pinia")) {
    const piniaSpinner = logger.spinner("Installing Pinia...");
    await runCommand("npx", ["nuxi", "module", "add", "@pinia/nuxt"], {
      cwd: projectName,
    });
    piniaSpinner.succeed("Pinia installed");
  }

  logger.success(`Nuxt 3 project '${projectName}' created successfully.`);
}
