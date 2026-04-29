import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateSvelteKit(options) {
  const { projectName, language, tools } = options;

  const args = ["sv", "create", projectName, "--template", "minimal"];

  if (language === "TypeScript") {
    args.push("--types", "ts");
  } else {
    args.push("--no-types");
  }

  args.push("--no-add-ons", "--no-install", "--yes");

  const spinner = logger.spinner("Creating SvelteKit project...");
  await runCommand("npx", args);
  spinner.succeed("SvelteKit project created");

  const installSpinner = logger.spinner("Installing dependencies...");
  await runCommand("npm", ["install"], { cwd: projectName });
  installSpinner.succeed("Dependencies installed");

  if (tools?.includes("TailwindCSS")) {
    const tailwindSpinner = logger.spinner("Setting up TailwindCSS...");
    await runCommand("npx", ["sv", "add", "tailwindcss", "--no-install"], {
      cwd: projectName,
    });
    await runCommand("npm", ["install"], { cwd: projectName });
    tailwindSpinner.succeed("TailwindCSS configured");
  }

  logger.success(`SvelteKit project '${projectName}' created successfully.`);
}
