import chalk from "chalk";
import { execa } from "execa";
import logger from "../utils/logger.js";

const TOOLS = [
  { name: "Node.js", cmd: "node", args: ["--version"], required: true },
  { name: "npm", cmd: "npm", args: ["--version"], required: true },
  { name: "pnpm", cmd: "pnpm", args: ["--version"] },
  { name: "Bun", cmd: "bun", args: ["--version"] },
  { name: "Deno", cmd: "deno", args: ["--version"] },
  { name: "Git", cmd: "git", args: ["--version"], required: true },
  { name: "Python 3", cmd: "python3", args: ["--version"] },
  { name: "Go", cmd: "go", args: ["version"] },
  { name: "Rust (cargo)", cmd: "cargo", args: ["--version"] },
  { name: "Docker", cmd: "docker", args: ["--version"] },
  { name: "Docker Compose", cmd: "docker", args: ["compose", "version"] },
  { name: "Angular CLI", cmd: "ng", args: ["version"] },
  { name: "NestJS CLI", cmd: "nest", args: ["--version"] },
];

export async function runDoctor() {
  logger.banner();

  let installed = 0;
  let missing = 0;
  let requiredMissing = false;

  for (const tool of TOOLS) {
    try {
      const result = await execa(tool.cmd, tool.args, { timeout: 5000 });
      const version = result.stdout.trim().split("\n")[0];
      console.log(
        `  ${chalk.green("✓")} ${chalk.bold(tool.name.padEnd(18))} ${chalk.gray(version)}`
      );
      installed++;
    } catch {
      if (tool.required) {
        console.log(
          `  ${chalk.red("✗")} ${chalk.bold(tool.name.padEnd(18))} ${chalk.red("MISSING (required)")}`
        );
        requiredMissing = true;
        missing++;
      } else {
        console.log(
          `  ${chalk.yellow("○")} ${chalk.bold(tool.name.padEnd(18))} ${chalk.dim("not installed")}`
        );
        missing++;
      }
    }
  }

  console.log();
  console.log(
    `  ${chalk.bold("Summary:")} ${chalk.green(`${installed} installed`)} · ${chalk.yellow(`${missing} missing`)}`
  );

  if (requiredMissing) {
    logger.box(
      "Action Required",
      "Some required tools are missing.\nInstall them before using sgomez init.",
      "red"
    );
  } else {
    logger.box(
      "All Good!",
      "All required tools are installed. You're ready to go.",
      "green"
    );
  }
}
