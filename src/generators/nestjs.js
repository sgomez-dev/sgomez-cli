import { runCommand } from "../utils/exec.js";

export async function generateNestJS(options) {
  const { projectName } = options;

  await runCommand("npm", ["install", "-g", "@nestjs/cli"]);
  await runCommand("nest", ["new", projectName, "--skip-install"]);

  await runCommand("npm", ["install"], { cwd: projectName });

  console.log(`NestJS project ${projectName} created successfully!`);
}