import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateNestJs(options) {
  const { projectName } = options;

  const spinner = logger.spinner("Creating NestJS project...");
  await runCommand("npx", [
    "@nestjs/cli",
    "new",
    projectName,
    "--package-manager",
    "npm",
    "--skip-git",
    "--strict",
  ]);
  spinner.succeed("NestJS project created");

  logger.success(`NestJS project '${projectName}' created successfully.`);
}
