import { runCommand } from "../utils/exec.js";
import logger from "../utils/logger.js";

export async function generateNextJs(options) {
  const { projectName, language, tools } = options;

  const args = ["create-next-app@latest", projectName, "--use-npm"];

  if (language === "TypeScript") {
    args.push("--ts");
  } else {
    args.push("--js");
  }

  if (tools?.includes("TailwindCSS")) {
    args.push("--tailwind");
  } else {
    args.push("--no-tailwind");
  }

  args.push("--yes", "--eslint", "--app", "--no-src-dir", "--import-alias", "@/*");

  const spinner = logger.spinner("Creating Next.js project...");
  await runCommand("npx", args);
  spinner.succeed("Next.js project created");

  if (tools?.includes("Framer Motion")) {
    const motionSpinner = logger.spinner("Installing Framer Motion...");
    await runCommand("npm", ["install", "framer-motion"], {
      cwd: projectName,
    });
    motionSpinner.succeed("Framer Motion installed");
  }

  logger.success(`Next.js project '${projectName}' created successfully.`);
}
