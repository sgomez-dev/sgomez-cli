import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateRemix(options) {
  const { projectName, tools } = options;

  const spinner = logger.spinner("Creating Remix project...");
  await runCommand("npx", [
    "create-remix@latest",
    projectName,
    "--no-install",
    "--no-git-init",
  ]);

  const installSpinner = logger.spinner("Installing dependencies...");
  await runCommand("npm", ["install"], { cwd: projectName });
  installSpinner.succeed("Dependencies installed");
  spinner.succeed("Remix project created");

  if (tools?.includes("TailwindCSS")) {
    const tailwindSpinner = logger.spinner("Setting up TailwindCSS...");
    await runCommand(
      "npm",
      ["install", "-D", "tailwindcss", "@tailwindcss/vite"],
      { cwd: projectName }
    );
    tailwindSpinner.succeed("TailwindCSS configured");
  }

  logger.success(`Remix project '${projectName}' created successfully.`);
}
